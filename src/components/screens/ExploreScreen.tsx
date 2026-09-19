import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { SpotCard } from '../common/SpotCard';
import { MatchaTag } from '../../types';
import { TAG_DEFINITIONS, ChasenIcon } from '../../design-system/theme';
import { calculateDistanceKm } from '../../utils/geo';
import {
  SlidersHorizontal,
  Map as MapIcon,
  List,
  Sparkles,
  ChevronDown,
  ChevronRight,
  X,
  Plus,
  Compass,
  LayoutGrid,
  LayoutList,
  RotateCcw,
} from 'lucide-react';

interface ExploreScreenProps {
  onOpenSearch: () => void;
  onSwitchToMap: () => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  onOpenSearch,
  onSwitchToMap,
}) => {
  const {
    spots,
    userLocation,
    filters,
    setFilters,
    resetFilters,
    language,
    t,
    openAddSpotModal,
    openRitualStory,
  } = useApp();

  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');

  // Available tag filters
  const tagList: MatchaTag[] = [
    'ceremonial',
    'matcha_latte',
    'iced_matcha',
    'vegan_milks',
    'desserts',
    'takeaway',
    'aesthetic',
    'pet_friendly',
    'terrace',
    'wifi_work',
  ];

  // Filtering and sorting logic
  const filteredSpots = useMemo(() => {
    return spots.filter((spot) => {
      // City filter (if specific city is selected or user city)
      if (filters.selectedCity !== 'all' && spot.city.toLowerCase() !== filters.selectedCity.toLowerCase()) {
        return false;
      }

      // Distance filter: only apply strict radius if 'all' cities selected and radius < 50
      if (filters.selectedCity === 'all' && filters.radiusKm < 50) {
        const dist = calculateDistanceKm(
          userLocation.lat,
          userLocation.lng,
          spot.lat,
          spot.lng
        );
        if (dist > filters.radiusKm) {
          return false;
        }
      }

      // Rating filter
      if (filters.minRating > 0 && spot.avgRating < filters.minRating) {
        return false;
      }

      // Open now filter
      if (filters.openNowOnly && !spot.isOpenNow) {
        return false;
      }

      // Tags filter
      if (filters.selectedTags.length > 0) {
        const hasAllTags = filters.selectedTags.every((t) => spot.tags.includes(t));
        if (!hasAllTags) return false;
      }

      // Search query (if set from search)
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = spot.name.toLowerCase().includes(query);
        const matchesDesc = spot.description.toLowerCase().includes(query);
        const matchesNeighborhood = spot.neighborhood.toLowerCase().includes(query);
        const matchesTag = spot.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesNeighborhood && !matchesTag) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'nearest') {
        const distA = calculateDistanceKm(
          userLocation.lat,
          userLocation.lng,
          a.lat,
          a.lng
        );
        const distB = calculateDistanceKm(
          userLocation.lat,
          userLocation.lng,
          b.lat,
          b.lng
        );
        return distA - distB;
      }
      if (filters.sortBy === 'top_rated') {
        return b.avgRating - a.avgRating;
      }
      if (filters.sortBy === 'most_reviewed') {
        return b.reviewCount - a.reviewCount;
      }
      return 0;
    });
  }, [spots, userLocation, filters]);

  const toggleTag = (tag: MatchaTag) => {
    const exists = filters.selectedTags.includes(tag);
    const newTags = exists
      ? filters.selectedTags.filter((t) => t !== tag)
      : [...filters.selectedTags, tag];
    setFilters({ selectedTags: newTags });
  };

  const activeFiltersCount =
    (filters.selectedCity !== 'all' ? 1 : 0) +
    (filters.radiusKm !== 50 ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.openNowOnly ? 1 : 0) +
    filters.selectedTags.length;

  return (
    <div className="pb-24 pt-2">
      {/* Top Banner / Location Status */}
      <div className="px-4 mb-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-xl font-bold text-[#4F6340]">
              {language === 'es' ? 'Matcha en' : 'Matcha in'}{' '}
              <span className="underline decoration-[#A8B98A] decoration-wavy underline-offset-4">
                {filters.selectedCity === 'all'
                  ? userLocation.cityName
                  : filters.selectedCity}
              </span>
            </h1>
            <p className="text-xs text-[#4F6340]/70 mt-0.5">
              {filteredSpots.length} {t.spotsFound}
            </p>
          </div>

          {/* Filter & View Mode Controls */}
          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-[#F6F1E7] p-1 rounded-full border border-[#E9DFCB]">
              <button
                type="button"
                id="view-mode-grid-btn"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-full transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-[#FFFDF8] text-[#4F6340] shadow-xs'
                    : 'text-[#4F6340]/60 hover:text-[#4F6340]'
                }`}
                title={language === 'es' ? 'Vista de tarjetas' : 'Grid view'}
              >
                <LayoutGrid size={13} />
              </button>
              <button
                type="button"
                id="view-mode-compact-btn"
                onClick={() => setViewMode('compact')}
                className={`p-1.5 rounded-full transition-colors ${
                  viewMode === 'compact'
                    ? 'bg-[#FFFDF8] text-[#4F6340] shadow-xs'
                    : 'text-[#4F6340]/60 hover:text-[#4F6340]'
                }`}
                title={language === 'es' ? 'Vista compacta' : 'Compact list'}
              >
                <LayoutList size={13} />
              </button>
            </div>

            <button
              id="filter-toggle-btn"
              type="button"
              onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                activeFiltersCount > 0
                  ? 'bg-[#4F6340] text-[#FFFDF8] border-[#4F6340]'
                  : 'bg-[#FFFDF8] text-[#4F6340] border-[#E9DFCB] hover:bg-[#E9DFCB]/50'
              }`}
            >
              <SlidersHorizontal size={13} />
              <span>{language === 'es' ? 'Filtros' : 'Filters'}</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#A8B98A] text-[#FFFDF8] text-[10px] flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Active Filters Reset Bar if any filter is active */}
        {activeFiltersCount > 0 && (
          <div className="mt-2.5 flex items-center justify-between gap-2 px-3 py-1.5 bg-[#F6F1E7] border border-[#E9DFCB] rounded-2xl">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs text-[#4F6340] font-medium">
              <span className="text-[11px] text-[#4F6340]/70 shrink-0">
                {language === 'es' ? 'Filtros activos:' : 'Active filters:'}
              </span>
              {filters.selectedCity !== 'all' && (
                <span className="bg-[#FFFDF8] px-2 py-0.5 rounded-full border border-[#E9DFCB] shrink-0 text-[11px]">
                  📍 {filters.selectedCity}
                </span>
              )}
              {filters.openNowOnly && (
                <span className="bg-[#FFFDF8] px-2 py-0.5 rounded-full border border-[#E9DFCB] shrink-0 text-[11px]">
                  ● {t.openNow}
                </span>
              )}
              {filters.minRating > 0 && (
                <span className="bg-[#FFFDF8] px-2 py-0.5 rounded-full border border-[#E9DFCB] shrink-0 text-[11px]">
                  ★ ≥{filters.minRating}
                </span>
              )}
              {filters.selectedTags.map((tKey) => (
                <span key={tKey} className="bg-[#FFFDF8] px-2 py-0.5 rounded-full border border-[#E9DFCB] shrink-0 text-[11px]">
                  {TAG_DEFINITIONS[tKey]?.emoji} {TAG_DEFINITIONS[tKey]?.labelEs}
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={resetFilters}
              className="text-[11px] font-bold text-rose-700 hover:text-rose-900 shrink-0 flex items-center gap-1 hover:underline"
            >
              <RotateCcw size={11} />
              <span>{language === 'es' ? 'Limpiar' : 'Reset'}</span>
            </button>
          </div>
        )}

        {/* Sort Segmented Control */}
        <div className="mt-3 flex items-center gap-1 bg-[#E9DFCB]/70 p-1 rounded-2xl border border-[#E9DFCB]">
          <button
            type="button"
            id="sort-nearest-btn"
            onClick={() => setFilters({ sortBy: 'nearest' })}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              filters.sortBy === 'nearest'
                ? 'bg-[#FFFDF8] text-[#4F6340] shadow-xs'
                : 'text-[#4F6340]/70 hover:text-[#4F6340]'
            }`}
          >
            {t.sortNearest}
          </button>
          <button
            type="button"
            id="sort-top-rated-btn"
            onClick={() => setFilters({ sortBy: 'top_rated' })}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              filters.sortBy === 'top_rated'
                ? 'bg-[#FFFDF8] text-[#4F6340] shadow-xs'
                : 'text-[#4F6340]/70 hover:text-[#4F6340]'
            }`}
          >
            {t.sortTopRated}
          </button>
          <button
            type="button"
            id="sort-most-reviewed-btn"
            onClick={() => setFilters({ sortBy: 'most_reviewed' })}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              filters.sortBy === 'most_reviewed'
                ? 'bg-[#FFFDF8] text-[#4F6340] shadow-xs'
                : 'text-[#4F6340]/70 hover:text-[#4F6340]'
            }`}
          >
            {t.sortMostReviewed}
          </button>
        </div>

        {/* Quick Horizontal Tag Carousel */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 no-scrollbar -mx-4 px-4">
          {/* Open now chip */}
          <button
            type="button"
            id="quick-open-now-filter"
            onClick={() => setFilters({ openNowOnly: !filters.openNowOnly })}
            className={`shrink-0 text-xs px-3 py-1 rounded-full font-medium transition-colors border ${
              filters.openNowOnly
                ? 'bg-[#A8B98A] text-[#FFFDF8] border-[#A8B98A]'
                : 'bg-[#FFFDF8] text-[#4F6340] border-[#E9DFCB] hover:bg-[#E9DFCB]/50'
            }`}
          >
            ● {t.openNow}
          </button>

          {/* Top tags chips */}
          {tagList.map((tag) => {
            const def = TAG_DEFINITIONS[tag];
            const isSelected = filters.selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                id={`quick-tag-${tag}`}
                onClick={() => toggleTag(tag)}
                className={`shrink-0 text-xs px-3 py-1 rounded-full font-medium transition-colors border flex items-center gap-1 ${
                  isSelected
                    ? 'bg-[#4F6340] text-[#FFFDF8] border-[#4F6340]'
                    : 'bg-[#FFFDF8] text-[#4F6340] border-[#E9DFCB] hover:bg-[#E9DFCB]/50'
                }`}
              >
                <span>{def.emoji}</span>
                <span>{language === 'es' ? def.labelEs : def.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Expandable Filter Panel */}
      {isFilterPanelOpen && (
        <div className="mx-4 mb-4 p-4 bg-[#FFFDF8] border border-[#E9DFCB] rounded-3xl shadow-sm space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-[#E9DFCB]">
            <span className="text-xs font-bold text-[#4F6340] uppercase tracking-wider">
              {language === 'es' ? 'Ajustar Búsqueda' : 'Fine-tune Discovery'}
            </span>
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs text-[#A8B98A] hover:text-[#4F6340] font-semibold"
            >
              {t.clearFilters}
            </button>
          </div>

          {/* Distance Radius */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#4F6340] mb-2">
              <span>{t.radiusFilter}</span>
              <span className="text-[#A8B98A]">
                {filters.radiusKm === 50
                  ? language === 'es'
                    ? 'Sin límite'
                    : 'Any distance'
                  : `≤ ${filters.radiusKm} km`}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {[3, 5, 10, 25, 50].map((radius) => (
                <button
                  key={radius}
                  type="button"
                  onClick={() => setFilters({ radiusKm: radius })}
                  className={`py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
                    filters.radiusKm === radius
                      ? 'bg-[#4F6340] text-[#FFFDF8] border-[#4F6340]'
                      : 'bg-[#F6F1E7] text-[#4F6340] border-[#E9DFCB]'
                  }`}
                >
                  {radius === 50 ? '50km+' : `${radius}km`}
                </button>
              ))}
            </div>
          </div>

          {/* Minimum Rating */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#4F6340] mb-2">
              <span>{language === 'es' ? 'Valoración mínima' : 'Minimum rating'}</span>
              <span className="text-[#D9B25F]">
                {filters.minRating === 0 ? 'Todas' : `★ ${filters.minRating}+`}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[0, 4.0, 4.5, 4.8].map((ratingVal) => (
                <button
                  key={ratingVal}
                  type="button"
                  onClick={() => setFilters({ minRating: ratingVal })}
                  className={`py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
                    filters.minRating === ratingVal
                      ? 'bg-[#4F6340] text-[#FFFDF8] border-[#4F6340]'
                      : 'bg-[#F6F1E7] text-[#4F6340] border-[#E9DFCB]'
                  }`}
                >
                  {ratingVal === 0 ? 'Todas' : `★ ${ratingVal}`}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsFilterPanelOpen(false)}
            className="w-full py-2.5 bg-[#A8B98A] hover:bg-[#97A978] text-[#FFFDF8] rounded-2xl text-xs font-bold transition-colors"
          >
            {language === 'es' ? 'Ver resultados' : 'Show results'} ({filteredSpots.length})
          </button>
        </div>
      )}

      {/* MatchApp Ritual Storytelling Banner */}
      <div className="px-4 mb-3">
        <div
          id="ritual-story-banner"
          onClick={openRitualStory}
          className="cursor-pointer group relative rounded-3xl p-3.5 bg-gradient-to-r from-[#FAF8F5] to-[#F1EAE0] border border-[#DDD3C3] shadow-[0_3px_12px_rgba(62,78,53,0.06)] hover:shadow-[0_6px_18px_rgba(62,78,53,0.1)] transition-all flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EFE9DF] border border-[#D9CEBF] flex items-center justify-center text-[#3B4D31] shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
              <ChasenIcon size={18} />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] uppercase font-bold tracking-widest text-[#7B8A6F]">
                  MatchApp · El Ritual
                </span>
                <span className="px-1.5 py-0.2 rounded-full bg-[#E8DFD1] text-[8px] font-semibold text-[#4F6340]">
                  Storytelling
                </span>
              </div>
              <h3 className="font-serif text-xs font-bold text-[#2C3826] leading-tight">
                {language === 'es'
                  ? 'El arte de la calma y el origen ceremonial en Kioto'
                  : 'The art of slow & ceremonial Uji origin'}
              </h3>
              <p className="text-[10px] text-[#5D6B53]">
                {language === 'es'
                  ? 'Conoce el manifiesto antes de explorar el mapa →'
                  : 'Discover the manifesto before exploring the map →'}
              </p>
            </div>
          </div>
          <div className="w-7 h-7 rounded-full bg-[#FFFDF8] border border-[#E5DDD0] flex items-center justify-center text-[#4F6340] shrink-0 group-hover:bg-[#4F6340] group-hover:text-[#FFFDF8] transition-colors shadow-2xs">
            <ChevronRight size={13} />
          </div>
        </div>
      </div>

      {/* Spot Cards Feed */}
      <div className={`px-4 ${viewMode === 'compact' ? 'space-y-2.5' : 'space-y-4'}`}>
        {filteredSpots.length > 0 ? (
          filteredSpots.map((spot) => (
            <SpotCard key={spot.id} spot={spot} compact={viewMode === 'compact'} />
          ))
        ) : (
          <div className="py-12 px-6 text-center bg-[#FFFDF8] border border-[#E9DFCB] rounded-3xl space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#E9DFCB] text-[#4F6340] flex items-center justify-center mx-auto">
              <Compass size={24} />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#4F6340]">
              {t.emptyTitle}
            </h3>
            <p className="text-xs text-[#4F6340]/70 max-w-xs mx-auto">
              {t.emptySubtitle}
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                type="button"
                onClick={resetFilters}
                className="px-4 py-2 bg-[#F6F1E7] text-[#4F6340] text-xs font-semibold rounded-xl border border-[#E9DFCB]"
              >
                {t.clearFilters}
              </button>
              <button
                type="button"
                onClick={openAddSpotModal}
                className="px-4 py-2 bg-[#4F6340] text-[#FFFDF8] text-xs font-semibold rounded-xl shadow-xs"
              >
                {t.suggestSpotBtn}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Toggle: Switch between List and Map View */}
      <div className="fixed bottom-20 left-0 right-0 flex justify-center pointer-events-none z-20">
        <button
          id="floating-map-toggle-btn"
          type="button"
          onClick={onSwitchToMap}
          className="pointer-events-auto flex items-center gap-2 px-5 py-2.5 bg-[#4F6340] text-[#FFFDF8] hover:bg-[#3C4D30] rounded-full shadow-lg text-xs font-bold tracking-wide transition-all duration-200 active:scale-95 border border-[#A8B98A]/40"
        >
          <MapIcon size={16} />
          <span>{language === 'es' ? 'Ver en Mapa' : 'View on Map'}</span>
          <span className="bg-[#A8B98A] text-[#4F6340] font-extrabold text-[10px] px-1.5 py-0.5 rounded-full">
            {filteredSpots.length}
          </span>
        </button>
      </div>
    </div>
  );
};
