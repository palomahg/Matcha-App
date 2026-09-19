import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Spot } from '../../types';
import { formatDistance, calculateDistanceKm } from '../../utils/geo';
import { RatingStars } from '../common/RatingStars';
import {
  List,
  Crosshair,
  Plus,
  Minus,
  X,
  ChevronRight,
  ChevronLeft,
  Bookmark,
  Heart,
  MapPin,
  Sparkles,
  Star,
  Compass,
  Copy,
  Check,
  Coffee,
  Laptop,
  Cookie,
  Clock,
} from 'lucide-react';
import L from 'leaflet';

interface MapViewProps {
  onSwitchToList: () => void;
}

type MapFilterKey = 'all' | 'open' | 'ceremonial' | 'iced' | 'wifi' | 'desserts';

export const MapView: React.FC<MapViewProps> = ({ onSwitchToList }) => {
  const {
    spots,
    userLocation,
    openSpotDetail,
    saved,
    toggleFavorite,
    toggleWantToTry,
    language,
    t,
    rateSpot,
    getUserRatingForSpot,
    setUserCity,
    requestDeviceLocation,
  } = useApp();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const [activeSpot, setActiveSpot] = useState<Spot | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [ratingFeedback, setRatingFeedback] = useState<string | null>(null);
  const [mapFilter, setMapFilter] = useState<MapFilterKey>('all');
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Filter spots on map based on quick filter
  const displayedSpots = useMemo(() => {
    return spots.filter((spot) => {
      if (mapFilter === 'open' && !spot.isOpenNow) return false;
      if (mapFilter === 'ceremonial' && !spot.tags?.includes('ceremonial')) return false;
      if (mapFilter === 'iced' && !spot.tags?.includes('iced_matcha')) return false;
      if (mapFilter === 'wifi' && !spot.tags?.includes('wifi_work')) return false;
      if (mapFilter === 'desserts' && !spot.tags?.includes('desserts')) return false;
      return true;
    });
  }, [spots, mapFilter]);

  // 1. Initialize Map Instance (Only on mount or when city/user coords completely change)
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    // Safety check for React 18/19 StrictMode: clear existing leaflet id on container
    if ((container as any)._leaflet_id) {
      delete (container as any)._leaflet_id;
    }

    // Clean up any stale map instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Create the Leaflet Map
    const map = L.map(container, {
      center: [userLocation.lat, userLocation.lng],
      zoom: 13,
      zoomControl: false, // We render our own warm custom zoom buttons
      attributionControl: false,
    });

    // Clean, 100% free OpenStreetMap tiles - completely free of watermarks or API keys
    const osmTiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c'],
      }
    );

    osmTiles.addTo(map);

    // Create a LayerGroup for spot markers
    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;

    // Subtle attribution in bottom right corner
    L.control
      .attribution({
        position: 'bottomright',
        prefix: '<span style="font-size: 9px; color: #7B8A6F;">&copy; OpenStreetMap</span>',
      })
      .addTo(map);

    mapInstanceRef.current = map;
    setMapReady(true);

    // Force map to recalculate container dimensions once rendered
    const t1 = setTimeout(() => map.invalidateSize(), 100);
    const t2 = setTimeout(() => map.invalidateSize(), 350);
    const t3 = setTimeout(() => map.invalidateSize(), 700);

    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('resize', handleResize);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      setMapReady(false);
    };
  }, [userLocation.lat, userLocation.lng]);

  // 2. Render and update spot markers whenever spots or activeSpot changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    // Clear previous markers
    markersGroup.clearLayers();

    // User location pulse pin
    const userPulseHtml = `
      <div style="position: relative; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;">
        <div style="
          position: absolute;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: rgba(79, 99, 64, 0.25);
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
        <div style="
          width: 14px;
          height: 14px;
          background: #4F6340;
          border: 2.5px solid #FFFDF8;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0,0,0,0.25);
        "></div>
      </div>
    `;

    const userIcon = L.divIcon({
      className: 'matchapp-user-pin',
      html: userPulseHtml,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }
    const userMarker = L.marker([userLocation.lat, userLocation.lng], {
      icon: userIcon,
      zIndexOffset: 500,
    }).addTo(map);

    userMarker.bindTooltip(
      language === 'es' ? 'Tu ubicación aproximada' : 'Your approximate location',
      {
        offset: [0, -12],
        direction: 'top',
        className: 'matchapp-tooltip',
      }
    );
    userMarkerRef.current = userMarker;

    // Add pins for all matching spots
    displayedSpots.forEach((spot) => {
      const isSelected = activeSpot?.id === spot.id;
      const isCeremonial = spot.tags?.includes('ceremonial');

      const pinHtml = `
        <div class="custom-matcha-pin" style="
          display: inline-flex;
          align-items: center;
          gap: 3px;
          background: ${isSelected ? '#2C3A24' : isCeremonial ? '#384B2E' : '#4F6340'};
          color: #FFFDF8;
          font-family: 'DM Sans', -apple-system, sans-serif;
          font-size: 11px;
          font-weight: 700;
          padding: ${isSelected ? '5px 9px' : '4px 8px'};
          border-radius: 9999px;
          border: ${isSelected ? '2.5px solid #D9B25F' : isCeremonial ? '2px solid #D9B25F' : '2px solid #C9D3B0'};
          box-shadow: ${isSelected ? '0 6px 16px rgba(44,58,36,0.45)' : '0 3px 10px rgba(79,99,64,0.3)'};
          transform: ${isSelected ? 'scale(1.12)' : 'scale(1)'};
          transition: all 0.2s ease;
          cursor: pointer;
          white-space: nowrap;
          letter-spacing: 0.02em;
        ">
          <span style="color: #D9B25F; font-size: 10px;">★</span>
          <span>${spot.avgRating.toFixed(1)}</span>
          ${isCeremonial ? '<span style="font-size: 9px; opacity: 0.9;">🍵</span>' : ''}
        </div>
      `;

      const customIcon = L.divIcon({
        className: `spot-marker-${spot.id}`,
        html: pinHtml,
        iconSize: isSelected ? [58, 30] : [52, 28],
        iconAnchor: isSelected ? [29, 15] : [26, 14],
      });

      const marker = L.marker([spot.lat, spot.lng], {
        icon: customIcon,
        zIndexOffset: isSelected ? 1000 : 100,
      });

      marker.on('click', () => {
        setActiveSpot(spot);
        map.panTo([spot.lat, spot.lng], { animate: true, duration: 0.35 });
      });

      markersGroup.addLayer(marker);
    });
  }, [displayedSpots, activeSpot, userLocation, language, mapReady]);

  // Recenter map on user location and request live device geolocation
  const handleRecenter = async () => {
    await requestDeviceLocation();
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 14, {
        animate: true,
        duration: 0.5,
      });
    }
  };

  // Sync map center when user coordinates change
  useEffect(() => {
    if (mapInstanceRef.current && mapReady) {
      mapInstanceRef.current.panTo([userLocation.lat, userLocation.lng], {
        animate: true,
        duration: 0.4,
      });
    }
  }, [userLocation.lat, userLocation.lng, mapReady]);

  // Zoom controls
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const distanceKm = activeSpot
    ? calculateDistanceKm(
        userLocation.lat,
        userLocation.lng,
        activeSpot.lat,
        activeSpot.lng
      )
    : 0;

  const isFavorite = activeSpot ? saved.favorites.includes(activeSpot.id) : false;
  const isWantToTry = activeSpot ? saved.wantToTry.includes(activeSpot.id) : false;

  return (
    <div className="relative w-full h-[calc(100vh-120px)] min-h-[500px] overflow-hidden bg-[#E9DFCB]">
      {/* The Leaflet Map Canvas */}
      <div
        ref={mapContainerRef}
        id="matchapp-leaflet-map"
        className="w-full h-full z-0"
      />

      {/* Floating Top Header Controls & Quick Filters */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-col gap-2 pointer-events-none">
        <div className="flex items-center justify-between">
          {/* Switch to List View & Quick Madrid filter */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              type="button"
              id="map-switch-list-btn"
              onClick={onSwitchToList}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#FFFDF8]/95 backdrop-blur-xs hover:bg-[#F6F1E7] text-[#4F6340] rounded-full border border-[#E9DFCB] shadow-md text-xs font-semibold transition-all active:scale-95"
            >
              <List size={14} />
              <span>{language === 'es' ? 'Ver Lista' : 'View List'}</span>
            </button>

            {/* Quick Madrid Focus Chip */}
            <button
              type="button"
              id="map-focus-madrid-btn"
              onClick={() => {
                setUserCity('Madrid');
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.flyTo([40.4234, -3.7000], 13.5, { duration: 0.8 });
                }
              }}
              className={`px-3 py-2 rounded-full border shadow-md text-xs font-semibold transition-all active:scale-95 flex items-center gap-1 ${
                userLocation.cityName === 'Madrid'
                  ? 'bg-[#3C4D30] text-[#FFFDF8] border-[#3C4D30]'
                  : 'bg-[#FFFDF8]/95 backdrop-blur-xs text-[#4F6340] border-[#E9DFCB] hover:bg-[#F6F1E7]'
              }`}
              title="Centrar en Madrid"
            >
              <span>Madrid</span>
              <span className="text-[10px] opacity-80">
                ({spots.filter((s) => s.city.toLowerCase() === 'madrid').length})
              </span>
            </button>
          </div>

          {/* Spots Counter Pill */}
          <div className="pointer-events-auto flex items-center gap-1 px-3 py-1.5 bg-[#FFFDF8]/95 backdrop-blur-xs text-[#4F6340] rounded-full border border-[#E9DFCB] shadow-sm text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{displayedSpots.length} {language === 'es' ? 'en mapa' : 'on map'}</span>
          </div>
        </div>

        {/* Quick Filter Horizontal Scroll Bar */}
        <div className="pointer-events-auto flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'all' as MapFilterKey, label: language === 'es' ? 'Todos' : 'All', icon: null },
            { id: 'open' as MapFilterKey, label: language === 'es' ? 'Abierto ahora' : 'Open now', icon: Clock },
            { id: 'ceremonial' as MapFilterKey, label: 'Grado Ceremonial 🍵', icon: null },
            { id: 'iced' as MapFilterKey, label: 'Iced Matcha 🧊', icon: null },
            { id: 'wifi' as MapFilterKey, label: language === 'es' ? 'Para trabajar' : 'Laptop friendly', icon: Laptop },
            { id: 'desserts' as MapFilterKey, label: language === 'es' ? 'Dulces / Pastelería' : 'Pastries', icon: Cookie },
          ].map((item) => {
            const isActive = mapFilter === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                id={`map-filter-${item.id}`}
                onClick={() => setMapFilter(item.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border shadow-xs transition-all active:scale-95 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#3C4D30] text-[#FFFDF8] border-[#3C4D30]'
                    : 'bg-[#FFFDF8]/95 backdrop-blur-xs text-[#4F6340] border-[#E9DFCB] hover:bg-[#F6F1E7]'
                }`}
              >
                {Icon && <Icon size={12} />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Zoom & Recenter Controls (Right Side) */}
      <div className="absolute top-28 right-3 z-20 flex flex-col gap-2">
        {/* Recenter Button */}
        <button
          type="button"
          id="map-recenter-btn"
          onClick={handleRecenter}
          className="w-9 h-9 rounded-full bg-[#FFFDF8]/95 backdrop-blur-xs text-[#4F6340] border border-[#E9DFCB] shadow-md flex items-center justify-center hover:bg-[#F6F1E7] transition-all active:scale-95"
          title={language === 'es' ? 'Centrar en mi ubicación' : 'Center on me'}
          aria-label="Centrar"
        >
          <Crosshair size={17} />
        </button>

        {/* Zoom In */}
        <button
          type="button"
          id="map-zoom-in-btn"
          onClick={handleZoomIn}
          className="w-9 h-9 rounded-full bg-[#FFFDF8]/95 backdrop-blur-xs text-[#4F6340] border border-[#E9DFCB] shadow-md flex items-center justify-center hover:bg-[#F6F1E7] transition-all active:scale-95"
          title="Zoom +"
          aria-label="Acercar"
        >
          <Plus size={16} />
        </button>

        {/* Zoom Out */}
        <button
          type="button"
          id="map-zoom-out-btn"
          onClick={handleZoomOut}
          className="w-9 h-9 rounded-full bg-[#FFFDF8]/95 backdrop-blur-xs text-[#4F6340] border border-[#E9DFCB] shadow-md flex items-center justify-center hover:bg-[#F6F1E7] transition-all active:scale-95"
          title="Zoom -"
          aria-label="Alejar"
        >
          <Minus size={16} />
        </button>
      </div>

      {/* Bottom Sheet Preview Card when a spot is clicked */}
      {activeSpot && (() => {
        const userRating = getUserRatingForSpot(activeSpot.id);
        const currentIndex = displayedSpots.findIndex((s) => s.id === activeSpot.id);

        const handlePrev = (e: React.MouseEvent) => {
          e.stopPropagation();
          if (displayedSpots.length <= 1) return;
          const prevIdx = (currentIndex - 1 + displayedSpots.length) % displayedSpots.length;
          const next = displayedSpots[prevIdx];
          setActiveSpot(next);
          mapInstanceRef.current?.panTo([next.lat, next.lng], { animate: true, duration: 0.35 });
        };

        const handleNext = (e: React.MouseEvent) => {
          e.stopPropagation();
          if (displayedSpots.length <= 1) return;
          const nextIdx = (currentIndex + 1) % displayedSpots.length;
          const next = displayedSpots[nextIdx];
          setActiveSpot(next);
          mapInstanceRef.current?.panTo([next.lat, next.lng], { animate: true, duration: 0.35 });
        };

        const openDirections = (e: React.MouseEvent) => {
          e.stopPropagation();
          window.open(
            `https://www.google.com/maps/dir/?api=1&destination=${activeSpot.lat},${activeSpot.lng}`,
            '_blank'
          );
        };

        const copyAddress = (e: React.MouseEvent) => {
          e.stopPropagation();
          if (navigator.clipboard) {
            navigator.clipboard.writeText(`${activeSpot.name}, ${activeSpot.address}, ${activeSpot.city}`);
            setCopiedAddress(true);
            setTimeout(() => setCopiedAddress(false), 2000);
          }
        };

        return (
          <div className="absolute bottom-4 left-3 right-3 z-30 max-w-md mx-auto animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="bg-[#FFFDF8] rounded-3xl p-3.5 border border-[#C9D3B0] shadow-xl relative flex flex-col gap-2.5">
              {/* Carousel Header & Close button */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-[#4F6340]/70 font-semibold">
                  {displayedSpots.length > 1 && (
                    <div className="flex items-center gap-1 bg-[#F6F1E7] px-2 py-0.5 rounded-full border border-[#E9DFCB]">
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="hover:text-[#3C4D30] p-0.5"
                        title="Anterior"
                      >
                        <ChevronLeft size={13} />
                      </button>
                      <span>
                        {currentIndex + 1} / {displayedSpots.length}
                      </span>
                      <button
                        type="button"
                        onClick={handleNext}
                        className="hover:text-[#3C4D30] p-0.5"
                        title="Siguiente"
                      >
                        <ChevronRight size={13} />
                      </button>
                    </div>
                  )}
                  {activeSpot.featuredMatchaOrigin && (
                    <span className="text-[10px] bg-[#E5EBD8] text-[#3B4D31] px-2 py-0.5 rounded-full font-bold">
                      {activeSpot.featuredMatchaOrigin}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  id="close-map-preview-btn"
                  onClick={() => setActiveSpot(null)}
                  className="w-7 h-7 rounded-full bg-[#F6F1E7] text-[#4F6340] flex items-center justify-center hover:bg-[#E9DFCB] transition-colors"
                  aria-label="Cerrar"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Spot Body Details */}
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => openSpotDetail(activeSpot.id)}
              >
                {/* Thumbnail */}
                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-[#E9DFCB] relative">
                  <img
                    src={activeSpot.photos[0]}
                    alt={activeSpot.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 left-1 bg-black/60 text-[#FFFDF8] text-[9px] font-bold px-1.5 py-0.2 rounded-md">
                    {activeSpot.priceLevel}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        activeSpot.isOpenNow ? 'bg-emerald-500' : 'bg-stone-400'
                      }`}
                    />
                    <span className="text-[11px] font-medium text-[#4F6340]/70">
                      {activeSpot.isOpenNow ? t.openBadge : t.closedBadge} ·{' '}
                      {formatDistance(distanceKm)}
                    </span>
                  </div>

                  <h3 className="font-serif text-base font-bold text-[#4F6340] truncate mt-0.5">
                    {activeSpot.name}
                  </h3>

                  <p className="text-xs text-[#4F6340]/80 truncate">
                    {activeSpot.neighborhood} · {activeSpot.city}
                  </p>

                  <div className="flex items-center gap-1.5 mt-1">
                    <RatingStars rating={activeSpot.avgRating} max={1} size={14} />
                    <span className="text-xs font-bold text-[#4F6340]">
                      {activeSpot.avgRating.toFixed(1)}
                    </span>
                    <span className="text-[11px] text-[#4F6340]/60">
                      ({activeSpot.reviewCount} {t.reviews})
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct Quick Actions: Directions, Copy Address, Favorites */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  id="map-directions-btn"
                  onClick={openDirections}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-[#4F6340] hover:bg-[#3C4D30] text-[#FFFDF8] rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95"
                >
                  <Compass size={14} />
                  <span>{language === 'es' ? 'Cómo llegar' : 'Directions'}</span>
                </button>

                <button
                  type="button"
                  id="map-copy-address-btn"
                  onClick={copyAddress}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-[#F6F1E7] hover:bg-[#E9DFCB] text-[#4F6340] rounded-xl text-xs font-semibold border border-[#E9DFCB] transition-all active:scale-95"
                >
                  {copiedAddress ? (
                    <>
                      <Check size={13} className="text-emerald-700" />
                      <span className="text-emerald-800">{language === 'es' ? '¡Copiado!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>{language === 'es' ? 'Copiar dirección' : 'Copy address'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Direct Star Rating Bar for users */}
              <div className="bg-[#FAF8F5] rounded-2xl p-2.5 border border-[#E9DFCB] flex items-center justify-between gap-2">
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-[#3B4D31]">
                    {userRating
                      ? (language === 'es' ? `Tu calificación: ${userRating} ★` : `Your rating: ${userRating} ★`)
                      : (language === 'es' ? '¿Qué nota le das a su matcha?' : 'Rate their matcha:')}
                  </span>
                  <span className="text-[9px] text-[#7B8A6F]">
                    {ratingFeedback || (language === 'es' ? 'Pulsa una estrella para valorar' : 'Tap a star to rate')}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      id={`map-rate-star-${activeSpot.id}-${star}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        rateSpot(activeSpot.id, star);
                        setRatingFeedback(
                          language === 'es'
                            ? `¡Guardado: ${star} estrellas!`
                            : `Saved: ${star} stars!`
                        );
                        setTimeout(() => setRatingFeedback(null), 2500);
                      }}
                      className="p-1 hover:scale-125 transition-transform"
                      title={`${star} estrellas`}
                    >
                      <Star
                        size={18}
                        className={
                          userRating && star <= userRating
                            ? 'text-[#D9B25F] fill-[#D9B25F]'
                            : 'text-[#D5DCBF] hover:text-[#D9B25F]'
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Footer: Detail view & Save buttons */}
              <div className="flex items-center gap-2 pt-1 border-t border-[#E9DFCB]">
                <button
                  type="button"
                  id="map-preview-detail-btn"
                  onClick={() => openSpotDetail(activeSpot.id)}
                  className="flex-1 py-2 px-3 bg-[#E9DFCB]/70 hover:bg-[#E9DFCB] text-[#4F6340] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>{language === 'es' ? 'Ver carta completa y reseñas' : 'Full menu & reviews'}</span>
                  <ChevronRight size={14} />
                </button>

                <button
                  type="button"
                  id={`map-fav-btn-${activeSpot.id}`}
                  onClick={() => toggleFavorite(activeSpot.id)}
                  className={`p-2 rounded-xl border transition-colors ${
                    isFavorite
                      ? 'bg-[#E8C9C0] text-rose-700 border-rose-300'
                      : 'bg-[#F6F1E7] text-[#4F6340] border-[#E9DFCB]'
                  }`}
                  title={t.addToFavorites}
                >
                  <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>

                <button
                  type="button"
                  id={`map-try-btn-${activeSpot.id}`}
                  onClick={() => toggleWantToTry(activeSpot.id)}
                  className={`p-2 rounded-xl border transition-colors ${
                    isWantToTry
                      ? 'bg-[#A8B98A] text-[#FFFDF8] border-[#A8B98A]'
                      : 'bg-[#F6F1E7] text-[#4F6340] border-[#E9DFCB]'
                  }`}
                  title={t.wantToTry}
                >
                  <Bookmark size={16} fill={isWantToTry ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
