import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Coffee, 
  Heart, 
  Scale, 
  LayoutDashboard, 
  Sparkles, 
  Sun, 
  Moon, 
  Menu, 
  X,
  Compass
} from "lucide-react";

export function Navbar({ favoritesCount = 0, compareCount = 0, onOpenQuiz }) {
  const location = useLocation();
  const [isDark, setIsDark] = useState(() => {
    return (
      localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-stone-950/90 border-b border-stone-200/80 dark:border-stone-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-stone-900 via-amber-900 to-amber-700 dark:from-white dark:via-amber-200 dark:to-amber-500 bg-clip-text text-transparent">
              KopiDex
            </span>
            <span className="hidden sm:block text-[10px] uppercase font-bold tracking-widest text-amber-600 dark:text-amber-400 -mt-1">
              Direktori Kopi & WFC
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
              isActive("/")
                ? "bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300"
                : "text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900"
            }`}
          >
            <Compass className="w-4 h-4" />
            Jelajah
          </Link>

          <Link
            to="/favorites"
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 relative ${
              isActive("/favorites")
                ? "bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300"
                : "text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900"
            }`}
          >
            <Heart className="w-4 h-4 text-rose-500" />
            Favorit
            {favoritesCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[11px] font-bold bg-rose-500 text-white rounded-full">
                {favoritesCount}
              </span>
            )}
          </Link>

          <Link
            to="/compare"
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 relative ${
              isActive("/compare")
                ? "bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300"
                : "text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900"
            }`}
          >
            <Scale className="w-4 h-4 text-blue-500" />
            Komparasi
            {compareCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[11px] font-bold bg-blue-500 text-white rounded-full">
                {compareCount}
              </span>
            )}
          </Link>

          <Link
            to="/dashboard"
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
              isActive("/dashboard")
                ? "bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300"
                : "text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900"
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-emerald-500" />
            Dashboard
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Smart Recommendation Quiz Button */}
          {onOpenQuiz && (
            <button
              onClick={onOpenQuiz}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-sm shadow-amber-500/20 hover:scale-[1.02] transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
              <span>KopiFinder</span>
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900 border border-stone-200 dark:border-stone-800 transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-stone-600" />}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900 border border-stone-200 dark:border-stone-800 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 px-4 py-3 space-y-2 animate-fade-in">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 ${
              isActive("/")
                ? "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300"
                : "text-stone-700 dark:text-stone-300"
            }`}
          >
            <Compass className="w-4 h-4" />
            Jelajah Direktori
          </Link>
          <Link
            to="/favorites"
            onClick={() => setMobileMenuOpen(false)}
            className={`w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between ${
              isActive("/favorites")
                ? "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300"
                : "text-stone-700 dark:text-stone-300"
            }`}
          >
            <span className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" />
              Kedai Favorit
            </span>
            {favoritesCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold bg-rose-500 text-white rounded-full">
                {favoritesCount}
              </span>
            )}
          </Link>
          <Link
            to="/compare"
            onClick={() => setMobileMenuOpen(false)}
            className={`w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between ${
              isActive("/compare")
                ? "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300"
                : "text-stone-700 dark:text-stone-300"
            }`}
          >
            <span className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-blue-500" />
              Bandingkan Kedai
            </span>
            {compareCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold bg-blue-500 text-white rounded-full">
                {compareCount}
              </span>
            )}
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className={`w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 ${
              isActive("/dashboard")
                ? "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300"
                : "text-stone-700 dark:text-stone-300"
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-emerald-500" />
            Dashboard User & Admin
          </Link>
          {onOpenQuiz && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuiz();
              }}
              className="w-full mt-2 py-2.5 rounded-xl text-sm font-bold bg-amber-600 text-white flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              Cari via KopiFinder Quiz
            </button>
          )}
        </div>
      )}
    </header>
  );
}
