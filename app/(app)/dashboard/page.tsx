"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import * as imageStore from "@/lib/imageStore";
import type { ImageWithSize } from "@/lib/imageStore";
import {
  Images,
  HardDrive,
  Clock,
  Upload,
  GalleryHorizontalEnd,
  UserCircle,
  Download,
  Calendar,
  Tag,
} from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  totalImages: number;
  storageUsed: number;
  recentUploads: number;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 MB";
  const mb = bytes / (1024 * 1024);
  if (mb < 0.01) return "< 0.01 MB";
  return `${mb.toFixed(2)} MB`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalImages: 0,
    storageUsed: 0,
    recentUploads: 0,
  });
  const [recentImages, setRecentImages] = useState<ImageWithSize[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageWithSize | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const data = await imageStore.getImagesWithStats(user.id);
      setStats({
        totalImages: data.totalCount,
        storageUsed: data.totalSize,
        recentUploads: data.recentCount,
      });
      // Get up to 8 most recent images
      setRecentImages(data.images.slice(0, 8));
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const openPreview = async (image: ImageWithSize) => {
    setSelectedImage(image);
    const blob = await imageStore.getImageBlob(image.id);
    if (blob) {
      setPreviewUrl(URL.createObjectURL(blob));
    }
  };

  const closePreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedImage(null);
    setPreviewUrl(null);
  };

  const handleDownload = () => {
    if (previewUrl && selectedImage) {
      const a = document.createElement("a");
      a.href = previewUrl;
      a.download = selectedImage.name;
      a.click();
    }
  };

  const statsCards = [
    {
      title: "Total Images",
      value: stats.totalImages.toString(),
      icon: Images,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Storage Used",
      value: formatBytes(stats.storageUsed),
      icon: HardDrive,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Recent Uploads",
      value: stats.recentUploads.toString(),
      subtitle: "Last 7 days",
      icon: Clock,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  const quickActions = [
    {
      label: "Upload images",
      href: "/dashboard/upload",
      icon: Upload,
      variant: "default" as const,
    },
    {
      label: "View gallery",
      href: "/dashboard/gallery",
      icon: GalleryHorizontalEnd,
      variant: "secondary" as const,
    },
    {
      label: "Edit profile",
      href: "/dashboard/profile",
      icon: UserCircle,
      variant: "outline" as const,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.name?.split(" ")[0] || "there"}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s an overview of your image library
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? [...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-20" />
                </CardContent>
              </Card>
            ))
          : statsCards.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  {stat.subtitle && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.subtitle}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Button variant={action.variant} className="gap-2">
                <action.icon className="h-4 w-4" />
                {action.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Uploads */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Uploads</h2>
          {recentImages.length > 0 && (
            <Link href="/dashboard/gallery">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                View all
              </Button>
            </Link>
          )}
        </div>

        {loading ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-shrink-0">
                <Skeleton className="h-32 w-32 rounded-xl" />
              </div>
            ))}
          </div>
        ) : recentImages.length === 0 ? (
          <Card className="p-8 text-center">
            <Images className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <h3 className="font-medium mb-1">No images yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload your first image to get started
            </p>
            <Link href="/dashboard/upload">
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload Images
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
            {recentImages.map((image) => (
              <RecentImageThumbnail
                key={image.id}
                image={image}
                onClick={() => openPreview(image)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Image Preview Dialog */}
      <Dialog open={selectedImage !== null} onOpenChange={closePreview}>
        <DialogContent onClose={closePreview} className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="truncate pr-8">
              {selectedImage?.name}
            </DialogTitle>
            <DialogDescription>
              Uploaded on {selectedImage && formatDate(selectedImage.createdAt)}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Image Preview */}
            <div className="relative aspect-video bg-muted rounded-xl overflow-hidden">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt={selectedImage?.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Skeleton className="w-full h-full" />
                </div>
              )}
            </div>

            {/* Image Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{selectedImage && formatDate(selectedImage.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <HardDrive className="h-4 w-4" />
                <span>{selectedImage && formatBytes(selectedImage.size)}</span>
              </div>
            </div>

            {/* Tags */}
            {selectedImage && selectedImage.tags.length > 0 && (
              <div className="flex items-start gap-2">
                <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="flex flex-wrap gap-1">
                  {selectedImage.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={closePreview}>
                Close
              </Button>
              <Button onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RecentImageThumbnail({
  image,
  onClick,
}: {
  image: ImageWithSize;
  onClick: () => void;
}) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    imageStore.getImageBlob(image.id).then((blob) => {
      if (blob && mounted) {
        setBlobUrl(URL.createObjectURL(blob));
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [image.id]);

  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 group relative overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label={`View ${image.name}`}
    >
      <div className="h-32 w-32 bg-muted">
        {loading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <img
            src={blobUrl || ""}
            alt={image.name}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        )}
      </div>
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-end">
        <div className="w-full p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <p className="text-xs font-medium truncate">{image.name}</p>
        </div>
      </div>
    </button>
  );
}
