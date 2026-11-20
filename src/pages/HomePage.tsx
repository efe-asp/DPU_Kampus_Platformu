import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Users,
  Calendar,
  MessageSquareText,
  Search,
  Megaphone,
  MapPin,
  Clock,
  Sparkles,
  Gamepad2,
  Code2,
  Shield,
  MessageCircle,
  X,
  Check,
  Info,
  Laptop,
  CheckCircle2,
  CloudSun,
  Heart,
  Eye,
  Utensils,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// ─── Time-of-Day Greeting Helper (for Logged-in Student) ──────────────────────
function getGreeting(fullName?: string): string {
  const firstName = fullName ? fullName.trim().split(' ')[0] : 'Öğrenci';
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return `Günaydın, ${firstName}`;
  if (hour >= 12 && hour < 17) return `İyi öğlenler, ${firstName}`;
  if (hour >= 17 && hour < 22) return `Hayırlı akşamlar, ${firstName}`;
  return `İyi geceler, ${firstName}`;
}

// ─── Campus Announcements Data (Shared by both modes) ─────────────────────────
interface Announcement {
  id: string;
  title: string;
  summary: string;
  detail: string;
  date: string;
  dotColor: string;
  iconBg: string;
  icon: typeof Info;
}

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Üniversite 2026-2027 Akademik Takvimi Yayınlandı',
    summary: 'Yeni akademik takvim hakkında detaylı bilgi için tıklayınız.',
    detail:
      'Kütahya Dumlupınar Üniversitesi Senatosu tarafından onaylanan 2026-2027 Eğitim-Öğretim Yılı Akademik Takvimi resmi web sitesinde ve OBS sisteminde ilan edilmiştir. Güz ve bahar dönemi kayıt yenileme, ders ekle-bırak, vize ve final tarihleri belirlenmiştir.',
    date: '20 Kasım',
    dotColor: 'bg-sky-500',
    iconBg: 'bg-blue-50 text-blue-600 border border-blue-100',
    icon: Info,
  },
  {
    id: 'ann-2',
    title: 'Vize Takvimi Açıklandı',
    summary: '2025-2026 Güz Dönemi vize sınav programı duyurulmuştur.',
    detail:
      '2025-2026 Güz Yarıyılı Ara Sınav (Vize) programları tüm fakülte, yüksekokul ve meslek yüksekokullarında panolarda ve bölüm web sitelerinde ilan edilmiştir. Sınav salonlarınızı önceden kontrol etmeniz önemle rica olunur.',
    date: '19 Kasım',
    dotColor: 'bg-violet-500',
    iconBg: 'bg-purple-50 text-purple-600 border border-purple-100',
    icon: Calendar,
  },
  {
    id: 'ann-3',
    title: 'Yemekhane Çalışma Saatlerinde Değişiklik',
    summary: 'Hafta sonu yemekhane servis saatleri güncellenmiştir.',
    detail:
      'Evliya Çelebi ve Germiyan yerleşkelerindeki merkez yemekhanelerimizin hafta sonu öğle ve akşam yemeği servis saatleri vize haftası boyunca uzatılmıştır. Öğle yemeği 11:30 - 14:00, akşam yemeği 16:30 - 19:30 saatleri arasında kesintisiz devam edecektir.',
    date: '18 Kasım',
    dotColor: 'bg-rose-500',
    iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    icon: Utensils,
  },
  {
    id: 'ann-4',
    title: 'Burs Başvuruları Başladı',
    summary: 'Öğrenci yemek ve başarı bursu başvuruları açılmıştır.',
    detail:
      'DPÜ Rektörlüğü Sağlık Kültür ve Spor Daire Başkanlığı tarafından ihtiyaç sahibi ve başarılı öğrencilere yönelik yemek bursu başvuruları başlamıştır. Başvurular Öğrenci Bilgi Sistemi (OBS) üzerinden 30 Kasım tarihine kadar kabul edilecektir.',
    date: '17 Kasım',
    dotColor: 'bg-amber-500',
    iconBg: 'bg-amber-50 text-amber-600 border border-amber-100',
    icon: GraduationCap,
  },
];

