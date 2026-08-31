import React from "react";
import { Link } from "react-router-dom";
import { 
  X, 
  MapPin, 
  Clock, 
  ExternalLink, 
  Heart, 
  Scale, 
  Wifi, 
  Zap, 
  CheckCircle2, 
  Share2,
  ArrowRight
} from "lucide-react";
import { StarRating } from "../common/StarRating";
import { isCafeOpen } from "../../hooks/useCafeFilter";

export function CafeModal({
  cafe,
  onClose,
  isFavorite,
  onToggleFavorite,
  isInCompare,
  onToggleCompare
}) {
  if (!cafe) return null;

  const isOpen = isCafeOpen(cafe.openHours);
  const fallbackImg = "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80";

  const handleShare = () => {
    const url = `${window.location.origin}/cafe/${cafe.id}`;
    if (navigator.share) {
      navigator.share({
        title: cafe.name,
        text: `Cek tempat ngopi ${cafe.name} di KopiDex!`,
        url
      });
    } else {
      navigator.clipboard.writeText(url);
      alert("Tautan kedai berhasil disalin ke clipboard!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl relative flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative aspect-[16/9] w-full bg-stone-100 dark:bg-stone-800">
          <img
            src={cafe.image || fallbackImg}
            alt={cafe.name}
            onError={(e) => (e.target.src = fallbackImg)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  isOpen ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                }`}
              >
                {isOpen ? "Buka Sekarang" : "Tutup"}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white">
                Jak-{cafe.area}
              </span>
              {cafe.wfcScore && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-stone-900/80 text-amber-400">
                  ⚡ WFC {cafe.wfcScore}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">{cafe.name}</h2>
            <p className="text-xs sm:text-sm text-stone-200">{cafe.tagline}</p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          
          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800 text-center">
            <div>
              <span className="text-[11px] text-stone-400 block font-medium">Rating</span>
              <div className="flex items-center justify-center gap-1 font-bold text-stone-900 dark:text-white text-sm mt-0.5">
                <StarRating rating={cafe.rating} showValue={true} />
              </div>
            </div>
            <div className="border-x border-stone-200 dark:border-stone-700">
              <span className="text-[11px] text-stone-400 block font-medium">Estimasi Budget</span>
              <span className="font-bold text-amber-600 dark:text-amber-400 text-sm block mt-0.5">
                {cafe.priceDetails || cafe.price}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-stone-400 block font-medium">Jam Buka</span>
              <span className="font-bold text-stone-900 dark:text-white text-xs block mt-0.5">
                {cafe.openHours}
              </span>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">Alamat Lengkap</h4>
            <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300">
              {cafe.fullAddress || cafe.shortAddress}
            </p>
          </div>

          {/* Facilities */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">Fasilitas Lengkap</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {cafe.facilities?.map((f, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-xs text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800/80 p-2 rounded-xl"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="truncate">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Highlight Menu */}
          {cafe.menuHighlights && cafe.menuHighlights.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">Menu Rekomendasi</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {cafe.menuHighlights.map((menu, idx) => {
                  const name = typeof menu === "string" ? menu : menu.name;
                  const price = typeof menu === "string" ? "" : menu.price;
                  return (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-stone-800 dark:text-stone-200">☕ {name}</span>
                      {price && <span className="font-bold text-amber-600 dark:text-amber-400">{price}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleFavorite?.(cafe.id)}
                className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all ${
                  isFavorite?.(cafe.id)
                    ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/50 dark:border-rose-800 dark:text-rose-300"
                    : "border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300"
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite?.(cafe.id) ? "fill-rose-500" : ""}`} />
                <span>{isFavorite?.(cafe.id) ? "Tersimpan" : "Simpan"}</span>
              </button>

              <button
                onClick={() => onToggleCompare?.(cafe.id)}
                className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all ${
                  isInCompare?.(cafe.id)
                    ? "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-300"
                    : "border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300"
                }`}
              >
                <Scale className="w-4 h-4" />
                <span>{isInCompare?.(cafe.id) ? "Batal Komparasi" : "Bandingkan"}</span>
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                title="Bagikan Kedai"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              {cafe.mapsUrl && (
                <a
                  href={cafe.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2.5 rounded-xl text-xs font-bold border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors inline-flex items-center gap-1"
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3 text-stone-400" />
                </a>
              )}

              <Link
                to={`/cafe/${cafe.id}`}
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition-colors inline-flex items-center gap-1.5 shadow-sm shadow-amber-600/30"
              >
                <span>Halaman Penuh</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
