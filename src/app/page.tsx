"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { FilesLibrary } from "@/components/files/files-library";
import { ChatBox } from "@/components/chat/chat-box";
import { FileItemProps } from "@/components/files/file-item";

// Mock data
const mockFiles: FileItemProps[] = [
  {
    id: "1",
    name: "Company_Guidelines_2024.pdf",
    size: "2.4 MB",
    uploadedAt: "2 hours ago",
    status: "ready",
  },
  {
    id: "2",
    name: "Product_Documentation_Full_Version_With_All_Updates_And_Revisions_2024.pdf",
    size: "1.8 MB",
    uploadedAt: "5 hours ago",
    status: "ready",
  },
  {
    id: "3",
    name: "Meeting_Notes_Q4.md",
    size: "45 KB",
    uploadedAt: "1 day ago",
    status: "ready",
  },
  {
    id: "4",
    name: "Technical_Specs_v2.pdf",
    size: "3.2 MB",
    uploadedAt: "2 days ago",
    status: "processing",
  },
  {
    id: "5",
    name: "Research_Paper.pdf",
    size: "892 KB",
    uploadedAt: "3 days ago",
    status: "ready",
  },
];

const chatTransport = new DefaultChatTransport({
  api: "/api/chat",
});

export default function Home() {
  const [files, setFiles] = useState<FileItemProps[]>(mockFiles);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set(mockFiles.map(f => f.id)));
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat({
    transport: chatTransport,
  });

  const isLoading = status === "streaming" || status === "submitted";

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;
    const text = input;
    setInput("");
    await sendMessage({ text });
  };

  const handleUpload = () => {
    // TODO: Implement file upload
    console.log("Upload clicked");
  };

  const handleDeleteFile = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
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
              files={files}
              selectedFiles={selectedFiles}
              onUpload={handleUpload}
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
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
