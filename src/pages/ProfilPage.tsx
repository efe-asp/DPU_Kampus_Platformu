import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BadgeCheck, Calendar, MapPin, Tag, QrCode, CheckCircle2, Package, Heart, Clock } from 'lucide-react';
import type { ListingDTO, EventDTO } from '../types';

export default function ProfilPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'listings' | 'favorites' | 'events' | 'handovers'>('listings');

  // Realistic mock profile listings
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
      {/* Profile Header Card */}
      <div className="bg-white border border-[#E4E4E7] rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#18181B] text-white flex items-center justify-center text-xl font-bold border border-[#E4E4E7] shadow-sm">
              {user?.fullName ? user.fullName.split(' ').map(n => n[0]).join('') : 'DPÜ'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold tracking-tight text-[#18181B]">
                  {user?.fullName || 'Efe Alsaç'}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#CCFBF1] text-[#0F766E] border border-[#99F6E4]">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  Doğrulanmış Öğrenci
                </span>
              </div>
              <p className="text-xs text-[#71717A] mt-0.5">{user?.email || 'efe.alsac@ogr.dpu.edu.tr'}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-[#71717A]">
                <span className="font-medium text-[#18181B]">{user?.faculty || 'Mühendislik Fakültesi'}</span>
                <span>·</span>
                <span>Kütahya Dumlupınar Üniversitesi</span>
              </div>
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

      {/* Tabs Navigation */}
      <div className="flex border-b border-[#E4E4E7] space-x-1 sm:space-x-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('listings')}
          className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'listings'
              ? 'border-[#18181B] text-[#18181B]'
              : 'border-transparent text-[#71717A] hover:text-[#18181B]'
          }`}
        >
          <Package className="w-4 h-4" />
          Aktif İlanlarım ({myListings.length})
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'favorites'
              ? 'border-[#18181B] text-[#18181B]'
              : 'border-transparent text-[#71717A] hover:text-[#18181B]'
          }`}
        >
          <Heart className="w-4 h-4" />
          Favorilerim ({myFavorites.length})
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'events'
              ? 'border-[#18181B] text-[#18181B]'
              : 'border-transparent text-[#71717A] hover:text-[#18181B]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Katıldığım Etkinlikler ({myEvents.length})
        </button>

        <button
          onClick={() => setActiveTab('handovers')}
          className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'handovers'
              ? 'border-[#18181B] text-[#18181B]'
              : 'border-transparent text-[#71717A] hover:text-[#18181B]'
          }`}
        >
          <QrCode className="w-4 h-4" />
          QR Teslimat Geçmişi ({completedHandovers.length})
        </button>
      </div>

      {/* Tab 1: Aktif İlanlarım */}
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
                    <span className="text-[10px] font-semibold text-[#0F766E] bg-[#CCFBF1] px-2 py-0.5 rounded-full">
                      Yayında
                    </span>
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

      {/* Tab 2: Favorilerim */}
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
                    <span className="text-[10px] font-semibold text-[#18181B] bg-[#F7F7F5] border border-[#E4E4E7] px-2 py-0.5 rounded-full">
                      {listing.category}
                    </span>
                    <span className="text-xs text-[#0F766E] font-medium">{listing.condition}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-[#18181B] truncate mt-1">{listing.title}</h3>
                  <p className="text-xs text-[#71717A] truncate mt-0.5">Satıcı: {listing.seller.fullName}</p>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E4E4E7]">
                  <span className="text-sm font-bold text-[#18181B] tabular-nums">
                    {listing.isFree ? (
                      <span className="text-[#0F766E]">Askıda Ücretsiz</span>
                    ) : (
                      `${listing.price.toLocaleString('tr-TR')} ₺`
                    )}
                  </span>
                  <span className="text-[11px] text-[#71717A] flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {listing.pickupPoint}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Katıldığım Etkinlikler */}
      {activeTab === 'events' && (
        <div className="space-y-3">
          {myEvents.map((event) => (
            <div key={event.id} className="bg-white border border-[#E4E4E7] rounded-xl p-5 hover:border-[#18181B] transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold tracking-wider text-[#0F766E] bg-[#CCFBF1] px-2 py-0.5 rounded-md border border-[#99F6E4]">
                      KATILIM ONAYLANDI
                    </span>
                    <span className="text-xs text-[#71717A]">{event.clubName}</span>
                  </div>
                  <h3 className="text-base font-semibold text-[#18181B]">{event.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#71717A]">
                    <span className="flex items-center gap-1 text-[#18181B] font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#71717A]" />
                      {new Date(event.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#0F766E]" />
                      {event.venue}
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

      {/* Tab 4: QR Teslimat Geçmişi */}
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
                    <td className="px-5 py-3.5 font-mono text-[11px] font-bold text-[#0F766E] tracking-wider tabular-nums">
                      {h.pin}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#0F766E] bg-[#CCFBF1] px-2 py-0.5 rounded-full border border-[#99F6E4]">
                        <CheckCircle2 className="w-3 h-3" />
                        {h.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