// ─── Guest Mode: 4 Campus Photos for 2.5s Slideshow ───────────────────────────
const CAMPUS_SLIDES = [
  '/images/campus/campus-1.jpg',
  '/images/campus/campus-2.jpg',
  '/images/campus/campus-3.jpg',
  '/images/campus/campus-4.jpg',
];

// ─── Guest Mode: Featured Event Slider Data ───────────────────────────────────
interface GuestFeaturedEvent {
  id: string;
  title: string;
  day: string;
  month: string;
  weekday: string;
  venue: string;
  time: string;
  clubName: string;
  badgeAccent?: string;
}

const GUEST_FEATURED_EVENTS: GuestFeaturedEvent[] = [
  {
    id: 'fe-1',
    title: 'Teknoloji Zirvesi',
    day: '24',
    month: 'Kas',
    weekday: 'Pzt',
    venue: 'DPÜ Konferans Salonu',
    time: '14:00 - 17:00',
    clubName: 'Yazılım & İnovasyon Kulübü',
  },
  {
    id: 'fe-2',
    title: 'Gurbetçi Gençler Kütahya Maç İzleme',
    day: '29',
    month: 'Kas',
    weekday: 'Paz',
    venue: 'Bedesten Sosyal Tesisleri',
    time: '19:00 - 21:30',
    clubName: 'DPÜ Gurbetçi Gençler',
    badgeAccent: '#7A1C33',
  },
  {
    id: 'fe-3',
    title: 'React & TypeScript Atölyesi',
    day: '25',
    month: 'Kas',
    weekday: 'Sal',
    venue: 'Mühendislik A-201 Amfisi',
    time: '14:00 - 16:30',
    clubName: 'DPÜ Yazılım Topluluğu',
  },
  {
    id: 'fe-4',
    title: 'Başlangıç Seviye CTF Atölyesi',
    day: '28',
    month: 'Kas',
    weekday: 'Cum',
    venue: 'Bilgisayar Lab 3',
    time: '10:00 - 13:00',
    clubName: 'Siber Güvenlik Topluluğu',
  },
];

// ─── Logged-In Mode: Trending Forum Discussions Data ──────────────────────────
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

// ─── Logged-In Mode: Student Upcoming Events Data ─────────────────────────────
interface StudentEvent {
  id: string;
  title: string;
  dateTime: string;
  clubName: string;
  quota: string;
  isRegistered: boolean;
  isSpecial?: boolean;
}

const INITIAL_STUDENT_EVENTS: StudentEvent[] = [
  {
    id: 'sev-1',
    title: 'Gurbetçi Gençler Kütahya Maç İzleme Buluşması',
    dateTime: '29 Kasım • Saat 19:00',
    clubName: 'DPÜ Gurbetçi Gençler',
    quota: '61/80 Kontenjan',
    isRegistered: false,
    isSpecial: true,
  },
  {
    id: 'sev-2',
    title: 'React & TypeScript ile Modern Web Geliştirme',
    dateTime: '25 Kasım • Saat 14:00',
    clubName: 'DPÜ Yazılım Topluluğu',
    quota: '38/50 Kontenjan',
    isRegistered: false,
  },
  {
    id: 'sev-3',
    title: 'Başlangıç Seviye CTF Çözüm Atölyesi',
    dateTime: '28 Kasım • Saat 10:00',
    clubName: 'Siber Güvenlik Topluluğu',
    quota: '29/30 Kontenjan',
    isRegistered: true,
  },
];

