import React, { useState } from 'react';
import {
  Megaphone,
  CloudSun,
  X,
  Calendar,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function getGreeting(fullName?: string): string {
  const firstName = fullName ? fullName.trim().split(' ')[0] : 'Öğrenci';
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return `Günaydın, ${firstName}`;
  if (hour >= 12 && hour < 17) return `İyi öğlenler, ${firstName}`;
  if (hour >= 17 && hour < 22) return `Hayırlı akşamlar, ${firstName}`;
  return `İyi geceler, ${firstName}`;
}

function getWeatherLabel(): string {
  const hour = new Date().getHours();
  if (hour >= 7 && hour < 10) return '7°C Sabah Sisi';
  if (hour >= 10 && hour < 16) return '9°C Açık';
  if (hour >= 16 && hour < 20) return '7°C Bulutlu';
  return '5°C Soğuk';
}

function getTodayTurkish(): string {
  return new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' });
}

interface AnnouncementItem {
  id: string;
  badge: string;
  badgeColor: string;
  modalBadgeColor: string;
  title: string;
  detail: string;
  date: string;
}

const ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'ann-1',
    badge: 'Kütüphane',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
    modalBadgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    title: 'Merkez Kütüphane 7/24 Hizmet',
    detail: 'Merkez Kütüphane vize haftası boyunca 7/24 açık kalacaktır. Girişlerde öğrenci kimliği zorunludur.',
    date: '19 Kasım 2026',
  },
  {
    id: 'ann-2',
    badge: 'Ring & Ulaşım',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
    modalBadgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    title: 'Ek Akşam Ring Seferleri',
    detail: 'Evliya Çelebi – Merkez ring seferlerine ek akşam saatleri eklendi.',
    date: '18 Kasım 2026',
  },
  {
    id: 'ann-3',
    badge: 'Öğrenci İşleri',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
    modalBadgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    title: 'Topluluk Etkinlik Başvuruları',
    detail: 'Öğrenci toplulukları bahar dönemi etkinlik başvuruları başladı.',
    date: '17 Kasım 2026',
  },
  {
    id: 'ann-4',
    badge: 'Proje & Destek',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
    modalBadgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    title: 'TÜBİTAK 2209-A Başvuru Çağrısı',
    detail: 'Üniversite öğrencileri araştırma projeleri son başvuru tarihi 30 Kasım olarak duyurulmuştur.',
    date: '15 Kasım 2026',
  },
];

export default function HomePage() {
  const { user } = useAuth();
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [activeAnnouncement, setActiveAnnouncement] = useState<AnnouncementItem | null>(null);

  const greeting = getGreeting(user?.fullName);

  const handleOpenAnnouncement = (item?: AnnouncementItem) => {
    setActiveAnnouncement(item || null);
    setAnnouncementModalOpen(true);
  };

  return (
    <div className="w-full pt-2 pb-8 font-sans">
      {/* ── SLEEK COMPACT HERO BANNER (~1/4 HEIGHT OF PREVIOUS TALL CARD) ── */}
      <div
        className="w-full rounded-2xl px-6 py-5 sm:px-7 sm:py-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 relative overflow-hidden shadow-xl border border-white/10"
        style={{
          backgroundColor: '#091526',
          backgroundImage:
            'radial-gradient(circle at 8% 85%, rgba(15, 118, 110, 0.22) 0%, transparent 45%), radial-gradient(circle at 92% 15%, rgba(30, 58, 138, 0.28) 0%, transparent 50%)',
        }}
      >
        {/* Subtle geometric Seljuk star / diamond grid texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.055]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='none' stroke='%23FFFFFF' stroke-width='0.75'%3E%3Cpath d='M40 8 L46 26 L64 20 L52 34 L72 40 L52 46 L64 60 L46 54 L40 72 L34 54 L16 60 L28 46 L8 40 L28 34 L16 20 L34 26 Z'/%3E%3Ccircle cx='40' cy='40' r='14'/%3E%3Ccircle cx='40' cy='40' r='2' fill='%23FFFFFF'/%3E%3Cpath d='M0 0 L80 80 M80 0 L0 80' stroke-width='0.3' stroke-dasharray='2 4'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px',
          }}
        />

        {/* ── LEFT SIDE: WEATHER/DATE PILL + DYNAMIC TIME-OF-DAY GREETING ONLY ── */}
        <div className="relative z-10 flex flex-col justify-center">
          {/* 1. Kütahya Hava Durumu & Tarih Pill */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-3 py-1 text-xs text-slate-200 w-fit backdrop-blur-sm cursor-default select-none">
            <CloudSun className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>Kütahya • {getWeatherLabel()} • {getTodayTurkish()}</span>
          </div>

          {/* 2. Dynamic Time-of-Day Greeting */}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-2.5 leading-tight">
            {greeting}
          </h1>
        </div>

        {/* ── RIGHT SIDE: COMPACT TRANSLUCENT "DUYURULAR" BOX ── */}
        <div className="relative z-10 bg-white/5 border border-white/10 rounded-xl p-3.5 w-full lg:w-[440px] shrink-0 backdrop-blur-md">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
            <div className="flex items-center gap-1.5">
              <Megaphone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Kampüs Duyuruları
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleOpenAnnouncement()}
              className="text-xs font-medium text-white/70 hover:text-white transition-colors cursor-pointer flex items-center gap-1 group"
            >
              <span>Tümü</span>
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </button>
          </div>

          {/* 2-3 Compact Announcement Rows */}
          <div className="space-y-1.5">
            {ANNOUNCEMENTS.slice(0, 3).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleOpenAnnouncement(item)}
                className="w-full flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/10 transition-colors text-left group cursor-pointer"
                title={`${item.title} - Detayları gör`}
              >
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border shrink-0 ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
                <span className="text-xs text-white/90 group-hover:text-white truncate flex-1">
                  {item.detail}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CLEAN WORKSPACE BELOW BANNER ── */}
      {/* Kept uncluttered with natural spacing so the global Footer anchors cleanly at the bottom */}

      {/* ── CAMPUS ANNOUNCEMENTS DETAIL MODAL ── */}
      {announcementModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
          onClick={() => setAnnouncementModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setAnnouncementModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                <Megaphone className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {activeAnnouncement ? activeAnnouncement.title : 'Kampüs Duyuruları'}
                </h2>
                <p className="text-xs text-slate-500">Kütahya Dumlupınar Üniversitesi</p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {activeAnnouncement ? (
                // Focused single announcement view
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${activeAnnouncement.modalBadgeColor}`}
                    >
                      {activeAnnouncement.badge}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {activeAnnouncement.date}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">
                    {activeAnnouncement.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {activeAnnouncement.detail}
                  </p>
                  <div className="mt-4 pt-3 border-t border-slate-200/80 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setActiveAnnouncement(null)}
                      className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
                    >
                      ← Tüm Duyuruları Gör
                    </button>
                  </div>
                </div>
              ) : (
                // All announcements list
                ANNOUNCEMENTS.map((ann) => (
                  <div
                    key={ann.id}
                    className="p-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-xl transition-colors cursor-pointer"
                    onClick={() => setActiveAnnouncement(ann)}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <p className="text-sm font-bold text-slate-900 leading-snug">{ann.title}</p>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${ann.modalBadgeColor}`}
                      >
                        {ann.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-2 line-clamp-2">
                      {ann.detail}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{ann.date}</span>
                      <span className="font-semibold text-slate-700 group-hover:text-emerald-700">
                        Detay →
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              type="button"
              onClick={() => setAnnouncementModalOpen(false)}
              className="mt-5 w-full py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              Tamam
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
