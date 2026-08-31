import React from "react";
import { Link } from "react-router-dom";
import { 
  Check, 
  X, 
  Trash2, 
  ExternalLink, 
  Sparkles, 
  Zap, 
  Wifi, 
  MapPin, 
  Clock, 
  DollarSign 
} from "lucide-react";
import { StarRating } from "../common/StarRating";
import { ALL_FACILITIES } from "../../data/cafes";
import { isCafeOpen } from "../../hooks/useCafeFilter";

export function CompareTable({ cafes = [], onRemoveCafe, onClearAll }) {
  if (cafes.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-stone-900 dark:text-white">
            Belum Ada Kedai yang Dipilih
          </h3>
          <p className="text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto">
            Pilih 2 hingga 3 kedai kopi dari halaman jelajah untuk membandingkan harga, kecepatan WiFi, colokan, dan fasilitas lainnya secara berdampingan.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-amber-600 hover:bg-amber-700 text-white transition-colors"
        >
          Cari Kedai Kopi
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top action */}
      <div className="flex items-center justify-between">
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
          Membandingkan <span className="font-bold text-stone-900 dark:text-white">{cafes.length}</span> kedai kopi pilihan:
        </p>
        <button
          onClick={onClearAll}
          className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Hapus Semua
        </button>
      </div>

      {/* Comparison Grid Matrix */}
      <div className="overflow-x-auto custom-scrollbar pb-4">
        <div className="min-w-[650px] bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs sm:text-sm">
            
            {/* Header: Cafe Cards Overview */}
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30">
                <th className="p-4 sm:p-5 w-44 font-bold text-stone-500 uppercase tracking-wider text-xs">
                  Parameter
                </th>
                {cafes.map((cafe) => (
                  <th key={cafe.id} className="p-4 sm:p-5 min-w-[200px] align-top">
                    <div className="space-y-3">
                      <div className="relative aspect-[16/10] rounded-xl overflow-hidden">
                        <img
                          src={cafe.image}
                          alt={cafe.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => onRemoveCafe(cafe.id)}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-rose-600 text-white flex items-center justify-center transition-colors"
                          title="Hapus kedai"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-amber-600 uppercase">
                          Jak-{cafe.area}
                        </div>
                        <h4 className="font-extrabold text-stone-900 dark:text-white text-base leading-tight">
                          {cafe.name}
                        </h4>
                      </div>
                      <Link
                        to={`/cafe/${cafe.id}`}
                        className="inline-block w-full text-center py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition-colors"
                      >
                        Buka Halaman Kedai
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Matrix Body */}
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              
              {/* Rating */}
              <tr>
                <td className="p-4 font-bold text-stone-700 dark:text-stone-300">
                  Rating Pengunjung
                </td>
                {cafes.map((cafe) => (
                  <td key={cafe.id} className="p-4">
                    <StarRating rating={cafe.rating} count={cafe.reviewCount} />
                  </td>
                ))}
              </tr>

              {/* WFC Score */}
              <tr className="bg-stone-50/50 dark:bg-stone-800/20">
                <td className="p-4 font-bold text-stone-700 dark:text-stone-300">
                  ⚡ WFC Productivity Score
                </td>
                {cafes.map((cafe) => (
                  <td key={cafe.id} className="p-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                      Skor {cafe.wfcScore || "8.0"} / 10
                    </span>
                  </td>
                ))}
              </tr>

              {/* Range Budget */}
              <tr>
                <td className="p-4 font-bold text-stone-700 dark:text-stone-300">
                  Kisaran Harga
                </td>
                {cafes.map((cafe) => (
                  <td key={cafe.id} className="p-4">
                    <div className="font-bold text-amber-600 dark:text-amber-400">
                      {cafe.price} ({cafe.priceDetails || "Variatif"})
                    </div>
                  </td>
                ))}
              </tr>

              {/* WiFi Speed */}
              <tr className="bg-stone-50/50 dark:bg-stone-800/20">
                <td className="p-4 font-bold text-stone-700 dark:text-stone-300">
                  Kecepatan WiFi
                </td>
                {cafes.map((cafe) => (
                  <td key={cafe.id} className="p-4">
                    <span className="font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                      <Wifi className="w-4 h-4 text-emerald-500" />
                      {cafe.wifiSpeed || "50 Mbps"}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Sockets */}
              <tr>
                <td className="p-4 font-bold text-stone-700 dark:text-stone-300">
                  Ketersediaan Stopkontak
                </td>
                {cafes.map((cafe) => (
                  <td key={cafe.id} className="p-4">
                    <span className="text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-500" />
                      {cafe.socketCount || "Banyak"}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Jam Buka */}
              <tr className="bg-stone-50/50 dark:bg-stone-800/20">
                <td className="p-4 font-bold text-stone-700 dark:text-stone-300">
                  Jam Operasional
                </td>
                {cafes.map((cafe) => {
                  const isOpen = isCafeOpen(cafe.openHours);
                  return (
                    <td key={cafe.id} className="p-4">
                      <div className="space-y-1">
                        <span className="font-medium text-stone-800 dark:text-stone-200 block">
                          {cafe.openHours}
                        </span>
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                            isOpen ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                          }`}
                        >
                          {isOpen ? "Buka Sekarang" : "Tutup"}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Facilities Checklist Matrix */}
              {ALL_FACILITIES.map((facility) => (
                <tr key={facility}>
                  <td className="p-4 text-stone-600 dark:text-stone-400">
                    {facility}
                  </td>
                  {cafes.map((cafe) => {
                    const hasFac = cafe.facilities?.includes(facility);
                    return (
                      <td key={cafe.id} className="p-4">
                        {hasFac ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                            <Check className="w-4 h-4" /> Ada
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-stone-400">
                            <X className="w-4 h-4" /> Tidak Ada
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
