import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TAG_DEFINITIONS } from '../../design-system/theme';
import { calculateDistanceKm, formatDistance, SPANISH_CITIES_COORDS } from '../../utils/geo';
import { RatingStars } from '../common/RatingStars';
import { Search, X, MapPin, Sparkles, ChevronRight, History } from 'lucide-react';

interface SearchScreenProps {
  onClose: () => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({ onClose }) => {
  const {
    spots,
    userLocation,
    openSpotDetail,
    setUserCity,
    language,
    t,
  } = useApp();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Popular neighborhoods & tags for quick autocomplete
  const popularNeighborhoods = [
    'Villaverde',
    'Malasaña',
    'Chamberí',
    'Ruzafa',
    'Gràcia',
    'Justicia',
    'Eixample',
    'Soho',
  ];

  const popularTags = [
    'ceremonial',
    'iced_matcha',
    'vegan_milks',
    'aesthetic',
    'desserts',
    'pet_friendly',
  ];

  // Filtered results
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    return spots.filter((spot) => {
      const matchName = spot.name.toLowerCase().includes(q);
      const matchCity = spot.city.toLowerCase().includes(q);
      const matchNeighborhood = spot.neighborhood.toLowerCase().includes(q);
      const matchDescription = spot.description.toLowerCase().includes(q);
      const matchTags = spot.tags.some((tag) => {
        const def = TAG_DEFINITIONS[tag];
        return (
          tag.toLowerCase().includes(q) ||
          (def && def.labelEs.toLowerCase().includes(q)) ||
          (def && def.labelEn.toLowerCase().includes(q))
        );
      });

      return matchName || matchCity || matchNeighborhood || matchDescription || matchTags;
    });
  }, [spots, query]);

  const handleSelectSpot = (spotId: string) => {
    openSpotDetail(spotId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F6F1E7] flex flex-col max-w-md mx-auto animate-in fade-in duration-150">
      {/* Search Header */}
      <div className="p-4 bg-[#FFFDF8] border-b border-[#E9DFCB] flex items-center gap-3">
        <div className="flex-1 relative flex items-center">
          <Search size={16} className="absolute left-3.5 text-[#A8B98A]" />
          <input
            ref={inputRef}
            id="search-main-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-9 pr-9 py-2.5 bg-[#F6F1E7] border border-[#E9DFCB] rounded-2xl text-xs text-[#4F6340] placeholder:text-[#4F6340]/40 outline-none focus:border-[#4F6340] transition-colors"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 text-[#4F6340]/60 hover:text-[#4F6340]"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <button
          type="button"
          id="search-cancel-btn"
          onClick={onClose}
          className="text-xs font-semibold text-[#4F6340] hover:opacity-80 transition-opacity"
        >
          {language === 'es' ? 'Cerrar' : 'Cancel'}
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {!query.trim() ? (
          <div className="space-y-5">
            {/* Quick Cities Autocomplete */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#4F6340]/70 block mb-2">
                {language === 'es' ? 'Ciudades Populares' : 'Popular Cities'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {Object.keys(SPANISH_CITIES_COORDS).map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => {
                      setUserCity(city);
                      setQuery(city);
                    }}
                    className="text-xs px-3 py-1.5 rounded-full bg-[#FFFDF8] border border-[#E9DFCB] text-[#4F6340] hover:border-[#4F6340] font-medium flex items-center gap-1 shadow-2xs"
                  >
                    <MapPin size={12} className="text-[#A8B98A]" />
                    <span>{city}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Neighborhoods */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#4F6340]/70 block mb-2">
                {language === 'es' ? 'Barrios Emblemáticos' : 'Iconic Neighborhoods'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {popularNeighborhoods.map((hood) => (
                  <button
                    key={hood}
                    type="button"
                    onClick={() => setQuery(hood)}
                    className="text-xs px-3 py-1.5 rounded-full bg-[#FFFDF8] border border-[#E9DFCB] text-[#4F6340] hover:border-[#4F6340] font-medium shadow-2xs"
                  >
                    {hood}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Tags */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#4F6340]/70 block mb-2">
                {language === 'es' ? 'Búsquedas por Etiqueta' : 'Search by Tag'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {popularTags.map((tagKey) => {
                  const def = TAG_DEFINITIONS[tagKey];
                  return (
                    <button
                      key={tagKey}
                      type="button"
                      onClick={() => setQuery(def.labelEs)}
                      className="text-xs px-3 py-1.5 rounded-full bg-[#FFFDF8] border border-[#E9DFCB] text-[#4F6340] hover:border-[#4F6340] font-medium flex items-center gap-1 shadow-2xs"
                    >
                      <span>{def.emoji}</span>
                      <span>{language === 'es' ? def.labelEs : def.labelEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#4F6340]/70 block mb-3">
              {results.length}{' '}
              {results.length === 1
                ? language === 'es'
                  ? 'resultado'
                  : 'result'
                : language === 'es'
                ? 'resultados'
                : 'results'}
            </span>

            {results.length > 0 ? (
              <div className="space-y-2.5">
                {results.map((spot) => {
                  const dist = calculateDistanceKm(
                    userLocation.lat,
                    userLocation.lng,
                    spot.lat,
                    spot.lng
                  );

                  return (
                    <div
                      key={spot.id}
                      onClick={() => handleSelectSpot(spot.id)}
                      className="p-3 bg-[#FFFDF8] rounded-2xl border border-[#E9DFCB] hover:border-[#A8B98A] transition-colors cursor-pointer flex items-center gap-3 shadow-2xs"
                    >
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#E9DFCB] shrink-0">
                        <img
                          src={spot.photos[0]}
                          alt={spot.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-serif text-sm font-bold text-[#4F6340] truncate">
                            {spot.name}
                          </h4>
                          <span className="text-[10px] font-semibold text-[#4F6340]/60 shrink-0">
                            {formatDistance(dist)}
                          </span>
                        </div>

                        <p className="text-xs text-[#4F6340]/70 truncate">
                          {spot.neighborhood} · {spot.city}
                        </p>

                        <div className="flex items-center gap-1.5 mt-0.5">
                          <RatingStars rating={spot.avgRating} max={1} size={12} />
                          <span className="text-xs font-bold text-[#4F6340]">
                            {spot.avgRating.toFixed(1)}
                          </span>
                          <span className="text-[10px] text-[#4F6340]/60">
                            ({spot.reviewCount})
                          </span>
                          <span className="text-[10px] text-[#4F6340]/70 ml-1">
                            {spot.priceLevel}
                          </span>
                        </div>
                      </div>

                      <ChevronRight size={16} className="text-[#4F6340]/40 shrink-0" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center space-y-2">
                <p className="text-sm font-semibold text-[#4F6340]">
                  {language === 'es'
                    ? `No hemos encontrado coincidencias para "${query}"`
                    : `No results matching "${query}"`}
                </p>
                <p className="text-xs text-[#4F6340]/60">
                  {language === 'es'
                    ? 'Prueba a buscar por ciudad (Madrid, Barcelona) o por tipo (ceremonial, iced matcha).'
                    : 'Try searching by city (Madrid, Barcelona) or specialty (ceremonial, iced).'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
