import React, { useState, useEffect, useRef } from "react";
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
  Sparkles, 
  MessageSquare, 
  Star, 
  Send,
  Coffee,
  AlertCircle
} from "lucide-react";
import { StarRating } from "../components/common/StarRating";
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
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const cafe = allCafes.find((c) => c.id === id);

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
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-amber-600 text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Jelajah
        </Link>
      </div>
    );
  }

  const isOpen = isCafeOpen(cafe.openHours);
  const cafeReviews = reviews.filter((r) => r.cafeId === cafe.id);

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
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 4000);
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
      alert("Tautan kedai berhasil disalin!");
    }
  };

  return (
    <div className="space-y-8 pb-16 animate-fade-in max-w-5xl mx-auto">
      
      {/* Breadcrumbs & Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-stone-600 dark:text-stone-300 hover:text-amber-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleFavorite(cafe.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              isFavorite(cafe.id)
                ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950 dark:border-rose-800 dark:text-rose-300"
                : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100"
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite(cafe.id) ? "fill-rose-500 text-rose-500" : ""}`} />
            <span>{isFavorite(cafe.id) ? "Tersimpan" : "Simpan"}</span>
          </button>

          <button
            onClick={() => onToggleCompare(cafe.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              isInCompare(cafe.id)
                ? "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300"
                : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100"
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>{isInCompare(cafe.id) ? "Dalam Komparasi" : "Bandingkan"}</span>
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-100"
            title="Bagikan"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl overflow-hidden shadow-sm">
        
        {/* Main Image */}
        <div className="relative aspect-[21/9] sm:aspect-[21/8] w-full overflow-hidden bg-stone-800">
          <img
            src={cafe.image}
            alt={cafe.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          
          <div className="absolute bottom-5 left-5 right-5 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    isOpen ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                  }`}
                >
                  {isOpen ? "🟢 Buka Sekarang" : "🔴 Tutup"}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-600 text-white">
                  📍 Jakarta {cafe.area}
                </span>
                {cafe.category?.map((cat) => (
                  <span key={cat} className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-stone-100">
                    {cat}
                  </span>
                ))}
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">{cafe.name}</h1>
              <p className="text-xs sm:text-base text-stone-300 mt-1 max-w-xl">{cafe.tagline}</p>
            </div>

            {cafe.wfcScore && (
              <div className="p-3.5 rounded-2xl bg-amber-500/90 backdrop-blur-md text-white text-center shrink-0">
                <div className="text-[10px] uppercase font-bold tracking-wider">WFC Score</div>
                <div className="text-2xl font-black">{cafe.wfcScore} <span className="text-xs font-normal">/ 10</span></div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 border-t border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 text-center">
          <div>
            <span className="text-[11px] text-stone-400 font-bold uppercase block">Rating</span>
            <div className="flex items-center justify-center gap-1 font-bold text-stone-900 dark:text-white mt-1">
              <StarRating rating={cafe.rating} count={cafe.reviewCount} />
            </div>
          </div>
          <div>
            <span className="text-[11px] text-stone-400 font-bold uppercase block">Estimasi Budget</span>
            <span className="font-bold text-amber-600 dark:text-amber-400 text-sm block mt-1">
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
            <span className="text-[11px] text-stone-400 font-bold uppercase block">Jam Operasional</span>
            <span className="font-bold text-stone-900 dark:text-white text-xs block mt-1">
              {cafe.openHours}
            </span>
          </div>
        </div>

      </div>

      {/* Main Grid: Details & Side info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Facilities, Menu, Reviews */}
        <div className="md:col-span-2 space-y-6">
          
          {/* WFC & Facilities Box */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-base text-stone-900 dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Fasilitas & Kenyamanan Kerja
            </h3>
            
            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-stone-700 dark:text-stone-300">Stopkontak:</span>
                <span className="font-bold text-amber-900 dark:text-amber-300">{cafe.socketCount || "Tersedia melimpah"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-stone-700 dark:text-stone-300">Koneksi WiFi:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">{cafe.wifiSpeed || "Kencang & Stabil"}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
              {cafe.facilities?.map((f, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-xs font-medium text-stone-700 dark:text-stone-300 p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800/70"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="truncate">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Highlights Menu */}
          {cafe.menuHighlights && (
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 space-y-4">
              <h3 className="font-bold text-base text-stone-900 dark:text-white flex items-center gap-2">
                <Coffee className="w-5 h-5 text-amber-600" />
                Menu Andalan Rekomendasi
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cafe.menuHighlights.map((menu, idx) => {
                  const name = typeof menu === "string" ? menu : menu.name;
                  const price = typeof menu === "string" ? "Rp 30.000+" : menu.price;
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 flex items-center justify-between"
                    >
                      <span className="font-bold text-xs sm:text-sm text-stone-900 dark:text-white">☕ {name}</span>
                      <span className="font-extrabold text-xs text-amber-600 dark:text-amber-400">{price}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Community Reviews & Review Form */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
              <div>
                <h3 className="font-bold text-base text-stone-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-amber-600" />
                  Ulasan Pengunjung ({cafeReviews.length})
                </h3>
                <p className="text-xs text-stone-500">Bagikan pengalaman ngopi atau WFC kamu di sini</p>
              </div>
            </div>

            {/* Submission Form */}
            <form onSubmit={handleSubmitReview} className="space-y-4 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                Tulis Ulasan Baru
              </h4>

              {reviewSuccess && (
                <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                  🎉 Terima kasih! Ulasanmu berhasil tersimpan dan diterbitkan.
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Nama kamu (cth: Budi Santoso)"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  className="px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />

                <div className="flex items-center gap-2 bg-white dark:bg-stone-800 px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700">
                  <span className="text-xs font-semibold text-stone-500">Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="text-amber-500 focus:outline-none hover:scale-110 transition-transform"
                      >
                        <Star className={`w-4 h-4 ${star <= reviewRating ? "fill-amber-400 text-amber-400" : "text-stone-300"}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <textarea
                rows={3}
                placeholder="Ceritakan pengalamanmu (suasana, WiFi, kopi favorit, kenyamanan kerja)..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-stone-400"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1.5 transition-colors shadow-sm shadow-amber-600/30"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Ulasan</span>
                </button>
              </div>
            </form>

            {/* Reviews Feed */}
            <div className="space-y-3">
              {cafeReviews.length === 0 ? (
                <p className="text-xs text-stone-400 text-center py-4">Belum ada ulasan untuk kedai ini. Jadilah yang pertama!</p>
              ) : (
                cafeReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl border border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs sm:text-sm text-stone-900 dark:text-white">
                        {rev.userName}
                      </span>
                      <span className="text-[11px] text-stone-400">{rev.createdAt}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <StarRating rating={rev.rating} showValue={false} />
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed pt-1">
                      {rev.comment}
                    </p>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>

        {/* Right Column: Location & Google Maps */}
        <div className="space-y-6">
          
          {/* Location & Mini Map Card */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 space-y-4">
            <h4 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-600" />
              Lokasi & Navigasi
            </h4>

            {/* Leaflet Mini Map */}
            <div
              ref={miniMapRef}
              className="w-full h-44 rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-700 z-0"
            />

            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Alamat Lengkap</span>
              <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                {cafe.fullAddress || cafe.shortAddress}
              </p>
            </div>

            {cafe.mapsUrl && (
              <a
                href={cafe.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-stone-900 hover:bg-stone-800 text-white dark:bg-white dark:text-stone-900 dark:hover:bg-stone-100 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <span>Buka Rute di Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Side Info Box */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-200/50 dark:border-amber-900/50 space-y-2">
            <h5 className="font-extrabold text-xs text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Tips Ngopi di {cafe.name}
            </h5>
            <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
              Untuk WFC yang tenang dan dapat colokan terbaik, disarankan datang sebelum jam 11:00 atau setelah jam 14:00 saat jam makan siang selesai.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