export default function HomePage() {
  const { user, setGuestLockModalOpen, setAuthInitialTab } = useAuth();
  const navigate = useNavigate();

  // Guest Mode State
  const [bgSlide, setBgSlide] = useState(0);
  const [guestEventSlide, setGuestEventSlide] = useState(0);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);

  // Student Mode State
  const [trendingPosts, setTrendingPosts] = useState<TrendingPost[]>(INITIAL_TRENDING_POSTS);
  const [studentEvents, setStudentEvents] = useState<StudentEvent[]>(INITIAL_STUDENT_EVENTS);

  // Announcements Modal State (Shared)
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [activeAnnouncement, setActiveAnnouncement] = useState<Announcement | null>(null);

  // Auto-advance guest background photos every 2.5 seconds (only when guest)
  useEffect(() => {
    if (user) return;
    const timer = setInterval(() => {
      setBgSlide((prev) => (prev + 1) % CAMPUS_SLIDES.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [user]);

  // Auth Guard Helper
  const handleGuardNav = (path: string) => {
    if (!user) {
      setGuestLockModalOpen(true);
      return;
    }
    navigate(path);
  };

  // Primary CTA click
  const handlePrimaryCta = () => {
    if (!user) {
      setAuthInitialTab('register');
      navigate('/auth');
    } else {
      navigate('/pazar');
    }
  };

  // Toggle Post Like (Student mode)
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

  // Toggle Student Event Registration
  const handleToggleStudentEvent = (e: React.MouseEvent, eventId: string) => {
    e.stopPropagation();
    setStudentEvents((prev) =>
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

  const handleOpenAnnouncement = (ann?: Announcement) => {
    setActiveAnnouncement(ann || null);
    setAnnouncementModalOpen(true);
  };

  const currentGuestEvent = GUEST_FEATURED_EVENTS[guestEventSlide];

  return (
    <div className="w-full font-sans select-none pb-10">
      {/* ═══════════════════════════════════════════════════════════════════════
          MODE 1: LOGGED IN (`currentUser !== null`) — PERSONAL STUDENT DASHBOARD
      ═══════════════════════════════════════════════════════════════════════ */}
      {user ? (
        <div className="space-y-6 pt-1 sm:pt-3">
          {/* ── TOP ROW: COMPACT DARK GREETING CARD + SEPARATE WHITE DUYURULAR CARD ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* ── LEFT CARD (lg:col-span-4): COMPACT DARK GREETING CARD ── */}
            <div
              className="lg:col-span-4 rounded-2xl p-6 flex flex-col justify-center relative overflow-hidden shadow-xl border border-white/10 min-h-[170px]"
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
                  <span>Kütahya • 9°C Açık • 20 Kasım Cuma</span>
                </div>

                {/* 2. Dynamic Time-of-Day Greeting */}
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-3 leading-tight">
                  {getGreeting(user.fullName)}
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
                {ANNOUNCEMENTS.map((ann) => (
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
                        <ann.icon className="w-3.5 h-3.5" />
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
                ))}
              </div>
            </div>
          </div>

          {/* ── BOTTOM ROW: FORUMDA POPÜLER KONUŞMALAR + YAKLAŞAN ETKİNLİKLER ── */}
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
                {studentEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className={`bg-white rounded-2xl p-4 shadow-[0_2px_10px_rgba(15,23,42,0.03)] transition-all ${
                      ev.isSpecial
                        ? 'border border-[#7A1C33]/30 hover:border-[#7A1C33] shadow-[0_4px_16px_rgba(122,28,51,0.05)]'
                        : 'border border-slate-200/90 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                          {ev.title}
                        </h3>
                        <p
                          className={`text-[11px] font-medium mt-1 ${
                            ev.isSpecial ? 'text-[#7A1C33]' : 'text-emerald-700'
                          }`}
                        >
                          {ev.dateTime}
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-2">
                          <Calendar
                            className={`w-3 h-3 shrink-0 ${
                              ev.isSpecial ? 'text-[#7A1C33]' : 'text-slate-400'
                            }`}
                          />
                          <span className="truncate">{ev.clubName} • {ev.quota}</span>
                        </div>
                      </div>

                      {/* Interactive Join Button */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleStudentEvent(e, ev.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer flex items-center gap-1 ${
                          ev.isRegistered
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs font-bold'
                            : ev.isSpecial
                            ? 'bg-[#0F172A] hover:bg-[#7A1C33] text-white shadow-2xs'
                            : 'bg-slate-900 hover:bg-emerald-800 text-white shadow-2xs'
                        }`}
                      >
                        {ev.isRegistered ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Katıldın ✓</span>
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
        </div>
      ) : (
        /* ═══════════════════════════════════════════════════════════════════════
            MODE 2: LOGGED OUT (`currentUser === null`) — PUBLIC SHOWCASE ("VİTRİN")
        ═══════════════════════════════════════════════════════════════════════ */
        <div className="space-y-5">
          {/* ── ROW 1: FULL-WIDTH CAMPUS HERO BANNER (2.5s Auto Slideshow) ── */}
          <div className="rounded-2xl overflow-hidden relative bg-[#091526] min-h-[260px] sm:min-h-[290px] flex items-center shadow-lg border border-slate-800/80">
            {/* Campus Photo Slideshow (Spans full banner width, focal point centered/right) */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
              {CAMPUS_SLIDES.map((src, idx) => (
                <img
                  key={src}
                  src={src}
                  alt={`DPÜ Yerleşkesi Fotoğrafı ${idx + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover object-right sm:object-[75%_center] pointer-events-none transition-all duration-1000 ease-in-out ${
                    bgSlide === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                  }`}
                />
              ))}

              {/* Smooth multi-stop horizontal gradient fade shifted left so photos are clearly visible */}
              <div
                className="absolute inset-0 pointer-events-none hidden sm:block [background:linear-gradient(90deg,#091526_0%,#091526_22%,rgba(9,21,38,0.85)_32%,rgba(9,21,38,0.15)_42%,transparent_50%)]"
                aria-hidden="true"
              />
              {/* Mobile multi-stop gradient for text legibility on narrow screens */}
              <div
                className="absolute inset-0 pointer-events-none sm:hidden [background:linear-gradient(180deg,#091526_0%,#091526_45%,rgba(9,21,38,0.65)_70%,transparent_100%)]"
                aria-hidden="true"
              />
            </div>

            {/* Left Content Stack */}
            <div className="relative z-10 p-6 sm:p-9 max-w-lg lg:max-w-[460px]">
              {/* Two-line Bold Headline */}
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                <span className="block text-white">DPÜ Kampüs'e</span>
                <span className="block text-sky-300">Hoş Geldin!</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-slate-200 mt-2.5 leading-relaxed max-w-md">
                Dumlupınar Üniversitesi öğrencileri için geliştirilmiş bu platformda kampüs hayatını daha kolay yaşa!
              </p>

              {/* 5 Translucent Category Dark-Glass Pills */}
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => handleGuardNav('/pazar')}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-xs border border-white/15 text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Alışveriş</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleGuardNav('/topluluklar')}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-xs border border-white/15 text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Topluluklar</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleGuardNav('/topluluklar')}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-xs border border-white/15 text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Etkinlikler</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleGuardNav('/forum')}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-xs border border-white/15 text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <MessageSquareText className="w-3.5 h-3.5" />
                  <span>Forum</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleGuardNav('/kayip-buluntu')}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-xs border border-white/15 text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Kayıp &amp; Buluntu</span>
                </button>
              </div>

              {/* Primary White Pill CTA */}
              <div className="mt-5">
                <button
                  type="button"
                  onClick={handlePrimaryCta}
                  className="bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs px-5 py-2.5 rounded-full shadow-md inline-flex items-center gap-1.5 transition-all cursor-pointer active:scale-[0.98]"
                >
                  <span>Keşfetmeye Başla</span>
                  <span className="text-slate-600 font-bold">→</span>
                </button>
              </div>
            </div>

            {/* Bottom-Right Interactive Slide Dots */}
            <div className="absolute bottom-4 right-5 z-10 flex items-center gap-1.5 bg-black/30 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/10">
              {CAMPUS_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setBgSlide(idx)}
                  className={`transition-all rounded-full cursor-pointer ${
                    bgSlide === idx ? 'w-5 h-1.5 bg-white shadow-xs' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Fotoğraf ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* ── ROW 2: "PLATFORM NEDİR?" CARD + 3-COLUMN METRICS CARD ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* ── LEFT CARD (lg:col-span-7): "PLATFORM NEDİR?" ── */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex items-center justify-between gap-4">
              <div className="max-w-md">
                {/* Heading with dark vertical accent bar */}
                <div className="flex items-center gap-2.5">
                  <span className="w-1 h-5 bg-[#0F172A] rounded-full shrink-0" />
                  <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                    Platform Nedir?
                  </h2>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2.5">
                  DPÜ Kampüs, Dumlupınar Üniversitesi öğrencilerinin ihtiyaçlarını karşılamak,
                  birbirleriyle iletişim kurmak ve kampüs hayatını kolaylaştırmak için tasarlanmış
                  modern bir öğrenci platformudur.
                </p>

                {/* Dark pill CTA */}
                <button
                  type="button"
                  onClick={() => setAboutModalOpen(true)}
                  className="mt-4 bg-[#0F172A] hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-full inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
                >
                  <span>Daha Fazla Bilgi</span>
                  <span>→</span>
                </button>
              </div>

              {/* Right Decorative Emblem Hub with Laptop & Floating Category Bubbles */}
              <div className="hidden sm:flex relative w-36 h-36 shrink-0 items-center justify-center">
                <div className="absolute inset-0 bg-slate-100/70 rounded-full blur-xs" />

                <div className="relative z-10 w-24 h-16 bg-slate-900 rounded-lg p-1 shadow-md border border-slate-700 flex flex-col items-center justify-center">
                  <div className="w-full h-full bg-slate-800 rounded flex items-center justify-center relative overflow-hidden">
                    <img
                      src="/images/dpu-logo.png"
                      alt="DPÜ"
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-white/50"
                    />
                  </div>
                  <div className="w-28 h-1.5 bg-slate-400 rounded-b-md -mb-2 mt-1 shadow-xs" />
                </div>

                {/* Floating Bubbles */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white shadow-md border border-slate-200/80 flex items-center justify-center text-blue-600 animate-bounce duration-1000">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-7 h-7 rounded-full bg-white shadow-md border border-slate-200/80 flex items-center justify-center text-indigo-600">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-7 h-7 rounded-full bg-white shadow-md border border-slate-200/80 flex items-center justify-center text-sky-600">
                  <ShoppingBag className="w-3.5 h-3.5" />
                </div>
                <div className="absolute -bottom-1 right-3 w-6 h-6 rounded-full bg-white shadow-md border border-slate-200/80 flex items-center justify-center text-emerald-600">
                  <MessageCircle className="w-3 h-3" />
                </div>
              </div>
            </div>

            {/* ── RIGHT CARD (lg:col-span-5): 3-COLUMN METRICS ── */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-[0_2px_12px_rgba(15,23,42,0.03)] grid grid-cols-3 divide-x divide-slate-100 items-center text-center">
              <div className="px-2">
                <Users className="w-7 h-7 text-[#0F172A] mx-auto mb-2 stroke-[1.75]" />
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tabular-nums tracking-tight">
                  10.000+
                </div>
                <div className="text-xs text-slate-500 mt-0.5 font-medium">Aktif Öğrenci</div>
              </div>
              <div className="px-2">
                <Calendar className="w-7 h-7 text-[#0F172A] mx-auto mb-2 stroke-[1.75]" />
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tabular-nums tracking-tight">
                  500+
                </div>
                <div className="text-xs text-slate-500 mt-0.5 font-medium">Etkinlik</div>
              </div>
              <div className="px-2">
                <ShoppingBag className="w-7 h-7 text-[#0F172A] mx-auto mb-2 stroke-[1.75]" />
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tabular-nums tracking-tight">
                  3.000+
                </div>
                <div className="text-xs text-slate-500 mt-0.5 font-medium">İlan</div>
              </div>
            </div>
          </div>

          {/* ── ROW 3: 3-COLUMN BOTTOM GRID ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
            {/* ── CARD 1: SON DUYURULAR ── */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-[#0F172A]" />
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">Son Duyurular</h3>
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

                <div className="divide-y divide-slate-100 mt-1">
                  {ANNOUNCEMENTS.map((ann) => (
                    <button
                      key={ann.id}
                      type="button"
                      onClick={() => handleOpenAnnouncement(ann)}
                      className="w-full py-2.5 px-1 flex items-center justify-between gap-2.5 text-left hover:bg-slate-50/80 rounded-xl transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`w-2 h-2 rounded-full ${ann.dotColor} shrink-0`} />
                        <span className="text-xs font-medium text-slate-800 group-hover:text-emerald-800 transition-colors truncate">
                          {ann.title}
                        </span>
                      </div>
                      <span className="text-[11px] font-medium text-slate-400 shrink-0 tabular-nums">
                        {ann.date}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── CARD 2: YAKLAŞAN ETKİNLİKLER (Guest Slide) ── */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#0F172A]" />
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">Yaklaşan Etkinlikler</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleGuardNav('/topluluklar')}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer flex items-center gap-1 group"
                  >
                    <span>Tümünü Gör</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                  </button>
                </div>

                <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-3 flex items-center gap-3 my-2.5">
                  <div className="w-14 sm:w-16 h-20 rounded-xl bg-gradient-to-br from-[#091526] via-indigo-950 to-sky-900 flex items-center justify-center text-sky-300 shrink-0 relative overflow-hidden shadow-xs">
                    {currentGuestEvent.badgeAccent ? (
                      <Shield className="w-7 h-7 text-[#7A1C33] drop-shadow-sm" />
                    ) : (
                      <Sparkles className="w-6 h-6 text-sky-300 animate-pulse" />
                    )}
                  </div>

                  <div className="text-center pr-2.5 border-r border-slate-200/80 shrink-0">
                    <div className="text-lg font-extrabold text-slate-900 leading-none tabular-nums">
                      {currentGuestEvent.day}
                    </div>
                    <div className="text-[11px] font-bold text-slate-600 uppercase mt-0.5">
                      {currentGuestEvent.month}
                    </div>
                    <div className="text-[10px] text-slate-400">{currentGuestEvent.weekday}</div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight truncate">
                      {currentGuestEvent.title}
                    </h4>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1 truncate">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{currentGuestEvent.venue}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                      <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{currentGuestEvent.time}</span>
                    </div>

                    <div className="mt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleGuardNav('/topluluklar')}
                        className="text-[11px] font-semibold px-3 py-1 rounded-full border border-slate-300 hover:bg-slate-900 hover:text-white text-slate-800 transition-all cursor-pointer"
                      >
                        Etkinliğe Katıl →
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom 4 Pagination Dots */}
              <div className="flex items-center justify-center gap-1.5 pt-1">
                {GUEST_FEATURED_EVENTS.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setGuestEventSlide(idx)}
                    className={`transition-all rounded-full cursor-pointer ${
                      guestEventSlide === idx ? 'w-4 h-1.5 bg-slate-900' : 'w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Etkinlik ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* ── CARD 3: ÖNE ÇIKAN TOPLULUKLAR ── */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#0F172A]" />
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">Öne Çıkan Topluluklar</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleGuardNav('/topluluklar')}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer flex items-center gap-1 group"
                  >
                    <span>Tümünü Gör</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2.5 my-2.5">
                  <button
                    type="button"
                    onClick={() => handleGuardNav('/topluluklar')}
                    className="bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/80 hover:border-indigo-200 rounded-xl p-3 flex flex-col items-center text-center transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-2 group-hover:scale-105 transition-transform shadow-2xs">
                      <Gamepad2 className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 leading-tight">Oyun Topluluğu</span>
                    <span className="text-[10px] text-slate-500 font-medium mt-1">12.5K Üye</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleGuardNav('/topluluklar')}
                    className="bg-slate-50 hover:bg-sky-50/50 border border-slate-200/80 hover:border-sky-200 rounded-xl p-3 flex flex-col items-center text-center transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 mb-2 group-hover:scale-105 transition-transform shadow-2xs">
                      <Code2 className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 leading-tight">Yazılım Topluluğu</span>
                    <span className="text-[10px] text-slate-500 font-medium mt-1">8.7K Üye</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleGuardNav('/topluluklar')}
                    className="bg-slate-50 hover:bg-[#7A1C33]/5 border border-slate-200/80 hover:border-[#7A1C33]/30 rounded-xl p-3 flex flex-col items-center text-center transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#7A1C33]/10 border border-[#38BDF8]/40 flex items-center justify-center text-[#7A1C33] mb-2 group-hover:scale-105 transition-transform shadow-2xs overflow-hidden relative">
                      <img
                        src="/images/clubs/gurbetci-gencler.jpg"
                        alt="DPÜ Gurbetçi Gençler"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.parentElement?.querySelector('.fallback-icon') as HTMLElement;
                          if (fallback) fallback.style.display = 'block';
                        }}
                      />
                      <Shield className="w-5 h-5 text-[#7A1C33] fallback-icon hidden" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 leading-tight">Gurbetçi Gençler</span>
                    <span className="text-[10px] text-slate-500 font-medium mt-1">261 Üye</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          SHARED MODAL 1: "DPÜ KAMPÜS NASIL ÇALIŞIR?" (ABOUT MODAL)
      ═══════════════════════════════════════════════════════════════════════ */}
      {aboutModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
          onClick={() => setAboutModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 sm:p-7 relative max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setAboutModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-md">
                <img
                  src="/images/dpu-logo.png"
                  alt="DPÜ Logo"
                  className="w-8 h-8 rounded-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  DPÜ Kampüs Nasıl Çalışır?
                </h3>
                <p className="text-xs text-slate-500">Kütahya Dumlupınar Üniversitesi</p>
              </div>
            </div>

            <div className="space-y-3.5 overflow-y-auto pr-1 flex-1 text-xs text-slate-600 leading-relaxed">
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
                <div className="flex items-center gap-2 text-slate-900 font-bold mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>1. Doğrulanmış Öğrenci Kimliği</span>
                </div>
                <p>
                  Platforma yalnızca aktif <strong className="text-slate-800">@ogr.dpu.edu.tr</strong> uzantılı
                  öğrenci e-postanız ile kayıt olabilir ve e-posta OTP onayıyla giriş yapabilirsiniz.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
                <div className="flex items-center gap-2 text-slate-900 font-bold mb-1">
                  <ShoppingBag className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>2. Güvenli Kampüs Pazarı &amp; Elden Teslim</span>
                </div>
                <p>
                  Ders kitapları, mühendislik hesap makineleri, elektronik ve yurt eşyalarınızı Merkez
                  Kütüphane, Bedesten veya KYK teslim noktalarında elden güvenle paylaşın.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
                <div className="flex items-center gap-2 text-slate-900 font-bold mb-1">
                  <Users className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>3. Topluluklar, Etkinlikler &amp; Canlı Forum</span>
                </div>
                <p>
                  Üniversite kulüplerini takip edin, yaklaşan maç izleme ve atölyelere katılın. Twitter/X
                  tarzı kampüs forumunda sorularınıza anında yanıt bulun.
                </p>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setAboutModalOpen(false)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 px-3 py-2 cursor-pointer"
              >
                Kapat
              </button>
              <button
                type="button"
                onClick={() => {
                  setAboutModalOpen(false);
                  handlePrimaryCta();
                }}
                className="bg-[#0F172A] hover:bg-emerald-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                {user ? 'Pazara Git' : 'Hemen Başla'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          SHARED MODAL 2: CAMPUS ANNOUNCEMENTS DETAIL MODAL
      ═══════════════════════════════════════════════════════════════════════ */}
      {announcementModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
          onClick={() => setAnnouncementModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 relative max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setAnnouncementModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>

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

            <div className="space-y-3 overflow-y-auto pr-1 flex-1">
              {activeAnnouncement ? (
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
                ANNOUNCEMENTS.map((ann) => (
                  <div
                    key={ann.id}
                    className="p-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-xl transition-colors cursor-pointer"
                    onClick={() => setActiveAnnouncement(ann)}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${ann.dotColor} shrink-0`} />
                        <p className="text-sm font-bold text-slate-900 leading-snug">
                          {ann.title}
                        </p>
                      </div>
                      <span className="text-[11px] text-slate-400 shrink-0 font-medium">
                        {ann.date}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-2 pl-4">
                      {ann.detail}
                    </p>
                    <div className="flex justify-end text-[11px] font-semibold text-emerald-700">
                      <span>Detaylı Oku →</span>
                    </div>
                  </div>
                ))
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
