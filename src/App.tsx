import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { ExploreScreen } from './components/screens/ExploreScreen';
import { MapView } from './components/screens/MapView';
import { SavedScreen } from './components/screens/SavedScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { SpotDetailScreen } from './components/screens/SpotDetailScreen';
import { WriteReviewModal } from './components/screens/WriteReviewModal';
import { AddSpotModal } from './components/screens/AddSpotModal';
import { SearchScreen } from './components/screens/SearchScreen';
import { AuthModal } from './components/screens/AuthModal';
import { OnboardingScreen } from './components/screens/OnboardingScreen';
import { RitualStoryScreen } from './components/screens/RitualStoryScreen';

const MainApp: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    selectedSpot,
    reviewingSpot,
    isAddSpotOpen,
    isAuthOpen,
    isOnboardingOpen,
    isRitualStoryOpen,
    closeRitualStory,
  } = useApp();

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F6F1E7] text-[#4F6340] flex justify-center selection:bg-[#C9D3B0] selection:text-[#38482D]">
      {/* Mobile-first centered application container */}
      <div className="w-full max-w-md min-h-screen bg-[#F6F1E7] flex flex-col relative shadow-[0_0_50px_rgba(79,99,64,0.08)] border-x border-[#E9DFCB]/60">
        {/* Top Header */}
        <Header onOpenSearch={() => setIsSearchOpen(true)} />

        {/* Main Tab Content */}
        <main className="flex-1">
          {activeTab === 'explore' && (
            <ExploreScreen
              onOpenSearch={() => setIsSearchOpen(true)}
              onSwitchToMap={() => setActiveTab('map')}
            />
          )}

          {activeTab === 'map' && (
            <MapView onSwitchToList={() => setActiveTab('explore')} />
          )}

          {activeTab === 'saved' && <SavedScreen />}

          {activeTab === 'profile' && <ProfileScreen />}
        </main>

        {/* Bottom Tab Bar (shown when not in full modal overlays) */}
        {!selectedSpot && <BottomNav />}

        {/* Full screen modal overlays */}
        {selectedSpot && <SpotDetailScreen />}
        {reviewingSpot && <WriteReviewModal />}
        {isAddSpotOpen && <AddSpotModal />}
        {isSearchOpen && <SearchScreen onClose={() => setIsSearchOpen(false)} />}
        {isAuthOpen && <AuthModal />}
        {isOnboardingOpen && <OnboardingScreen />}
        {isRitualStoryOpen && (
          <RitualStoryScreen
            onGoToMap={() => {
              closeRitualStory();
              setActiveTab('map');
            }}
            onGoToList={() => {
              closeRitualStory();
              setActiveTab('explore');
            }}
            onClose={closeRitualStory}
          />
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
