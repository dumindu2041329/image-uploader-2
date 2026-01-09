"use client";

import { Suspense } from "react";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Skeleton } from "@/components/ui/skeleton";

function DashboardSkeleton() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar skeleton */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border/30 p-4 space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </aside>
      {/* Main content skeleton */}
      <div className="flex flex-1 flex-col">
        <header className="h-16 border-b border-border/30 px-6 flex items-center gap-4">
          <Skeleton className="h-10 flex-1 max-w-md" />
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-10 w-32" />
        </header>
        <main className="flex-1 p-6">
          <Skeleton className="h-64 w-full" />
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardShell>{children}</DashboardShell>
      </Suspense>
    </RequireAuth>
  );
}
