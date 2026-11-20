import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Search,
  HelpCircle,
  FileText,
  Shield,
  MessageSquare,
  X,
  Send,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// ─── Custom Social SVG Icons ──────────────────────────────────────────────────
function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function GithubIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

type ModalType = 'faq' | 'terms' | 'privacy' | 'contact' | null;

export default function Footer() {
  const navigate = useNavigate();
  const { user, setGuestLockModalOpen } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // Contact form state
  const [contactSubject, setContactSubject] = useState('Öneri / Geri Bildirim');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setGuestLockModalOpen(true);
      return;
    }
    if (searchQuery.trim()) {
      navigate(`/pazar?q=${encodeURIComponent(searchQuery.trim())}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleKeywordClick = (keyword: string) => {
    if (!user) {
      setGuestLockModalOpen(true);
      return;
    }
    setSearchQuery(keyword);
    navigate(`/pazar?q=${encodeURIComponent(keyword)}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactMessage.trim()) {
      setContactSent(true);
      setTimeout(() => {
        setContactSent(false);
        setContactMessage('');
        setActiveModal(null);
      }, 2000);
    }
  };

  return (
    <>
      <footer className="bg-white border-t border-slate-200/80 mt-12 font-sans select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-6">
          {/* ── 4-COLUMN RESPONSIVE GRID ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">

            {/* ── COLUMN 1: BRAND & UNIVERSITY IDENTITY (lg:col-span-4) ── */}
            <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-3">
                  <img
                    src="/images/dpu-logo.png"
                    alt="DPÜ Logo"
                    className="w-11 h-11 rounded-full object-cover ring-1 ring-slate-200 shadow-xs"
                  />
                  <div>
                    <span className="text-base font-extrabold tracking-tight text-slate-900 block leading-tight">
                      DPÜ Kampüs
                    </span>
                    <span className="text-xs font-medium text-slate-500 block leading-tight mt-0.5">
                      Kütahya Dumlupınar Üniversitesi
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mt-3 max-w-sm">
                  Evliya Çelebi ve Germiyan yerleşkelerindeki öğrenciler için doğrulanmış ikinci el paylaşım,
                  topluluk ve kampüs dayanışma ağı.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 w-fit">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-semibold text-slate-800">Doğrulanmış Öğrenci Ağı</span>
                <span className="text-slate-300">•</span>
                <span>Kütahya · 1992</span>
              </div>
            </div>

            {/* ── COLUMN 2: IN-SITE SEARCH (lg:col-span-4) ── */}
            <div className="lg:col-span-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                Site İçi Arama
              </h4>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                Kampüsteki ilanlar, topluluklar, ders notları veya kayıp eşyalarda anında arama yapın.
              </p>

              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="İlan, ders notu, topluluk veya kayıp eşya ara..."
                    className="w-full h-10 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="ml-2 h-10 px-4 bg-[#0F172A] hover:bg-[#0F766E] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shrink-0 shadow-xs"
                >
                  Ara
                </button>
              </form>

              {/* Quick Keyword Pills */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                <span className="text-[11px] text-slate-400 font-medium mr-1">Popüler:</span>
                {['Hesap Makinesi', 'Ders Notu', 'Yazılım', 'Kayıp Kart', 'Kahve'].map((kw) => (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => handleKeywordClick(kw)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </div>

            {/* ── COLUMN 3: YARDIM & YASAL (lg:col-span-2) ── */}
            <div className="lg:col-span-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
                Yardım &amp; Bilgilendirme
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal('faq')}
                    className="text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2 cursor-pointer py-0.5 text-left"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Sıkça Sorulan Sorular</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal('terms')}
                    className="text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2 cursor-pointer py-0.5 text-left"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Kullanım Koşulları</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal('privacy')}
                    className="text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2 cursor-pointer py-0.5 text-left"
                  >
                    <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Gizlilik Politikası</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal('contact')}
                    className="text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2 cursor-pointer py-0.5 text-left"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>İletişim</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* ── COLUMN 4: SOSYAL MEDYA & İLETİŞİM (lg:col-span-2) ── */}
            <div className="lg:col-span-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
                Bize Ulaşın
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2.5 py-0.5 group"
                  >
                    <InstagramIcon className="w-3.5 h-3.5 text-slate-400 group-hover:text-pink-600 transition-colors shrink-0" />
                    <span>Instagram</span>
                    <ExternalLink className="w-3 h-3 text-slate-300 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2.5 py-0.5 group"
                  >
                    <LinkedinIcon className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3 h-3 text-slate-300 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/efe-asp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2.5 py-0.5 group"
                  >
                    <GithubIcon className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 transition-colors shrink-0" />
                    <span>GitHub</span>
                    <ExternalLink className="w-3 h-3 text-slate-300 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:iletisim@dpukampus.edu.tr"
                    className="text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2.5 py-0.5 group"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 transition-colors shrink-0" />
                    <span>E-posta</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* ── BOTTOM COPYRIGHT STRIP ("EN ALT ŞERİT") ── */}
          <div className="border-t border-slate-200/80 mt-8 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">© 2026 DPÜ Kampüs</span>
              <span>•</span>
              <span>Tüm hakları saklıdır.</span>
            </div>
            <div className="text-slate-500 text-center sm:text-right">
              <span>Dumlupınar Üniversitesi öğrencileri için geliştirilmiştir.</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ── MODALS (FAQ, TERMS, PRIVACY, CONTACT) ── */}

      {/* 1. FAQ MODAL */}
      {activeModal === 'faq' && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4 text-emerald-700" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Sıkça Sorulan Sorular</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="font-bold text-slate-900 text-sm mb-1">
                  1. @ogr.dpu.edu.tr e-posta doğrulaması neden zorunlu?
                </h4>
                <p>
                  DPÜ Kampüs, üniversite dışından kişilerin platforma girmesini engellemek, sahte ilanları sıfıra
                  indirmek ve öğrencilerin kampüs içerisinde güvenle alışveriş yapabilmesini sağlamak amacıyla yalnızca
                  resmi Dumlupınar Üniversitesi öğrenci e-postasıyla üye kabul etmektedir.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="font-bold text-slate-900 text-sm mb-1">
                  2. Kampüs içi QR kodlu teslimat nasıl çalışır?
                </h4>
                <p>
                  Bir ürünü satın almak veya takas etmek üzere anlaştığınızda sistem her iki tarafa özel dinamik bir
                  teslimat QR kodu üretir. Bedesten önü, Merkez Kütüphane veya Mühendislik kantini gibi belirlenen
                  teslim noktasında buluştuğunuzda kodu okutarak teslimatı onaylarsınız. Kargo veya IBAN karmaşası yaşanmaz.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="font-bold text-slate-900 text-sm mb-1">
                  3. "Askıda Ücretsiz" kategorisi nedir?
                </h4>
                <p>
                  Dönem bitiren veya ihtiyacı kalmayan öğrencilerin ders notlarını, kitaplarını veya ev/yurt eşyalarını
                  alt sınıflara hiçbir ücret talep etmeden devretmesini sağlayan kampüs dayanışma alanıdır. Bu ilanlar
                  0 TL olarak listelenir.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="font-bold text-slate-900 text-sm mb-1">
                  4. Topluluk etkinliklerine nasıl katılabilirim?
                </h4>
                <p>
                  "Topluluklar" sekmesinden ilgilendiğiniz kulüpleri takip edebilir, atölye veya etkinliklere "Katıl"
                  butonu ile tek tıkla kontenjan ayırtabilirsiniz.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="mt-6 w-full h-10 bg-slate-900 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Anladım, Kapat
            </button>
          </div>
        </div>
      )}

      {/* 2. TERMS MODAL */}
      {activeModal === 'terms' && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-700" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Kullanım Koşulları</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
              <p>
                <strong>1. Kabul ve Kapsam:</strong> DPÜ Kampüs web platformuna giriş yapan ve platformu kullanan tüm
                öğrenciler bu kullanım koşullarını kabul etmiş sayılır. Platform Kütahya Dumlupınar Üniversitesi
                öğrenci topluluğuna özeldir.
              </p>
              <p>
                <strong>2. İlan Verme Kuralları:</strong> Yalnızca yasal, akademik veya öğrencilerin günlük yaşamına
                uygun eşyalar, kitaplar ve hizmetler paylaşılabilir. Yanıltıcı fiyat, sahte ürün fotoğrafı veya hakaret
                içeren paylaşımlar derhal kaldırılır.
              </p>
              <p>
                <strong>3. Kampüs İçi Güvenlik:</strong> Alışverişlerin kampüs sınırları içerisindeki halka açık ortak
                alanlarda (Bedesten, Kütüphane, Fakülte Kantinleri) elden yapılması tavsiye edilir.
              </p>
              <p>
                <strong>4. Hesap Sorumluluğu:</strong> @ogr.dpu.edu.tr hesap bilgilerinizi üçüncü kişilerle paylaşmayınız.
                Hesabınız üzerinden yapılan tüm işlemlerden kullanıcı sorumludur.
              </p>
              <p>
                <strong>5. Yaptırımlar:</strong> Kurallara aykırı hareket eden kullanıcıların platform erişimi askıya
                alınabilir veya sonlandırılabilir.
              </p>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="mt-6 w-full h-10 bg-slate-900 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Tamam, Kapat
            </button>
          </div>
        </div>
      )}

      {/* 3. PRIVACY & KVKK MODAL */}
      {activeModal === 'privacy' && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-emerald-700" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Gizlilik Politikası &amp; KVKK</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
              <p>
                <strong>Veri Sorumlusu:</strong> 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca DPÜ
                Kampüs platformu, kullanıcılarının gizliliğini en üst düzeyde korumayı taahhüt eder.
              </p>
              <p>
                <strong>İşlenen Veriler:</strong> Yalnızca ad soyad, @ogr.dpu.edu.tr e-posta adresi, kayıtlı fakülte/MYO
                ve platform içi mesajlaşma/ilan verileri işlenir. Hassas kişisel veya finansal verileriniz toplanmaz.
              </p>
              <p>
                <strong>Veri Güvenliği:</strong> Verileriniz üçüncü şahıslara veya reklam ağlarına satılmaz. Şifreleriniz
                kriptografik hash algoritmalarıyla korunmaktadır.
              </p>
              <p>
                <strong>Kullanıcı Hakları:</strong> KVKK Madde 11 uyarınca istediğiniz zaman verilerinizi inceleme,
                düzeltilmesini talep etme veya hesabınızın silinmesini isteme hakkına sahipsiniz.
              </p>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="mt-6 w-full h-10 bg-slate-900 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Okudum, Kapat
            </button>
          </div>
        </div>
      )}

      {/* 4. CONTACT MODAL */}
      {activeModal === 'contact' && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-purple-700" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">İletişim &amp; Destek</h3>
                  <p className="text-[11px] text-slate-500">DPÜ Kampüs Geliştirici &amp; Destek Ekibi</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {contactSent ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Mesajınız Alındı!</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Geri bildiriminiz için teşekkürler. Ekibimiz @ogr.dpu.edu.tr adresinize en kısa sürede dönüş yapacaktır.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Ad Soyad</label>
                    <input
                      type="text"
                      disabled
                      value={user?.fullName || 'Efe Alsaç'}
                      className="w-full h-9 px-3 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">E-posta</label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || 'efe.alsac@ogr.dpu.edu.tr'}
                      className="w-full h-9 px-3 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-700 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Konu</label>
                  <select
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    className="w-full h-9.5 px-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                  >
                    <option value="Öneri / Geri Bildirim">Öneri / Geri Bildirim</option>
                    <option value="Hata Bildirimi (Bug)">Hata Bildirimi (Bug)</option>
                    <option value="İlan & Teslimat Sorunu">İlan &amp; Teslimat Sorunu</option>
                    <option value="Kulüp / Topluluk İş Birliği">Kulüp / Topluluk İş Birliği</option>
                    <option value="Diğer">Diğer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Mesajınız</label>
                  <textarea
                    required
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Görüş, öneri veya karşılaştığınız sorunu detaylıca açıklayın..."
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-400">Genellikle 24 saat içinde yanıtlanır.</span>
                  <button
                    type="submit"
                    className="h-10 px-5 bg-[#0F172A] hover:bg-[#0F766E] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Mesajı Gönder</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
