import { useLocalStorage } from "./useLocalStorage";
import { initialCafes } from "../data/cafes";

export function useCustomCafes() {
  const [customCafes, setCustomCafes] = useLocalStorage("kopidex_custom_cafes", []);

  const allCafes = [...initialCafes, ...customCafes];

  const addCafe = (newCafeData) => {
    const newCafe = {
      ...newCafeData,
      id: "shop-" + Date.now(),
      rating: Number(newCafeData.rating) || 4.5,
      reviewCount: 1,
      isCustom: true,
      createdAt: new Date().toISOString()
    };
    setCustomCafes([newCafe, ...customCafes]);
    return newCafe;
  };

  const deleteCafe = (cafeId) => {
    setCustomCafes(customCafes.filter((c) => c.id !== cafeId));
  };

  return {
    allCafes,
    customCafes,
    addCafe,
    deleteCafe,
    totalCustomCafes: customCafes.length
  };
}
