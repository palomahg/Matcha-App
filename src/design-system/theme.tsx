import React from 'react';

/**
 * MatchApp Design System Tokens
 * Serene, tactile, elegant, modern warm Japanese minimalism aesthetics:
 * Creamy, organic, refined and mindful.
 */

export const THEME_COLORS = {
  matchaGreen: '#A8B98A', // Primary
  softSage: '#C9D3B0',    // Secondary / subtle borders
  deepMatcha: '#4F6340',  // High contrast text & icons
  deepMatchaHover: '#3C4D30',
  cream: '#F6F1E7',       // Main background canvas
  warmBeige: '#E9DFCB',   // Cards & secondary surfaces
  ivoryWhite: '#FFFDF8',  // Elevated surfaces / modals
  blush: '#E8C9C0',       // Subtle badges / heart accents
  starGold: '#D9B25F',    // Warm golden matcha-latte stars
  borderMuted: '#E4DCB',
};

export const TAG_DEFINITIONS: Record<
  string,
  { labelEs: string; labelEn: string; icon: string; emoji: string }
> = {
  ceremonial: {
    labelEs: 'Matcha ceremonial',
    labelEn: 'Ceremonial grade',
    icon: 'Sparkles',
    emoji: '🍵',
  },
  matcha_latte: {
    labelEs: 'Matcha latte artesanal',
    labelEn: 'Craft matcha latte',
    icon: 'Coffee',
    emoji: '🥛',
  },
  iced_matcha: {
    labelEs: 'Iced matcha',
    labelEn: 'Iced matcha',
    icon: 'Snowflake',
    emoji: '🧊',
  },
  vegan_milks: {
    labelEs: 'Leches vegetales (avena, soja...)',
    labelEn: 'Oat & vegan milk options',
    icon: 'Wheat',
    emoji: '🌱',
  },
  desserts: {
    labelEs: 'Repostería con matcha',
    labelEn: 'Matcha pastries & sweets',
    icon: 'Cookie',
    emoji: '🍰',
  },
  takeaway: {
    labelEs: 'Para llevar (Takeaway)',
    labelEn: 'Takeaway cup',
    icon: 'ShoppingBag',
    emoji: '🥤',
  },
  aesthetic: {
    labelEs: 'Espacio estético / Instagrammable',
    labelEn: 'Aesthetic / Instagrammable',
    icon: 'Camera',
    emoji: '✨',
  },
  pet_friendly: {
    labelEs: 'Pet friendly',
    labelEn: 'Pet friendly',
    icon: 'Dog',
    emoji: '🐾',
  },
  specialty_coffee: {
    labelEs: 'Café de especialidad',
    labelEn: 'Specialty coffee too',
    icon: 'Coffee',
    emoji: '☕',
  },
  wifi_work: {
    labelEs: 'Apto para trabajar / Wi-Fi',
    labelEn: 'Laptop friendly / Wi-Fi',
    icon: 'Laptop',
    emoji: '💻',
  },
  terrace: {
    labelEs: 'Terraza soleada',
    labelEn: 'Sunny terrace',
    icon: 'Sun',
    emoji: '☀️',
  },
};

/**
 * Custom SVG Bamboo Whisk (Chasen - 茶筅) Icon
 * Represents the ritual of whipping pure matcha.
 */
export const ChasenIcon: React.FC<{ className?: string; size?: number }> = ({
  className = 'w-5 h-5',
  size = 20,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Whisk handle */}
    <rect x="9.5" y="2" width="5" height="5" rx="1.5" />
    <line x1="8" y1="7" x2="16" y2="7" />
    <path d="M7 8C7 10 9 12 9 14" />
    <path d="M17 8C17 10 15 12 15 14" />
    <line x1="12" y1="7" x2="12" y2="14" />
    {/* Whisk strings spread */}
    <path d="M5 21C5.5 17 8 14 9 14C10 14 11 17 11 21" />
    <path d="M19 21C18.5 17 16 14 15 14C14 14 13 17 13 21" />
    <path d="M8 21.5C9.5 22 14.5 22 16 21.5" />
    <line x1="12" y1="14" x2="12" y2="21" />
  </svg>
);

/**
 * Custom Matcha Bowl & Leaf Logo Mark
 */
export const MatchaLeafIcon: React.FC<{ className?: string; size?: number }> = ({
  className = 'w-5 h-5',
  size = 20,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);
