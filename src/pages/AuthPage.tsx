import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  AlertCircle,
  User,
  Mail,
  Building2,
  Lock,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { ApiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const FACULTIES = [
  'Mühendislik Fakültesi',
  'Kütahya Teknik Bilimler MYO',
  'Fen-Edebiyat Fakültesi',
  'İİBF',
  'Eğitim Fakültesi',
  'Güzel Sanatlar Fakültesi',
];

export default function AuthPage() {
  const { login } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Login form fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form fields
  const [fullName, setFullName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [faculty, setFaculty] = useState(FACULTIES[0]);
  const [registerPassword, setRegisterPassword] = useState('');

  const validateDpuEmail = (email: string): boolean => {
    return email.trim().toLowerCase().endsWith('@ogr.dpu.edu.tr');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateDpuEmail(loginEmail)) {
      setError('Sadece Kütahya Dumlupınar Üniversitesi öğrenci e-postası (@ogr.dpu.edu.tr) ile giriş veya kayıt yapılabilir.');
      return;
    }

    if (!loginPassword) {
      setError('Lütfen şifrenizi girin.');
      return;
    }

    setLoading(true);
    try {
      const response = await ApiService.login({ email: loginEmail, password: loginPassword });
      login(response.user, response.token);
    } catch (err: any) {
      setError(err?.message || 'Giriş yapılırken bir hata oluştu. Bilgilerinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Lütfen ad ve soyadınızı girin.');
      return;
    }

    if (!validateDpuEmail(registerEmail)) {
      setError('Sadece Kütahya Dumlupınar Üniversitesi öğrenci e-postası (@ogr.dpu.edu.tr) ile giriş veya kayıt yapılabilir.');
      return;
    }

    if (!registerPassword || registerPassword.length < 6) {
      setError('Şifreniz en az 6 karakter olmalıdır.');
      return;
    }

    setLoading(true);
    try {
      const response = await ApiService.register({
        fullName: fullName.trim(),
        email: registerEmail.trim(),
        faculty,
        password: registerPassword,
      });
      login(response.user, response.token);
    } catch (err: any) {
      setError(err?.message || 'Kayıt sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const demoUser = {
        email: 'efe.alsac@ogr.dpu.edu.tr',
        password: 'dpuDemoPassword2026',
      };
      const response = await ApiService.login(demoUser);
      login(response.user, response.token);
    } catch (err: any) {
      setError('Demo girişi yapılamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#091526] flex items-center justify-center font-sans select-none">
      <div className="h-full w-full grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* LEFT COLUMN: Bright, Vivid Campus Drone Aerial Video with subtle bottom gradient */}
        <div className="hidden lg:flex lg:col-span-7 h-full relative overflow-hidden flex-col justify-between px-8 xl:px-12 pt-6 pb-8 xl:pt-8 xl:pb-10">
          {/* Full-bleed background video - bright and clear */}
          <video
            src="/videos/tanitim.mp4"
            autoPlay
            loop
            muted
            playsInline
            controls={false}
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback"
            onContextMenu={(e) => e.preventDefault()}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          />

          {/* Subtle bottom-only gradient scrim - upper 70% remains completely clear */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#091526]/85 via-[#091526]/20 to-transparent pointer-events-none"
            aria-hidden="true"
          />

          {/* Top Brand Area (Elevated slightly, centered logo and text with drop-shadow) */}
          <div className="relative z-10 flex items-center gap-3">
            <img
              src="/images/dpu-logo.png"
              alt="Kütahya Dumlupınar Üniversitesi Amblemi"
              className="w-11 h-11 rounded-full object-cover bg-white p-0.5 ring-2 ring-white/60 shadow-md shrink-0"
            />
            <div className="flex flex-col justify-center drop-shadow-sm">
              <span className="text-xl font-black tracking-tight text-white block leading-tight">
                DPÜ Kampüs
              </span>
              <span className="text-[11px] text-white/90 font-medium tracking-wide">
                Dumlupınar Üniversitesi
              </span>
            </div>
          </div>

          {/* Middle is open so the bright campus footage and flag remain clear */}
          <div className="relative z-10 flex-1" />

          {/* Bottom-Aligned Content Stack */}
          <div className="relative z-10 space-y-3.5">
            {/* Headings with crisp drop shadow */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl xl:text-4xl font-black tracking-tight text-white leading-tight drop-shadow-sm">
                Kütahya Dumlupınar Üniversitesi Öğrenci Platformu
              </h1>
              <p className="text-xs sm:text-sm text-white/90 font-normal leading-relaxed max-w-xl drop-shadow-sm">
                Doğrulanmış ikinci el pazar, topluluklar ve kampüs dayanışma ağı
              </p>
            </div>

            {/* Sleek Translucent Glass Campus Metrics Strip */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3 grid grid-cols-3 divide-x divide-white/15 shadow-lg">
              <div className="pr-4">
                <div className="text-xl sm:text-2xl font-black text-white tabular-nums tracking-tight">1.450+</div>
                <div className="text-[11px] sm:text-xs text-white/80 font-medium mt-0.5">Aktif DPÜ Öğrencisi</div>
              </div>
              <div className="px-4">
                <div className="text-xl sm:text-2xl font-black text-white tabular-nums tracking-tight">380+</div>
                <div className="text-[11px] sm:text-xs text-white/80 font-medium mt-0.5">İlan, Not & Etkinlik</div>
              </div>
              <div className="pl-4">
                <div className="text-lg sm:text-xl font-bold text-white tracking-tight leading-tight">Evliya Çelebi</div>
                <div className="text-[11px] sm:text-xs text-white/80 font-medium mt-0.5">& Germiyan Yerleşkesi</div>
              </div>
            </div>

            {/* Footer Metadata */}
            <div className="pt-1.5 text-[11px] text-white/60 flex items-center justify-between border-t border-white/10">
              <span>© 2026 DPÜ Kampüs</span>
              <span>Evliya Çelebi Yerleşkesi · Kütahya</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Modern Slate Canvas with Floating Elevated Auth Card */}
        <div className="lg:col-span-5 h-full bg-[#F8FAFC] px-4 sm:px-6 lg:px-6 xl:px-8 py-4 sm:py-6 flex flex-col justify-center items-center overflow-y-auto lg:overflow-hidden border-l border-slate-200/80">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_20px_50px_rgba(15,23,42,0.06)] p-6 sm:p-7 max-w-[420px] w-full transition-all">
            
            {/* Mobile Header (only visible on small screens where left video column is hidden) */}
            <div className="lg:hidden flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <img
                  src="/images/dpu-logo.png"
                  alt="DPÜ Logo"
                  className="w-8 h-8 rounded-full object-cover bg-white ring-1 ring-slate-200"
                />
                <span className="text-base font-bold text-slate-900">DPÜ Kampüs</span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                @ogr.dpu.edu.tr
              </span>
            </div>

            {/* Header Text */}
            <div className="mb-3.5">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                {tab === 'login' ? 'Öğrenci Girişi' : 'Yeni Öğrenci Kaydı'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {tab === 'login'
                  ? 'Üniversite hesabınızla kampüs ağına bağlanın'
                  : 'Yalnızca DPÜ öğrencileri için doğrulanmış hesap'}
              </p>
            </div>

            {/* Upgraded Tab Switcher: Segmented Control with White Pill */}
            <div className="grid grid-cols-2 p-1 bg-slate-100/90 border border-slate-200/70 rounded-xl mb-3.5 gap-1">
              <button
                type="button"
                onClick={() => { setTab('login'); setError(null); }}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  tab === 'login'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Giriş Yap
              </button>
              <button
                type="button"
                onClick={() => { setTab('register'); setError(null); }}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  tab === 'register'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Kayıt Ol
              </button>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span className="leading-snug font-medium">{error}</span>
              </div>
            )}

            {/* LOGIN FORM */}
            {tab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Öğrenci E-postası
                  </label>
                  <div className="relative flex items-center h-10 rounded-xl bg-slate-50/70 border border-slate-200 focus-within:bg-white focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/15 transition-all">
                    <Mail className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
                    <input
                      type="email"
                      required
                      placeholder="ad.soyad@ogr.dpu.edu.tr"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full h-full pl-2.5 pr-3 bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Yalnızca @ogr.dpu.edu.tr uzantılı e-posta geçerlidir.
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Şifre
                  </label>
                  <div className="relative flex items-center h-10 rounded-xl bg-slate-50/70 border border-slate-200 focus-within:bg-white focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/15 transition-all">
                    <Lock className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full h-full pl-2.5 pr-9 bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 px-4 bg-[#0F172A] hover:bg-[#0F766E] text-white text-xs font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>{loading ? 'Doğrulanıyor...' : 'Giriş Yap'}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </form>
            )}

            {/* REGISTER FORM */}
            {tab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                    Ad Soyad
                  </label>
                  <div className="relative flex items-center h-9.5 rounded-xl bg-slate-50/70 border border-slate-200 focus-within:bg-white focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/15 transition-all">
                    <User className="w-3.5 h-3.5 text-slate-400 ml-3 shrink-0" />
                    <input
                      type="text"
                      required
                      placeholder="Adınız Soyadınız"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full h-full pl-2.5 pr-3 bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                    Öğrenci E-postası
                  </label>
                  <div className="relative flex items-center h-9.5 rounded-xl bg-slate-50/70 border border-slate-200 focus-within:bg-white focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/15 transition-all">
                    <Mail className="w-3.5 h-3.5 text-slate-400 ml-3 shrink-0" />
                    <input
                      type="email"
                      required
                      placeholder="ad.soyad@ogr.dpu.edu.tr"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="w-full h-full pl-2.5 pr-3 bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                    Fakülte / MYO
                  </label>
                  <div className="relative flex items-center h-9.5 rounded-xl bg-slate-50/70 border border-slate-200 focus-within:bg-white focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/15 transition-all">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 ml-3 shrink-0" />
                    <select
                      value={faculty}
                      onChange={(e) => setFaculty(e.target.value)}
                      className="w-full h-full pl-2.5 pr-3 bg-transparent text-xs text-slate-900 focus:outline-none"
                    >
                      {FACULTIES.map((fac) => (
                        <option key={fac} value={fac}>{fac}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                    Şifre Belirleyin
                  </label>
                  <div className="relative flex items-center h-9.5 rounded-xl bg-slate-50/70 border border-slate-200 focus-within:bg-white focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/15 transition-all">
                    <Lock className="w-3.5 h-3.5 text-slate-400 ml-3 shrink-0" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="En az 6 karakter"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      className="w-full h-full pl-2.5 pr-9 bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 px-4 bg-[#0F172A] hover:bg-[#0F766E] text-white text-xs font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center justify-center gap-2 group cursor-pointer mt-1"
                >
                  <span>{loading ? 'Hesap Oluşturuluyor...' : 'Öğrenci Hesabı Oluştur'}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </form>
            )}

            {/* Subtle Divider */}
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-white px-2 text-slate-400 font-medium tracking-wider">Hızlı Erişim</span>
              </div>
            </div>

            {/* Refined Emerald Interactive Demo Quick-Login Card */}
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200/80 rounded-xl p-2.5 sm:p-3 flex items-center justify-between text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                  EA
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Demo Öğrenci ile Doğrudan Gir</span>
                    <span className="text-[9px] font-semibold text-emerald-800 bg-emerald-200/70 px-1.5 py-0.2 rounded">Tek Tık</span>
                  </div>
                  <div className="text-[11px] text-slate-500">efe.alsac@ogr.dpu.edu.tr</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-emerald-700 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
