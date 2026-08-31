import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  User, 
  ShieldCheck, 
  Coffee, 
  Heart, 
  MessageSquare, 
  PlusCircle, 
  Trash2, 
  CheckCircle2, 
  ExternalLink,
  MapPin,
  Sparkles,
  Zap,
  TrendingUp
} from "lucide-react";
import { ALL_FACILITIES } from "../data/cafes";

export function Dashboard({
  allCafes = [],
  customCafes = [],
  onAddCafe,
  onDeleteCafe,
  favorites = [],
  reviews = [],
  onDeleteReview
}) {
  const [activeTab, setActiveTab] = useState("user"); // 'user' or 'admin'
  const [showAddForm, setShowAddForm] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // New Cafe Form State
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    area: "Selatan",
    price: "$$",
    priceNumeric: 35000,
    priceDetails: "Rp 25.000 - Rp 60.000",
    openHours: "08:00 - 22:00",
    shortAddress: "",
    fullAddress: "",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
    wfcScore: 9.0,
    wifiSpeed: "100 Mbps",
    socketCount: "Banyak di setiap meja",
    facilities: ["WiFi Kencang", "AC Dingin", "Banyak Stopkontak"],
    category: ["WFC", "Specialty"],
    lat: -6.2297,
    lng: 106.8166
  });

  const handleFacilityToggle = (fac) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(fac)
        ? prev.facilities.filter((f) => f !== fac)
        : [...prev.facilities, fac]
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onAddCafe({
      ...formData,
      coordinates: {
        lat: Number(formData.lat) || -6.2297,
        lng: Number(formData.lng) || 106.8166
      },
      priceNumeric: Number(formData.priceNumeric) || 35000,
      wfcScore: Number(formData.wfcScore) || 8.5
    });

    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setShowAddForm(false);
    }, 2000);
  };

  return (
    <div className="space-y-8 pb-16 animate-fade-in max-w-6xl mx-auto">
      
      {/* Header with Dual View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-emerald-500" />
            <h1 className="text-2xl font-extrabold text-stone-900 dark:text-white">
              Dashboard KopiDex
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Pusat aktivitas pengguna, ringkasan ulasan, dan panel kurasi direktori kedai
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("user")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "user"
                ? "bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-sm"
                : "text-stone-500 hover:text-stone-900 dark:hover:text-white"
            }`}
          >
            <User className="w-4 h-4 text-amber-500" />
            <span>Dashboard Pengguna</span>
          </button>
          <button
            onClick={() => setActiveTab("admin")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "admin"
                ? "bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-sm"
                : "text-stone-500 hover:text-stone-900 dark:hover:text-white"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Kurator / Admin</span>
          </button>
        </div>
      </div>

      {/* ================= USER VIEW ================= */}
      {activeTab === "user" && (
        <div className="space-y-6 animate-fade-in">
          
          {/* User Stats Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center shrink-0">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Kedai Favorit</span>
                <div className="text-2xl font-black text-stone-900 dark:text-white">{favorites.length}</div>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center shrink-0">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Ulasan Dibuat</span>
                <div className="text-2xl font-black text-stone-900 dark:text-white">{reviews.length}</div>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
                <Coffee className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Kedai Diajukan</span>
                <div className="text-2xl font-black text-stone-900 dark:text-white">{customCafes.length}</div>
              </div>
            </div>

          </div>

          {/* User Reviews History */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-stone-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-600" />
                Riwayat Ulasan Kamu
              </h3>
            </div>

            {reviews.length === 0 ? (
              <p className="text-xs text-stone-400 py-6 text-center">Kamu belum menulis ulasan untuk kedai manapun.</p>
            ) : (
              <div className="divide-y divide-stone-100 dark:divide-stone-800">
                {reviews.map((rev) => {
                  const targetCafe = allCafes.find((c) => c.id === rev.cafeId);
                  return (
                    <div key={rev.id} className="py-3.5 flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/cafe/${rev.cafeId}`}
                            className="font-bold text-xs sm:text-sm text-stone-900 dark:text-white hover:text-amber-600 transition-colors"
                          >
                            {targetCafe ? targetCafe.name : "Kedai Kopi"}
                          </Link>
                          <span className="text-[11px] text-amber-500 font-bold">⭐ {rev.rating}</span>
                          <span className="text-[10px] text-stone-400">({rev.createdAt})</span>
                        </div>
                        <p className="text-xs text-stone-600 dark:text-stone-400">{rev.comment}</p>
                      </div>

                      <button
                        onClick={() => onDeleteReview(rev.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-500 transition-colors"
                        title="Hapus ulasan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

      {/* ================= ADMIN VIEW ================= */}
      {activeTab === "admin" && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Admin Stats Header */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-center">
              <span className="text-[11px] text-stone-400 uppercase font-bold">Total Kedai Aktif</span>
              <div className="text-2xl font-black text-amber-600 mt-1">{allCafes.length}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-center">
              <span className="text-[11px] text-stone-400 uppercase font-bold">Kedai Komunitas</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">{customCafes.length}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-center">
              <span className="text-[11px] text-stone-400 uppercase font-bold">Total Review</span>
              <div className="text-2xl font-black text-stone-900 dark:text-white mt-1">{reviews.length}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-center">
              <span className="text-[11px] text-stone-400 uppercase font-bold">Status Server</span>
              <div className="text-xs font-black text-emerald-600 mt-2 flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Online
              </div>
            </div>
          </div>

          {/* Quick Action: Add Cafe Button */}
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-stone-900 dark:text-white">
              Manajemen Data Kedai Kopi
            </h3>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1.5 transition-colors shadow-sm shadow-amber-600/30"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{showAddForm ? "Tutup Form" : "Tambah Kedai Baru"}</span>
            </button>
          </div>

          {/* Add Cafe Form Modal/Collapsible */}
          {showAddForm && (
            <form
              onSubmit={handleFormSubmit}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 space-y-5 animate-fade-in shadow-lg"
            >
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                <h4 className="font-bold text-sm text-stone-900 dark:text-white">
                  Formulir Tambah Kedai Kopi Baru
                </h4>
                {formSuccess && (
                  <span className="text-xs font-bold text-emerald-600">
                    🎉 Kedai berhasil ditambahkan!
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Nama Kedai *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Kopi Titik Temu"
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Tagline Singkat</label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="Contoh: Kedai Vintage Tenang di Jaksel"
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Wilayah Jakarta</label>
                  <select
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
                  >
                    <option value="Selatan">Jakarta Selatan</option>
                    <option value="Pusat">Jakarta Pusat</option>
                    <option value="Barat">Jakarta Barat</option>
                    <option value="Timur">Jakarta Timur</option>
                    <option value="Utara">Jakarta Utara</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Estimasi Harga (Range)</label>
                  <select
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
                  >
                    <option value="$">Hemat ($) &lt; Rp 25.000</option>
                    <option value="$$">Sedang ($$) Rp 25.000 - 40.000</option>
                    <option value="$$$">Premium ($$$) &gt; Rp 40.000</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Jam Buka</label>
                  <input
                    type="text"
                    value={formData.openHours}
                    onChange={(e) => setFormData({ ...formData, openHours: e.target.value })}
                    placeholder="08:00 - 22:00"
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Skor WFC (1 - 10)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    value={formData.wfcScore}
                    onChange={(e) => setFormData({ ...formData, wfcScore: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Alamat Lengkap</label>
                  <input
                    type="text"
                    value={formData.fullAddress}
                    onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value, shortAddress: e.target.value })}
                    placeholder="Jl. Wijaya No. 12, Melawai, Kebayoran Baru"
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">URL Foto (Unsplash/Direct Link)</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Facilities Checklist */}
              <div>
                <label className="font-bold text-xs uppercase tracking-wider text-stone-500 block mb-2">Fasilitas yang Tersedia</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ALL_FACILITIES.map((fac) => (
                    <label key={fac} className="flex items-center gap-2 text-xs cursor-pointer text-stone-700 dark:text-stone-300">
                      <input
                        type="checkbox"
                        checked={formData.facilities.includes(fac)}
                        onChange={() => handleFacilityToggle(fac)}
                        className="rounded text-amber-600"
                      />
                      <span>{fac}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-500 hover:bg-stone-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                >
                  Simpan & Publikasikan Kedai
                </button>
              </div>
            </form>
          )}

          {/* List of Custom Added Cafes */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 space-y-4">
            <h4 className="font-bold text-sm text-stone-900 dark:text-white">
              Daftar Kedai Buatan Sendiri / Komunitas ({customCafes.length})
            </h4>

            {customCafes.length === 0 ? (
              <p className="text-xs text-stone-400 py-4 text-center">Belum ada kedai yang ditambahkan melalui dashboard.</p>
            ) : (
              <div className="space-y-3">
                {customCafes.map((cafe) => (
                  <div
                    key={cafe.id}
                    className="p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img src={cafe.image} alt={cafe.name} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <h5 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-white">{cafe.name}</h5>
                        <p className="text-[11px] text-stone-500">Jak-{cafe.area} • {cafe.price} • {cafe.openHours}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/cafe/${cafe.id}`}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 text-white"
                      >
                        Lihat
                      </Link>
                      <button
                        onClick={() => onDeleteCafe(cafe.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600"
                        title="Hapus kedai"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
