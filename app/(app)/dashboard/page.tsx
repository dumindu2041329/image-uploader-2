"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import * as imageStore from "@/lib/imageStore";
import { Trash2, Edit2, Tag, Download, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

type ImageMeta = Omit<Awaited<ReturnType<typeof imageStore.listImages>>[0], "blob">;

export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [images, setImages] = useState<ImageMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<ImageMeta | null>(null);
  const [editMode, setEditMode] = useState<"rename" | "tags" | null>(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    loadImages();
  }, [user]);

  const loadImages = async () => {
    if (!user) return;
    setLoading(true);
    const imgs = await imageStore.listImages(user.id);
    setImages(imgs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    
    await imageStore.deleteImage(id);
    toast("Image deleted", "success");
    loadImages();
  };

  const handleRename = async () => {
    if (!selectedImage || !editValue.trim()) return;
    
    await imageStore.renameImage(selectedImage.id, editValue);
    toast("Image renamed", "success");
    setEditMode(null);
    setEditValue("");
    loadImages();
  };

  const handleUpdateTags = async () => {
    if (!selectedImage) return;
    
    const tags = editValue.split(",").map(t => t.trim()).filter(Boolean);
    await imageStore.updateTags(selectedImage.id, tags);
    toast("Tags updated", "success");
    setEditMode(null);
    setEditValue("");
    loadImages();
  };

  const openEditDialog = (image: ImageMeta, mode: "rename" | "tags") => {
    setSelectedImage(image);
    setEditMode(mode);
    setEditValue(mode === "rename" ? image.name : image.tags.join(", "));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Images</h1>
          <p className="text-muted-foreground">
            {images.length} {images.length === 1 ? "image" : "images"}
          </p>
        </div>
        <Link href="/dashboard/upload">
          <Button size="lg">
            <ImageIcon className="mr-2 h-5 w-5" />
            Upload Images
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-48 w-full rounded-t-lg" />
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : images.length === 0 ? (
        <Card className="p-12 text-center">
          <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No images yet</h3>
          <p className="text-muted-foreground mb-6">
            Upload your first image to get started
          </p>
          <Link href="/dashboard/upload">
            <Button>Upload Images</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <ImageCard
              key={image.id}
              image={image}
              onDelete={handleDelete}
              onRename={(img) => openEditDialog(img, "rename")}
              onEditTags={(img) => openEditDialog(img, "tags")}
            />
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editMode !== null} onOpenChange={() => setEditMode(null)}>
        <DialogContent onClose={() => setEditMode(null)}>
          <DialogHeader>
            <DialogTitle>
              {editMode === "rename" ? "Rename Image" : "Edit Tags"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>
                {editMode === "rename" ? "New Name" : "Tags (comma-separated)"}
              </Label>
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder={editMode === "rename" ? "image.jpg" : "tag1, tag2, tag3"}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setEditMode(null)}>
                Cancel
              </Button>
              <Button onClick={editMode === "rename" ? handleRename : handleUpdateTags}>
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ImageCard({
  image,
  onDelete,
  onRename,
  onEditTags,
}: {
  image: ImageMeta;
  onDelete: (id: string) => void;
  onRename: (image: ImageMeta) => void;
  onEditTags: (image: ImageMeta) => void;
}) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    imageStore.getImageBlob(image.id).then((blob) => {
      if (blob && mounted) {
        setBlobUrl(URL.createObjectURL(blob));
      }
    });
    return () => {
      mounted = false;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [image.id]);

  const handleDownload = () => {
    if (blobUrl) {
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = image.name;
      a.click();
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-video bg-muted">
        {blobUrl ? (
          <img
            src={blobUrl}
            alt={image.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Skeleton className="w-full h-full" />
          </div>
        )}
      </div>
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold truncate">{image.name}</h3>
          <p className="text-xs text-muted-foreground">
            {new Date(image.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        {image.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {image.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleDownload} className="flex-1">
            <Download className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => onRename(image)}>
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => onEditTags(image)}>
            <Tag className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(image.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
