"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";

export interface ChatMessageProps {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 p-4 rounded-lg",
        isUser 
          ? "bg-muted/50" 
          : "bg-primary/5 border border-primary/10"
      )}
    >
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback
          className={cn(
            isUser
              ? "bg-muted text-muted-foreground"
              : "bg-primary text-primary-foreground"
          )}
        >
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {isUser ? "You" : "Assistant"}
          </span>

          <span className="text-xs text-muted-foreground">{timestamp}</span>
        </div>
        
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
}
