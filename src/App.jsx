import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { CompareDrawer } from "./components/compare/CompareDrawer";
import { RecommendationWizard } from "./components/recommendation/RecommendationWizard";

import { Home } from "./pages/Home";
import { CafeDetail } from "./pages/CafeDetail";
import { Favorites } from "./pages/Favorites";
import { Compare } from "./pages/Compare";
import { Dashboard } from "./pages/Dashboard";

import { useCustomCafes } from "./hooks/useCustomCafes";
import { useFavorites } from "./hooks/useFavorites";
import { useCompare } from "./hooks/useCompare";
import { useReviews } from "./hooks/useReviews";

export function App() {
  const { allCafes, customCafes, addCafe, deleteCafe } = useCustomCafes();
  const { favorites, toggleFavorite, isFavorite, clearFavorites, count: favCount } = useFavorites();
  const {
    compareList,
    addToCompare,
    removeFromCompare,
    isInCompare,
    toggleCompare,
    clearCompare,
    count: compCount
  } = useCompare();
  const { reviews, addReview, deleteReview } = useReviews();

  const [isQuizOpen, setIsQuizOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100 transition-colors">
      
      {/* Top Navbar */}
      <Navbar
        favoritesCount={favCount}
        compareCount={compCount}
        onOpenQuiz={() => setIsQuizOpen(true)}
      />

      {/* Main Page Routes */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                allCafes={allCafes}
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
                isInCompare={isInCompare}
                onToggleCompare={toggleCompare}
                onOpenQuiz={() => setIsQuizOpen(true)}
              />
            }
          />
          <Route
            path="/kedai"
            element={<Navigate to="/" replace />}
          />
          <Route
            path="/cafe/:id"
            element={
              <CafeDetail
                allCafes={allCafes}
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
                isInCompare={isInCompare}
                onToggleCompare={toggleCompare}
                reviews={reviews}
                onAddReview={addReview}
              />
            }
          />
          <Route
            path="/favorites"
            element={
              <Favorites
                allCafes={allCafes}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onClearFavorites={clearFavorites}
                isInCompare={isInCompare}
                onToggleCompare={toggleCompare}
              />
            }
          />
          <Route
            path="/compare"
            element={
              <Compare
                allCafes={allCafes}
                compareList={compareList}
                onRemoveFromCompare={removeFromCompare}
                onClearCompare={clearCompare}
                onAddToCompare={addToCompare}
              />
            }
          />
          <Route
            path="/dashboard"
            element={
              <Dashboard
                allCafes={allCafes}
                customCafes={customCafes}
                onAddCafe={addCafe}
                onDeleteCafe={deleteCafe}
                favorites={favorites}
                reviews={reviews}
                onDeleteReview={deleteReview}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Persistent Compare Drawer */}
      <CompareDrawer
        compareList={compareList}
        allCafes={allCafes}
        onRemoveFromCompare={removeFromCompare}
        onClearCompare={clearCompare}
      />

      {/* Smart Recommendation Quiz Modal */}
      <RecommendationWizard
        allCafes={allCafes}
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
      />

      {/* Global Footer */}
      <Footer />

    </div>
  );
}

export default App;
