import React from "react";
import { 
  CATEGORIES, 
  AREAS, 
  PRICE_FILTERS, 
  ALL_FACILITIES 
} from "../../data/cafes";
import { 
  RotateCcw, 
  Check, 
  Clock, 
  SlidersHorizontal, 
  Laptop, 
  Coffee, 
  Camera, 
  Wallet, 
  Compass, 
  Flame, 
  Sparkles 
} from "lucide-react";

// Icon mapping for categories
const categoryIcons = {
  all: Sparkles,
  WFC: Laptop,
  Specialty: Coffee,
  Aesthetic: Camera,
  Budget: Wallet,
  Vintage: Compass,
  Roastery: Flame
};

export function FilterPanel({
  selectedCategory,
  onSelectCategory,
  selectedArea,
  onSelectArea,
  selectedBudget,
  onSelectBudget,
  selectedSort,
  onSelectSort,
  selectedFacilities,
  onToggleFacility,
  openOnly,
  onToggleOpenOnly,
  onResetFilters,
  activeFiltersCount,
  userLocation
}) {
  return (
    <aside className="bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-2xl p-5 space-y-6 shadow-sm">
      
      {/* Header with Reset */}
      <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-amber-600" />
          <h3 className="font-bold text-sm text-stone-900 dark:text-white">
            Filter & Pengurutan
          </h3>
        </div>

        {activeFiltersCount > 0 && (
          <button
            onClick={onResetFilters}
            className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* Sorting */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 block">
          Urutkan Berdasarkan
        </label>
        <select
          value={selectedSort}
          onChange={(e) => onSelectSort(e.target.value)}
          className="w-full text-xs sm:text-sm font-medium px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="rating-desc">⭐ Rating Tertinggi</option>
          <option value="reviews-desc">🔥 Paling Populer (Ulasan)</option>
          <option value="wfc-desc">⚡ WFC Score Terbaik</option>
          <option value="price-asc">💰 Harga: Termurah ke Termahal</option>
          <option value="price-desc">💎 Harga: Termahal ke Termurah</option>
          {userLocation && (
            <option value="distance-asc">📍 Jarak Terdekat</option>
          )}
        </select>
      </div>

      {/* Categories */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 block">
          Kategori Vibe
        </label>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => {
            const Icon = categoryIcons[cat.id] || Sparkles;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? "bg-amber-600 text-white shadow-sm shadow-amber-600/30 scale-105"
                    : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Area Wilayah */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 block">
          Wilayah Jakarta
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {AREAS.map((area) => (
            <button
              key={area}
              onClick={() => onSelectArea(area)}
              className={`py-1.5 px-2 rounded-xl text-xs font-semibold text-center transition-all ${
                selectedArea === area
                  ? "bg-stone-900 text-white dark:bg-white dark:text-stone-900 font-bold"
                  : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700"
              }`}
            >
              {area === "Semua" ? "Semua" : `Jak-${area}`}
            </button>
          ))}
        </div>
      </div>

      {/* Range Budget */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 block">
          Estimasi Budget
        </label>
        <div className="space-y-1.5">
          {PRICE_FILTERS.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelectBudget(p.id)}
              className={`w-full px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all flex items-center justify-between ${
                selectedBudget === p.id
                  ? "bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700 font-bold"
                  : "bg-stone-50 dark:bg-stone-800/50 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
              }`}
            >
              <span>{p.label}</span>
              {selectedBudget === p.id && <Check className="w-3.5 h-3.5 text-amber-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Facilities Multi-Select */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 block">
          Fasilitas Penting
        </label>
        <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
          {ALL_FACILITIES.map((facility) => {
            const isChecked = selectedFacilities.includes(facility);
            return (
              <label
                key={facility}
                className="flex items-center gap-2 text-xs text-stone-700 dark:text-stone-300 cursor-pointer hover:text-amber-600 transition-colors py-0.5"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggleFacility(facility)}
                  className="rounded border-stone-300 text-amber-600 focus:ring-amber-500 dark:border-stone-700 dark:bg-stone-800"
                />
                <span>{facility}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Real-time Open Only Toggle */}
      <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-500" />
            Hanya yang Buka Sekarang
          </span>
          <input
            type="checkbox"
            checked={openOnly}
            onChange={(e) => onToggleOpenOnly(e.target.checked)}
            className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-stone-300 dark:border-stone-700 dark:bg-stone-800"
          />
        </label>
      </div>

    </aside>
  );
}
