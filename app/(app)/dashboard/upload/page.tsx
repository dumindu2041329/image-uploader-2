"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import * as imageStore from "@/lib/imageStore";
import { ImageMetadata } from "@/lib/imageStore";
import {
  Upload,
  X,
  Image as ImageIcon,
  CheckCircle2,
  FolderOpen,
  Shield,
  Tag,
  Sparkles,
} from "lucide-react";

const ACCEPTED_TYPES = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/webp",
  "image/gif",
];

interface FileWithMeta {
  file: File;
  preview: string;
  displayName: string;
  tags: string[];
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function UploadPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [filesWithMeta, setFilesWithMeta] = useState<FileWithMeta[]>([]);
  const [globalTags, setGlobalTags] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      filesWithMeta.forEach((f) => URL.revokeObjectURL(f.preview));
    };
  }, []);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;

    const validFiles = Array.from(newFiles).filter((file) =>
      ACCEPTED_TYPES.includes(file.type)
    );

    if (validFiles.length === 0) {
      toast("Please select valid image files (PNG, JPG, JPEG, WebP, GIF)", "error");
      return;
    }

    if (validFiles.length < newFiles.length) {
      toast(
        `${newFiles.length - validFiles.length} file(s) skipped (unsupported format)`,
        "info"
      );
    }

    const newFilesWithMeta: FileWithMeta[] = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      displayName: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
      tags: [],
    }));

    setFilesWithMeta((prev) => [...prev, ...newFilesWithMeta]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const updateDisplayName = (index: number, name: string) => {
    setFilesWithMeta((prev) =>
      prev.map((f, i) => (i === index ? { ...f, displayName: name } : f))
    );
  };

  const updateFileTags = (index: number, tagsStr: string) => {
    const tags = tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    setFilesWithMeta((prev) =>
      prev.map((f, i) => (i === index ? { ...f, tags } : f))
    );
  };

  const removeFile = (index: number) => {
    const file = filesWithMeta[index];
    URL.revokeObjectURL(file.preview);
    setFilesWithMeta((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    filesWithMeta.forEach((f) => URL.revokeObjectURL(f.preview));
    setFilesWithMeta([]);
    setGlobalTags("");
  };

  const parsedGlobalTags = useMemo(() => {
    return globalTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }, [globalTags]);

  const handleUpload = async () => {
    if (!user || filesWithMeta.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress for UX (IndexedDB is fast)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 15;
        });
      }, 100);

      const files = filesWithMeta.map((f) => f.file);
      const metadata: ImageMetadata[] = filesWithMeta.map((f) => ({
        displayName: f.displayName || f.file.name,
        tags: [...new Set([...f.tags, ...parsedGlobalTags])], // Merge and dedupe tags
      }));

      await imageStore.addImages(user.id, files, metadata);

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Small delay to show 100% completion
      await new Promise((resolve) => setTimeout(resolve, 300));

      toast("Saved to your local gallery", "success");
      setUploadComplete(true);
    } catch (error) {
      toast("Failed to save images", "error");
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = () => {
    clearAll();
    setUploadComplete(false);
    setUploadProgress(0);
  };

  // Success state
  if (uploadComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <Sparkles className="w-6 h-6 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">Upload Complete!</h2>
          <p className="text-muted-foreground">
            {filesWithMeta.length} image{filesWithMeta.length !== 1 ? "s" : ""} saved
            to your local gallery
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={resetUpload}>
            <Upload className="w-4 h-4 mr-2" />
            Upload More
          </Button>
          <Button asChild>
            <Link href="/dashboard/gallery">
              <FolderOpen className="w-4 h-4 mr-2" />
              Go to Gallery
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Upload Images</h1>
        <p className="text-muted-foreground">
          Add new images to your local collection
        </p>
      </div>

      {/* Dropzone */}
      <Card
        className={`relative overflow-hidden border-2 border-dashed transition-all duration-200 ${
          dragActive
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-border hover:border-primary/50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ACCEPTED_TYPES.join(",")}
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = ""; // Reset to allow re-selecting same files
          }}
          className="hidden"
        />

        <div className="p-12 text-center">
          <div
            className={`w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-200 ${
              dragActive
                ? "bg-primary/20 scale-110"
                : "bg-muted"
            }`}
          >
            {dragActive ? (
              <ImageIcon className="w-10 h-10 text-primary" />
            ) : (
              <Upload className="w-10 h-10 text-muted-foreground" />
            )}
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {dragActive ? "Drop images here" : "Drag & drop images here"}
          </h3>
          <p className="text-muted-foreground text-sm mb-1">or</p>
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="mb-4"
          >
            Browse Files
          </Button>
          <p className="text-xs text-muted-foreground">
            Supports PNG, JPG, JPEG, WebP, GIF
          </p>
        </div>
      </Card>

      {/* Global Tags Input */}
      {filesWithMeta.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Tag className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <div className="flex-1">
              <Label htmlFor="global-tags" className="text-sm font-medium">
                Tags for all images (comma-separated)
              </Label>
              <Input
                id="global-tags"
                placeholder="vacation, summer, 2024"
                value={globalTags}
                onChange={(e) => setGlobalTags(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          {parsedGlobalTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3 ml-8">
              {parsedGlobalTags.map((tag, i) => (
                <Badge key={i} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Selected Files */}
      {filesWithMeta.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Selected Files ({filesWithMeta.length})
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" onClick={clearAll} disabled={uploading}>
                Clear All
              </Button>
              <Button onClick={handleUpload} disabled={uploading}>
                {uploading ? "Saving..." : "Save to Gallery"}
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          {uploading && (
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Saving to local storage...</span>
                    <span className="font-medium">{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-200 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* File Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filesWithMeta.map((fileWithMeta, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="flex gap-4 p-4">
                  {/* Thumbnail */}
                  <div className="relative w-24 h-24 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                    <img
                      src={fileWithMeta.preview}
                      alt={fileWithMeta.displayName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground truncate">
                          {fileWithMeta.file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(fileWithMeta.file.size)}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 flex-shrink-0"
                        onClick={() => removeFile(index)}
                        disabled={uploading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Display Name Input */}
                    <div>
                      <Label className="text-xs">Display Name</Label>
                      <Input
                        value={fileWithMeta.displayName}
                        onChange={(e) => updateDisplayName(index, e.target.value)}
                        className="h-8 text-sm mt-1"
                        disabled={uploading}
                      />
                    </div>

                    {/* Per-file Tags */}
                    <div>
                      <Label className="text-xs">Tags (comma-separated)</Label>
                      <Input
                        placeholder="nature, portrait"
                        onChange={(e) => updateFileTags(index, e.target.value)}
                        className="h-8 text-sm mt-1"
                        disabled={uploading}
                      />
                    </div>
                  </div>
                </div>

                {/* Tags Preview */}
                {fileWithMeta.tags.length > 0 && (
                  <div className="px-4 pb-3 flex flex-wrap gap-1">
                    {fileWithMeta.tags.map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Privacy Info Card */}
      <Card className="bg-blue-500/5 border-blue-500/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-500" />
            Privacy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your images are stored locally in your browser using IndexedDB. They never leave
            your device. Clearing your browser&apos;s site data will permanently remove all
            stored images.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
