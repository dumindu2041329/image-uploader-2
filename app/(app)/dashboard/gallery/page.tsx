"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import * as imageStore from "@/lib/imageStore";
import { ImageWithBlob } from "@/lib/imageStore";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Upload,
  Image as ImageIcon,
  MoreVertical,
  Eye,
  Pencil,
  Tag,
  Download,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  HardDrive,
  FolderOpen,
} from "lucide-react";

type SortOption = "newest" | "oldest" | "name";

interface ImageWithUrl extends ImageWithBlob {
  url: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function GalleryPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [images, setImages] = useState<ImageWithUrl[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [filterTag, setFilterTag] = useState<string | null>(null);

  // Preview dialog state
  const [previewImage, setPreviewImage] = useState<ImageWithUrl | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Edit dialogs state
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [editTagsDialogOpen, setEditTagsDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<ImageWithUrl | null>(null);
  const [newName, setNewName] = useState("");
  const [newTags, setNewTags] = useState("");

  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingImage, setDeletingImage] = useState<ImageWithUrl | null>(null);

  // Load images
  useEffect(() => {
    async function loadImages() {
      if (!user) return;

      setLoading(true);
      try {
        const data = await imageStore.getImagesWithBlobs(user.id);
        const imagesWithUrls: ImageWithUrl[] = data.map((img) => ({
          ...img,
          url: URL.createObjectURL(img.blob),
        }));
        setImages(imagesWithUrls);
      } catch (error) {
        toast("Failed to load images", "error");
      } finally {
        setLoading(false);
      }
    }

    loadImages();

    // Cleanup URLs on unmount
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, [user]);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    images.forEach((img) => img.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, [images]);

  // Filter and sort images
  const filteredImages = useMemo(() => {
    let result = [...images];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (img) =>
          img.name.toLowerCase().includes(query) ||
          img.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Tag filter
    if (filterTag) {
      result = result.filter((img) => img.tags.includes(filterTag));
    }

    // Sort
    switch (sortBy) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [images, searchQuery, sortBy, filterTag]);

  // Preview navigation
  const currentPreviewIndex = useMemo(() => {
    if (!previewImage) return -1;
    return filteredImages.findIndex((img) => img.id === previewImage.id);
  }, [previewImage, filteredImages]);

  const goToPrevious = useCallback(() => {
    if (currentPreviewIndex > 0) {
      setPreviewImage(filteredImages[currentPreviewIndex - 1]);
    }
  }, [currentPreviewIndex, filteredImages]);

  const goToNext = useCallback(() => {
    if (currentPreviewIndex < filteredImages.length - 1) {
      setPreviewImage(filteredImages[currentPreviewIndex + 1]);
    }
  }, [currentPreviewIndex, filteredImages]);

  // Keyboard navigation for preview
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!previewOpen) return;
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "Escape") setPreviewOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previewOpen, goToPrevious, goToNext]);

  // Actions
  const handlePreview = (image: ImageWithUrl) => {
    setPreviewImage(image);
    setPreviewOpen(true);
  };

  const handleRename = (image: ImageWithUrl) => {
    setEditingImage(image);
    setNewName(image.name);
    setRenameDialogOpen(true);
  };

  const handleEditTags = (image: ImageWithUrl) => {
    setEditingImage(image);
    setNewTags(image.tags.join(", "));
    setEditTagsDialogOpen(true);
  };

  const handleDownload = (image: ImageWithUrl) => {
    const a = document.createElement("a");
    a.href = image.url;
    a.download = image.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDeleteClick = (image: ImageWithUrl) => {
    setDeletingImage(image);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingImage) return;

    try {
      await imageStore.deleteImage(deletingImage.id);
      URL.revokeObjectURL(deletingImage.url);
      setImages((prev) => prev.filter((img) => img.id !== deletingImage.id));
      toast("Image deleted", "success");

      // Close preview if deleting previewed image
      if (previewImage?.id === deletingImage.id) {
        setPreviewOpen(false);
        setPreviewImage(null);
      }
    } catch (error) {
      toast("Failed to delete image", "error");
    } finally {
      setDeleteDialogOpen(false);
      setDeletingImage(null);
    }
  };

  const confirmRename = async () => {
    if (!editingImage || !newName.trim()) return;

    try {
      await imageStore.renameImage(editingImage.id, newName.trim());
      setImages((prev) =>
        prev.map((img) =>
          img.id === editingImage.id ? { ...img, name: newName.trim() } : img
        )
      );
      toast("Image renamed", "success");
    } catch (error) {
      toast("Failed to rename image", "error");
    } finally {
      setRenameDialogOpen(false);
      setEditingImage(null);
    }
  };

  const confirmEditTags = async () => {
    if (!editingImage) return;

    const tags = newTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      await imageStore.updateTags(editingImage.id, tags);
      setImages((prev) =>
        prev.map((img) =>
          img.id === editingImage.id ? { ...img, tags } : img
        )
      );
      toast("Tags updated", "success");
    } catch (error) {
      toast("Failed to update tags", "error");
    } finally {
      setEditTagsDialogOpen(false);
      setEditingImage(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gallery</h1>
          <p className="text-muted-foreground">Your image collection</p>
        </div>

        {/* Controls skeleton */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-11 flex-1" />
          <Skeleton className="h-11 w-32" />
          <Skeleton className="h-11 w-32" />
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-square w-full" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (images.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gallery</h1>
          <p className="text-muted-foreground">Your image collection</p>
        </div>

        <Card className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
            <FolderOpen className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No images yet</h2>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Your gallery is empty. Upload your first images to get started!
          </p>
          <Button asChild>
            <Link href="/dashboard/upload">
              <Upload className="w-4 h-4 mr-2" />
              Upload Images
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gallery</h1>
        <p className="text-muted-foreground">
          {images.length} image{images.length !== 1 ? "s" : ""} in your collection
        </p>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Sort */}
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium h-11 px-4 border border-border/50 bg-background/50 backdrop-blur-sm hover:bg-accent/50 transition-all">
            <ArrowUpDown className="w-4 h-4" />
            Sort
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSortBy("newest")}>
              <span className={sortBy === "newest" ? "font-semibold" : ""}>
                Newest first
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("oldest")}>
              <span className={sortBy === "oldest" ? "font-semibold" : ""}>
                Oldest first
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("name")}>
              <span className={sortBy === "name" ? "font-semibold" : ""}>
                Name (A-Z)
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Filter by Tag */}
        {allTags.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium h-11 px-4 border border-border/50 bg-background/50 backdrop-blur-sm hover:bg-accent/50 transition-all">
              <SlidersHorizontal className="w-4 h-4" />
              {filterTag || "Filter"}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterTag(null)}>
                <span className={!filterTag ? "font-semibold" : ""}>
                  All images
                </span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {allTags.map((tag) => (
                <DropdownMenuItem key={tag} onClick={() => setFilterTag(tag)}>
                  <span className={filterTag === tag ? "font-semibold" : ""}>
                    {tag}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Active Filters */}
      {(searchQuery || filterTag) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Filters:</span>
          {searchQuery && (
            <Badge
              variant="secondary"
              className="cursor-pointer"
              onClick={() => setSearchQuery("")}
            >
              Search: {searchQuery}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          )}
          {filterTag && (
            <Badge
              variant="secondary"
              className="cursor-pointer"
              onClick={() => setFilterTag(null)}
            >
              Tag: {filterTag}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          )}
        </div>
      )}

      {/* Results count */}
      {filteredImages.length !== images.length && (
        <p className="text-sm text-muted-foreground">
          Showing {filteredImages.length} of {images.length} images
        </p>
      )}

      {/* No results */}
      {filteredImages.length === 0 && (
        <Card className="flex flex-col items-center justify-center py-12 text-center">
          <Search className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No images found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </Card>
      )}

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredImages.map((image) => (
          <Card
            key={image.id}
            className="group overflow-hidden hover:shadow-lg transition-all duration-200"
          >
            {/* Thumbnail */}
            <div
              className="aspect-square relative cursor-pointer overflow-hidden bg-muted"
              onClick={() => handlePreview(image)}
            >
              <img
                src={image.url}
                alt={image.name}
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Eye className="w-8 h-8 text-white drop-shadow-lg" />
              </div>
            </div>

            {/* Info */}
            <div className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate" title={image.name}>
                    {image.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(image.createdAt)}
                  </p>
                </div>

                {/* Actions Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger className="p-1 rounded-lg hover:bg-accent/50 transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handlePreview(image)}>
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRename(image)}>
                      <Pencil className="w-4 h-4 mr-2" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditTags(image)}>
                      <Tag className="w-4 h-4 mr-2" />
                      Edit Tags
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownload(image)}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleDeleteClick(image)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Tags */}
              {image.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {image.tags.slice(0, 3).map((tag, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="text-xs cursor-pointer"
                      onClick={() => setFilterTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                  {image.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{image.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        {previewImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Navigation buttons */}
            {currentPreviewIndex > 0 && (
              <button
                onClick={goToPrevious}
                className="absolute left-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
            {currentPreviewIndex < filteredImages.length - 1 && (
              <button
                onClick={goToNext}
                className="absolute right-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* Close button */}
            <button
              onClick={() => setPreviewOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image and metadata */}
            <div className="max-w-4xl w-full max-h-[90vh] flex flex-col glass-strong rounded-2xl overflow-hidden">
              {/* Image */}
              <div className="flex-1 min-h-0 bg-black/20 flex items-center justify-center p-4">
                <img
                  src={previewImage.url}
                  alt={previewImage.name}
                  className="max-w-full max-h-[60vh] object-contain rounded-lg"
                />
              </div>

              {/* Metadata */}
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">{previewImage.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(previewImage.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <HardDrive className="w-4 h-4" />
                        {formatFileSize(previewImage.size)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(previewImage)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setPreviewOpen(false);
                        handleDeleteClick(previewImage);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Tags */}
                {previewImage.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {previewImage.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Navigation indicator */}
                <p className="text-xs text-muted-foreground text-center">
                  {currentPreviewIndex + 1} of {filteredImages.length}
                  {filteredImages.length !== images.length &&
                    ` (filtered from ${images.length})`}
                </p>
              </div>
            </div>
          </div>
        )}
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent onClose={() => setRenameDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>Rename Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="rename-input">New name</Label>
              <Input
                id="rename-input"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="mt-1"
                onKeyDown={(e) => e.key === "Enter" && confirmRename()}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setRenameDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={confirmRename} disabled={!newName.trim()}>
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Tags Dialog */}
      <Dialog open={editTagsDialogOpen} onOpenChange={setEditTagsDialogOpen}>
        <DialogContent onClose={() => setEditTagsDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>Edit Tags</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="tags-input">Tags (comma-separated)</Label>
              <Input
                id="tags-input"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                placeholder="vacation, summer, beach"
                className="mt-1"
                onKeyDown={(e) => e.key === "Enter" && confirmEditTags()}
              />
            </div>
            {newTags && (
              <div className="flex flex-wrap gap-1.5">
                {newTags
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
                  .map((tag, i) => (
                    <Badge key={i} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setEditTagsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={confirmEditTags}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent onClose={() => setDeleteDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>Delete Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <p className="text-muted-foreground">
              Are you sure you want to delete &quot;{deletingImage?.name}&quot;? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
