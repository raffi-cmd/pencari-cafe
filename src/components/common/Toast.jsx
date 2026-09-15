import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export function Toast({ message, type = "success", onClose }) {
  if (!message) return null;

  const bgColors = {
    success: "bg-emerald-900/90 text-white border-emerald-700/60",
    error: "bg-rose-900/90 text-white border-rose-700/60",
    info: "bg-stone-900/90 text-white border-stone-700/60"
  };

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />,
    info: <Info className="w-4 h-4 text-amber-400 shrink-0" />
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
      <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border shadow-xl backdrop-blur-md text-xs sm:text-sm font-medium ${bgColors[type] || bgColors.info}`}>
        {icons[type] || icons.info}
        <span>{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-2 text-stone-400 hover:text-white transition-colors"
            aria-label="Tutup notifikasi"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
