"use client";

import { useState } from "react";
import { FilesLibrary } from "@/components/files/files-library";
import { ChatBox } from "@/components/chat/chat-box";
import { FileItemProps } from "@/components/files/file-item";
import { ChatMessageProps } from "@/components/chat/chat-message";

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

const mockMessages: ChatMessageProps[] = [
  {
    id: "1",
    role: "user",
    content: "What are the main points from the company guidelines?",
    timestamp: "10:30 AM",
  },
  {
    id: "2",
    role: "assistant",
    content:
      "Based on the Company Guidelines 2024 document, here are the main points:\n\n1. **Remote Work Policy** - Employees can work remotely up to 3 days per week\n2. **Communication Standards** - All team communications should go through official channels\n3. **Security Protocols** - Two-factor authentication is mandatory for all accounts\n4. **Performance Reviews** - Quarterly reviews with direct managers\n\nWould you like me to elaborate on any of these points?",
    timestamp: "10:31 AM",
  },
  {
    id: "3",
    role: "user",
    content: "Tell me more about the security protocols",
    timestamp: "10:32 AM",
  },
  {
    id: "4",
    role: "assistant",
    content:
      "According to the security section of the guidelines:\n\n**Authentication Requirements:**\n- Two-factor authentication (2FA) is required for all company accounts\n- Passwords must be at least 12 characters with mixed case, numbers, and symbols\n- Password rotation every 90 days\n\n**Data Handling:**\n- Sensitive data must be encrypted at rest and in transit\n- No company data on personal devices without MDM enrollment\n- Immediate reporting of any security incidents to IT\n\n**Access Control:**\n- Principle of least privilege for all system access\n- Regular access reviews conducted quarterly",
    timestamp: "10:33 AM",
  },
];

export default function Home() {
  const [files, setFiles] = useState<FileItemProps[]>(mockFiles);
  const [messages, setMessages] = useState<ChatMessageProps[]>(mockMessages);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set(mockFiles.map(f => f.id)));

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

  const handleSendMessage = (content: string) => {
    const newMessage: ChatMessageProps = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages([...messages, newMessage]);

    // Mock assistant response
    setTimeout(() => {
      const assistantMessage: ChatMessageProps = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I'm a mock response. In the real implementation, this would be powered by RAG (Retrieval-Augmented Generation) using your uploaded documents as context.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex-shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center px-4">
          <h1 className="text-xl font-semibold">RAG Demo</h1>
          
          <p className="ml-4 text-sm text-muted-foreground hidden sm:block">
            Chat with your documents using AI
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container px-4 py-4 overflow-hidden mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-[450px_1fr] gap-4 h-full mx-auto">
          {/* Files Library */}
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

          {/* Chat Box */}
          <div className="h-full min-h-0 order-1 lg:order-2">
            <ChatBox messages={messages} onSendMessage={handleSendMessage} />
          </div>
        </div>
      </main>
    </div>
  );
}
