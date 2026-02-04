import { streamText, createUIMessageStreamResponse } from "ai";
import { google } from "@ai-sdk/google";
import { createClient } from "@/lib/supabase/server";
import { getEmbedding } from "@/lib/services/embeddings";

export async function POST(req: Request) {
  const { messages, selectedFileIds } = await req.json();

  const lastUserMessage = messages
    .filter((m: { role: string }) => m.role === "user")
    .pop();

  if (!lastUserMessage) {
    return new Response("No user message found", { status: 400 });
  }

  let userQuestion = "";
  if (typeof lastUserMessage.content === "string") {
    userQuestion = lastUserMessage.content;
  } else if (Array.isArray(lastUserMessage.parts)) {
    userQuestion = lastUserMessage.parts
      .filter((part: { type: string }) => part.type === "text")
      .map((part: { text: string }) => part.text)
      .join(" ");
  } else if (Array.isArray(lastUserMessage.content)) {
    userQuestion = lastUserMessage.content
      .filter((part: { type: string }) => part.type === "text")
      .map((part: { text: string }) => part.text)
      .join(" ");
  }

  const queryEmbedding = await getEmbedding(userQuestion);

  const supabase = await createClient();
  const { data: relevantChunks, error } = await supabase.rpc("match_chunks", {
    query_embedding: queryEmbedding,
    match_threshold: 0.5,
    match_count: 5,
    file_ids: selectedFileIds?.length ? selectedFileIds : null,
  });

  if (error) {
    console.error("Error searching chunks:", error);
    return new Response("Error searching documents", { status: 500 });
  }

  const chunksText =
    relevantChunks && relevantChunks.length > 0
      ? relevantChunks.map((chunk: { text: string }) => chunk.text).join("\n\n---\n\n")
      : "";

  if (!chunksText) {
    const noInfoResult = streamText({
      model: google("gemini-2.5-flash"),
      prompt: "Respond with exactly: I don't have enough information in the documents.",
    });
    return createUIMessageStreamResponse({
      stream: noInfoResult.toUIMessageStream(),
    });
  }

const ragPrompt = `
You are a question-answering assistant.

You MUST answer the user's question using ONLY the information explicitly present in the Context section.

STRICT RULES:
- If the Context is empty, irrelevant, or does NOT contain the answer, you MUST respond with exactly:
"I don't have enough information in the documents."
- Do NOT use general knowledge.
- Do NOT infer or assume.
- Do NOT rely on the conversation history for factual answers.
- If you break these rules, your answer is incorrect.
- You are NOT allowed to answer partially.
- You are NOT allowed to rephrase or summarize if the exact answer is not present.

Context:
---
${chunksText}
---

User question: ${userQuestion}
`;

  const result = streamText({
    model: google("gemini-2.5-flash"),
    prompt: ragPrompt,
  });

  return createUIMessageStreamResponse({
    stream: result.toUIMessageStream(),
  });
}
