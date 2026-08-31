# ☕ KopiDex — Modern Coffee & WFC Directory (React + Vite)

**KopiDex** adalah Single Page Application (SPA) modern yang dirancang untuk menemukan, membandingkan, dan memfilter kedai kopi lokal & spot *Work From Cafe (WFC)* terkurasi di Indonesia.

---

## 🚀 Fitur Unggulan (Portfolio Showcase)

### 1. 🟡 V2 — State Management & Dynamic Logic
* **Real-time Search**: Pencarian instan berdasarkan nama, alamat, fasilitas, dan menu andalan.
* **Multiple Filter Criteria**: Filter multi-dimensi (Kategori Vibe, Wilayah Jakarta, Estimasi Budget, Fasilitas WFC, dan Status Jam Buka).
* **Advanced Sorting**: Rating tertinggi, Review terbanyak, WFC score, Harga termurah/termahal, hingga Jarak terdekat.
* **URLSearchParams 2-Way Sync**: Setiap filter dan query pencarian tersinkronisasi otomatis ke URL browser (`/kedai?area=Selatan&budget=hemat&sort=rating`), ramah bookmark & sharing link.
* **Pagination / Infinite Load**: Penanganan data bertahap dengan tombol *Load More*.

### 2. 🟠 V3 — React + Vite Component Architecture & Persistence
* **Modular Architecture**: Struktur folder clean (`components/`, `pages/`, `hooks/`, `data/`).
* **Custom Hooks**:
  * `useCafeFilter`: Logika filtering, sorting, pagination, dan sinkronisasi URL.
  * `useFavorites`: Manajemen bookmark kedai dengan *LocalStorage persistence*.
  * `useCompare`: Manajemen komparasi side-by-side (hingga 3 kedai).
  * `useReviews`: Penyimpanan ulasan & rating pengguna di LocalStorage.
  * `useCustomCafes`: Mendukung penambahan kedai baru oleh user/admin yang tersimpan persisten.
  * `useGeolocation`: Hitung jarak pengguna ke koordinat kedai via *Haversine formula*.
* **Dark / Light Theme**: Pengaturan tema otomatis tersimpan di LocalStorage.

### 3. 🔴 V6 — User & Admin Dashboard
* **/dashboard** dengan toggle dual-view:
  * **User Dashboard**: Statistik personal (Total Favorit, Ulasan yang ditulis, Kedai yang diajukan).
  * **Admin / Kurator Panel**: Metrik direktori, manajemen data kedai, dan formulir lengkap untuk submit & publikasi kedai baru.

### 4. 🚀 V7 — High Impact Killer Features
* **Interactive Leaflet Map**: Peta OpenStreetMap interaktif dengan custom icon pin kopi, sinkronisasi realtime dengan hasil filter, dan pop-up interaktif.
* **Side-by-Side Cafe Comparison**: Komparasi hingga 3 kedai sekaligus pada tabel matriks fitur (Rating, WFC Score, WiFi Speed, Sockets, Range Harga, & Fasilitas).
* **Smart Recommendation Wizard ("KopiFinder")**: Kuis interaktif 3 langkah untuk mencocokkan vibe, budget, dan fasilitas impian dengan algoritma scoring kecocokan (Match %).

---

## 🛠️ Tech Stack

* **Framework**: React 18
* **Build Tool**: Vite
* **Routing**: React Router DOM v6
* **Styling**: Tailwind CSS
* **Icons**: Lucide React
* **Maps**: Leaflet & OpenStreetMap
* **Persistence**: Web Storage API (LocalStorage)

---

## 💻 Menjalankan Proyek Secara Lokal

```bash
# Masuk ke direktori proyek
cd C:\Users\LENOVO\.gemini\antigravity\scratch\kopidex

# Instal dependensi (jika belum)
npm install

# Jalankan development server
npm run dev

# Build untuk produksi
npm run build
```
