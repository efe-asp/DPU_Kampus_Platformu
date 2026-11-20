import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, X, ShieldAlert } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function GuestLockModal() {
  const { guestLockModalOpen, setGuestLockModalOpen, setAuthInitialTab } = useAuth();
  const navigate = useNavigate();

  if (!guestLockModalOpen) return null;

  const handleClose = () => {
    setGuestLockModalOpen(false);
  };

  const handleGoToAuth = (tab: 'login' | 'register') => {
    setGuestLockModalOpen(false);
    setAuthInitialTab(tab);
    navigate('/auth');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_24px_60px_rgba(15,23,42,0.18)] max-w-md w-full p-6 sm:p-7 text-center relative overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative background accent */}
        <div
          className="absolute -top-16 -left-16 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-16 -right-16 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"
          aria-hidden="true"
        />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Kapat"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Circular /images/dpu-logo.png badge with Lock icon */}
        <div className="relative inline-block mx-auto mt-1 mb-4">
          <div className="w-16 h-16 rounded-full p-1 bg-white ring-4 ring-emerald-50 shadow-md flex items-center justify-center">
            <img
              src="/images/dpu-logo.png"
              alt="DPÜ Logo"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#0F172A] text-white flex items-center justify-center shadow-md ring-2 ring-white">
            <Lock className="w-3.5 h-3.5 text-amber-300" />
          </div>
        </div>

        {/* Modal Header */}
        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight mb-2">
          DPÜ Öğrenci Doğrulaması Gerekli
        </h3>

        {/* Turkish Text */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto mb-6">
          Kampüs Pazarı, Forum, Ders Notları ve diğer modüllere erişmek için{' '}
          <span className="font-semibold text-emerald-700 font-mono">@ogr.dpu.edu.tr</span> uzantılı
          öğrenci hesabınızla giriş yapmalısınız.
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* 1. Giriş Yap */}
          <button
            type="button"
            onClick={() => handleGoToAuth('login')}
            className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-[13px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition-all cursor-pointer active:scale-[0.99]"
          >
            Giriş Yap
          </button>

          {/* 2. Kayıt Ol */}
          <button
            type="button"
            onClick={() => handleGoToAuth('register')}
            className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-[13px] font-semibold text-white bg-[#0F172A] hover:bg-emerald-700 transition-all shadow-xs cursor-pointer active:scale-[0.99]"
          >
            Kayıt Ol
          </button>
        </div>
      </div>
    </div>
  );
}
