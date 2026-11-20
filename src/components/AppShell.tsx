import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Users,
  Search as SearchIcon,
  BookOpen,
  MapPin,
  BadgeCheck,
  MessageCircle,
  ChevronDown,
  LogOut,
  User as UserIcon,
  ShieldCheck,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import NewListingModal from './NewListingModal';
import ChatDrawer from './ChatDrawer';
import Footer from './Footer';
import type { ListingDTO, User } from '../types';

const LEFT_NAV_ITEMS = [
  {
    to: '/pazar',
    label: 'Kampüs Pazarı',
    icon: ShoppingBag,
  },
  {
    to: '/topluluklar',
    label: 'Topluluklar',
    icon: Users,
  },
  {
    to: '/kayip-buluntu',
    label: 'Kayıp & Buluntu',
    icon: SearchIcon,
  },
];

const RIGHT_NAV_ITEMS = [
  {
    to: '/notlar',
    label: 'Ders Notu & Ekip',
    icon: BookOpen,
  },
  {
    to: '/radar',
    label: 'Kampüs Radar',
    icon: MapPin,
  },
];

const ALL_NAV_ITEMS = [...LEFT_NAV_ITEMS, ...RIGHT_NAV_ITEMS];

export default function AppShell() {
  const { user, logout, setIsExitingPortal } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newListingModalOpen, setNewListingModalOpen] = useState(false);
  const [inboxOpen, setInboxOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleListingCreated = (_listing: ListingDTO) => {
    setNewListingModalOpen(false);
    navigate('/pazar');
  };

  const handleLogoutClick = () => {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    setLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {
    setLogoutModalOpen(false);
    setIsExitingPortal(true);
    setTimeout(() => {
      logout();
      navigate('/');
      setIsExitingPortal(false);
    }, 2400);
  };

  const dummyParticipant: User = {
    id: 'u2',
    fullName: 'Zeynep Kaya',
    email: 'zeynep.kaya@ogr.dpu.edu.tr',
    faculty: 'Fen-Edebiyat Fakültesi',
    joinedAt: '2024-09-01',
    verifiedStudent: true,
  };

  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col font-sans">
      {/* ── SYMMETRICAL STICKY TOP HEADER (h-20, Centered Stacked Logo) ── */}
      <header className="sticky top-0 z-40 h-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center max-w-7xl mx-auto h-full w-full">
          
          {/* ── LEFT COLUMN: 3 Navigation Items Aligned Right Toward Center Logo ── */}
          <div className="flex items-center justify-start md:justify-end gap-1.5 lg:gap-2 pr-0 md:pr-6">
            {/* Mobile Hamburger Toggle (md:hidden) */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors md:hidden cursor-pointer"
              aria-label="Menüyü Aç"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Left 3 Nav Items */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {LEFT_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = !isHome && location.pathname.startsWith(item.to);

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs lg:text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* ── CENTER COLUMN: Mathematically Centered Stacked Logo (Text Below Logo) ── */}
          <div className="flex items-center justify-center px-2 sm:px-4">
            <button
              onClick={() => navigate('/')}
              className="flex flex-col items-center justify-center gap-1 cursor-pointer group select-none text-center"
              title="DPÜ Kampüs Ana Sayfa"
            >
              <img
                src="/images/dpu-logo.png"
                alt="DPÜ Logo"
                className="w-10 h-10 rounded-full object-cover shadow-xs ring-1 ring-slate-200 group-hover:scale-105 group-hover:ring-slate-400 transition-all"
              />
              <div className="flex flex-col items-center">
                <span className="text-sm font-extrabold tracking-tight text-slate-900 leading-none group-hover:text-emerald-700 transition-colors">
                  DPÜ Kampüs
                </span>
                <span className="text-[10px] font-medium text-slate-500 leading-none mt-0.5">
                  Dumlupınar Üniversitesi
                </span>
              </div>
            </button>
          </div>

          {/* ── RIGHT COLUMN: 2 Navigation Items + Profile Dropdown ── */}
          <div className="flex items-center justify-end md:justify-between pl-0 md:pl-6">
            {/* Desktop Right 2 Nav Items */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {RIGHT_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = !isHome && location.pathname.startsWith(item.to);

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs lg:text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            {/* Profile Dropdown (Far Right) */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 hover:border-slate-400 bg-white shadow-xs transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-[#0F172A] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {user?.fullName ? user.fullName.charAt(0) : 'E'}
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-900 leading-tight">
                    {user?.fullName || 'Efe Alsaç'}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-medium leading-tight flex items-center gap-0.5">
                    <BadgeCheck className="w-2.5 h-2.5" />
                    Doğrulanmış Öğrenci
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-fadeIn">
                  {/* Student Info Box */}
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl mb-1.5">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {user?.fullName || 'Efe Alsaç'}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate font-mono mt-0.5">
                      {user?.email || 'efe.alsac@ogr.dpu.edu.tr'}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/70">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      DPÜ Onaylı Hesap
                    </span>
                  </div>

                  {/* 1. Profilim & İlanlarım */}
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      navigate('/profil');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer text-left"
                  >
                    <UserIcon className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>Profilim &amp; İlanlarım</span>
                  </button>

                  {/* 2. Mesajlarım (with green unread count pill badge) */}
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      setInboxOpen(true);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <MessageCircle className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>Mesajlarım</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      3
                    </span>
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  {/* 3. Güvenli Çıkış Yap */}
                  <button
                    onClick={handleLogoutClick}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer text-left"
                  >
                    <LogOut className="w-4 h-4 shrink-0" />
                    <span>Güvenli Çıkış Yap</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── MOBILE DRAWER NAVIGATION (md:hidden) ── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative bg-white w-72 h-full p-5 flex flex-col justify-between border-r border-slate-200 z-50 shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/');
                  }}
                  className="flex items-center gap-2 text-left cursor-pointer"
                >
                  <img src="/images/dpu-logo.png" alt="DPÜ Logo" className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <span className="text-sm font-bold text-slate-900 block leading-tight">DPÜ Kampüs</span>
                    <span className="text-[10px] text-slate-500">Dumlupınar Üniversitesi</span>
                  </div>
                </button>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Nav Links */}
              <nav className="space-y-1">
                {ALL_NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = !isHome && location.pathname.startsWith(item.to);
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>

              {/* Mobile Messages Shortcut */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setInboxOpen(true);
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-4 h-4 text-slate-500" />
                  <span>Mesajlarım</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  3
                </span>
              </button>
            </div>

            {/* Mobile Footer Area */}
            <div className="border-t border-slate-100 pt-4 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/profil');
                }}
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 rounded-xl text-center hover:bg-slate-100 transition-colors"
              >
                Profilim
              </button>
              <button
                onClick={handleLogoutClick}
                className="w-full py-2.5 px-3 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl text-center transition-colors cursor-pointer"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT CONTAINER (Full Width, Centered, Zero Left Sidebar) ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-20 md:pb-10 min-w-0">
        <Outlet context={{ onOpenNewListing: () => setNewListingModalOpen(true) }} />
      </main>

      {/* ── PERSISTENT GLOBAL FOOTER ── */}
      <Footer />

      {/* ── LOGOUT CONFIRMATION MODAL ── */}
      {logoutModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setLogoutModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">
              Oturumu Kapatmak İstiyor Musunuz?
            </h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              DPÜ Kampüs oturumunuz güvenli bir şekilde sonlandırılacak. Dilediğiniz zaman öğrenci e-postanızla tekrar giriş yapabilirsiniz.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLogoutModalOpen(false)}
                className="h-10 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="h-10 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Çıkış Yap</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global New Listing Modal */}
      <NewListingModal
        open={newListingModalOpen}
        onClose={() => setNewListingModalOpen(false)}
        onCreated={handleListingCreated}
      />

      {/* Global Inbox / Chat Drawer */}
      <ChatDrawer
        open={inboxOpen}
        onClose={() => setInboxOpen(false)}
        participant={dummyParticipant}
      />
    </div>
  );
}
