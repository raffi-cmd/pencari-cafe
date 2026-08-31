// State Management
let currentFilterArea = "all";
let currentFilterPrice = "all";
let searchQuery = "";
let currentSort = "rating-desc";
let showOnlyFavorites = false;
let favorites = JSON.parse(localStorage.getItem("kopidex_favorites") || "[]");

// Fallback image helper
const fallbackImage = "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80";

// Check if shop is currently open based on operational hours string (e.g., "07:00 - 22:00")
function isShopOpen(openHoursStr) {
  if (!openHoursStr) return true;
  try {
    const parts = openHoursStr.split("-").map(s => s.trim());
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

// Update Top Statistics in Hero
function updateHeroStats(dataList) {
  const totalShopsEl = document.getElementById("stat-total-shops");
  const totalAreasEl = document.getElementById("stat-total-areas");
  const avgRatingEl = document.getElementById("stat-avg-rating");
  
  if (totalShopsEl) totalShopsEl.textContent = coffeeShops.length;
  
  if (totalAreasEl) {
    const areas = new Set(coffeeShops.map(s => s.area));
    totalAreasEl.textContent = `${areas.size} Wilayah`;
  }
  
  if (avgRatingEl) {
    const sum = coffeeShops.reduce((acc, curr) => acc + curr.rating, 0);
    avgRatingEl.textContent = (sum / coffeeShops.length).toFixed(1) + " ★";
  }
  
  updateFavoritesCounter();
}

// Update Favorites Counter Badge in Navbar
function updateFavoritesCounter() {
  const badge = document.getElementById("fav-counter-badge");
  if (badge) {
    badge.textContent = favorites.length;
    badge.classList.toggle("hidden", favorites.length === 0);
  }
}

// Toggle Favorite Shop
function toggleFavorite(shopId, event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  
  const index = favorites.indexOf(shopId);
  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(shopId);
  }
  
  localStorage.setItem("kopidex_favorites", JSON.stringify(favorites));
  updateFavoritesCounter();
  applyFilters();
}

// Apply Filtering and Sorting Engine
function applyFilters() {
  let results = [...coffeeShops];
  
  // 1. Filter Area
  if (currentFilterArea !== "all") {
    results = results.filter(shop => shop.area.toLowerCase() === currentFilterArea.toLowerCase());
  }
  
  // 2. Filter Price Range
  if (currentFilterPrice !== "all") {
    results = results.filter(shop => shop.priceRange === currentFilterPrice);
  }
  
  // 3. Filter Search Query (Name, Short Address, Facilities, Tagline)
  if (searchQuery.trim() !== "") {
    const q = searchQuery.toLowerCase().trim();
    results = results.filter(shop => 
      shop.name.toLowerCase().includes(q) ||
      shop.shortAddress.toLowerCase().includes(q) ||
      shop.tagline.toLowerCase().includes(q) ||
      shop.area.toLowerCase().includes(q) ||
      shop.facilities.some(f => f.toLowerCase().includes(q))
    );
  }
  
  // 4. Filter Favorites Only
  if (showOnlyFavorites) {
    results = results.filter(shop => favorites.includes(shop.id));
  }
  
  // 5. Sorting
  switch (currentSort) {
    case "rating-desc":
      results.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
      break;
    case "price-asc":
      results.sort((a, b) => a.priceNumeric - b.priceNumeric);
      break;
    case "price-desc":
      results.sort((a, b) => b.priceNumeric - a.priceNumeric);
      break;
    case "name-asc":
      results.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      break;
  }
  
  renderCards(results);
  updateActiveFilterStyles();
}

// Render Coffee Shop Cards to Grid
function renderCards(list) {
  const container = document.getElementById("coffee-grid");
  const emptyState = document.getElementById("empty-state");
  const resultsCount = document.getElementById("results-count");
  
  if (resultsCount) {
    resultsCount.textContent = `Menampilkan ${list.length} kedai kopi pilihan`;
  }
  
  if (list.length === 0) {
    container.innerHTML = "";
    emptyState.classList.remove("hidden");
    return;
  }
  
  emptyState.classList.add("hidden");
  
  container.innerHTML = list.map(shop => {
    const isFav = favorites.includes(shop.id);
    const isOpen = isShopOpen(shop.openHours);
    
    return `
      <article class="group relative bg-white dark:bg-stone-900 rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
        <div>
          <!-- Thumbnail Container -->
          <div class="relative h-48 w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
            <img 
              src="${shop.image}" 
              alt="${shop.name}" 
              loading="lazy"
              onerror="this.src='${fallbackImage}'"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
            
            <!-- Badges Overlay -->
            <div class="absolute top-3 left-3 flex gap-1.5 flex-wrap items-center">
              <span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-600 text-white shadow-sm backdrop-blur-md">
                ${shop.area}
              </span>
              <span class="px-2.5 py-1 text-xs font-bold rounded-full bg-stone-900/80 text-amber-300 border border-amber-400/30 backdrop-blur-md">
                ${shop.priceRange}
              </span>
              ${shop.isPopular ? `
                <span class="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-rose-500 text-white flex items-center gap-1 shadow-sm">
                  <i data-lucide="flame" class="w-3 h-3"></i> Populer
                </span>
              ` : ''}
            </div>
            
            <!-- Favorite Button -->
            <button 
              onclick="toggleFavorite('${shop.id}', event)" 
              aria-label="Simpan Favorit"
              class="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center bg-white/90 dark:bg-stone-900/90 text-stone-700 dark:text-stone-200 hover:scale-110 active:scale-95 transition-all shadow-md backdrop-blur-md ${isFav ? '!text-rose-500 !bg-rose-50 dark:!bg-rose-950/80' : ''}"
            >
              <i data-lucide="heart" class="w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}"></i>
            </button>
            
            <!-- Operational Status Pill -->
            <div class="absolute bottom-2.5 left-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium backdrop-blur-md ${isOpen ? 'bg-emerald-500/90 text-white' : 'bg-stone-800/90 text-stone-300'}">
              <span class="w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-emerald-200 animate-pulse' : 'bg-stone-400'}"></span>
              ${isOpen ? 'Buka Sekarang' : 'Tutup'}
            </div>
          </div>
          
          <!-- Card Body -->
          <div class="p-5">
            <div class="flex items-center justify-between gap-2 mb-1.5">
              <h3 class="text-lg font-bold text-stone-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
                ${shop.name}
              </h3>
            </div>
            
            <p class="text-xs text-stone-500 dark:text-stone-400 mb-3 line-clamp-1 italic">
              "${shop.tagline}"
            </p>
            
            <!-- Rating & Reviews -->
            <div class="flex items-center gap-2 mb-3 text-sm">
              <div class="flex items-center text-amber-500 font-bold bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200/50 dark:border-amber-800/50">
                <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1"></i>
                ${shop.rating}
              </div>
              <span class="text-xs text-stone-400">(${shop.reviewCount} ulasan)</span>
              <span class="text-xs font-medium text-stone-500 dark:text-stone-400 ml-auto">${shop.openHours}</span>
            </div>
            
            <!-- Location Snippet -->
            <div class="flex items-start gap-1.5 text-xs text-stone-600 dark:text-stone-300 mb-4">
              <i data-lucide="map-pin" class="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5"></i>
              <span class="line-clamp-1">${shop.shortAddress}</span>
            </div>
            
            <!-- Facility Chips Snippet -->
            <div class="flex flex-wrap gap-1 mb-4">
              ${shop.facilities.slice(0, 3).map(f => `
                <span class="px-2 py-0.5 text-[11px] rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                  ${f}
                </span>
              `).join('')}
              ${shop.facilities.length > 3 ? `<span class="px-1.5 py-0.5 text-[10px] rounded bg-stone-100 dark:bg-stone-800 text-stone-400">+${shop.facilities.length - 3}</span>` : ''}
            </div>
          </div>
        </div>
        
        <!-- Card Footer -->
        <div class="px-5 pb-5 pt-0">
          <button 
            onclick="openModal('${shop.id}')" 
            class="w-full py-2.5 px-4 rounded-xl bg-stone-900 dark:bg-stone-100 hover:bg-amber-600 dark:hover:bg-amber-500 text-white dark:text-stone-900 hover:text-white dark:hover:text-white font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Lihat Detail & Fasilitas</span>
            <i data-lucide="arrow-right" class="w-4 h-4"></i>
          </button>
        </div>
      </article>
    `;
  }).join('');
  
  // Reinitialize Lucide icons in newly rendered HTML
  if (window.lucide) {
    lucide.createIcons();
  }
}

// Update Active Filter UI Styling (Pills & Dropdowns)
function updateActiveFilterStyles() {
  // Area Pills
  document.querySelectorAll("[data-filter-area]").forEach(btn => {
    const area = btn.getAttribute("data-filter-area");
    if (area === currentFilterArea) {
      btn.className = "filter-pill-active px-3.5 py-1.5 text-xs font-semibold rounded-full bg-amber-600 text-white shadow-sm transition-all";
    } else {
      btn.className = "filter-pill-inactive px-3.5 py-1.5 text-xs font-medium rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-all";
    }
  });
  
  // Price Pills
  document.querySelectorAll("[data-filter-price]").forEach(btn => {
    const price = btn.getAttribute("data-filter-price");
    if (price === currentFilterPrice) {
      btn.className = "filter-pill-active px-3.5 py-1.5 text-xs font-semibold rounded-full bg-amber-600 text-white shadow-sm transition-all";
    } else {
      btn.className = "filter-pill-inactive px-3.5 py-1.5 text-xs font-medium rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-all";
    }
  });
  
  // Bookmark Toggle Button
  const favToggleBtn = document.getElementById("btn-toggle-favorites-filter");
  if (favToggleBtn) {
    if (showOnlyFavorites) {
      favToggleBtn.className = "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-rose-500 text-white shadow-sm transition-all";
    } else {
      favToggleBtn.className = "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-all";
    }
  }
}

// Reset All Filters
function resetAllFilters() {
  currentFilterArea = "all";
  currentFilterPrice = "all";
  searchQuery = "";
  currentSort = "rating-desc";
  showOnlyFavorites = false;
  
  const searchInput = document.getElementById("search-input");
  const searchInputHero = document.getElementById("search-input-hero");
  const sortSelect = document.getElementById("sort-select");
  
  if (searchInput) searchInput.value = "";
  if (searchInputHero) searchInputHero.value = "";
  if (sortSelect) sortSelect.value = "rating-desc";
  
  applyFilters();
}

// Open Detail Modal
function openModal(shopId) {
  const shop = coffeeShops.find(s => s.id === shopId);
  if (!shop) return;
  
  const modal = document.getElementById("detail-modal");
  const isFav = favorites.includes(shop.id);
  const isOpen = isShopOpen(shop.openHours);
  
  document.getElementById("modal-image").src = shop.image;
  document.getElementById("modal-image").onerror = function() { this.src = fallbackImage; };
  document.getElementById("modal-name").textContent = shop.name;
  document.getElementById("modal-tagline").textContent = shop.tagline;
  document.getElementById("modal-area").textContent = shop.area;
  document.getElementById("modal-price").textContent = `${shop.priceRange} (${shop.priceDetails})`;
  document.getElementById("modal-rating").textContent = shop.rating;
  document.getElementById("modal-reviews").textContent = `(${shop.reviewCount} ulasan terverifikasi)`;
  document.getElementById("modal-hours").textContent = shop.openHours;
  
  // Status Badge
  const statusEl = document.getElementById("modal-status");
  statusEl.className = `flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${isOpen ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'}`;
  statusEl.innerHTML = `<span class="w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'}"></span> ${isOpen ? 'Buka Sekarang' : 'Tutup'}`;
  
  // Full Address & Maps CTA
  document.getElementById("modal-address").textContent = shop.fullAddress;
  const mapsBtn = document.getElementById("modal-maps-btn");
  mapsBtn.href = shop.mapsUrl;
  
  // Facilities List
  const facilitiesContainer = document.getElementById("modal-facilities");
  facilitiesContainer.innerHTML = shop.facilities.map(f => `
    <li class="flex items-center gap-2 text-xs sm:text-sm text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-stone-800/60 p-2.5 rounded-xl border border-stone-200/50 dark:border-stone-800">
      <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-500 shrink-0"></i>
      <span>${f}</span>
    </li>
  `).join('');
  
  // Menu Highlights
  const menuContainer = document.getElementById("modal-menu-highlights");
  menuContainer.innerHTML = (shop.menuHighlights || []).map(m => `
    <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-medium border border-amber-200/60 dark:border-amber-900/50">
      <i data-lucide="coffee" class="w-3.5 h-3.5 text-amber-600 dark:text-amber-400"></i>
      ${m}
    </span>
  `).join('');
  
  // Modal Bookmark Button
  const modalFavBtn = document.getElementById("modal-fav-btn");
  modalFavBtn.onclick = () => {
    toggleFavorite(shop.id);
    const updatedFav = favorites.includes(shop.id);
    modalFavBtn.innerHTML = `
      <i data-lucide="heart" class="w-4 h-4 ${updatedFav ? 'fill-rose-500 text-rose-500' : ''}"></i>
      <span>${updatedFav ? 'Disimpan di Favorit' : 'Simpan ke Favorit'}</span>
    `;
    if (window.lucide) lucide.createIcons();
  };
  modalFavBtn.innerHTML = `
    <i data-lucide="heart" class="w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}"></i>
    <span>${isFav ? 'Disimpan di Favorit' : 'Simpan ke Favorit'}</span>
  `;
  
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  
  if (window.lucide) {
    lucide.createIcons();
  }
}

// Close Detail Modal
function closeModal() {
  const modal = document.getElementById("detail-modal");
  modal.classList.add("hidden");
  document.body.style.overflow = "auto";
}

// Open Recommend Modal
function openRecommendModal() {
  const modal = document.getElementById("recommend-modal");
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeRecommendModal() {
  const modal = document.getElementById("recommend-modal");
  modal.classList.add("hidden");
  document.body.style.overflow = "auto";
}

// Handle Form Submission for new recommendation
function handleRecommendSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const name = form.name.value;
  const area = form.area.value;
  const address = form.address.value;
  
  // Show toast notification
  alert(`Terima kasih! Rekomendasi kedai "${name}" di area ${area} telah dikirim untuk ditinjau.`);
  form.reset();
  closeRecommendModal();
}

// Initialize Application & Attach Events
document.addEventListener("DOMContentLoaded", () => {
  updateHeroStats();
  applyFilters();
  
  // Event: Search Input Navbar & Hero
  const searchInput = document.getElementById("search-input");
  const searchInputHero = document.getElementById("search-input-hero");
  
  function handleSearch(e) {
    searchQuery = e.target.value;
    if (searchInput && searchInput !== e.target) searchInput.value = searchQuery;
    if (searchInputHero && searchInputHero !== e.target) searchInputHero.value = searchQuery;
    applyFilters();
  }
  
  if (searchInput) searchInput.addEventListener("input", handleSearch);
  if (searchInputHero) searchInputHero.addEventListener("input", handleSearch);
  
  // Event: Area Pills
  document.querySelectorAll("[data-filter-area]").forEach(btn => {
    btn.addEventListener("click", () => {
      currentFilterArea = btn.getAttribute("data-filter-area");
      applyFilters();
    });
  });
  
  // Event: Price Pills
  document.querySelectorAll("[data-filter-price]").forEach(btn => {
    btn.addEventListener("click", () => {
      currentFilterPrice = btn.getAttribute("data-filter-price");
      applyFilters();
    });
  });
  
  // Event: Sort Select
  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      currentSort = e.target.value;
      applyFilters();
    });
  }
  
  // Event: Favorites Toggle Button
  const favToggleBtn = document.getElementById("btn-toggle-favorites-filter");
  if (favToggleBtn) {
    favToggleBtn.addEventListener("click", () => {
      showOnlyFavorites = !showOnlyFavorites;
      applyFilters();
    });
  }
  
  // Event: Navbar Bookmark Button
  const navFavBtn = document.getElementById("nav-fav-btn");
  if (navFavBtn) {
    navFavBtn.addEventListener("click", () => {
      showOnlyFavorites = true;
      applyFilters();
      const catalogEl = document.getElementById("katalog-section");
      if (catalogEl) catalogEl.scrollIntoView({ behavior: "smooth" });
    });
  }
  
  // Event: Reset Filter Buttons
  document.querySelectorAll(".btn-reset-filters").forEach(btn => {
    btn.addEventListener("click", resetAllFilters);
  });
  
  // Close Modals on ESC Key or Backdrop
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
      closeRecommendModal();
    }
  });
});
