import type {
  LoginRequest, RegisterRequest, AuthResponse, User,
  ListingDTO, CreateListingRequest, ClubDTO, EventDTO,
  LostFoundDTO, NoteDTO, ProjectTeamDTO, CafeteriaMenuDTO,
  RideshareDTO, MessageDTO, ConversationDTO
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '';
const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

// ── JWT Bearer Token & LocalStorage Helpers (ASP.NET Core Web API Ready) ──
export const getToken = () => localStorage.getItem('dpu_token');
export const setToken = (t: string) => localStorage.setItem('dpu_token', t);
export const clearToken = () => localStorage.removeItem('dpu_token');

export const getStoredUser = (): User | null => {
  try {
    const raw = localStorage.getItem('dpu_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
export const setStoredUser = (u: User) => localStorage.setItem('dpu_user', JSON.stringify(u));
export const clearStoredUser = () => localStorage.removeItem('dpu_user');

/**
 * Standard HTTP headers with JWT Bearer token for ASP.NET Core Web API
 */
export const getAuthHeaders = (): HeadersInit => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// ── Mock users ──
const MOCK_USERS: User[] = [
  { id: 'u1', fullName: 'Efe Alsaç', email: 'efe.alsac@ogr.dpu.edu.tr', faculty: 'Mühendislik Fakültesi', joinedAt: '2024-09-01', verifiedStudent: true },
  { id: 'u2', fullName: 'Zeynep Kaya', email: 'zeynep.kaya@ogr.dpu.edu.tr', faculty: 'Fen-Edebiyat Fakültesi', joinedAt: '2024-09-01', verifiedStudent: true },
  { id: 'u3', fullName: 'Mert Demir', email: 'mert.demir@ogr.dpu.edu.tr', faculty: 'Kütahya Teknik Bilimler MYO', joinedAt: '2023-09-01', verifiedStudent: true },
  { id: 'u4', fullName: 'Selin Yıldız', email: 'selin.yildiz@ogr.dpu.edu.tr', faculty: 'İİBF', joinedAt: '2024-09-01', verifiedStudent: true },
  { id: 'u5', fullName: 'Burak Şahin', email: 'burak.sahin@ogr.dpu.edu.tr', faculty: 'Eğitim Fakültesi', joinedAt: '2022-09-01', verifiedStudent: true },
];

// ── Mock data ──
const MOCK_LISTINGS: ListingDTO[] = [
  { id: 'l1', title: 'Casio FX-991ES Plus Hesap Makinesi', description: 'Mühendislik ve fen bilimleri sınavları için ideal. Kutusu ve kılıfı tam. Hiç sorun yaşamadım, bölümü bitirdiğim için satıyorum.', price: 350, condition: 'Az Kullanılmış', category: 'Elektronik', pickupPoint: 'Mühendislik Kantini', imageUrl: '/images/products/hesap-makinesi.svg', seller: MOCK_USERS[0], isFree: false, createdAt: '2026-11-15T10:00:00Z', isActive: true },
  { id: 'l2', title: 'Bilgisayar Mühendisliği Ders Notları (1-3. Sınıf)', description: 'Veri yapıları, algoritmalar, işletim sistemleri derslerine ait el yazısı ve basılı notlar. Çıkmışlarla birlikte.', price: 0, condition: 'İyi', category: 'Ders Kitabı & Not', pickupPoint: 'Merkez Kütüphane', imageUrl: '/images/products/ders-notu.svg', seller: MOCK_USERS[1], isFree: true, createdAt: '2026-11-14T09:00:00Z', isActive: true },
  { id: 'l3', title: 'Nespresso Essenza Mini Kahve Makinesi', description: 'Yurtta kullanmak için aldım, mezun oldum artık. Temiz, bakımlı. Orijinal kutusuyla birlikte.', price: 1200, condition: 'Sıfır Gibi', category: 'Ev & Yurt', pickupPoint: 'KYK Yurtlar', imageUrl: '/images/products/kahve-makinesi.svg', seller: MOCK_USERS[2], isFree: false, createdAt: '2026-11-13T11:00:00Z', isActive: true },
  { id: 'l4', title: 'Çalışma Masası Lambası (Doğal Işık)', description: 'Gözleri yormayan LED masa lambası. Parlaklık ayarlı, USB şarj portu var. Bitirme sonrası ihtiyacım kalmadı.', price: 0, condition: 'İyi', category: 'Ev & Yurt', pickupPoint: 'KYK Yurtlar', imageUrl: '/images/products/masa-lambasi.svg', seller: MOCK_USERS[3], isFree: true, createdAt: '2026-11-12T14:00:00Z', isActive: true },
  { id: 'l5', title: 'Staedtler Teknik Çizim Seti (Mimarlık)', description: '10 parça teknik kalem seti, pergel, iletki. Mimarlık 1. sınıf için almıştım. İçi tam.', price: 180, condition: 'Az Kullanılmış', category: 'Kırtasiye', pickupPoint: 'Bedesten Çarşı', imageUrl: '/images/products/cizim-seti.svg', seller: MOCK_USERS[4], isFree: false, createdAt: '2026-11-11T08:00:00Z', isActive: true },
  { id: 'l6', title: 'Mekanik Klavye (Cherry MX Brown)', description: 'Öğrenci bütçesine uygun harika klavye. TKL 80% dizayn, Türkçe Q düzeni. Kutusunda.', price: 750, condition: 'Sıfır Gibi', category: 'Elektronik', pickupPoint: 'Mühendislik Kantini', imageUrl: '/images/products/klavye.svg', seller: MOCK_USERS[0], isFree: false, createdAt: '2026-11-10T16:00:00Z', isActive: true },
];

const MOCK_CLUBS: ClubDTO[] = [
  { id: 'c1', name: 'DPÜ Yazılım ve Bilişim Topluluğu', description: 'Yazılım geliştirme, hackathon ve proje yarışmalarına odaklanan öğrenci topluluğu.', memberCount: 312, tags: ['Yazılım', 'Hackathon', 'Teknofest'], isFollowing: false },
  { id: 'c2', name: 'Siber Güvenlik Topluluğu', description: 'CTF yarışmaları, penetrasyon testi ve siber güvenlik farkındalığı üzerine çalışan topluluk.', memberCount: 178, tags: ['CTF', 'Güvenlik', 'Linux'], isFollowing: true },
  { id: 'c3', name: 'E-Spor ve Oyun Topluluğu', description: 'League of Legends, Valorant ve diğer oyunlarda turnuvalar düzenleyen üniversite topluluğu.', memberCount: 456, tags: ['E-Spor', 'Gaming', 'Turnuva'], isFollowing: false },
  { id: 'c4', name: 'Dağcılık ve Doğa Sporları', description: 'Her hafta sonu doğa yürüyüşü, kamp ve tırmanış aktiviteleri düzenleyen aktif topluluk.', memberCount: 134, tags: ['Doğa', 'Kamp', 'Tırmanış'], isFollowing: false },
  { id: 'c5', name: 'Girişimcilik ve İnovasyon Kulübü', description: 'Startup fikir geliştirme, mentorluk programları ve yatırımcı sunumları üzerine etkinlikler.', memberCount: 221, tags: ['Startup', 'İnovasyon', 'Mentorluk'], isFollowing: false },
  { id: 'c6', name: 'Fotoğrafçılık Topluluğu', description: 'Kampüs ve şehir fotoğrafçılığı, analog fotoğraf ve sergi düzenleme üzerine bir topluluk.', memberCount: 89, tags: ['Fotoğraf', 'Sanat', 'Sergi'], isFollowing: false },
];

const MOCK_EVENTS: EventDTO[] = [
  { id: 'e1', clubId: 'c1', clubName: 'DPÜ Yazılım ve Bilişim Topluluğu', title: 'React ve TypeScript ile Modern Web Geliştirme', description: 'Sıfırdan modern bir React uygulaması inşa etme workshopu. Laptop getirmeniz önerilir.', date: '2026-11-25T14:00:00Z', venue: 'Mühendislik Konferans Salonu - A201', totalQuota: 50, registeredCount: 38, isRegistered: false },
  { id: 'e2', clubId: 'c2', clubName: 'Siber Güvenlik Topluluğu', title: 'Başlangıç Seviye CTF Çözüm Atölyesi', description: 'Capture The Flag yarışmalarına hazırlık için pratik siber güvenlik egzersizleri.', date: '2026-11-28T10:00:00Z', venue: 'Bilgisayar Lab 3 - Mühendislik Binası', totalQuota: 30, registeredCount: 29, isRegistered: true },
  { id: 'e3', clubId: 'c5', clubName: 'Girişimcilik ve İnovasyon Kulübü', title: 'DPÜ Demo Day — Öğrenci Proje Sunumları', description: 'Kütahya ekosisteminden yatırımcılar önünde öğrenci projelerinin sunulacağı Demo Day.', date: '2026-12-05T13:00:00Z', venue: 'Bedesten Etkinlik Alanı', totalQuota: 100, registeredCount: 72, isRegistered: false },
  { id: 'e4', clubId: 'c4', clubName: 'Dağcılık ve Doğa Sporları', title: 'Murat Dağı Kış Yürüyüşü', description: 'Kışın karla kaplı Murat Dağı zirvesine sabah kalkan gün yürüyüşü.', date: '2026-12-13T07:00:00Z', venue: 'Kampüs Girişi (Buluşma)', totalQuota: 25, registeredCount: 18, isRegistered: false },
];

const MOCK_LOST_FOUND: LostFoundDTO[] = [
  { id: 'lf1', title: 'Samsung Galaxy Buds2 Pro Kulaklık (Siyah)', description: 'Mühendislik kantininde unuttuğumu düşünüyorum. Kılıfı gri renkli.', status: 'KAYIP', location: 'Mühendislik Kantini', reportedBy: MOCK_USERS[0], createdAt: '2026-11-18T09:00:00Z', isResolved: false },
  { id: 'lf2', title: 'Öğrenci Kimliği — Zeynep Kaya', description: 'Merkez kütüphane girişinde yerde buldum. Sahibi ulaşabilir.', status: 'BULUNTU', location: 'Merkez Kütüphane', reportedBy: MOCK_USERS[2], createdAt: '2026-11-17T14:30:00Z', isResolved: false },
  { id: 'lf3', title: 'Anahtarlık (İki Anahtar + Araba Kumandası)', description: 'KYK yurt önünde buldum. Honda logolu araba kumandası var.', status: 'BULUNTU', location: 'KYK Yurtlar Önü', reportedBy: MOCK_USERS[3], createdAt: '2026-11-16T18:00:00Z', isResolved: false },
  { id: 'lf4', title: 'Deri Cüzdan (Mavi)', description: 'Kütüphane okuma salonunda oturmuştum, ayrılırken unuttum galiba.', status: 'KAYIP', location: 'Merkez Kütüphane - Okuma Salonu', reportedBy: MOCK_USERS[4], createdAt: '2026-11-15T16:00:00Z', isResolved: false },
];

const MOCK_NOTES: NoteDTO[] = [
  { id: 'n1', title: 'Veri Yapıları ve Algoritmalar — 2024-2025 Bahar Çıkmışları', course: 'Veri Yapıları ve Algoritmalar', faculty: 'Mühendislik Fakültesi', semester: '2024-2025 Bahar', pageCount: 24, uploader: MOCK_USERS[1], upvotes: 87, fileUrl: '#', uploadedAt: '2026-05-10T10:00:00Z', hasUserUpvoted: false },
  { id: 'n2', title: 'Diferansiyel Denklemler Özet Notlar', course: 'Diferansiyel Denklemler', faculty: 'Mühendislik Fakültesi', semester: '2025-2026 Güz', pageCount: 18, uploader: MOCK_USERS[0], upvotes: 54, fileUrl: '#', uploadedAt: '2026-10-20T10:00:00Z', hasUserUpvoted: true },
  { id: 'n3', title: 'İşletme Yönetimi — Final Konuları ve Çıkmış Sorular', course: 'İşletme Yönetimi', faculty: 'İİBF', semester: '2024-2025 Bahar', pageCount: 32, uploader: MOCK_USERS[3], upvotes: 43, fileUrl: '#', uploadedAt: '2026-05-15T10:00:00Z', hasUserUpvoted: false },
  { id: 'n4', title: 'Devre Analizi Hızlı Başvuru Kağıdı', course: 'Devre Analizi', faculty: 'Kütahya Teknik Bilimler MYO', semester: '2025-2026 Güz', pageCount: 8, uploader: MOCK_USERS[2], upvotes: 31, fileUrl: '#', uploadedAt: '2026-11-01T10:00:00Z', hasUserUpvoted: false },
];

const MOCK_PROJECTS: ProjectTeamDTO[] = [
  { id: 'p1', title: 'Teknofest 2027 — Yapay Zeka Tabanlı Tarım Sistemi', description: 'Drone ve görüntü işleme ile bitki hastalığı tespiti yapan sistem. ASP.NET Core & React bilen arayüz/backend arkadaşı aranıyor.', skills: ['React', 'TypeScript', 'ASP.NET Core', 'Python', 'CV'], creator: MOCK_USERS[0], teamSize: 5, currentMembers: 3, deadline: '2027-02-01', type: 'Teknofest' },
  { id: 'p2', title: 'TÜBİTAK 2209-A — Akıllı Kampüs Navigasyon Uygulaması', description: 'DPÜ kampüsü için içmekan navigasyon sistemi. Flutter veya React Native bilen mobil geliştirici aranıyor.', skills: ['Flutter', 'Firebase', 'BLE', 'Harita API'], creator: MOCK_USERS[2], teamSize: 4, currentMembers: 2, deadline: '2027-03-15', type: 'TÜBİTAK' },
  { id: 'p3', title: 'Bitirme Projesi — E-Ticaret Platformu (Mikroservis)', description: 'Docker, Kubernetes ile dağıtık e-ticaret backend projesi. DevOps veya backend bilgisi olan ekip arkadaşı aranıyor.', skills: ['Docker', 'Kubernetes', '.NET', 'PostgreSQL'], creator: MOCK_USERS[1], teamSize: 3, currentMembers: 2, type: 'Bitirme Projesi' },
];

let MOCK_CAFETERIA: CafeteriaMenuDTO = {
  date: '2026-11-19',
  courses: ['Mercimek Çorbası', 'Fırında Tavuk But', 'Bulgur Pilavı', 'Şalgam Turşusu'],
  satisfactionVotes: { liked: 142, okay: 68, disliked: 23 },
  userVote: undefined,
};

const MOCK_RIDESHARES: RideshareDTO[] = [
  { id: 'r1', from: 'Kütahya', to: 'Eskişehir', departureTime: '2026-11-21T07:30:00Z', pickupPoint: 'Kampüs Ana Kapısı', totalSeats: 4, bookedSeats: 2, fuelShare: 80, driver: MOCK_USERS[2] },
  { id: 'r2', from: 'Kütahya', to: 'Bursa', departureTime: '2026-11-22T08:00:00Z', pickupPoint: 'Bedesten Önü', totalSeats: 3, bookedSeats: 1, fuelShare: 150, driver: MOCK_USERS[4] },
  { id: 'r3', from: 'Kütahya', to: 'Afyon', departureTime: '2026-11-21T09:00:00Z', pickupPoint: 'Merkez Kütüphane', totalSeats: 4, bookedSeats: 3, fuelShare: 60, driver: MOCK_USERS[3] },
  { id: 'r4', from: 'Kütahya', to: 'Konya', departureTime: '2026-11-23T06:30:00Z', pickupPoint: 'Kampüs Ana Kapısı', totalSeats: 3, bookedSeats: 0, fuelShare: 200, driver: MOCK_USERS[1] },
];

export class ApiService {
  // Auth
  static async login(req: LoginRequest): Promise<AuthResponse> {
    await delay(400);
    if (!req.email.toLowerCase().endsWith('@ogr.dpu.edu.tr')) throw new Error('Geçersiz e-posta alanı');
    return { token: 'mock_jwt_' + Date.now(), user: MOCK_USERS[0] };
  }

  static async register(req: RegisterRequest): Promise<AuthResponse> {
    await delay(400);
    if (!req.email.toLowerCase().endsWith('@ogr.dpu.edu.tr')) throw new Error('Geçersiz e-posta alanı');
    const user: User = { id: 'u_' + Date.now(), fullName: req.fullName, email: req.email, faculty: req.faculty, joinedAt: new Date().toISOString(), verifiedStudent: true };
    return { token: 'mock_jwt_' + Date.now(), user };
  }

  // Listings
  static async getListings(category?: string, pickupPoint?: string, sort?: string): Promise<ListingDTO[]> {
    await delay(400);
    let items = [...MOCK_LISTINGS];
    if (category && category !== 'Tümü') {
      if (category === 'Askıda Ücretsiz') items = items.filter(i => i.isFree);
      else items = items.filter(i => i.category === category);
    }
    if (pickupPoint) items = items.filter(i => i.pickupPoint === pickupPoint);
    if (sort === 'Fiyat: Düşükten Yükseğe') items.sort((a, b) => a.price - b.price);
    else if (sort === 'Fiyat: Yüksekten Düşüğe') items.sort((a, b) => b.price - a.price);
    return items;
  }

  static async getListing(id: string): Promise<ListingDTO> {
    await delay(400);
    const item = MOCK_LISTINGS.find(l => l.id === id);
    if (!item) throw new Error('İlan bulunamadı');
    return item;
  }

  static async createListing(req: CreateListingRequest): Promise<ListingDTO> {
    await delay(400);
    const listing: ListingDTO = { id: 'l_' + Date.now(), ...req, seller: MOCK_USERS[0], createdAt: new Date().toISOString(), isActive: true };
    MOCK_LISTINGS.unshift(listing);
    return listing;
  }

  // Clubs
  static async getClubs(): Promise<ClubDTO[]> { await delay(400); return [...MOCK_CLUBS]; }
  static async toggleFollowClub(id: string): Promise<ClubDTO> {
    await delay(300);
    const club = MOCK_CLUBS.find(c => c.id === id)!;
    club.isFollowing = !club.isFollowing;
    if (club.isFollowing) club.memberCount++; else club.memberCount--;
    return { ...club };
  }

  // Events
  static async getEvents(): Promise<EventDTO[]> { await delay(400); return [...MOCK_EVENTS]; }
  static async registerEvent(id: string): Promise<EventDTO> {
    await delay(300);
    const event = MOCK_EVENTS.find(e => e.id === id)!;
    event.isRegistered = !event.isRegistered;
    if (event.isRegistered) event.registeredCount++; else event.registeredCount--;
    return { ...event };
  }

  // Lost & Found
  static async getLostFound(filter?: string): Promise<LostFoundDTO[]> {
    await delay(400);
    if (!filter || filter === 'Tümü') return [...MOCK_LOST_FOUND];
    if (filter === 'Kayıp İlanları') return MOCK_LOST_FOUND.filter(i => i.status === 'KAYIP');
    return MOCK_LOST_FOUND.filter(i => i.status === 'BULUNTU');
  }

  // Notes
  static async getNotes(faculty?: string, course?: string): Promise<NoteDTO[]> {
    await delay(400);
    let items = [...MOCK_NOTES];
    if (faculty) items = items.filter(n => n.faculty === faculty);
    if (course) items = items.filter(n => n.course.toLowerCase().includes(course.toLowerCase()));
    return items;
  }
  static async upvoteNote(id: string): Promise<NoteDTO> {
    await delay(300);
    const note = MOCK_NOTES.find(n => n.id === id)!;
    note.hasUserUpvoted = !note.hasUserUpvoted;
    if (note.hasUserUpvoted) note.upvotes++; else note.upvotes--;
    return { ...note };
  }

  // Projects
  static async getProjects(): Promise<ProjectTeamDTO[]> { await delay(400); return [...MOCK_PROJECTS]; }

  // Cafeteria
  static async getCafeteriaMenu(): Promise<CafeteriaMenuDTO> { await delay(300); return { ...MOCK_CAFETERIA, satisfactionVotes: { ...MOCK_CAFETERIA.satisfactionVotes } }; }
  static async voteCafeteria(vote: 'liked' | 'okay' | 'disliked'): Promise<CafeteriaMenuDTO> {
    await delay(300);
    MOCK_CAFETERIA = { ...MOCK_CAFETERIA, userVote: vote, satisfactionVotes: { ...MOCK_CAFETERIA.satisfactionVotes } };
    if (vote === 'liked') MOCK_CAFETERIA.satisfactionVotes.liked++;
    else if (vote === 'okay') MOCK_CAFETERIA.satisfactionVotes.okay++;
    else MOCK_CAFETERIA.satisfactionVotes.disliked++;
    return { ...MOCK_CAFETERIA };
  }

  // Rideshares
  static async getRideshares(): Promise<RideshareDTO[]> { await delay(400); return [...MOCK_RIDESHARES]; }

  // Messaging
  static async getConversations(): Promise<ConversationDTO[]> {
    await delay(400);
    return [{ id: 'conv1', participant: MOCK_USERS[1], lastMessage: { id: 'm1', senderId: 'u2', receiverId: 'u1', content: 'Hesap makinesini almak istiyorum, hâlâ satılık mı?', sentAt: '2026-11-18T14:22:00Z', read: false }, unreadCount: 1, listingSnapshot: { title: 'Casio FX-991ES Plus', imageUrl: '/images/products/hesap-makinesi.svg', price: 350 } }];
  }
  static async getMessages(_conversationId: string): Promise<MessageDTO[]> {
    await delay(300);
    return [
      { id: 'm1', senderId: 'u2', receiverId: 'u1', content: 'Hesap makinesini almak istiyorum, hâlâ satılık mı?', sentAt: '2026-11-18T14:22:00Z', read: true },
      { id: 'm2', senderId: 'u1', receiverId: 'u2', content: 'Evet, hâlâ satılık. Mühendislik kantininde buluşabiliriz.', sentAt: '2026-11-18T14:35:00Z', read: true },
    ];
  }
  static async sendMessage(receiverId: string, content: string, listingId?: string): Promise<MessageDTO> {
    await delay(300);
    return { id: 'm_' + Date.now(), senderId: 'u1', receiverId, content, sentAt: new Date().toISOString(), read: false, listingId };
  }
}
