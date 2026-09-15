import React from "react";

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl overflow-hidden shadow-sm flex flex-col h-full animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-[16/10] bg-stone-200 dark:bg-stone-800 w-full" />

      {/* Content Skeleton */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-20" />
          <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-12" />
        </div>

        <div className="h-5 bg-stone-200 dark:bg-stone-800 rounded w-3/4" />
        <div className="h-3.5 bg-stone-100 dark:bg-stone-800/60 rounded w-full" />

        <div className="flex gap-1.5 pt-2">
          <div className="h-5 bg-stone-100 dark:bg-stone-800 rounded-md w-16" />
          <div className="h-5 bg-stone-100 dark:bg-stone-800 rounded-md w-20" />
        </div>

        <div className="mt-auto pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div className="h-3.5 bg-stone-200 dark:bg-stone-800 rounded w-24" />
          <div className="h-7 bg-stone-200 dark:bg-stone-800 rounded-lg w-16" />
        </div>
      </div>
    </div>
  );
}
