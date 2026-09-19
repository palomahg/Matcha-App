import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Spot,
  Review,
  UserProfile,
  SavedCollection,
  FilterState,
  SubRatings,
} from '../types';
import { INITIAL_SPOTS, INITIAL_REVIEWS } from '../data/seedSpots';
import { TRANSLATIONS, Language } from '../i18n/translations';
import { SPANISH_CITIES_COORDS } from '../utils/geo';

interface AppContextType {
  user: UserProfile | null;
  spots: Spot[];
  reviews: Review[];
  saved: SavedCollection;
  userLocation: { lat: number; lng: number; cityName: string };
  hasLocationPermission: boolean | null;
  language: Language;
  filters: FilterState;
  activeTab: 'explore' | 'map' | 'saved' | 'profile';
  selectedSpot: Spot | null;
  reviewingSpot: Spot | null;
  editingReview: Review | null;
  isAddSpotOpen: boolean;
  isAuthOpen: boolean;
  isOnboardingOpen: boolean;
  isRitualStoryOpen: boolean;
  isMaisonStoryOpen: boolean; // Alias for backward compatibility
  // Translation helper
  t: typeof TRANSLATIONS['es'];
  // Actions
  setActiveTab: (tab: 'explore' | 'map' | 'saved' | 'profile') => void;
  openSpotDetail: (spotId: string) => void;
  closeSpotDetail: () => void;
  openReviewModal: (spot: Spot, existingReview?: Review) => void;
  closeReviewModal: () => void;
  openAddSpotModal: () => void;
  closeAddSpotModal: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  completeOnboarding: () => void;
  openOnboarding: () => void;
  openRitualStory: () => void;
  closeRitualStory: () => void;
  openMaisonStory: () => void;
  closeMaisonStory: () => void;
  setLanguage: (lang: Language) => void;
  setFilters: (newFilters: Partial<FilterState>) => void;
  resetFilters: () => void;
  setUserCity: (cityName: string) => void;
  requestDeviceLocation: () => Promise<boolean>;
  toggleFavorite: (spotId: string) => void;
  toggleWantToTry: (spotId: string) => void;
  addReview: (
    spotId: string,
    rating: number,
    text: string,
    subRatings?: SubRatings,
    photos?: string[]
  ) => void;
  updateReview: (
    reviewId: string,
    rating: number,
    text: string,
    subRatings?: SubRatings,
    photos?: string[]
  ) => void;
  deleteReview: (reviewId: string) => void;
  toggleHelpfulReview: (reviewId: string) => void;
  reportReview: (reviewId: string) => void;
  addSpot: (spotData: Partial<Spot>) => void;
  login: (provider: 'google' | 'apple' | 'email', emailInput?: string) => void;
  logout: () => void;
  deleteUserData: () => void;
  exportUserData: () => void;
  rateSpot: (spotId: string, rating: number, comment?: string) => void;
  getUserRatingForSpot: (spotId: string) => number | null;
}

const DEFAULT_USER: UserProfile = {
  id: 'user-paloma',
  username: 'paloma_matcha',
  fullName: 'Paloma Gómez',
  email: 'PalomaHdezGmez@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  city: 'Madrid',
  bio: 'Amante del matcha ceremonial de Uji y la estética de cafés tranquilos en España. 🍵',
  badge: 'Matcha Connoisseur',
  reviewCount: 3,
  savedSpotsCount: 4,
  createdAt: '2024-01-10T10:00:00Z',
};

