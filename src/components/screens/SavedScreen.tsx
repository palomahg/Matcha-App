import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SpotCard } from '../common/SpotCard';
import { Heart, Bookmark, Compass } from 'lucide-react';

export const SavedScreen: React.FC = () => {
  const { spots, saved, setActiveTab, t, language } = useApp();
  const [activeTab, setActiveTabState] = useState<'favorites' | 'wantToTry'>('favorites');

  const favoriteSpots = spots.filter((s) => saved.favorites.includes(s.id));
  const wantToTrySpots = spots.filter((s) => saved.wantToTry.includes(s.id));

  const currentList = activeTab === 'favorites' ? favoriteSpots : wantToTrySpots;

  return (
    <div className="pb-24 pt-2 px-4 space-y-4">
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#4F6340]">
          {t.savedTitle}
        </h1>
        <p className="text-xs text-[#4F6340]/70 mt-0.5">
          {language === 'es'
            ? 'Tu colección personal de templos de té y cafeterías en España.'
            : 'Your personal collection of tea sanctuaries in Spain.'}
        </p>
      </div>

      {/* Segmented Control Tabs */}
      <div className="flex items-center bg-[#E9DFCB]/70 p-1 rounded-2xl border border-[#E9DFCB]">
        <button
          type="button"
          id="saved-tab-favorites"
          onClick={() => setActiveTabState('favorites')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'favorites'
              ? 'bg-[#FFFDF8] text-[#4F6340] shadow-xs'
              : 'text-[#4F6340]/70 hover:text-[#4F6340]'
          }`}
        >
          <Heart size={14} className="text-rose-600 fill-rose-600" />
          <span>{t.tabFavorites}</span>
          <span className="text-[10px] bg-[#E9DFCB] text-[#4F6340] px-1.5 py-0.2 rounded-full">
            {favoriteSpots.length}
          </span>
        </button>

        <button
          type="button"
          id="saved-tab-want-to-try"
          onClick={() => setActiveTabState('wantToTry')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'wantToTry'
              ? 'bg-[#FFFDF8] text-[#4F6340] shadow-xs'
              : 'text-[#4F6340]/70 hover:text-[#4F6340]'
          }`}
        >
          <Bookmark size={14} className="text-[#A8B98A] fill-[#A8B98A]" />
          <span>{t.tabWantToTry}</span>
          <span className="text-[10px] bg-[#E9DFCB] text-[#4F6340] px-1.5 py-0.2 rounded-full">
            {wantToTrySpots.length}
          </span>
        </button>
      </div>

      {/* Spots list */}
      <div className="space-y-4">
        {currentList.length > 0 ? (
          currentList.map((spot) => <SpotCard key={spot.id} spot={spot} />)
        ) : (
          <div className="py-16 px-6 text-center bg-[#FFFDF8] border border-[#E9DFCB] rounded-3xl space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#E9DFCB] text-[#4F6340] flex items-center justify-center mx-auto">
              {activeTab === 'favorites' ? (
                <Heart size={22} className="text-rose-500" />
              ) : (
                <Bookmark size={22} className="text-[#A8B98A]" />
              )}
            </div>
            <h3 className="font-serif text-lg font-bold text-[#4F6340]">
              {t.noSavedTitle}
            </h3>
            <p className="text-xs text-[#4F6340]/70 max-w-xs mx-auto">
              {t.noSavedDesc}
            </p>
            <div className="pt-2">
              <button
                type="button"
                id="saved-explore-cta"
                onClick={() => setActiveTab('explore')}
                className="px-4 py-2.5 bg-[#4F6340] text-[#FFFDF8] text-xs font-semibold rounded-2xl shadow-xs"
              >
                {t.startExploring}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
