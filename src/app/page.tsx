"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { FilesLibrary } from "@/components/files/files-library";
import { ChatBox } from "@/components/chat/chat-box";
import { useFiles } from "@/hooks/use-files";

const chatTransport = new DefaultChatTransport({
  api: "/api/chat",
});

export default function Home() {
  const { files, isLoading: isFilesLoading, uploadFile, deleteFile } = useFiles();
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat({
    transport: chatTransport,
  });

  const isChatLoading = status === "streaming" || status === "submitted";

  const handleSubmit = async () => {
    if (!input.trim() || isChatLoading) return;
    const text = input;
    setInput("");
    await sendMessage({ text });
  };

  const handleDeleteFile = async (id: string) => {
    await deleteFile(id);
    
    setSelectedFiles((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleSelectFile = (id: string, selected: boolean) => {
    setSelectedFiles((prev) => {
      const next = new Set(prev);
      if (selected) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedFiles(new Set(files.map((f) => f.id)));
    } else {
      setSelectedFiles(new Set());
    }
  };

  const fileItems = files.map((f) => ({
    id: f.id,
    name: f.name,
    uploadedAt: f.uploadedAt,
    status: f.status,
  }));

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="flex-shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center px-4">
          <h1 className="text-xl font-semibold">RAG Demo</h1>
          
          <p className="ml-4 text-sm text-muted-foreground hidden sm:block">
            Chat with your documents using AI
          </p>
        </div>
      </header>

      <main className="flex-1 container px-4 py-4 overflow-hidden mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-[450px_1fr] gap-4 h-full mx-auto">
          <div className="h-full min-h-0 order-2 lg:order-1">
            <FilesLibrary
              files={fileItems}
              selectedFiles={selectedFiles}
              isLoading={isFilesLoading}
              onUpload={uploadFile}
              onDeleteFile={handleDeleteFile}
              onSelectFile={handleSelectFile}
              onSelectAll={handleSelectAll}
            />
          </div>

          <div className="h-full min-h-0 order-1 lg:order-2">
            <ChatBox
              messages={messages}
              input={input}
              onInputChange={setInput}
              onSubmit={handleSubmit}
              isLoading={isChatLoading}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
