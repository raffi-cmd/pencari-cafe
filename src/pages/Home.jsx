import React, { useState } from "react";
import { 
  Compass, 
  Map as MapIcon, 
  Grid, 
  Sparkles, 
  Coffee, 
  Shuffle, 
  Zap, 
  SlidersHorizontal,
  Flame
} from "lucide-react";
import { SearchBar } from "../components/cafe/SearchBar";
import { FilterPanel } from "../components/cafe/FilterPanel";
import { CafeGrid } from "../components/cafe/CafeGrid";
import { CafeMap } from "../components/map/CafeMap";
import { CafeModal } from "../components/cafe/CafeModal";
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
  const [modalCafe, setModalCafe] = useState(null);
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

  // Pick a random cafe
  const pickRandomCafe = () => {
    if (allCafes.length === 0) return;
    const random = allCafes[Math.floor(Math.random() * allCafes.length)];
    setModalCafe(random);
  };

  // Average Rating
  const avgRating = (
    allCafes.reduce((acc, c) => acc + (c.rating || 0), 0) / (allCafes.length || 1)
  ).toFixed(1);

  return (
    <div className="space-y-8 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-900 via-stone-900 to-amber-950 text-white p-6 sm:p-10 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Direktori Kedai Kopi & WFC #1 Terkurasi</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Temukan Spot Ngopi & <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Work From Cafe
            </span> Terbaik di Sekitarmu.
          </h1>

          <p className="text-sm sm:text-base text-stone-300 max-w-2xl leading-relaxed">
            Filter puluhan kedai kopi lokal berdasarkan kecepatan WiFi, jumlah stopkontak, suasana nugas, budget hemat, hingga posisi real-time di peta.
          </p>

          {/* Quick Metrics Bar & CTA */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-6 py-2 px-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Total Kedai</span>
                <span className="font-extrabold text-base text-amber-400">{allCafes.length}</span>
              </div>
              <div className="border-l border-white/20 pl-6">
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Wilayah</span>
                <span className="font-extrabold text-base text-amber-400">5 Area</span>
              </div>
              <div className="border-l border-white/20 pl-6">
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Rata-rata Rating</span>
                <span className="font-extrabold text-base text-amber-400">⭐ {avgRating}</span>
              </div>
            </div>

            {/* Random Pick Button */}
            <button
              onClick={pickRandomCafe}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold border border-white/20 transition-all flex items-center gap-2"
            >
              <Shuffle className="w-4 h-4 text-amber-400" />
              <span>Pilihin Acak Dong!</span>
            </button>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-amber-600/20 to-transparent pointer-events-none" />
      </section>

      {/* SEARCH BAR & CONTROLS */}
      <section className="space-y-4">
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

        {/* View Mode & Results Count Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
            Menampilkan <span className="font-bold text-stone-900 dark:text-white">{filteredCafes.length}</span> kedai kopi
            {selectedArea !== "Semua" && ` di Jak-${selectedArea}`}
          </div>

          {/* Grid vs Map Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === "grid"
                  ? "bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-sm"
                  : "text-stone-500 hover:text-stone-900 dark:hover:text-white"
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
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

      {/* MAIN CONTENT: FILTER SIDEBAR & GRID/MAP */}
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

        {/* Content Area: Grid or Map */}
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
              onQuickView={(cafe) => setModalCafe(cafe)}
              onResetFilters={resetFilters}
            />
          ) : (
            <CafeMap
              cafes={filteredCafes}
              userLocation={userLocation}
              onSelectCafe={(cafe) => setModalCafe(cafe)}
              selectedCafeId={modalCafe?.id}
            />
          )}
        </div>

      </section>

      {/* Quick View Modal */}
      {modalCafe && (
        <CafeModal
          cafe={modalCafe}
          onClose={() => setModalCafe(null)}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
          isInCompare={isInCompare}
          onToggleCompare={onToggleCompare}
        />
      )}

    </div>
  );
}