const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  selectedCity: 'all',
  radiusKm: 25,
  minRating: 0,
  openNowOnly: false,
  selectedTags: [],
  sortBy: 'nearest',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence load
  const [spots, setSpots] = useState<Spot[]>(() => {
    const saved = localStorage.getItem('matchapp_spots');
    if (!saved) return INITIAL_SPOTS;
    try {
      const parsed: Spot[] = JSON.parse(saved);
      const initialMap = new Map(INITIAL_SPOTS.map((s) => [s.id, s]));
      const updated = parsed.map((s) => {
        const fresh = initialMap.get(s.id);
        if (fresh) {
          return {
            ...fresh,
            avgRating: s.avgRating || fresh.avgRating,
            reviewCount: s.reviewCount || fresh.reviewCount,
            ratingBreakdown: s.ratingBreakdown || fresh.ratingBreakdown,
          };
        }
        if (s.name.toLowerCase().includes('maison')) {
          return {
            ...s,
            name: s.name.replace(/maison matcha\s*—\s*/gi, '').trim(),
            description: s.description.replace(/maison matcha/gi, 'MatchApp'),
          };
        }
        return s;
      });
      const existingIds = new Set(updated.map((s) => s.id));
      const missing = INITIAL_SPOTS.filter((s) => !existingIds.has(s.id));
      return [...updated, ...missing];
    } catch {
      return INITIAL_SPOTS;
    }
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('matchapp_reviews');
    if (!saved) return INITIAL_REVIEWS;
    try {
      const parsed: Review[] = JSON.parse(saved);
      return parsed.map((r) => ({
        ...r,
        text: r.text ? r.text.replace(/maison matcha/gi, 'este templo de té') : r.text,
      }));
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  const [saved, setSaved] = useState<SavedCollection>(() => {
    const local = localStorage.getItem('matchapp_saved');
    return local
      ? JSON.parse(local)
      : {
          favorites: ['spot-mad-1', 'spot-bcn-1'],
          wantToTry: ['spot-vlc-1', 'spot-mlg-1'],
        };
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    const local = localStorage.getItem('matchapp_user');
    return local !== null ? JSON.parse(local) : DEFAULT_USER;
  });

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; cityName: string }>(
    () => {
      const local = localStorage.getItem('matchapp_location');
      return local
        ? JSON.parse(local)
        : { lat: 40.4168, lng: -3.7038, cityName: 'Madrid' };
    }
  );

  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(() => {
    const local = localStorage.getItem('matchapp_loc_perm');
    return local !== null ? JSON.parse(local) : null;
  });

  const [language, setLangState] = useState<Language>(() => {
    const local = localStorage.getItem('matchapp_lang');
    return (local as Language) || 'es';
  });

  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => {
    const completed = localStorage.getItem('matchapp_onboarding_done');
    return completed !== 'true';
  });

  const [isRitualStoryOpen, setIsRitualStoryOpen] = useState<boolean>(false);

  const [filters, setFiltersState] = useState<FilterState>(DEFAULT_FILTERS);
  const [activeTab, setActiveTab] = useState<'explore' | 'map' | 'saved' | 'profile'>('explore');
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
  const [reviewingSpot, setReviewingSpot] = useState<Spot | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isAddSpotOpen, setIsAddSpotOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('matchapp_spots', JSON.stringify(spots));
  }, [spots]);

  useEffect(() => {
    localStorage.setItem('matchapp_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('matchapp_saved', JSON.stringify(saved));
  }, [saved]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('matchapp_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('matchapp_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('matchapp_location', JSON.stringify(userLocation));
  }, [userLocation]);

  const t = TRANSLATIONS[language];

  const setLanguage = (lang: Language) => {
    setLangState(lang);
    localStorage.setItem('matchapp_lang', lang);
  };

  const setFilters = (newFilters: Partial<FilterState>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFiltersState(DEFAULT_FILTERS);
  };

  const setUserCity = (cityName: string) => {
    const cityCoords = SPANISH_CITIES_COORDS[cityName] || SPANISH_CITIES_COORDS['Madrid'];
    setUserLocation({
      lat: cityCoords.lat,
      lng: cityCoords.lng,
      cityName,
    });
    setFilters({ selectedCity: cityName });
  };

  const requestDeviceLocation = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!('geolocation' in navigator)) {
        setHasLocationPermission(false);
        localStorage.setItem('matchapp_loc_perm', 'false');
        resolve(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Determine closest Spanish city
          let closestCity = 'Madrid';
          let minDistance = Infinity;

          for (const [name, data] of Object.entries(SPANISH_CITIES_COORDS)) {
            const dist = Math.hypot(latitude - data.lat, longitude - data.lng);
            if (dist < minDistance) {
              minDistance = dist;
              closestCity = name;
            }
          }

          setUserLocation({
            lat: latitude,
            lng: longitude,
            cityName: closestCity,
          });
          setHasLocationPermission(true);
          localStorage.setItem('matchapp_loc_perm', 'true');
          resolve(true);
        },
        (error) => {
          console.warn('Geolocation denied or error:', error.message);
          setHasLocationPermission(false);
          localStorage.setItem('matchapp_loc_perm', 'false');
          resolve(false);
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    });
  };

  const completeOnboarding = () => {
    setIsOnboardingOpen(false);
    localStorage.setItem('matchapp_onboarding_done', 'true');
    // Open the single storytelling screen immediately between intro and map
    setIsRitualStoryOpen(true);
  };

  const openOnboarding = () => {
    setIsOnboardingOpen(true);
  };

  const openRitualStory = () => {
    setIsRitualStoryOpen(true);
  };

  const closeRitualStory = () => {
    setIsRitualStoryOpen(false);
  };

  const openMaisonStory = openRitualStory;
  const closeMaisonStory = closeRitualStory;

  const openSpotDetail = (spotId: string) => {
    setSelectedSpotId(spotId);
  };

  const closeSpotDetail = () => {
    setSelectedSpotId(null);
  };

  const openReviewModal = (spot: Spot, existingRev?: Review) => {
    setReviewingSpot(spot);
    setEditingReview(existingRev || null);
  };

  const closeReviewModal = () => {
    setReviewingSpot(null);
    setEditingReview(null);
  };

  const openAddSpotModal = () => setIsAddSpotOpen(true);
  const closeAddSpotModal = () => setIsAddSpotOpen(false);
  const openAuthModal = () => setIsAuthOpen(true);
  const closeAuthModal = () => setIsAuthOpen(false);

  const toggleFavorite = (spotId: string) => {
    setSaved((prev) => {
      const exists = prev.favorites.includes(spotId);
      const newFavs = exists
        ? prev.favorites.filter((id) => id !== spotId)
        : [...prev.favorites, spotId];
      return { ...prev, favorites: newFavs };
    });
  };

  const toggleWantToTry = (spotId: string) => {
    setSaved((prev) => {
      const exists = prev.wantToTry.includes(spotId);
      const newTry = exists
        ? prev.wantToTry.filter((id) => id !== spotId)
        : [...prev.wantToTry, spotId];
      return { ...prev, wantToTry: newTry };
    });
  };

  // Helper to recalculate a spot's avgRating & reviewCount
  const recalcSpotStats = (spotId: string, currentReviews: Review[]) => {
    const spotReviews = currentReviews.filter((r) => r.spotId === spotId);
    const count = spotReviews.length;
    let avg = 0;
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    if (count > 0) {
      const sum = spotReviews.reduce((acc, r) => acc + r.rating, 0);
      avg = Math.round((sum / count) * 10) / 10;
      spotReviews.forEach((r) => {
        const rounded = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
        breakdown[rounded] = (breakdown[rounded] || 0) + 1;
      });
    }

    setSpots((prev) =>
      prev.map((s) =>
        s.id === spotId
          ? {
              ...s,
              avgRating: avg || s.avgRating,
              reviewCount: count,
              ratingBreakdown: count > 0 ? breakdown : s.ratingBreakdown,
            }
          : s
      )
    );
  };

  const addReview = (
    spotId: string,
    rating: number,
    text: string,
    subRatings?: SubRatings,
    photos: string[] = []
  ) => {
    if (!user) return;
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      spotId,
      userId: user.id,
      userName: user.fullName || user.username,
      userAvatar: user.avatar,
      userCity: user.city,
      rating,
      subRatings,
      text,
      photos,
      helpfulCount: 0,
      helpfulUserIds: [],
      createdAt: new Date().toISOString(),
    };

    const nextReviews = [newRev, ...reviews];
    setReviews(nextReviews);
    recalcSpotStats(spotId, nextReviews);

    // Update user stats
    setUser((prev) =>
      prev ? { ...prev, reviewCount: (prev.reviewCount || 0) + 1 } : prev
    );
  };

  const updateReview = (
    reviewId: string,
    rating: number,
    text: string,
    subRatings?: SubRatings,
    photos?: string[]
  ) => {
    let spotIdToRecalc = '';
    const nextReviews = reviews.map((r) => {
      if (r.id === reviewId) {
        spotIdToRecalc = r.spotId;
        return {
          ...r,
          rating,
          text,
          subRatings: subRatings || r.subRatings,
          photos: photos !== undefined ? photos : r.photos,
          updatedAt: new Date().toISOString(),
        };
      }
      return r;
    });

    setReviews(nextReviews);
    if (spotIdToRecalc) {
      recalcSpotStats(spotIdToRecalc, nextReviews);
    }
  };

  const deleteReview = (reviewId: string) => {
    const revToDelete = reviews.find((r) => r.id === reviewId);
    const nextReviews = reviews.filter((r) => r.id !== reviewId);
    setReviews(nextReviews);
    if (revToDelete) {
      recalcSpotStats(revToDelete.spotId, nextReviews);
    }
    setUser((prev) =>
      prev ? { ...prev, reviewCount: Math.max(0, (prev.reviewCount || 1) - 1) } : prev
    );
  };

  const toggleHelpfulReview = (reviewId: string) => {
    if (!user) return;
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id !== reviewId) return r;
        const hasLiked = r.helpfulUserIds.includes(user.id);
        const newIds = hasLiked
          ? r.helpfulUserIds.filter((id) => id !== user.id)
          : [...r.helpfulUserIds, user.id];
        return {
          ...r,
          helpfulCount: newIds.length,
          helpfulUserIds: newIds,
        };
      })
    );
  };

  const reportReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, reported: true } : r))
    );
  };

  const getUserRatingForSpot = (spotId: string): number | null => {
    const currentUserId = user?.id || 'user-paloma';
    const found = reviews.find(
      (r) => r.spotId === spotId && (r.userId === currentUserId || (user && r.userId === user.id))
    );
    return found ? found.rating : null;
  };

  const rateSpot = (spotId: string, rating: number, comment?: string) => {
    let effectiveUser = user;
    if (!effectiveUser) {
      effectiveUser = DEFAULT_USER;
      setUser(DEFAULT_USER);
    }

    const currentUserId = effectiveUser.id;
    const existingIndex = reviews.findIndex(
      (r) => r.spotId === spotId && (r.userId === currentUserId || (user && r.userId === user.id))
    );

    let nextReviews: Review[];
    if (existingIndex >= 0) {
      nextReviews = reviews.map((r, i) =>
        i === existingIndex
          ? {
              ...r,
              rating,
              text: comment || r.text || `Calificación de ${rating} estrellas`,
              updatedAt: new Date().toISOString(),
            }
          : r
      );
    } else {
      const newRev: Review = {
        id: `rev-${Date.now()}`,
        spotId,
        userId: currentUserId,
        userName: effectiveUser.fullName || effectiveUser.username,
        userAvatar: effectiveUser.avatar,
        userCity: effectiveUser.city,
        rating,
        subRatings: {
          matcha: Math.round(rating),
          ambience: Math.round(rating),
          value: Math.round(rating),
          service: Math.round(rating),
        },
        text: comment || `Calificación de ${rating} estrellas`,
        photos: [],
        helpfulCount: 0,
        helpfulUserIds: [],
        createdAt: new Date().toISOString(),
      };
      nextReviews = [newRev, ...reviews];
      setUser((prev) =>
        prev ? { ...prev, reviewCount: (prev.reviewCount || 0) + 1 } : prev
      );
    }

    setReviews(nextReviews);
    recalcSpotStats(spotId, nextReviews);
  };

  const addSpot = (spotData: Partial<Spot>) => {
    const newId = `spot-user-${Date.now()}`;
    const city = (spotData.city as any) || 'Madrid';
    const cityCoords = SPANISH_CITIES_COORDS[city] || SPANISH_CITIES_COORDS['Madrid'];

    const newSpot: Spot = {
      id: newId,
      name: spotData.name || 'Nuevo Matcha Café',
      tagline: spotData.tagline || 'Café y matcha de especialidad',
      description:
        spotData.description ||
        'Un nuevo rincón acogedor en España recomendado por la comunidad de MatchApp.',
      address: spotData.address || 'Calle Central, 1',
      neighborhood: spotData.neighborhood || 'Centro',
      city,
      postalCode: spotData.postalCode || '28001',
      lat: spotData.lat || cityCoords.lat + (Math.random() - 0.5) * 0.03,
      lng: spotData.lng || cityCoords.lng + (Math.random() - 0.5) * 0.03,
      phone: spotData.phone || '+34 910 00 00 00',
      website: spotData.website || '',
      instagram: spotData.instagram || '@matchaspot',
      openingHours: [
        { day: 'Lunes - Domingo', hours: '09:00 - 20:00', isOpenToday: true },
      ],
      isOpenNow: true,
      priceLevel: spotData.priceLevel || '€€',
      tags: spotData.tags?.length ? spotData.tags : ['ceremonial', 'matcha_latte', 'vegan_milks'],
      photos: spotData.photos?.length
        ? spotData.photos
        : [
            'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=1000&q=80',
          ],
      avgRating: 5.0,
      reviewCount: 0,
      ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      status: 'pending', // in moderation queue as requested!
      submittedBy: user?.username || 'Comunidad',
      createdAt: new Date().toISOString(),
    };

    setSpots((prev) => [newSpot, ...prev]);
  };

  const login = (provider: 'google' | 'apple' | 'email', emailInput?: string) => {
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      username: emailInput ? emailInput.split('@')[0] : 'matcha_lover',
      fullName: provider === 'apple' ? 'Matcha Fan' : 'Paloma Gómez',
      email: emailInput || 'PalomaHdezGmez@gmail.com',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      city: userLocation.cityName,
      bio: 'Explorando las teterías y cafeterías de matcha más relajantes de España.',
      badge: 'Matcha Connoisseur',
      reviewCount: 2,
      savedSpotsCount: 4,
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    closeAuthModal();
  };

  const logout = () => {
    setUser(null);
  };

  // GDPR Data Rights
  const deleteUserData = () => {
    if (user) {
      setReviews((prev) => prev.filter((r) => r.userId !== user.id));
    }
    setSaved({ favorites: [], wantToTry: [] });
    setUser(null);
    localStorage.clear();
  };

  const exportUserData = () => {
    const dataToExport = {
      exportDate: new Date().toISOString(),
      user,
      savedSpots: saved,
      myReviews: user ? reviews.filter((r) => r.userId === user.id) : [],
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `matchapp-data-${user?.username || 'user'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedSpot = spots.find((s) => s.id === selectedSpotId) || null;

  return (
    <AppContext.Provider
      value={{
        user,
        spots,
        reviews,
        saved,
        userLocation,
        hasLocationPermission,
        language,
        filters,
        activeTab,
        selectedSpot,
        reviewingSpot,
        editingReview,
        isAddSpotOpen,
        isAuthOpen,
        isOnboardingOpen,
        isRitualStoryOpen,
        isMaisonStoryOpen: isRitualStoryOpen,
        t,
        setActiveTab,
        openSpotDetail,
        closeSpotDetail,
        openReviewModal,
        closeReviewModal,
        openAddSpotModal,
        closeAddSpotModal,
        openAuthModal,
        closeAuthModal,
        completeOnboarding,
        openOnboarding,
        openRitualStory,
        closeRitualStory,
        openMaisonStory,
        closeMaisonStory,
        setLanguage,
        setFilters,
        resetFilters,
        setUserCity,
        requestDeviceLocation,
        toggleFavorite,
        toggleWantToTry,
        addReview,
        updateReview,
        deleteReview,
        toggleHelpfulReview,
        reportReview,
        addSpot,
        login,
        logout,
        deleteUserData,
        exportUserData,
        rateSpot,
        getUserRatingForSpot,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
