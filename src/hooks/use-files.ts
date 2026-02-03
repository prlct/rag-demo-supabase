"use client";

import { useState, useCallback, useEffect } from "react";

export interface FileData {
  id: string;
  name: string;
  uploadedAt: string;
  status: "processing" | "ready" | "error";
}

interface UseFilesReturn {
  files: FileData[];
  isLoading: boolean;
  error: string | null;
  uploadFile: (file: File) => Promise<void>;
  deleteFile: (id: string) => Promise<void>;
  refreshFiles: () => Promise<void>;
}

export const useFiles = (): UseFilesReturn => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshFiles = useCallback(async () => {
    try {
      const response = await fetch("/api/files");

      if (!response.ok) throw new Error("Failed to fetch files");
      
      const data = await response.json();
      setFiles(
        data.files.map((f: { id: string; original_name: string; uploaded_at: string; status: string }) => ({
          id: f.id,
          name: f.original_name,
          uploadedAt: f.uploaded_at,
          status: f.status as "processing" | "ready" | "error",
        }))
      );
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const uploadFile = useCallback(async (file: File) => {
    const formData = new FormData();
    
    formData.append("file", file);

    const response = await fetch("/api/files", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();

      throw new Error(data.error || "Failed to upload file");
    }

    await refreshFiles();
  }, [refreshFiles]);

  const deleteFile = useCallback(async (id: string) => {
    const response = await fetch(`/api/files/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete file");
    }

    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  useEffect(() => {
    refreshFiles();
  }, [refreshFiles]);

  return {
    files,
    isLoading,
    error,
    uploadFile,
    deleteFile,
    refreshFiles,
  };
};
