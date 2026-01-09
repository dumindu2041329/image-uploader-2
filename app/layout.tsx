import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ToastProvider } from "@/components/ui/use-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://imageuploader.app"),
  title: {
    default: "ImageUploader - Store and Manage Your Images",
    template: "%s | ImageUploader",
  },
  description: "A modern, fast, and intuitive image management platform. Upload, organize, and access your images anytime, anywhere.",
  keywords: ["image", "upload", "storage", "gallery", "photos", "manage"],
  authors: [{ name: "ImageUploader Team" }],
  creator: "ImageUploader",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://imageuploader.app",
    siteName: "ImageUploader",
    title: "ImageUploader - Store and Manage Your Images",
    description: "A modern, fast, and intuitive image management platform. Upload, organize, and access your images anytime, anywhere.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ImageUploader",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ImageUploader - Store and Manage Your Images",
    description: "A modern, fast, and intuitive image management platform.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen bg-background text-foreground`}
      >
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <div className="relative min-h-screen">
                {/* Background gradient */}
                <div className="fixed inset-0 -z-10 bg-background">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
                  <div 
                    className="absolute inset-0 opacity-[0.015]"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    }}
                  />
                </div>
                {children}
              </div>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
