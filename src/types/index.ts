// ========== Auth ==========
export interface LoginRequest { email: string; password: string; }
export interface RegisterRequest { fullName: string; email: string; faculty: string; password: string; }
export interface AuthResponse { token: string; user: User; }
export interface User {
  id: string;
  fullName: string;
  email: string;
  faculty: string;
  avatarUrl?: string;
  joinedAt: string;
  verifiedStudent: boolean;
}

// ========== Marketplace ==========
export type Condition = 'Sıfır Gibi' | 'Az Kullanılmış' | 'İyi' | 'Orta';
export type Category = 'Ders Kitabı & Not' | 'Elektronik' | 'Ev & Yurt' | 'Kırtasiye' | 'Askıda Ücretsiz';
export type PickupPoint = 'Merkez Kütüphane' | 'Bedesten Çarşı' | 'Mühendislik Kantini' | 'KTB MYO' | 'KYK Yurtlar';

export interface ListingDTO {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: Condition;
  category: Category;
  pickupPoint: PickupPoint;
  imageUrl: string;
  seller: User;
  isFree: boolean;
  createdAt: string;
  isActive: boolean;
}

export interface CreateListingRequest {
  title: string;
  description: string;
  price: number;
  condition: Condition;
  category: Category;
  pickupPoint: PickupPoint;
  imageUrl: string;
  isFree: boolean;
}

// ========== Clubs & Events ==========
export interface ClubDTO {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  logoUrl?: string;
  tags: string[];
  isFollowing: boolean;
}
export interface EventDTO {
  id: string;
  clubId: string;
  clubName: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  totalQuota: number;
  registeredCount: number;
  isRegistered: boolean;
}

// ========== Lost & Found ==========
export type LostFoundStatus = 'KAYIP' | 'BULUNTU';
export interface LostFoundDTO {
  id: string;
  title: string;
  description: string;
  status: LostFoundStatus;
  location: string;
  reportedBy: User;
  imageUrl?: string;
  createdAt: string;
  isResolved: boolean;
}

// ========== Notes ==========
export interface NoteDTO {
  id: string;
  title: string;
  course: string;
  faculty: string;
  semester: string;
  pageCount: number;
  uploader: User;
  upvotes: number;
  fileUrl: string;
  uploadedAt: string;
  hasUserUpvoted: boolean;
}

// ========== Project Teams ==========
export interface ProjectTeamDTO {
  id: string;
  title: string;
  description: string;
  skills: string[];
  creator: User;
  teamSize: number;
  currentMembers: number;
  deadline?: string;
  type: 'Teknofest' | 'TÜBİTAK' | 'Bitirme Projesi' | 'Yarışma';
}

// ========== Cafeteria ==========
export interface CafeteriaMenuDTO {
  date: string;
  courses: string[];
  satisfactionVotes: { liked: number; okay: number; disliked: number; };
  userVote?: 'liked' | 'okay' | 'disliked';
}

// ========== Rideshare ==========
export interface RideshareDTO {
  id: string;
  from: string;
  to: string;
  departureTime: string;
  pickupPoint: string;
  totalSeats: number;
  bookedSeats: number;
  fuelShare: number;
  driver: User;
}

// ========== Messaging ==========
export interface MessageDTO {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  sentAt: string;
  read: boolean;
  listingId?: string;
}
export interface ConversationDTO {
  id: string;
  participant: User;
  lastMessage: MessageDTO;
  unreadCount: number;
  listingSnapshot?: { title: string; imageUrl: string; price: number; };
}

// ========== Campus Forum ==========
export type ForumTopic =
  | '#Genel'
  | '#VizeFinal'
  | '#Yemekhane'
  | '#KütahyaUlaşım'
  | '#SoruCevap'
  | '#KampüsHayatı';

export interface ForumCommentDTO {
  id: string;
  postId: string;
  author: User;
  content: string;
  createdAt: string;
  isAnonymous?: boolean;
}

export interface ForumPostDTO {
  id: string;
  author: User;
  content: string;
  topic: ForumTopic;
  isAnonymous: boolean;
  createdAt: string;
  likeCount: number;
  hasLiked?: boolean;
  commentCount: number;
  viewCount: number;
  comments?: ForumCommentDTO[];
}

export interface CreateForumPostRequest {
  content: string;
  topic: ForumTopic;
  isAnonymous: boolean;
}

export interface CreateForumCommentRequest {
  content: string;
  isAnonymous?: boolean;
}
