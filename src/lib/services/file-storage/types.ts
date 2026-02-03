export interface FileStorageProvider {
  save(fileId: string, buffer: Buffer, originalName: string): Promise<string>;

  get(fileId: string): Promise<Buffer | null>;

  delete(fileId: string): Promise<void>;

  exists(fileId: string): Promise<boolean>;
}

export type SupportedFileType = "pdf" | "docx";

export const SUPPORTED_MIME_TYPES: Record<SupportedFileType, string> = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

export const getFileType = (mimeType: string): SupportedFileType | null => {
  for (const [type, mime] of Object.entries(SUPPORTED_MIME_TYPES)) {
    if (mime === mimeType) {
      return type as SupportedFileType;
    }
  }
  return null;
};
