import React, { useState } from 'react';
import { ShieldCheck, QrCode, BookOpen, BadgeCheck, Eye, EyeOff, AlertCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-[#F2F3F5] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-10 font-sans">
      <div className="w-full max-w-5xl bg-white border border-[#E4E4E7] rounded-2xl shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        
        {/* LEFT COLUMN: Rich Navy-to-Emerald Campus Canvas */}
        <div
          className="lg:col-span-7 border-b lg:border-b-0 lg:border-r border-transparent p-8 sm:p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0F172A 0%, #0F3460 50%, #115E59 100%)' }}
        >
          {/* Architectural grid texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
              backgroundSize: '40px 40px',
            }}
          />
          <div className="relative z-10">
            {/* Header branding */}
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-sm border border-white/20">
                <BadgeCheck className="w-5 h-5 text-[#34D399]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">DPÜ Kampüs</span>
              <span className="text-[10px] font-semibold text-[#34D399] bg-[#34D399]/15 px-2 py-0.5 rounded-full border border-[#34D399]/30">
                Doğrulanmış Ağ
              </span>
            </div>

            {/* Campus Illustration */}
            <div className="w-full rounded-xl overflow-hidden mb-6 flex items-center justify-center bg-white/5 border border-white/10 p-2">
              <img
                src="/images/auth-campus.svg"
                alt="DPÜ Evliya Çelebi Kampüsü"
                className="w-full h-auto max-h-[190px] object-contain"
              />
            </div>

            {/* Subtitle */}
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2 leading-snug">
              Kütahya Dumlupınar Üniversitesi Öğrenci Platformu
            </h1>
            <p className="text-sm text-white/60 leading-relaxed mb-5">
              Dumlupınar Üniversitesi öğrencilerine özel doğrulanmış pazar, topluluk ve kampüs dayanışma ağı
            </p>

            {/* Live campus pulse row */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-6 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/15">
              <span className="text-xs font-semibold text-[#34D399]">1.450+</span>
              <span className="text-xs text-white/70">Doğrulanmış DPÜ Öğrencisi</span>
              <span className="text-white/30 text-xs">•</span>
              <span className="text-xs font-semibold text-[#34D399]">380+</span>
              <span className="text-xs text-white/70">Aktif İlan</span>
              <span className="text-white/30 text-xs">•</span>
              <span className="text-xs font-semibold text-[#34D399]">%100</span>
              <span className="text-xs text-white/70">Kampüs İçi Güven</span>
            </div>

            {/* 3 glass feature cards */}
            <div className="space-y-2.5 border-t border-white/15 pt-5">
              <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/15">
                <div className="w-7 h-7 rounded-lg bg-[#34D399]/20 border border-[#34D399]/30 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-[#34D399]" />
                </div>
                <span className="text-sm font-medium text-white/90">Yalnızca @ogr.dpu.edu.tr Onaylı Öğrenciler</span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/15">
                <div className="w-7 h-7 rounded-lg bg-[#34D399]/20 border border-[#34D399]/30 flex items-center justify-center shrink-0">
                  <QrCode className="w-4 h-4 text-[#34D399]" />
                </div>
                <span className="text-sm font-medium text-white/90">Kampüs İçi QR Kodlu Güvenli Teslimat</span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/15">
                <div className="w-7 h-7 rounded-lg bg-[#34D399]/20 border border-[#34D399]/30 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4 text-[#34D399]" />
                </div>
                <span className="text-sm font-medium text-white/90">Topluluklar, Kayıp Eşya ve Ders Notu Arşivi</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 text-xs text-white/40 flex items-center justify-between border-t border-white/15 mt-6">
            <span>© 2026 DPÜ Kampüs</span>
            <span>Evliya Çelebi Yerleşkesi · Kütahya</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Auth Card & Forms */}
        <div className="lg:col-span-5 bg-white p-8 sm:p-10 flex flex-col justify-center">
          <div className="w-full max-w-sm mx-auto">
            {/* Tabs */}
            <div className="grid grid-cols-2 p-1 bg-[#F7F7F5] border border-[#E4E4E7] rounded-xl mb-6">
              <button
                type="button"
                onClick={() => { setTab('login'); setError(null); }}
                className={`py-2 text-sm font-semibold rounded-lg transition-all ${
                  tab === 'login'
                    ? 'bg-white text-[#18181B] shadow-sm border border-[#E4E4E7]'
                    : 'text-[#71717A] hover:text-[#18181B]'
                }`}
              >
                Giriş Yap
              </button>
              <button
                type="button"
                onClick={() => { setTab('register'); setError(null); }}
                className={`py-2 text-sm font-semibold rounded-lg transition-all ${
                  tab === 'register'
                    ? 'bg-white text-[#18181B] shadow-sm border border-[#E4E4E7]'
                    : 'text-[#71717A] hover:text-[#18181B]'
                }`}
              >
                Kayıt Ol
              </button>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{error}</span>
              </div>
            )}

            {/* LOGIN FORM */}
            {tab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#18181B] mb-1.5">
                    Öğrenci E-postası
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ad.soyad@ogr.dpu.edu.tr"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E4E4E7] rounded-xl text-sm text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#18181B] focus:ring-1 focus:ring-[#18181B] transition-colors"
                  />
                  <span className="text-[11px] text-[#71717A] mt-1 block">
                    Yalnızca @ogr.dpu.edu.tr uzantılı e-posta geçerlidir.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#18181B] mb-1.5">
                    Şifre
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E4E4E7] rounded-xl text-sm text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#18181B] focus:ring-1 focus:ring-[#18181B] transition-colors pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-[#18181B]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-[#18181B] hover:bg-[#27272A] text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {loading ? 'Doğrulanıyor...' : 'Giriş Yap'}
                </button>
              </form>
            )}

            {/* REGISTER FORM */}
            {tab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#18181B] mb-1.5">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Adınız Soyadınız"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E4E4E7] rounded-xl text-sm text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#18181B] focus:ring-1 focus:ring-[#18181B] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#18181B] mb-1.5">
                    Öğrenci E-postası
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ad.soyad@ogr.dpu.edu.tr"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E4E4E7] rounded-xl text-sm text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#18181B] focus:ring-1 focus:ring-[#18181B] transition-colors"
                  />
                  <span className="text-[11px] text-[#71717A] mt-1 block">
                    Doğrulama @ogr.dpu.edu.tr adresinize bağlıdır.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#18181B] mb-1.5">
                    Fakülte / MYO
                  </label>
                  <select
                    value={faculty}
                    onChange={(e) => setFaculty(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E4E4E7] rounded-xl text-sm text-[#18181B] focus:outline-none focus:border-[#18181B] focus:ring-1 focus:ring-[#18181B] transition-colors"
                  >
                    {FACULTIES.map((fac) => (
                      <option key={fac} value={fac}>{fac}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#18181B] mb-1.5">
                    Şifre Belirleyin
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="En az 6 karakter"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E4E4E7] rounded-xl text-sm text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#18181B] focus:ring-1 focus:ring-[#18181B] transition-colors pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-[#18181B]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-[#18181B] hover:bg-[#27272A] text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {loading ? 'Hesap Oluşturuluyor...' : 'Öğrenci Hesabı Oluştur'}
                </button>
              </form>
            )}

            {/* Subtle Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E4E4E7]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-[#71717A] font-medium">Hızlı Erişim</span>
              </div>
            </div>

            {/* Demo Student Login Button */}
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full py-2 px-3 border border-[#E4E4E7] hover:border-[#18181B] bg-[#F7F7F5] hover:bg-white text-xs font-semibold text-[#18181B] rounded-xl transition-colors flex items-center justify-center gap-2 group"
            >
              <BadgeCheck className="w-3.5 h-3.5 text-[#0F766E] group-hover:scale-110 transition-transform" />
              <span>Demo Öğrenci Hesabıyla Gir (efe.alsac@ogr.dpu.edu.tr)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
