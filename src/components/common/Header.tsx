import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ChasenIcon } from '../../design-system/theme';
import { MapPin, Search, Globe, ChevronDown, Crosshair, Plus, Sparkles } from 'lucide-react';
import { SPANISH_CITIES_COORDS } from '../../utils/geo';

interface HeaderProps {
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch }) => {
  const {
    userLocation,
    setUserCity,
    requestDeviceLocation,
    language,
    setLanguage,
    t,
    openAddSpotModal,
  } = useApp();

  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsCityDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUseCurrentLocation = async () => {
    setIsDetectingLocation(true);
    await requestDeviceLocation();
    setIsDetectingLocation(false);
    setIsCityDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#F6F1E7]/95 backdrop-blur-md border-b border-[#E9DFCB] px-4 py-2.5 transition-all">
      <div className="max-w-md mx-auto flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#A8B98A]/30 flex items-center justify-center text-[#4F6340] border border-[#C9D3B0]">
            <ChasenIcon size={18} />
          </div>
          <div>
            <span className="font-serif text-2xl font-bold tracking-tight text-[#4F6340] lowercase">
              matchapp
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#A8B98A] ml-0.5 mb-1" />
          </div>
        </div>

        {/* Right action group: City Selector, Search, Language, Add Spot */}
        <div className="flex items-center gap-1.5">
          {/* City selector dropdown button */}
          <div className="relative" ref={dropdownRef}>
            <button
              id="city-picker-btn"
              type="button"
              onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
              className="flex items-center gap-1 text-xs font-medium bg-[#FFFDF8] hover:bg-[#E9DFCB]/60 text-[#4F6340] border border-[#E9DFCB] rounded-full px-2.5 py-1.5 transition-colors shadow-xs"
            >
              <MapPin size={13} className="text-[#A8B98A]" />
              <span className="max-w-[70px] truncate">{userLocation.cityName}</span>
              <ChevronDown size={12} className="text-[#4F6340]/70" />
            </button>

            {isCityDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-[#FFFDF8] border border-[#E9DFCB] rounded-2xl shadow-lg p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-2 py-1.5 text-[11px] font-semibold text-[#4F6340]/60 uppercase tracking-wider">
                  {t.selectCity}
                </div>

                <button
                  type="button"
                  id="gps-location-detect-btn"
                  onClick={handleUseCurrentLocation}
                  disabled={isDetectingLocation}
                  className="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-[#4F6340] hover:bg-[#F6F1E7] rounded-xl font-medium text-left transition-colors border-b border-[#E9DFCB]/50 mb-1"
                >
                  <Crosshair
                    size={14}
                    className={`text-[#A8B98A] ${isDetectingLocation ? 'animate-spin' : ''}`}
                  />
                  <span>
                    {isDetectingLocation ? t.locationSearching : t.allowLocation}
                  </span>
                </button>

                <div className="space-y-0.5">
                  {Object.keys(SPANISH_CITIES_COORDS).map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => {
                        setUserCity(city);
                        setIsCityDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-xl text-left transition-colors ${
                        userLocation.cityName === city
                          ? 'bg-[#A8B98A]/25 text-[#4F6340] font-semibold'
                          : 'text-[#4F6340] hover:bg-[#F6F1E7]'
                      }`}
                    >
                      <span>{city}</span>
                      {userLocation.cityName === city && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4F6340]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Search Button */}
          <button
            id="header-search-btn"
            type="button"
            onClick={onOpenSearch}
            className="w-8 h-8 rounded-full bg-[#FFFDF8] hover:bg-[#E9DFCB]/60 text-[#4F6340] border border-[#E9DFCB] flex items-center justify-center transition-colors shadow-xs"
            aria-label="Buscar"
          >
            <Search size={15} />
          </button>

          {/* Add Spot Shortcut */}
          <button
            id="header-add-spot-btn"
            type="button"
            onClick={openAddSpotModal}
            className="w-8 h-8 rounded-full bg-[#A8B98A] hover:bg-[#97A978] text-[#FFFDF8] flex items-center justify-center transition-colors shadow-xs"
            title={t.suggestSpotBtn}
            aria-label="Añadir spot"
          >
            <Plus size={16} strokeWidth={2.5} />
          </button>

          {/* Language Switcher */}
          <button
            id="lang-toggle-btn"
            type="button"
            onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
            className="text-[11px] font-semibold uppercase px-2 py-1 rounded-full bg-[#E9DFCB]/70 hover:bg-[#E9DFCB] text-[#4F6340] transition-colors"
            title="Cambiar idioma"
          >
            {language === 'es' ? 'EN' : 'ES'}
          </button>
        </div>
      </div>
    </header>
  );
};
