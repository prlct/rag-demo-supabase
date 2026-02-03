import { FileStorageProvider } from "./types";
import { LocalFileStorage } from "./local-storage";

export * from "./types";
export * from "./local-storage";

export const createFileStorage = (): FileStorageProvider => {
  return new LocalFileStorage();
};

let fileStorageInstance: FileStorageProvider | null = null;

export const getFileStorage = (): FileStorageProvider => {
  if (!fileStorageInstance) {
    fileStorageInstance = createFileStorage();
  }
  
  return fileStorageInstance;
};
