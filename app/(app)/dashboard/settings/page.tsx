"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useTheme } from "@/components/theme/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { listImages } from "@/lib/imageStore";
import {
  type AppSettings,
  defaultSettings,
  getStoredSettings,
  saveSettings,
} from "@/lib/settings";
import {
  Sun,
  Moon,
  Monitor,
  LayoutGrid,
  Grid3X3,
  ArrowUpDown,
  Download,
  Info,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

// App version
const APP_VERSION = "1.0.0";

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [mounted, setMounted] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Load settings on mount
  useEffect(() => {
    setSettings(getStoredSettings());
    setMounted(true);
  }, []);

  // Save settings when they change
  useEffect(() => {
    if (mounted) {
      saveSettings(settings);
    }
  }, [settings, mounted]);

  const updateSetting = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    toast("Settings saved", "success");
  };

  const handleExportMetadata = async (includeBlobs: boolean = false) => {
    if (!user) return;
    setExporting(true);

    try {
      const images = await listImages(user.id);

      const exportData = {
        exportedAt: new Date().toISOString(),
        userId: user.id,
        userName: user.name,
        imageCount: images.length,
        images: images.map((img) => ({
          id: img.id,
          name: img.name,
          tags: img.tags,
          createdAt: img.createdAt,
        })),
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `image-uploader-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast(`Exported ${images.length} image metadata`, "success");
    } catch (error) {
      toast("Failed to export data", "error");
    } finally {
      setExporting(false);
    }
  };

  const themeOptions = [
    { value: "light" as const, label: "Light", icon: Sun },
    { value: "dark" as const, label: "Dark", icon: Moon },
    { value: "system" as const, label: "System", icon: Monitor },
  ];

  const densityOptions = [
    {
      value: "comfortable" as const,
      label: "Comfortable",
      icon: LayoutGrid,
      description: "Larger cards with more spacing",
    },
    {
      value: "compact" as const,
      label: "Compact",
      icon: Grid3X3,
      description: "Smaller cards, more images visible",
    },
  ];

  const sortOptions = [
    { value: "newest" as const, label: "Newest First" },
    { value: "oldest" as const, label: "Oldest First" },
    { value: "name" as const, label: "Name (A-Z)" },
  ];

  if (!mounted) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Customize your experience
        </p>
      </div>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>
            Customize how the app looks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Selection */}
          <div className="space-y-3">
            <Label>Theme</Label>
            <div className="grid grid-cols-3 gap-3">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    theme === option.value
                      ? "border-primary bg-primary/10"
                      : "border-border/50 hover:border-border hover:bg-accent/50"
                  }`}
                >
                  <option.icon
                    className={`h-6 w-6 ${
                      theme === option.value ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      theme === option.value ? "text-primary" : ""
                    }`}
                  >
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gallery Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutGrid className="h-5 w-5" />
            Gallery Preferences
          </CardTitle>
          <CardDescription>
            Configure how your images are displayed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Gallery Density */}
          <div className="space-y-3">
            <Label>Gallery Density</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {densityOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateSetting("galleryDensity", option.value)}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                    settings.galleryDensity === option.value
                      ? "border-primary bg-primary/10"
                      : "border-border/50 hover:border-border hover:bg-accent/50"
                  }`}
                >
                  <option.icon
                    className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                      settings.galleryDensity === option.value
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                  <div>
                    <span
                      className={`text-sm font-medium block ${
                        settings.galleryDensity === option.value ? "text-primary" : ""
                      }`}
                    >
                      {option.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {option.description}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Default Sort */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4" />
              Default Sort Order
            </Label>
            <div className="flex flex-wrap gap-2">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateSetting("defaultSort", option.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    settings.defaultSort === option.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/50 hover:bg-secondary"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>




    </div>
  );
}
