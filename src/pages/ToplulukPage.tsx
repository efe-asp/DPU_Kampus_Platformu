import React, { useState, useEffect } from 'react';
import { Users, Calendar, MapPin, UsersRound } from 'lucide-react';
import { ApiService } from '../services/api';
import type { ClubDTO, EventDTO } from '../types';

function QuotaBar({ registered, total }: { registered: number; total: number }) {
  const pct = Math.min((registered / total) * 100, 100);
  const isFull = registered >= total;
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-[#71717A]" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {registered}/{total} Kontenjan
        </span>
        {isFull && (
          <span className="text-[10px] font-medium text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
            Dolu
          </span>
        )}
      </div>
      <div className="h-1.5 bg-[#F4F4F5] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${isFull ? 'bg-red-400' : 'bg-[#0F766E]'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function formatEventDate(iso: string) {
  const d = new Date(iso);
  return {
    day: d.getDate().toString().padStart(2, '0'),
    month: d.toLocaleDateString('tr-TR', { month: 'short' }).toUpperCase(),
    time: d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    full: d.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' }),
  };
}

export default function ToplulukPage() {
  const [clubs, setClubs] = useState<ClubDTO[]>([]);
  const [events, setEvents] = useState<EventDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [clubFilter, setClubFilter] = useState<'Tümü' | 'Takip Ettiklerim'>('Tümü');
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [registeringId, setRegisteringId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([ApiService.getClubs(), ApiService.getEvents()])
      .then(([c, e]) => { setClubs(c); setEvents(e); })
      .finally(() => setLoading(false));
  }, []);

  const handleToggleFollow = async (id: string) => {
    setTogglingId(id);
    try {
      const updated = await ApiService.toggleFollowClub(id);
      setClubs(prev => prev.map(c => c.id === id ? updated : c));
    } finally {
      setTogglingId(null);
    }
  };

  const handleRegister = async (id: string) => {
    setRegisteringId(id);
    try {
      const updated = await ApiService.registerEvent(id);
      setEvents(prev => prev.map(e => e.id === id ? updated : e));
    } finally {
      setRegisteringId(null);
    }
  };

  const filteredClubs = clubFilter === 'Takip Ettiklerim'
    ? clubs.filter(c => c.isFollowing)
    : clubs;

  return (
    <div className="p-6 max-w-6xl">
      {/* Page header */}
      <div className="mb-7">
        <h1 className="text-xl font-bold tracking-tight text-[#18181B]">Topluluklar & Etkinlikler</h1>
        <p className="text-sm text-[#71717A] mt-0.5">DPÜ öğrenci toplulukları ve yaklaşan kampüs etkinlikleri</p>
      </div>

      {/* CLUBS SECTION */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[#18181B] flex items-center gap-2">
            <UsersRound size={17} className="text-[#71717A]" />
            Öğrenci Toplulukları
          </h2>
          <div className="flex border border-[#E4E4E7] rounded-lg overflow-hidden">
            {(['Tümü', 'Takip Ettiklerim'] as const).map(f => (
              <button
                key={f}
                onClick={() => setClubFilter(f)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  clubFilter === f ? 'bg-[#18181B] text-white' : 'bg-white text-[#71717A] hover:bg-[#F7F7F5]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white border border-[#E4E4E7] rounded-xl p-5 animate-pulse">
                <div className="h-5 bg-[#F4F4F5] rounded w-3/4 mb-2" />
                <div className="h-3 bg-[#F4F4F5] rounded w-full mb-1" />
                <div className="h-3 bg-[#F4F4F5] rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filteredClubs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users size={36} className="text-[#E4E4E7] mb-3" />
            <p className="text-sm font-medium text-[#71717A]">Henüz takip ettiğiniz topluluk yok</p>
            <p className="text-xs text-[#A1A1AA] mt-1">Toplulukları keşfedin ve takip edin</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClubs.map(club => (
              <div key={club.id} className="bg-white border border-[#E4E4E7] rounded-xl p-5 hover:border-[#A1A1AA] transition-colors">
                {/* Club header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F7F7F5] border border-[#E4E4E7] flex items-center justify-center shrink-0">
                    <img src="/images/clubs/club-placeholder.svg" alt={club.name} className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-[#18181B] leading-tight line-clamp-2">{club.name}</h3>
                    <p className="text-xs text-[#71717A] mt-0.5" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {club.memberCount.toLocaleString('tr-TR')} üye
                    </p>
                  </div>
                </div>

                <p className="text-xs text-[#71717A] leading-relaxed mb-3 line-clamp-2">{club.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {club.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 text-[10px] font-medium bg-[#F7F7F5] text-[#71717A] border border-[#E4E4E7] rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Follow button */}
                <button
                  onClick={() => handleToggleFollow(club.id)}
                  disabled={togglingId === club.id}
                  className={`w-full py-2 text-xs font-medium rounded-lg border transition-colors ${
                    club.isFollowing
                      ? 'bg-[#F0FDF4] text-[#0F766E] border-[#BBF7D0] hover:bg-[#DCFCE7]'
                      : 'bg-[#18181B] text-white border-[#18181B] hover:bg-[#27272A]'
                  } disabled:opacity-60`}
                >
                  {togglingId === club.id
                    ? 'Güncelleniyor...'
                    : club.isFollowing
                    ? 'Takip Ediliyor'
                    : 'Takip Et'}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* EVENTS SECTION */}
      <section>
        <h2 className="text-base font-semibold text-[#18181B] flex items-center gap-2 mb-4">
          <Calendar size={17} className="text-[#71717A]" />
          Yaklaşan Etkinlikler
        </h2>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white border border-[#E4E4E7] rounded-xl p-5 animate-pulse">
                <div className="h-5 bg-[#F4F4F5] rounded w-1/2 mb-2" />
                <div className="h-3 bg-[#F4F4F5] rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {events.map(event => {
              const { day, month, time } = formatEventDate(event.date);
              const isFull = event.registeredCount >= event.totalQuota;
              return (
                <div key={event.id} className="bg-white border border-[#E4E4E7] rounded-xl p-5 hover:border-[#A1A1AA] transition-colors">
                  <div className="flex items-start gap-4">
                    {/* Date badge */}
                    <div className="shrink-0 w-14 text-center">
                      <div className="bg-[#18181B] text-white rounded-t-lg py-1 px-2">
                        <span className="text-[10px] font-bold tracking-wider">{month}</span>
                      </div>
                      <div className="bg-[#F7F7F5] border border-t-0 border-[#E4E4E7] rounded-b-lg py-1.5">
                        <span className="text-xl font-bold text-[#18181B] leading-none" style={{ fontVariantNumeric: 'tabular-nums' }}>{day}</span>
                      </div>
                      <p className="text-[10px] text-[#71717A] mt-1" style={{ fontVariantNumeric: 'tabular-nums' }}>{time}</p>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-xs text-[#71717A] mb-1">{event.clubName}</p>
                          <h3 className="text-sm font-semibold text-[#18181B] leading-snug mb-2">{event.title}</h3>
                          <p className="text-xs text-[#71717A] leading-relaxed mb-3 line-clamp-2">{event.description}</p>
                          <div className="flex items-center gap-1.5 text-xs text-[#71717A] mb-2">
                            <MapPin size={12} />
                            <span className="truncate">{event.venue}</span>
                          </div>
                          <QuotaBar registered={event.registeredCount} total={event.totalQuota} />
                        </div>

                        {/* Register button */}
                        <button
                          onClick={() => handleRegister(event.id)}
                          disabled={registeringId === event.id || (isFull && !event.isRegistered)}
                          className={`shrink-0 px-4 py-2 text-xs font-medium rounded-lg border transition-colors ${
                            event.isRegistered
                              ? 'bg-[#F0FDF4] text-[#0F766E] border-[#BBF7D0] hover:bg-[#DCFCE7]'
                              : isFull
                              ? 'bg-[#F7F7F5] text-[#A1A1AA] border-[#E4E4E7] cursor-not-allowed'
                              : 'bg-[#18181B] text-white border-[#18181B] hover:bg-[#27272A]'
                          } disabled:opacity-60`}
                        >
                          {registeringId === event.id
                            ? '...'
                            : event.isRegistered
                            ? 'Katılıyorum'
                            : isFull
                            ? 'Kontenjan Dolu'
                            : 'Katıl'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
