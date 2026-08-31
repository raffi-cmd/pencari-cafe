import React, { useEffect, useRef } from "react";
import L from "leaflet";
import { MapPin, Navigation, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export function CafeMap({
  cafes = [],
  userLocation = null,
  onSelectCafe,
  selectedCafeId = null
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map if not already done
    if (!mapInstanceRef.current) {
      const defaultCenter = [-6.2297, 106.8166]; // Jakarta
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 12,
        zoomControl: true,
        scrollWheelZoom: false
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear previous markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add user location marker if available
    if (userLocation && userLocation.lat && userLocation.lng) {
      const userIcon = L.divIcon({
        className: "custom-user-marker",
        html: `
          <div style="
            background-color: #2563eb;
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 0 6px rgba(37, 99, 235, 0.3), 0 4px 6px -1px rgba(0,0,0,0.1);
            border: 2px solid white;
          ">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v20M2 12h20"/></svg>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(map)
        .bindPopup("<b>📍 Lokasi Kamu Sekarang</b>");
      markersRef.current.push(userMarker);
    }

    // Add Cafe Markers
    const bounds = [];

    cafes.forEach((cafe) => {
      if (!cafe.coordinates || !cafe.coordinates.lat || !cafe.coordinates.lng) return;

      const isSelected = selectedCafeId === cafe.id;
      const markerColor = isSelected ? "#d97706" : "#78350f";

      const cafeIcon = L.divIcon({
        className: "custom-cafe-marker",
        html: `
          <div style="
            background: linear-gradient(135deg, ${isSelected ? '#f59e0b' : '#d97706'}, ${isSelected ? '#b45309' : '#78350f'});
            color: white;
            width: 36px;
            height: 36px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3);
            border: 2px solid white;
            cursor: pointer;
            transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'};
            transition: transform 0.2s;
          ">
            ☕
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -20]
      });

      const marker = L.marker([cafe.coordinates.lat, cafe.coordinates.lng], { icon: cafeIcon })
        .addTo(map);

      // Custom Popup HTML
      const popupHtml = `
        <div style="width: 220px; font-family: 'Plus Jakarta Sans', sans-serif;">
          <img src="${cafe.image || ''}" style="width: 100%; height: 110px; object-fit: cover; border-top-left-radius: 12px; border-top-right-radius: 12px;" />
          <div style="padding: 10px;">
            <div style="font-size: 11px; font-weight: 700; color: #d97706; text-transform: uppercase;">JAK-${cafe.area} • ${cafe.price}</div>
            <h4 style="font-weight: 800; font-size: 13px; margin: 2px 0 4px; color: #1c1917; line-height: 1.2;">${cafe.name}</h4>
            <div style="font-size: 11px; color: #78716c; margin-bottom: 8px;">⭐ ${cafe.rating} • ⚡ WFC ${cafe.wfcScore || '-'}</div>
            <a href="/cafe/${cafe.id}" style="
              display: block;
              text-align: center;
              background-color: #d97706;
              color: white;
              font-size: 11px;
              font-weight: 700;
              padding: 6px 10px;
              border-radius: 8px;
              text-decoration: none;
            ">Lihat Kedai →</a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on("click", () => {
        if (onSelectCafe) onSelectCafe(cafe);
      });

      markersRef.current.push(marker);
      bounds.push([cafe.coordinates.lat, cafe.coordinates.lng]);
    });

    // Fit map bounds if there are markers
    if (bounds.length > 0) {
      if (bounds.length === 1) {
        map.setView(bounds[0], 14);
      } else {
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    }
  }, [cafes, userLocation, selectedCafeId, onSelectCafe]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-3xl overflow-hidden shadow-sm relative">
      {/* Map Header Status */}
      <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/70 dark:bg-stone-800/40">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-amber-600" />
          <span className="font-bold text-xs sm:text-sm text-stone-900 dark:text-white">
            Peta Sebaran Kedai Kopi ({cafes.length} Lokasi Terplot)
          </span>
        </div>
        <span className="text-[11px] text-stone-500 dark:text-stone-400">
          Klik pin untuk info kedai
        </span>
      </div>

      {/* Leaflet Container */}
      <div
        ref={mapContainerRef}
        className="w-full h-[450px] sm:h-[550px] z-0"
      />
    </div>
  );
}
