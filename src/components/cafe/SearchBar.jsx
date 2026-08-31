import React from "react";
import { Search, X, MapPin, Loader2, SlidersHorizontal } from "lucide-react";

export function SearchBar({
  searchQuery,
  onSearchChange,
  onClearSearch,
  userLocation,
  isLocating,
  onRequestLocation,
  totalCount,
  onToggleMobileFilter,
  activeFiltersCount = 0
}) {
  return (
    <div className="w-full bg-white dark:bg-stone-900 p-3 sm:p-4 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-sm transition-colors">
      <div className="flex flex-col sm:flex-row items-center gap-2.5">
        
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari kedai, nama jalan, atau fasilitas (cth: Musala, Senopati, Tuku)..."
            className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/80 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-stone-800 transition-all text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
          />
          {searchQuery && (
            <button
              onClick={onClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Geolocation Button */}
          <button
            onClick={onRequestLocation}
            disabled={isLocating}
            className={`flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center justify-center gap-1.5 shadow-sm ${
              userLocation
                ? "bg-amber-100 border-amber-300 text-amber-900 dark:bg-amber-950 dark:border-amber-700 dark:text-amber-300"
                : "bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700"
            }`}
            title="Temukan kedai terdekat dari lokasimu"
          >
            {isLocating ? (
              <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
            ) : (
              <MapPin className={`w-4 h-4 ${userLocation ? "text-amber-600 dark:text-amber-400" : "text-stone-500"}`} />
            )}
            <span className="whitespace-nowrap">
              {userLocation ? "Lokasi Aktif" : "Dekat Saya"}
            </span>
          </button>

          {/* Mobile Filter Button */}
          {onToggleMobileFilter && (
            <button
              onClick={onToggleMobileFilter}
              className="lg:hidden px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filter</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[11px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
