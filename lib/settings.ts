// Settings storage key
const SETTINGS_KEY = "iu_settings";

// Types
export type GalleryDensity = "comfortable" | "compact";
export type DefaultSort = "newest" | "oldest" | "name";

export interface AppSettings {
  galleryDensity: GalleryDensity;
  defaultSort: DefaultSort;
}

export const defaultSettings: AppSettings = {
  galleryDensity: "comfortable",
  defaultSort: "newest",
};

export function getStoredSettings(): AppSettings {
  if (typeof window === "undefined") return defaultSettings;
  const stored = localStorage.getItem(SETTINGS_KEY);
  if (stored) {
    try {
      return { ...defaultSettings, ...JSON.parse(stored) };
    } catch {
      return defaultSettings;
    }
  }
  return defaultSettings;
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function updateSetting<K extends keyof AppSettings>(
  key: K,
  value: AppSettings[K]
): AppSettings {
  const current = getStoredSettings();
  const updated = { ...current, [key]: value };
  saveSettings(updated);
  return updated;
}
