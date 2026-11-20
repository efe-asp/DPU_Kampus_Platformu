import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Megaphone,
  CloudSun,
  X,
  Calendar,
  Info,
  Utensils,
  GraduationCap,
  Heart,
  MessageCircle,
  Eye,
  Users,
  Check,
  ChevronRight,
  Sparkles,
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

interface Announcement {
  id: string;
  title: string;
  summary: string;
  detail: string;
  date: string;
  icon: typeof Info;
  iconBg: string;
  iconColor: string;
}

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Üniversite 2026-2027 Akademik Takvimi Yayınlandı',
    summary: 'Yeni akademik takvim hakkında detaylı bilgi için tıklayınız.',
    detail:
      'Kütahya Dumlupınar Üniversitesi Senatosu tarafından onaylanan 2026-2027 Eğitim-Öğretim Yılı Akademik Takvimi resmi web sitesinde ve öğrenci bilgi sisteminde (OBS) ilan edilmiştir. Güz ve bahar dönemi kayıt yenileme, ders ekle-bırak, vize, final ve bütünleme sınav tarihleri belirlenmiştir.',
    date: '20 Kasım',
    icon: Info,
    iconBg: 'bg-blue-50 text-blue-600 border border-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    id: 'ann-2',
    title: 'Vize Takvimi Açıklandı',
    summary: '2025-2026 Güz Dönemi vize tarihleri duyurulmuştur.',
    detail:
      '2025-2026 Güz Yarıyılı Ara Sınav (Vize) programları tüm fakülte, yüksekokul ve meslek yüksekokullarında panolarda ve bölüm web sitelerinde ilan edilmiştir. Öğrencilerimizin sınav salonlarını ve saatlerini önceden kontrol etmeleri ve geçerli öğrenci kimlik kartlarını yanlarında bulundurmaları önemle rica olunur.',
    date: '19 Kasım',
    icon: Calendar,
    iconBg: 'bg-purple-50 text-purple-600 border border-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    id: 'ann-3',
    title: 'Yemekhane Çalışma Saatlerinde Değişiklik',
    summary: 'Hafta sonu yemekhane saatleri güncellenmiştir.',
    detail:
      'Evliya Çelebi ve Germiyan yerleşkelerindeki merkez yemekhanelerimizin hafta sonu öğle ve akşam yemeği servis saatleri vize haftası boyunca uzatılmıştır. Öğle yemeği servisi 11:30 - 14:00, akşam yemeği servisi 16:30 - 19:30 saatleri arasında kesintisiz olarak devam edecektir.',
    date: '18 Kasım',
    icon: Utensils,
    iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    iconColor: 'text-emerald-600',
  },
  {
    id: 'ann-4',
    title: 'Burs Başvuruları Başladı',
    summary: 'Detaylı bilgi için resmi duyuruyu inceleyiniz.',
    detail:
      'DPÜ Rektörlüğü Sağlık Kültür ve Spor Daire Başkanlığı tarafından ihtiyaç sahibi ve başarılı öğrencilere yönelik yemek bursu ve kısmi zamanlı çalışma başvuruları başlamıştır. Başvurular Öğrenci Bilgi Sistemi (OBS) üzerinden elektronik ortamda 30 Kasım tarihine kadar kabul edilecektir.',
    date: '17 Kasım',
    icon: GraduationCap,
    iconBg: 'bg-amber-50 text-amber-600 border border-amber-100',
    iconColor: 'text-amber-600',
  },
];

interface TrendingPost {
  id: string;
  authorName: string;
  authorInitial: string;
  faculty: string;
  timeAgo: string;
  topic: string;
  content: string;
  likeCount: number;
  hasLiked: boolean;
  commentCount: number;
  viewCount: number;
}

