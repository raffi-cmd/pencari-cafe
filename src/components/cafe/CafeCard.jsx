import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Heart, 
  Scale, 
  Clock, 
  Wifi, 
  Zap, 
  Navigation,
  ArrowUpRight
} from "lucide-react";
import { StarRating } from "../common/StarRating";
import { isCafeOpen } from "../../hooks/useCafeFilter";

export function CafeCard({
  cafe,
  isFavorite = false,
  onToggleFavorite,
  isInCompare = false,
  onToggleCompare
}) {
  const isOpen = isCafeOpen(cafe.openHours);
  const fallbackImg = "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80";
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <article className="group bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-amber-500/40 dark:hover:border-amber-500/30 transition-all duration-300 flex flex-col h-full focus-within:ring-2 focus-within:ring-amber-500">
      
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100 dark:bg-stone-800">
        {!imgLoaded && (
          <div className="absolute inset-0 bg-stone-200 dark:bg-stone-800 animate-pulse" />
        )}
        <img
          src={cafe.image || fallbackImg}
          alt={`Foto suasana kedai ${cafe.name}`}
          onLoad={() => setImgLoaded(true)}
          onError={(e) => {
            e.target.src = fallbackImg;
            setImgLoaded(true);
          }}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Open / Closed Status */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md shadow-sm ${
                isOpen
                  ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/30"
                  : "bg-stone-900/80 text-stone-300 border border-stone-700/50"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-stone-400'}`} />
              {isOpen ? "Buka" : "Tutup"}
            </span>

            {/* WFC Score Badge */}
            {cafe.wfcScore && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-950/80 text-amber-300 border border-amber-500/30 backdrop-blur-md shadow-sm">
                WFC {cafe.wfcScore}
              </span>
            )}
          </div>

          {/* Action Buttons: Compare & Favorite */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            {/* Compare Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleCompare?.(cafe.id);
              }}
              aria-label={isInCompare ? `Hapus ${cafe.name} dari komparasi` : `Tambahkan ${cafe.name} ke komparasi`}
              className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-sm ${
                isInCompare
                  ? "bg-blue-600 text-white scale-105"
                  : "bg-black/50 text-stone-200 hover:bg-blue-600 hover:text-white"
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
            </button>

            {/* Favorite Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite?.(cafe.id);
              }}
              aria-label={isFavorite ? `Hapus ${cafe.name} dari favorit` : `Simpan ${cafe.name} ke favorit`}
              className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-sm ${
                isFavorite
                  ? "bg-rose-500 text-white scale-105"
                  : "bg-black/50 text-stone-200 hover:bg-rose-500 hover:text-white"
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 ${isFavorite ? "fill-white" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Bottom Area / Distance */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-medium bg-black/60 text-stone-200 backdrop-blur-md">
            Jak-{cafe.area}
          </span>
          {cafe.distanceKm !== undefined && cafe.distanceKm !== null && (
            <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-medium bg-amber-900/80 text-amber-200 backdrop-blur-md flex items-center gap-1">
              <Navigation className="w-3 h-3" />
              {cafe.distanceKm} km
            </span>
          )}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        
        {/* Rating & Price */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <StarRating rating={cafe.rating} count={cafe.reviewCount} />
          <span className="text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200/50 dark:border-amber-900/40">
            {cafe.price} <span className="font-normal text-[11px] text-stone-500 dark:text-stone-400">({cafe.priceNumeric ? `~${(cafe.priceNumeric / 1000)}k` : "Variatif"})</span>
          </span>
        </div>

        {/* Title */}
        <Link 
          to={`/cafe/${cafe.id}`} 
          className="group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors focus:outline-none"
        >
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
            <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400">
              +{cafe.facilities.length - 3}
            </span>
          )}
        </div>

        {/* Footer info & CTA */}
        <div className="mt-auto pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-[11px] truncate max-w-[130px] sm:max-w-none">{cafe.openHours}</span>
          </div>

          <Link
            to={`/cafe/${cafe.id}`}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200/60 dark:border-amber-800/60 transition-colors inline-flex items-center gap-1"
          >
            <span>Lihat Detail</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
