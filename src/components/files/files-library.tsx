"use client";

import { Upload, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FileItem, FileItemProps } from "./file-item";

interface FilesLibraryProps {
  files: FileItemProps[];
  selectedFiles: Set<string>;
  onUpload?: () => void;
  onDeleteFile?: (id: string) => void;
  onSelectFile?: (id: string, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
}

export const FilesLibrary = ({ files, selectedFiles, onUpload, onDeleteFile, onSelectFile, onSelectAll }: FilesLibraryProps) => {
  const allSelected = files.length > 0 && files.every((f) => selectedFiles.has(f.id));
  const someSelected = files.some((f) => selectedFiles.has(f.id));
  const selectedCount = selectedFiles.size;

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="flex-shrink-0 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Files Library</CardTitle>
          </div>

          <Button size="sm" onClick={onUpload} className="gap-2">
            <Upload className="w-4 h-4" />
            Upload
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Upload documents to use as context for your conversations
        </p>
      </CardHeader>

      <Separator />

      {files.length > 0 && (
        <div className="px-4 py-3  bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                id="select-all"
                checked={allSelected}
                onCheckedChange={(checked) => onSelectAll?.(checked as boolean)}
                className="data-[state=indeterminate]:bg-primary"
                {...(someSelected && !allSelected ? { "data-state": "indeterminate" } : {})}
              />

              <Label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                Select all
              </Label>
            </div>

            <span className="text-xs text-muted-foreground">
              {selectedCount} of {files.length} selected
            </span>
          </div>
        </div>
      )}

      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full w-full">
          <div className="p-4 space-y-2 w-full max-w-full">
            {files.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <FolderOpen className="w-8 h-8 text-muted-foreground" />
                </div>

                <p className="text-sm font-medium">No files uploaded</p>
                
                <p className="text-xs text-muted-foreground mt-1">
                  Upload PDF, TXT, or MD files to get started
                </p>
              </div>
            ) : (
              files.map((file) => (
                <FileItem
                  key={file.id}
                  {...file}
                  selected={selectedFiles.has(file.id)}
                  onDelete={onDeleteFile}
                  onSelect={onSelectFile}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
