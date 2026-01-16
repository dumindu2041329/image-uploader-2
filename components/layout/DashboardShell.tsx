"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  ImageIcon,
  LayoutDashboard,
  Upload,
  Images,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const sidebarLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/upload", label: "Upload", icon: Upload, exact: true },
  { href: "/dashboard/gallery", label: "Gallery", icon: Images, exact: false },
  { href: "/dashboard/profile", label: "Profile", icon: User, exact: true },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, exact: true },
];

// Bottom nav links for mobile (subset of main links)
const bottomNavLinks = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/gallery", label: "Gallery", icon: Images, exact: false },
  { href: "/dashboard/upload", label: "Upload", icon: Upload, exact: true },
  { href: "/dashboard/profile", label: "Profile", icon: User, exact: true },
];

function isLinkActive(pathname: string, href: string, exact: boolean): boolean {
  if (exact) {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isGalleryPage = pathname === "/dashboard/gallery" || pathname.startsWith("/dashboard/gallery/");

  // Sync search query with URL params when on gallery page
  useEffect(() => {
    if (isGalleryPage) {
      const q = searchParams.get("q") || "";
      setSearchQuery(q);
    } else {
      setSearchQuery("");
    }
  }, [isGalleryPage, searchParams]);

  // Handle search submission
  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (isGalleryPage) {
        const params = new URLSearchParams(searchParams.toString());
        if (searchQuery.trim()) {
          params.set("q", searchQuery.trim());
        } else {
          params.delete("q");
        }
        router.push(`/dashboard/gallery?${params.toString()}`);
      } else if (searchQuery.trim()) {
        // Navigate to gallery with search query
        router.push(`/dashboard/gallery?q=${encodeURIComponent(searchQuery.trim())}`);
      }
    },
    [isGalleryPage, searchQuery, searchParams, router]
  );

  // Keyboard shortcut: Cmd/Ctrl + K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      // Close mobile menu on Escape
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  // Trap focus in mobile menu when open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col glass-subtle border-r border-border/30">
        <div className="flex h-16 items-center gap-2 border-b border-border/30 px-6">
          <Link href="/dashboard" className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg">
            <div className="h-9 w-9 rounded-xl bg-primary shadow-lg shadow-primary/25 flex items-center justify-center">
              <ImageIcon className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">ImageVault</span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 p-4" role="navigation" aria-label="Main navigation">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = isLinkActive(pathname, link.href, link.exact);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <div
            className="fixed inset-0 bg-background/60 backdrop-blur-md"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <aside className="fixed left-0 top-0 h-full w-64 flex flex-col glass-strong border-r border-border/30 animate-in slide-in-from-left duration-300">
            <div className="flex h-16 items-center justify-between px-6 border-b border-border/30">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-primary shadow-lg shadow-primary/25 flex items-center justify-center">
                  <ImageIcon className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg">ImageVault</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-accent/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <nav className="flex-1 space-y-1 p-4" role="navigation" aria-label="Mobile navigation">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                const isActive = isLinkActive(pathname, link.href, link.exact);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Sign out in mobile drawer */}
            <div className="p-4 border-t border-border/30">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut();
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 items-center justify-between gap-4 border-b border-border/30 px-4 md:px-6 glass-subtle">
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-accent/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
              <Input
                ref={searchInputRef}
                type="search"
                placeholder={isGalleryPage ? "Search gallery..." : "Search images... (⌘K)"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 h-10"
                aria-label="Search images"
              />
            </div>
          </form>

          <div className="flex-1 sm:hidden" />

          <div className="flex items-center gap-2">
            {/* Mobile search button */}
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden rounded-xl"
              onClick={() => router.push("/dashboard/gallery")}
              aria-label="Go to gallery search"
            >
              <Search className="h-5 w-5" aria-hidden="true" />
            </Button>

            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary hover:bg-accent/50 hover:text-accent-foreground h-10 px-3">
                {user?.avatarDataUrl ? (
                  <img
                    src={user.avatarDataUrl}
                    alt=""
                    className="h-8 w-8 rounded-xl object-cover ring-2 ring-border/50"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-xl bg-primary shadow-md shadow-primary/25 flex items-center justify-center text-primary-foreground text-sm font-semibold">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <span className="hidden lg:inline max-w-[120px] truncate">{user?.name}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium truncate max-w-[180px]">{user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[180px]">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/dashboard/profile">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" aria-hidden="true" />
                    Profile
                  </DropdownMenuItem>
                </Link>
                <Link href="/dashboard/settings">
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" aria-hidden="true" />
                    Settings
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 h-16 glass-strong border-t border-border/30 flex items-center justify-around px-2 z-40"
          role="navigation"
          aria-label="Mobile bottom navigation"
        >
          {bottomNavLinks.map((link) => {
            const Icon = link.icon;
            const isActive = isLinkActive(pathname, link.href, link.exact);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl min-w-[60px] transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 transition-transform duration-200",
                    isActive && "scale-110"
                  )}
                  aria-hidden="true"
                />
                <span className={cn("text-[10px] font-medium", isActive && "font-semibold")}>
                  {link.label}
                </span>
                {isActive && (
                  <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
