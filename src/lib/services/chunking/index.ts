export interface Chunk {
  index: number;
  text: string;
}

export interface ChunkingOptions {
  chunkSize?: number;
  chunkOverlap?: number;
}

const DEFAULT_CHUNK_SIZE = 1000;
const DEFAULT_CHUNK_OVERLAP = 200;

export const chunkText = (
  text: string,
  options: ChunkingOptions = {}
): Chunk[] => {
  const { 
    chunkSize = DEFAULT_CHUNK_SIZE, 
    chunkOverlap = DEFAULT_CHUNK_OVERLAP 
  } = options;

  const normalizedText = text
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (normalizedText.length === 0) {
    return [];
  }

  if (normalizedText.length <= chunkSize) {
    return [{ index: 0, text: normalizedText }];
  }

  const chunks: Chunk[] = [];
  let start = 0;
  let index = 0;

  while (start < normalizedText.length) {
    let end = start + chunkSize;

    if (end < normalizedText.length) {
      const paragraphBreak = normalizedText.lastIndexOf("\n\n", end);

      if (paragraphBreak > start + chunkSize / 2) {
        end = paragraphBreak;
      } else {
        const sentenceBreak = Math.max(
          normalizedText.lastIndexOf(". ", end),
          normalizedText.lastIndexOf("! ", end),
          normalizedText.lastIndexOf("? ", end)
        );

        if (sentenceBreak > start + chunkSize / 2) {
          end = sentenceBreak + 1;
        }
      }
    }

    const chunkText = normalizedText.slice(start, end).trim();
    if (chunkText.length > 0) {
      chunks.push({ index, text: chunkText });
      index++;
    }

    start = end - chunkOverlap;
    
    if (start >= normalizedText.length - chunkOverlap) {
      break;
    }
  }

  return chunks;
};
