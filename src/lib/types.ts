export const FILE_STATUS = {
  PROCESSING: "processing",
  READY: "ready",
  ERROR: "error",
} as const;

export type FileStatus = (typeof FILE_STATUS)[keyof typeof FILE_STATUS];

export interface MessagePart {
  type: string;
  text?: string;
}

export function extractTextFromParts(parts: MessagePart[]): string {
  return parts
    .filter((part) => part.type === "text")
    .map((part) => part.text || "")
    .join(" ");
}
