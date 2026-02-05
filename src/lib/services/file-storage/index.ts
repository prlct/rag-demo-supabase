import { FileStorageProvider } from "./types";
import { LocalFileStorage } from "./local-storage";
import { SupabaseStorage } from "./supabase-storage";

export * from "./types";
export * from "./local-storage";
export * from "./supabase-storage";

export type StorageType = "local" | "supabase";

export const createFileStorage = (type?: StorageType): FileStorageProvider => {
  const storageType = type || (process.env.FILE_STORAGE_TYPE as StorageType) || "supabase";
  
  switch (storageType) {
    case "supabase":
      return new SupabaseStorage();
    case "local":
    default:
      return new LocalFileStorage();
  }
};

let fileStorageInstance: FileStorageProvider | null = null;

export const getFileStorage = (): FileStorageProvider => {
  if (!fileStorageInstance) {
    fileStorageInstance = createFileStorage();
  }
  
  return fileStorageInstance;
};