const INITIAL_TRENDING_POSTS: TrendingPost[] = [
  {
    id: 'fp1',
    authorName: 'Mert Kaya',
    authorInitial: 'M',
    faculty: 'Mühendislik Fakültesi',
    timeAgo: '1 saat önce',
    topic: '#VizeFinal',
    content:
      'Diferansiyel Denklemler vizesi için Salih hocanın 2024 ve 2025 çıkmış soru çözümlerini Merkez Kütüphanede toplandık. Katılmak isteyen varsa 2. kat B bloktayız, notları da getirdik.',
    likeCount: 42,
    hasLiked: false,
    commentCount: 14,
    viewCount: 318,
  },
  {
    id: 'fp2',
    authorName: 'Zeynep Demir',
    authorInitial: 'Z',
    faculty: 'İİBF',
    timeAgo: '3 saat önce',
    topic: '#Yemekhane',
    content:
      'Bedesten yemekhanesindeki bugünkü fırın tavuk, mercimek çorbası ve revani menüsü gerçekten harikaydı. Sıra saat 12:20 civarında biraz uzundu ama turnikeler çok seri aktı.',
    likeCount: 38,
    hasLiked: true,
    commentCount: 8,
    viewCount: 264,
  },
  {
    id: 'fp3',
    authorName: 'Anonim Mühendislik Öğrencisi',
    authorInitial: 'A',
    faculty: 'Mühendislik Fakültesi',
    timeAgo: '5 saat önce',
    topic: '#KütahyaUlaşım',
    content:
      'Evliya Çelebi kampüsünden Zafer Meydanı ve Vazo yönüne giden 7 numaralı belediye otobüsünün 17:30 kalkış saati 17:20 olarak güncellenmiş. Durakta soğukta beklemeyin diye yazıyorum.',
    likeCount: 56,
    hasLiked: false,
    commentCount: 19,
    viewCount: 512,
  },
];

interface UpcomingEvent {
  id: string;
  title: string;
  dateTime: string;
  clubName: string;
  quota: string;
  isRegistered: boolean;
}

