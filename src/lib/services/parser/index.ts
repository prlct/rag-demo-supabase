import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
import { SupportedFileType } from "../file-storage/types";

const parsePdf = async (buffer: Buffer): Promise<string> => {
   const parser = new PDFParse(buffer);
   const result = await parser.getText();

   return result.text || '';
};

const parseDocx = async (buffer: Buffer): Promise<string> => {
  const result = await mammoth.extractRawText({ buffer });

  return result.value;
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
