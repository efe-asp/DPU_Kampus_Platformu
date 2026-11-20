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
  ArrowRight,
  Trophy,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// ─── Campus Announcements Data ────────────────────────────────────────────────
interface Announcement {
  id: string;
  title: string;
  summary: string;
  detail: string;
  date: string;
  dotColor: string;
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
  },
  {
    id: 'ann-2',
    title: 'Vize Takvimi Açıklandı',
    summary: '2025-2026 Güz Dönemi vize sınav programı duyurulmuştur.',
    detail:
      '2025-2026 Güz Yarıyılı Ara Sınav (Vize) programları tüm fakülte, yüksekokul ve meslek yüksekokullarında panolarda ve bölüm web sitelerinde ilan edilmiştir. Sınav salonlarınızı önceden kontrol etmeniz önemle rica olunur.',
    date: '19 Kasım',
    dotColor: 'bg-violet-500',
  },
  {
    id: 'ann-3',
    title: 'Yemekhane Çalışma Saatlerinde Değişiklik',
    summary: 'Hafta sonu yemekhane servis saatleri güncellenmiştir.',
    detail:
      'Evliya Çelebi ve Germiyan yerleşkelerindeki merkez yemekhanelerimizin hafta sonu öğle ve akşam yemeği servis saatleri vize haftası boyunca uzatılmıştır. Öğle yemeği 11:30 - 14:00, akşam yemeği 16:30 - 19:30 saatleri arasında kesintisiz devam edecektir.',
    date: '18 Kasım',
    dotColor: 'bg-rose-500',
  },
  {
    id: 'ann-4',
    title: 'Burs Başvuruları Başladı',
    summary: 'Öğrenci yemek ve başarı bursu başvuruları açılmıştır.',
    detail:
      'DPÜ Rektörlüğü Sağlık Kültür ve Spor Daire Başkanlığı tarafından ihtiyaç sahibi ve başarılı öğrencilere yönelik yemek bursu başvuruları başlamıştır. Başvurular Öğrenci Bilgi Sistemi (OBS) üzerinden 30 Kasım tarihine kadar kabul edilecektir.',
    date: '17 Kasım',
    dotColor: 'bg-amber-500',
  },
];

// ─── Upcoming Events Carousel Data ────────────────────────────────────────────
interface FeaturedEvent {
  id: string;
  title: string;
  day: string;
  month: string;
  weekday: string;
  venue: string;
  time: string;
  clubName: string;
  badgeAccent?: string;
  registeredCount: number;
  totalQuota: number;
}

const FEATURED_EVENTS: FeaturedEvent[] = [
  {
    id: 'fe-1',
    title: 'Teknoloji Zirvesi',
    day: '24',
    month: 'Kas',
    weekday: 'Pzt',
    venue: 'DPÜ Konferans Salonu',
    time: '14:00 - 17:00',
    clubName: 'Yazılım & İnovasyon Kulübü',
    registeredCount: 78,
    totalQuota: 100,
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
    registeredCount: 61,
    totalQuota: 80,
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
    registeredCount: 38,
    totalQuota: 50,
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
    registeredCount: 29,
    totalQuota: 30,
  },
];

// ─── Campus Entrance Photo Slides (2.5s Auto-Transition) ──────────────────────
const CAMPUS_SLIDES = [
  '/images/campus/campus-1.jpg',
  '/images/campus/campus-2.jpg',
  '/images/campus/campus-3.jpg',
  '/images/campus/campus-4.jpg',
];

