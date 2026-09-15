import React from "react";
import { CafeCard } from "./CafeCard";
import { SkeletonCard } from "../common/SkeletonCard";
import { SearchX, RotateCcw, ChevronDown, Coffee } from "lucide-react";

export function CafeGrid({
  cafes = [],
  paginatedCafes = [],
  isLoading = false,
  hasMore = false,
  onLoadMore,
  isFavorite,
  onToggleFavorite,
  isInCompare,
  onToggleCompare,
  onResetFilters,
  searchQuery = ""
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <SkeletonCard key={idx} />
        ))}
      </div>
    );
  }

  if (cafes.length === 0) {
    return (
      <div className="bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-3xl p-10 sm:p-14 text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
          {searchQuery ? <SearchX className="w-7 h-7" /> : <Coffee className="w-7 h-7" />}
        </div>
        
        <div className="space-y-1.5 max-w-md mx-auto">
          <h3 className="text-lg font-bold text-stone-900 dark:text-white">
            {searchQuery ? `Tidak ada kedai dengan kata kunci "${searchQuery}"` : "Tidak ada kedai yang cocok dengan filter"}
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            {searchQuery
              ? "Coba periksa ejaan, gunakan kata kunci yang lebih umum (cth: 'Senopati', 'Tuku', 'WiFi'), atau reset filter."
              : "Coba longgarkan kriteria wilayah, rentang budget, atau hapus beberapa pilihan fasilitas."}
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-stone-900 dark:bg-white text-white dark:text-stone-900 hover:bg-amber-600 dark:hover:bg-amber-400 transition-colors shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Semua Filter & Pencarian</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {paginatedCafes.map((cafe) => (
          <CafeCard
            key={cafe.id}
            cafe={cafe}
            isFavorite={isFavorite(cafe.id)}
            onToggleFavorite={onToggleFavorite}
            isInCompare={isInCompare(cafe.id)}
            onToggleCompare={onToggleCompare}
          />
        ))}
      </div>

      {/* Pagination / Load More */}
      {hasMore && (
        <div className="text-center pt-2">
          <button
            onClick={onLoadMore}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 transition-all shadow-sm group"
          >
            <span>Tampilkan Lebih Banyak ({paginatedCafes.length} dari {cafes.length})</span>
            <ChevronDown className="w-4 h-4 text-amber-600 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
}
