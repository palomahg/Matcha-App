import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChasenIcon } from '../../design-system/theme';
import { X, Mail, Check, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthOpen, closeAuthModal, login, language, t } = useApp();
  const [email, setEmail] = useState('');

  if (!isAuthOpen) return null;

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      login('email', email.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-[#FFFDF8] w-full max-w-sm rounded-t-3xl sm:rounded-3xl border border-[#E9DFCB] shadow-2xl p-6 relative animate-in slide-in-from-bottom-5 duration-200">
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F6F1E7] text-[#4F6340] hover:bg-[#E9DFCB] flex items-center justify-center transition-colors"
          aria-label="Cerrar"
        >
          <X size={16} />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-full bg-[#A8B98A]/30 text-[#4F6340] border border-[#C9D3B0] flex items-center justify-center mx-auto">
            <ChasenIcon size={24} />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#4F6340]">
            MatchApp
          </h2>
          <p className="text-xs text-[#4F6340]/70 font-normal">
            {t.loginPrompt}
          </p>
        </div>

        {/* Social Auth Providers */}
        <div className="space-y-2.5">
          {/* Google */}
          <button
            type="button"
            id="login-google-btn"
            onClick={() => login('google')}
            className="w-full py-3 px-4 rounded-2xl bg-[#FFFDF8] border border-[#E9DFCB] hover:bg-[#F6F1E7] text-[#4F6340] font-semibold text-xs flex items-center justify-center gap-3 transition-colors shadow-2xs"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.1-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
              />
            </svg>
            <span>{t.loginWithGoogle}</span>
          </button>

          {/* Apple */}
          <button
            type="button"
            id="login-apple-btn"
            onClick={() => login('apple')}
            className="w-full py-3 px-4 rounded-2xl bg-[#4F6340] hover:bg-[#3C4D30] text-[#FFFDF8] font-semibold text-xs flex items-center justify-center gap-3 transition-colors shadow-2xs"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.87c.6-1.12.98-2.67.75-4.22-1.42.06-3.04.95-3.66 2.06-.55.98-.98 2.56-.74 4.08 1.57.12 3.05-.8 3.65-1.92z" />
            </svg>
            <span>{t.loginWithApple}</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E9DFCB]" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase">
            <span className="bg-[#FFFDF8] px-2 text-[#4F6340]/50 font-semibold">
              {language === 'es' ? 'o con correo' : 'or with email'}
            </span>
          </div>
        </div>

        {/* Email form */}
        <form onSubmit={handleEmailSubmit} className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu.correo@ejemplo.com"
            className="w-full px-3.5 py-2.5 bg-[#F6F1E7] border border-[#E9DFCB] rounded-2xl text-xs text-[#4F6340] outline-none focus:border-[#4F6340]"
          />
          <button
            type="submit"
            id="login-email-submit-btn"
            className="w-full py-3 rounded-2xl bg-[#A8B98A] hover:bg-[#97A978] text-[#FFFDF8] font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
          >
            <span>{t.loginWithEmail}</span>
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={closeAuthModal}
            className="text-xs text-[#4F6340]/70 hover:text-[#4F6340] underline font-medium"
          >
            {t.guestMode}
          </button>
        </div>
      </div>
    </div>
  );
};
