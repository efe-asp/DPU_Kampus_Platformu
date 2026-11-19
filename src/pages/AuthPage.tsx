import React, { useState } from 'react';
import { BadgeCheck, Eye, EyeOff, AlertCircle } from 'lucide-react';
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
    <div className="h-screen w-screen overflow-hidden bg-[#F2F3F5] flex items-center justify-center font-sans select-none">
      <div className="h-full w-full bg-white grid grid-cols-1 lg:grid-cols-12 overflow-hidden shadow-none">
        
        {/* LEFT COLUMN: Campus Drone Aerial Video with Official Emblem and Metrics */}
        <div className="hidden lg:flex lg:col-span-7 h-full relative overflow-hidden flex-col justify-between p-8 xl:p-12">
          {/* Full-bleed background video */}
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

          {/* Calibrated Dark Navy / Emerald Gradient Scrim */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#091526]/95 via-[#091526]/55 to-[#091526]/30 pointer-events-none"
            aria-hidden="true"
          />

          {/* Top Brand Area (Official DPÜ Emblem Logo - No green pill badge) */}
          <div className="relative z-10 flex items-center gap-3">
            <img
              src="/images/dpu-logo.png"
              alt="Kütahya Dumlupınar Üniversitesi Amblemi"
              className="w-11 h-11 rounded-full object-cover bg-white p-0.5 ring-2 ring-white/30 shadow-md"
            />
            <div>
              <span className="text-xl font-black tracking-tight text-white block leading-none">
                DPÜ Kampüs
              </span>
              <span className="text-[11px] text-white/75 font-medium tracking-wide">
                Dumlupınar Üniversitesi
              </span>
            </div>
          </div>

          {/* Middle is deliberately open so campus drone video shines through clearly */}
          <div className="relative z-10 flex-1" />

          {/* Bottom-Aligned Content Stack */}
          <div className="relative z-10 space-y-4">
            {/* Headings */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl xl:text-4xl font-black tracking-tight text-white leading-tight">
                Kütahya Dumlupınar Üniversitesi Öğrenci Platformu
              </h1>
              <p className="text-xs sm:text-sm text-white/80 font-normal leading-relaxed max-w-xl">
                Doğrulanmış ikinci el pazar, topluluklar ve kampüs dayanışma ağı
              </p>
            </div>

            {/* Sleek Translucent Glass Campus Metrics Strip */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-5 py-3.5 grid grid-cols-3 divide-x divide-white/15 shadow-lg">
              <div className="pr-4">
                <div className="text-xl sm:text-2xl font-black text-white tabular-nums tracking-tight">1.450+</div>
                <div className="text-[11px] sm:text-xs text-white/75 font-medium mt-0.5">Aktif DPÜ Öğrencisi</div>
              </div>
              <div className="px-4">
                <div className="text-xl sm:text-2xl font-black text-white tabular-nums tracking-tight">380+</div>
                <div className="text-[11px] sm:text-xs text-white/75 font-medium mt-0.5">İlan, Not & Etkinlik</div>
              </div>
              <div className="pl-4">
                <div className="text-lg sm:text-xl font-bold text-white tracking-tight leading-tight">Evliya Çelebi</div>
                <div className="text-[11px] sm:text-xs text-white/75 font-medium mt-0.5">& Germiyan Yerleşkesi</div>
              </div>
            </div>

            {/* Footer Metadata */}
            <div className="pt-2 text-[11px] text-white/50 flex items-center justify-between border-t border-white/10">
              <span>© 2026 DPÜ Kampüs</span>
              <span>Evliya Çelebi Yerleşkesi · Kütahya</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Auth Form (Strict Single Viewport Fit, Zero Scroll) */}
        <div className="lg:col-span-5 h-full bg-white px-6 sm:px-10 lg:px-8 xl:px-12 py-6 flex flex-col justify-center overflow-y-auto lg:overflow-hidden border-l border-[#E4E4E7]">
          <div className="w-full max-w-sm mx-auto">
            
            {/* Mobile Header (only visible on small screens where left video column is hidden) */}
            <div className="lg:hidden flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <img
                  src="/images/dpu-logo.png"
                  alt="DPÜ Logo"
                  className="w-8 h-8 rounded-full object-cover bg-white ring-1 ring-zinc-200"
                />
                <span className="text-base font-bold text-[#18181B]">DPÜ Kampüs</span>
              </div>
              <span className="text-[10px] font-semibold text-[#0F766E] bg-[#0F766E]/10 px-2 py-0.5 rounded-full">
                @ogr.dpu.edu.tr
              </span>
            </div>

            {/* Header Text */}
            <div className="mb-4">
              <h2 className="text-lg font-bold text-[#18181B] tracking-tight">
                {tab === 'login' ? 'Öğrenci Girişi' : 'Yeni Öğrenci Kaydı'}
              </h2>
              <p className="text-xs text-[#71717A] mt-0.5">
                {tab === 'login'
                  ? 'Üniversite hesabınızla kampüs ağına bağlanın'
                  : 'Yalnızca DPÜ öğrencileri için doğrulanmış hesap'}
              </p>
            </div>

            {/* Tabs */}
            <div className="grid grid-cols-2 p-1 bg-[#F7F7F5] border border-[#E4E4E7] rounded-xl mb-4">
              <button
                type="button"
                onClick={() => { setTab('login'); setError(null); }}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  tab === 'login'
                    ? 'bg-white text-[#18181B] shadow-xs border border-[#E4E4E7]'
                    : 'text-[#71717A] hover:text-[#18181B]'
                }`}
              >
                Giriş Yap
              </button>
              <button
                type="button"
                onClick={() => { setTab('register'); setError(null); }}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  tab === 'register'
                    ? 'bg-white text-[#18181B] shadow-xs border border-[#E4E4E7]'
                    : 'text-[#71717A] hover:text-[#18181B]'
                }`}
              >
                Kayıt Ol
              </button>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-3.5 p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span className="leading-snug font-medium">{error}</span>
              </div>
            )}

            {/* LOGIN FORM */}
            {tab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#18181B] mb-1">
                    Öğrenci E-postası
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ad.soyad@ogr.dpu.edu.tr"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-[#E4E4E7] rounded-xl text-xs text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#18181B] focus:ring-1 focus:ring-[#18181B] transition-colors"
                  />
                  <span className="text-[10px] text-[#71717A] mt-1 block">
                    Yalnızca @ogr.dpu.edu.tr uzantılı e-posta geçerlidir.
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#18181B] mb-1">
                    Şifre
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full h-10 px-3 bg-white border border-[#E4E4E7] rounded-xl text-xs text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#18181B] focus:ring-1 focus:ring-[#18181B] transition-colors pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-[#18181B]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 px-4 bg-[#18181B] hover:bg-[#27272A] text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xs flex items-center justify-center gap-2"
                >
                  {loading ? 'Doğrulanıyor...' : 'Giriş Yap'}
                </button>
              </form>
            )}

            {/* REGISTER FORM */}
            {tab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-[#18181B] mb-1">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Adınız Soyadınız"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-9.5 px-3 bg-white border border-[#E4E4E7] rounded-xl text-xs text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#18181B] focus:ring-1 focus:ring-[#18181B] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#18181B] mb-1">
                    Öğrenci E-postası
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ad.soyad@ogr.dpu.edu.tr"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className="w-full h-9.5 px-3 bg-white border border-[#E4E4E7] rounded-xl text-xs text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#18181B] focus:ring-1 focus:ring-[#18181B] transition-colors"
                  />
                  <span className="text-[10px] text-[#71717A] mt-0.5 block">
                    Doğrulama @ogr.dpu.edu.tr adresinize bağlıdır.
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#18181B] mb-1">
                    Fakülte / MYO
                  </label>
                  <select
                    value={faculty}
                    onChange={(e) => setFaculty(e.target.value)}
                    className="w-full h-9.5 px-3 bg-white border border-[#E4E4E7] rounded-xl text-xs text-[#18181B] focus:outline-none focus:border-[#18181B] focus:ring-1 focus:ring-[#18181B] transition-colors"
                  >
                    {FACULTIES.map((fac) => (
                      <option key={fac} value={fac}>{fac}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#18181B] mb-1">
                    Şifre Belirleyin
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="En az 6 karakter"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      className="w-full h-9.5 px-3 bg-white border border-[#E4E4E7] rounded-xl text-xs text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#18181B] focus:ring-1 focus:ring-[#18181B] transition-colors pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-[#18181B]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 px-4 bg-[#18181B] hover:bg-[#27272A] text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
                >
                  {loading ? 'Hesap Oluşturuluyor...' : 'Öğrenci Hesabı Oluştur'}
                </button>
              </form>
            )}

            {/* Subtle Divider */}
            <div className="relative my-3.5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E4E4E7]" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-white px-2 text-[#71717A] font-medium tracking-wider">Hızlı Erişim</span>
              </div>
            </div>

            {/* Demo Student Login Button */}
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full h-10 px-3 border border-[#E4E4E7] hover:border-[#18181B] bg-[#F7F7F5] hover:bg-white text-xs font-semibold text-[#18181B] rounded-xl transition-colors flex items-center justify-center gap-2 group"
            >
              <BadgeCheck className="w-4 h-4 text-[#0F766E] group-hover:scale-110 transition-transform" />
              <span>Demo Öğrenci ile Doğrudan Gir</span>
            </button>
            <p className="text-center text-[10px] text-[#A1A1AA] mt-2">
              Örnek hesap: efe.alsac@ogr.dpu.edu.tr
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
