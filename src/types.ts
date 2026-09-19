export type PriceLevel = '€' | '€€' | '€€€';

export type SpotStatus = 'approved' | 'pending' | 'rejected';

export type MatchaTag =
  | 'ceremonial'
  | 'matcha_latte'
  | 'iced_matcha'
  | 'vegan_milks'
  | 'desserts'
  | 'takeaway'
  | 'aesthetic'
  | 'pet_friendly'
  | 'specialty_coffee'
  | 'wifi_work'
  | 'terrace';

export interface SubRatings {
  matcha: number;   // Calidad del matcha (1-5)
  ambience: number; // Ambiente & vibra (1-5)
  value: number;    // Relación calidad-precio (1-5)
  service: number;  // Servicio & atención (1-5)
}

export interface Review {
  id: string;
  spotId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userCity?: string;
  rating: number; // 1-5 (supports half stars like 4.5)
  subRatings?: SubRatings;
  text: string;
  photos: string[];
  helpfulCount: number;
  helpfulUserIds: string[];
  reported?: boolean;
  createdAt: string; // ISO date
  updatedAt?: string;
}

export interface OpeningHourDay {
  day: string; // Lunes, Martes, etc.
  hours: string; // e.g., "08:30 - 20:00" or "Cerrado"
  isOpenToday?: boolean;
}

export interface Spot {
  id: string;
  name: string;
  tagline: string;
  description: string;
  address: string;
  neighborhood: string;
  city: 'Madrid' | 'Barcelona' | 'Valencia' | 'Sevilla' | 'Málaga' | 'Bilbao';
  postalCode: string;
  lat: number;
  lng: number;
  phone?: string;
  website?: string;
  instagram?: string;
  openingHours: OpeningHourDay[];
  isOpenNow: boolean;
  priceLevel: PriceLevel;
  tags: MatchaTag[];
  photos: string[];
  avgRating: number;
  reviewCount: number;
  ratingBreakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  featuredMatchaOrigin?: string; // e.g., "Uji, Kyoto" or "Kagoshima"
  status: SpotStatus;
  submittedBy?: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  email: string;
  avatar: string;
  city: string;
  bio?: string;
  badge: string; // e.g. "Matcha Connoisseur", "Ceremonial Master"
  reviewCount: number;
  savedSpotsCount: number;
  createdAt: string;
}

export interface SavedCollection {
  favorites: string[]; // Spot IDs
  wantToTry: string[]; // Spot IDs
}

export interface FilterState {
  searchQuery: string;
  selectedCity: string | 'all';
  radiusKm: number; // 1, 3, 5, 10, or 50
  minRating: number; // 0, 3.5, 4.0, 4.5
  openNowOnly: boolean;
  selectedTags: MatchaTag[];
  sortBy: 'nearest' | 'top_rated' | 'most_reviewed';
}

export interface GeoLocationCoords {
  lat: number;
  lng: number;
  accuracy?: number;
  cityName?: string;
}
