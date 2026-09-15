import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import L from "leaflet";
import { 
  Heart, 
  Scale, 
  MapPin, 
  Clock, 
  ExternalLink, 
  Share2, 
  Wifi, 
  Zap, 
  CheckCircle2, 
  ArrowLeft, 
  MessageSquare, 
  Star, 
  Send,
  Coffee,
  AlertCircle,
  Sparkles
} from "lucide-react";
import { StarRating } from "../components/common/StarRating";
import { CafeCard } from "../components/cafe/CafeCard";
import { Toast } from "../components/common/Toast";
import { isCafeOpen } from "../hooks/useCafeFilter";

export function CafeDetail({
  allCafes = [],
  isFavorite,
  onToggleFavorite,
  isInCompare,
  onToggleCompare,
  reviews = [],
  onAddReview
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const miniMapRef = useRef(null);

  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [toastMessage, setToastMessage] = useState(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const cafe = allCafes.find((c) => c.id === id);

  // Dynamic SEO Page Title
  useEffect(() => {
    if (cafe) {
      document.title = `${cafe.name} — KopiDex`;
      window.scrollTo(0, 0);
    }
    return () => {
      document.title = "KopiDex — Direktori Kedai Kopi Lokal & WFC Terkurasi";
    };
  }, [cafe]);

  // Similar Cafes (Same area or same category)
  const similarCafes = useMemo(() => {
    if (!cafe) return [];
    return allCafes
      .filter((c) => c.id !== cafe.id && (c.area === cafe.area || c.category?.some((cat) => cafe.category?.includes(cat))))
      .slice(0, 3);
  }, [cafe, allCafes]);

  // Initialize mini Leaflet map
  useEffect(() => {
    if (!cafe || !cafe.coordinates || !miniMapRef.current) return;

    const map = L.map(miniMapRef.current, {
      center: [cafe.coordinates.lat, cafe.coordinates.lng],
      zoom: 15,
      zoomControl: false,
      scrollWheelZoom: false
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    const cafeIcon = L.divIcon({
      className: "custom-pin",
      html: `
        <div style="
          background: #d97706;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);
        ">☕</div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    L.marker([cafe.coordinates.lat, cafe.coordinates.lng], { icon: cafeIcon }).addTo(map);

    return () => {
      map.remove();
    };
  }, [cafe]);

  if (!cafe) {
    return (
      <div className="text-center py-20 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-stone-900 dark:text-white">Kedai Tidak Ditemukan</h2>
        <p className="text-sm text-stone-500">Kedai kopi yang kamu cari mungkin sudah dihapus atau tidak tersedia.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-amber-600 text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Jelajah
        </Link>
      </div>
    );
  }

  const isOpen = isCafeOpen(cafe.openHours);
  const cafeReviews = reviews.filter((r) => r.cafeId === cafe.id);
  const images = cafe.gallery && cafe.gallery.length > 0 ? cafe.gallery : [cafe.image];

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    onAddReview({
      cafeId: cafe.id,
      userName: reviewName.trim() || "Pecinta Kopi",
      rating: reviewRating,
      comment: reviewComment.trim()
    });

    setReviewName("");
    setReviewComment("");
    setReviewRating(5);
    setToastMessage({ text: "Ulasan kamu berhasil diterbitkan!", type: "success" });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: cafe.name,
        text: `Cek tempat ngopi ${cafe.name} di KopiDex!`,
        url
      });
    } else {
      navigator.clipboard.writeText(url);
      setToastMessage({ text: "Tautan kedai berhasil disalin!", type: "info" });
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-10 pb-16 animate-fade-in max-w-5xl mx-auto">
      
      {/* Toast Alert */}
      {toastMessage && (
        <Toast
          message={toastMessage.text}
          type={toastMessage.type}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleFavorite(cafe.id)}
            aria-label="Simpan ke favorit"
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              isFavorite(cafe.id)
                ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/80 dark:border-rose-800 dark:text-rose-300"
                : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite(cafe.id) ? "fill-rose-500 text-rose-500" : ""}`} />
            <span>{isFavorite(cafe.id) ? "Tersimpan" : "Simpan"}</span>
          </button>

          <button
            onClick={() => onToggleCompare(cafe.id)}
            aria-label="Bandingkan kedai"
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              isInCompare(cafe.id)
                ? "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950/80 dark:border-blue-800 dark:text-blue-300"
                : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50"
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>{isInCompare(cafe.id) ? "Dalam Komparasi" : "Bandingkan"}</span>
          </button>

          <button
            onClick={handleShare}
            aria-label="Bagikan kedai"
            className="p-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-50"
            title="Bagikan"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Header / Banner */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-3xl overflow-hidden shadow-sm">
        
        {/* Main Photo Gallery */}
        <div className="relative aspect-[21/9] sm:aspect-[21/8] w-full overflow-hidden bg-stone-900">
          <img
            src={images[activeImageIdx] || cafe.image}
            alt={cafe.name}
            className="w-full h-full object-cover transition-all duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
          
          {/* Header Info Overlay */}
          <div className="absolute bottom-5 left-5 right-5 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    isOpen ? "bg-emerald-500 text-white" : "bg-stone-700 text-stone-200"
                  }`}
                >
                  {isOpen ? "Buka Sekarang" : "Tutup"}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-600 text-white">
                  Jak-{cafe.area}
                </span>
                {cafe.category?.map((cat) => (
                  <span key={cat} className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 backdrop-blur-md text-stone-100">
                    {cat}
                  </span>
                ))}
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">{cafe.name}</h1>
              <p className="text-xs sm:text-sm text-stone-200 mt-1 max-w-xl">{cafe.tagline}</p>
            </div>

            {cafe.wfcScore && (
              <div className="p-3 rounded-2xl bg-amber-500/95 backdrop-blur-md text-white text-center shrink-0">
                <div className="text-[10px] uppercase font-bold tracking-wider">WFC Score</div>
                <div className="text-2xl font-black">{cafe.wfcScore} <span className="text-xs font-normal">/ 10</span></div>
              </div>
            )}
          </div>
        </div>

        {/* Gallery Thumbnails (if multiple images) */}
        {images.length > 1 && (
          <div className="p-3 bg-stone-50 dark:bg-stone-800/40 border-t border-stone-100 dark:border-stone-800 flex items-center gap-2 overflow-x-auto custom-scrollbar">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`relative w-16 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                  activeImageIdx === idx ? "border-amber-500 scale-105" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 border-t border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/20 text-center">
          <div>
            <span className="text-[11px] text-stone-400 font-bold uppercase block">Rating</span>
            <div className="flex items-center justify-center gap-1 font-bold text-stone-900 dark:text-white mt-1">
              <StarRating rating={cafe.rating} count={cafe.reviewCount} />
            </div>
          </div>
          <div>
            <span className="text-[11px] text-stone-400 font-bold uppercase block">Estimasi Budget</span>
            <span className="font-bold text-amber-700 dark:text-amber-400 text-sm block mt-1">
              {cafe.priceDetails || cafe.price}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-stone-400 font-bold uppercase block">Kecepatan WiFi</span>
            <span className="font-bold text-stone-900 dark:text-white text-sm block mt-1 flex items-center justify-center gap-1">
              <Wifi className="w-3.5 h-3.5 text-emerald-500" />
              {cafe.wifiSpeed || "80 Mbps"}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-stone-400 font-bold uppercase block">Jam Buka</span>
            <span className="font-bold text-stone-900 dark:text-white text-xs block mt-1">
              {cafe.openHours}
            </span>
          </div>
        </div>

      </div>

      {/* Main Grid: Details, Menu, Location, Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Facilities, Menu, Reviews */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Facilities Box */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="font-bold text-base text-stone-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600" />
              Fasilitas & Kesiapan Kerja (WFC)
            </h3>
            
            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-medium text-stone-700 dark:text-stone-300">Stopkontak:</span>
                <span className="font-bold text-amber-900 dark:text-amber-300">{cafe.socketCount || "Tersedia melimpah"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-stone-700 dark:text-stone-300">Koneksi WiFi:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">{cafe.wifiSpeed || "Kencang & Stabil"}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              {cafe.facilities?.map((f, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-xs font-medium text-stone-700 dark:text-stone-300 p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800/70"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="truncate">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Highlights Menu */}
          {cafe.menuHighlights && cafe.menuHighlights.length > 0 && (
            <div className="bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-3xl p-6 space-y-4 shadow-sm">
              <h3 className="font-bold text-base text-stone-900 dark:text-white flex items-center gap-2">
                <Coffee className="w-4 h-4 text-amber-600" />
                Menu Rekomendasi
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {cafe.menuHighlights.map((menu, idx) => {
                  const name = typeof menu === "string" ? menu : menu.name;
                  const price = typeof menu === "string" ? "Rp 30.000+" : menu.price;
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-stone-800 dark:text-stone-200">☕ {name}</span>
                      <span className="font-bold text-amber-700 dark:text-amber-400">{price}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-3xl p-6 space-y-6 shadow-sm">
            <div className="border-b border-stone-100 dark:border-stone-800 pb-3">
              <h3 className="font-bold text-base text-stone-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-600" />
                Ulasan Pengunjung ({cafeReviews.length})
              </h3>
            </div>

            {/* Review Form */}
            <form onSubmit={handleSubmitReview} className="space-y-3.5 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Nama kamu (cth: Dimas)"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  className="px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />

                <div className="flex items-center gap-2 bg-white dark:bg-stone-800 px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700">
                  <span className="text-xs font-medium text-stone-500">Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="text-amber-500 focus:outline-none"
                      >
                        <Star className={`w-4 h-4 ${star <= reviewRating ? "fill-amber-400 text-amber-400" : "text-stone-300"}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <textarea
                rows={2}
                placeholder="Tulis ulasan tentang WiFi, suasana nugas, atau kopi favoritmu..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-stone-400"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-900 hover:bg-amber-600 dark:bg-white dark:text-stone-900 dark:hover:bg-amber-400 text-white flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3 h-3" />
                  <span>Kirim Ulasan</span>
                </button>
              </div>
            </form>

            {/* Review List */}
            <div className="space-y-3">
              {cafeReviews.length === 0 ? (
                <p className="text-xs text-stone-400 text-center py-3">Belum ada ulasan untuk kedai ini.</p>
              ) : (
                cafeReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3.5 rounded-2xl border border-stone-100 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-800/20 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs sm:text-sm text-stone-900 dark:text-white">
                        {rev.userName}
                      </span>
                      <span className="text-[11px] text-stone-400">{rev.createdAt}</span>
                    </div>
                    <StarRating rating={rev.rating} showValue={false} size="w-3.5 h-3.5" />
                    <p className="text-xs text-stone-600 dark:text-stone-300 pt-1 leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>

        {/* Right Col: Location & Map */}
        <div className="space-y-6">
          
          <div className="bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-3xl p-5 space-y-4 shadow-sm">
            <h4 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-600" />
              Lokasi
            </h4>

            {/* Leaflet Mini Map */}
            <div
              ref={miniMapRef}
              className="w-full h-44 rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-700 z-0"
            />

            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Alamat</span>
              <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                {cafe.fullAddress || cafe.shortAddress}
              </p>
            </div>

            {cafe.mapsUrl && (
              <a
                href={cafe.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white dark:bg-white dark:text-stone-900 dark:hover:bg-stone-100 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <span>Buka Rute di Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

        </div>

      </div>

      {/* Similar Cafes Section */}
      {similarCafes.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-stone-200 dark:border-stone-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Eksplorasi Lainnya</span>
            <h3 className="text-xl font-extrabold text-stone-900 dark:text-white">Kedai Serupa di Sekitar Area Ini</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {similarCafes.map((item) => (
              <CafeCard
                key={item.id}
                cafe={item}
                isFavorite={isFavorite(item.id)}
                onToggleFavorite={onToggleFavorite}
                isInCompare={isInCompare(item.id)}
                onToggleCompare={onToggleCompare}
              />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
