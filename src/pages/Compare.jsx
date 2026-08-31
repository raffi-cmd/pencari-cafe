import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Scale, Plus, Sparkles, ArrowLeft } from "lucide-react";
import { CompareTable } from "../components/compare/CompareTable";

export function Compare({
  allCafes = [],
  compareList = [],
  onRemoveFromCompare,
  onClearCompare,
  onAddToCompare
}) {
  const [showAddModal, setShowAddModal] = useState(false);

  const selectedCafes = allCafes.filter((c) => compareList.includes(c.id));
  const availableCafes = allCafes.filter((c) => !compareList.includes(c.id));

  return (
    <div className="space-y-6 pb-16 animate-fade-in max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Scale className="w-6 h-6 text-blue-500" />
            <h1 className="text-2xl font-extrabold text-stone-900 dark:text-white">
              Bandingkan Kedai Kopi
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Komparasi fasilitas, colokan, kecepatan internet, dan harga secara side-by-side (maks. 3 kedai)
          </p>
        </div>

        {selectedCafes.length < 3 && availableCafes.length > 0 && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-sm shadow-blue-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Kedai ({selectedCafes.length}/3)</span>
          </button>
        )}
      </div>

      {/* Main Comparison Matrix */}
      <CompareTable
        cafes={selectedCafes}
        onRemoveCafe={onRemoveFromCompare}
        onClearAll={onClearCompare}
      />

      {/* Add Cafe Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-stone-900 dark:text-white">
                Pilih Kedai untuk Dibandingkan
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 text-xs font-bold"
              >
                Tutup
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto custom-scrollbar space-y-2 pr-1">
              {availableCafes.map((cafe) => (
                <div
                  key={cafe.id}
                  onClick={() => {
                    onAddToCompare(cafe.id);
                    setShowAddModal(false);
                  }}
                  className="p-3 rounded-2xl border border-stone-200 dark:border-stone-800 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 cursor-pointer transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={cafe.image}
                      alt={cafe.name}
                      className="w-10 h-10 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-stone-900 dark:text-white truncate">
                        {cafe.name}
                      </div>
                      <div className="text-[11px] text-stone-500">
                        Jak-{cafe.area} • {cafe.price} • ⭐ {cafe.rating}
                      </div>
                    </div>
                  </div>
                  <Plus className="w-4 h-4 text-blue-600 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
