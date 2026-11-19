import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  Tag,
  MessageCircle,
  Heart,
  Plus,
  Utensils,
  CalendarDays,
  Megaphone,
  BellRing,
  CloudSun,
  X,
  Info
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import NewListingModal from '../components/NewListingModal';
import type { ListingDTO } from '../types';

interface OutletContextType {
  onOpenNewListing?: () => void;
}

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
  return new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' });
}

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const outletContext = useOutletContext<OutletContextType | null>();

  const [localModalOpen, setLocalModalOpen] = useState(false);
  const [announcementOpen, setAnnouncementOpen] = useState(false);

  const greeting = getGreeting(user?.fullName);

  const handleOpenNewListing = () => {
    if (outletContext?.onOpenNewListing) {
      outletContext.onOpenNewListing();
    } else {
      setLocalModalOpen(true);
    }
  };

  const handleListingCreated = (_listing: ListingDTO) => {
    setLocalModalOpen(false);
    navigate('/pazar');
  };

  const campusCards = [
    {
      icon: Utensils,
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-500/20 border-amber-400/30',
      title: 'Günün Yemekhane Menüsü',
      detail: 'Mercimek Çorbası, Fırın Tavuk, Pilav',
      badge: '4.4/5',
      badgeColor: 'text-amber-300',
      onClick: () => navigate('/radar'),
    },
    {
      icon: CalendarDays,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/20 border-blue-400/30',
      title: 'Bugün 3 Etkinlik Var',
      detail: 'DPÜ Yazılım Topluluğu Atölyesi • 17:30',
      badge: 'Yeni',
      badgeColor: 'text-blue-300',
      onClick: () => navigate('/topluluklar'),
    },
    {
      icon: Megaphone,
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-500/20 border-purple-400/30',
      title: 'Kampüs Duyuruları',
      detail: 'Merkez Kütüphane vize haftası 7/24 açık',
      badge: '1 Yeni',
      badgeColor: 'text-purple-300',
      onClick: () => setAnnouncementOpen(true),
    },
    {
      icon: BellRing,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/20 border-emerald-400/30',
      title: 'Güncel Dayanışma',
      detail: '12 Askıda Ücretsiz • 4 Yeni Kayıp İlanı',
      badge: 'Canlı',
      badgeColor: 'text-emerald-300',
      onClick: () => navigate('/pazar'),
    },
  ];

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* FULL-WIDTH DARK MIDNIGHT-NAVY HERO PORTAL CARD */}
      <div
        className="w-full max-w-6xl relative rounded-3xl overflow-hidden shadow-2xl border border-white/10"
        style={{
          backgroundColor: '#0B192C',
          backgroundImage:
            'radial-gradient(circle at 10% 90%, rgba(15, 118, 110, 0.22) 0%, transparent 45%), radial-gradient(circle at 90% 15%, rgba(30, 58, 138, 0.28) 0%, transparent 50%)',
        }}
      >
        {/* Geometric Seljuk star + grid texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.065]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='none' stroke='%23FFFFFF' stroke-width='0.75'%3E%3Cpath d='M40 8 L46 26 L64 20 L52 34 L72 40 L52 46 L64 60 L46 54 L40 72 L34 54 L16 60 L28 46 L8 40 L28 34 L16 20 L34 26 Z'/%3E%3Ccircle cx='40' cy='40' r='14'/%3E%3Ccircle cx='40' cy='40' r='2' fill='%23FFFFFF'/%3E%3Cpath d='M0 0 L80 80 M80 0 L0 80' stroke-width='0.3' stroke-dasharray='2 4'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px',
          }}
        />

        <div className="relative z-10 p-6 sm:p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* LEFT SIDE */}
          <div className="lg:col-span-7 flex flex-col justify-center">

            {/* Kütahya Weather & Date Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/15 border border-white/15 rounded-full text-white/90 text-xs font-medium mb-5 w-fit backdrop-blur-sm transition-colors cursor-default">
              <CloudSun className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="font-semibold text-amber-200">Kütahya</span>
              <span className="text-white/50">•</span>
              <span>{getWeatherLabel()}</span>
              <span className="text-white/40">•</span>
              <span className="text-white/60">{getTodayTurkish()}</span>
            </div>

            {/* Dynamic Greeting */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-2">
              {greeting}
            </h1>

            {/* Contextual DPÜ Headline & Subtitle */}
            <p className="text-xl sm:text-2xl font-bold text-white/90 tracking-tight mb-2">
              Kampüsün güvenli ikinci el pazarı
            </p>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed max-w-xl mb-6">
              Ders kitabı, yurt eşyası, ev arkadaşı ya da proje ekipmanı. DPÜ öğrencileriyle al, sat, takas et; teslimatı kampüste elden yap.
            </p>

            {/* 2x2 Campus Info Cards Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {campusCards.map((card) => {
                const Icon = card.icon;
                return (
                  <button
                    key={card.title}
                    type="button"
                    onClick={card.onClick}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-3.5 cursor-pointer transition-all text-left group"
                  >
                    <div className="flex items-start gap-2.5 mb-2">
                      <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${card.iconBg}`}>
                        <Icon className={`w-3.5 h-3.5 ${card.iconColor}`} />
                      </div>
                      <span className={`text-[10px] font-bold mt-1 ${card.badgeColor}`}>
                        {card.badge}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-white/90 leading-snug mb-1 group-hover:text-white transition-colors">
                      {card.title}
                    </p>
                    <p className="text-[11px] text-white/50 leading-snug line-clamp-2">
                      {card.detail}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT SIDE: Translucent Dark-Glass Summary Card (unchanged) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-sm bg-white/[0.06] backdrop-blur-md rounded-2xl border border-white/15 p-6 sm:p-7 shadow-2xl flex flex-col justify-between relative overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  <span className="text-xs font-semibold text-white/90">Kampüste şu an</span>
                </div>
                <span className="text-xs text-white/50 font-medium">Evliya Çelebi &amp; Germiyan</span>
              </div>

              {/* 3 Live Stat Rows */}
              <div className="space-y-3.5 my-2">
                {/* Row 1: Aktif İlanların */}
                <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0">
                    <Tag className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-white tabular-nums">2</span>
                      <span className="text-xs text-white/50">/ 17 Kampüs İlanı</span>
                    </div>
                    <p className="text-xs text-white/70 font-medium truncate">Aktif İlanların</p>
                  </div>
                </div>

                {/* Row 2: Okunmamış Mesaj */}
                <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-white tabular-nums">1</span>
                      <span className="text-xs text-emerald-400 font-medium">Yeni Yanıt</span>
                    </div>
                    <p className="text-xs text-white/70 font-medium truncate">Okunmamış Mesaj</p>
                  </div>
                </div>

                {/* Row 3: Favori & Takip */}
                <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0">
                    <Heart className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-white tabular-nums">4</span>
                      <span className="text-xs text-white/50">Kayıtlı İlan &amp; Kulüp</span>
                    </div>
                    <p className="text-xs text-white/70 font-medium truncate">Favori &amp; Takip</p>
                  </div>
                </div>
              </div>

              {/* Emerald Action Button */}
              <div className="pt-4 mt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleOpenNewListing}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#0F766E] hover:bg-[#115E59] active:scale-[0.99] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Yeni İlan Paylaş</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Announcement Detail Modal */}
      {announcementOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => setAnnouncementOpen(false)}
        >
          <div
            className="bg-white rounded-2xl border border-[#E4E4E7] shadow-2xl w-full max-w-md p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setAnnouncementOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#71717A] hover:text-[#18181B] hover:bg-[#F4F4F5] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center shrink-0">
                <Megaphone className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#18181B]">Kampüs Duyuruları</h2>
                <p className="text-xs text-[#71717A]">Kütahya Dumlupınar Üniversitesi</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                {
                  title: 'Merkez Kütüphane Vize Haftası',
                  detail: 'Vize haftası boyunca Merkez Kütüphane 7/24 hizmet verecektir. Öğrenci Kimliği ile giriş zorunludur.',
                  date: '19 Kasım 2026',
                  badge: 'Yeni',
                  badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
                },
                {
                  title: 'Mühendislik Kantini Yenileme',
                  detail: 'Mühendislik kantini 22-24 Kasım tarihleri arasında tadilat nedeniyle kapalı olacaktır.',
                  date: '18 Kasım 2026',
                  badge: 'Bilgi',
                  badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
                },
                {
                  title: 'Öğrenci Topluluğu Proje Hibeleri',
                  detail: 'TÜBİTAK 2209-A başvuruları 30 Kasım\'a kadar alınmaktadır. Danışman hocayla görüşün.',
                  date: '15 Kasım 2026',
                  badge: 'Fırsat',
                  badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                },
              ].map((ann) => (
                <div key={ann.title} className="p-3.5 bg-[#F7F7F5] border border-[#E4E4E7] rounded-xl">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <p className="text-sm font-semibold text-[#18181B] leading-snug">{ann.title}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${ann.badgeColor}`}>
                      {ann.badge}
                    </span>
                  </div>
                  <p className="text-xs text-[#71717A] leading-relaxed mb-1.5">{ann.detail}</p>
                  <p className="text-[10px] text-[#A1A1AA]">{ann.date}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setAnnouncementOpen(false)}
              className="mt-4 w-full py-2.5 bg-[#18181B] hover:bg-[#27272A] text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Tamam
            </button>
          </div>
        </div>
      )}

      {/* Fallback Local New Listing Modal */}
      <NewListingModal
        open={localModalOpen}
        onClose={() => setLocalModalOpen(false)}
        onCreated={handleListingCreated}
      />
    </div>
  );
}
