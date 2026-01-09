"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ImageIcon, Menu, X } from "lucide-react";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function PublicNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/30">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl group">
          <div className="h-9 w-9 rounded-xl bg-primary shadow-lg shadow-primary/25 flex items-center justify-center transition-transform group-hover:scale-105">
            <ImageIcon className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">ImageVault</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>
        
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <Link href="/auth/sign-in">
            <Button variant="ghost" className="rounded-xl">Sign In</Button>
          </Link>
          <Link href="/auth/sign-up">
            <Button className="rounded-xl">Get Started</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/30 glass-subtle animate-in">
          <div className="container py-4 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t border-border/30">
              <Link href="/auth/sign-in" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" className="w-full rounded-xl">Sign In</Button>
              </Link>
              <Link href="/auth/sign-up" onClick={() => setMobileOpen(false)}>
                <Button className="w-full rounded-xl">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
