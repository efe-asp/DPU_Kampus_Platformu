import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Keyboard, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import EDevletLogo from '../components/EDevletLogo';
import { ApiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

type AuthMethodTab = 'password' | 'esign' | 'banking' | 'other';

const TABS: { id: AuthMethodTab; label: string }[] = [
  { id: 'password', label: 'e-Devlet Şifresi' },
  { id: 'esign', label: 'Elektronik İmza' },
  { id: 'banking', label: 'İnternet Bankacılığı' },
  { id: 'other', label: 'Diğer Yöntemler ▼' },
];

export default function EDevletAuthPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [activeTab, setActiveTab] = useState<AuthMethodTab>('password');
  const [tcKimlikNo, setTcKimlikNo] = useState('');
  const [showTc, setShowTc] = useState(true);
  const [password, setPassword] = useState('');
  const [activeKeypad, setActiveKeypad] = useState<'tc' | 'pw' | null>(null);
  const [infoText, setInfoText] = useState<'how' | 'forgot' | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFillDemo = () => {
    setActiveTab('password');
    setTcKimlikNo('10148757384');
    setPassword('••••••••••••');
    setShowTc(true);
    setError(null);
  };

  const handleKeypadPress = (char: string) => {
    if (activeKeypad === 'tc') {
      if (char === 'DEL') {
        setTcKimlikNo((prev) => prev.slice(0, -1));
      } else if (/^\d$/.test(char)) {
        setTcKimlikNo((prev) => (prev + char).slice(0, 11));
      }
    } else if (activeKeypad === 'pw') {
      if (char === 'DEL') {
        setPassword((prev) => prev.slice(0, -1));
      } else {
        setPassword((prev) => prev + char);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setActiveKeypad(null);

    const cleanedTc = tcKimlikNo.replace(/\D/g, '');
    if (!/^[1-9]\d{10}$/.test(cleanedTc)) {
      setError('Lütfen 0 ile başlamayan geçerli 11 haneli T.C. Kimlik Numaranızı giriniz.');
      return;
    }
    if (!password || password.length < 4) {
      setError('Lütfen en az 4 karakterli e-Devlet şifrenizi giriniz.');
      return;
    }

    setIsVerifying(true);
    try {
      const startedAt = Date.now();
      const response = await ApiService.edevletLogin({
        tcKimlikNo: cleanedTc,
        password,
        fullName: 'Efe Alsaç',
        faculty: 'Bilgisayar Programcılığı',
      });

      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(0, 1000 - elapsed);

      setTimeout(() => {
        login(
          {
            ...response.user,
            fullName: 'Efe Alsaç',
            faculty: 'Bilgisayar Programcılığı',
            verifiedStudent: true,
          },
          response.token
        );
        navigate('/');
      }, remaining);
    } catch (err: any) {
      setIsVerifying(false);
      setError(err?.message || 'Kimlik doğrulama sırasında bir hata oluştu.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F2F4F7] flex flex-col justify-between font-sans text-slate-800 select-none">
      {/* 1-Second Verification Loading Overlay */}
      {isVerifying && (
        <div
          className="fixed inset-0 z-50 bg-[#F2F4F7]/95 backdrop-blur-xs flex items-center justify-center p-4"
          role="status"
          aria-live="polite"
        >
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-md max-w-md w-full p-7 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
              <Loader2 className="w-7 h-7 text-[#0066CC] animate-spin" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-sm font-bold text-slate-900 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#0066CC]" />
                <span>e-Devlet &amp; DPÜ Doğrulaması</span>
              </h2>
              <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                Kimliğiniz doğrulanıyor, DPÜ Öğrenci Bilgi Sistemi kontrol ediliyor...
              </p>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#0066CC] w-2/3 animate-pulse rounded-full" />
            </div>
          </div>
        </div>
      )}

      {/* Top Spacer for Vertical Centering */}
      <div className="hidden sm:block h-6" aria-hidden="true" />

      {/* Centered Card Wrapper */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        <div className="w-full max-w-[680px] bg-[#FFFFFF] rounded-xl shadow-md border border-[#E2E8F0] px-6 sm:px-9 py-7">
          {/* 2. Kart Üst Başlık Alanı (Header) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5">
            {/* Left: Red droplet/shield e-Devlet logo + Bold Title + Subtitle */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-12 rounded-t-md rounded-b-[22px] bg-[#E30A17] text-white flex items-center justify-center shadow-xs shrink-0">
                <EDevletLogo className="w-8 h-6" />
              </div>
              <div>
                <h1 className="text-[20px] sm:text-[22px] font-bold text-slate-800 tracking-tight leading-tight">
                  e-Devlet Kapısı
                </h1>
                <p className="text-[10px] sm:text-[11px] font-normal tracking-wider text-slate-500 uppercase mt-0.5">
                  KİMLİK DOĞRULAMA SİSTEMİ
                </p>
              </div>
            </div>

            {/* Right: DPÜ emblem + Dark blue (#004B93) badge + URL */}
            <div className="flex flex-col sm:items-end text-left sm:text-right">
              <div className="inline-flex items-center gap-2 bg-[#004B93] text-white pl-1.5 pr-3.5 py-1.5 rounded-full shadow-xs">
                <img
                  src="/images/dpu-logo.png"
                  alt="Kütahya Dumlupınar Üniversitesi Amblemi"
                  className="w-6 h-6 rounded-full object-cover bg-white p-0.5 shrink-0"
                />
                <span className="text-[11px] font-semibold leading-tight">
                  Kütahya Dumlupınar Üni. / DPÜ Kampüs Platformu
                </span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1.5">
                https://kampus.dpu.edu.tr
              </span>
            </div>
          </div>

          {/* 3. Doğrulama Yöntemi Sekmeleri (Tabs) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  disabled={isVerifying}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setError(null);
                    setInfoText(null);
                  }}
                  className={`py-2 px-2.5 rounded-lg text-xs transition-all cursor-pointer truncate ${
                    isActive
                      ? 'bg-white border border-slate-300 shadow-xs text-slate-900 font-semibold'
                      : 'bg-[#E9ECEF] border border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 font-medium'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {activeTab !== 'password' ? (
            <div className="py-8 px-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-center space-y-3 mb-2">
              <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed max-w-md mx-auto">
                Akademik proje simülasyonunda <strong>e-Devlet Şifresi</strong> sekmesi üzerinden test girişi yapılabilmektedir.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('password')}
                className="px-6 py-2 rounded-full text-xs font-semibold text-white bg-[#0066CC] hover:bg-[#0052A3] transition-colors cursor-pointer"
              >
                e-Devlet Şifresi Sekmesine Geç
              </button>
            </div>
          ) : (
            <>
              {/* 4. Bilgilendirme Metni */}
              <div className="mb-4">
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                  T.C. Kimlik Numaranızı ve e-Devlet Şifrenizi kullanarak kimliğiniz doğrulandıktan sonra işleminize kaldığınız yerden devam edebilirsiniz.{' '}
                  <button
                    type="button"
                    onClick={() => setInfoText((prev) => (prev === 'how' ? null : 'how'))}
                    className="text-[#0066CC] underline hover:text-[#0052A3] font-medium cursor-pointer"
                  >
                    e-Devlet Şifresi Nedir, Nasıl Alınır?
                  </button>
                </p>
              </div>

              {infoText === 'how' && (
                <div className="mb-4 p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-[11px] text-slate-700 leading-relaxed">
                  Bu ekran DPÜ Kampüs Platformu akademik sunum simülasyonudur. Test için{' '}
                  <button
                    type="button"
                    onClick={handleFillDemo}
                    className="text-[#0066CC] underline font-semibold cursor-pointer"
                  >
                    Demo Öğrenci Doldur
                  </button>{' '}
                  bağlantısını kullanabilirsiniz.
                </div>
              )}

              {infoText === 'forgot' && (
                <div className="mb-4 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
                  Simülasyon modunda şifre sıfırlama yerine <strong>Demo Öğrenci Doldur</strong> ile tek tıkla giriş yapabilirsiniz.
                </div>
              )}

              {/* Subtle Demo Student Fill Link */}
              <div className="flex justify-end mb-2.5">
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="text-[11px] text-slate-400 hover:text-[#0066CC] underline transition-colors cursor-pointer"
                >
                  Demo Öğrenci Doldur
                </button>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="mb-4 p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span className="font-medium">{error}</span>
                </div>
              )}

              {/* Form Alanları */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Satır 1: * T.C. Kimlik No */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-1.5 sm:gap-4">
                  <label
                    htmlFor="edevlet-tc"
                    className="sm:col-span-4 text-xs sm:text-[13px] font-medium text-slate-700 sm:text-right"
                  >
                    <span className="text-[#E30A17] mr-1">*</span>T.C. Kimlik No
                  </label>
                  <div className="sm:col-span-8 relative flex items-center">
                    <input
                      id="edevlet-tc"
                      type={showTc ? 'text' : 'password'}
                      inputMode="numeric"
                      maxLength={11}
                      required
                      disabled={isVerifying}
                      value={tcKimlikNo}
                      onChange={(e) => setTcKimlikNo(e.target.value.replace(/\D/g, '').slice(0, 11))}
                      className="w-full h-10 pl-3.5 pr-16 rounded-md bg-[#EBF2FA] border border-slate-300/80 text-sm text-slate-900 focus:bg-white focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20 focus:outline-none transition-all tabular-nums"
                    />
                    <div className="absolute right-2.5 flex items-center gap-2">
                      <button
                        type="button"
                        disabled={isVerifying}
                        onClick={() => setShowTc(!showTc)}
                        className="text-slate-500 hover:text-slate-800 cursor-pointer"
                        aria-label={showTc ? 'T.C. Kimlik No Gizle' : 'T.C. Kimlik No Göster'}
                      >
                        {showTc ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        type="button"
                        disabled={isVerifying}
                        onClick={() => setActiveKeypad((prev) => (prev === 'tc' ? null : 'tc'))}
                        className={`cursor-pointer transition-colors ${
                          activeKeypad === 'tc' ? 'text-[#0066CC]' : 'text-slate-500 hover:text-slate-800'
                        }`}
                        aria-label="Sanal Klavye"
                        title="Sanal Klavye"
                      >
                        <Keyboard className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Satır 2: * e-Devlet Şifresi */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-start gap-1.5 sm:gap-4">
                  <label
                    htmlFor="edevlet-pw"
                    className="sm:col-span-4 text-xs sm:text-[13px] font-medium text-slate-700 sm:text-right sm:pt-2.5"
                  >
                    <span className="text-[#E30A17] mr-1">*</span>e-Devlet Şifresi
                  </label>
                  <div className="sm:col-span-8">
                    <div className="relative flex items-center">
                      <input
                        id="edevlet-pw"
                        type="password"
                        required
                        disabled={isVerifying}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-10 pl-3.5 pr-10 rounded-md bg-[#EBF2FA] border border-slate-300/80 text-sm text-slate-900 focus:bg-white focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20 focus:outline-none transition-all"
                      />
                      <button
                        type="button"
                        disabled={isVerifying}
                        onClick={() => setActiveKeypad((prev) => (prev === 'pw' ? null : 'pw'))}
                        className={`absolute right-2.5 cursor-pointer transition-colors ${
                          activeKeypad === 'pw' ? 'text-[#0066CC]' : 'text-slate-500 hover:text-slate-800'
                        }`}
                        aria-label="Sanal Klavye"
                        title="Sanal Klavye"
                      >
                        <Keyboard className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Optional compact virtual keypad when keyboard icon clicked */}
                    {activeKeypad && (
                      <div className="mt-2 p-2 rounded-lg bg-slate-50 border border-slate-200 flex flex-wrap gap-1">
                        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'DEL'].map((key) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => handleKeypadPress(key)}
                            className="px-2.5 py-1 text-xs font-semibold bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700 cursor-pointer"
                          >
                            {key === 'DEL' ? 'Sil' : key}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Password warning + right-aligned Forgot Password link */}
                    <p className="text-[11px] text-slate-500 mt-2 leading-snug">
                      * e-Devlet şifrenizi unutmanız durumunda doğruladığınız cep telefonunuzdan yenileme işlemi yapabilirsiniz.
                    </p>
                    <div className="flex justify-end mt-2">
                      <button
                        type="button"
                        onClick={() => setInfoText((prev) => (prev === 'forgot' ? null : 'forgot'))}
                        className="text-xs font-semibold text-[#0066CC] underline hover:text-[#0052A3] cursor-pointer"
                      >
                        Şifremi Unuttum
                      </button>
                    </div>
                  </div>
                </div>

                {/* 5. Butonlar: Sol %35 İptal, Sağ %65 Giriş Yap */}
                <div className="flex items-center gap-3 pt-4 max-w-[440px] mx-auto">
                  <button
                    type="button"
                    disabled={isVerifying}
                    onClick={() => navigate('/auth')}
                    className="w-[35%] h-10 rounded-full text-xs sm:text-[13px] font-semibold text-slate-700 bg-[#E5E7EB] hover:bg-slate-300 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-[65%] h-10 rounded-full text-xs sm:text-[13px] font-semibold text-white bg-[#0066CC] hover:bg-[#0052A3] transition-colors shadow-sm cursor-pointer disabled:opacity-60"
                  >
                    Giriş Yap
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </main>

      {/* 6. Sayfa Alt Bilgisi (Footer) */}
      <footer className="w-full py-4 px-4 text-[11px] text-slate-500">
        <div className="max-w-[780px] mx-auto flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 whitespace-nowrap">
          <span className="font-semibold tracking-wide text-slate-600">
            SİBER GÜVENLİK BAŞKANLIĞI
          </span>
          <span className="font-extrabold tracking-tight text-[#E30A17]">
            TÜRKSAT
          </span>
          <span>© 2026, Ankara - Tüm Hakları Saklıdır</span>
          <button
            type="button"
            onClick={() => setInfoText('how')}
            className="hover:underline text-slate-600 cursor-pointer"
          >
            Gizlilik ve Güvenlik
          </button>
          <button
            type="button"
            onClick={() => setInfoText('forgot')}
            className="hover:underline text-slate-600 cursor-pointer"
          >
            Hızlı Çözüm Merkezi
          </button>
        </div>
      </footer>
    </div>
  );
}
