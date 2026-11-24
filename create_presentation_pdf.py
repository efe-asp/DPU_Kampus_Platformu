import os
import base64
import subprocess
import sys

def get_base64_image(path):
    if os.path.exists(path):
        with open(path, "rb") as f:
            ext = os.path.splitext(path)[1].lower().replace('.', '')
            if ext == 'jpg': ext = 'jpeg'
            mime = f"image/{ext}" if ext != 'svg' else "image/svg+xml"
            return f"data:{mime};base64,{base64.b64encode(f.read()).decode('utf-8')}"
    return ""

print("Loading high-res project assets...")
logo_b64 = get_base64_image("public/images/dpu-logo.png")
campus_b64 = get_base64_image("public/images/dpu-campus.png")
campus1_b64 = get_base64_image("public/images/campus/campus-1.jpg")
campus2_b64 = get_base64_image("public/images/campus/campus-2.jpg")
gurbetci_b64 = get_base64_image("public/images/clubs/gurbetci-gencler.jpg")

print(f"Assets loaded: Logo={len(logo_b64)>0}, Campus={len(campus_b64)>0}, Campus1={len(campus1_b64)>0}, Gurbetci={len(gurbetci_b64)>0}")

html_content = f"""<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<title>DPÜ Kampüs Platformu - Kapsamlı Proje Tanıtım Dokümanı</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

  @page {{
    size: A4 portrait;
    margin: 12mm 14mm 14mm 14mm;
  }}

  @page:first {{
    margin: 0;
  }}

  * {{
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }}

  body {{
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #1E293B;
    background-color: #FFFFFF;
    line-height: 1.45;
    font-size: 9.5pt;
  }}

  .page {{
    page-break-after: always;
    break-after: page;
    height: 270mm;
    max-height: 270mm;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
  }}

  .page-last {{
    page-break-after: avoid;
    break-after: avoid;
  }}

  /* Running Header & Footer */
  .page-header {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1.5px solid #E2E8F0;
    padding-bottom: 5px;
    margin-bottom: 12px;
    font-size: 8pt;
    color: #64748B;
    font-weight: 500;
  }}
  .page-header .brand {{
    display: flex;
    align-items: center;
    gap: 6px;
    color: #0F766E;
    font-weight: 700;
    font-size: 8.5pt;
  }}

  .page-footer {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #E2E8F0;
    padding-top: 5px;
    margin-top: 12px;
    font-size: 7.5pt;
    color: #94A3B8;
  }}

  .page-body {{
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }}

  /* Typography */
  h1.section-title {{
    font-size: 16pt;
    font-weight: 800;
    color: #0F172A;
    letter-spacing: -0.5px;
    margin-bottom: 3px;
    display: flex;
    align-items: center;
    gap: 8px;
  }}
  .section-tag {{
    display: inline-block;
    font-size: 7.5pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #0D9488;
    background: #F0FDFA;
    border: 1px solid #CCFBF1;
    padding: 2px 8px;
    border-radius: 999px;
    margin-bottom: 4px;
    width: fit-content;
  }}
  p.lead {{
    font-size: 9pt;
    color: #475569;
    margin-bottom: 10px;
    line-height: 1.4;
  }}

  h2.subsection-title {{
    font-size: 11pt;
    font-weight: 700;
    color: #1E293B;
    margin-top: 8px;
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    gap: 6px;
  }}
  h2.subsection-title::before {{
    content: '';
    display: inline-block;
    width: 4px;
    height: 13px;
    background: #0D9488;
    border-radius: 2px;
  }}

  h3.item-title {{
    font-size: 9.5pt;
    font-weight: 700;
    color: #0F172A;
    margin-bottom: 2px;
  }}

  /* Grids & Cards */
  .grid-2 {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }}
  .grid-3 {{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 8px;
  }}
  .grid-4 {{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
  }}

  .card {{
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 7px;
    padding: 8px 10px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.02);
  }}
  .card-highlight {{
    background: #F8FAFC;
    border-left: 3.5px solid #0D9488;
  }}
  .card-navy {{
    background: #0F172A;
    color: #F8FAFC;
    border: 1px solid #1E293B;
  }}
  .card-navy h3 {{
    color: #38BDF8;
  }}
  .card-navy p {{
    color: #94A3B8;
  }}

  /* Badges & Pills */
  .badge {{
    display: inline-flex;
    align-items: center;
    font-size: 7pt;
    font-weight: 600;
    padding: 1.5px 6px;
    border-radius: 4px;
    border: 1px solid transparent;
  }}
  .badge-teal {{ background: #CCFBF1; color: #0F766E; border-color: #99F6E4; }}
  .badge-blue {{ background: #DBEAFE; color: #1E40AF; border-color: #BFDBFE; }}
  .badge-purple {{ background: #F3E8FF; color: #6B21A8; border-color: #E9D5FF; }}
  .badge-amber {{ background: #FEF3C7; color: #92400E; border-color: #FDE68A; }}
  .badge-rose {{ background: #FFE4E6; color: #9F1239; border-color: #FECDD3; }}
  .badge-gray {{ background: #F1F5F9; color: #475569; border-color: #E2E8F0; }}

  /* Tables */
  table.data-table {{
    width: 100%;
    border-collapse: collapse;
    font-size: 7.8pt;
    margin: 6px 0;
  }}
  table.data-table th {{
    background: #F1F5F9;
    color: #334155;
    font-weight: 700;
    text-align: left;
    padding: 5px 7px;
    border: 1px solid #CBD5E1;
  }}
  table.data-table td {{
    padding: 4.5px 7px;
    border: 1px solid #E2E8F0;
    color: #334155;
    vertical-align: middle;
  }}
  table.data-table tr:nth-child(even) td {{
    background: #F8FAFC;
  }}

  /* Code Block */
  .code-box {{
    background: #0F172A;
    color: #E2E8F0;
    border-radius: 6px;
    padding: 7px 9px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 7.2pt;
    line-height: 1.35;
    overflow: hidden;
    margin: 5px 0;
    border: 1px solid #1E293B;
  }}
  .code-box .kw {{ color: #38BDF8; font-weight: 600; }}
  .code-box .str {{ color: #34D399; }}
  .code-box .comment {{ color: #64748B; font-style: italic; }}
  .code-box .fn {{ color: #F472B6; }}

  /* Cover Page Styles */
  .cover-container {{
    height: 297mm;
    max-height: 297mm;
    position: relative;
    background: linear-gradient(180deg, rgba(15, 23, 42, 0.88) 0%, rgba(2, 6, 23, 0.94) 100%){f", url('{campus_b64}') center/cover no-repeat" if campus_b64 else ""};
    color: #FFFFFF;
    padding: 24mm 22mm 20mm 22mm;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
  }}
  .cover-header {{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }}
  .cover-logo-box {{
    background: rgba(255, 255, 255, 0.96);
    padding: 8px 14px;
    border-radius: 10px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.35);
    display: flex;
    align-items: center;
    gap: 10px;
  }}
  .cover-logo-box img {{
    height: 44px;
    width: auto;
    object-fit: contain;
  }}
  .cover-title-group {{
    margin-top: 25px;
  }}
  .cover-tag {{
    display: inline-block;
    padding: 5px 12px;
    background: rgba(13, 148, 136, 0.35);
    border: 1px solid rgba(45, 212, 191, 0.5);
    color: #2DD4BF;
    font-size: 8.5pt;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    border-radius: 999px;
    margin-bottom: 14px;
  }}
  .cover-main-title {{
    font-size: 32pt;
    font-weight: 900;
    line-height: 1.1;
    letter-spacing: -1px;
    color: #FFFFFF;
    margin-bottom: 10px;
  }}
  .cover-main-title span {{
    color: #2DD4BF;
    background: linear-gradient(90deg, #2DD4BF, #38BDF8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }}
  .cover-sub-title {{
    font-size: 11.5pt;
    color: #94A3B8;
    max-width: 620px;
    line-height: 1.45;
    font-weight: 400;
  }}

  .cover-badges-row {{
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 18px;
  }}
  .cover-badge-pill {{
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.18);
    padding: 5px 10px;
    border-radius: 6px;
    font-size: 7.5pt;
    color: #E2E8F0;
    display: flex;
    align-items: center;
    gap: 5px;
  }}
  .cover-badge-pill strong {{
    color: #38BDF8;
  }}

  .cover-bottom {{
    border-top: 1px solid rgba(255,255,255,0.15);
    padding-top: 16px;
  }}
  .cover-team-grid {{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 16px;
  }}
  .team-member-card {{
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    padding: 10px 12px;
    backdrop-filter: blur(8px);
  }}
  .team-member-card .name {{
    font-size: 9.5pt;
    font-weight: 700;
    color: #FFFFFF;
  }}
  .team-member-card .num {{
    font-size: 8pt;
    color: #2DD4BF;
    font-family: 'JetBrains Mono', monospace;
    margin-top: 2px;
  }}
  .team-member-card .role {{
    font-size: 7.2pt;
    color: #94A3B8;
    margin-top: 3px;
  }}

  .cover-meta-row {{
    display: flex;
    justify-content: space-between;
    font-size: 7.5pt;
    color: #94A3B8;
  }}

  /* Feature Mockup Box */
  .mockup-frame {{
    border: 1px solid #CBD5E1;
    border-radius: 7px;
    background: #F8FAFC;
    overflow: hidden;
    margin: 6px 0;
  }}
  .mockup-header {{
    background: #E2E8F0;
    padding: 4px 8px;
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 7pt;
    color: #475569;
    font-weight: 600;
  }}
  .mockup-dot {{
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }}
  .mockup-body {{
    padding: 8px;
    background: #FFFFFF;
  }}

  .metric-stat {{
    text-align: center;
    padding: 6px;
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    border-radius: 6px;
  }}
  .metric-stat .num {{
    font-size: 13.5pt;
    font-weight: 800;
    color: #0F766E;
  }}
  .metric-stat .label {{
    font-size: 7pt;
    color: #64748B;
    font-weight: 600;
    margin-top: 1px;
  }}

  .step-pill {{
    display: flex;
    align-items: flex-start;
    gap: 7px;
    margin-bottom: 6px;
  }}
  .step-num {{
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #0F766E;
    color: white;
    font-size: 7pt;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    shrink: 0;
  }}

  .toc-item {{
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 4.5px 0;
    border-bottom: 1px dotted #CBD5E1;
    font-size: 8pt;
  }}
  .toc-item .title {{
    font-weight: 600;
    color: #1E293B;
  }}
  .toc-item .page-num {{
    font-weight: 700;
    color: #0D9488;
    font-family: 'JetBrains Mono', monospace;
  }}
</style>
</head>
<body>

<!-- ========================================== -->
<!-- SAYFA 1: KAPAK SAYFASI (COVER PAGE)        -->
<!-- ========================================== -->
<div class="page cover-container">
  <div class="cover-header">
    <div>
      <div style="font-size: 10pt; font-weight: 700; letter-spacing: 1px; color: #94A3B8; text-transform: uppercase;">
        T.C. KÜTAHYA DUMLUPINAR ÜNİVERSİTESİ
      </div>
      <div style="font-size: 8.5pt; color: #CBD5E1; margin-top: 2px;">
        Mühendislik Fakültesi · Bilgisayar ve Yazılım Mühendisliği
      </div>
    </div>
    <div class="cover-logo-box">
      {"<img src='" + logo_b64 + "' alt='DPÜ Logo'>" if logo_b64 else "<span style='color:#0F172A;font-weight:800;'>DPÜ KAMPÜS</span>"}
    </div>
  </div>

  <div class="cover-title-group">
    <div class="cover-tag">Bitirme ve Dönem Projesi Tanıtım Raporu</div>
    <div class="cover-main-title">
      DPÜ KAMPÜS<br><span>PLATFORMU</span>
    </div>
    <div class="cover-sub-title">
      Üniversite Öğrencilerine Özel Güvenli Kimlik Doğrulamalı, İkinci El Pazarı, Yemekhane Analitiği, Kampüs Radar, Topluluk Yönetimi ve Mikroblog Sosyal Ağ Ekosistemi
    </div>

    <div class="cover-badges-row">
      <div class="cover-badge-pill"><strong>Frontend:</strong> React 18 + TypeScript + Vite</div>
      <div class="cover-badge-pill"><strong>Backend:</strong> ASP.NET Core Web API (.NET 10)</div>
      <div class="cover-badge-pill"><strong>Database:</strong> SQL Server 2022 (EF Core)</div>
      <div class="cover-badge-pill"><strong>Auth:</strong> @ogr.dpu.edu.tr OTP Doğrulama</div>
    </div>
  </div>

  <div class="cover-bottom">
    <div style="font-size: 8pt; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">
      PROJE EKİBİ / HAZIRLAYANLAR
    </div>
    <div class="cover-team-grid">
      <div class="team-member-card">
        <div class="name">Muhammed Yaşar Özkul</div>
        <div class="num">202551501002</div>
        <div class="role">Yazılım &amp; Sistem Geliştirici</div>
      </div>
      <div class="team-member-card">
        <div class="name">Batuhan Tuğra Dönmez</div>
        <div class="num">202551501023</div>
        <div class="role">Yazılım &amp; Veritabanı Mimarı</div>
      </div>
      <div class="team-member-card">
        <div class="name">Efe Alsaç</div>
        <div class="num">202551501027</div>
        <div class="role">Full-Stack Geliştirici &amp; UI/UX</div>
      </div>
    </div>

    <div class="cover-meta-row">
      <span>Dönem: 2025 - 2026 Akademik Yılı Güz Dönemi</span>
      <span>Proje Sürümü: v1.0.0 (Production Release)</span>
      <span>Tarih: Kasım 2026</span>
    </div>
  </div>
</div>

<!-- ========================================== -->
<!-- SAYFA 2: İÇİNDEKİLER & YÖNETİCİ ÖZETİ      -->
<!-- ========================================== -->
<div class="page">
  <div class="page-header">
    <div class="brand">
      <span style="font-size:11pt;">🎓</span> DPÜ KAMPÜS PLATFORMU · PROJE TANITIM RAPORU
    </div>
    <div>BÖLÜM 1: GENEL BAKIŞ &amp; İÇİNDEKİLER</div>
  </div>

  <div class="page-body">
    <div class="section-tag">Yönetici Özeti &amp; Kapsam</div>
    <h1 class="section-title">İçindekiler &amp; Yönetici Özeti</h1>
    <p class="lead">Bu rapor; Kütahya Dumlupınar Üniversitesi öğrenci yaşamını dijitalleştirmek, güvenli ve merkezi bir etkileşim platformu oluşturmak amacıyla geliştirilen DPÜ Kampüs sisteminin tüm mimari, teknik ve fonksiyonel bileşenlerini detaylandırmaktadır.</p>

    <div class="grid-2" style="margin-bottom: 10px;">
      <!-- İçindekiler Tablosu -->
      <div class="card card-highlight">
        <h3 class="item-title" style="margin-bottom: 6px; color: #0F766E;">📑 Rapor İçindekiler Dizini</h3>
        <div class="toc-item"><span class="title">1. Yönetici Özeti ve Proje Vizyonu</span><span class="page-num">S. 2</span></div>
        <div class="toc-item"><span class="title">2. Sistem Mimarisi ve Teknoloji Yığını</span><span class="page-num">S. 3</span></div>
        <div class="toc-item"><span class="title">3. Güvenlik, Kimlik Doğrulama ve Ana Sayfa</span><span class="page-num">S. 4</span></div>
        <div class="toc-item"><span class="title">4. Öğrenci Pazarı &amp; Askıda Ücretsiz Sistemi</span><span class="page-num">S. 5</span></div>
        <div class="toc-item"><span class="title">5. Kampüs Radar (Yemekhane &amp; Yol Arkadaşlığı)</span><span class="page-num">S. 6</span></div>
        <div class="toc-item"><span class="title">6. Kampüs Forumu (Twitter/X Tarzı Mikroblog)</span><span class="page-num">S. 7</span></div>
        <div class="toc-item"><span class="title">7. Topluluklar, Etkinlikler &amp; Kayıp-Buluntu</span><span class="page-num">S. 8</span></div>
        <div class="toc-item"><span class="title">8. Ders Notları &amp; TEKNOFEST Takım Ağı</span><span class="page-num">S. 9</span></div>
        <div class="toc-item"><span class="title">9. Veritabanı Şeması ve ER Diyagramı</span><span class="page-num">S. 10</span></div>
        <div class="toc-item"><span class="title">10. RESTful API Referansı &amp; Güvenlik</span><span class="page-num">S. 11</span></div>
        <div class="toc-item"><span class="title">11. Kurulum Kılavuzu &amp; Gelecek Yol Haritası</span><span class="page-num">S. 12</span></div>
      </div>

      <!-- Problem & Çözüm Analizi -->
      <div class="card">
        <h3 class="item-title" style="margin-bottom: 6px; color: #1E3A8A;">🎯 Karşılaşılan Problemler ve Çözümümüz</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>Mevcut Durum / Problem</th>
              <th>DPÜ Kampüs Çözümü</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Güvensiz İlanlar:</strong> WhatsApp grupları ve sarı sayfalarda dolandırıcılık riski.</td>
              <td><strong>Kapalı Devre Doğrulama:</strong> Yalnızca kurumsal <code>@ogr.dpu.edu.tr</code> e-postası olan öğrenciler erişebilir.</td>
            </tr>
            <tr>
              <td><strong>Kopuk Ulaşım &amp; Masraf:</strong> Şehir dışına (Bursa, Eskişehir vb.) giden öğrencilerin masraf paylaşamaması.</td>
              <td><strong>Kampüs Carpooling:</strong> Güvenilir öğrenci sürücülerle şehirlerarası yol ve yakıt paylaşımı.</td>
            </tr>
            <tr>
              <td><strong>Yemekhane Bilgisizliği:</strong> Menü ve memnuniyet durumunun ölçülememesi.</td>
              <td><strong>Anlık Menü &amp; Oylama:</strong> 4 kap tabldot menü, anlık öğrenci lezzet oylaması ve memnuniyet yüzdesi.</td>
            </tr>
            <tr>
              <td><strong>Kayıp Eşya Dağınıklığı:</strong> Kampüste unutulan kimlik, kulaklık vb. eşyaların bulunamaması.</td>
              <td><strong>Kayıp-Buluntu Panosu:</strong> Konum etiketli, tek tıkla mesajlaşmalı merkezi bildirim.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Temel İstatistiksel Başarı Metrikleri -->
    <div class="grid-4" style="margin-bottom: 10px;">
      <div class="metric-stat">
        <div class="num">%100</div>
        <div class="label">DPÜ Doğrulanmış Öğrenci</div>
      </div>
      <div class="metric-stat">
        <div class="num">8+</div>
        <div class="label">Entegre Kampüs Modülü</div>
      </div>
      <div class="metric-stat">
        <div class="num">&lt; 150ms</div>
        <div class="label">RESTful API Yanıt Süresi</div>
      </div>
      <div class="metric-stat">
        <div class="num">Full</div>
        <div class="label">Mobil / Masaüstü Responsive</div>
      </div>
    </div>

    <!-- Proje Vizyonu -->
    <div class="card card-highlight">
      <h3 class="item-title">🌟 Proje Vizyonu ve Sosyal İnovasyon</h3>
      <p style="font-size: 8pt; color: #334155; line-height: 1.4;">
        DPÜ Kampüs Platformu, yalnızca bir yazılım projesi değil, aynı zamanda <strong>öğrenci dayanışmasını ve kampüs aidiyetini maksimize eden bir sosyal ekosistemdir</strong>. "Askıda Ücretsiz" modülü ile mezun olan öğrencilerin çalışma masası, ders notu, hesap makinesi gibi eşyaları yeni gelen öğrencilere bedelsiz aktarması sağlanır. TEKNOFEST ve TÜBİTAK proje eşleşme panosu ise disiplinlerarası mühendislik ekiplerinin kurulmasını hızlandırarak üniversitemizin akademik proje başarısını doğrudan destekler.
      </p>
    </div>
  </div>

  <div class="page-footer">
    <span>Kütahya Dumlupınar Üniversitesi · Mühendislik Fakültesi</span>
    <span>DPÜ Kampüs Platformu Tanıtım Raporu</span>
    <span>Sayfa 2 / 12</span>
  </div>
</div>

<!-- ========================================== -->
<!-- SAYFA 3: SİSTEM MİMARİSİ VE TEKNOLOJİ      -->
<!-- ========================================== -->
<div class="page">
  <div class="page-header">
    <div class="brand">
      <span style="font-size:11pt;">🎓</span> DPÜ KAMPÜS PLATFORMU · PROJE TANITIM RAPORU
    </div>
    <div>BÖLÜM 2: SİSTEM MİMARİSİ</div>
  </div>

  <div class="page-body">
    <div class="section-tag">Mimari Tasarım &amp; Teknoloji Seçimi</div>
    <h1 class="section-title">Sistem Mimarisi ve Teknoloji Yığını</h1>
    <p class="lead">Platform; modern kurumsal standartlara uygun olarak gevşek bağlı (loosely coupled), yüksek performanslı, ölçeklenebilir ve güvenlik odaklı çok katmanlı (N-Tier) bir mimari ile inşa edilmiştir.</p>

    <!-- Mimari Blok Şeması -->
    <div class="card card-navy" style="margin-bottom: 10px; padding: 10px 14px;">
      <h3 style="font-size: 9pt; margin-bottom: 4px;">🏛️ Uçtan Uca Sistem Mimarisi &amp; Veri Akış Modeli</h3>
      <div style="font-family:'JetBrains Mono', monospace; font-size:6.8pt; line-height:1.45; color:#E2E8F0; background:#020617; padding:7px 10px; border-radius:5px; border:1px solid #1E293B;">
[ CLIENT BROWSER / MOBILE ] ── (React 18 + Vite + Tailwind + Framer Motion)
           │
           │ HTTPS / RESTful JSON / Bearer JWT Authorization
           ▼
[ ASP.NET CORE WEB API (.NET 10) ]
  ├── [ CORS & Rate Limiting Middleware ]
  ├── [ AuthController (OTP Generate, Verify, @ogr.dpu.edu.tr Domain Filter) ]
  ├── [ ForumController (Microblog, Post, Like, Comment, Report Threading) ]
  ├── [ MarketplaceController (Listing, Filter, Safe Pickup Point Routing) ]
  ├── [ IMemoryCache ] ── (Hızlı OTP Önbellekleme & 10 Dk TTL Koruması)
           │
           │ Entity Framework Core 2022 (Code-First / Connection Resiliency)
           ▼
[ MICROSOFT SQL SERVER 2022 ] ── (DpuKampusDb: Users, Forum, Listings, Clubs, Notes)
      </div>
    </div>

    <!-- Frontend & Backend Detay Kartları -->
    <div class="grid-2" style="margin-bottom: 10px;">
      <div class="card">
        <h3 class="item-title" style="color: #0F766E;">💻 İstemci Katmanı (Frontend)</h3>
        <p style="font-size:7.5pt; color:#475569; margin-bottom:5px;">React 18 ve TypeScript ile tip güvenliği en üst düzeyde tutulmuştur:</p>
        <ul style="font-size: 7.5pt; color: #334155; padding-left: 12px; line-height: 1.45;">
          <li><strong>Vite Build Aracı:</strong> Hızlı HMR (Hot Module Replacement) ve optimize edilmiş minified paket boyutu (&lt;600KB dist JS).</li>
          <li><strong>Tailwind CSS 3.4:</strong> Tasarım tutarlılığı, hızlı prototipleme ve sıfır CSS çakışması.</li>
          <li><strong>Framer Motion:</strong> Sayfa geçişleri, portala giriş/çıkış splash animasyonları, modal açılış efektleri.</li>
          <li><strong>Lucide React:</strong> Hafif, modern ve anlaşılır SVG vektörel ikon kütüphanesi.</li>
          <li><strong>React Router v6:</strong> ProtectedRoute koruması ve istemci tarafı yönlendirme (SPA).</li>
        </ul>
      </div>

      <div class="card">
        <h3 class="item-title" style="color: #1E3A8A;">⚙️ Sunucu Katmanı (Backend)</h3>
        <p style="font-size:7.5pt; color:#475569; margin-bottom:5px;">ASP.NET Core Web API üzerinde kurumsal mimari prensipleri:</p>
        <ul style="font-size: 7.5pt; color: #334155; padding-left: 12px; line-height: 1.45;">
          <li><strong>Controller &amp; Action Modeli:</strong> SRP (Single Responsibility Principle) uyarınca ayrıştırılmış uç noktalar.</li>
          <li><strong>ReferenceHandler.IgnoreCycles:</strong> İlişkisel EF Core varlıklarında sonsuz JSON döngülerini önleyici serileştirme.</li>
          <li><strong>IMemoryCache Entegrasyonu:</strong> 6 haneli OTP doğrulama kodlarının bellek içi güvenli ve süreli tutulması.</li>
          <li><strong>RetryOnFailure:</strong> Veritabanı geçici bağlantı kopmalarına karşı 3 aşamalı otomatik yeniden deneme kurgusu.</li>
          <li><strong>Hibrit Veri Modeli:</strong> Canlı API olmadığı durumlarda dahi çalışabilen akıllı In-Memory Mock Store yedeklemesi.</li>
        </ul>
      </div>
    </div>

    <!-- Teknoloji Tablosu -->
    <table class="data-table">
      <thead>
        <tr>
          <th>Bileşen</th>
          <th>Seçilen Teknoloji</th>
          <th>Sürüm</th>
          <th>Sağladığı Katma Değer &amp; Fonksiyon</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>İstemci Çerçevesi</strong></td>
          <td>React &amp; TypeScript</td>
          <td>v18.3.1 / v5.6</td>
          <td>Tip güvenli, bileşen tabanlı, sürdürülebilir reaktif ön yüz.</td>
        </tr>
        <tr>
          <td><strong>Stil &amp; Animasyon</strong></td>
          <td>Tailwind CSS &amp; Framer Motion</td>
          <td>v3.4 / v14.1</td>
          <td>Modern kurumsal görünüm, mikromimikler ve akıcı geçişler.</td>
        </tr>
        <tr>
          <td><strong>Arka Uç Platformu</strong></td>
          <td>ASP.NET Core Web API</td>
          <td>.NET 10.0 / C#</td>
          <td>Yüksek eşzamanlı istek işleme kapasitesi ve kurumsal güvenlik.</td>
        </tr>
        <tr>
          <td><strong>ORM &amp; Veritabanı</strong></td>
          <td>Entity Framework Core &amp; MS SQL</td>
          <td>EF Core 2022</td>
          <td>Code-First mimari, LINQ sorgu optimizasyonu, otomatik tohumlama.</td>
        </tr>
        <tr>
          <td><strong>Bellek Önbelleği</strong></td>
          <td>Microsoft Extensions Caching</td>
          <td>v8.0 / v10.0</td>
          <td>Tek kullanımlık 6 haneli OTP kodları için 10 dakikalık TTL önbelleği.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="page-footer">
    <span>Kütahya Dumlupınar Üniversitesi · Mühendislik Fakültesi</span>
    <span>DPÜ Kampüs Platformu Tanıtım Raporu</span>
    <span>Sayfa 3 / 12</span>
  </div>
</div>

<!-- ========================================== -->
<!-- SAYFA 4: KİMLİK DOĞRULAMA VE ANA SAYFA    -->
<!-- ========================================== -->
<div class="page">
  <div class="page-header">
    <div class="brand">
      <span style="font-size:11pt;">🎓</span> DPÜ KAMPÜS PLATFORMU · PROJE TANITIM RAPORU
    </div>
    <div>BÖLÜM 3: KİMLİK DOĞRULAMA &amp; ANA SAYFA</div>
  </div>

  <div class="page-body">
    <div class="section-tag">Modül 1 &amp; 2</div>
    <h1 class="section-title">Güvenli Kimlik Portalı &amp; Kampüs Nabzı</h1>
    <p class="lead">Platforma yalnızca yetkilendirilmiş DPÜ mensuplarının girebilmesi için tasarlanan çift aşamalı kimlik doğrulama portalı ve zamana duyarlı dinamik ana sayfa merkezi.</p>

    <div class="grid-2" style="margin-bottom: 10px;">
      <!-- Kimlik Doğrulama -->
      <div class="card card-highlight">
        <h3 class="item-title" style="color: #0F766E;">🔐 @ogr.dpu.edu.tr Doğrulaması &amp; OTP</h3>
        <p style="font-size:7.5pt; color:#475569; margin-bottom:6px;">
          Dışarıdan gelebilecek bot, spam ve sahte hesapları engellemek için katı kurallar uygulanır:
        </p>
        <div class="step-pill">
          <div class="step-num">1</div>
          <div style="font-size:7.5pt;"><strong>E-Posta Kontrolü:</strong> Girdi regex ile taranır; yalnızca <code>@ogr.dpu.edu.tr</code> uzantısı kabul edilir.</div>
        </div>
        <div class="step-pill">
          <div class="step-num">2</div>
          <div style="font-size:7.5pt;"><strong>6 Haneli OTP Üretimi:</strong> <code>RandomNumberGenerator.GetInt32(100000, 999999)</code> ile kriptografik güvenli kod üretilir.</div>
        </div>
        <div class="step-pill">
          <div class="step-num">3</div>
          <div style="font-size:7.5pt;"><strong>Bellekte Süre Sınırı:</strong> Kod, IMemoryCache içinde 10 dakika geçerli olacak şekilde saklanır.</div>
        </div>
        <div class="step-pill">
          <div class="step-num">4</div>
          <div style="font-size:7.5pt;"><strong>Portala Geçiş Efekti:</strong> Doğrulama sonrası Framer Motion ile tasarlanan <em>PortalSplashOverlay</em> ile animasyonlu geçiş sağlanır.</div>
        </div>
      </div>

      <!-- Misafir Modu & Güvenlik Kilidi -->
      <div class="card">
        <h3 class="item-title" style="color: #1E3A8A;">🛡️ Misafir Modu &amp; GuestLockModal</h3>
        <p style="font-size:7.5pt; color:#475569; margin-bottom:6px;">
          Giriş yapmamış kullanıcılar kampüs ana sayfasını, hava durumunu, yemekhane menüsünü ve resmi duyuruları gezebilir. Ancak:
        </p>
        <ul style="font-size:7.5pt; color:#334155; padding-left:12px; line-height:1.45;">
          <li>İkinci el ürün ekleme, fiyat teklifi verme,</li>
          <li>Forumda soru sorma veya yorum yazma,</li>
          <li>Kayıp eşya sahibine mesaj atma,</li>
          <li>Ders notu indirme veya oy kullanma</li>
        </ul>
        <p style="font-size:7.5pt; color:#0F766E; margin-top:6px; font-weight:600; background:#F0FDFA; padding:5px; border-radius:4px; border:1px solid #CCFBF1;">
          İşlemlerinde sistem <strong>GuestLockModal</strong> penceresini devreye sokarak öğrenciyi kayıt olmaya teşvik eder.
        </p>
      </div>
    </div>

    <!-- Ana Sayfa Özellikleri -->
    <h2 class="subsection-title">Kampüs Nabzı ve Zamana Duyarlı Karşılama</h2>
    <div class="grid-3" style="margin-bottom: 10px;">
      <div class="card">
        <div class="badge badge-teal" style="margin-bottom:3px;">Kişiselleştirilmiş Selamlama</div>
        <h3 class="item-title">Zamana Duyarlı Karşılama</h3>
        <p style="font-size:7.2pt; color:#475569;">
          Günün saatine göre öğrenciyi <em>"Günaydın Selin"</em>, <em>"İyi öğlenler Efe"</em> veya <em>"Hayırlı akşamlar Batuhan"</em> sözleriyle karşılar.
        </p>
      </div>
      <div class="card">
        <div class="badge badge-blue" style="margin-bottom:3px;">Resmi Entegrasyon</div>
        <h3 class="item-title">Akademik &amp; İdari Duyurular</h3>
        <p style="font-size:7.2pt; color:#475569;">
          Akademik takvim, vize tarihleri, yemekhane saat değişiklikleri ve rektörlük burs ilanları kategori etiketleriyle anlık sunulur.
        </p>
      </div>
      <div class="card">
        <div class="badge badge-purple" style="margin-bottom:3px;">Sosyal Vitrin</div>
        <h3 class="item-title">Öne Çıkan Kampüs Etkinlikleri</h3>
        <p style="font-size:7.2pt; color:#475569;">
          Teknoloji zirveleri, React atölyeleri ve Gurbetçi Gençler maç izleme buluşmaları gün-ay takvim kartlarıyla listelenir.
        </p>
      </div>
    </div>

    <!-- Mockup Görünümü: Duyuru & Karşılama -->
    <div class="mockup-frame">
      <div class="mockup-header">
        <div class="mockup-dot" style="background:#EF4444;"></div>
        <div class="mockup-dot" style="background:#F59E0B;"></div>
        <div class="mockup-dot" style="background:#10B981;"></div>
        <span style="margin-left:6px;">DPÜ Kampüs · Ana Sayfa &amp; Kampüs Akışı Canlı Önizlemesi</span>
      </div>
      <div class="mockup-body" style="display:flex; gap:10px; align-items:center;">
        <div style="flex:1;">
          <div style="font-size:7.5pt; color:#0D9488; font-weight:700;">EVLİYA ÇELEBİ YERLEŞKESİ · AKTİF DÖNEM</div>
          <div style="font-size:10.5pt; font-weight:800; color:#0F172A;">İyi öğlenler, Efe · Bugün Kampüste Ne Var?</div>
          <div style="font-size:7.2pt; color:#64748B; margin-top:2px;">
            Hava: 12°C Parçalı Bulutlu · Merkez Kütüphane Doluluk: %64 · Yemekhane Servisi: Açık
          </div>
        </div>
        <div style="display:flex; gap:5px;">
          <span class="badge badge-amber">📌 Vize Takvimi Açıklandı</span>
          <span class="badge badge-rose">🍲 Yemekhane Saatleri Güncellendi</span>
        </div>
      </div>
    </div>
  </div>

  <div class="page-footer">
    <span>Kütahya Dumlupınar Üniversitesi · Mühendislik Fakültesi</span>
    <span>DPÜ Kampüs Platformu Tanıtım Raporu</span>
    <span>Sayfa 4 / 12</span>
  </div>
</div>

<!-- ========================================== -->
<!-- SAYFA 5: ÖĞRENCİ PAZARI (MARKETPLACE)      -->
<!-- ========================================== -->
<div class="page">
  <div class="page-header">
    <div class="brand">
      <span style="font-size:11pt;">🎓</span> DPÜ KAMPÜS PLATFORMU · PROJE TANITIM RAPORU
    </div>
    <div>BÖLÜM 4: ÖĞRENCİ PAZARI &amp; ASKIDA EŞYA</div>
  </div>

  <div class="page-body">
    <div class="section-tag">Modül 3</div>
    <h1 class="section-title">Öğrenci Pazarı &amp; "Askıda Ücretsiz" Sistemi</h1>
    <p class="lead">Öğrencilerin bütçesini koruyan, kampüs sınırları içinde güvenli elden teslimat sağlayan ve mezunların ihtiyaç sahiplerine ücretsiz eşya bağışlamasına olanak tanıyan pazar yeri.</p>

    <!-- Pazarın 3 Ana Direği -->
    <div class="grid-3" style="margin-bottom: 10px;">
      <div class="card card-highlight">
        <h3 class="item-title" style="color:#0F766E;">🎁 "Askıda Ücretsiz" Modeli</h3>
        <p style="font-size:7.2pt; color:#475569;">
          Mezun olan veya ihtiyacı kalmayan öğrencilerin ders notlarını, masa lambalarını, kırtasiye malzemelerini <strong>0 TL</strong> bedelle diğer öğrencilere hediye etmesini sağlar.
        </p>
      </div>
      <div class="card">
        <h3 class="item-title" style="color:#1E3A8A;">📍 Güvenli Kampüs Noktaları</h3>
        <p style="font-size:7.2pt; color:#475569;">
          Alıcı ve satıcı güvenliği için teslimat; <em>Merkez Kütüphane, Mühendislik Kantini, Bedesten Çarşı ve KYK Yurtlar</em> gibi resmi noktalara sabitlenmiştir.
        </p>
      </div>
      <div class="card">
        <h3 class="item-title" style="color:#7C3AED;">💬 Entegre Anlık Sohbet</h3>
        <p style="font-size:7.2pt; color:#475569;">
          Telefon numarası veya özel bilgi vermeden ilan kartı üzerinden satıcıyla anında güvenli sohbet (ChatDrawer) başlatılabilir.
        </p>
      </div>
    </div>

    <!-- İlan Örnekleri Tablosu -->
    <h2 class="subsection-title">Örnek Canlı Pazar İlanları &amp; Durum Sınıflandırması</h2>
    <table class="data-table">
      <thead>
        <tr>
          <th>Ürün Başlığı</th>
          <th>Kategori</th>
          <th>Fiyat</th>
          <th>Kullanım Durumu</th>
          <th>Teslimat Noktası</th>
          <th>Satıcı / Durum</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Casio FX-991ES Plus Hesap Makinesi</strong></td>
          <td><span class="badge badge-blue">Elektronik</span></td>
          <td><strong>350 ₺</strong></td>
          <td>Az Kullanılmış</td>
          <td>Mühendislik Kantini</td>
          <td>Efe Alsaç (Mühendislik)</td>
        </tr>
        <tr>
          <td><strong>Bilgisayar Müh. Ders Notları (1-3. Sınıf)</strong></td>
          <td><span class="badge badge-purple">Ders Kitabı</span></td>
          <td><span class="badge badge-teal">Ücretsiz (Askıda)</span></td>
          <td>İyi Durumda</td>
          <td>Merkez Kütüphane</td>
          <td>Zeynep Kaya (Fen-Edebiyat)</td>
        </tr>
        <tr>
          <td><strong>Nespresso Essenza Mini Kahve Makinesi</strong></td>
          <td><span class="badge badge-gray">Ev &amp; Yurt</span></td>
          <td><strong>1.200 ₺</strong></td>
          <td>Sıfır Gibi</td>
          <td>KYK Yurtlar</td>
          <td>Mert Demir (Teknik Bilimler)</td>
        </tr>
        <tr>
          <td><strong>Çalışma Masası LED Lambası (Doğal Işık)</strong></td>
          <td><span class="badge badge-gray">Ev &amp; Yurt</span></td>
          <td><span class="badge badge-teal">Ücretsiz (Askıda)</span></td>
          <td>İyi Durumda</td>
          <td>KYK Yurtlar Önü</td>
          <td>Selin Yıldız (İİBF)</td>
        </tr>
        <tr>
          <td><strong>Staedtler Teknik Çizim Seti (Mimarlık)</strong></td>
          <td><span class="badge badge-amber">Kırtasiye</span></td>
          <td><strong>180 ₺</strong></td>
          <td>Az Kullanılmış</td>
          <td>Bedesten Çarşı</td>
          <td>Burak Şahin (Eğitim Fak.)</td>
        </tr>
      </tbody>
    </table>

    <!-- Güvenlik ve Dolandırıcılık Önleme Kuralları -->
    <div class="card card-highlight" style="margin-top: 8px;">
      <h3 class="item-title" style="color:#0F766E;">🛡️ Güvenlik ve Pazar Yeri İlkeleri</h3>
      <div class="grid-2" style="font-size:7.2pt; color:#334155; margin-top:3px;">
        <div>
          <strong>Elden Teslimat Kuralı:</strong> Kargoyla veya IBAN ile önceden para gönderme riski ortadan kaldırılmıştır; tüm alışverişler kampüs sınırlarında elden teslim edilir.
        </div>
        <div>
          <strong>Öğrenci Doğrulama Rozeti:</strong> Her ilanın altında satıcının kayıtlı olduğu fakülte ve DPÜ öğrenci kimlik doğrulama mührü gösterilir.
        </div>
      </div>
    </div>
  </div>

  <div class="page-footer">
    <span>Kütahya Dumlupınar Üniversitesi · Mühendislik Fakültesi</span>
    <span>DPÜ Kampüs Platformu Tanıtım Raporu</span>
    <span>Sayfa 5 / 12</span>
  </div>
</div>

<!-- ========================================== -->
<!-- SAYFA 6: KAMPÜS RADAR                      -->
<!-- ========================================== -->
<div class="page">
  <div class="page-header">
    <div class="brand">
      <span style="font-size:11pt;">🎓</span> DPÜ KAMPÜS PLATFORMU · PROJE TANITIM RAPORU
    </div>
    <div>BÖLÜM 5: KAMPÜS RADAR</div>
  </div>

  <div class="page-body">
    <div class="section-tag">Modül 4</div>
    <h1 class="section-title">Kampüs Radar: Yemekhane &amp; Yol Arkadaşlığı</h1>
    <p class="lead">Günün DPÜ yemekhane menüsünün anlık öğrenci memnuniyet analitiği ve hafta sonu şehirlerarası güvenli öğrenci yol arkadaşlığı (Carpooling) ağı.</p>

    <!-- Yemekhane Menüsü ve Analitiği -->
    <div class="card card-highlight" style="margin-bottom: 10px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <div>
          <h3 class="item-title" style="color:#0F766E;">🍲 Günün DPÜ Yemekhane Menüsü &amp; Lezzet Barometresi</h3>
          <p style="font-size:7.2pt; color:#64748B;">Evliya Çelebi Yerleşkesi Merkezi Yemekhane · 4 Kap Tabldot</p>
        </div>
        <span class="badge badge-teal">Toplam 233 Öğrenci Oyladı</span>
      </div>

      <div class="grid-4" style="margin-bottom:6px;">
        <div style="background:#FFFFFF; border:1px solid #E2E8F0; padding:6px; border-radius:5px; text-align:center;">
          <div style="font-size:7pt; color:#64748B;">1. Kap Çorba</div>
          <div style="font-size:8pt; font-weight:700; color:#0F172A; margin-top:2px;">Mercimek Çorbası</div>
        </div>
        <div style="background:#FFFFFF; border:1px solid #E2E8F0; padding:6px; border-radius:5px; text-align:center;">
          <div style="font-size:7pt; color:#64748B;">2. Kap Ana Yemek</div>
          <div style="font-size:8pt; font-weight:700; color:#0F172A; margin-top:2px;">Fırında Tavuk But</div>
        </div>
        <div style="background:#FFFFFF; border:1px solid #E2E8F0; padding:6px; border-radius:5px; text-align:center;">
          <div style="font-size:7pt; color:#64748B;">3. Kap Yardımcı</div>
          <div style="font-size:8pt; font-weight:700; color:#0F172A; margin-top:2px;">Bulgur Pilavı</div>
        </div>
        <div style="background:#FFFFFF; border:1px solid #E2E8F0; padding:6px; border-radius:5px; text-align:center;">
          <div style="font-size:7pt; color:#64748B;">4. Kap Tamamlayıcı</div>
          <div style="font-size:8pt; font-weight:700; color:#0F172A; margin-top:2px;">Şalgam Turşusu</div>
        </div>
      </div>

      <!-- Memnuniyet İstatistikleri Çubuğu -->
      <div style="background:#F1F5F9; border-radius:5px; padding:6px; margin-top:4px;">
        <div style="display:flex; justify-content:space-between; font-size:7.2pt; font-weight:700; margin-bottom:3px;">
          <span style="color:#0F766E;">👍 Lezzetli: 142 Oy (%61)</span>
          <span style="color:#D97706;">😐 İdare Eder: 68 Oy (%29)</span>
          <span style="color:#E11D48;">👎 Beğenmedim: 23 Oy (%10)</span>
        </div>
        <div style="height:7px; border-radius:4px; overflow:hidden; display:flex;">
          <div style="width:61%; background:#0D9488;"></div>
          <div style="width:29%; background:#F59E0B;"></div>
          <div style="width:10%; background:#F43F5E;"></div>
        </div>
      </div>
    </div>

    <!-- Yol Arkadaşlığı / Ridesharing -->
    <h2 class="subsection-title">Şehirlerarası Öğrenci Yol Arkadaşlığı (Ridesharing)</h2>
    <p style="font-size:7.5pt; color:#475569; margin-bottom:6px;">
      Öğrencilerin memleketlerine veya komşu şehirlere gidiş geliş masraflarını hafifleten, güvenli ve onaylı yolculuk ağı:
    </p>

    <table class="data-table">
      <thead>
        <tr>
          <th>Güzergâh</th>
          <th>Kalkış Saati</th>
          <th>Buluşma Noktası</th>
          <th>Koltuk Durumu</th>
          <th>Yakıt Katkısı</th>
          <th>Sürücü Bilgisi</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Kütahya ➔ Eskişehir</strong></td>
          <td>Cuma · 07:30</td>
          <td>Kampüs Ana Kapısı</td>
          <td><span class="badge badge-teal">2 Boş Koltuk</span> (2/4)</td>
          <td><strong>80 ₺</strong> / kişi</td>
          <td>Mert Demir (Teknik Bilimler)</td>
        </tr>
        <tr>
          <td><strong>Kütahya ➔ Bursa</strong></td>
          <td>Cumartesi · 08:00</td>
          <td>Bedesten Çarşı Önü</td>
          <td><span class="badge badge-teal">2 Boş Koltuk</span> (1/3)</td>
          <td><strong>150 ₺</strong> / kişi</td>
          <td>Burak Şahin (Eğitim Fak.)</td>
        </tr>
        <tr>
          <td><strong>Kütahya ➔ Afyonkarahisar</strong></td>
          <td>Cuma · 09:00</td>
          <td>Merkez Kütüphane</td>
          <td><span class="badge badge-amber">1 Boş Koltuk</span> (3/4)</td>
          <td><strong>60 ₺</strong> / kişi</td>
          <td>Selin Yıldız (İİBF)</td>
        </tr>
        <tr>
          <td><strong>Kütahya ➔ Konya</strong></td>
          <td>Pazar · 06:30</td>
          <td>Kampüs Ana Kapısı</td>
          <td><span class="badge badge-teal">3 Boş Koltuk</span> (0/3)</td>
          <td><strong>200 ₺</strong> / kişi</td>
          <td>Zeynep Kaya (Fen-Edebiyat)</td>
        </tr>
      </tbody>
    </table>

    <div class="card card-navy" style="margin-top:8px;">
      <h3 style="font-size:8pt;">💡 Yol Arkadaşlığı Güvenlik Algoritması</h3>
      <p style="font-size:7.2pt; line-height:1.4;">
        Yolculuk ilanları yalnızca kurumsal e-posta ile doğrulanmış öğrenci sürücüler tarafından oluşturulabilir. Koltuk rezervasyonu yapan yolcuların profilleri sürücüye anında iletilir ve platform içi mesajlaşma ile seyahat öncesi detaylar teyit edilir.
      </p>
    </div>
  </div>

  <div class="page-footer">
    <span>Kütahya Dumlupınar Üniversitesi · Mühendislik Fakültesi</span>
    <span>DPÜ Kampüs Platformu Tanıtım Raporu</span>
    <span>Sayfa 6 / 12</span>
  </div>
</div>

<!-- ========================================== -->
<!-- SAYFA 7: KAMPÜS FORUMU (MİKROBLOG)         -->
<!-- ========================================== -->
<div class="page">
  <div class="page-header">
    <div class="brand">
      <span style="font-size:11pt;">🎓</span> DPÜ KAMPÜS PLATFORMU · PROJE TANITIM RAPORU
    </div>
    <div>BÖLÜM 6: KAMPÜS FORUMU</div>
  </div>

  <div class="page-body">
    <div class="section-tag">Modül 5</div>
    <h1 class="section-title">Kampüs Forumu: Twitter/X Tarzı Mikroblog</h1>
    <p class="lead">Öğrencilerin dersler, sınavlar, yemekhane, ulaşım ve kampüs yaşamı hakkında anlık düşüncelerini paylaştığı, şeffaf, etkileşimli ve moderasyonlu tartışma alanı.</p>

    <!-- Forum Konu Etiketleri -->
    <div class="card card-highlight" style="margin-bottom: 10px;">
      <h3 class="item-title" style="color:#0F766E;">🏷️ Resmi Konu Başlıkları &amp; Dinamik Filtreleme</h3>
      <div style="display:flex; flex-wrap:wrap; gap:5px; margin-top:5px;">
        <span class="badge badge-gray" style="font-size:7.5pt; padding:3px 7px;">#Genel (Gündem &amp; Duyurular)</span>
        <span class="badge badge-amber" style="font-size:7.5pt; padding:3px 7px;">#VizeFinal (Soru &amp; Çıkmışlar)</span>
        <span class="badge badge-teal" style="font-size:7.5pt; padding:3px 7px;">#Yemekhane (Menü &amp; Sıra)</span>
        <span class="badge badge-blue" style="font-size:7.5pt; padding:3px 7px;">#KütahyaUlaşım (Otobüs &amp; Seferler)</span>
        <span class="badge badge-purple" style="font-size:7.5pt; padding:3px 7px;">#SoruCevap (Danışma &amp; Yardım)</span>
        <span class="badge badge-rose" style="font-size:7.5pt; padding:3px 7px;">#KampüsHayatı (Sosyal Yaşam)</span>
      </div>
    </div>

    <!-- Forumun Teknik Yetenekleri -->
    <div class="grid-2" style="margin-bottom: 10px;">
      <div class="card">
        <h3 class="item-title" style="color:#0F766E;">🎭 Kontrollü Anonim Paylaşım</h3>
        <p style="font-size:7.2pt; color:#475569; margin-bottom:5px;">
          Öğrenciler çekindikleri konularda veya samimi soru-cevaplarda <em>"Anonim Öğrenci"</em> olarak paylaşım yapabilir.
        </p>
        <p style="font-size:7.2pt; color:#334155; background:#F8FAFC; padding:5px; border-radius:4px; border-left:2px solid #0D9488;">
          <strong>Moderasyon Dengesi:</strong> Paylaşım ön yüzde <code>Anonim Mühendislik Öğrencisi</code> görünürken, veritabanında <code>AuthorId</code> güvence altına alınır; nefret söylemi veya ihlal durumunda moderatörlerce incelenebilir.
        </p>
      </div>

      <div class="card">
        <h3 class="item-title" style="color:#1E3A8A;">🔥 Sıralama &amp; Popülerlik Algoritması</h3>
        <p style="font-size:7.2pt; color:#475569; margin-bottom:5px;">
          Gönderiler <em>"En Yeniler"</em> veya <em>"Popüler Gönderiler"</em> olarak filtrelenebilir.
        </p>
        <div class="code-box" style="margin:0;">
<span class="comment">// Popülerlik Skorlama Formülü</span>
<span class="kw">double</span> score = (p.Likes.Count * <span class="str">3.0</span>) + 
               (p.Comments.Count * <span class="str">2.0</span>) + 
               (p.ViewCount * <span class="str">0.1</span>);
<span class="kw">return</span> posts.OrderByDescending(p =&gt; score);
        </div>
      </div>
    </div>

    <!-- Örnek Gönderi Akışı Mockup -->
    <h2 class="subsection-title">Canlı Forum Gönderileri &amp; Yorum Hiyerarşisi</h2>
    <div class="mockup-frame">
      <div class="mockup-header">
        <div class="mockup-dot" style="background:#0D9488;"></div>
        <span style="margin-left:6px;">#VizeFinal · Canlı Akış</span>
      </div>
      <div class="mockup-body" style="font-size:7.8pt;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <strong>Efe Alsaç</strong> <span style="color:#64748B;">· Mühendislik Fakültesi · 25 dk önce</span>
          </div>
          <span class="badge badge-amber">#VizeFinal</span>
        </div>
        <p style="color:#1E293B; margin:5px 0;">
          "Mühendislik Fakültesi Diferansiyel Denklemler vizesi için Merkez Kütüphane 2. katta çalışan var mı? 2024 ve 2025 çıkmış soru çözümleri için çalışma grubu oluşturduk, katılmak isteyen gelebilir."
        </p>
        <div style="display:flex; gap:14px; font-size:7.2pt; color:#64748B; border-top:1px solid #F1F5F9; padding-top:4px;">
          <span>❤️ 14 Beğeni</span>
          <span>💬 3 Yorum</span>
          <span>👁️ 186 Görüntülenme</span>
          <span>🚩 Bildir</span>
        </div>
        <!-- İçiçe Yorum -->
        <div style="margin-top:5px; padding-left:10px; border-left:2px solid #E2E8F0; font-size:7.2pt; color:#475569;">
          <strong>Zeynep Kaya:</strong> "Ben de oradayım, Laplace dönüşümleri kısmında takıldım. Yan masadayım, gelebilir miyim?"
        </div>
      </div>
    </div>
  </div>

  <div class="page-footer">
    <span>Kütahya Dumlupınar Üniversitesi · Mühendislik Fakültesi</span>
    <span>DPÜ Kampüs Platformu Tanıtım Raporu</span>
    <span>Sayfa 7 / 12</span>
  </div>
</div>

<!-- ========================================== -->
<!-- SAYFA 8: TOPLULUKLAR & KAYIP BULUNTU       -->
<!-- ========================================== -->
<div class="page">
  <div class="page-header">
    <div class="brand">
      <span style="font-size:11pt;">🎓</span> DPÜ KAMPÜS PLATFORMU · PROJE TANITIM RAPORU
    </div>
    <div>BÖLÜM 7: TOPLULUKLAR &amp; KAYIP-BULUNTU</div>
  </div>

  <div class="page-body">
    <div class="section-tag">Modül 6 &amp; 7</div>
    <h1 class="section-title">Topluluklar, Etkinlikler &amp; Kayıp Panosu</h1>
    <p class="lead">Kampüsün sosyal omurgasını oluşturan öğrenci kulüpleri, anlık kontenjan takip mekanizmalı etkinlik yönetimi ve kayıp eşyaların hızla bulunmasını sağlayan dijital pano.</p>

    <div class="grid-2" style="margin-bottom: 10px;">
      <!-- Kulüpler & Etkinlikler -->
      <div>
        <h2 class="subsection-title" style="margin-top:0;">Öğrenci Toplulukları ve Kulüp Hub'ı</h2>
        <div class="card" style="margin-bottom:6px;">
          <div style="display:flex; gap:8px; align-items:center;">
            {"<img src='" + gurbetci_b64 + "' style='width:32px;height:32px;border-radius:5px;object-fit:cover;'>" if gurbetci_b64 else ""}
            <div>
              <h3 class="item-title" style="margin:0;">DPÜ Gurbetçi Gençler</h3>
              <p style="font-size:6.8pt; color:#64748B;">261 Üye · Sosyal Sorumluluk &amp; Maç Organizasyonu</p>
            </div>
          </div>
          <p style="font-size:7.2pt; color:#475569; margin-top:5px;">
            Haftalık Süper Lig maç izleme buluşmaları ve tribün havasını Bedesten Tesisleri'ne taşıyan en aktif üniversite topluluklarından biri.
          </p>
        </div>

        <div class="card">
          <h3 class="item-title">DPÜ Yazılım ve Bilişim Topluluğu</h3>
          <p style="font-size:6.8pt; color:#64748B;">312 Üye · Hackathon &amp; Web Geliştirme</p>
          <p style="font-size:7.2pt; color:#475569; margin-top:3px;">
            React, TypeScript ve ASP.NET Core atölyeleri düzenleyerek öğrencilerin sektörel yazılım yetkinliklerini artırır.
          </p>
        </div>
      </div>

      <!-- Etkinlik Kontenjan Takibi -->
      <div>
        <h2 class="subsection-title" style="margin-top:0;">Dinamik Kontenjan Takibi (QuotaBar)</h2>
        <div class="card card-highlight">
          <h3 class="item-title" style="color:#0F766E;">🎫 Teknoloji &amp; React Atölyesi</h3>
          <p style="font-size:7.2pt; color:#64748B;">Mühendislik A-201 Amfisi · 25 Kasım 14:00</p>
          <div style="margin-top:6px;">
            <div style="display:flex; justify-content:space-between; font-size:7.2pt; font-weight:600;">
              <span>Kayıtlı: 38 Öğrenci</span>
              <span style="color:#0D9488;">Kontenjan: 50 Kişi (%76 Dolu)</span>
            </div>
            <div style="height:6px; background:#E2E8F0; border-radius:3px; overflow:hidden; margin-top:3px;">
              <div style="width:76%; height:100%; background:#0D9488;"></div>
            </div>
          </div>
        </div>

        <div class="card" style="margin-top:6px;">
          <h3 class="item-title" style="color:#991B1B;">🎯 Siber Güvenlik CTF Çözüm Atölyesi</h3>
          <p style="font-size:7.2pt; color:#64748B;">Bilgisayar Lab 3 · 28 Kasım 10:00</p>
          <div style="margin-top:6px;">
            <div style="display:flex; justify-content:space-between; font-size:7.2pt; font-weight:600;">
              <span>Kayıtlı: 29 Öğrenci</span>
              <span style="color:#DC2626;">Kontenjan: 30 Kişi (%97 Dolu - Son 1 Koltuk)</span>
            </div>
            <div style="height:6px; background:#E2E8F0; border-radius:3px; overflow:hidden; margin-top:3px;">
              <div style="width:97%; height:100%; background:#EF4444;"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Kayıp & Buluntu Panosu -->
    <h2 class="subsection-title">Kayıp &amp; Buluntu Eşya Panosu</h2>
    <table class="data-table">
      <thead>
        <tr>
          <th>Eşya Adı</th>
          <th>Durum</th>
          <th>Unutulduğu / Bulunduğu Yer</th>
          <th>Bildiren Öğrenci</th>
          <th>Tarih</th>
          <th>İşlem</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Samsung Galaxy Buds2 Pro (Siyah)</strong></td>
          <td><span class="badge badge-rose">KAYIP</span></td>
          <td>Mühendislik Fakültesi Kantini</td>
          <td>Efe Alsaç</td>
          <td>18 Kasım</td>
          <td><span class="badge badge-blue">Mesaj Gönder</span></td>
        </tr>
        <tr>
          <td><strong>Öğrenci Kimlik Kartı (Zeynep Kaya)</strong></td>
          <td><span class="badge badge-teal">BULUNTU</span></td>
          <td>Merkez Kütüphane Girişi</td>
          <td>Mert Demir</td>
          <td>17 Kasım</td>
          <td><span class="badge badge-teal">Teslim Al</span></td>
        </tr>
        <tr>
          <td><strong>Araba Kumandası ve Anahtarlık</strong></td>
          <td><span class="badge badge-teal">BULUNTU</span></td>
          <td>KYK Yurtlar Önü Banklar</td>
          <td>Selin Yıldız</td>
          <td>16 Kasım</td>
          <td><span class="badge badge-blue">Mesaj Gönder</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="page-footer">
    <span>Kütahya Dumlupınar Üniversitesi · Mühendislik Fakültesi</span>
    <span>DPÜ Kampüs Platformu Tanıtım Raporu</span>
    <span>Sayfa 8 / 12</span>
  </div>
</div>

<!-- ========================================== -->
<!-- SAYFA 9: DERS NOTLARI & PROJE TAKIMI       -->
<!-- ========================================== -->
<div class="page">
  <div class="page-header">
    <div class="brand">
      <span style="font-size:11pt;">🎓</span> DPÜ KAMPÜS PLATFORMU · PROJE TANITIM RAPORU
    </div>
    <div>BÖLÜM 8: NOTLAR &amp; TAKIM EŞLEŞMESİ</div>
  </div>

  <div class="page-body">
    <div class="section-tag">Modül 8 &amp; 9</div>
    <h1 class="section-title">Ders Notları Arşivi &amp; TEKNOFEST Takım Ağı</h1>
    <p class="lead">Akademik başarıyı destekleyen fakülte bazlı açık ders notları arşivi ile ulusal teknoloji yarışmaları ve bitirme projeleri için disiplinlerarası ekip kurma merkezi.</p>

    <!-- Ders Notları Bölümü -->
    <div class="grid-2" style="margin-bottom: 10px;">
      <div class="card card-highlight">
        <h3 class="item-title" style="color:#0F766E;">📚 Açık Kaynak Ders Notları &amp; Upvote Sistemi</h3>
        <p style="font-size:7.2pt; color:#475569; margin-bottom:5px;">
          Fakülte ve bölüm bazında filtrelenebilen, öğrencilerin oylarıyla kalitesi belirlenen arşiv:
        </p>
        <ul style="font-size:7.2pt; color:#334155; padding-left:12px; line-height:1.45;">
          <li><strong>Veri Yapıları &amp; Algoritmalar:</strong> 24 Sayfa · 87 Beğeni (Mühendislik)</li>
          <li><strong>Diferansiyel Denklemler Özet:</strong> 18 Sayfa · 54 Beğeni (Mühendislik)</li>
          <li><strong>İşletme Yönetimi Final Soruları:</strong> 32 Sayfa · 43 Beğeni (İİBF)</li>
          <li><strong>Devre Analizi Formül Kağıdı:</strong> 8 Sayfa · 31 Beğeni (Teknik Bilimler)</li>
        </ul>
      </div>

      <div class="card">
        <h3 class="item-title" style="color:#1E3A8A;">🚀 TEKNOFEST &amp; TÜBİTAK Proje Takımı Panosu</h3>
        <p style="font-size:7.2pt; color:#475569; margin-bottom:5px;">
          Yarışmalara ve bitirme tezlerine takım arkadaşı arayan öğrencilerin ilan panosu:
        </p>
        <div style="font-size:7.2pt; background:#F8FAFC; border:1px solid #E2E8F0; padding:5px; border-radius:4px; margin-bottom:5px;">
          <div style="display:flex; justify-content:space-between; font-weight:700;">
            <span>Teknofest 2027: Yapay Zeka Tarım Dronu</span>
            <span class="badge badge-amber">Teknofest</span>
          </div>
          <div style="color:#64748B; margin-top:2px;">Aranan: React &amp; ASP.NET Core Geliştirici (3/5 Üye)</div>
        </div>
        <div style="font-size:7.2pt; background:#F8FAFC; border:1px solid #E2E8F0; padding:5px; border-radius:4px;">
          <div style="display:flex; justify-content:space-between; font-weight:700;">
            <span>TÜBİTAK 2209-A: Kampüs İçi Navigasyon</span>
            <span class="badge badge-blue">TÜBİTAK</span>
          </div>
          <div style="color:#64748B; margin-top:2px;">Aranan: Flutter Mobil Geliştirici (2/4 Üye)</div>
        </div>
      </div>
    </div>

    <!-- Dijital Öğrenci QR Kimlik Kartı -->
    <h2 class="subsection-title">Kullanıcı Profili ve Dijital QR Öğrenci Kartı (QRModal)</h2>
    <div class="grid-2">
      <div class="card card-navy">
        <h3 style="font-size:8.5pt; margin-bottom:3px;">🪪 Dijital Öğrenci Cüzdanı &amp; Doğrulama</h3>
        <p style="font-size:7.2pt; line-height:1.45;">
          Öğrencinin platformdaki güvenilirlik puanı, aktif ilanları, kayıt olduğu kulüpler, indirdiği ders notları ve resmi DPÜ öğrenci kimlik doğrulama mührü profil sayfasında toplanır.
        </p>
        <div style="margin-top:6px; display:flex; gap:6px;">
          <span class="badge badge-teal" style="background:#0D9488; color:white; border:none;">Doğrulanmış Öğrenci ✓</span>
          <span class="badge badge-blue" style="background:#2563EB; color:white; border:none;">Mühendislik Fakültesi</span>
        </div>
      </div>

      <div class="card" style="display:flex; align-items:center; gap:10px; background:#F0FDFA; border-color:#99F6E4;">
        <div style="background:white; padding:6px; border-radius:5px; border:1px solid #CCFBF1; text-align:center;">
          <div style="font-family:'JetBrains Mono', monospace; font-size:16pt; line-height:1;">▦</div>
          <div style="font-size:5.5pt; color:#64748B; margin-top:2px;">DPÜ-QR</div>
        </div>
        <div>
          <h3 class="item-title" style="color:#0F766E;">Hızlı Etkinlik &amp; Yemekhane Geçişi</h3>
          <p style="font-size:7.2pt; color:#334155;">
            Sistemde üretilen benzersiz QR kod sayesinde kulüp etkinlik girişlerinde yoklama saniyeler içinde alınır; basılı bilet veya liste karmaşası son bulur.
          </p>
        </div>
      </div>
    </div>
  </div>

  <div class="page-footer">
    <span>Kütahya Dumlupınar Üniversitesi · Mühendislik Fakültesi</span>
    <span>DPÜ Kampüs Platformu Tanıtım Raporu</span>
    <span>Sayfa 9 / 12</span>
  </div>
</div>

<!-- ========================================== -->
<!-- SAYFA 10: VERİTABANI ŞEMASI & MODELLER     -->
<!-- ========================================== -->
<div class="page">
  <div class="page-header">
    <div class="brand">
      <span style="font-size:11pt;">🎓</span> DPÜ KAMPÜS PLATFORMU · PROJE TANITIM RAPORU
    </div>
    <div>BÖLÜM 9: VERİTABANI VE VERİ MODELİ</div>
  </div>

  <div class="page-body">
    <div class="section-tag">Veri Mimarisi</div>
    <h1 class="section-title">Veritabanı Tasarımı &amp; Varlık İlişkileri</h1>
    <p class="lead">Microsoft SQL Server 2022 üzerinde Entity Framework Core Code-First yaklaşımıyla tasarlanan ilişkisel veri tablosu şeması ve kısıtlamalar.</p>

    <!-- Tablo Modelleri İncelemesi -->
    <table class="data-table">
      <thead>
        <tr>
          <th>Tablo / Entity</th>
          <th>Birincil Anahtar (PK)</th>
          <th>Yabancı Anahtarlar (FK)</th>
          <th>Önemli Kolonlar ve Tipler</th>
          <th>İlişki Tipi &amp; Açıklama</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Users</strong></td>
          <td>Id (NVARCHAR 64)</td>
          <td>-</td>
          <td>FullName, Email, Faculty, PasswordHash, VerifiedStudent, JoinedAt</td>
          <td>Platformun merkezi varlığı; 1-N ilişkilerle diğer tüm modüllere bağlıdır.</td>
        </tr>
        <tr>
          <td><strong>ForumPosts</strong></td>
          <td>Id (NVARCHAR 64)</td>
          <td>AuthorId ➔ Users(Id)</td>
          <td>Content (500), Topic (32), IsAnonymous (BIT), ViewCount (INT), CreatedAt</td>
          <td>1 User ➔ N Post. 1 Post ➔ N Comment, N Like.</td>
        </tr>
        <tr>
          <td><strong>ForumComments</strong></td>
          <td>Id (NVARCHAR 64)</td>
          <td>PostId ➔ ForumPosts, AuthorId ➔ Users</td>
          <td>Content (500), IsAnonymous (BIT), CreatedAt (DATETIME)</td>
          <td>Hiyerarşik tartışma ağacı oluşturan yorum varlığı.</td>
        </tr>
        <tr>
          <td><strong>ForumPostLikes</strong></td>
          <td>Id (INT IDENTITY)</td>
          <td>PostId ➔ ForumPosts, UserId ➔ Users</td>
          <td>CreatedAt (DATETIME)</td>
          <td>N-M çoka-çok beğeni eşleme tablosu (Unique Index).</td>
        </tr>
        <tr>
          <td><strong>Listings</strong></td>
          <td>Id (NVARCHAR 64)</td>
          <td>SellerId ➔ Users(Id)</td>
          <td>Title (200), Price (DECIMAL), Condition, PickupPoint, IsFree (BIT), IsActive</td>
          <td>Pazar yeri ilanları ve askıda ürün kayıtları.</td>
        </tr>
        <tr>
          <td><strong>Clubs &amp; Events</strong></td>
          <td>Id (NVARCHAR 64)</td>
          <td>ClubId ➔ Clubs(Id)</td>
          <td>Name, Description, MemberCount, Venue, TotalQuota, RegisteredCount</td>
          <td>1 Club ➔ N Event ilişkisi ile kulüp takvimi yönetimi.</td>
        </tr>
        <tr>
          <td><strong>LostFoundItems</strong></td>
          <td>Id (NVARCHAR 64)</td>
          <td>ReportedById ➔ Users(Id)</td>
          <td>Title, Status ("KAYIP" / "BULUNTU"), Location, IsResolved (BIT)</td>
          <td>Kayıp ve buluntu eşya akışı tablosu.</td>
        </tr>
        <tr>
          <td><strong>CourseNotes</strong></td>
          <td>Id (NVARCHAR 64)</td>
          <td>UploaderId ➔ Users(Id)</td>
          <td>Course, Faculty, Semester, PageCount, Upvotes, FileUrl</td>
          <td>Öğrenci not paylaşım ve oylama tablosu.</td>
        </tr>
      </tbody>
    </table>

    <!-- C# Code First Modeli Örneği -->
    <h2 class="subsection-title">Entity Framework Core Varlık Tanımı Örneği</h2>
    <div class="code-box">
<span class="comment">// C# Model: Listing Entity (Pazar İlanı &amp; Askıda Eşya)</span>
<span class="kw">public class</span> <span class="fn">Listing</span>
{{
    [<span class="kw">Key</span>, <span class="kw">MaxLength</span>(64)]
    <span class="kw">public string</span> Id {{ <span class="kw">get</span>; <span class="kw">set</span>; }} = <span class="str">"l_"</span> + Guid.NewGuid().ToString(<span class="str">"N"</span>);

    [<span class="kw">Required</span>, <span class="kw">MaxLength</span>(200)]
    <span class="kw">public string</span> Title {{ <span class="kw">get</span>; <span class="kw">set</span>; }} = <span class="kw">string</span>.Empty;

    <span class="kw">public decimal</span> Price {{ <span class="kw">get</span>; <span class="kw">set</span>; }} = 0;
    <span class="kw">public bool</span> IsFree {{ <span class="kw">get</span>; <span class="kw">set</span>; }} = <span class="kw">false</span>;

    [<span class="kw">Required</span>, <span class="kw">MaxLength</span>(64)]
    <span class="kw">public string</span> PickupPoint {{ <span class="kw">get</span>; <span class="kw">set</span>; }} = <span class="str">"Merkez Kütüphane"</span>;

    [<span class="kw">ForeignKey</span>(<span class="str">"SellerId"</span>)]
    <span class="kw">public User</span>? Seller {{ <span class="kw">get</span>; <span class="kw">set</span>; }}
}}
    </div>
  </div>

  <div class="page-footer">
    <span>Kütahya Dumlupınar Üniversitesi · Mühendislik Fakültesi</span>
    <span>DPÜ Kampüs Platformu Tanıtım Raporu</span>
    <span>Sayfa 10 / 12</span>
  </div>
</div>

<!-- ========================================== -->
<!-- SAYFA 11: RESTful API VE ENTEGRASYON       -->
<!-- ========================================== -->
<div class="page">
  <div class="page-header">
    <div class="brand">
      <span style="font-size:11pt;">🎓</span> DPÜ KAMPÜS PLATFORMU · PROJE TANITIM RAPORU
    </div>
    <div>BÖLÜM 10: API VE GÜVENLİK</div>
  </div>

  <div class="page-body">
    <div class="section-tag">API &amp; Entegrasyon</div>
    <h1 class="section-title">RESTful Web API &amp; Uç Noktalar</h1>
    <p class="lead">İstemci ile sunucu arasındaki tüm iletişimi standartlaştıran JSON tabanlı, asenkron ve yüksek performanslı ASP.NET Core API referansı.</p>

    <table class="data-table">
      <thead>
        <tr>
          <th>HTTP Metot</th>
          <th>Uç Nokta (Route)</th>
          <th>Açıklama &amp; Fonksiyon</th>
          <th>Kimlik Denetimi</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span class="badge badge-blue">POST</span></td>
          <td><code>/api/auth/send-code</code></td>
          <td>Öğrencinin e-postasına 6 haneli OTP kodu üretir ve iletir.</td>
          <td>Açık (Domain Filtreli)</td>
        </tr>
        <tr>
          <td><span class="badge badge-blue">POST</span></td>
          <td><code>/api/auth/verify-code</code></td>
          <td>OTP kodunu doğrular, kullanıcıyı kaydeder ve JWT token döner.</td>
          <td>Açık</td>
        </tr>
        <tr>
          <td><span class="badge badge-blue">POST</span></td>
          <td><code>/api/auth/login</code></td>
          <td>Mevcut kullanıcı e-posta ve şifre giriş kontrolü.</td>
          <td>Açık</td>
        </tr>
        <tr>
          <td><span class="badge badge-teal">GET</span></td>
          <td><code>/api/forum?topic=&amp;sort=</code></td>
          <td>Forum gönderilerini etiket veya popülerlik sırasına göre listeler.</td>
          <td>İsteğe Bağlı / Token</td>
        </tr>
        <tr>
          <td><span class="badge badge-blue">POST</span></td>
          <td><code>/api/forum</code></td>
          <td>Yeni forum gönderisi oluşturur (Normal veya Anonim).</td>
          <td>Öğrenci Girişi Şart</td>
        </tr>
        <tr>
          <td><span class="badge badge-blue">POST</span></td>
          <td><code>/api/forum/{{id}}/like</code></td>
          <td>Gönderiyi beğenme / beğeniyi geri alma (Toggle Like).</td>
          <td>Öğrenci Girişi Şart</td>
        </tr>
        <tr>
          <td><span class="badge badge-blue">POST</span></td>
          <td><code>/api/forum/{{id}}/comments</code></td>
          <td>Mevcut bir forum gönderisine yorum ekler.</td>
          <td>Öğrenci Girişi Şart</td>
        </tr>
        <tr>
          <td><span class="badge badge-amber">POST</span></td>
          <td><code>/api/forum/{{id}}/report</code></td>
          <td>Uygunsuz veya kural dışı içeriği moderatör kuyruğuna iletir.</td>
          <td>Öğrenci Girişi Şart</td>
        </tr>
        <tr>
          <td><span class="badge badge-teal">GET</span></td>
          <td><code>/api/marketplace?category=</code></td>
          <td>Pazar yeri ilanlarını kategori ve filtreye göre getirir.</td>
          <td>Açık / Okuma</td>
        </tr>
        <tr>
          <td><span class="badge badge-blue">POST</span></td>
          <td><code>/api/marketplace</code></td>
          <td>Yeni ikinci el veya askıda ücretsiz ilanı yayımlar.</td>
          <td>Öğrenci Girişi Şart</td>
        </tr>
      </tbody>
    </table>

    <h2 class="subsection-title">Güvenlik ve OWASP Standartları Uygulaması</h2>
    <div class="grid-2">
      <div class="card card-highlight">
        <h3 class="item-title" style="color:#0F766E;">🛡️ SQL Injection ve Veri Bütünlüğü</h3>
        <p style="font-size:7.2pt; color:#475569;">
          Tüm veritabanı sorguları EF Core ve LINQ parametrik yapısıyla çalıştırılır; dinamik SQL dizesi birleştirmesi yapılmadığı için SQL Injection saldırıları baştan engellenir.
        </p>
      </div>
      <div class="card card-highlight">
        <h3 class="item-title" style="color:#1E3A8A;">🌐 CORS &amp; XSS Koruması</h3>
        <p style="font-size:7.2pt; color:#475569;">
          Backend tarafında <code>WithOrigins("http://localhost:5173", ...)</code> ile kısıtlanmış CORS politikası uygulanır; React ön yüzünde ise tehlikeli HTML çıktıları otomatik escape edilir.
        </p>
      </div>
    </div>
  </div>

  <div class="page-footer">
    <span>Kütahya Dumlupınar Üniversitesi · Mühendislik Fakültesi</span>
    <span>DPÜ Kampüs Platformu Tanıtım Raporu</span>
    <span>Sayfa 11 / 12</span>
  </div>
</div>

<!-- ========================================== -->
<!-- SAYFA 12: KURULUM, YOL HARİTASI VE SONUÇ   -->
<!-- ========================================== -->
<div class="page page-last">
  <div class="page-header">
    <div class="brand">
      <span style="font-size:11pt;">🎓</span> DPÜ KAMPÜS PLATFORMU · PROJE TANITIM RAPORU
    </div>
    <div>BÖLÜM 11: KURULUM &amp; GELECEK VİZYONU</div>
  </div>

  <div class="page-body">
    <div class="section-tag">Kurulum &amp; Sonuç</div>
    <h1 class="section-title">Kurulum Kılavuzu, Yol Haritası ve Sonuç</h1>
    <p class="lead">Projenin yerel geliştirme ortamında ayağa kaldırılması adımları, gelecek sürüm hedefleri ve genel akademik değerlendirme.</p>

    <!-- Kurulum Kılavuzu -->
    <div class="card" style="margin-bottom:10px;">
      <h3 class="item-title" style="color:#0F766E;">🛠️ Hızlı Kurulum ve Çalıştırma Adımları</h3>
      <div class="code-box" style="margin-top:3px;">
<span class="comment"># 1. Depoyu klonlayın ve kök dizine geçin</span>
git clone https://github.com/dpu-kampus/dpu-kampus-platformu.git
cd DPU_Kampus_Platformu

<span class="comment"># 2. Ön yüz (Frontend) bağımlılıklarını kurun ve Vite geliştirme sunucusunu başlatın</span>
npm install
npm run dev

<span class="comment"># 3. Arka yüz (Backend) ASP.NET Core sunucusunu başlatın (Veritabanı otomatik tohumlanır)</span>
cd DpuKampus.Server
dotnet run
<span class="comment"># Tarayıcıda http://localhost:5173 adresini açarak platformu deneyimleyin.</span>
      </div>
    </div>

    <!-- Gelecek Yol Haritası -->
    <div class="grid-2" style="margin-bottom:10px;">
      <div class="card card-highlight">
        <h3 class="item-title" style="color:#0F766E;">🗺️ Gelecek Yol Haritası (Roadmap)</h3>
        <ul style="font-size:7.2pt; color:#334155; padding-left:12px; line-height:1.45;">
          <li><strong>Yapay Zeka Destekli Yemekhane Kamerası:</strong> Turnike ve salon kameralarından yoğunluk tespiti.</li>
          <li><strong>OBS Entegrasyonu:</strong> Resmi öğrenci işleri API'si üzerinden transkript doğrulama.</li>
          <li><strong>Mobil Uygulama (iOS / Android):</strong> React Native tabanlı push bildirimli mobil istemci.</li>
        </ul>
      </div>

      <div class="card card-highlight">
        <h3 class="item-title" style="color:#1E3A8A;">🎓 Akademik Değerlendirme &amp; Sonuç</h3>
        <p style="font-size:7.2pt; color:#334155; line-height: 1.45;">
          DPÜ Kampüs Platformu; teorik yazılım mühendisliği, modern web mimarileri, veri tabanı optimizasyonu ve kullanıcı deneyimi ilkelerinin başarıyla harmanlandığı, üniversiteye doğrudan fayda üreten <strong>üretim seviyesinde (production-ready) bir projedir</strong>.
        </p>
      </div>
    </div>

    <!-- İmza ve Teslim Bloğu -->
    <div style="background:#F8FAFC; border:1px solid #CBD5E1; border-radius:7px; padding:10px 14px; margin-top:10px;">
      <div style="display:flex; justify-content:space-between; align-items:flex-end;">
        <div>
          <div style="font-size:8pt; font-weight:700; color:#0F172A;">PROJE TESLİM VE ONAYI</div>
          <div style="font-size:7.2pt; color:#64748B; margin-top:2px;">Kütahya Dumlupınar Üniversitesi Mühendislik Fakültesi</div>
          <div style="font-size:6.8pt; color:#94A3B8; margin-top:3px;">Hazırlayanlar: Muhammed Yaşar Özkul · Batuhan Tuğra Dönmez · Efe Alsaç</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:7.2pt; color:#64748B;">Teslim Tarihi: 24 Kasım 2026</div>
          <div style="font-size:7.8pt; font-weight:700; color:#0D9488; margin-top:2px;">Dönem Bitirme Notu / Değerlendirme</div>
        </div>
      </div>
    </div>
  </div>

  <div class="page-footer">
    <span>Kütahya Dumlupınar Üniversitesi · Mühendislik Fakültesi</span>
    <span>DPÜ Kampüs Platformu Tanıtım Raporu</span>
    <span>Sayfa 12 / 12</span>
  </div>
</div>

</body>
</html>"""

html_path = os.path.abspath("DPU_Kampus_Platformu_Tanitim_Raporu.html")
pdf_path = os.path.abspath("DPU_Kampus_Platformu_Tanitim_Raporu.pdf")

print("Writing HTML file...")
with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)
print(f"HTML written to {html_path} ({os.path.getsize(html_path)} bytes)")

print("Generating PDF via headless Edge...")
edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if not os.path.exists(edge_path):
    edge_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

cmd = [
    edge_path,
    "--headless",
    "--disable-gpu",
    "--no-sandbox",
    f"--print-to-pdf={pdf_path}",
    "--no-pdf-header-footer",
    html_path
]

res = subprocess.run(cmd, capture_output=True, text=True)
print(f"Process return code: {res.returncode}")
if os.path.exists(pdf_path):
    print(f"SUCCESS! PDF created at: {pdf_path} (Size: {os.path.getsize(pdf_path)} bytes)")
else:
    print("PDF generation failed. Error:")
    print(res.stderr)
