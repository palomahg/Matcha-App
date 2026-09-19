import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChasenIcon } from '../../design-system/theme';
import { Sparkles, MapPin, Heart, ChevronRight, Check, Crosshair } from 'lucide-react';
import { SPANISH_CITIES_COORDS } from '../../utils/geo';

export const OnboardingScreen: React.FC = () => {
  const {
    t,
    completeOnboarding,
    requestDeviceLocation,
    setUserCity,
    userLocation,
    language,
    setLanguage,
  } = useApp();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLocating, setIsLocating] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState<boolean | null>(null);

  const slides = [
    {
      badge: 'El ritual del matcha',
      title: t.onboarding1Title,
      description: t.onboarding1Desc,
      image:
        'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80',
      icon: Sparkles,
    },
    {
      badge: 'Descubre en tu mapa',
      title: t.onboarding2Title,
      description: t.onboarding2Desc,
      image:
        'https://images.unsplash.com/photo-1515823662273-ad92a691c4d0?auto=format&fit=crop&w=800&q=80',
      icon: MapPin,
    },
    {
      badge: 'Comunidad auténtica',
      title: t.onboarding3Title,
      description: t.onboarding3Desc,
      image:
        'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
      icon: Heart,
    },
  ];

  const handleAllowLocation = async () => {
    setIsLocating(true);
    const success = await requestDeviceLocation();
    setIsLocating(false);
    setLocationSuccess(success);
    if (success) {
      setTimeout(() => {
        completeOnboarding();
      }, 600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F6F1E7] flex flex-col justify-between p-6 max-w-md mx-auto overflow-y-auto">
      {/* Top Header in onboarding */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#A8B98A]/30 flex items-center justify-center text-[#4F6340] border border-[#C9D3B0]">
            <ChasenIcon size={18} />
          </div>
          <span className="font-serif text-2xl font-bold lowercase tracking-tight text-[#4F6340]">
            matchapp
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
            className="text-xs font-semibold px-2 py-1 rounded-full bg-[#E9DFCB] text-[#4F6340]"
          >
            {language === 'es' ? 'EN' : 'ES'}
          </button>
          <button
            type="button"
            id="onboarding-skip-btn"
            onClick={completeOnboarding}
            className="text-xs font-medium text-[#4F6340]/70 hover:text-[#4F6340] px-2 py-1"
          >
            {language === 'es' ? 'Saltar' : 'Skip'}
          </button>
        </div>
      </div>

      {/* Main Slide Carousel Area */}
      <div className="my-auto py-6">
        <div className="relative w-full aspect-4/3 rounded-3xl overflow-hidden shadow-md border border-[#E9DFCB] mb-6">
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            className="w-full h-full object-cover transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#4F6340]/50 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-4 right-4">
            <span className="inline-block px-3 py-1 rounded-full bg-[#FFFDF8]/90 text-[#4F6340] text-xs font-semibold backdrop-blur-xs shadow-xs">
              {slides[currentSlide].badge}
            </span>
          </div>
        </div>

        {/* Slide Text Content */}
        <div className="text-center px-2 space-y-3">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#4F6340] leading-tight">
            {slides[currentSlide].title}
          </h2>
          <p className="text-sm text-[#4F6340]/80 leading-relaxed font-normal">
            {slides[currentSlide].description}
          </p>
        </div>

        {/* Dots indicator */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? 'w-7 bg-[#4F6340]'
                  : 'w-2 bg-[#C9D3B0]'
              }`}
              aria-label={`Ir a slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Actions: Geolocation & City Choice on slide 3, or Next Slide */}
      <div className="space-y-3 pt-2">
        {currentSlide < slides.length - 1 ? (
          <button
            type="button"
            id="onboarding-next-btn"
            onClick={() => setCurrentSlide((prev) => prev + 1)}
            className="w-full py-3.5 px-5 bg-[#4F6340] hover:bg-[#3C4D30] text-[#FFFDF8] rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
          >
            <span>{language === 'es' ? 'Siguiente' : 'Next'}</span>
            <ChevronRight size={18} />
          </button>
        ) : (
          <div className="space-y-2.5">
            {/* Geolocation Button */}
            <button
              type="button"
              id="onboarding-location-btn"
              onClick={handleAllowLocation}
              disabled={isLocating}
              className="w-full py-3.5 px-5 bg-[#4F6340] hover:bg-[#3C4D30] text-[#FFFDF8] rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
            >
              {locationSuccess ? (
                <>
                  <Check size={18} className="text-[#A8B98A]" />
                  <span>
                    {language === 'es'
                      ? `¡Ubicación detectada: ${userLocation.cityName}!`
                      : `Location found: ${userLocation.cityName}!`}
                  </span>
                </>
              ) : (
                <>
                  <Crosshair
                    size={18}
                    className={`text-[#C9D3B0] ${isLocating ? 'animate-spin' : ''}`}
                  />
                  <span>
                    {isLocating ? t.locationSearching : t.allowLocation}
                  </span>
                </>
              )}
            </button>

            {/* Manual City Selector */}
            <div className="text-center pt-1">
              <span className="text-xs text-[#4F6340]/70 block mb-2 font-medium">
                {t.locationDenied}
              </span>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {Object.keys(SPANISH_CITIES_COORDS).map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => {
                      setUserCity(city);
                      completeOnboarding();
                    }}
                    className="text-xs px-3 py-1.5 rounded-full bg-[#FFFDF8] border border-[#E9DFCB] hover:border-[#4F6340] text-[#4F6340] font-medium transition-colors shadow-2xs"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              id="onboarding-finish-btn"
              onClick={completeOnboarding}
              className="w-full py-2.5 text-xs text-[#4F6340] font-semibold underline underline-offset-4 hover:opacity-80 transition-opacity"
            >
              {t.startExploring}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
