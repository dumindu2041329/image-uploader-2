"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import * as imageStore from "@/lib/imageStore";
import { Upload, X, Image as ImageIcon } from "lucide-react";

export default function UploadPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    
    const imageFiles = Array.from(newFiles).filter((file) =>
      file.type.startsWith("image/")
    );
    
    if (imageFiles.length === 0) {
      toast("Please select image files only", "error");
      return;
    }
    
    setFiles((prev) => [...prev, ...imageFiles]);
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

  const handleUpload = async () => {
    if (!user || files.length === 0) return;
    
    setUploading(true);
    try {
      await imageStore.addImages(user.id, files);
      toast(`${files.length} ${files.length === 1 ? "image" : "images"} uploaded successfully`, "success");
      router.push("/dashboard");
    } catch (error) {
      toast("Failed to upload images", "error");
    }
    setUploading(false);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Upload Images</h1>
        <p className="text-muted-foreground">
          Add new images to your collection
        </p>
      </div>

      <Card
        className={`p-12 text-center border-2 border-dashed transition-colors ${
          dragActive ? "border-primary bg-primary/5" : "border-border"
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
          accept="image/*"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        
        <Upload className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          {dragActive ? "Drop images here" : "Drag & drop images here"}
        </h3>
        <p className="text-muted-foreground mb-6">or</p>
        <Button onClick={() => fileInputRef.current?.click()}>
          Browse Files
        </Button>
      </Card>

      {files.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Selected Files ({files.length})
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setFiles([])}>
                Clear All
              </Button>
              <Button onClick={handleUpload} disabled={uploading}>
                {uploading ? "Uploading..." : "Upload All"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file, index) => (
              <Card key={index} className="p-4 flex items-center gap-4">
                <div className="relative w-16 h-16 bg-muted rounded flex-shrink-0">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
