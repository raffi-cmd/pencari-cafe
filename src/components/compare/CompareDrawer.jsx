import React from "react";
import { Link } from "react-router-dom";
import { Scale, X, ArrowRight, Trash2 } from "lucide-react";

export function CompareDrawer({
  compareList = [],
  allCafes = [],
  onRemoveFromCompare,
  onClearCompare
}) {
  if (compareList.length === 0) return null;

  const compareCafes = allCafes.filter((c) => compareList.includes(c.id));

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl bg-stone-900/95 dark:bg-stone-950/95 text-white backdrop-blur-md border border-stone-700/80 rounded-2xl p-3.5 shadow-2xl animate-fade-in">
      <div className="flex items-center justify-between gap-3">
        
        {/* Left Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Komparasi Kedai
            </div>
            <div className="text-xs font-medium text-stone-200">
              {compareList.length}/3 kedai dipilih
            </div>
          </div>
        </div>

        {/* Center Thumbnails */}
        <div className="hidden sm:flex items-center gap-2">
          {compareCafes.map((cafe) => (
            <div
              key={cafe.id}
              className="relative group w-9 h-9 rounded-lg overflow-hidden border border-stone-600 shrink-0"
            >
              <img
                src={cafe.image}
                alt={cafe.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => onRemoveFromCompare(cafe.id)}
                className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onClearCompare}
            className="p-2 text-stone-400 hover:text-white transition-colors"
            title="Kosongkan komparasi"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <Link
            to="/compare"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/30 whitespace-nowrap"
          >
            <span>Bandingkan ({compareList.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