export default function HomePage() {
  const { user, setGuestLockModalOpen, setAuthInitialTab } = useAuth();
  const navigate = useNavigate();

  // State
  const [bgSlide, setBgSlide] = useState(0);
  const [eventSlide, setEventSlide] = useState(0);

  // Auto-advance background campus photos every 2.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setBgSlide((prev) => (prev + 1) % CAMPUS_SLIDES.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);
  const [imgError, setImgError] = useState(false);
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [activeAnnouncement, setActiveAnnouncement] = useState<Announcement | null>(null);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState<Record<string, boolean>>({});

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

  // Toggle event registration
  const handleToggleEvent = (e: React.MouseEvent, eventId: string) => {
    e.stopPropagation();
    if (!user) {
      setGuestLockModalOpen(true);
      return;
    }
    setRegisteredEvents((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
  };

  const handleOpenAnnouncement = (ann?: Announcement) => {
    setActiveAnnouncement(ann || null);
    setAnnouncementModalOpen(true);
  };

  const currentEvent = FEATURED_EVENTS[eventSlide];
  const isEventRegistered = registeredEvents[currentEvent.id] ?? false;

  return (
    <div className="w-full space-y-5 pt-1 pb-10 font-sans select-none">
      {/* ═══════════════════════════════════════════════════════════════════════
          ROW 1: FULL-WIDTH CAMPUS HERO BANNER (2.5s Auto Slideshow)
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="rounded-2xl overflow-hidden relative bg-[#091526] min-h-[260px] sm:min-h-[290px] flex items-center shadow-lg border border-slate-800/80">
        {/* Right-Side Campus Photo Slideshow & Multi-Stop Gradient Blend */}
        <div className="absolute inset-y-0 right-0 w-full lg:w-[62%] h-full overflow-hidden pointer-events-none">
          {CAMPUS_SLIDES.map((src, idx) => (
            <img
              key={src}
              src={src}
              alt={`DPÜ Yerleşkesi Fotoğrafı ${idx + 1}`}
              className={`absolute inset-0 w-full h-full object-cover object-center pointer-events-none transition-all duration-1000 ease-in-out ${
                bgSlide === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
            />
          ))}

          {/* Smooth multi-stop horizontal gradient fade into dark navy on the left */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#091526] via-[#091526]/90 via-30% to-transparent pointer-events-none"
            aria-hidden="true"
          />
          {/* Subtle bottom gradient for mobile readability */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#091526]/95 via-transparent to-transparent lg:hidden pointer-events-none"
            aria-hidden="true"
          />
        </div>

        {/* Left Content Stack */}
        <div className="relative z-10 p-6 sm:p-9 max-w-xl">
          {/* Two-line Bold Headline */}
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            <span className="block text-white">DPÜ Kampüs'e</span>
            <span className="block text-sky-300">
              {user?.fullName
                ? `Hoş Geldin, ${user.fullName.trim().split(' ')[0]}!`
                : 'Hoş Geldin!'}
            </span>
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
        <div className="absolute bottom-4 right-5 z-10 flex items-center gap-1.5">
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

      {/* ═══════════════════════════════════════════════════════════════════════
          ROW 2: "PLATFORM NEDİR?" CARD + 3-COLUMN METRICS CARD
      ═══════════════════════════════════════════════════════════════════════ */}
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
            {/* Concentric Soft Background Ring */}
            <div className="absolute inset-0 bg-slate-100/70 rounded-full blur-xs" />

            {/* Center Laptop Illustration with DPU Logo */}
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

            {/* 4 Floating Circular Category Icon Bubbles */}
            {/* 1. Top: Calendar */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white shadow-md border border-slate-200/80 flex items-center justify-center text-blue-600 animate-bounce duration-1000">
              <Calendar className="w-3.5 h-3.5" />
            </div>

            {/* 2. Left: Users */}
            <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-7 h-7 rounded-full bg-white shadow-md border border-slate-200/80 flex items-center justify-center text-indigo-600">
              <Users className="w-3.5 h-3.5" />
            </div>

            {/* 3. Right: ShoppingBag */}
            <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-7 h-7 rounded-full bg-white shadow-md border border-slate-200/80 flex items-center justify-center text-sky-600">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>

            {/* 4. Bottom Right: MessageCircle */}
            <div className="absolute -bottom-1 right-3 w-6 h-6 rounded-full bg-white shadow-md border border-slate-200/80 flex items-center justify-center text-emerald-600">
              <MessageCircle className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* ── RIGHT CARD (lg:col-span-5): 3-COLUMN METRICS ── */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-[0_2px_12px_rgba(15,23,42,0.03)] grid grid-cols-3 divide-x divide-slate-100 items-center text-center">
          {/* Column 1: Aktif Öğrenci */}
          <div className="px-2">
            <Users className="w-7 h-7 text-[#0F172A] mx-auto mb-2 stroke-[1.75]" />
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tabular-nums tracking-tight">
              10.000+
            </div>
            <div className="text-xs text-slate-500 mt-0.5 font-medium">Aktif Öğrenci</div>
          </div>

          {/* Column 2: Etkinlik */}
          <div className="px-2">
            <Calendar className="w-7 h-7 text-[#0F172A] mx-auto mb-2 stroke-[1.75]" />
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tabular-nums tracking-tight">
              500+
            </div>
            <div className="text-xs text-slate-500 mt-0.5 font-medium">Etkinlik</div>
          </div>

          {/* Column 3: İlan */}
          <div className="px-2">
            <ShoppingBag className="w-7 h-7 text-[#0F172A] mx-auto mb-2 stroke-[1.75]" />
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tabular-nums tracking-tight">
              3.000+
            </div>
            <div className="text-xs text-slate-500 mt-0.5 font-medium">İlan</div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          ROW 3: 3-COLUMN BOTTOM GRID
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
        {/* ── CARD 1: SON DUYURULAR ── */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col justify-between">
          <div>
            {/* Header */}
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

            {/* 4 Compact Rows */}
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

        {/* ── CARD 2: YAKLAŞAN ETKİNLİKLER (Interactive Featured Event Slide) ── */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col justify-between">
          <div>
            {/* Header */}
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

            {/* Interactive Featured Event Slide Card */}
            <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-3 flex items-center gap-3 my-2.5">
              {/* Left Dark Gradient Poster Thumbnail */}
              <div className="w-14 sm:w-16 h-20 rounded-xl bg-gradient-to-br from-[#091526] via-indigo-950 to-sky-900 flex items-center justify-center text-sky-300 shrink-0 relative overflow-hidden shadow-xs">
                {currentEvent.badgeAccent ? (
                  <Shield className="w-7 h-7 text-[#7A1C33] drop-shadow-sm" />
                ) : (
                  <Sparkles className="w-6 h-6 text-sky-300 animate-pulse" />
                )}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.15),transparent)]" />
              </div>

              {/* Date Column */}
              <div className="text-center pr-2.5 border-r border-slate-200/80 shrink-0">
                <div className="text-lg font-extrabold text-slate-900 leading-none tabular-nums">
                  {currentEvent.day}
                </div>
                <div className="text-[11px] font-bold text-slate-600 uppercase mt-0.5">
                  {currentEvent.month}
                </div>
                <div className="text-[10px] text-slate-400">{currentEvent.weekday}</div>
              </div>

              {/* Details Column */}
              <div className="min-w-0 flex-1">
                <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight truncate">
                  {currentEvent.title}
                </h4>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1 truncate">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{currentEvent.venue}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                  <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{currentEvent.time}</span>
                </div>

                {/* Right-aligned Join pill button */}
                <div className="mt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={(e) => handleToggleEvent(e, currentEvent.id)}
                    className={`text-[11px] font-semibold px-3 py-1 rounded-full border transition-all cursor-pointer flex items-center gap-1 ${
                      isEventRegistered
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold'
                        : 'border-slate-300 hover:bg-slate-900 hover:text-white text-slate-800'
                    }`}
                  >
                    {isEventRegistered ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Katıldın</span>
                      </>
                    ) : (
                      <span>Etkinliğe Katıl →</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Centered 4 Pagination Dots */}
          <div className="flex items-center justify-center gap-1.5 pt-1">
            {FEATURED_EVENTS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setEventSlide(idx)}
                className={`transition-all rounded-full cursor-pointer ${
                  eventSlide === idx ? 'w-4 h-1.5 bg-slate-900' : 'w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Etkinlik ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* ── CARD 3: ÖNE ÇIKAN TOPLULUKLAR ── */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col justify-between">
          <div>
            {/* Header */}
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

            {/* 3 Side-by-Side Mini Club Tiles */}
            <div className="grid grid-cols-3 gap-2.5 my-2.5">
              {/* Tile 1: Oyun Topluluğu */}
              <button
                type="button"
                onClick={() => handleGuardNav('/topluluklar')}
                className="bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/80 hover:border-indigo-200 rounded-xl p-3 flex flex-col items-center text-center transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-2 group-hover:scale-105 transition-transform shadow-2xs">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  Oyun Topluluğu
                </span>
                <span className="text-[10px] text-slate-500 font-medium mt-1">12.5K Üye</span>
              </button>

              {/* Tile 2: Yazılım Topluluğu */}
              <button
                type="button"
                onClick={() => handleGuardNav('/topluluklar')}
                className="bg-slate-50 hover:bg-sky-50/50 border border-slate-200/80 hover:border-sky-200 rounded-xl p-3 flex flex-col items-center text-center transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 mb-2 group-hover:scale-105 transition-transform shadow-2xs">
                  <Code2 className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  Yazılım Topluluğu
                </span>
                <span className="text-[10px] text-slate-500 font-medium mt-1">8.7K Üye</span>
              </button>

              {/* Tile 3: Gurbetçi Gençler */}
              <button
                type="button"
                onClick={() => handleGuardNav('/topluluklar')}
                className="bg-slate-50 hover:bg-[#7A1C33]/5 border border-slate-200/80 hover:border-[#7A1C33]/30 rounded-xl p-3 flex flex-col items-center text-center transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#7A1C33]/10 border border-[#38BDF8]/40 flex items-center justify-center text-[#7A1C33] mb-2 group-hover:scale-105 transition-transform shadow-2xs">
                  <Shield className="w-5 h-5 text-[#7A1C33]" />
                </div>
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  Gurbetçi Gençler
                </span>
                <span className="text-[10px] text-slate-500 font-medium mt-1">6.3K Üye</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          MODAL 1: "DPÜ KAMPÜS NASIL ÇALIŞIR?" (ABOUT MODAL)
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
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setAboutModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
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

            {/* Modal Body */}
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

            {/* Modal Footer CTA */}
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
          MODAL 2: CAMPUS ANNOUNCEMENTS DETAIL MODAL
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
