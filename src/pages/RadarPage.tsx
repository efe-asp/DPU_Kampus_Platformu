import React, { useState, useEffect } from 'react';
import { Utensils, Car, ThumbsUp, Meh, ThumbsDown, MapPin, Clock, Users, MessageCircle, CheckCircle2 } from 'lucide-react';
import { ApiService } from '../services/api';
import type { CafeteriaMenuDTO, RideshareDTO } from '../types';
import ChatDrawer from '../components/ChatDrawer';

export default function RadarPage() {
  const [menu, setMenu] = useState<CafeteriaMenuDTO | null>(null);
  const [rides, setRides] = useState<RideshareDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [bookedRides, setBookedRides] = useState<Set<string>>(new Set());
  const [selectedDriverChat, setSelectedDriverChat] = useState<RideshareDTO | null>(null);

  useEffect(() => {
    Promise.all([ApiService.getCafeteriaMenu(), ApiService.getRideshares()])
      .then(([menuData, ridesData]) => {
        setMenu(menuData);
        setRides(ridesData);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleVote = async (voteType: 'liked' | 'okay' | 'disliked') => {
    if (voting) return;
    setVoting(true);
    try {
      const updated = await ApiService.voteCafeteria(voteType, menu?.id, menu);
      setMenu(updated);
    } finally {
      setVoting(false);
    }
  };

  const handleBookSeat = (rideId: string) => {
    setBookedRides(prev => new Set(prev).add(rideId));
    setRides(prev => prev.map(r => {
      if (r.id === rideId && r.bookedSeats < r.totalSeats) {
        return { ...r, bookedSeats: r.bookedSeats + 1 };
      }
      return r;
    }));
  };

  // Satisfaction calculations
  const totalVotes = menu
    ? menu.satisfactionVotes.liked + menu.satisfactionVotes.okay + menu.satisfactionVotes.disliked
    : 0;

  const likedPercent = menu?.percentages
    ? menu.percentages.liked
    : totalVotes > 0 && menu
      ? Math.round((menu.satisfactionVotes.liked / totalVotes) * 100)
      : 0;
  const okayPercent = menu?.percentages
    ? menu.percentages.okay
    : totalVotes > 0 && menu
      ? Math.round((menu.satisfactionVotes.okay / totalVotes) * 100)
      : 0;
  const dislikedPercent = menu?.percentages
    ? menu.percentages.disliked
    : totalVotes > 0 && menu
      ? 100 - likedPercent - okayPercent
      : 0;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#18181B]">Kampüs Radar</h1>
        <p className="text-sm text-[#71717A] mt-0.5">
          Günün DPÜ yemekhane menüsü öğrenci oylaması ve hafta sonu şehirlerarası yol arkadaşı ağı
        </p>
      </div>

      {/* TOP SECTION: Günün DPÜ Yemekhane Menüsü */}
      <section className="bg-white border border-[#E4E4E7] rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#E4E4E7]">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#F7F7F5] border border-[#E4E4E7] flex items-center justify-center shrink-0">
              <Utensils className="w-5 h-5 text-[#0F766E]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-[#18181B]">Günün DPÜ Yemekhane Menüsü</h2>
                <span className="text-[10px] font-semibold text-[#0F766E] bg-[#CCFBF1] px-2 py-0.5 rounded-full border border-[#99F6E4]">
                  Merkezi Yemekhane
                </span>
                {menu?.isFallback && (
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    Son Yayınlanan Menü
                  </span>
                )}
              </div>
              <p className="text-xs text-[#71717A] mt-0.5">Evliya Çelebi Yerleşkesi · 4 Kap Tabldot</p>
            </div>
          </div>

          <div className="text-right sm:text-right">
            <span className="text-xs font-semibold text-[#18181B] block">Öğle &amp; Akşam Servisi</span>
            <span className="text-[11px] text-[#71717A] tabular-nums">Toplam {totalVotes} Öğrenci Oyladı</span>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-6 bg-[#F4F4F5] rounded w-1/2" />
            <div className="h-20 bg-[#F4F4F5] rounded" />
          </div>
        ) : menu ? (
          <div className="space-y-6">
            {/* 4 Courses Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {menu.courses.map((course, idx) => {
                const labels = ['1. Başlangıç', '2. Ana Yemek', '3. Yan Lezzet', '4. Tamamlayıcı'];
                return (
                  <div key={idx} className="bg-[#F7F7F5] border border-[#E4E4E7] rounded-xl p-4">
                    <span className="text-[10px] font-semibold text-[#71717A] uppercase tracking-wider block mb-1">
                      {labels[idx]}
                    </span>
                    <span className="text-sm font-bold text-[#18181B] block">
                      {course}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Satisfaction Voting & Percentage Bar */}
            <div className="pt-4 border-t border-[#E4E4E7]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                <span className="text-xs font-semibold text-[#18181B]">
                  Bugünkü Menüyü Nasıl Buldunuz?
                </span>

                {/* Vote Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleVote('liked')}
                    disabled={voting}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      menu.userVote === 'liked'
                        ? 'bg-[#CCFBF1] text-[#0F766E] border-[#99F6E4]'
                        : 'bg-white text-[#71717A] border-[#E4E4E7] hover:border-[#18181B] hover:text-[#18181B]'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Beğendim</span>
                    <span className="tabular-nums font-bold">({menu.satisfactionVotes.liked})</span>
                  </button>

                  <button
                    onClick={() => handleVote('okay')}
                    disabled={voting}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      menu.userVote === 'okay'
                        ? 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]'
                        : 'bg-white text-[#71717A] border-[#E4E4E7] hover:border-[#18181B] hover:text-[#18181B]'
                    }`}
                  >
                    <Meh className="w-3.5 h-3.5" />
                    <span>İdare Eder</span>
                    <span className="tabular-nums font-bold">({menu.satisfactionVotes.okay})</span>
                  </button>

                  <button
                    onClick={() => handleVote('disliked')}
                    disabled={voting}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      menu.userVote === 'disliked'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-white text-[#71717A] border-[#E4E4E7] hover:border-[#18181B] hover:text-[#18181B]'
                    }`}
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                    <span>Beğenmedim</span>
                    <span className="tabular-nums font-bold">({menu.satisfactionVotes.disliked})</span>
                  </button>
                </div>
              </div>

              {/* Live Satisfaction Percentage Progress Bar */}
              <div className="w-full bg-[#E4E4E7] h-2.5 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${likedPercent}%` }}
                  className="bg-[#0F766E] h-full transition-all duration-500"
                  title={`Beğenenler: %${likedPercent}`}
                />
                <div
                  style={{ width: `${okayPercent}%` }}
                  className="bg-[#D97706] h-full transition-all duration-500"
                  title={`İdare Eder: %${okayPercent}`}
                />
                <div
                  style={{ width: `${dislikedPercent}%` }}
                  className="bg-[#DC2626] h-full transition-all duration-500"
                  title={`Beğenmeyenler: %${dislikedPercent}`}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#71717A] mt-2 tabular-nums">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#0F766E]" />
                  % {likedPercent} Beğendi
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#D97706]" />
                  % {okayPercent} İdare Eder
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
                  % {dislikedPercent} Beğenmedi
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </section>

      {/* BOTTOM SECTION: Hafta Sonu Yol Arkadaşı */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#18181B] flex items-center gap-2">
              <Car className="w-4 h-4 text-[#0F766E]" />
              Hafta Sonu Yol Arkadaşı
            </h2>
            <p className="text-xs text-[#71717A] mt-0.5">
              Kütahya çıkışlı öğrenci dayanışması ve ortak yakıt paylaşımlı güvenli yolculuklar
            </p>
          </div>
          <span className="text-xs font-semibold text-[#18181B] tabular-nums bg-white border border-[#E4E4E7] px-3 py-1.5 rounded-lg">
            {rides.length} Güzergâh Aktif
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
            <div className="h-40 bg-white border border-[#E4E4E7] rounded-xl" />
            <div className="h-40 bg-white border border-[#E4E4E7] rounded-xl" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rides.map((ride) => {
              const emptySeats = ride.totalSeats - ride.bookedSeats;
              const isFull = emptySeats <= 0;
              const isBooked = bookedRides.has(ride.id);

              return (
                <div
                  key={ride.id}
                  className="bg-white border border-[#E4E4E7] rounded-2xl p-5 hover:border-[#18181B] transition-colors flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Route + Fuel Share */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-[#18181B]">{ride.from}</span>
                          <span className="text-xs text-[#71717A]">→</span>
                          <span className="text-base font-bold text-[#0F766E]">{ride.to}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#71717A] mt-1">
                          <Clock className="w-3.5 h-3.5 text-[#71717A]" />
                          <span>
                            {new Date(ride.departureTime).toLocaleDateString('tr-TR', { weekday: 'short', day: 'numeric', month: 'short' })} ·{' '}
                            {new Date(ride.departureTime).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-lg font-bold text-[#18181B] tabular-nums block">
                          {ride.fuelShare} ₺
                        </span>
                        <span className="text-[10px] text-[#71717A]">Yakıt Katkısı</span>
                      </div>
                    </div>

                    {/* Pickup Point & Details */}
                    <div className="bg-[#F7F7F5] border border-[#E4E4E7] rounded-xl p-3 mb-4 space-y-1.5 text-xs">
                      <div className="flex items-center gap-2 text-[#18181B]">
                        <MapPin className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
                        <span className="font-semibold">Buluşma Noktası:</span>
                        <span className="text-[#71717A]">{ride.pickupPoint}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#18181B]">
                        <Users className="w-3.5 h-3.5 text-[#71717A] shrink-0" />
                        <span className="font-semibold">Kapasite Durumu:</span>
                        <span className={`font-semibold tabular-nums ${isFull ? 'text-red-600' : 'text-[#0F766E]'}`}>
                          {isFull ? 'Tüm Koltuklar Dolu' : `${emptySeats}/${ride.totalSeats} Koltuk Boş`}
                        </span>
                      </div>
                    </div>

                    {/* Driver info */}
                    <div className="flex items-center gap-2.5 text-xs text-[#71717A] mb-4">
                      <div className="w-6 h-6 rounded-full bg-[#18181B] text-white text-[10px] font-bold flex items-center justify-center">
                        {ride.driver.fullName.charAt(0)}
                      </div>
                      <span className="text-[#18181B] font-medium">{ride.driver.fullName}</span>
                      <span>·</span>
                      <span>{ride.driver.faculty}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-[#E4E4E7]">
                    <button
                      onClick={() => setSelectedDriverChat(ride)}
                      className="flex-1 py-2 px-3 border border-[#E4E4E7] hover:border-[#18181B] text-xs font-semibold text-[#18181B] rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Mesaj At
                    </button>

                    <button
                      onClick={() => handleBookSeat(ride.id)}
                      disabled={isFull || isBooked}
                      className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                        isBooked
                          ? 'bg-[#CCFBF1] text-[#0F766E] border border-[#99F6E4] cursor-default'
                          : isFull
                          ? 'bg-[#F4F4F5] text-[#A1A1AA] border border-[#E4E4E7] cursor-not-allowed'
                          : 'bg-[#18181B] hover:bg-[#27272A] text-white shadow-sm'
                      }`}
                    >
                      {isBooked ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Koltuk Ayrıldı
                        </>
                      ) : isFull ? (
                        'Kontenjan Dolu'
                      ) : (
                        'Koltuk Ayırt'
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Driver Chat Drawer */}
      {selectedDriverChat && (
        <ChatDrawer
          open={!!selectedDriverChat}
          onClose={() => setSelectedDriverChat(null)}
          participant={selectedDriverChat.driver}
        />
      )}
    </div>
  );
}
