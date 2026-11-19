import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Tag, ChevronDown, Plus, ArrowLeft, QrCode, MessageCircle, Package, CheckCircle } from 'lucide-react';
import { ApiService } from '../services/api';
import type { ListingDTO, Category, PickupPoint } from '../types';
import ChatDrawer from '../components/ChatDrawer';
import QRModal from '../components/QRModal';
import NewListingModal from '../components/NewListingModal';

const CATEGORIES: string[] = ['Tümü', 'Ders Kitabı & Not', 'Elektronik', 'Ev & Yurt', 'Kırtasiye', 'Askıda Ücretsiz'];
const PICKUP_POINTS: string[] = ['Tümü', 'Merkez Kütüphane', 'Bedesten Çarşı', 'Mühendislik Kantini', 'KTB MYO', 'KYK Yurtlar'];
const SORT_OPTIONS: string[] = ['En Yeni', 'Fiyat: Düşükten Yükseğe', 'Fiyat: Yüksekten Düşüğe'];

const conditionColors: Record<string, string> = {
  'Sıfır Gibi': 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]',
  'Az Kullanılmış': 'bg-[#FEF9C3] text-[#854D0E] border-[#FEF08A]',
  'İyi': 'bg-[#F0F9FF] text-[#0369A1] border-[#BAE6FD]',
  'Orta': 'bg-[#F7F7F5] text-[#71717A] border-[#E4E4E7]',
};

// ── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ listing, onClick }: { listing: ListingDTO; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-white border border-[#E4E4E7] rounded-xl overflow-hidden text-left hover:border-[#A1A1AA] hover:shadow-sm transition-all group"
    >
      {/* Image area */}
      <div className="relative bg-[#F7F7F5] aspect-square flex items-center justify-center p-4 overflow-hidden">
        <img
          src={listing.imageUrl}
          alt={listing.title}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
        {listing.isFree && (
          <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold text-white bg-[#0F766E] rounded-full">
            Askıda Ücretsiz
          </span>
        )}
        {!listing.isFree && (
          <span className={`absolute top-2 right-2 px-1.5 py-0.5 text-[10px] font-medium border rounded-full ${conditionColors[listing.condition] || conditionColors['Orta']}`}>
            {listing.condition}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <p className="text-sm font-semibold text-[#18181B] leading-snug line-clamp-2 mb-1.5">
          {listing.title}
        </p>
        <p className="text-base font-bold text-[#18181B] mb-2" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {listing.isFree ? (
            <span className="text-[#0F766E]">Ücretsiz</span>
          ) : (
            `${listing.price.toLocaleString('tr-TR')} ₺`
          )}
        </p>
        <div className="flex items-center gap-1.5 text-[#71717A]">
          <MapPin size={11} />
          <span className="text-[11px] truncate">{listing.pickupPoint}</span>
        </div>
        <div className="flex items-center gap-1.5 mt-1 text-[#71717A]">
          <span className="text-[11px] truncate">{listing.seller.fullName} · {listing.seller.faculty.split(' ')[0]}</span>
        </div>
      </div>
    </button>
  );
}

// ── Listing Detail View ───────────────────────────────────────────────────────
function ListingDetail({
  listing,
  onBack,
  onChat,
  onQR,
}: {
  listing: ListingDTO;
  onBack: () => void;
  onChat: () => void;
  onQR: () => void;
}) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-[#71717A] hover:text-[#18181B] mb-6 transition-colors">
        <ArrowLeft size={16} />
        Pazara Dön
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Image + Description */}
        <div>
          <div className="bg-[#F7F7F5] rounded-xl border border-[#E4E4E7] aspect-square flex items-center justify-center p-10 mb-6">
            <img src={listing.imageUrl} alt={listing.title} className="w-full h-full object-contain" />
          </div>

          <div className="bg-white border border-[#E4E4E7] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-[#18181B] mb-2">Açıklama</h3>
            <p className="text-sm text-[#71717A] leading-relaxed">{listing.description}</p>
          </div>
        </div>

        {/* Right: Details + Action */}
        <div>
          <div className="mb-2 flex items-center gap-2 flex-wrap">
            {listing.isFree ? (
              <span className="px-2 py-1 text-xs font-bold text-white bg-[#0F766E] rounded-full">Askıda Ücretsiz</span>
            ) : (
              <span className={`px-2 py-1 text-xs font-medium border rounded-full ${conditionColors[listing.condition] || conditionColors['Orta']}`}>
                {listing.condition}
              </span>
            )}
            <span className="text-xs text-[#71717A] flex items-center gap-1">
              <Tag size={11} />
              {listing.category}
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[#18181B] mb-2 leading-tight">{listing.title}</h1>
          <p className="text-3xl font-bold text-[#18181B] mb-6" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {listing.isFree ? <span className="text-[#0F766E]">Ücretsiz</span> : `${listing.price.toLocaleString('tr-TR')} ₺`}
          </p>

          {/* Pickup info */}
          <div className="flex items-center gap-2 text-sm text-[#71717A] mb-6 p-3 bg-[#F7F7F5] rounded-lg border border-[#E4E4E7]">
            <MapPin size={14} className="text-[#0F766E] shrink-0" />
            <span>Teslim Noktası: <strong className="text-[#18181B]">{listing.pickupPoint}</strong></span>
          </div>

          {/* Seller card */}
          <div className="bg-white border border-[#E4E4E7] rounded-xl p-4 mb-5">
            <p className="text-xs font-medium text-[#71717A] mb-2.5">Satıcı</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#18181B] flex items-center justify-center text-white text-sm font-semibold shrink-0">
                {listing.seller.fullName.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#18181B]">{listing.seller.fullName}</p>
                <p className="text-xs text-[#71717A]">{listing.seller.faculty}</p>
              </div>
              <div className="ml-auto">
                <span className="flex items-center gap-1 text-[10px] font-medium text-[#0F766E] bg-[#CCFBF1] px-2 py-1 rounded-full">
                  <CheckCircle size={10} />
                  Doğrulanmış
                </span>
              </div>
            </div>
          </div>

          {/* Action box */}
          <div className="bg-white border border-[#E4E4E7] rounded-xl p-4 space-y-3 sticky top-20">
            <button
              onClick={onChat}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#18181B] text-white text-sm font-medium rounded-lg hover:bg-[#27272A] transition-colors"
            >
              <MessageCircle size={16} />
              Satıcıya Mesaj At
            </button>
            <button
              onClick={onQR}
              className="w-full flex items-center justify-center gap-2 py-3 border border-[#E4E4E7] text-[#18181B] text-sm font-medium rounded-lg hover:bg-[#F7F7F5] transition-colors"
            >
              <QrCode size={16} />
              QR ile Teslim Al / Onayla
            </button>
            <p className="text-center text-[11px] text-[#A1A1AA]">
              Teslimat QR kodu oluşturulacak ve satıcıya iletilecek
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PazarPage() {
  const [listings, setListings] = useState<ListingDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Tümü');
  const [activePickup, setActivePickup] = useState('');
  const [activeSort, setActiveSort] = useState('En Yeni');
  const [selectedListing, setSelectedListing] = useState<ListingDTO | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [newListingOpen, setNewListingOpen] = useState(false);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ApiService.getListings(
        activeCategory === 'Tümü' ? undefined : activeCategory,
        activePickup && activePickup !== 'Tümü' ? activePickup : undefined,
        activeSort !== 'En Yeni' ? activeSort : undefined,
      );
      setListings(data);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, activePickup, activeSort]);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  if (selectedListing) {
    return (
      <>
        <ListingDetail
          listing={selectedListing}
          onBack={() => setSelectedListing(null)}
          onChat={() => setChatOpen(true)}
          onQR={() => setQrOpen(true)}
        />
        <ChatDrawer
          open={chatOpen}
          onClose={() => setChatOpen(false)}
          participant={selectedListing.seller}
          listing={selectedListing}
        />
        <QRModal
          open={qrOpen}
          onClose={() => setQrOpen(false)}
          listing={selectedListing}
        />
      </>
    );
  }

  return (
    <div className="p-6">
      {/* Page header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#18181B]">Kampüs Pazarı</h1>
          <p className="text-sm text-[#71717A] mt-0.5">İkinci el eşya ve askıda ücretsiz paylaşımlar</p>
        </div>
        <button
          onClick={() => setNewListingOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#18181B] text-white text-sm font-medium rounded-lg hover:bg-[#27272A] transition-colors"
        >
          <Plus size={15} />
          Yeni Paylaşım
        </button>
      </div>

      {/* Category pills */}
      <div className="flex items-center gap-2 flex-wrap mb-4">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-colors whitespace-nowrap ${
              activeCategory === cat
                ? cat === 'Askıda Ücretsiz'
                  ? 'bg-[#0F766E] text-white border-[#0F766E]'
                  : 'bg-[#18181B] text-white border-[#18181B]'
                : 'bg-white text-[#71717A] border-[#E4E4E7] hover:border-[#A1A1AA] hover:text-[#18181B]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filters row */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative">
          <select
            value={activePickup}
            onChange={e => setActivePickup(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 text-sm bg-white border border-[#E4E4E7] rounded-lg text-[#18181B] focus:outline-none focus:ring-1 focus:ring-[#18181B] cursor-pointer"
          >
            <option value="">Teslim Noktası</option>
            {PICKUP_POINTS.slice(1).map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71717A] pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={activeSort}
            onChange={e => setActiveSort(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 text-sm bg-white border border-[#E4E4E7] rounded-lg text-[#18181B] focus:outline-none focus:ring-1 focus:ring-[#18181B] cursor-pointer"
          >
            {SORT_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71717A] pointer-events-none" />
        </div>

        <span className="text-sm text-[#71717A]" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {listings.length} ilan
        </span>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white border border-[#E4E4E7] rounded-xl overflow-hidden animate-pulse">
              <div className="bg-[#F4F4F5] aspect-square" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-[#F4F4F5] rounded w-3/4" />
                <div className="h-4 bg-[#F4F4F5] rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package size={40} className="text-[#E4E4E7] mb-3" />
          <p className="text-sm font-medium text-[#71717A]">Bu kategoride ilan bulunamadı</p>
          <p className="text-xs text-[#A1A1AA] mt-1">Filtrelerinizi değiştirin veya yeni bir ilan paylaşın</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {listings.map(listing => (
            <ProductCard
              key={listing.id}
              listing={listing}
              onClick={() => setSelectedListing(listing)}
            />
          ))}
        </div>
      )}

      <NewListingModal
        open={newListingOpen}
        onClose={() => setNewListingOpen(false)}
        onCreated={(listing) => {
          setListings(prev => [listing, ...prev]);
          setNewListingOpen(false);
        }}
      />
    </div>
  );
}
