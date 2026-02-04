import { embed, embedMany } from "ai";
import { google } from "@ai-sdk/google";

const model = google.embedding("text-embedding-004");

export async function getEmbedding(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model,
    value: text,
  });

  return embedding;
}

export async function getEmbeddings(texts: string[]): Promise<number[][]> {
  const { embeddings } = await embedMany({
    model,
    values: texts,
  });

  return embeddings;
}
