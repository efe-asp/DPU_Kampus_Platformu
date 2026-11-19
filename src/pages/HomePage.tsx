import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  CheckCircle2,
  Search,
  MapPin,
  Tag,
  MessageCircle,
  Heart,
  Plus,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import NewListingModal from '../components/NewListingModal';
import type { ListingDTO } from '../types';

interface OutletContextType {
  onOpenNewListing?: () => void;
}

const QUICK_PICKUP_POINTS = [
  { label: 'Bedesten önü', value: 'Bedesten Çarşı' },
  { label: 'Merkez Kütüphane', value: 'Merkez Kütüphane' },
  { label: 'Mühendislik', value: 'Mühendislik Kantini' },
  { label: 'Kütahya Merkez', value: 'Kütahya Merkez' },
];

function getGreeting(fullName?: string): string {
  const firstName = fullName ? fullName.trim().split(' ')[0] : 'Öğrenci';
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return `Günaydın, ${firstName}`;
  } else if (hour >= 12 && hour < 17) {
    return `İyi öğlenler, ${firstName}`;
  } else if (hour >= 17 && hour < 22) {
    return `Hayırlı akşamlar, ${firstName}`;
  } else {
    return `İyi geceler, ${firstName}`;
  }
}

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const outletContext = useOutletContext<OutletContextType | null>();

  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [pickupPoint, setPickupPoint] = useState('');
  const [localModalOpen, setLocalModalOpen] = useState(false);

  const greeting = getGreeting(user?.fullName);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (category) params.set('category', category);
    if (pickupPoint) params.set('pickup', pickupPoint);
    navigate(`/pazar${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const handleQuickPickupClick = (target: string) => {
    navigate(`/pazar?pickup=${encodeURIComponent(target)}`);
  };

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
        {/* Subtle geometric Seljuk star and grid texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.065]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='none' stroke='%23FFFFFF' stroke-width='0.75'%3E%3Cpath d='M40 8 L46 26 L64 20 L52 34 L72 40 L52 46 L64 60 L46 54 L40 72 L34 54 L16 60 L28 46 L8 40 L28 34 L16 20 L34 26 Z'/%3E%3Ccircle cx='40' cy='40' r='14'/%3E%3Ccircle cx='40' cy='40' r='2' fill='%23FFFFFF'/%3E%3Cpath d='M0 0 L80 80 M80 0 L0 80' stroke-width='0.3' stroke-dasharray='2 4'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px',
          }}
        />

        <div className="relative z-10 p-6 sm:p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* LEFT SIDE: Dynamic Greeting, Subtitle, 3-Part Search Bar & Quick Pills */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Verification badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0F766E]/20 border border-[#34D399]/30 rounded-full text-[#34D399] text-xs font-semibold mb-5 w-fit backdrop-blur-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399] shrink-0" />
              <span>Yalnızca doğrulanmış @ogr.dpu.edu.tr öğrencileri</span>
            </div>

            {/* Dynamic Greeting */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-2">
              {greeting}
            </h1>

            {/* Contextual DPÜ Headline & Subtitle */}
            <p className="text-xl sm:text-2xl font-bold text-white/90 tracking-tight mb-3">
              Kampüsün güvenli ikinci el pazarı
            </p>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-xl mb-6">
              Ders kitabı, yurt eşyası, ev arkadaşı ya da proje ekipmanı. DPÜ öğrencileriyle al, sat, takas et; teslimatı kampüste elden yap.
            </p>

            {/* Integrated 3-Part Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white rounded-2xl sm:rounded-full p-2 sm:p-2.5 shadow-2xl border border-white/20 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 max-w-xl mb-4"
            >
              {/* Part 1: Ne arıyorsun? */}
              <div className="flex-1 px-3 sm:px-4 py-1 sm:border-r sm:border-[#E4E4E7]">
                <label className="block text-[10px] font-bold text-[#71717A] uppercase tracking-wider leading-none mb-1">
                  Ne arıyorsun?
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Kitap, laptop, ev arkadaşı..."
                  className="w-full text-xs sm:text-sm text-[#18181B] placeholder:text-[#A1A1AA] bg-transparent outline-none font-medium"
                />
              </div>

              {/* Part 2: Kategori */}
              <div className="px-3 sm:px-4 py-1 sm:border-r sm:border-[#E4E4E7] relative">
                <label className="block text-[10px] font-bold text-[#71717A] uppercase tracking-wider leading-none mb-1">
                  Kategori
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-xs sm:text-sm text-[#18181B] bg-transparent outline-none font-medium cursor-pointer pr-5 appearance-none"
                  >
                    <option value="">Tüm kategoriler</option>
                    <option value="Ders Kitabı & Not">Ders Kitabı & Not</option>
                    <option value="Elektronik">Elektronik</option>
                    <option value="Ev & Yurt">Ev & Yurt</option>
                    <option value="Kırtasiye">Kırtasiye</option>
                    <option value="Askıda Ücretsiz">Askıda Ücretsiz</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-[#71717A] absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Part 3: Teslim noktası */}
              <div className="px-3 sm:px-4 py-1 relative">
                <label className="block text-[10px] font-bold text-[#71717A] uppercase tracking-wider leading-none mb-1">
                  Teslim noktası
                </label>
                <div className="relative">
                  <select
                    value={pickupPoint}
                    onChange={(e) => setPickupPoint(e.target.value)}
                    className="w-full text-xs sm:text-sm text-[#18181B] bg-transparent outline-none font-medium cursor-pointer pr-5 appearance-none"
                  >
                    <option value="">Her nokta</option>
                    <option value="Bedesten Çarşı">Bedesten Çarşı</option>
                    <option value="Merkez Kütüphane">Merkez Kütüphane</option>
                    <option value="Mühendislik Kantini">Mühendislik Kantini</option>
                    <option value="KTB MYO">KTB MYO</option>
                    <option value="KYK Yurtlar">KYK Yurtlar</option>
                    <option value="Kütahya Merkez">Kütahya Merkez</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-[#71717A] absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Search button */}
              <button
                type="submit"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-full bg-[#0B192C] hover:bg-[#152840] active:scale-95 text-white flex items-center justify-center shrink-0 transition-all shadow-md self-center cursor-pointer"
                title="Pazarda Ara"
              >
                <Search className="w-4 h-4 text-white" />
              </button>
            </form>

            {/* Clickable Pickup Point Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-white/60 font-medium">Teslim noktasına göre:</span>
              {QUICK_PICKUP_POINTS.map((point) => (
                <button
                  key={point.label}
                  type="button"
                  onClick={() => handleQuickPickupClick(point.value)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-medium transition-all hover:scale-105 cursor-pointer backdrop-blur-sm"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#34D399]" />
                  <span>{point.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE: Translucent Dark-Glass Summary Card */}
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

      {/* Fallback Local New Listing Modal if needed */}
      <NewListingModal
        open={localModalOpen}
        onClose={() => setLocalModalOpen(false)}
        onCreated={handleListingCreated}
      />
    </div>
  );
}