const INITIAL_EVENTS: UpcomingEvent[] = [
  {
    id: 'ev1',
    title: 'DPÜ Yazılım Topluluğu Atölyesi',
    dateTime: '20 Kasım • Saat 17:30',
    clubName: 'DPÜ Yazılım',
    quota: '38/50 Kontenjan',
    isRegistered: false,
  },
  {
    id: 'ev2',
    title: 'Siber Güvenlik Zirvesi',
    dateTime: '25 Kasım • Saat 14:00',
    clubName: 'Siber Güvenlik Kulübü',
    quota: '29/30 Kontenjan',
    isRegistered: true,
  },
  {
    id: 'ev3',
    title: 'DPÜ Kariyer & Staj Buluşması',
    dateTime: '28 Kasım • Saat 10:00',
    clubName: 'Girişimcilik Topluluğu',
    quota: '72/100 Kontenjan',
    isRegistered: false,
  },
];

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [activeAnnouncement, setActiveAnnouncement] = useState<Announcement | null>(null);
  const [trendingPosts, setTrendingPosts] = useState<TrendingPost[]>(INITIAL_TRENDING_POSTS);
  const [events, setEvents] = useState<UpcomingEvent[]>(INITIAL_EVENTS);

  const greeting = getGreeting(user?.fullName);

  // Toggle Post Like
  const handleToggleLike = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    setTrendingPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextLiked = !p.hasLiked;
          return {
            ...p,
            hasLiked: nextLiked,
            likeCount: nextLiked ? p.likeCount + 1 : Math.max(0, p.likeCount - 1),
          };
        }
        return p;
      })
    );
  };

  // Toggle Event Registration
  const handleToggleEvent = (e: React.MouseEvent, eventId: string) => {
    e.stopPropagation();
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id === eventId) {
          return {
            ...ev,
            isRegistered: !ev.isRegistered,
          };
        }
        return ev;
      })
    );
  };

  const handleOpenAnnouncement = (item?: Announcement) => {
    setActiveAnnouncement(item || null);
    setAnnouncementModalOpen(true);
  };

  return (
    <div className="w-full space-y-6 pt-1 pb-10 font-sans">
      {/* ── TOP ROW: COMPACT DARK GREETING CARD (4 COLS) + SEPARATE WHITE DUYURULAR CARD (8 COLS) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch pt-2 sm:pt-4">
        {/* ── LEFT CARD (lg:col-span-4): COMPACT DARK GREETING CARD ── */}
        <div
          className="lg:col-span-4 rounded-2xl p-6 flex flex-col justify-center relative overflow-hidden shadow-xl border border-white/10"
          style={{
            backgroundColor: '#091526',
            backgroundImage:
              'radial-gradient(circle at 10% 90%, rgba(15, 118, 110, 0.25) 0%, transparent 50%), radial-gradient(circle at 90% 15%, rgba(30, 58, 138, 0.32) 0%, transparent 55%)',
          }}
        >
          {/* Subtle geometric Seljuk star / diamond grid texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.06]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='none' stroke='%23FFFFFF' stroke-width='0.75'%3E%3Cpath d='M40 8 L46 26 L64 20 L52 34 L72 40 L52 46 L64 60 L46 54 L40 72 L34 54 L16 60 L28 46 L8 40 L28 34 L16 20 L34 26 Z'/%3E%3Ccircle cx='40' cy='40' r='14'/%3E%3Ccircle cx='40' cy='40' r='2' fill='%23FFFFFF'/%3E%3Cpath d='M0 0 L80 80 M80 0 L0 80' stroke-width='0.3' stroke-dasharray='2 4'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '80px 80px',
            }}
          />

          <div className="relative z-10">
            {/* 1. Kütahya Hava Durumu & Tarih Pill */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-3 py-1 text-xs text-slate-200 w-fit backdrop-blur-sm cursor-default select-none">
              <CloudSun className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>Kütahya • {getWeatherLabel()} • {getTodayTurkish()}</span>
            </div>

            {/* 2. Dynamic Time-of-Day Greeting */}
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-3 leading-tight">
              {greeting}
            </h1>
          </div>
        </div>

        {/* ── RIGHT CARD (lg:col-span-8): SEPARATE WHITE "DUYURULAR" CARD ── */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_12px_rgba(15,23,42,0.04)] p-5 flex flex-col justify-between">
          {/* Header Row */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200/70 flex items-center justify-center shrink-0">
                <Megaphone className="w-4 h-4 text-emerald-600" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Duyurular</h2>
            </div>
            <button
              type="button"
              onClick={() => handleOpenAnnouncement()}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer flex items-center gap-1 group"
            >
              <span>Tümünü Gör</span>
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </button>
          </div>

          {/* 4 Compact Announcement Rows */}
          <div className="divide-y divide-slate-100">
            {ANNOUNCEMENTS.map((ann) => {
              const Icon = ann.icon;
              return (
                <button
                  key={ann.id}
                  type="button"
                  onClick={() => handleOpenAnnouncement(ann)}
                  className="w-full py-2.5 px-1.5 flex items-center justify-between gap-3 text-left hover:bg-slate-50/80 rounded-xl transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${ann.iconBg}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-emerald-800 transition-colors truncate">
                        {ann.title}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate hidden sm:block">
                        {ann.summary}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400 shrink-0 tabular-nums">
                    {ann.date}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW: FORUMDA POPÜLER KONUŞMALAR (8 COLS) + YAKLAŞAN ETKİNLİKLER (4 COLS) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-6 items-start">
        {/* ── LEFT SECTION (lg:col-span-8): FORUMDA POPÜLER KONUŞMALAR ── */}
        <div className="lg:col-span-8 space-y-3.5">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Forumda Popüler Konuşmalar
            </h2>
            <button
              type="button"
              onClick={() => navigate('/forum')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer flex items-center gap-1 group"
            >
              <span>Foruma Git</span>
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </button>
          </div>

          {/* 3 Trending Discussion Cards */}
          <div className="space-y-3">
            {trendingPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => navigate('/forum')}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-[0_2px_10px_rgba(15,23,42,0.03)] hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group"
              >
                {/* Card Top: Author, Faculty, Time, Topic */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {post.authorInitial}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-slate-900">
                          {post.authorName}
                        </span>
                        <span className="text-[11px] text-slate-400">• {post.timeAgo}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium block">
                        {post.faculty}
                      </span>
                    </div>
                  </div>

                  {/* Topic Pill */}
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/80">
                    {post.topic}
                  </span>
                </div>

                {/* Card Body: 2-line preview */}
                <p className="text-sm text-slate-700 leading-relaxed my-2.5 line-clamp-2">
                  {post.content}
                </p>

                {/* Card Footer: Metrics & Action */}
                <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs text-slate-500 tabular-nums">
                  <div className="flex items-center gap-4 sm:gap-6">
                    {/* Like button */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleLike(e, post.id)}
                      className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                        post.hasLiked ? 'text-rose-600 font-bold' : 'hover:text-rose-600'
                      }`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          post.hasLiked ? 'fill-rose-500 text-rose-500' : ''
                        }`}
                      />
                      <span>{post.likeCount}</span>
                    </button>

                    {/* Comments */}
                    <div className="flex items-center gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{post.commentCount} yorum</span>
                    </div>

                    {/* Views */}
                    <div className="flex items-center gap-1.5 text-slate-400 hidden sm:flex">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{post.viewCount} görüntülenme</span>
                    </div>
                  </div>

                  <span className="font-semibold text-slate-700 group-hover:text-emerald-700 transition-colors flex items-center gap-1">
                    <span>Tartışmaya Katıl</span>
                    <span>→</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT SECTION (lg:col-span-4): YAKLAŞAN ETKİNLİKLER ── */}
        <div className="lg:col-span-4 space-y-3.5">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Yaklaşan Etkinlikler</h2>
            <button
              type="button"
              onClick={() => navigate('/topluluklar')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer flex items-center gap-1 group"
            >
              <span>Tümü</span>
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </button>
          </div>

          {/* 3 Compact Event Cards */}
          <div className="space-y-3">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-[0_2px_10px_rgba(15,23,42,0.03)] hover:border-slate-300 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {ev.title}
                    </h3>
                    <p className="text-[11px] text-emerald-700 font-medium mt-1">
                      {ev.dateTime}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-2">
                      <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{ev.clubName} • {ev.quota}</span>
                    </div>
                  </div>

                  {/* Interactive Join Button */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleEvent(e, ev.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer flex items-center gap-1 ${
                      ev.isRegistered
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs font-bold'
                        : 'bg-slate-900 hover:bg-emerald-800 text-white shadow-2xs'
                    }`}
                  >
                    {ev.isRegistered ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Katıldın</span>
                      </>
                    ) : (
                      <span>Katılıyorum</span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CAMPUS ANNOUNCEMENTS DETAIL MODAL ── */}
      {announcementModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
          onClick={() => setAnnouncementModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 relative max-h-[85vh] flex flex-col"
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
            <div className="flex items-center gap-3 mb-5 shrink-0">
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
            <div className="space-y-3 overflow-y-auto pr-1 flex-1">
              {activeAnnouncement ? (
                // Focused single announcement view
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Resmi Duyuru
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
                ANNOUNCEMENTS.map((ann) => {
                  const Icon = ann.icon;
                  return (
                    <div
                      key={ann.id}
                      className="p-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-xl transition-colors cursor-pointer"
                      onClick={() => setActiveAnnouncement(ann)}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${ann.iconBg}`}
                          >
                            <Icon className="w-3 h-3" />
                          </div>
                          <p className="text-sm font-bold text-slate-900 leading-snug">
                            {ann.title}
                          </p>
                        </div>
                        <span className="text-[11px] text-slate-400 shrink-0 font-medium">
                          {ann.date}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed mb-2 pl-8">
                        {ann.detail}
                      </p>
                      <div className="flex justify-end text-[11px] font-semibold text-emerald-700">
                        <span>Detaylı Oku →</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <button
              type="button"
              onClick={() => setAnnouncementModalOpen(false)}
              className="mt-5 w-full py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs shrink-0"
            >
              Tamam
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
