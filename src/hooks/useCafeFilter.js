import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { calculateDistance } from "./useGeolocation";

// Helper to check if cafe is currently open
export function isCafeOpen(openHoursStr) {
  if (!openHoursStr) return true;
  if (openHoursStr.toLowerCase().includes("24 jam")) return true;
  try {
    const parts = openHoursStr.split("-").map((s) => s.trim());
    if (parts.length !== 2) return true;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [startH, startM] = parts[0].split(":").map(Number);
    const [endH, endM] = parts[1].split(":").map(Number);

    const startMinutes = startH * 60 + (startM || 0);
    const endMinutes = endH * 60 + (endM || 0);

    if (endMinutes > startMinutes) {
      return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
    } else {
      // Crosses midnight (e.g. 18:00 - 02:00)
      return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
    }
  } catch (e) {
    return true;
  }
}

export function useCafeFilter(allCafes, userLocation = null) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial states from URL Query Params
  const querySearch = searchParams.get("search") || "";
  const queryArea = searchParams.get("area") || "Semua";
  const queryCategory = searchParams.get("category") || "all";
  const queryBudget = searchParams.get("budget") || "all";
  const querySort = searchParams.get("sort") || "rating-desc";
  const queryFacilities = searchParams.get("facilities")
    ? searchParams.get("facilities").split(",").filter(Boolean)
    : [];
  const queryOpenOnly = searchParams.get("openOnly") === "true";

  // Local state initialized with query params
  const [searchQuery, setSearchQuery] = useState(querySearch);
  const [selectedArea, setSelectedArea] = useState(queryArea);
  const [selectedCategory, setSelectedCategory] = useState(queryCategory);
  const [selectedBudget, setSelectedBudget] = useState(queryBudget);
  const [selectedSort, setSelectedSort] = useState(querySort);
  const [selectedFacilities, setSelectedFacilities] = useState(queryFacilities);
  const [openOnly, setOpenOnly] = useState(queryOpenOnly);

  // Pagination state
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  // Sync state changes back to URLSearchParams
  const updateURLParams = useCallback(() => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (selectedArea && selectedArea !== "Semua") params.set("area", selectedArea);
    if (selectedCategory && selectedCategory !== "all") params.set("category", selectedCategory);
    if (selectedBudget && selectedBudget !== "all") params.set("budget", selectedBudget);
    if (selectedSort && selectedSort !== "rating-desc") params.set("sort", selectedSort);
    if (selectedFacilities.length > 0) params.set("facilities", selectedFacilities.join(","));
    if (openOnly) params.set("openOnly", "true");

    setSearchParams(params, { replace: true });
  }, [
    searchQuery,
    selectedArea,
    selectedCategory,
    selectedBudget,
    selectedSort,
    selectedFacilities,
    openOnly,
    setSearchParams
  ]);

  useEffect(() => {
    updateURLParams();
    setPage(1); // Reset page on filter changes
  }, [
    searchQuery,
    selectedArea,
    selectedCategory,
    selectedBudget,
    selectedSort,
    selectedFacilities,
    openOnly,
    updateURLParams
  ]);

  // Facilities toggle helper
  const toggleFacility = (facility) => {
    setSelectedFacilities((prev) =>
      prev.includes(facility)
        ? prev.filter((f) => f !== facility)
        : [...prev, facility]
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedArea("Semua");
    setSelectedCategory("all");
    setSelectedBudget("all");
    setSelectedSort("rating-desc");
    setSelectedFacilities([]);
    setOpenOnly(false);
    setPage(1);
  };

  // Filter and sort computation
  const filteredCafes = useMemo(() => {
    let result = [...allCafes];

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((cafe) => {
        const matchName = cafe.name?.toLowerCase().includes(q);
        const matchTagline = cafe.tagline?.toLowerCase().includes(q);
        const matchAddress = cafe.shortAddress?.toLowerCase().includes(q) || cafe.fullAddress?.toLowerCase().includes(q);
        const matchArea = cafe.area?.toLowerCase().includes(q);
        const matchFacilities = cafe.facilities?.some((f) => f.toLowerCase().includes(q));
        const matchMenu = cafe.menuHighlights?.some((m) =>
          (typeof m === "string" ? m : m.name).toLowerCase().includes(q)
        );
        return matchName || matchTagline || matchAddress || matchArea || matchFacilities || matchMenu;
      });
    }

    // Area filter
    if (selectedArea && selectedArea !== "Semua") {
      result = result.filter((c) => c.area === selectedArea);
    }

    // Category filter
    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter((c) => c.category?.includes(selectedCategory));
    }

    // Budget filter
    if (selectedBudget && selectedBudget !== "all") {
      result = result.filter((c) => c.price === selectedBudget);
    }

    // Facilities multi-filter (must have ALL selected facilities)
    if (selectedFacilities.length > 0) {
      result = result.filter((c) =>
        selectedFacilities.every((fac) => c.facilities?.includes(fac))
      );
    }

    // Open Only filter
    if (openOnly) {
      result = result.filter((c) => isCafeOpen(c.openHours));
    }

    // Distance calculation & attach to object
    if (userLocation) {
      result = result.map((c) => ({
        ...c,
        distanceKm: calculateDistance(
          userLocation.lat,
          userLocation.lng,
          c.coordinates?.lat,
          c.coordinates?.lng
        )
      }));
    }

    // Sorting
    result.sort((a, b) => {
      if (selectedSort === "rating-desc") {
        return (b.rating || 0) - (a.rating || 0);
      }
      if (selectedSort === "reviews-desc") {
        return (b.reviewCount || 0) - (a.reviewCount || 0);
      }
      if (selectedSort === "price-asc") {
        return (a.priceNumeric || 0) - (b.priceNumeric || 0);
      }
      if (selectedSort === "price-desc") {
        return (b.priceNumeric || 0) - (a.priceNumeric || 0);
      }
      if (selectedSort === "wfc-desc") {
        return (b.wfcScore || 0) - (a.wfcScore || 0);
      }
      if (selectedSort === "distance-asc" && userLocation) {
        return (a.distanceKm || 9999) - (b.distanceKm || 9999);
      }
      return 0;
    });

    return result;
  }, [
    allCafes,
    searchQuery,
    selectedArea,
    selectedCategory,
    selectedBudget,
    selectedFacilities,
    openOnly,
    selectedSort,
    userLocation
  ]);

  // Paginated list
  const paginatedCafes = useMemo(() => {
    return filteredCafes.slice(0, page * itemsPerPage);
  }, [filteredCafes, page]);

  const hasMore = paginatedCafes.length < filteredCafes.length;
  const loadMore = () => setPage((prev) => prev + 1);

  const activeFiltersCount =
    (searchQuery ? 1 : 0) +
    (selectedArea !== "Semua" ? 1 : 0) +
    (selectedCategory !== "all" ? 1 : 0) +
    (selectedBudget !== "all" ? 1 : 0) +
    selectedFacilities.length +
    (openOnly ? 1 : 0);

  return {
    searchQuery,
    setSearchQuery,
    selectedArea,
    setSelectedArea,
    selectedCategory,
    setSelectedCategory,
    selectedBudget,
    setSelectedBudget,
    selectedSort,
    setSelectedSort,
    selectedFacilities,
    toggleFacility,
    openOnly,
    setOpenOnly,
    resetFilters,
    activeFiltersCount,
    filteredCafes,
    paginatedCafes,
    hasMore,
    loadMore,
    totalCount: filteredCafes.length
  };
}
