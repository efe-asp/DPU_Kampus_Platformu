import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Eye,
  EyeOff,
  AlertCircle,
  User,
  Mail,
  Building2,
  Lock,
  ArrowRight,
  Loader2,
  ChevronDown,
  X,
  CheckCircle2,
  MailOpen,
} from 'lucide-react';
import { ApiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import EDevletLogo from '../components/EDevletLogo';

// ─── Faculty Data ─────────────────────────────────────────────────────────────
const FACULTY_GROUPS = [
  {
    label: 'Fakülteler',
    items: [
      'Diş Hekimliği Fakültesi',
      'Eğitim Fakültesi',
      'Fen-Edebiyat Fakültesi',
      'Güzel Sanatlar Fakültesi',
      'İktisadi ve İdari Bilimler Fakültesi',
      'İlahiyat Fakültesi',
      'Mimarlık Fakültesi',
      'Mühendislik Fakültesi',
      'Sağlık Bilimleri Fakültesi',
      'Spor Bilimleri Fakültesi',
      'Tavşanlı Uygulamalı Bilimler Fakültesi',
      'Uygulamalı Bilimler Fakültesi',
    ],
  },
  {
    label: 'Meslek Yüksekokulları (MYO)',
    items: [
      'Altıntaş Meslek Yüksekokulu',
      'Domaniç Hayme Ana Meslek Yüksekokulu',
      'Dumlupınar Meslek Yüksekokulu',
      'Emet Meslek Yüksekokulu',
      'Gediz Meslek Yüksekokulu',
      'Gediz Sağlık Hizmetleri Meslek Yüksekokulu',
      'Hisarcık Meslek Yüksekokulu',
      'Kütahya Güzel Sanatlar Meslek Yüksekokulu',
      'Kütahya Sosyal Bilimler Meslek Yüksekokulu',
      'Kütahya Teknik Bilimler Meslek Yüksekokulu',
      'Pazarlar Meslek Yüksekokulu',
      'Simav Meslek Yüksekokulu',
      'Simav Sağlık Hizmetleri Meslek Yüksekokulu',
      'Şaphane Meslek Yüksekokulu',
      'Tavşanlı Meslek Yüksekokulu',
      'Tavşanlı Sağlık Hizmetleri Meslek Yüksekokulu',
    ],
  },
];

// ─── KVKK Modal ───────────────────────────────────────────────────────────────
function KvkkModal({ type, onClose }: { type: 'terms' | 'kvkk'; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900">
            {type === 'terms' ? 'Kullanım Koşulları' : 'KVKK Aydınlatma Metni'}
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {type === 'terms' ? (
          <div className="text-sm text-slate-700 space-y-3 leading-relaxed">
            <p>
              <strong>1. Hizmetin Amacı:</strong> DPÜ Kampüs platformu, Kütahya Dumlupınar Üniversitesi öğrencilerine
              yönelik ikinci el ürün alım-satımı, topluluk yönetimi, etkinlik duyuruları ve kampüs dayanışma
              hizmetleri sunmaktadır.
            </p>
            <p>
              <strong>2. Kullanıcı Yükümlülükleri:</strong> Platform yalnızca aktif DPÜ öğrencileri tarafından
              kullanılabilir. Kullanıcılar, gerçek ve doğru bilgiler paylaşmakla; yanıltıcı, yasadışı veya başkalarına
              zarar verici içerik yayınlamamakla yükümlüdür.
            </p>
            <p>
              <strong>3. İlan Kuralları:</strong> İkinci el ilanların gerçek ürün ve fiyatları yansıtması zorunludur.
              Sahte ilanlar, platform yöneticileri tarafından kaldırılır ve hesap askıya alınabilir.
            </p>
            <p>
              <strong>4. Sorumluluğun Sınırlandırılması:</strong> DPÜ Kampüs, kullanıcılar arasında gerçekleşen
              alışverişlerde taraf değildir; anlaşmazlıklarda arabuluculuk yapma yükümlülüğü bulunmamaktadır.
            </p>
            <p>
              <strong>5. Değişiklikler:</strong> Kullanım koşulları zaman zaman güncellenebilir. Güncellemeler platform
              üzerinden duyurulur.
            </p>
          </div>
        ) : (
          <div className="text-sm text-slate-700 space-y-3 leading-relaxed">
            <p>
              <strong>Veri Sorumlusu:</strong> Kütahya Dumlupınar Üniversitesi adına işletilen DPÜ Kampüs platformu,
              6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında veri sorumlusu sıfatıyla hareket eder.
            </p>
            <p>
              <strong>İşlenen Kişisel Veriler:</strong> Ad soyad, öğrenci e-posta adresi, fakülte/MYO bilgisi ve
              platform kullanım verileri işlenmektedir.
            </p>
            <p>
              <strong>İşleme Amaçları:</strong> Toplanan veriler; kullanıcı kimlik doğrulaması, platform hizmetlerinin
              sunulması, güvenliğin sağlanması ve istatistiksel analizler amacıyla kullanılmaktadır.
            </p>
            <p>
              <strong>Aktarım:</strong> Kişisel verileriniz üçüncü taraflara satılmaz, kiralanmaz veya ticari amaçla
              kullanılmaz. Yalnızca hizmet alınan teknik altyapı sağlayıcılarıyla paylaşılabilir.
            </p>
            <p>
              <strong>Haklarınız:</strong> KVKK'nın 11. maddesi uyarınca kişisel verilerinize erişme, düzeltme,
              silme ve itiraz etme haklarına sahipsiniz. Taleplerinizi platform üzerinden iletebilirsiniz.
            </p>
          </div>
        )}
        <button
          onClick={onClose}
          className="mt-5 w-full h-10 bg-[#0F172A] hover:bg-[#0F766E] text-white text-sm font-semibold rounded-xl transition-all"
        >
          Anladım, Kapat
        </button>
      </div>
    </div>
  );
}

// ─── OTP Input Row ────────────────────────────────────────────────────────────
function OtpInputRow({
  digits,
  onChange,
  inputRefs,
  disabled,
}: {
  digits: string[];
  onChange: (digits: string[]) => void;
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  disabled?: boolean;
}) {
  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (e.key === 'Backspace') {
      if (digits[i]) {
        const next = [...digits];
        next[i] = '';
        onChange(next);
      } else if (i > 0) {
        inputRefs.current[i - 1]?.focus();
      }
    }
  };

  const handleChange = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const val = e.target.value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[i] = val;
    onChange(next);
    if (val && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (disabled) return;
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const next = [...digits];
    for (let j = 0; j < 6; j++) next[j] = pasted[j] || '';
    onChange(next);
    const focusIdx = Math.min(pasted.length, 5);
    inputRefs.current[focusIdx]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center my-3">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          disabled={disabled}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="w-11 h-12 text-center text-lg font-bold rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/15 focus:outline-none bg-slate-50 text-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
type View = 'login' | 'register' | 'emailVerify' | 'forgotPassword';

interface AuthPageProps {
  initialTab?: 'login' | 'register';
  onBackToHome?: () => void;
}

export default function AuthPage({ initialTab, onBackToHome }: AuthPageProps = {}) {
  const { login, setIsEnteringPortal, authInitialTab } = useAuth();
  const navigate = useNavigate();

  const startingTab = initialTab || authInitialTab || 'login';
  // ── View state ──
  const [view, setView] = useState<View>(startingTab);

  useEffect(() => {
    if (initialTab) {
      setView(initialTab);
    } else if (authInitialTab) {
      setView(authInitialTab);
    }
  }, [initialTab, authInitialTab]);

  const handleBackToHome = () => {
    if (onBackToHome) {
      onBackToHome();
    } else {
      navigate('/');
    }
  };
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // ── Login ──
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // ── Register ──
  const [fullName, setFullName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerEmailTouched, setRegisterEmailTouched] = useState(false);
  const [faculty, setFaculty] = useState('');
  const [facultySearch, setFacultySearch] = useState('');
  const [facultyOpen, setFacultyOpen] = useState(false);
  const facultyRef = useRef<HTMLDivElement>(null);
  const [registerPw, setRegisterPw] = useState('');
  const [registerPw2, setRegisterPw2] = useState('');
  const [showRegPw, setShowRegPw] = useState(false);
  const [showRegPw2, setShowRegPw2] = useState(false);
  const [kvkkChecked, setKvkkChecked] = useState(false);
  const [kvkkModal, setKvkkModal] = useState<'terms' | 'kvkk' | null>(null);

  // ── OTP / emailVerify ──
  const [pendingEmail, setPendingEmail] = useState('');
  const [verifyDigits, setVerifyDigits] = useState<string[]>(Array(6).fill(''));
  const verifyRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));
  const [verifyCountdown, setVerifyCountdown] = useState(60);
  const [verifyCountdownActive, setVerifyCountdownActive] = useState(false);

  // ── Forgot Password ──
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotDigits, setForgotDigits] = useState<string[]>(Array(6).fill(''));
  const forgotRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));
  const [forgotNewPw, setForgotNewPw] = useState('');
  const [forgotNewPw2, setForgotNewPw2] = useState('');
  const [showForgotPw, setShowForgotPw] = useState(false);
  const [showForgotPw2, setShowForgotPw2] = useState(false);
  const [forgotCountdown, setForgotCountdown] = useState(0);

  // ── Faculty combobox click-outside ──
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (facultyRef.current && !facultyRef.current.contains(e.target as Node)) {
        setFacultyOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Verify countdown ──
  useEffect(() => {
    if (!verifyCountdownActive) return;
    if (verifyCountdown <= 0) { setVerifyCountdownActive(false); return; }
    const t = setTimeout(() => setVerifyCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [verifyCountdown, verifyCountdownActive]);

  // ── Forgot countdown ──
  useEffect(() => {
    if (forgotCountdown <= 0) return;
    const t = setTimeout(() => setForgotCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [forgotCountdown]);

  const validateDpuEmail = (email: string) => email.trim().toLowerCase().endsWith('@ogr.dpu.edu.tr');

  const clearErrors = () => { setError(null); setSuccessMessage(null); };

  const startVerify = (email: string) => {
    setPendingEmail(email);
    setVerifyDigits(Array(6).fill(''));
    setVerifyCountdown(60);
    setVerifyCountdownActive(true);
    setView('emailVerify');
    clearErrors();
  };

  // ── Filtered faculty list ──
  const filteredGroups = FACULTY_GROUPS.map((g) => ({
    ...g,
    items: g.items.filter((item) =>
      item.toLocaleLowerCase('tr-TR').includes(facultySearch.toLocaleLowerCase('tr-TR'))
    ),
  })).filter((g) => g.items.length > 0);

  // ── LOGIN ──
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    if (!validateDpuEmail(loginEmail)) {
      setError('Yalnızca @ogr.dpu.edu.tr uzantılı DPÜ öğrenci e-postası kabul edilir.');
      return;
    }
    if (!loginPassword) { setError('Lütfen şifrenizi girin.'); return; }
    setIsLoading(true);
    try {
      const response = await ApiService.login({ email: loginEmail, password: loginPassword });
      setIsEnteringPortal(true);
      setTimeout(() => {
        login(response.user, response.token);
        if (!rememberMe) {
          localStorage.removeItem('dpu_token');
          localStorage.removeItem('dpu_user');
        }
        setIsEnteringPortal(false);
        navigate('/');
      }, 2400);
    } catch (err: any) {
      setError(err?.message || 'Giriş yapılırken bir hata oluştu. Bilgilerinizi kontrol edin.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── REGISTER ──
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    if (!fullName.trim()) { setError('Lütfen ad ve soyadınızı girin.'); return; }
    if (!validateDpuEmail(registerEmail)) {
      setError('Yalnızca @ogr.dpu.edu.tr uzantılı DPÜ öğrenci e-postası kabul edilir.');
      return;
    }
    if (!faculty) { setError('Lütfen fakültenizi veya MYO\'nuzu seçin.'); return; }
    if (!registerPw || registerPw.length < 6) { setError('Şifreniz en az 6 karakter olmalıdır.'); return; }
    if (registerPw !== registerPw2) { setError('Şifreler eşleşmiyor.'); return; }
    if (!kvkkChecked) { setError('Kullanım Koşulları ve KVKK Aydınlatma Metni\'ni onaylamanız gerekmektedir.'); return; }
    setIsLoading(true);
    try {
      await ApiService.sendVerificationCode(registerEmail.trim(), fullName.trim());
      startVerify(registerEmail.trim());
    } catch (err: any) {
      setError(err?.message || 'Doğrulama e-postası gönderilemedi. Lütfen sunucu SMTP bağlantısını kontrol edin.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── RESEND CODE ──
  const handleResendCode = useCallback(async () => {
    setIsLoading(true);
    clearErrors();
    try {
      await ApiService.sendVerificationCode(pendingEmail);
      setVerifyCountdown(60);
      setVerifyCountdownActive(true);
    } catch (err: any) {
      setError(err?.message || 'Doğrulama e-postası gönderilemedi. Lütfen sunucu SMTP bağlantısını kontrol edin.');
    } finally {
      setIsLoading(false);
    }
  }, [pendingEmail]);

  // ── VERIFY EMAIL ──
  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    const code = verifyDigits.join('');
    if (code.length < 6) { setError('Lütfen 6 haneli doğrulama kodunu girin.'); return; }
    setIsLoading(true);
    try {
      const response = await ApiService.verifyEmailCode(pendingEmail, code);
      setIsEnteringPortal(true);
      setTimeout(() => {
        login(response.user, response.token);
        setIsEnteringPortal(false);
        navigate('/');
      }, 2400);
    } catch (err: any) {
      setError(err?.message || 'Doğrulama kodu hatalı veya süresi dolmuş. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── FORGOT STEP 1 ──
  const handleForgotStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    if (!validateDpuEmail(forgotEmail)) {
      setError('Yalnızca @ogr.dpu.edu.tr uzantılı DPÜ öğrenci e-postası kabul edilir.');
      return;
    }
    setIsLoading(true);
    try {
      await ApiService.sendForgotPasswordCode(forgotEmail.trim());
      setForgotDigits(Array(6).fill(''));
      setForgotNewPw('');
      setForgotNewPw2('');
      setForgotCountdown(60);
      setForgotStep(2);
    } catch (err: any) {
      setError(err?.message || 'Sıfırlama e-postası gönderilemedi. Lütfen sunucu SMTP bağlantısını kontrol edin.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── FORGOT STEP 2 ──
  const handleForgotStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    const code = forgotDigits.join('');
    if (code.length < 6) { setError('Lütfen 6 haneli doğrulama kodunu girin.'); return; }
    if (!forgotNewPw || forgotNewPw.length < 6) { setError('Şifreniz en az 6 karakter olmalıdır.'); return; }
    if (forgotNewPw !== forgotNewPw2) { setError('Şifreler eşleşmiyor.'); return; }
    setIsLoading(true);
    try {
      await ApiService.resetPassword(forgotEmail.trim(), code, forgotNewPw);
      setView('login');
      setForgotStep(1);
      setForgotEmail('');
      setSuccessMessage('Şifreniz başarıyla güncellendi. Yeni şifrenizle giriş yapabilirsiniz.');
    } catch (err: any) {
      setError(err?.message || 'Şifre güncellenemedi veya doğrulama kodu geçersiz.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Resend forgot code ──
  const handleResendForgot = useCallback(async () => {
    setIsLoading(true);
    clearErrors();
    try {
      await ApiService.sendForgotPasswordCode(forgotEmail.trim());
      setForgotCountdown(60);
    } catch (err: any) {
      setError(err?.message || 'Sıfırlama e-postası gönderilemedi. Lütfen sunucu SMTP bağlantısını kontrol edin.');
    } finally {
      setIsLoading(false);
    }
  }, [forgotEmail]);

  // ── Switch view ──
  const switchToView = (v: View) => {
    clearErrors();
    setView(v);
    if (v === 'forgotPassword') { setForgotStep(1); setForgotEmail(''); }
  };

  const registerEmailInvalid = registerEmailTouched && registerEmail.length > 0 && !validateDpuEmail(registerEmail);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#091526] flex items-center justify-center font-sans select-none">
      {/* KVKK Modal */}
      {kvkkModal && <KvkkModal type={kvkkModal} onClose={() => setKvkkModal(null)} />}

      <div className="h-full w-full grid grid-cols-1 lg:grid-cols-12 overflow-hidden">

        {/* ── LEFT COLUMN: Campus Background Video ── */}
        <div className="hidden lg:flex lg:col-span-7 h-full relative overflow-hidden flex-col justify-between px-8 xl:px-12 pt-6 pb-8 xl:pt-8 xl:pb-10">
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
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#091526]/85 via-[#091526]/20 to-transparent pointer-events-none"
            aria-hidden="true"
          />
          <div className="relative z-10 flex items-center gap-3">
            <img
              src="/images/dpu-logo.png"
              alt="Kütahya Dumlupınar Üniversitesi Amblemi"
              className="w-11 h-11 rounded-full object-cover bg-white p-0.5 ring-2 ring-white/60 shadow-md shrink-0"
            />
            <div className="flex flex-col justify-center drop-shadow-sm">
              <span className="text-xl font-black tracking-tight text-white block leading-tight">DPÜ Kampüs</span>
              <span className="text-[11px] text-white/90 font-medium tracking-wide">Dumlupınar Üniversitesi</span>
            </div>
          </div>
          <div className="relative z-10 flex-1" />
          <div className="relative z-10 space-y-3.5">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl xl:text-4xl font-black tracking-tight text-white leading-tight drop-shadow-sm">
                Kütahya Dumlupınar Üniversitesi
                <span className="block">Öğrenci Platformu</span>
              </h1>
              <p className="text-xs sm:text-sm text-white/90 font-normal leading-relaxed max-w-xl drop-shadow-sm">
                Doğrulanmış ikinci el pazar, topluluklar ve kampüs dayanışma ağı
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3 grid grid-cols-3 divide-x divide-white/15 shadow-lg">
              <div className="pr-4">
                <div className="text-xl sm:text-2xl font-black text-white tabular-nums tracking-tight">1.450+</div>
                <div className="text-[11px] sm:text-xs text-white/80 font-medium mt-0.5">Aktif DPÜ Öğrencisi</div>
              </div>
              <div className="px-4">
                <div className="text-xl sm:text-2xl font-black text-white tabular-nums tracking-tight">380+</div>
                <div className="text-[11px] sm:text-xs text-white/80 font-medium mt-0.5">İlan, Not &amp; Etkinlik</div>
              </div>
              <div className="pl-4">
                <div className="text-lg sm:text-xl font-bold text-white tracking-tight leading-tight">Evliya Çelebi</div>
                <div className="text-[11px] sm:text-xs text-white/80 font-medium mt-0.5">&amp; Germiyan Yerleşkesi</div>
              </div>
            </div>
            <div className="pt-1.5 text-[11px] text-white/60 flex items-center justify-between border-t border-white/10">
              <span>© 2026 DPÜ Kampüs</span>
              <span>Evliya Çelebi Yerleşkesi · Kütahya</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Elevated Modern Auth Card ── */}
        <div className="lg:col-span-5 h-full bg-[#F8FAFC] [background-image:radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:20px_20px] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-6 xl:px-8 py-4 overflow-y-auto lg:overflow-hidden border-l border-slate-200/80">

          {/* Top navigation back to home link */}
          <div className="w-full max-w-[440px] mb-2.5 flex items-center justify-between">
            <button
              type="button"
              onClick={handleBackToHome}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer group py-1 px-2.5 -ml-2 rounded-xl hover:bg-slate-200/60"
            >
              <span className="group-hover:-translate-x-0.5 transition-transform text-slate-400 group-hover:text-slate-700">←</span>
              <span>Ana Sayfaya Dön</span>
            </button>
            <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline select-none">
              Ziyaretçi Modu
            </span>
          </div>

          <motion.div
            layout
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-[0_24px_60px_rgba(15,23,42,0.08)] p-6 w-full max-w-[440px] overflow-hidden"
          >

            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <img src="/images/dpu-logo.png" alt="DPÜ Logo" className="w-8 h-8 rounded-full object-cover bg-white ring-1 ring-slate-200" />
                <span className="text-base font-bold text-slate-900">DPÜ Kampüs</span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">@ogr.dpu.edu.tr</span>
            </div>

            {/* Segmented Tab Switcher with Gliding layoutId Pill */}
            {(view === 'login' || view === 'register') && (
              <div className="grid grid-cols-2 p-1 bg-slate-100/90 border border-slate-200/70 rounded-xl mb-3.5 relative gap-1">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => switchToView('login')}
                  className={`relative py-1.5 text-xs font-semibold rounded-lg transition-colors z-10 ${
                    view === 'login' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {view === 'login' && (
                    <motion.div
                      layoutId="authActiveTabPill"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      className="absolute inset-0 bg-white rounded-lg shadow-sm -z-10"
                    />
                  )}
                  Giriş Yap
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => switchToView('register')}
                  className={`relative py-1.5 text-xs font-semibold rounded-lg transition-colors z-10 ${
                    view === 'register' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {view === 'register' && (
                    <motion.div
                      layoutId="authActiveTabPill"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      className="absolute inset-0 bg-white rounded-lg shadow-sm -z-10"
                    />
                  )}
                  Kayıt Ol
                </button>
              </div>
            )}

            {/* Success Banner */}
            {successMessage && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-xs text-emerald-800 flex items-start gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-snug font-medium">{successMessage}</span>
              </div>
            )}

            {/* Error Banner */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-2.5 text-xs text-red-700 flex items-start gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span className="leading-snug font-medium">{error}</span>
              </div>
            )}

            {/* Directional Slide & Fade Forms */}
            <AnimatePresence mode="wait" initial={false}>
              {view === 'login' && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="mb-3.5">
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">Öğrenci Girişi</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Üniversite hesabınızla kampüs ağına bağlanın</p>
                  </div>

                  <form onSubmit={handleLoginSubmit} className="space-y-3">
                    {/* Email */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Öğrenci E-postası</label>
                      <div className="relative flex items-center h-10 rounded-xl bg-slate-50/70 border border-slate-200 focus-within:bg-white focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/15 transition-all">
                        <Mail className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
                        <input
                          type="email"
                          required
                          disabled={isLoading}
                          placeholder="ad.soyad@ogr.dpu.edu.tr"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="w-full h-full pl-2.5 pr-3 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Şifre</label>
                      <div className="relative flex items-center h-10 rounded-xl bg-slate-50/70 border border-slate-200 focus-within:bg-white focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/15 transition-all">
                        <Lock className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
                        <input
                          type={showLoginPw ? 'text' : 'password'}
                          required
                          disabled={isLoading}
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="w-full h-full pl-2.5 pr-9 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() => setShowLoginPw(!showLoginPw)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
                        >
                          {showLoginPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Remember me + Forgot */}
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          disabled={isLoading}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-3.5 h-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer disabled:opacity-50"
                        />
                        <span className="text-xs text-slate-600">Beni hatırla</span>
                      </label>
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => switchToView('forgotPassword')}
                        className="text-xs text-slate-500 hover:text-emerald-700 transition-colors disabled:opacity-50"
                      >
                        Şifremi unuttum
                      </button>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-11 px-4 bg-[#0F172A] hover:bg-[#0F766E] text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Giriş yapılıyor...</span>
                        </>
                      ) : (
                        <>
                          <span>Giriş Yap</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="relative my-3">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-[11px]">
                      <span className="bg-white px-2.5 text-slate-400 font-medium">veya</span>
                    </div>
                  </div>

                  {/* E-Devlet İle Giriş */}
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => {
                      clearErrors();
                      navigate('/edevlet-giris');
                    }}
                    className="w-full h-11 px-4 bg-[#E1252B] hover:bg-[#C61D22] active:scale-[0.99] text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    <EDevletLogo className="w-7 h-5 shrink-0" />
                    <span>E-Devlet İle Giriş</span>
                  </button>
                </motion.div>
              )}

              {view === 'register' && (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="mb-3">
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">Yeni Öğrenci Kaydı</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Yalnızca DPÜ öğrencileri için doğrulanmış hesap</p>
                  </div>

                  <form onSubmit={handleRegisterSubmit} className="space-y-2.5">
                    {/* Full Name */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Ad Soyad</label>
                      <div className="relative flex items-center h-10 rounded-xl bg-slate-50/70 border border-slate-200 focus-within:bg-white focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/15 transition-all">
                        <User className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
                        <input
                          type="text"
                          required
                          disabled={isLoading}
                          placeholder="Adınız Soyadınız"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full h-full pl-2.5 pr-3 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Öğrenci E-postası</label>
                      <div className={`relative flex items-center h-10 rounded-xl bg-slate-50/70 border transition-all focus-within:bg-white focus-within:ring-2 ${registerEmailInvalid ? 'border-red-400 focus-within:border-red-500 focus-within:ring-red-500/15' : 'border-slate-200 focus-within:border-emerald-600 focus-within:ring-emerald-500/15'}`}>
                        <Mail className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
                        <input
                          type="email"
                          required
                          disabled={isLoading}
                          placeholder="ad.soyad@ogr.dpu.edu.tr"
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                          onBlur={() => setRegisterEmailTouched(true)}
                          className="w-full h-full pl-2.5 pr-3 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                      {registerEmailInvalid && (
                        <p className="text-[10px] text-red-600 mt-1">Yalnızca @ogr.dpu.edu.tr uzantılı DPÜ öğrenci e-postası kabul edilir.</p>
                      )}
                    </div>

                    {/* Faculty Combobox */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Fakülte / MYO</label>
                      <div className="relative" ref={facultyRef}>
                        <div
                          className="relative flex items-center h-10 rounded-xl bg-slate-50/70 border border-slate-200 focus-within:bg-white focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/15 transition-all cursor-pointer"
                          onClick={() => { if (!isLoading) setFacultyOpen(!facultyOpen); }}
                        >
                          <Building2 className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
                          <input
                            type="text"
                            placeholder="Fakülte veya MYO ara..."
                            value={facultyOpen ? facultySearch : (faculty || '')}
                            disabled={isLoading}
                            onChange={(e) => { setFacultySearch(e.target.value); setFacultyOpen(true); }}
                            onFocus={() => { setFacultyOpen(true); setFacultySearch(''); }}
                            className="w-full h-full pl-2.5 pr-7 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            readOnly={!facultyOpen}
                          />
                          <ChevronDown className={`absolute right-2.5 w-4 h-4 text-slate-400 transition-transform ${facultyOpen ? 'rotate-180' : ''}`} />
                        </div>
                        {facultyOpen && (
                          <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-white border border-slate-200 rounded-xl shadow-xl max-h-52 overflow-y-auto">
                            {filteredGroups.length === 0 ? (
                              <div className="px-3 py-2 text-xs text-slate-400">Sonuç bulunamadı.</div>
                            ) : (
                              filteredGroups.map((group) => (
                                <div key={group.label}>
                                  <div className="px-3 pt-2 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{group.label}</div>
                                  {group.items.map((item) => (
                                    <button
                                      key={item}
                                      type="button"
                                      className={`w-full text-left px-3 py-1.5 text-xs transition-colors hover:bg-emerald-50 hover:text-emerald-800 ${faculty === item ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-slate-700'}`}
                                      onClick={() => { setFaculty(item); setFacultySearch(''); setFacultyOpen(false); }}
                                    >
                                      {item}
                                    </button>
                                  ))}
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Password row */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Şifre</label>
                        <div className="relative flex items-center h-10 rounded-xl bg-slate-50/70 border border-slate-200 focus-within:bg-white focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/15 transition-all">
                          <Lock className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
                          <input
                            type={showRegPw ? 'text' : 'password'}
                            required
                            disabled={isLoading}
                            placeholder="••••••"
                            value={registerPw}
                            onChange={(e) => setRegisterPw(e.target.value)}
                            className="w-full h-full pl-2.5 pr-7 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                          <button type="button" disabled={isLoading} onClick={() => setShowRegPw(!showRegPw)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50">
                            {showRegPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Şifre Tekrar</label>
                        <div className={`relative flex items-center h-10 rounded-xl bg-slate-50/70 border transition-all focus-within:bg-white focus-within:ring-2 ${registerPw2 && registerPw !== registerPw2 ? 'border-red-400 focus-within:border-red-400 focus-within:ring-red-500/15' : 'border-slate-200 focus-within:border-emerald-600 focus-within:ring-emerald-500/15'}`}>
                          <Lock className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
                          <input
                            type={showRegPw2 ? 'text' : 'password'}
                            required
                            disabled={isLoading}
                            placeholder="••••••"
                            value={registerPw2}
                            onChange={(e) => setRegisterPw2(e.target.value)}
                            className="w-full h-full pl-2.5 pr-7 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                          <button type="button" disabled={isLoading} onClick={() => setShowRegPw2(!showRegPw2)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50">
                            {showRegPw2 ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                    {registerPw2 && registerPw !== registerPw2 && (
                      <p className="text-[10px] text-red-600 -mt-1">Şifreler eşleşmiyor.</p>
                    )}

                    {/* KVKK Checkbox */}
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={kvkkChecked}
                        disabled={isLoading}
                        onChange={(e) => setKvkkChecked(e.target.checked)}
                        className="mt-0.5 w-3.5 h-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 shrink-0 cursor-pointer disabled:opacity-50"
                      />
                      <span className="text-[11px] text-slate-600 leading-snug">
                        <button type="button" onClick={() => setKvkkModal('terms')} className="underline text-slate-700 hover:text-emerald-700 transition-colors">Kullanım Koşulları</button>
                        {'\'nı ve '}
                        <button type="button" onClick={() => setKvkkModal('kvkk')} className="underline text-slate-700 hover:text-emerald-700 transition-colors">KVKK Aydınlatma Metni</button>
                        {'\'ni okudum, onaylıyorum.'}
                      </span>
                    </label>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-11 px-4 bg-[#0F172A] hover:bg-[#0F766E] text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Doğrulama kodu gönderiliyor...</span>
                        </>
                      ) : (
                        <>
                          <span>Öğrenci Hesabı Oluştur</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}

              {view === 'emailVerify' && (
                <motion.div
                  key="emailVerify"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex flex-col items-center mb-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                      <MailOpen className="w-7 h-7 text-emerald-700" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight text-center">E-posta Doğrulama</h2>
                    <p className="text-xs text-slate-600 mt-1.5 text-center leading-relaxed">
                      <span className="font-semibold text-slate-800">{pendingEmail}</span> adresine 6 haneli doğrulama kodu gönderdik. Lütfen gelen kutunuzu ve gereksiz (spam) klasörünü kontrol edin.
                    </p>
                  </div>

                  <form onSubmit={handleVerifySubmit}>
                    <OtpInputRow digits={verifyDigits} onChange={setVerifyDigits} inputRefs={verifyRefs} disabled={isLoading} />

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-11 px-4 bg-[#0F172A] hover:bg-[#0F766E] text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Kod doğrulanıyor...</span>
                        </>
                      ) : (
                        <>
                          <span>Doğrulamayı Tamamla</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="flex items-center justify-between mt-4">
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => switchToView('register')}
                      className="text-xs text-slate-500 hover:text-emerald-700 transition-colors disabled:opacity-50"
                    >
                      E-postayı Değiştir
                    </button>
                    <button
                      type="button"
                      disabled={verifyCountdown > 0 || isLoading}
                      onClick={handleResendCode}
                      className="text-xs text-slate-500 hover:text-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {verifyCountdown > 0 ? `Kodu Tekrar Gönder (${verifyCountdown}s)` : 'Kodu Tekrar Gönder'}
                    </button>
                  </div>
                </motion.div>
              )}

              {view === 'forgotPassword' && (
                <motion.div
                  key={`forgotPassword_${forgotStep}`}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                >
                  {forgotStep === 1 ? (
                    <>
                      <div className="mb-4">
                        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Şifremi Unuttum</h2>
                        <p className="text-xs text-slate-500 mt-0.5">@ogr.dpu.edu.tr e-posta adresinizi girin</p>
                      </div>

                      <form onSubmit={handleForgotStep1} className="space-y-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">Öğrenci E-postası</label>
                          <div className="relative flex items-center h-10 rounded-xl bg-slate-50/70 border border-slate-200 focus-within:bg-white focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/15 transition-all">
                            <Mail className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
                            <input
                              type="email"
                              required
                              disabled={isLoading}
                              placeholder="ad.soyad@ogr.dpu.edu.tr"
                              value={forgotEmail}
                              onChange={(e) => setForgotEmail(e.target.value)}
                              className="w-full h-full pl-2.5 pr-3 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                          </div>
                        </div>
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full h-11 px-4 bg-[#0F172A] hover:bg-[#0F766E] text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Sıfırlama kodu gönderiliyor...</span>
                            </>
                          ) : (
                            <>
                              <span>Sıfırlama Kodu Gönder</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </form>

                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => switchToView('login')}
                        className="mt-4 w-full text-xs text-slate-500 hover:text-emerald-700 transition-colors text-center disabled:opacity-50"
                      >
                        Giriş ekranına dön
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="mb-4">
                        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Yeni Şifre Belirle</h2>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                          <span className="font-semibold text-slate-700">{forgotEmail}</span> adresine gönderilen kodu ve yeni şifrenizi girin.
                        </p>
                      </div>

                      <form onSubmit={handleForgotStep2} className="space-y-3">
                        <OtpInputRow digits={forgotDigits} onChange={setForgotDigits} inputRefs={forgotRefs} disabled={isLoading} />

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">Yeni Şifre</label>
                          <div className="relative flex items-center h-10 rounded-xl bg-slate-50/70 border border-slate-200 focus-within:bg-white focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/15 transition-all">
                            <Lock className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
                            <input
                              type={showForgotPw ? 'text' : 'password'}
                              required
                              disabled={isLoading}
                              placeholder="En az 6 karakter"
                              value={forgotNewPw}
                              onChange={(e) => setForgotNewPw(e.target.value)}
                              className="w-full h-full pl-2.5 pr-9 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <button type="button" disabled={isLoading} onClick={() => setShowForgotPw(!showForgotPw)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50">
                              {showForgotPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">Yeni Şifre Tekrar</label>
                          <div className={`relative flex items-center h-10 rounded-xl bg-slate-50/70 border transition-all focus-within:bg-white focus-within:ring-2 ${forgotNewPw2 && forgotNewPw !== forgotNewPw2 ? 'border-red-400 focus-within:border-red-400 focus-within:ring-red-500/15' : 'border-slate-200 focus-within:border-emerald-600 focus-within:ring-emerald-500/15'}`}>
                            <Lock className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
                            <input
                              type={showForgotPw2 ? 'text' : 'password'}
                              required
                              disabled={isLoading}
                              placeholder="••••••••"
                              value={forgotNewPw2}
                              onChange={(e) => setForgotNewPw2(e.target.value)}
                              className="w-full h-full pl-2.5 pr-9 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <button type="button" disabled={isLoading} onClick={() => setShowForgotPw2(!showForgotPw2)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50">
                              {showForgotPw2 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          {forgotNewPw2 && forgotNewPw !== forgotNewPw2 && (
                            <p className="text-[10px] text-red-600 mt-1">Şifreler eşleşmiyor.</p>
                          )}
                        </div>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full h-11 px-4 bg-[#0F172A] hover:bg-[#0F766E] text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Şifre güncelleniyor...</span>
                            </>
                          ) : (
                            <>
                              <span>Şifremi Güncelle</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </form>

                      <div className="flex items-center justify-between mt-4">
                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() => setForgotStep(1)}
                          className="text-xs text-slate-500 hover:text-emerald-700 transition-colors disabled:opacity-50"
                        >
                          E-postayı Değiştir
                        </button>
                        <button
                          type="button"
                          disabled={forgotCountdown > 0 || isLoading}
                          onClick={handleResendForgot}
                          className="text-xs text-slate-500 hover:text-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {forgotCountdown > 0 ? `Kodu Tekrar Gönder (${forgotCountdown}s)` : 'Kodu Tekrar Gönder'}
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
