import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Users,
  Search as SearchIcon,
  BookOpen,
  MapPin,
  BadgeCheck,
  Plus,
  MessageCircle,
  ChevronDown,
  LogOut,
  User as UserIcon,
  ShieldCheck,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import NewListingModal from './NewListingModal';
import ChatDrawer from './ChatDrawer';
import type { ListingDTO, User } from '../types';

const NAV_ITEMS = [
  {
    to: '/pazar',
    label: 'Kampüs Pazarı',
    description: 'İkinci El & Askıda',
    icon: ShoppingBag,
  },
  {
    to: '/topluluklar',
    label: 'Topluluklar & Etkinlik',
    description: 'Kulüpler & Zirveler',
    icon: Users,
  },
  {
    to: '/kayip-buluntu',
    label: 'Kayıp & Buluntu',
    description: 'Kampüs Panosu',
    icon: SearchIcon,
  },
  {
    to: '/notlar',
    label: 'Ders Notu & Ekip',
    description: 'Çıkmışlar & Projeler',
    icon: BookOpen,
  },
  {
    to: '/radar',
    label: 'Kampüs Radar',
    description: 'Yemekhane & Yol',
    icon: MapPin,
  },
];

export default function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newListingModalOpen, setNewListingModalOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [inboxOpen, setInboxOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dummyParticipant: User = {
    id: 'u2',
    fullName: 'Zeynep Kaya',
    email: 'zeynep.kaya@ogr.dpu.edu.tr',
    faculty: 'Fen-Edebiyat Fakültesi',
    joinedAt: '2024-09-01',
    verifiedStudent: true,
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col font-sans">
      {/* 1. TOP STICKY UTILITY BAR (56px) */}
      <header className="sticky top-0 z-40 h-14 bg-white border-b border-[#E4E4E7] px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Brand in Topbar for small screens */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-[#71717A] hover:text-[#18181B] hover:bg-[#F4F4F5] lg:hidden"
            aria-label="Menüyü Aç"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-left group cursor-pointer"
            title="DPÜ Kampüs Ana Sayfa"
          >
            <div className="w-8 h-8 rounded-lg bg-[#18181B] text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:bg-[#27272A] transition-colors">
              <BadgeCheck className="w-5 h-5 text-[#0F766E]" />
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-bold tracking-tight text-[#18181B] block leading-none">
                DPÜ Kampüs
              </span>
              <span className="text-[10px] text-[#71717A] leading-none mt-0.5 block">
                Dumlupınar Üniversitesi
              </span>
            </div>
          </button>
        </div>

        {/* Center: Global Search Input */}
        <div className="flex-1 max-w-xl mx-2">
          <div className="relative">
            <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
            <input
              type="text"
              placeholder="İlan, ders notu, topluluk veya kayıp eşya ara..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && globalSearch.trim()) {
                  navigate(`/pazar?q=${encodeURIComponent(globalSearch.trim())}`);
                }
              }}
              className="w-full pl-9 pr-4 py-2 bg-[#F7F7F5] border border-[#E4E4E7] rounded-xl text-xs sm:text-sm text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#18181B] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Right: + Yeni Paylaşım, Unread Messages & Student Profile Pill */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick "+ Yeni Paylaşım" primary button */}
          <button
            onClick={() => setNewListingModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-[#18181B] hover:bg-[#27272A] text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Paylaşım</span>
          </button>

          {/* Unread Messages Indicator */}
          <button
            onClick={() => setInboxOpen(true)}
            className="relative p-2 rounded-xl text-[#71717A] hover:text-[#18181B] hover:bg-[#F4F4F5] transition-colors"
            title="Mesajlar"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#0F766E] ring-2 ring-white" />
          </button>

          {/* Logged-in Student Profile Pill */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1 rounded-xl border border-[#E4E4E7] hover:border-[#18181B] bg-white transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-[#18181B] text-white flex items-center justify-center text-xs font-bold">
                {user?.fullName ? user.fullName.charAt(0) : 'E'}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-semibold text-[#18181B] leading-tight">
                  {user?.fullName || 'Efe Alsaç'}
                </span>
                <span className="text-[10px] text-[#0F766E] font-medium leading-tight flex items-center gap-0.5">
                  <BadgeCheck className="w-2.5 h-2.5" />
                  Doğrulanmış Öğrenci
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#71717A]" />
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-[#E4E4E7] rounded-xl shadow-lg p-2 z-50 animate-fadeIn">
                <div className="p-2.5 border-b border-[#E4E4E7] mb-1">
                  <p className="text-xs font-bold text-[#18181B] truncate">
                    {user?.fullName || 'Efe Alsaç'}
                  </p>
                  <p className="text-[11px] text-[#71717A] truncate font-mono mt-0.5">
                    {user?.email || 'efe.alsac@ogr.dpu.edu.tr'}
                  </p>
                  <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold text-[#0F766E] bg-[#CCFBF1] px-2 py-0.5 rounded-full border border-[#99F6E4]">
                    <ShieldCheck className="w-3 h-3" />
                    DPÜ Onaylı Hesap
                  </span>
                </div>

                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    navigate('/profil');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#18181B] hover:bg-[#F4F4F5] rounded-lg transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-[#71717A]" />
                  Profilim &amp; İlanlarım
                </button>

                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    setNewListingModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#18181B] hover:bg-[#F4F4F5] rounded-lg transition-colors sm:hidden"
                >
                  <Plus className="w-4 h-4 text-[#71717A]" />
                  Yeni Paylaşım Yap
                </button>

                <div className="border-t border-[#E4E4E7] my-1" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Güvenli Çıkış Yap
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. BODY LAYOUT: SLIM 240px SIDEBAR + MAIN WORKSPACE */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* DESKTOP SIDEBAR (240px) */}
        <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-[#E4E4E7] p-4 shrink-0 justify-between">
          <div className="space-y-6">
            {/* Student verified chip */}
            <div className="bg-[#F7F7F5] border border-[#E4E4E7] rounded-xl p-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] block mb-1">
                Kayıtlı Yerleşke
              </span>
              <p className="text-xs font-bold text-[#18181B]">Evliya Çelebi Kampüsü</p>
              <p className="text-[11px] text-[#71717A] mt-0.5">{user?.faculty || 'Mühendislik Fakültesi'}</p>
            </div>

            {/* Core Nav Modules */}
            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.to);

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-colors group ${
                      isActive
                        ? 'bg-[#18181B] text-white shadow-sm font-semibold'
                        : 'text-[#71717A] hover:text-[#18181B] hover:bg-[#F4F4F5] font-medium'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#71717A] group-hover:text-[#18181B]'}`} />
                    <div className="min-w-0">
                      <span className="block truncate leading-tight">{item.label}</span>
                      <span className={`block text-[10px] truncate leading-tight mt-0.5 ${isActive ? 'text-[#A1A1AA]' : 'text-[#A1A1AA]'}`}>
                        {item.description}
                      </span>
                    </div>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer info */}
          <div className="border-t border-[#E4E4E7] pt-4 space-y-2">
            <div className="flex items-center gap-2 text-[11px] text-[#71717A]">
              <Sparkles className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>Dumlupınar Öğrenci Ağı</span>
            </div>
            <p className="text-[10px] text-[#A1A1AA]">
              Kütahya Dumlupınar Üniversitesi · DPÜ Kampüs v1.0
            </p>
          </div>
        </aside>

        {/* MOBILE DRAWER NAV */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative bg-white w-64 h-full p-4 flex flex-col justify-between border-r border-[#E4E4E7] z-50">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E7]">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/');
                    }}
                    className="text-sm font-bold text-[#18181B] text-left cursor-pointer"
                  >
                    DPÜ Kampüs
                  </button>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-[#71717A]">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname.startsWith(item.to);

                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                          isActive
                            ? 'bg-[#18181B] text-white'
                            : 'text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#18181B]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <div>
                          <span>{item.label}</span>
                          <span className="block text-[10px] font-normal text-[#A1A1AA]">{item.description}</span>
                        </div>
                      </NavLink>
                    );
                  })}
                </nav>
              </div>

              <div className="border-t border-[#E4E4E7] pt-4">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/profil');
                  }}
                  className="w-full py-2 px-3 mb-2 bg-[#F7F7F5] border border-[#E4E4E7] text-xs font-semibold text-[#18181B] rounded-xl text-center"
                >
                  Profilim
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full py-2 px-3 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl text-center"
                >
                  Çıkış Yap
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MAIN OUTLET CONTAINER */}
        <main className="flex-1 pb-16 lg:pb-8 min-w-0">
          <Outlet context={{ onOpenNewListing: () => setNewListingModalOpen(true) }} />
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-[#E4E4E7] flex items-center justify-around px-2 z-30">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium transition-colors ${
                isActive ? 'text-[#18181B] font-bold' : 'text-[#71717A]'
              }`}
            >
              <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-[#18181B]' : 'text-[#71717A]'}`} />
              <span className="truncate max-w-[56px] text-center">{item.label.split(' ')[0]}</span>
            </NavLink>
          );
        })}
      </div>

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
