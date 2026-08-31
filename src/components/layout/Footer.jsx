import React from "react";
import { Coffee, Heart, MapPin, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-stone-600 dark:text-stone-400 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white">
                <Coffee className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-stone-900 dark:text-white">
                KopiDex
              </span>
            </div>
            <p className="text-sm text-stone-500 dark:text-stone-400 max-w-sm">
              Direktori kedai kopi independen, roastery lokal, dan spot Work From Cafe (WFC) terkurasi dengan filter presisi, peta interaktif, dan rekomendasi cerdas.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-white mb-3">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                  Jelajah Kedai
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                  Kedai Tersimpan
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                  Bandingkan Kedai (Compare)
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                  Dashboard & Submit Kedai
                </Link>
              </li>
            </ul>
          </div>

          {/* Tags & Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-white mb-3">
              Kategori Favorit
            </h4>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2.5 py-1 text-xs rounded-lg bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300">
                ☕ Specialty
              </span>
              <span className="px-2.5 py-1 text-xs rounded-lg bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300">
                💻 WFC Spot
              </span>
              <span className="px-2.5 py-1 text-xs rounded-lg bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300">
                🌿 Outdoor
              </span>
              <span className="px-2.5 py-1 text-xs rounded-lg bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300">
                💰 Budget Hemat
              </span>
              <span className="px-2.5 py-1 text-xs rounded-lg bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300">
                🔥 Roastery
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-stone-200 dark:border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} KopiDex. Dibuat dengan cinta untuk komunitas kopi lokal Nusantara.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" /> Frontend Portfolio Showcase
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
