"use client";

import { useState, useEffect, useCallback, memo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  MoreVertical,
  Pencil,
  Tag,
  Download,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ImageData {
  id: string;
  name: string;
  tags: string[];
  createdAt: string;
  size?: number;
  url?: string;
  blob?: Blob;
}

export interface ImageCardProps {
  image: ImageData;
  onPreview?: (image: ImageData) => void;
  onRename?: (image: ImageData) => void;
  onEditTags?: (image: ImageData) => void;
  onDownload?: (image: ImageData) => void;
  onDelete?: (image: ImageData) => void;
  onTagClick?: (tag: string) => void;
  showTags?: boolean;
  maxVisibleTags?: number;
  className?: string;
  density?: "comfortable" | "compact";
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export const ImageCard = memo(function ImageCard({
  image,
  onPreview,
  onRename,
  onEditTags,
  onDownload,
  onDelete,
  onTagClick,
  showTags = true,
  maxVisibleTags = 3,
  className,
  density = "comfortable",
}: ImageCardProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(image.url || null);
  const [loading, setLoading] = useState(!image.url && !!image.blob);
  const [error, setError] = useState(false);

  // Create object URL from blob if needed
  useEffect(() => {
    if (image.url) {
      setImageUrl(image.url);
      setLoading(false);
      return;
    }

    if (image.blob) {
      const url = URL.createObjectURL(image.blob);
      setImageUrl(url);
      setLoading(false);

      // Cleanup on unmount or when blob changes
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [image.url, image.blob]);

  const handlePreviewClick = useCallback(() => {
    onPreview?.(image);
  }, [image, onPreview]);

  const handleDownload = useCallback(() => {
    if (!imageUrl) return;

    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = image.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    onDownload?.(image);
  }, [image, imageUrl, onDownload]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handlePreviewClick();
      }
    },
    [handlePreviewClick]
  );

  const isCompact = density === "compact";

  // Loading state
  if (loading) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <Skeleton className="aspect-square w-full" />
        <div className={cn("space-y-2", isCompact ? "p-2" : "p-3")}>
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </Card>
    );
  }

  // Error state
  if (error || !imageUrl) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <div className="aspect-square w-full bg-muted flex items-center justify-center">
          <div className="text-center p-4">
            <p className="text-sm text-muted-foreground">Failed to load image</p>
          </div>
        </div>
        <div className={cn(isCompact ? "p-2" : "p-3")}>
          <p className="font-medium truncate text-sm">{image.name}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "group overflow-hidden hover:shadow-lg transition-all duration-200",
        className
      )}
    >
      {/* Thumbnail */}
      <div
        className={cn(
          "relative cursor-pointer overflow-hidden bg-muted",
          isCompact ? "aspect-square" : "aspect-square"
        )}
        onClick={handlePreviewClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`Preview ${image.name}`}
      >
        <img
          src={imageUrl}
          alt={image.name}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          onError={() => setError(true)}
          loading="lazy"
        />

        {/* Hover Overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors",
            "flex items-center justify-center opacity-0 group-hover:opacity-100"
          )}
        >
          <Eye className="w-8 h-8 text-white drop-shadow-lg" />
        </div>
      </div>

      {/* Info Section */}
      <div className={cn(isCompact ? "p-2" : "p-3")}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p
              className={cn(
                "font-medium truncate",
                isCompact ? "text-xs" : "text-sm"
              )}
              title={image.name}
            >
              {image.name}
            </p>
            <p
              className={cn(
                "text-muted-foreground",
                isCompact ? "text-[10px]" : "text-xs"
              )}
            >
              {formatDate(image.createdAt)}
            </p>
          </div>

          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "rounded-lg hover:bg-accent/50 transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                isCompact ? "p-0.5" : "p-1"
              )}
              aria-label={`Actions for ${image.name}`}
            >
              <MoreVertical className={isCompact ? "w-3 h-3" : "w-4 h-4"} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onPreview && (
                <DropdownMenuItem onClick={() => onPreview(image)}>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </DropdownMenuItem>
              )}
              {onRename && (
                <DropdownMenuItem onClick={() => onRename(image)}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Rename
                </DropdownMenuItem>
              )}
              {onEditTags && (
                <DropdownMenuItem onClick={() => onEditTags(image)}>
                  <Tag className="w-4 h-4 mr-2" />
                  Edit Tags
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </DropdownMenuItem>
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(image)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Tags */}
        {showTags && image.tags.length > 0 && (
          <div className={cn("flex flex-wrap gap-1", isCompact ? "mt-1.5" : "mt-2")}>
            {image.tags.slice(0, maxVisibleTags).map((tag, i) => (
              <Badge
                key={i}
                variant="outline"
                className={cn(
                  "cursor-pointer hover:bg-accent",
                  isCompact ? "text-[10px] px-1.5 py-0" : "text-xs"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onTagClick?.(tag);
                }}
              >
                {tag}
              </Badge>
            ))}
            {image.tags.length > maxVisibleTags && (
              <Badge
                variant="outline"
                className={cn(isCompact ? "text-[10px] px-1.5 py-0" : "text-xs")}
              >
                +{image.tags.length - maxVisibleTags}
              </Badge>
            )}
          </div>
        )}
      </div>
    </Card>
  );
});

// Skeleton loader for ImageCard
export function ImageCardSkeleton({
  density = "comfortable",
}: {
  density?: "comfortable" | "compact";
}) {
  const isCompact = density === "compact";

  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <div className={cn("space-y-2", isCompact ? "p-2" : "p-3")}>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </Card>
  );
}
