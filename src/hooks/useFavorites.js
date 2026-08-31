import { useLocalStorage } from "./useLocalStorage";

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage("kopidex_favorites", []);

  const toggleFavorite = (cafeId) => {
    setFavorites((prev) =>
      prev.includes(cafeId)
        ? prev.filter((id) => id !== cafeId)
        : [...prev, cafeId]
    );
  };

  const isFavorite = (cafeId) => favorites.includes(cafeId);

  const clearFavorites = () => setFavorites([]);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    count: favorites.length
  };
}
