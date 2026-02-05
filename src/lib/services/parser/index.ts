import mammoth from "mammoth";
import { extractText } from "unpdf";
import { SupportedFileType } from "../file-storage/types";

const parsePdf = async (buffer: Buffer): Promise<string> => {
  try {
    const uint8Array = new Uint8Array(buffer);
    const { text } = await extractText(uint8Array);

    return Array.isArray(text) ? text.join("\n") : text || "";
  } catch (error) {
    throw new Error(
      `Failed to parse PDF: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};

const parseDocx = async (buffer: Buffer): Promise<string> => {
  try {
    const result = await mammoth.extractRawText({ buffer });

    return result.value || "";
  } catch (error) {
    throw new Error(
      `Failed to parse DOCX: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};

export const parseDocument = async (
  buffer: Buffer,
  fileType: SupportedFileType
): Promise<string> => {
  switch (fileType) {
    case "pdf":
      return parsePdf(buffer);
    case "docx":
      return parseDocx(buffer);
    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }
};
