import React, { useState, useMemo } from "react";
import { 
  Grid, 
  Map as MapIcon, 
  SlidersHorizontal,
  Laptop, 
  Coffee, 
  Sparkles, 
  Wallet, 
  Flame,
  ArrowRight,
  Compass
} from "lucide-react";
import { SearchBar } from "../components/cafe/SearchBar";
import { FilterPanel } from "../components/cafe/FilterPanel";
import { CafeGrid } from "../components/cafe/CafeGrid";
import { CafeCard } from "../components/cafe/CafeCard";
import { CafeMap } from "../components/map/CafeMap";
import { useGeolocation } from "../hooks/useGeolocation";
import { useCafeFilter } from "../hooks/useCafeFilter";

export function Home({
  allCafes = [],
  isFavorite,
  onToggleFavorite,
  isInCompare,
  onToggleCompare,
  onOpenQuiz
}) {
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'map'
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const {
    userLocation,
    isLocating,
    locationError,
    requestLocation
  } = useGeolocation();

  const {
    searchQuery,
    setSearchQuery,
    selectedArea,
    setSelectedArea,
    selectedCategory,
    setSelectedCategory,
    selectedBudget,
    setSelectedBudget,
    selectedSort,
    setSelectedSort,
    selectedFacilities,
    toggleFacility,
    openOnly,
    setOpenOnly,
    resetFilters,
    activeFiltersCount,
    filteredCafes,
    paginatedCafes,
    hasMore,
    loadMore,
    totalCount
  } = useCafeFilter(allCafes, userLocation);

  // Check if any filter or search is active
  const isFilteringActive = activeFiltersCount > 0;

  // Curated Discovery Shelves from actual data (shown on discovery mode when no specific filter is active)
  const topWfcCafes = useMemo(() => {
    return allCafes
      .filter((c) => (c.wfcScore && c.wfcScore >= 9.2) || c.category?.includes("WFC"))
      .slice(0, 3);
  }, [allCafes]);

  const topSpecialtyCafes = useMemo(() => {
    return allCafes
      .filter((c) => c.category?.includes("Specialty") || c.category?.includes("Roastery"))
      .slice(0, 3);
  }, [allCafes]);

  const topBudgetCafes = useMemo(() => {
    return allCafes
      .filter((c) => c.price === "$" || (c.priceNumeric && c.priceNumeric <= 25000))
      .slice(0, 3);
  }, [allCafes]);

  // Quick Preset Handlers
  const applyPreset = (preset) => {
    resetFilters();
    if (preset === "wfc") {
      setSelectedCategory("WFC");
      toggleFacility("WiFi Kencang");
      toggleFacility("Banyak Stopkontak");
    } else if (preset === "budget") {
      setSelectedBudget("$");
    } else if (preset === "specialty") {
      setSelectedCategory("Specialty");
    } else if (preset === "outdoor") {
      toggleFacility("Area Outdoor");
    }
  };

  return (
    <div className="space-y-10 pb-16">
      
      {/* 1. HERO SECTION (Clean, Editorial, Purposeful) */}
      <section className="bg-stone-100/70 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 sm:p-10 transition-colors">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-xs font-semibold border border-amber-300/40 dark:border-amber-700/40">
            <Compass className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Direktori Kedai Kopi & WFC Jakarta</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-900 dark:text-white leading-[1.15]">
            Temukan kedai kopi yang pas untuk kebutuhanmu.
          </h1>

          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 max-w-2xl leading-relaxed">
            Cari spot kerja produktif dengan WiFi stabil dan colokan melimpah, kedai specialty artisan, atau tempat nongkrong santai yang ramah kantong di sekitarmu.
          </p>

          {/* Quick Filter Preset Chips */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 mr-1">Pilihan Cepat:</span>
            <button
              onClick={() => applyPreset("wfc")}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-amber-500 transition-colors inline-flex items-center gap-1.5 shadow-2xl"
            >
              <Laptop className="w-3.5 h-3.5 text-amber-600" />
              <span>WFC & Colokan</span>
            </button>
            <button
              onClick={() => applyPreset("specialty")}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-amber-500 transition-colors inline-flex items-center gap-1.5 shadow-sm"
            >
              <Coffee className="w-3.5 h-3.5 text-amber-600" />
              <span>Specialty & Manual Brew</span>
            </button>
            <button
              onClick={() => applyPreset("budget")}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-amber-500 transition-colors inline-flex items-center gap-1.5 shadow-sm"
            >
              <Wallet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Budget Hemat (&lt; 25rb)</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. SEARCH & TOOLBAR */}
      <section className="space-y-4" id="explore-directory">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClearSearch={() => setSearchQuery("")}
          userLocation={userLocation}
          isLocating={isLocating}
          onRequestLocation={requestLocation}
          totalCount={totalCount}
          onToggleMobileFilter={() => setShowMobileFilter(!showMobileFilter)}
          activeFiltersCount={activeFiltersCount}
        />

        {locationError && (
          <div className="p-3 text-xs rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300">
            ⚠️ {locationError}
          </div>
        )}

        {/* View Mode & Filter Summary */}
        <div className="flex items-center justify-between gap-4 pt-1">
          <div className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
            Menampilkan <span className="font-bold text-stone-900 dark:text-white">{filteredCafes.length}</span> kedai
            {selectedArea !== "Semua" && ` di Jakarta ${selectedArea}`}
            {searchQuery && ` untuk "${searchQuery}"`}
          </div>

          {/* Grid vs Map Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === "grid"
                  ? "bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-sm"
                  : "text-stone-500 hover:text-stone-900 dark:hover:text-white"
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Daftar</span>
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === "map"
                  ? "bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-sm"
                  : "text-stone-500 hover:text-stone-900 dark:hover:text-white"
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Peta</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. MAIN EXPLORER: FILTERS & DIRECTORY GRID/MAP */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Filter Panel (Desktop + Mobile Drawer) */}
        <div className={`lg:block ${showMobileFilter ? "block" : "hidden"}`}>
          <FilterPanel
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedArea={selectedArea}
            onSelectArea={setSelectedArea}
            selectedBudget={selectedBudget}
            onSelectBudget={setSelectedBudget}
            selectedSort={selectedSort}
            onSelectSort={setSelectedSort}
            selectedFacilities={selectedFacilities}
            onToggleFacility={toggleFacility}
            openOnly={openOnly}
            onToggleOpenOnly={setOpenOnly}
            onResetFilters={resetFilters}
            activeFiltersCount={activeFiltersCount}
            userLocation={userLocation}
          />
        </div>

        {/* Results Area */}
        <div className="lg:col-span-3 space-y-6">
          {viewMode === "grid" ? (
            <CafeGrid
              cafes={filteredCafes}
              paginatedCafes={paginatedCafes}
              hasMore={hasMore}
              onLoadMore={loadMore}
              isFavorite={isFavorite}
              onToggleFavorite={onToggleFavorite}
              isInCompare={isInCompare}
              onToggleCompare={onToggleCompare}
              onResetFilters={resetFilters}
              searchQuery={searchQuery}
            />
          ) : (
            <CafeMap
              cafes={filteredCafes}
              userLocation={userLocation}
            />
          )}
        </div>

      </section>

      {/* 4. CURATED DISCOVERY SHELVES (Shown when not currently in a filtered search) */}
      {!isFilteringActive && viewMode === "grid" && (
        <section className="space-y-10 pt-8 border-t border-stone-200 dark:border-stone-800">
          
          {/* Shelf 1: Top WFC Spot */}
          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Paling Direkomendasikan</span>
                <h2 className="text-xl font-extrabold text-stone-900 dark:text-white">Spot Terbaik untuk Work From Cafe (WFC)</h2>
              </div>
              <button
                onClick={() => applyPreset("wfc")}
                className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
              >
                <span>Lihat Semua WFC</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {topWfcCafes.map((cafe) => (
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
          </div>

          {/* Shelf 2: Specialty & Artisan */}
          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Kopi Nusantara & Artisan</span>
                <h2 className="text-xl font-extrabold text-stone-900 dark:text-white">Spesialis Manual Brew & In-House Roastery</h2>
              </div>
              <button
                onClick={() => applyPreset("specialty")}
                className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
              >
                <span>Lihat Specialty</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {topSpecialtyCafes.map((cafe) => (
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
          </div>

        </section>
      )}

    </div>
  );
}
