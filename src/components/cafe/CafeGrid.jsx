import React from "react";
import { CafeCard } from "./CafeCard";
import { Coffee, RotateCcw, ChevronDown } from "lucide-react";

export function CafeGrid({
  cafes = [],
  paginatedCafes = [],
  hasMore = false,
  onLoadMore,
  isFavorite,
  onToggleFavorite,
  isInCompare,
  onToggleCompare,
  onQuickView,
  onResetFilters
}) {
  if (cafes.length === 0) {
    return (
      <div className="bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-3xl p-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
          <Coffee className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-stone-900 dark:text-white">
            Tidak Ada Kedai Kopi yang Cocok
          </h3>
          <p className="text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto">
            Coba ubah kata kunci pencarian, sesuaikan filter wilayah, atau hapus beberapa kriteria fasilitas.
          </p>
        </div>
        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-amber-600 hover:bg-amber-700 text-white transition-colors shadow-sm shadow-amber-600/30"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Semua Filter
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {paginatedCafes.map((cafe) => (
          <CafeCard
            key={cafe.id}
            cafe={cafe}
            isFavorite={isFavorite(cafe.id)}
            onToggleFavorite={onToggleFavorite}
            isInCompare={isInCompare(cafe.id)}
            onToggleCompare={onToggleCompare}
            onQuickView={onQuickView}
          />
        ))}
      </div>

      {/* Pagination / Load More */}
      {hasMore && (
        <div className="text-center pt-4">
          <button
            onClick={onLoadMore}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 transition-all shadow-sm group hover:scale-[1.02]"
          >
            <span>Tampilkan Lebih Banyak ({paginatedCafes.length} dari {cafes.length})</span>
            <ChevronDown className="w-4 h-4 text-amber-600 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
}
