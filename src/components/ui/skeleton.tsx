"use client";
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: any) {
  return <div className={cn("animate-pulse rounded-full bg-slate-200 dark:bg-slate-800", className)} {...props} />;
}

export function SkeletonCard() {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-white p-5 dark:bg-slate-900 dark:border-slate-800">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="mt-4 h-8 w-32" />
      <Skeleton className="mt-3 h-3 w-full" />
      <Skeleton className="mt-2 h-3 w-2/3" />
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-2xl border border-slate-100 p-4 dark:border-slate-800">
          <Skeleton className="h-12 w-12 rounded-[14px]" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  );
}
