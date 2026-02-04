import mammoth from "mammoth";
import { extractText } from "unpdf";
import fs from "fs/promises";
import { SupportedFileType } from "../file-storage/types";

const parsePdf = async (filePath: string): Promise<string> => {
  try {
    const buffer = await fs.readFile(filePath);
    const uint8Array = new Uint8Array(buffer);
    const { text } = await extractText(uint8Array);

    return Array.isArray(text) ? text.join("\n") : text || "";
  } catch (error) {
    throw new Error(
      `Failed to parse PDF: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};

const parseDocx = async (filePath: string): Promise<string> => {
  try {
    const result = await mammoth.extractRawText({ path: filePath });

    return result.value || "";
  } catch (error) {
    throw new Error(
      `Failed to parse DOCX: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};

export const parseDocument = async (
  filePath: string,
  fileType: SupportedFileType
): Promise<string> => {
  switch (fileType) {
    case "pdf":
      return parsePdf(filePath);
    case "docx":
      return parseDocx(filePath);
    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }
};
