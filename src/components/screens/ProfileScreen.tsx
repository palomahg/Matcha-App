import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RatingStars } from '../common/RatingStars';
import {
  User,
  MapPin,
  Sparkles,
  Download,
  Trash2,
  LogOut,
  Shield,
  HelpCircle,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const {
    user,
    reviews,
    spots,
    saved,
    openAuthModal,
    logout,
    deleteUserData,
    exportUserData,
    openSpotDetail,
    openOnboarding,
    openRitualStory,
    language,
    setLanguage,
    t,
  } = useApp();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!user) {
    return (
      <div className="pb-24 pt-8 px-6 text-center max-w-sm mx-auto space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#E9DFCB] text-[#4F6340] flex items-center justify-center mx-auto">
          <User size={30} />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#4F6340]">
          {t.profileTitle}
        </h2>
        <p className="text-xs text-[#4F6340]/80 leading-relaxed">
          {t.loginPrompt}
        </p>
        <button
          type="button"
          id="profile-login-trigger-btn"
          onClick={openAuthModal}
          className="w-full py-3.5 bg-[#4F6340] hover:bg-[#3C4D30] text-[#FFFDF8] rounded-2xl font-bold text-xs shadow-md transition-colors"
        >
          {language === 'es' ? 'Iniciar sesión o registrarse' : 'Sign in or Sign up'}
        </button>
      </div>
    );
  }

  const userReviews = reviews.filter((r) => r.userId === user.id);
  const totalSaved = saved.favorites.length + saved.wantToTry.length;

  return (
    <div className="pb-24 pt-2 px-4 space-y-5">
      {/* Profile Header Card */}
      <div className="p-5 bg-[#FFFDF8] rounded-3xl border border-[#E9DFCB] shadow-xs space-y-4">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar}
            alt={user.fullName}
            className="w-16 h-16 rounded-full object-cover border-2 border-[#A8B98A] shadow-xs"
          />
          <div className="flex-1 min-w-0">
            <h2 className="font-serif text-xl font-bold text-[#4F6340] truncate">
              {user.fullName}
            </h2>
            <p className="text-xs text-[#4F6340]/70 font-medium">@{user.username}</p>
            <div className="flex items-center gap-1 text-xs text-[#4F6340]/80 mt-1">
              <MapPin size={12} className="text-[#A8B98A]" />
              <span>{user.city}</span>
            </div>
          </div>
        </div>

        {user.bio && (
          <p className="text-xs text-[#4F6340]/90 leading-relaxed font-normal bg-[#F6F1E7] p-2.5 rounded-2xl border border-[#E9DFCB]/60">
            {user.bio}
          </p>
        )}

        {/* Level badge */}
        <div className="flex items-center justify-between p-2.5 bg-[#A8B98A]/20 rounded-2xl border border-[#A8B98A]/40">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#D9B25F]" />
            <span className="text-xs font-bold text-[#4F6340]">
              {user.badge}
            </span>
          </div>
          <span className="text-[11px] font-semibold text-[#4F6340]/80">
            Nivel 2 (Experto)
          </span>
        </div>

        {/* User Stats counter */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#E9DFCB]">
          <div className="text-center p-2 bg-[#F6F1E7] rounded-xl">
            <span className="text-lg font-serif font-bold text-[#4F6340] block">
              {userReviews.length}
            </span>
            <span className="text-[11px] text-[#4F6340]/70 font-medium">
              {t.reviewsCount}
            </span>
          </div>

          <div className="text-center p-2 bg-[#F6F1E7] rounded-xl">
            <span className="text-lg font-serif font-bold text-[#4F6340] block">
              {totalSaved}
            </span>
            <span className="text-[11px] text-[#4F6340]/70 font-medium">
              {t.savedCount}
            </span>
          </div>
        </div>
      </div>

      {/* User's Published Reviews Section */}
      <div className="space-y-3">
        <h3 className="font-serif text-lg font-bold text-[#4F6340]">
          {t.myReviews} ({userReviews.length})
        </h3>

        {userReviews.length > 0 ? (
          <div className="space-y-2.5">
            {userReviews.map((rev) => {
              const spot = spots.find((s) => s.id === rev.spotId);
              return (
                <div
                  key={rev.id}
                  onClick={() => spot && openSpotDetail(spot.id)}
                  className="p-3.5 bg-[#FFFDF8] rounded-2xl border border-[#E9DFCB] hover:border-[#A8B98A] cursor-pointer transition-colors shadow-2xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-sm font-bold text-[#4F6340]">
                      {spot ? spot.name : 'Café'}
                    </span>
                    <RatingStars rating={rev.rating} size={13} />
                  </div>
                  <p className="text-xs text-[#4F6340]/80 line-clamp-2">
                    {rev.text}
                  </p>
                  <span className="text-[10px] text-[#4F6340]/50 block">
                    {new Date(rev.createdAt).toLocaleDateString(
                      language === 'es' ? 'es-ES' : 'en-US'
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 bg-[#FFFDF8] rounded-2xl border border-[#E9DFCB] text-center text-xs text-[#4F6340]/70">
            {language === 'es'
              ? 'Aún no has escrito ninguna reseña. ¡Visita un spot y comparte tu experiencia!'
              : 'You haven’t posted any reviews yet. Visit a spot and share your tasting notes!'}
          </div>
        )}
      </div>

      {/* Settings & Privacy (GDPR) */}
      <div className="p-5 bg-[#FFFDF8] rounded-3xl border border-[#E9DFCB] shadow-xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#4F6340]/70">
          {t.settingsTitle}
        </h3>

        {/* Change Language */}
        <div className="flex items-center justify-between py-2 border-b border-[#E9DFCB]/60 text-xs">
          <span className="font-medium text-[#4F6340]">{t.changeLanguage}</span>
          <div className="flex items-center gap-1 bg-[#F6F1E7] p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setLanguage('es')}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-colors ${
                language === 'es'
                  ? 'bg-[#4F6340] text-[#FFFDF8]'
                  : 'text-[#4F6340]/70'
              }`}
            >
              Español
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-colors ${
                language === 'en'
                  ? 'bg-[#4F6340] text-[#FFFDF8]'
                  : 'text-[#4F6340]/70'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Replay Onboarding Walkthrough */}
        <button
          type="button"
          onClick={openOnboarding}
          className="w-full flex items-center justify-between py-2 text-xs font-medium text-[#4F6340] hover:bg-[#F6F1E7] rounded-xl px-1 transition-colors"
        >
          <div className="flex items-center gap-2">
            <HelpCircle size={15} className="text-[#A8B98A]" />
            <span>{language === 'es' ? 'Ver guía y bienvenida' : 'Replay onboarding guide'}</span>
          </div>
          <ChevronRight size={14} className="text-[#4F6340]/50" />
        </button>

        {/* MatchApp Storytelling & Ritual Screen */}
        <button
          type="button"
          id="profile-ritual-story-btn"
          onClick={openRitualStory}
          className="w-full flex items-center justify-between py-2 text-xs font-medium text-[#4F6340] hover:bg-[#F6F1E7] rounded-xl px-1 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sparkles size={15} className="text-[#D9B25F]" />
            <span>
              {language === 'es'
                ? 'El Ritual del Matcha (Manifiesto & Historia)'
                : 'Matcha Ritual (Manifesto & Story)'}
            </span>
          </div>
          <ChevronRight size={14} className="text-[#4F6340]/50" />
        </button>

        {/* GDPR Notice */}
        <div className="flex items-start gap-2 p-2.5 bg-[#F6F1E7] rounded-xl border border-[#E9DFCB]/60">
          <Shield size={16} className="text-[#A8B98A] shrink-0 mt-0.5" />
          <p className="text-[11px] text-[#4F6340]/80 leading-relaxed font-normal">
            {t.gdprNotice}
          </p>
        </div>

        {/* Export Data Button */}
        <button
          type="button"
          id="export-data-btn"
          onClick={exportUserData}
          className="w-full py-2.5 px-3 rounded-xl bg-[#F6F1E7] hover:bg-[#E9DFCB] text-[#4F6340] text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-[#E9DFCB]"
        >
          <Download size={14} />
          <span>{t.exportData}</span>
        </button>

        {/* Logout */}
        <button
          type="button"
          id="logout-btn"
          onClick={logout}
          className="w-full py-2.5 px-3 rounded-xl bg-[#F6F1E7] hover:bg-[#E9DFCB] text-[#4F6340] text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-[#E9DFCB]"
        >
          <LogOut size={14} />
          <span>{t.logout}</span>
        </button>

        {/* Delete Account (GDPR) */}
        {!showDeleteConfirm ? (
          <button
            type="button"
            id="delete-account-btn"
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full py-2 text-xs text-rose-700 hover:text-rose-800 font-semibold flex items-center justify-center gap-1 transition-colors pt-2"
          >
            <Trash2 size={13} />
            <span>{t.deleteAccount}</span>
          </button>
        ) : (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl space-y-2 text-center animate-in fade-in">
            <p className="text-xs text-rose-800 font-semibold">
              {t.deleteAccountConfirm}
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 rounded-xl bg-[#FFFDF8] text-[#4F6340] text-xs font-semibold border border-[#E9DFCB]"
              >
                {language === 'es' ? 'Cancelar' : 'Cancel'}
              </button>
              <button
                type="button"
                id="confirm-delete-account-btn"
                onClick={deleteUserData}
                className="px-3 py-1.5 rounded-xl bg-rose-700 text-white text-xs font-semibold shadow-xs"
              >
                {language === 'es' ? 'Sí, eliminar todo' : 'Yes, delete all'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
