import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChasenIcon, MatchaLeafIcon } from '../../design-system/theme';
import { MapPin, ChevronRight, Sparkles, X, Heart, Compass, CheckCircle2, ArrowRight } from 'lucide-react';

interface RitualStoryScreenProps {
  onGoToMap: () => void;
  onGoToList: () => void;
  onClose: () => void;
}

export const RitualStoryScreen: React.FC<RitualStoryScreenProps> = ({
  onGoToMap,
  onGoToList,
  onClose,
}) => {
  const { language } = useApp();
  const [activeTab, setActiveTab] = useState<'ritual' | 'origin' | 'temples'>('ritual');

  return (
    <div
      id="ritual-story-screen"
      className="fixed inset-0 z-50 bg-[#FAF8F5] text-[#2C3826] flex flex-col justify-between max-w-md mx-auto overflow-y-auto antialiased"
    >
      {/* Top Bar with brand mark and close button */}
      <div className="sticky top-0 z-20 bg-[#FAF8F5]/90 backdrop-blur-md px-5 py-4 flex items-center justify-between border-b border-[#EDE6DC]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#EFE9DF] border border-[#D9CEBF] flex items-center justify-center text-[#3B4D31]">
            <ChasenIcon size={16} />
          </div>
          <div className="flex flex-col">
            <span className="font-serif tracking-widest text-[11px] uppercase font-bold text-[#3B4D31]">
              MatchApp
            </span>
            <span className="text-[9px] text-[#7B8A6F] tracking-widest uppercase font-medium">
              El Manifiesto del Ritual
            </span>
          </div>
        </div>

        <button
          type="button"
          id="close-ritual-story-btn"
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-[#F2ECE3] hover:bg-[#E7DECf] text-[#3B4D31] flex items-center justify-center transition-colors"
          aria-label="Cerrar"
        >
          <X size={16} />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="px-5 py-4 space-y-6 flex-1">
        {/* Editorial Eyebrow & Headline */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0EAE0] border border-[#DDD3C3] text-[10px] uppercase font-bold tracking-[0.18em] text-[#4F6340]">
            <Sparkles size={11} className="text-[#C8A763]" />
            <span>{language === 'es' ? 'El Arte de la Calma' : 'The Art of Slow'}</span>
          </div>

          <h1 className="font-serif text-2xl md:text-3xl font-normal text-[#2C3826] leading-tight">
            {language === 'es' ? (
              <>
                Un ritual consciente en un{' '}
                <span className="italic font-medium text-[#465A38]">mundo apresurado</span>
              </>
            ) : (
              <>
                A mindful ritual in a{' '}
                <span className="italic font-medium text-[#465A38]">fast-paced world</span>
              </>
            )}
          </h1>

          <p className="text-xs md:text-sm text-[#5D6B53] max-w-xs mx-auto leading-relaxed font-normal">
            {language === 'es'
              ? 'El matcha no es solo una bebida. Es el compromiso diario de pausar, reconectar y nutrir tu cuerpo con serenidad.'
              : 'Matcha is not just a drink. It is a daily commitment to pause, reconnect, and nourish your body with serenity.'}
          </p>
        </div>

        {/* Hero Image Card (Warm, tactile aesthetic) */}
        <div className="relative rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(62,78,53,0.12)] border border-[#E5DDD0] bg-[#F2EDE5]">
          <img
            src="https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=900&q=85"
            alt="MatchApp Ritual & Chasen"
            className="w-full h-56 object-cover object-center transform hover:scale-102 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#24301E]/75 via-transparent to-transparent" />
          
          {/* Tag on image */}
          <div className="absolute top-3 left-3 bg-[#FAF8F5]/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#D9CEBF] shadow-xs flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8FA77B] animate-pulse" />
            <span className="text-[10px] font-bold text-[#3B4D31] uppercase tracking-wider">
              Uji & Kagoshima · 100% Ceremonial
            </span>
          </div>

          {/* Quote over image */}
          <div className="absolute bottom-3 left-4 right-4 text-[#FFFDF8]">
            <p className="font-serif italic text-sm text-[#F7F4EE] leading-snug">
              {language === 'es'
                ? '«Regálate quince minutos de calma antes de que empiece el día.»'
                : '«Give yourself fifteen minutes of calm before the day unfolds.»'}
            </p>
          </div>
        </div>

        {/* Interactive 3 Pillars / Story Chapters */}
        <div className="space-y-3">
          {/* Segmented Controls */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-[#EFEAE1] rounded-2xl border border-[#E0D7C9]">
            <button
              type="button"
              onClick={() => setActiveTab('ritual')}
              className={`py-2 text-[11px] font-semibold rounded-xl transition-all ${
                activeTab === 'ritual'
                  ? 'bg-[#FAF8F5] text-[#2C3826] shadow-xs'
                  : 'text-[#6F7D66] hover:text-[#2C3826]'
              }`}
            >
              {language === 'es' ? 'I. El Chasen' : 'I. The Whisk'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('origin')}
              className={`py-2 text-[11px] font-semibold rounded-xl transition-all ${
                activeTab === 'origin'
                  ? 'bg-[#FAF8F5] text-[#2C3826] shadow-xs'
                  : 'text-[#6F7D66] hover:text-[#2C3826]'
              }`}
            >
              {language === 'es' ? 'II. El Origen' : 'II. Origin'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('temples')}
              className={`py-2 text-[11px] font-semibold rounded-xl transition-all ${
                activeTab === 'temples'
                  ? 'bg-[#FAF8F5] text-[#2C3826] shadow-xs'
                  : 'text-[#6F7D66] hover:text-[#2C3826]'
              }`}
            >
              {language === 'es' ? 'III. Los Templos' : 'III. Temples'}
            </button>
          </div>

          {/* Pillar Card */}
          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E5DDD0] shadow-xs transition-all">
            {activeTab === 'ritual' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#7B8A6F]">
                    Paso a paso · El Batido
                  </span>
                  <ChasenIcon size={18} className="text-[#4F6340]" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#2C3826]">
                  {language === 'es' ? 'La emulsión sedosa y jade' : 'The silky jade emulsion'}
                </h3>
                <p className="text-xs text-[#5D6B53] leading-relaxed">
                  {language === 'es'
                    ? 'Con agua caliente a 75°C y el Chasen (batidor de 100 púas de bambú natural), batimos enérgicamente en forma de "W". El resultado es una corona de micro-espuma untuosa sin amargura, rica en L-teanina para una concentración serena.'
                    : 'With warm water at 75°C and the Chasen bamboo whisk, whip in a rapid "W" motion. This creates a dense velvet microfoam without bitterness, rich in L-theanine for sustained calm focus.'}
                </p>
                <div className="pt-2 flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-[#F3EDE3] text-[10px] font-semibold text-[#4F6340]">
                    ✓ Cero jitter o bajón
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#F3EDE3] text-[10px] font-semibold text-[#4F6340]">
                    ✓ Antioxidantes x137
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#F3EDE3] text-[10px] font-semibold text-[#4F6340]">
                    ✓ Energía limpia 4-6h
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'origin' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#7B8A6F]">
                    Cosecha Primera · Kioto
                  </span>
                  <MatchaLeafIcon size={18} className="text-[#4F6340]" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#2C3826]">
                  {language === 'es' ? 'Hojas Tencha de Sombreo' : 'Shaded Tencha Leaves'}
                </h3>
                <p className="text-xs text-[#5D6B53] leading-relaxed">
                  {language === 'es'
                    ? 'Tres semanas antes de la cosecha primaveral, las plantaciones se cubren de sombras para obligar a la planta a concentrar clorofila y dulzor umami natural. Molidas a piedra a razón de apenas 30 gramos por hora.'
                    : 'Three weeks before harvest, tea bushes are shaded from sunlight, driving the leaves to accumulate intense chlorophyll and rich umami sweetness. Stone-ground slowly at just 30g per hour.'}
                </p>
                <div className="pt-2 flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-[#F3EDE3] text-[10px] font-semibold text-[#4F6340]">
                    🌱 Grado Ceremonial
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#F3EDE3] text-[10px] font-semibold text-[#4F6340]">
                    📍 Uji & Kagoshima
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#F3EDE3] text-[10px] font-semibold text-[#4F6340]">
                    ✨ Piedra de granito
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'temples' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#7B8A6F]">
                    Comunidad en España
                  </span>
                  <MapPin size={18} className="text-[#4F6340]" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#2C3826]">
                  {language === 'es' ? 'Santuarios cerca de ti' : 'Sanctuaries near you'}
                </h3>
                <p className="text-xs text-[#5D6B53] leading-relaxed">
                  {language === 'es'
                    ? 'Desde cafeterías de especialidad de referencia en Madrid (Chamberí, Salamanca, Malasaña, Retiro, Lavapiés) hasta templos seleccionados en Barcelona, Valencia, Sevilla y más. Espacios con cerámica de autor, leche de avena barista y estética intencional.'
                    : 'From specialty coffee & matcha sanctuaries in Madrid (Chamberí, Salamanca, Malasaña, Retiro, Lavapiés) to curated spots across Barcelona, Valencia, Seville, and beyond. Designed with clean ceramics, craft oat milk, and calming aesthetics.'}
                </p>
                <div className="pt-2 flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-[#F3EDE3] text-[10px] font-semibold text-[#4F6340]">
                    ☕ Leche avena barista
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#F3EDE3] text-[10px] font-semibold text-[#4F6340]">
                    🏺 Chawan artesanal
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#F3EDE3] text-[10px] font-semibold text-[#4F6340]">
                    ✨ Espacios serenos
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Story Quote Banner */}
        <div className="p-3.5 rounded-2xl bg-[#F4EFE7] border border-[#DFD5C6] flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#FFFDF8] border border-[#D9CEBF] flex items-center justify-center shrink-0 text-[#C8A763]">
            <Sparkles size={18} />
          </div>
          <p className="text-xs text-[#4F6340] leading-snug">
            <span className="font-bold">MatchApp:</span>{' '}
            {language === 'es'
              ? 'Localiza en el mapa interactivo todos los cafés y comercios cerca de Madrid con matcha y valora con estrellas tu experiencia.'
              : 'Locate on the interactive map all cafes and shops near Madrid with matcha and rate your experience with stars.'}
          </p>
        </div>
      </div>

      {/* Bottom Sticky Action Buttons (Direct bridge to the MAP) */}
      <div className="sticky bottom-0 z-20 bg-[#FAF8F5]/95 backdrop-blur-md px-5 py-4 border-t border-[#EDE6DC] space-y-2">
        {/* Main CTA: Go to the interactive Map */}
        <button
          type="button"
          id="ritual-go-to-map-btn"
          onClick={onGoToMap}
          className="w-full py-4 px-5 bg-[#38482D] hover:bg-[#2C3826] text-[#FFFDF8] rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(44,56,38,0.25)] transition-all active:scale-98"
        >
          <MapPin size={18} className="text-[#C8A763]" />
          <span>
            {language === 'es'
              ? 'Descubrir Cafeterías en el Mapa'
              : 'Discover Spots on the Map'}
          </span>
          <ArrowRight size={16} />
        </button>

        {/* Secondary: Go to List / Explore */}
        <button
          type="button"
          id="ritual-go-to-list-btn"
          onClick={onGoToList}
          className="w-full py-2.5 text-xs text-[#5D6B53] font-semibold hover:text-[#2C3826] transition-colors text-center"
        >
          {language === 'es'
            ? 'O explorar todos los cafés en lista'
            : 'Or browse all spots in list view'}
        </button>
      </div>
    </div>
  );
};
