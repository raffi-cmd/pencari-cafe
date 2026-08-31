import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Search, Trash2, ArrowLeft, Coffee, Scale } from "lucide-react";
import { CafeCard } from "../components/cafe/CafeCard";

export function Favorites({
  allCafes = [],
  favorites = [],
  onToggleFavorite,
  onClearFavorites,
  isInCompare,
  onToggleCompare,
  onQuickView
}) {
  const [query, setQuery] = useState("");

  const favoriteCafes = allCafes.filter((c) => favorites.includes(c.id));
  
  const filteredFavorites = favoriteCafes.filter((cafe) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      cafe.name?.toLowerCase().includes(q) ||
      cafe.area?.toLowerCase().includes(q) ||
      cafe.facilities?.some((f) => f.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 pb-16 animate-fade-in max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            <h1 className="text-2xl font-extrabold text-stone-900 dark:text-white">
              Kedai Kopi Favorit ({favoriteCafes.length})
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Daftar spot ngopi dan WFC pilihan yang kamu simpan ke peramban
          </p>
        </div>

        {favoriteCafes.length > 0 && (
          <button
            onClick={onClearFavorites}
            className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus Semua Favorit</span>
          </button>
        )}
      </div>

      {favoriteCafes.length === 0 ? (
        /* Empty State */
        <div className="text-center py-20 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-stone-900 dark:text-white">
              Belum Ada Kedai Favorit
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
              Kamu bisa menekan ikon hati ❤️ pada kartu kedai di halaman utama untuk menyimpannya di sini.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-600 hover:bg-amber-700 text-white transition-colors"
          >
            <Coffee className="w-4 h-4" />
            Jelajah Kedai Kopi
          </Link>
        </div>
      ) : (
        /* Content */
        <div className="space-y-6">
          {/* Quick Search within favorites */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari dalam favorit kamu..."
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredFavorites.map((cafe) => (
              <CafeCard
                key={cafe.id}
                cafe={cafe}
                isFavorite={true}
                onToggleFavorite={onToggleFavorite}
                isInCompare={isInCompare(cafe.id)}
                onToggleCompare={onToggleCompare}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
