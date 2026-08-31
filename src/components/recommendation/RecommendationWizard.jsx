import React, { useState } from "react";
import { 
  Sparkles, 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Laptop, 
  Camera, 
  Users, 
  Wallet, 
  Heart, 
  Coffee,
  RotateCcw
} from "lucide-react";
import { Link } from "react-router-dom";
import { StarRating } from "../common/StarRating";

export function RecommendationWizard({ allCafes = [], isOpen, onClose, onQuickView }) {
  const [step, setStep] = useState(1);
  const [purpose, setPurpose] = useState("wfc"); // wfc, hangout, date, budget
  const [budget, setBudget] = useState("any"); // any, low, mid, high
  const [requiredPerks, setRequiredPerks] = useState(["WiFi Kencang", "Banyak Stopkontak"]);
  const [recommendations, setRecommendations] = useState([]);

  if (!isOpen) return null;

  const togglePerk = (perk) => {
    setRequiredPerks((prev) =>
      prev.includes(perk) ? prev.filter((p) => p !== perk) : [...prev, perk]
    );
  };

  const calculateRecommendations = () => {
    const scoredCafes = allCafes.map((cafe) => {
      let score = 0;

      // Purpose matching
      if (purpose === "wfc") {
        if (cafe.category?.includes("WFC")) score += 40;
        score += (cafe.wfcScore || 8) * 4;
      } else if (purpose === "hangout") {
        if (cafe.category?.includes("Aesthetic") || cafe.category?.includes("Vintage")) score += 35;
        if (cafe.facilities?.includes("Area Outdoor")) score += 15;
      } else if (purpose === "date") {
        if (cafe.category?.includes("Aesthetic") || cafe.category?.includes("Specialty")) score += 40;
        if (cafe.rating >= 4.7) score += 20;
      } else if (purpose === "budget") {
        if (cafe.price === "$") score += 50;
        if (cafe.price === "$$") score += 20;
      }

      // Budget matching
      if (budget === "low" && cafe.price === "$") score += 30;
      if (budget === "mid" && cafe.price === "$$") score += 30;
      if (budget === "high" && cafe.price === "$$$") score += 30;
      if (budget === "any") score += 15;

      // Perks matching
      requiredPerks.forEach((perk) => {
        if (cafe.facilities?.includes(perk)) {
          score += 15;
        }
      });

      // Rating bonus
      score += (cafe.rating || 4.5) * 5;

      return {
        ...cafe,
        matchScore: Math.min(Math.round(score), 99)
      };
    });

    scoredCafes.sort((a, b) => b.matchScore - a.matchScore);
    setRecommendations(scoredCafes.slice(0, 3));
    setStep(4); // Results step
  };

  const handleReset = () => {
    setStep(1);
    setPurpose("wfc");
    setBudget("any");
    setRequiredPerks(["WiFi Kencang", "Banyak Stopkontak"]);
    setRecommendations([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Wizard Header */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
            <Sparkles className="w-5 h-5 text-amber-100" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-stone-900 dark:text-white">
              KopiFinder Cerdas
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {step <= 3 ? `Langkah ${step} dari 3: Sesuaikan preferensi ngopimu` : "Hasil Rekomendasi Khusus Buat Kamu"}
            </p>
          </div>
        </div>

        {/* STEP 1: Purpose / Vibe */}
        {step === 1 && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-stone-800 dark:text-stone-200">
              Apa agenda ngopi utama kamu hari ini?
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "wfc", label: "Work From Cafe", desc: "Butuh fokus, WiFi kencang & colokan", icon: Laptop },
                { id: "hangout", label: "Nongkrong Santai", desc: "Suasana seru bareng teman", icon: Users },
                { id: "date", label: "Date / Estetik", desc: "Spot foto cakep & vibes hangat", icon: Camera },
                { id: "budget", label: "Ngopi Hemat", desc: "Rasa mantap, ramah di kantong", icon: Wallet }
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = purpose === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setPurpose(item.id)}
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                      isSelected
                        ? "border-amber-500 bg-amber-50/80 dark:bg-amber-950/50 ring-2 ring-amber-500 text-amber-900 dark:text-amber-200"
                        : "border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? "text-amber-600 dark:text-amber-400" : "text-stone-400"}`} />
                    <div>
                      <div className="font-bold text-xs sm:text-sm">{item.label}</div>
                      <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">{item.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1.5 transition-colors"
              >
                <span>Lanjut</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Budget */}
        {step === 2 && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-stone-800 dark:text-stone-200">
              Berapa estimasi budget per orang?
            </h4>
            <div className="space-y-2">
              {[
                { id: "any", label: "Bebas / Tidak Masalah", desc: "Semua range harga kedai" },
                { id: "low", label: "Hemat ($)", desc: "Di bawah Rp 25.000 (Es Kopi Susu harian)" },
                { id: "mid", label: "Sedang ($$)", desc: "Rp 25.000 - Rp 45.000 (Standar cafe nyaman)" },
                { id: "high", label: "Premium / Specialty ($$$)", desc: "Di atas Rp 45.000 (Artisan beans & dining)" }
              ].map((item) => {
                const isSelected = budget === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setBudget(item.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? "border-amber-500 bg-amber-50/80 dark:bg-amber-950/50 ring-2 ring-amber-500 text-amber-900 dark:text-amber-200"
                        : "border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300"
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs sm:text-sm">{item.label}</div>
                      <div className="text-[11px] text-stone-500 dark:text-stone-400">{item.desc}</div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-amber-600 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1.5 transition-colors"
              >
                <span>Lanjut</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Must-Have Perks */}
        {step === 3 && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-stone-800 dark:text-stone-200">
              Pilih fasilitas yang wajib ada:
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                "WiFi Kencang",
                "Banyak Stopkontak",
                "AC Dingin",
                "Area Outdoor",
                "Musala",
                "Parkir Mobil",
                "Quiet Area",
                "Pet Friendly"
              ].map((perk) => {
                const isChecked = requiredPerks.includes(perk);
                return (
                  <button
                    key={perk}
                    onClick={() => togglePerk(perk)}
                    className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all flex items-center justify-between ${
                      isChecked
                        ? "border-amber-500 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-bold"
                        : "border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-50"
                    }`}
                  >
                    <span>{perk}</span>
                    {isChecked && <Check className="w-3.5 h-3.5 text-amber-600" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>
              <button
                onClick={calculateRecommendations}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
              >
                <Sparkles className="w-4 h-4" />
                <span>Lihat Hasil Rekomendasi</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Results */}
        {step === 4 && (
          <div className="space-y-4 animate-fade-in">
            <div className="space-y-3">
              {recommendations.map((cafe, idx) => (
                <div
                  key={cafe.id}
                  className="p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 flex items-center gap-3.5 hover:border-amber-500 transition-colors"
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                    <img src={cafe.image} alt={cafe.name} className="w-full h-full object-cover" />
                    <span className="absolute top-0 left-0 bg-amber-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-br-lg">
                      #{idx + 1}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h5 className="font-extrabold text-xs sm:text-sm text-stone-900 dark:text-white truncate">
                        {cafe.name}
                      </h5>
                      <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full shrink-0">
                        {cafe.matchScore}% Match
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 flex items-center gap-2">
                      <span>Jak-{cafe.area}</span>
                      <span>•</span>
                      <span>{cafe.price}</span>
                      <span>•</span>
                      <span>⭐ {cafe.rating}</span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <Link
                      to={`/cafe/${cafe.id}`}
                      onClick={onClose}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition-colors"
                    >
                      Buka
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 flex items-center justify-between">
              <button
                onClick={handleReset}
                className="text-xs font-semibold text-stone-500 hover:text-stone-900 dark:hover:text-white flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Ulangi Kuis
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-200"
              >
                Selesai
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
