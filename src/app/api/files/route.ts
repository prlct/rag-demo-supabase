import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getFileStorage, getFileType, SUPPORTED_MIME_TYPES } from "@/lib/services/file-storage";
import { parseDocument } from "@/lib/services/parser";
import { chunkText } from "@/lib/services/chunking";
import { getEmbeddings } from "@/lib/services/embeddings";
import { createClient } from "@/lib/supabase/server";
import { FILE_STATUS } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const fileType = getFileType(file.type);
    if (!fileType) {
      return NextResponse.json(
        { 
          error: "Unsupported file type", 
          supported: Object.values(SUPPORTED_MIME_TYPES) 
        },
        { status: 400 }
      );
    }

    const fileId = uuidv4();
    const buffer = Buffer.from(await file.arrayBuffer());

    const storage = getFileStorage();
    await storage.save(fileId, buffer, file.name);

    const supabase = await createClient();
    const { error: insertError } = await supabase
      .from("files")
      .insert({
        id: fileId,
        original_name: file.name,
        status: FILE_STATUS.PROCESSING,
        uploaded_at: new Date().toISOString(),
      });

    if (insertError) {
      await storage.delete(fileId);
      throw insertError;
    }

    const text = await parseDocument(buffer, fileType);

    const chunks = chunkText(text);

    const chunkTexts = chunks.map((c) => c.text);
    const embeddings = await getEmbeddings(chunkTexts);

    if (chunks.length > 0) {
      const { error: chunksError } = await supabase
        .from("chunks")
        .insert(
          chunks.map((chunk, index) => ({
            id: uuidv4(),
            file_id: fileId,
            chunk_index: chunk.index,
            text: chunk.text,
            embedding: embeddings[index],
          }))
        );

      if (chunksError) {
        throw chunksError;
      }
    }

    await supabase
      .from("files")
      .update({ status: FILE_STATUS.READY })
      .eq("id", fileId);

    return NextResponse.json({
      id: fileId,
      name: file.name,
      chunksCount: chunks.length,
      status: FILE_STATUS.READY,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: files, error } = await supabase
      .from("files")
      .select("id, original_name, status, uploaded_at")
      .is("deleted_at", null)
      .order("uploaded_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ files: files || [] });
  } catch (error) {
    console.error("Get files error:", error);
    return NextResponse.json(
      { error: "Failed to get files", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
