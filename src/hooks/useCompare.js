import { useLocalStorage } from "./useLocalStorage";

export function useCompare() {
  const [compareList, setCompareList] = useLocalStorage("kopidex_compare", []);

  const addToCompare = (cafeId) => {
    if (compareList.length >= 3) {
      return { success: false, message: "Maksimal 3 kedai untuk dibandingkan sekaligus." };
    }
    if (compareList.includes(cafeId)) {
      return { success: false, message: "Kedai sudah ada di daftar perbandingan." };
    }
    setCompareList([...compareList, cafeId]);
    return { success: true, message: "Berhasil ditambahkan ke komparasi." };
  };

  const removeFromCompare = (cafeId) => {
    setCompareList(compareList.filter((id) => id !== cafeId));
  };

  const isInCompare = (cafeId) => compareList.includes(cafeId);

  const toggleCompare = (cafeId) => {
    if (isInCompare(cafeId)) {
      removeFromCompare(cafeId);
      return { action: "removed" };
    } else {
      const res = addToCompare(cafeId);
      return { action: res.success ? "added" : "failed", message: res.message };
    }
  };

  const clearCompare = () => setCompareList([]);

  return {
    compareList,
    addToCompare,
    removeFromCompare,
    isInCompare,
    toggleCompare,
    clearCompare,
    count: compareList.length
  };
}
