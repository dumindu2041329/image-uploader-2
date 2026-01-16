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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setImageUrl(null);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setZoom(1);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRotation(0);

    if (image.url) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setImageUrl(image.url);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }

    if (image.blob) {
      const url = URL.createObjectURL(image.blob);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setImageUrl(url);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);

      return () => {
        URL.revokeObjectURL(url);
      };
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
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
          setZoom((z) => Math.min(z + 0.5, 3));
          break;
        case "-":
          e.preventDefault();
          setZoom((z) => Math.max(z - 0.5, 0.5));
          break;
        case "r":
        case "R":
          e.preventDefault();
          setRotation((r) => r + 90);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, hasPrevious, hasNext, onPrevious, onNext, onOpenChange]);

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-full h-[95vh] p-0 overflow-hidden bg-background/95 backdrop-blur-xl border-border/50">
        <div className="relative h-full flex flex-col" ref={dialogRef}>
          {/* Header / Controls */}
          <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gradient-to-b from-background/80 to-transparent">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="rounded-full bg-background/50 hover:bg-background/80 backdrop-blur-sm"
              >
                <X className="h-4 w-4" />
              </Button>
              {image && (
                <div className="hidden md:flex flex-col ml-2">
                  <span className="text-sm font-medium truncate max-w-[200px]">
                    {image.name}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(image.createdAt)}
                    </span>
                    {image.size && (
                      <span className="flex items-center gap-1">
                        <HardDrive className="h-3 w-3" />
                        {formatFileSize(image.size)}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-1 bg-background/50 backdrop-blur-sm rounded-full p-1 border border-border/50">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))}
                  disabled={zoom <= 0.5}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-xs font-mono w-12 text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setZoom((z) => Math.min(z + 0.25, 3))}
                  disabled={zoom >= 3}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <div className="w-px h-4 bg-border/50 mx-1" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setRotation((r) => r + 90)}
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>

              {showActions && image && (
                <div className="flex items-center gap-2">
                  {onDownload && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full bg-background/50 backdrop-blur-sm"
                      onClick={() => onDownload(image)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="rounded-full"
                      onClick={() => onDelete(image)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 relative flex items-center justify-center bg-black/5 overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center gap-4">
                <Skeleton className="h-48 w-48 rounded-xl" />
                <p className="text-muted-foreground animate-pulse">Loading preview...</p>
              </div>
            ) : imageUrl ? (
              <div
                className="relative transition-all duration-300 ease-out"
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt={image?.name || "Preview"}
                  className="max-h-[85vh] max-w-[90vw] object-contain shadow-2xl rounded-lg"
                  draggable={false}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 text-muted-foreground">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                  <X className="h-8 w-8" />
                </div>
                <p>Preview unavailable</p>
              </div>
            )}

            {/* Navigation Buttons */}
            {showNavigation && (
              <>
                {hasPrevious && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 h-12 w-12 rounded-full bg-background/50 hover:bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg transition-all hover:scale-110"
                    onClick={onPrevious}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                )}
                {hasNext && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 h-12 w-12 rounded-full bg-background/50 hover:bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg transition-all hover:scale-110"
                    onClick={onNext}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Footer / Tags */}
          {image && image.tags && image.tags.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/90 to-transparent">
              <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
                {image.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1 text-sm backdrop-blur-md bg-background/50"
                    onClick={() => {
                      onOpenChange(false);
                      onTagClick?.(tag);
                    }}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
