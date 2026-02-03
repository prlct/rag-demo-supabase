"use client";

import { FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface FileItemProps {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  status: "processing" | "ready" | "error";
  selected?: boolean;
  onDelete?: (id: string) => void;
  onSelect?: (id: string, selected: boolean) => void;
}

export const FileItem = ({
  id,
  name,
  size,
  status,
  selected = false,
  onDelete,
  onSelect,
}: FileItemProps) => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors group overflow-hidden">
      <Checkbox
        checked={selected}
        onCheckedChange={(checked) => onSelect?.(id, checked as boolean)}
        className="flex-shrink-0"
      />

      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
        <FileText className="w-5 h-5 text-foreground" />
      </div>

      <div className="flex-1 min-w-0 overflow-hidden">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="block truncate">
                <span className="text-sm font-medium cursor-default">{name}</span>
              </div>
            </TooltipTrigger>

            <TooltipContent>
              <p>{name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{size}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {status === "ready" && (
          <Badge className="text-xs flex-shrink-0 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 border-0">
            Ready
          </Badge>
        )}

        {status === "processing" && (
          <Badge variant="secondary" className="text-xs flex-shrink-0 animate-pulse">
            Processing
          </Badge>
        )}

        {status === "error" && (
          <Badge variant="destructive" className="text-xs flex-shrink-0">
            Error
          </Badge>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
          onClick={() => onDelete?.(id)}
        >
          <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
        </Button>
      </div>
    </div>
  );
}
