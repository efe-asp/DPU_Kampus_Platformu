import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  BadgeCheck, Calendar, MapPin, Tag, QrCode, CheckCircle2,
  Package, Heart, Clock, Pencil, X, Building2, User as UserIcon
} from 'lucide-react';
import type { ListingDTO, EventDTO } from '../types';

const FACULTIES = [
  'Mühendislik Fakültesi',
  'Kütahya Teknik Bilimler MYO',
  'Fen-Edebiyat Fakültesi',
  'İİBF',
  'Eğitim Fakültesi',
  'Güzel Sanatlar Fakültesi',
];

const CAMPUSES = [
  'Evliya Çelebi Kampüsü',
  'Germiyan Kampüsü',
];

export default function ProfilPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'listings' | 'favorites' | 'events' | 'handovers'>('listings');
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Editable profile state
  const [editFullName, setEditFullName] = useState(user?.fullName || 'Efe Alsaç');
  const [editFaculty, setEditFaculty] = useState(user?.faculty || 'Mühendislik Fakültesi');
  const [editCampus, setEditCampus] = useState('Evliya Çelebi Kampüsü');
  const [editBio, setEditBio] = useState('Bilgisayar Mühendisliği 3. sınıf öğrencisi. React, TypeScript ve ASP.NET Core ile ilgileniyorum.');

  // Saved profile state (displayed values)
  const [displayName, setDisplayName] = useState(user?.fullName || 'Efe Alsaç');
  const [displayFaculty, setDisplayFaculty] = useState(user?.faculty || 'Mühendislik Fakültesi');
  const [displayCampus, setDisplayCampus] = useState('Evliya Çelebi Kampüsü');
  const [displayBio, setDisplayBio] = useState('Bilgisayar Mühendisliği 3. sınıf öğrencisi. React, TypeScript ve ASP.NET Core ile ilgileniyorum.');

  const initials = displayName
    ? displayName.trim().split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'DPÜ';

  const handleOpenEdit = () => {
    setEditFullName(displayName);
    setEditFaculty(displayFaculty);
    setEditCampus(displayCampus);
    setEditBio(displayBio);
    setEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (editFullName.trim()) setDisplayName(editFullName.trim());
    setDisplayFaculty(editFaculty);
    setDisplayCampus(editCampus);
    setDisplayBio(editBio);
    setEditModalOpen(false);
  };

  const myListings: ListingDTO[] = [
    {
      id: 'l1',
      title: 'Casio FX-991ES Plus Hesap Makinesi',
      description: 'Mühendislik ve fen bilimleri sınavları için ideal. Kutusu ve kılıfı tam.',
      price: 350,
      condition: 'Az Kullanılmış',
      category: 'Elektronik',
      pickupPoint: 'Mühendislik Kantini',
      imageUrl: '/images/products/hesap-makinesi.svg',
      seller: user || { id: 'u1', fullName: 'Efe Alsaç', email: 'efe.alsac@ogr.dpu.edu.tr', faculty: 'Mühendislik Fakültesi', joinedAt: '2024-09-01', verifiedStudent: true },
      isFree: false,
      createdAt: '2026-11-15T10:00:00Z',
      isActive: true,
    },
    {
      id: 'l6',
      title: 'Mekanik Klavye (Cherry MX Brown)',
      description: 'Öğrenci bütçesine uygun harika klavye. TKL 80% dizayn, Türkçe Q düzeni. Kutusunda.',
      price: 750,
      condition: 'Sıfır Gibi',
      category: 'Elektronik',
      pickupPoint: 'Mühendislik Kantini',
      imageUrl: '/images/products/klavye.svg',
      seller: user || { id: 'u1', fullName: 'Efe Alsaç', email: 'efe.alsac@ogr.dpu.edu.tr', faculty: 'Mühendislik Fakültesi', joinedAt: '2024-09-01', verifiedStudent: true },
      isFree: false,
      createdAt: '2026-11-10T16:00:00Z',
      isActive: true,
    },
  ];

  const myFavorites: ListingDTO[] = [
    {
      id: 'l2',
      title: 'Bilgisayar Mühendisliği Ders Notları (1-3. Sınıf)',
      description: 'Veri yapıları, algoritmalar, işletim sistemleri derslerine ait el yazısı ve basılı notlar.',
      price: 0,
      condition: 'İyi',
      category: 'Ders Kitabı & Not',
      pickupPoint: 'Merkez Kütüphane',
      imageUrl: '/images/products/ders-notu.svg',
      seller: { id: 'u2', fullName: 'Zeynep Kaya', email: 'zeynep.kaya@ogr.dpu.edu.tr', faculty: 'Fen-Edebiyat Fakültesi', joinedAt: '2024-09-01', verifiedStudent: true },
      isFree: true,
      createdAt: '2026-11-14T09:00:00Z',
      isActive: true,
    },
    {
      id: 'l3',
      title: 'Nespresso Essenza Mini Kahve Makinesi',
      description: 'Yurtta kullanmak için aldım. Temiz, bakımlı.',
      price: 1200,
      condition: 'Sıfır Gibi',
      category: 'Ev & Yurt',
      pickupPoint: 'KYK Yurtlar',
      imageUrl: '/images/products/kahve-makinesi.svg',
      seller: { id: 'u3', fullName: 'Mert Demir', email: 'mert.demir@ogr.dpu.edu.tr', faculty: 'Kütahya Teknik Bilimler MYO', joinedAt: '2023-09-01', verifiedStudent: true },
      isFree: false,
      createdAt: '2026-11-13T11:00:00Z',
      isActive: true,
    },
  ];

  const myEvents: EventDTO[] = [
    {
      id: 'e1',
      clubId: 'c1',
      clubName: 'DPÜ Yazılım ve Bilişim Topluluğu',
      title: 'React ve TypeScript ile Modern Web Geliştirme',
      description: 'Sıfırdan modern bir React uygulaması inşa etme workshopu.',
      date: '2026-11-25T14:00:00Z',
      venue: 'Mühendislik Konferans Salonu - A201',
      totalQuota: 50,
      registeredCount: 38,
      isRegistered: true,
    },
    {
      id: 'e2',
      clubId: 'c2',
      clubName: 'Siber Güvenlik Topluluğu',
      title: 'Başlangıç Seviye CTF Çözüm Atölyesi',
      description: 'Capture The Flag yarışmalarına hazırlık atölyesi.',
      date: '2026-11-28T10:00:00Z',
      venue: 'Bilgisayar Lab 3 - Mühendislik Binası',
      totalQuota: 30,
      registeredCount: 29,
      isRegistered: true,
    },
  ];

  const completedHandovers = [
    {
      id: 'h1',
      itemTitle: 'Staedtler Teknik Çizim Seti',
      buyer: 'Burak Şahin (Eğitim Fak.)',
      role: 'Alıcı',
      date: '12 Kasım 2026',
      pin: '849201',
      location: 'Bedesten Çarşı',
      amount: '180 ₺',
      status: 'Tamamlandı',
    },
    {
      id: 'h2',
      itemTitle: 'Çalışma Masası Lambası (Doğal Işık)',
      buyer: 'Selin Yıldız (İİBF)',
      role: 'Bağış Alıcı',
      date: '14 Kasım 2026',
      pin: '392104',
      location: 'KYK Yurtlar Önü',
      amount: 'Askıda Ücretsiz',
      status: 'Teslim Alındı',
    },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* ── Profile Header Card ──────────────────────────────────────────────── */}
      <div className="bg-white border border-[#E4E4E7] rounded-2xl overflow-hidden shadow-sm">
        {/* Dark navy cover banner — fixed h-28, no overflow */}
        <div
          className="relative h-28 w-full"
          style={{
            background: 'linear-gradient(135deg, #0B192C 0%, #0F3460 50%, #115E59 100%)',
          }}
        >
          {/* Subtle pattern on cover */}
          <div
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
              backgroundSize: '40px 40px',
            }}
          />
          {/* "Profili Düzenle" button — top-right of cover */}
          <button
            onClick={handleOpenEdit}
            className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/20 rounded-lg text-white text-xs font-semibold transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Profili Düzenle</span>
          </button>
        </div>

        {/* White section below the cover */}
        <div className="px-6 pb-6">
          {/* Avatar floats up from white section into the cover overlap */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            {/* Avatar + name block */}
            <div className="flex items-end gap-4">
              {/* Circular avatar, floated upward with negative margin */}
              <div className="relative -mt-10 shrink-0">
                <div className="w-20 h-20 rounded-full bg-[#18181B] text-white flex items-center justify-center text-xl font-bold border-4 border-white shadow-md">
                  {initials}
                </div>
                {/* Verified green dot */}
                <span className="absolute bottom-1 right-1 w-4 h-4 bg-[#10B981] rounded-full border-2 border-white" title="Doğrulanmış Öğrenci" />
              </div>

              {/* Name & badges — entirely in the white area, below the cover */}
              <div className="pb-1 pt-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold tracking-tight text-[#18181B]">
                    {displayName}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#CCFBF1] text-[#0F766E] border border-[#99F6E4]">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    Doğrulanmış Öğrenci
                  </span>
                </div>
                <p className="text-xs text-[#71717A] mt-0.5">
                  {user?.email || 'efe.alsac@ogr.dpu.edu.tr'}
                </p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-[#71717A] flex-wrap">
                  <span className="font-medium text-[#18181B] flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-[#71717A]" />
                    {displayFaculty}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#0F766E]" />
                    {displayCampus}
                  </span>
                </div>
                {displayBio && (
                  <p className="text-xs text-[#71717A] mt-2 max-w-md leading-relaxed italic">
                    "{displayBio}"
                  </p>
                )}
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-6 border-t sm:border-t-0 sm:border-l border-[#E4E4E7] pt-4 sm:pt-0 sm:pl-6 w-full sm:w-auto justify-around sm:justify-start">
              <div className="text-center">
                <span className="block text-xl font-bold text-[#18181B] tabular-nums">{myListings.length}</span>
                <span className="text-[11px] text-[#71717A]">Aktif İlan</span>
              </div>
              <div className="text-center">
                <span className="block text-xl font-bold text-[#18181B] tabular-nums">{myEvents.length}</span>
                <span className="text-[11px] text-[#71717A]">Etkinlik</span>
              </div>
              <div className="text-center">
                <span className="block text-xl font-bold text-[#0F766E] tabular-nums">{completedHandovers.length}</span>
                <span className="text-[11px] text-[#71717A]">QR Teslim</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs Navigation ──────────────────────────────────────────────────── */}
      <div className="flex border-b border-[#E4E4E7] space-x-1 sm:space-x-4 overflow-x-auto">
        {[
          { key: 'listings', icon: Package, label: `Aktif İlanlarım (${myListings.length})` },
          { key: 'favorites', icon: Heart, label: `Favorilerim (${myFavorites.length})` },
          { key: 'events', icon: Calendar, label: `Katıldığım Etkinlikler (${myEvents.length})` },
          { key: 'handovers', icon: QrCode, label: `QR Teslimat Geçmişi (${completedHandovers.length})` },
        ].map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as typeof activeTab)}
            className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === key
                ? 'border-[#18181B] text-[#18181B]'
                : 'border-transparent text-[#71717A] hover:text-[#18181B]'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab 1: Aktif İlanlarım ───────────────────────────────────────────── */}
      {activeTab === 'listings' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {myListings.map((listing) => (
            <div key={listing.id} className="bg-white border border-[#E4E4E7] rounded-xl p-4 flex gap-4 hover:border-[#18181B] transition-colors">
              <div className="w-24 h-24 bg-[#F7F7F5] border border-[#E4E4E7] rounded-lg p-2 flex items-center justify-center shrink-0">
                <img src={listing.imageUrl} alt={listing.title} className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold text-[#0F766E] bg-[#CCFBF1] px-2 py-0.5 rounded-full">Yayında</span>
                    <span className="text-xs text-[#71717A]">{listing.condition}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-[#18181B] truncate mt-1">{listing.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#71717A] mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#0F766E]" />
                    <span className="truncate">{listing.pickupPoint}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E4E4E7]">
                  <span className="text-sm font-bold text-[#18181B] tabular-nums">
                    {listing.isFree ? 'Askıda Ücretsiz' : `${listing.price.toLocaleString('tr-TR')} ₺`}
                  </span>
                  <span className="text-[11px] text-[#71717A]">
                    {new Date(listing.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Tab 2: Favorilerim ──────────────────────────────────────────────── */}
      {activeTab === 'favorites' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {myFavorites.map((listing) => (
            <div key={listing.id} className="bg-white border border-[#E4E4E7] rounded-xl p-4 flex gap-4 hover:border-[#18181B] transition-colors">
              <div className="w-24 h-24 bg-[#F7F7F5] border border-[#E4E4E7] rounded-lg p-2 flex items-center justify-center shrink-0">
                <img src={listing.imageUrl} alt={listing.title} className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold text-[#18181B] bg-[#F7F7F5] border border-[#E4E4E7] px-2 py-0.5 rounded-full">{listing.category}</span>
                    <span className="text-xs text-[#0F766E] font-medium">{listing.condition}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-[#18181B] truncate mt-1">{listing.title}</h3>
                  <p className="text-xs text-[#71717A] truncate mt-0.5">Satıcı: {listing.seller.fullName}</p>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E4E4E7]">
                  <span className="text-sm font-bold text-[#18181B] tabular-nums">
                    {listing.isFree ? <span className="text-[#0F766E]">Askıda Ücretsiz</span> : `${listing.price.toLocaleString('tr-TR')} ₺`}
                  </span>
                  <span className="text-[11px] text-[#71717A] flex items-center gap-1">
                    <MapPin className="w-3 h-3" />{listing.pickupPoint}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Tab 3: Katıldığım Etkinlikler ───────────────────────────────────── */}
      {activeTab === 'events' && (
        <div className="space-y-3">
          {myEvents.map((event) => (
            <div key={event.id} className="bg-white border border-[#E4E4E7] rounded-xl p-5 hover:border-[#18181B] transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold tracking-wider text-[#0F766E] bg-[#CCFBF1] px-2 py-0.5 rounded-md border border-[#99F6E4]">KATILIM ONAYLANDI</span>
                    <span className="text-xs text-[#71717A]">{event.clubName}</span>
                  </div>
                  <h3 className="text-base font-semibold text-[#18181B]">{event.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#71717A]">
                    <span className="flex items-center gap-1 text-[#18181B] font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#71717A]" />
                      {new Date(event.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#0F766E]" />{event.venue}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:self-center">
                  <div className="px-3 py-1.5 bg-[#F7F7F5] border border-[#E4E4E7] rounded-lg text-xs font-medium text-[#18181B] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0F766E]" />
                    QR Bilet Hazır
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Tab 4: QR Teslimat Geçmişi ──────────────────────────────────────── */}
      {activeTab === 'handovers' && (
        <div className="bg-white border border-[#E4E4E7] rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F7F5] border-b border-[#E4E4E7] text-[#71717A] uppercase font-semibold">
                <tr>
                  <th className="px-5 py-3">Ürün</th>
                  <th className="px-5 py-3">Muhatap</th>
                  <th className="px-5 py-3">Nokta</th>
                  <th className="px-5 py-3">Tutar</th>
                  <th className="px-5 py-3">PIN / Kod</th>
                  <th className="px-5 py-3">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E4E7]">
                {completedHandovers.map((h) => (
                  <tr key={h.id} className="hover:bg-[#FAFAFA] transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-[#18181B]">
                      {h.itemTitle}
                      <span className="block text-[10px] font-normal text-[#71717A]">{h.date}</span>
                    </td>
                    <td className="px-5 py-3.5 text-[#18181B] font-medium">{h.buyer}</td>
                    <td className="px-5 py-3.5 text-[#71717A]">{h.location}</td>
                    <td className="px-5 py-3.5 font-bold text-[#18181B] tabular-nums">{h.amount}</td>
                    <td className="px-5 py-3.5 font-mono text-[11px] font-bold text-[#0F766E] tracking-wider tabular-nums">{h.pin}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#0F766E] bg-[#CCFBF1] px-2 py-0.5 rounded-full border border-[#99F6E4]">
                        <CheckCircle2 className="w-3 h-3" />{h.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Profili Düzenle Modal ────────────────────────────────────────────── */}
      {editModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
          onClick={() => setEditModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl border border-[#E4E4E7] shadow-2xl w-full max-w-md p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#71717A] hover:text-[#18181B] hover:bg-[#F4F4F5] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-[#18181B] flex items-center justify-center">
                <Pencil className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#18181B]">Profili Düzenle</h2>
                <p className="text-xs text-[#71717A]">Bilgilerini güncelleyebilirsin</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#18181B] mb-1.5">Ad Soyad</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
                  <input
                    type="text"
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                    placeholder="Adın ve soyadın"
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E4E4E7] rounded-xl text-sm text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#18181B] focus:ring-1 focus:ring-[#18181B] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#18181B] mb-1.5">Fakülte / MYO</label>
                <select
                  value={editFaculty}
                  onChange={(e) => setEditFaculty(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E4E4E7] rounded-xl text-sm text-[#18181B] focus:outline-none focus:border-[#18181B] focus:ring-1 focus:ring-[#18181B] transition-colors"
                >
                  {FACULTIES.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#18181B] mb-1.5">Yerleşke</label>
                <select
                  value={editCampus}
                  onChange={(e) => setEditCampus(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E4E4E7] rounded-xl text-sm text-[#18181B] focus:outline-none focus:border-[#18181B] focus:ring-1 focus:ring-[#18181B] transition-colors"
                >
                  {CAMPUSES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#18181B] mb-1.5">Biyografi</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Kendinden kısaca bahset..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E4E4E7] rounded-xl text-sm text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#18181B] focus:ring-1 focus:ring-[#18181B] transition-colors resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setEditModalOpen(false)}
                className="flex-1 py-2.5 border border-[#E4E4E7] text-sm font-semibold text-[#18181B] rounded-xl hover:bg-[#F7F7F5] transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 py-2.5 bg-[#18181B] hover:bg-[#27272A] text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
