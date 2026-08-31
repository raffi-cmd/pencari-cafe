import React from "react";
import { Link } from "react-router-dom";
import { 
  Heart, 
  Scale, 
  MapPin, 
  Clock, 
  Wifi, 
  Zap, 
  Sparkles, 
  CheckCircle2, 
  XCircle,
  Eye,
  Navigation
} from "lucide-react";
import { StarRating } from "../common/StarRating";
import { isCafeOpen } from "../../hooks/useCafeFilter";

export function CafeCard({
  cafe,
  isFavorite = false,
  onToggleFavorite,
  isInCompare = false,
  onToggleCompare,
  onQuickView
}) {
  const isOpen = isCafeOpen(cafe.openHours);
  const fallbackImg = "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="group bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-amber-500/50 dark:hover:border-amber-500/40 transition-all duration-300 flex flex-col h-full">
      
      {/* Image & Badges Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100 dark:bg-stone-800">
        <img
          src={cafe.image || fallbackImg}
          alt={cafe.name}
          onError={(e) => {
            e.target.src = fallbackImg;
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Open / Closed Badge */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-md shadow-sm ${
                isOpen
                  ? "bg-emerald-500/90 text-white"
                  : "bg-rose-500/90 text-white"
              }`}
            >
              {isOpen ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  Buka Sekarang
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
                  Tutup
                </>
              )}
            </span>

            {/* WFC Score Badge */}
            {cafe.wfcScore && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/90 text-white backdrop-blur-md shadow-sm">
                ⚡ WFC {cafe.wfcScore}
              </span>
            )}
          </div>

          {/* Action Buttons: Favorite & Compare */}
          <div className="flex items-center gap-1.5">
            {/* Compare Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleCompare?.(cafe.id);
              }}
              title={isInCompare ? "Hapus dari komparasi" : "Bandingkan kedai"}
              className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-sm ${
                isInCompare
                  ? "bg-blue-600 text-white scale-105"
                  : "bg-black/40 text-white hover:bg-blue-600"
              }`}
            >
              <Scale className="w-4 h-4" />
            </button>

            {/* Favorite Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite?.(cafe.id);
              }}
              title={isFavorite ? "Hapus dari favorit" : "Simpan ke favorit"}
              className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-sm ${
                isFavorite
                  ? "bg-rose-500 text-white scale-105"
                  : "bg-black/40 text-white hover:bg-rose-500"
              }`}
            >
              <Heart
                className={`w-4 h-4 ${isFavorite ? "fill-white" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Bottom Distance & Area Pill */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-black/60 text-white backdrop-blur-md">
            📍 Jak-{cafe.area}
          </span>
          {cafe.distanceKm !== undefined && cafe.distanceKm !== null && (
            <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-amber-600/90 text-white backdrop-blur-md flex items-center gap-1">
              <Navigation className="w-3 h-3" />
              {cafe.distanceKm} km
            </span>
          )}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        
        {/* Rating & Price Row */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <StarRating rating={cafe.rating} count={cafe.reviewCount} />
          <span className="px-2 py-0.5 rounded-md text-xs font-extrabold bg-stone-100 dark:bg-stone-800 text-amber-700 dark:text-amber-400">
            {cafe.price} <span className="font-normal text-[11px] text-stone-500">({cafe.priceNumeric ? `~${(cafe.priceNumeric / 1000)}k` : "Variatif"})</span>
          </span>
        </div>

        {/* Title & Tagline */}
        <Link to={`/cafe/${cafe.id}`} className="group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
          <h3 className="font-bold text-base sm:text-lg text-stone-900 dark:text-white line-clamp-1">
            {cafe.name}
          </h3>
        </Link>
        <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 mt-1 mb-3">
          {cafe.tagline || cafe.shortAddress}
        </p>

        {/* Facilities Chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {cafe.facilities?.slice(0, 3).map((facility, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300"
            >
              {facility.includes("WiFi") && <Wifi className="w-3 h-3 text-amber-500" />}
              {facility.includes("Stopkontak") && <Zap className="w-3 h-3 text-amber-500" />}
              {facility}
            </span>
          ))}
          {cafe.facilities?.length > 3 && (
            <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-500">
              +{cafe.facilities.length - 3} lagi
            </span>
          )}
        </div>

        {/* Footer info & CTA buttons */}
        <div className="mt-auto pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[11px] truncate max-w-[120px] sm:max-w-none">{cafe.openHours}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {onQuickView && (
              <button
                onClick={() => onQuickView(cafe)}
                title="Lihat Cepat"
                className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
            <Link
              to={`/cafe/${cafe.id}`}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition-colors flex items-center gap-1 shadow-sm"
            >
              Detail
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
