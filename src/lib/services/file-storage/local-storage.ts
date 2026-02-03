import fs from "fs/promises";
import path from "path";
import { FileStorageProvider } from "./types";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

export class LocalFileStorage implements FileStorageProvider {
  private async ensureDir(): Promise<void> {
    try {
      await fs.access(UPLOAD_DIR);
    } catch {
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
    }
  }

  private getFilePath(fileId: string): string {
    return path.join(UPLOAD_DIR, fileId);
  }

  async save(fileId: string, buffer: Buffer, _originalName: string): Promise<string> {
    await this.ensureDir();
    const filePath = this.getFilePath(fileId);
    await fs.writeFile(filePath, buffer);
    return filePath;
  }

  async get(fileId: string): Promise<Buffer | null> {
    try {
      const filePath = this.getFilePath(fileId);
      return await fs.readFile(filePath);
    } catch {
      return null;
    }
  }

  async delete(fileId: string): Promise<void> {
    try {
      const filePath = this.getFilePath(fileId);
      await fs.unlink(filePath);
    } catch {
      // File might not exist, ignore error
    }
  }

  async exists(fileId: string): Promise<boolean> {
    try {
      const filePath = this.getFilePath(fileId);
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}
