import { NextResponse } from "next/server";
import { getFileStorage } from "@/lib/services/file-storage";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { error: fileError } = await supabase
      .from("files")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    if (fileError) {
      throw fileError;
    }

    await supabase
      .from("chunks")
      .update({ deleted_at: new Date().toISOString() })
      .eq("file_id", id);

    const storage = getFileStorage();
    await storage.delete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete file error:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
