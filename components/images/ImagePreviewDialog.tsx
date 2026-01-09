"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Download,
  Trash2,
  Calendar,
  HardDrive,
  ZoomIn,
  ZoomOut,
  RotateCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface PreviewImageData {
  id: string;
  name: string;
  tags: string[];
  createdAt: string;
  size?: number;
  url?: string;
  blob?: Blob;
}

export interface ImagePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  image: PreviewImageData | null;
  images?: PreviewImageData[];
  onPrevious?: () => void;
  onNext?: () => void;
  onDownload?: (image: PreviewImageData) => void;
  onDelete?: (image: PreviewImageData) => void;
  onTagClick?: (tag: string) => void;
  showNavigation?: boolean;
  showActions?: boolean;
  currentIndex?: number;
  totalCount?: number;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function ImagePreviewDialog({
  open,
  onOpenChange,
  image,
  images = [],
  onPrevious,
  onNext,
  onDownload,
  onDelete,
  onTagClick,
  showNavigation = true,
  showActions = true,
  currentIndex,
  totalCount,
}: ImagePreviewDialogProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Compute navigation state
  const hasPrevious = currentIndex !== undefined && currentIndex > 0;
  const hasNext =
    currentIndex !== undefined &&
    totalCount !== undefined &&
    currentIndex < totalCount - 1;

  // Load image URL
  useEffect(() => {
    if (!image) {
      setImageUrl(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setZoom(1);
    setRotation(0);

    if (image.url) {
      setImageUrl(image.url);
      setLoading(false);
      return;
    }

    if (image.blob) {
      const url = URL.createObjectURL(image.blob);
      setImageUrl(url);
      setLoading(false);

      return () => {
        URL.revokeObjectURL(url);
      };
    }

    setLoading(false);
  }, [image]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          if (hasPrevious) {
            e.preventDefault();
            onPrevious?.();
          }
          break;
        case "ArrowRight":
          if (hasNext) {
            e.preventDefault();
            onNext?.();
          }
          break;
        case "Escape":
          e.preventDefault();
          onOpenChange(false);
          break;
        case "+":
        case "=":
          e.preventDefault();
          setZoom((z) => Math.min(z + 0.25, 3));
          break;
        case "-":
          e.preventDefault();
          setZoom((z) => Math.max(z - 0.25, 0.5));
          break;
        case "r":
          e.preventDefault();
          setRotation((r) => (r + 90) % 360);
          break;
        case "0":
          e.preventDefault();
          setZoom(1);
          setRotation(0);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, hasPrevious, hasNext, onPrevious, onNext, onOpenChange]);

  // Focus trap
  useEffect(() => {
    if (open && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [open]);

  const handleDownload = useCallback(() => {
    if (!image || !imageUrl) return;

    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = image.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    onDownload?.(image);
  }, [image, imageUrl, onDownload]);

  const handleDelete = useCallback(() => {
    if (!image) return;
    onDelete?.(image);
  }, [image, onDelete]);

  const resetView = useCallback(() => {
    setZoom(1);
    setRotation(0);
  }, []);

  if (!image) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div
        ref={dialogRef}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={`Image preview: ${image.name}`}
      >
        {/* Navigation Buttons */}
        {showNavigation && hasPrevious && (
          <button
            onClick={onPrevious}
            className={cn(
              "absolute left-2 sm:left-4 z-10 p-2 sm:p-3 rounded-full",
              "bg-background/80 backdrop-blur-sm hover:bg-background transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            )}
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {showNavigation && hasNext && (
          <button
            onClick={onNext}
            className={cn(
              "absolute right-2 sm:right-4 z-10 p-2 sm:p-3 rounded-full",
              "bg-background/80 backdrop-blur-sm hover:bg-background transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            )}
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className={cn(
            "absolute top-2 right-2 sm:top-4 sm:right-4 z-10 p-2 rounded-full",
            "bg-background/80 backdrop-blur-sm hover:bg-background transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          )}
          aria-label="Close preview"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Zoom Controls */}
        <div
          className={cn(
            "absolute top-2 left-2 sm:top-4 sm:left-4 z-10 flex items-center gap-1",
            "bg-background/80 backdrop-blur-sm rounded-full p-1"
          )}
        >
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))}
            className="p-1.5 rounded-full hover:bg-accent/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Zoom out"
            disabled={zoom <= 0.5}
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-medium px-2 min-w-[3rem] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.25, 3))}
            className="p-1.5 rounded-full hover:bg-accent/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Zoom in"
            disabled={zoom >= 3}
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setRotation((r) => (r + 90) % 360)}
            className="p-1.5 rounded-full hover:bg-accent/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Rotate"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl w-full max-h-[90vh] flex flex-col glass-strong rounded-2xl overflow-hidden">
          {/* Image Container */}
          <div
            className="flex-1 min-h-0 bg-black/20 flex items-center justify-center p-4 overflow-auto"
            onClick={resetView}
          >
            {loading ? (
              <Skeleton className="w-full h-[60vh] rounded-lg" />
            ) : imageUrl ? (
              <img
                src={imageUrl}
                alt={image.name}
                className="max-w-full max-h-[60vh] object-contain rounded-lg transition-transform duration-200"
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                }}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <div className="text-center text-muted-foreground">
                <p>Unable to load image</p>
              </div>
            )}
          </div>

          {/* Metadata Section */}
          <div className="p-4 space-y-3 border-t border-border/30">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold truncate" title={image.name}>
                  {image.name}
                </h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(image.createdAt)}
                  </span>
                  {image.size && (
                    <span className="flex items-center gap-1">
                      <HardDrive className="w-4 h-4" />
                      {formatFileSize(image.size)}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {showActions && (
                <div className="flex gap-2 flex-shrink-0">
                  <Button size="sm" variant="outline" onClick={handleDownload}>
                    <Download className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Download</span>
                  </Button>
                  {onDelete && (
                    <Button size="sm" variant="outline" onClick={handleDelete}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Tags */}
            {image.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {image.tags.map((tag, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className={cn(
                      onTagClick && "cursor-pointer hover:bg-secondary/80"
                    )}
                    onClick={() => onTagClick?.(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Navigation Indicator */}
            {showNavigation && currentIndex !== undefined && totalCount !== undefined && (
              <p className="text-xs text-muted-foreground text-center">
                {currentIndex + 1} of {totalCount}
                <span className="mx-2">•</span>
                <span className="hidden sm:inline">
                  Use arrow keys to navigate, +/- to zoom, R to rotate
                </span>
                <span className="sm:hidden">Swipe to navigate</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
}

// Empty state for when no image is selected
export function ImagePreviewEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Calendar className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">No Image Selected</h3>
      <p className="text-sm text-muted-foreground">
        Select an image from the gallery to preview it here
      </p>
    </div>
  );
}
