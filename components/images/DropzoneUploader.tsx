"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Image as ImageIcon, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_ACCEPTED_TYPES = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/webp",
  "image/gif",
];

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB

export interface FileWithPreview {
  file: File;
  preview: string;
  id: string;
}

export interface DropzoneUploaderProps {
  onFilesAdded: (files: FileWithPreview[]) => void;
  onFileRemoved?: (id: string) => void;
  acceptedTypes?: string[];
  maxFileSize?: number;
  maxFiles?: number;
  disabled?: boolean;
  className?: string;
  showPreview?: boolean;
  files?: FileWithPreview[];
}

export function DropzoneUploader({
  onFilesAdded,
  onFileRemoved,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES,
  maxFileSize = DEFAULT_MAX_SIZE,
  maxFiles,
  disabled = false,
  className,
  showPreview = true,
  files = [],
}: DropzoneUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cleanup preview URLs when files are removed externally
  useEffect(() => {
    return () => {
      // Note: Parent component should handle cleanup of preview URLs
      // This is just a safety net
    };
  }, []);

  const validateFiles = useCallback(
    (fileList: FileList | null): { valid: File[]; errors: string[] } => {
      if (!fileList) return { valid: [], errors: [] };

      const validFiles: File[] = [];
      const errors: string[] = [];

      const filesArray = Array.from(fileList);

      // Check max files limit
      if (maxFiles && files.length + filesArray.length > maxFiles) {
        errors.push(`Maximum ${maxFiles} files allowed`);
        return { valid: [], errors };
      }

      filesArray.forEach((file) => {
        // Check file type
        if (!acceptedTypes.includes(file.type)) {
          errors.push(`${file.name}: Unsupported format`);
          return;
        }

        // Check file size
        if (file.size > maxFileSize) {
          errors.push(
            `${file.name}: File too large (max ${formatFileSize(maxFileSize)})`
          );
          return;
        }

        validFiles.push(file);
      });

      return { valid: validFiles, errors };
    },
    [acceptedTypes, maxFileSize, maxFiles, files.length]
  );

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      setError(null);

      const { valid, errors } = validateFiles(fileList);

      if (errors.length > 0) {
        setError(errors.join(". "));
      }

      if (valid.length > 0) {
        const filesWithPreview: FileWithPreview[] = valid.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
          id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        }));

        onFilesAdded(filesWithPreview);
      }
    },
    [validateFiles, onFilesAdded]
  );

  const handleDrag = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (disabled) return;

      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        // Only set inactive if leaving the dropzone entirely
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX;
        const y = e.clientY;
        if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
          setDragActive(false);
        }
      }
    },
    [disabled]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (disabled) return;

      handleFiles(e.dataTransfer.files);
    },
    [disabled, handleFiles]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
      // Reset input to allow re-selecting same files
      e.target.value = "";
    },
    [handleFiles]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        fileInputRef.current?.click();
      }
    },
    [disabled]
  );

  const removeFile = useCallback(
    (id: string) => {
      const file = files.find((f) => f.id === id);
      if (file) {
        URL.revokeObjectURL(file.preview);
        onFileRemoved?.(id);
      }
    },
    [files, onFileRemoved]
  );

  const acceptString = acceptedTypes.join(",");
  const formatList = acceptedTypes
    .map((type) => type.split("/")[1].toUpperCase())
    .join(", ");

  return (
    <div className={cn("space-y-4", className)}>
      {/* Dropzone */}
      <Card
        className={cn(
          "relative overflow-hidden border-2 border-dashed transition-all duration-200 cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          dragActive
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-border hover:border-primary/50",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="button"
        aria-label="Upload images by clicking or dropping files"
        aria-disabled={disabled}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptString}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
          aria-hidden="true"
        />

        <div className="p-8 sm:p-12 text-center">
          <div
            className={cn(
              "w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-200",
              dragActive ? "bg-primary/20 scale-110" : "bg-muted"
            )}
          >
            {dragActive ? (
              <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            ) : (
              <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" />
            )}
          </div>

          <h3 className="text-lg font-semibold mb-2">
            {dragActive ? "Drop images here" : "Drag & drop images here"}
          </h3>

          <p className="text-muted-foreground text-sm mb-4">or</p>

          <Button
            type="button"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            disabled={disabled}
            className="mb-4"
          >
            Browse Files
          </Button>

          <p className="text-xs text-muted-foreground">
            Supports {formatList} up to {formatFileSize(maxFileSize)}
          </p>

          {maxFiles && (
            <p className="text-xs text-muted-foreground mt-1">
              Maximum {maxFiles} files
            </p>
          )}
        </div>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm">
          <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
          <span className="text-destructive">{error}</span>
        </div>
      )}

      {/* Preview Grid */}
      {showPreview && files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {files.map((fileWithPreview) => (
            <div
              key={fileWithPreview.id}
              className="relative group aspect-square rounded-lg overflow-hidden bg-muted"
            >
              <img
                src={fileWithPreview.preview}
                alt={fileWithPreview.file.name}
                className="w-full h-full object-cover"
              />

              {/* Overlay with file info */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors">
                <div className="absolute bottom-0 left-0 right-0 p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs font-medium truncate">
                    {fileWithPreview.file.name}
                  </p>
                  <p className="text-xs opacity-80">
                    {formatFileSize(fileWithPreview.file.size)}
                  </p>
                </div>
              </div>

              {/* Remove button */}
              {onFileRemoved && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(fileWithPreview.id);
                  }}
                  className={cn(
                    "absolute top-1 right-1 p-1 rounded-full",
                    "bg-black/50 hover:bg-destructive text-white",
                    "opacity-0 group-hover:opacity-100 transition-all",
                    "focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  )}
                  aria-label={`Remove ${fileWithPreview.file.name}`}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Utility function
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

// Re-export for convenience
export { formatFileSize };
