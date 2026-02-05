import { createClient } from "@supabase/supabase-js";
import { FileStorageProvider } from "./types";

const BUCKET_NAME = "documents";

export class SupabaseStorage implements FileStorageProvider {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }

  async save(fileId: string, buffer: Buffer, originalName: string): Promise<string> {
    const ext = originalName.split(".").pop() || "";
    const filePath = `${fileId}.${ext}`;

    const { error } = await this.supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: this.getContentType(ext),
        upsert: true,
      });

    if (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    return filePath;
  }

  async get(fileId: string): Promise<Buffer | null> {
    for (const ext of ["pdf", "docx"]) {
      const filePath = `${fileId}.${ext}`;
      
      const { data, error } = await this.supabase.storage
        .from(BUCKET_NAME)
        .download(filePath);

      if (!error && data) {
        const arrayBuffer = await data.arrayBuffer();
        return Buffer.from(arrayBuffer);
      }
    }

    return null;
  }

  async delete(fileId: string): Promise<void> {
    const filesToDelete = [`${fileId}.pdf`, `${fileId}.docx`];
    
    await this.supabase.storage
      .from(BUCKET_NAME)
      .remove(filesToDelete);
  }

  async exists(fileId: string): Promise<boolean> {
    for (const ext of ["pdf", "docx"]) {
      const filePath = `${fileId}.${ext}`;
      
      const { data } = await this.supabase.storage
        .from(BUCKET_NAME)
        .list("", { search: filePath });

      if (data && data.length > 0) {
        return true;
      }
    }

    return false;
  }

  private getContentType(ext: string): string {
    const contentTypes: Record<string, string> = {
      pdf: "application/pdf",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    };
    return contentTypes[ext] || "application/octet-stream";
  }
}
