import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquareText,
  MessageCircle,
  Heart,
  Eye,
  Flag,
  Send,
  Loader2,
  Sparkles,
  ShieldCheck,
  BadgeCheck,
  UserCheck,
  Users,
  EyeOff,
  Flame,
  Clock,
  ChevronDown,
  ChevronUp,
  Share2,
  AlertTriangle,
  CheckCircle2,
  X,
  Hash,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ApiService } from '../services/api';
import type { ForumPostDTO, ForumTopic, ForumCommentDTO } from '../types';

const FORUM_TOPICS: ForumTopic[] = [
  '#Genel',
  '#VizeFinal',
  '#Yemekhane',
  '#KütahyaUlaşım',
  '#SoruCevap',
  '#KampüsHayatı',
];

const TOPIC_BADGE_STYLES: Record<ForumTopic, { bg: string; text: string; border: string }> = {
  '#Genel': { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
  '#VizeFinal': { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  '#Yemekhane': { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
  '#KütahyaUlaşım': { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
  '#SoruCevap': { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
  '#KampüsHayatı': { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200' },
};

function formatRelativeTime(dateStr: string): string {
  try {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'Az önce';
    if (diffMin < 60) return `${diffMin} dk önce`;
    if (diffHour < 24) return `${diffHour} sa önce`;
    if (diffDay < 7) return `${diffDay} gün önce`;
    return new Date(dateStr).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
  } catch {
    return 'Yakın zamanda';
  }
}

export default function ForumPage() {
  const { user } = useAuth();

  // State
  const [posts, setPosts] = useState<ForumPostDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedTab, setFeedTab] = useState<'foryou' | 'following'>('foryou');
  const [followedUserIds, setFollowedUserIds] = useState<string[]>(['u2', 'u3', 'u4']);
  const [selectedTopic, setSelectedTopic] = useState<string>('Tümü');
  const [sortOrder, setSortOrder] = useState<'latest' | 'popular'>('latest');

  // Composer State
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTopic, setNewPostTopic] = useState<ForumTopic>('#Genel');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Expanded replies map: postId -> boolean
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  // Quick comment text map: postId -> string
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [submittingComment, setSubmittingComment] = useState<Record<string, boolean>>({});

  // Report Modal
  const [reportingPostId, setReportingPostId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('Uygunsuz / Hakaret İçeren İçerik');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load posts
  useEffect(() => {
    let isMounted = true;
    async function fetchPosts() {
      setLoading(true);
      try {
        const data = await ApiService.getForumPosts(selectedTopic, sortOrder);
        if (isMounted) setPosts(data);
      } catch (err) {
        console.error('Forum postları yüklenemedi:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchPosts();
    return () => {
      isMounted = false;
    };
  }, [selectedTopic, sortOrder]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Submit Post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() || submitting) return;

    if (newPostContent.trim().length > 500) {
      showToast('Gönderiniz en fazla 500 karakter olabilir.');
      return;
    }

    setSubmitting(true);
    try {
      const created = await ApiService.createForumPost({
        content: newPostContent.trim(),
        topic: newPostTopic,
        isAnonymous,
      });
      setPosts((prev) => [created, ...prev]);
      setNewPostContent('');
      setIsAnonymous(false);
      showToast('Gönderiniz DPÜ Kampüs Forumu\'nda paylaşıldı!');
    } catch {
      showToast('Gönderi paylaşılırken bir hata oluştu.');
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle Like
  const handleLike = async (postId: string) => {
    // Optimistic update
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextLiked = !p.hasLiked;
          return {
            ...p,
            hasLiked: nextLiked,
            likeCount: nextLiked ? p.likeCount + 1 : Math.max(0, p.likeCount - 1),
          };
        }
        return p;
      })
    );

    try {
      const res = await ApiService.toggleForumLike(postId);
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, hasLiked: res.liked, likeCount: res.count } : p))
      );
    } catch {
      // Revert if error
    }
  };

  // Toggle Expanded Comments
  const handleToggleComments = (postId: string) => {
    const isNowExpanded = !expandedComments[postId];
    setExpandedComments((prev) => ({ ...prev, [postId]: isNowExpanded }));

    // Increment view count when expanded
    if (isNowExpanded) {
      ApiService.incrementForumView(postId).then((res) => {
        if (res.viewCount) {
          setPosts((prev) =>
            prev.map((p) => (p.id === postId ? { ...p, viewCount: res.viewCount } : p))
          );
        }
      });
    }
  };

  // Submit Quick Comment
  const handleAddComment = async (postId: string) => {
    const draft = commentDrafts[postId]?.trim();
    if (!draft || submittingComment[postId]) return;

    setSubmittingComment((prev) => ({ ...prev, [postId]: true }));
    try {
      const newComment = await ApiService.createForumComment(postId, {
        content: draft,
        isAnonymous: false,
      });

      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === postId) {
            const currentComments = p.comments || [];
            return {
              ...p,
              commentCount: currentComments.length + 1,
              comments: [...currentComments, newComment],
            };
          }
          return p;
        })
      );
      setCommentDrafts((prev) => ({ ...prev, [postId]: '' }));
      showToast('Yanıtınız paylaşıldı.');
    } catch {
      showToast('Yanıt gönderilemedi.');
    } finally {
      setSubmittingComment((prev) => ({ ...prev, [postId]: false }));
    }
  };

  // Submit Report
  const handleConfirmReport = async () => {
    if (!reportingPostId) return;
    try {
      const res = await ApiService.reportForumPost(reportingPostId, reportReason);
      showToast(res.message);
    } catch {
      showToast('Bildirim iletilirken bir hata oluştu.');
    } finally {
      setReportingPostId(null);
    }
  };

  // Character calculation
  const charLength = newPostContent.length;
  const remainingChars = 500 - charLength;
  const charPercent = Math.min(100, (charLength / 500) * 100);

  // Filtered posts based on active feed tab ("Size Özel" vs "Takip Ettiklerin")
  const displayedPosts = feedTab === 'following'
    ? posts.filter((p) => !p.isAnonymous && (followedUserIds.includes(p.author?.id) || p.author?.id === 'u2' || p.author?.id === 'u3'))
    : posts;

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-2 px-2 sm:px-0 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold border border-white/10 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── TWITTER/X STYLE FEED SWITCHER ("Size Özel" & "Takip Ettiklerin") ── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs flex items-center overflow-hidden">
        <button
          type="button"
          onClick={() => setFeedTab('foryou')}
          className={`flex-1 py-3.5 text-center text-sm transition-all relative cursor-pointer ${
            feedTab === 'foryou'
              ? 'text-slate-900 font-bold bg-white'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50/70 font-medium'
          }`}
        >
          <span>Size Özel</span>
          {feedTab === 'foryou' && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-emerald-600 rounded-full" />
          )}
        </button>

        <div className="h-6 w-px bg-slate-200" />

        <button
          type="button"
          onClick={() => setFeedTab('following')}
          className={`flex-1 py-3.5 text-center text-sm transition-all relative cursor-pointer ${
            feedTab === 'following'
              ? 'text-slate-900 font-bold bg-white'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50/70 font-medium'
          }`}
        >
          <span>Takip Ettiklerin</span>
          {feedTab === 'following' && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-emerald-600 rounded-full" />
          )}
        </button>
      </div>

      {/* ── POST COMPOSER BOX (Twitter/X Style) ── */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_10px_30px_rgba(15,23,42,0.04)] p-5 sm:p-6 transition-all focus-within:border-slate-400 focus-within:shadow-md">
        <form onSubmit={handleCreatePost}>
          <div className="flex items-start gap-3.5">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-2xl bg-[#0B192C] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs ring-2 ring-slate-100">
              {isAnonymous ? (
                <EyeOff className="w-5 h-5 text-amber-300" />
              ) : (
                user?.fullName ? user.fullName.charAt(0) : 'E'
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">
                    {isAnonymous ? `Anonim ${user?.faculty || 'Öğrenci'}` : (user?.fullName || 'Efe Alsaç')}
                  </span>
                  {!isAnonymous && (
                    <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 inline-block" />
                  )}
                  <span className="text-[11px] text-slate-400 hidden sm:inline">
                    {isAnonymous ? '(Gizli Gönderi)' : (user?.faculty || 'Mühendislik Fakültesi')}
                  </span>
                </div>

                {/* Anonymous Rumuz Toggle */}
                <button
                  type="button"
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer border ${
                    isAnonymous
                      ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                  title="İsminizi gizleyerek anonim rumuzla paylaşın"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>{isAnonymous ? 'Rumuz Aktif' : 'Rumuzla Paylaş'}</span>
                </button>
              </div>

              {/* Textarea */}
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                maxLength={500}
                placeholder="Kampüste neler oluyor? Dersler, yemekhane, ulaşım veya etkinlikler hakkında yaz..."
                rows={3}
                className="w-full text-sm text-slate-900 placeholder:text-slate-400 bg-transparent border-0 resize-none focus:outline-none focus:ring-0 leading-relaxed"
              />

              {/* Topic Selector Pills */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
                  <Hash className="w-3 h-3" />
                  <span>Konu:</span>
                </span>
                {FORUM_TOPICS.map((topic) => {
                  const isSelected = newPostTopic === topic;
                  return (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => setNewPostTopic(topic)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {topic}
                    </button>
                  );
                })}
              </div>

              {/* Footer Row: Progress Counter & Submit */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                {/* Character Counter with Circular Ring */}
                <div className="flex items-center gap-2">
                  <div className="relative w-6 h-6 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-100"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className={remainingChars < 50 ? 'text-rose-500' : 'text-emerald-500'}
                        strokeDasharray={`${charPercent}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                  </div>
                  <span
                    className={`text-xs font-semibold tabular-nums ${
                      remainingChars < 50 ? 'text-rose-600' : 'text-slate-400'
                    }`}
                  >
                    {remainingChars}
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!newPostContent.trim() || submitting}
                  className="px-5 py-2.5 rounded-xl bg-[#0F172A] hover:bg-[#0F766E] disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Paylaşılıyor...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Paylaş</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* ── TOPIC FILTER & SORT BAR ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 sm:px-4 rounded-2xl border border-slate-200/80 shadow-xs">
        {/* Topic Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedTopic('Tümü')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors cursor-pointer border ${
              selectedTopic === 'Tümü'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Tümü
          </button>
          {FORUM_TOPICS.map((topic) => {
            const isSelected = selectedTopic === topic;
            return (
              <button
                key={topic}
                type="button"
                onClick={() => setSelectedTopic(topic)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors cursor-pointer border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {topic}
              </button>
            );
          })}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-end sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setSortOrder('latest')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              sortOrder === 'latest'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>En Yeni</span>
          </button>
          <button
            type="button"
            onClick={() => setSortOrder('popular')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              sortOrder === 'popular'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>En Popüler</span>
          </button>
        </div>
      </div>

      {/* ── FORUM POSTS FEED ── */}
      {loading ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-slate-600">Kampüs forumu yükleniyor...</p>
        </div>
      ) : displayedPosts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
          {feedTab === 'following' ? (
            <>
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800">Takip Ettiğin Gönderi Bulunmuyor</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Takip ettiğin öğrencilerin ve toplulukların paylaşımları burada listelenir.
              </p>
              <button
                type="button"
                onClick={() => setFeedTab('foryou')}
                className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Size Özel Akışına Dön
              </button>
            </>
          ) : (
            <>
              <MessageSquareText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800">Henüz Bu Konuda Paylaşım Yok</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                İlk gönderiyi yukarıdaki kutudan yazarak kampüs tartışmasını başlatın.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {displayedPosts.map((post) => {
            const isCommentsExpanded = !!expandedComments[post.id];
            const badgeStyle = TOPIC_BADGE_STYLES[post.topic] || TOPIC_BADGE_STYLES['#Genel'];
            const postComments = post.comments || [];

            return (
              <div
                key={post.id}
                className="bg-white rounded-3xl border border-slate-200/80 hover:border-slate-300 shadow-[0_4px_20px_rgba(15,23,42,0.02)] transition-all overflow-hidden"
              >
                {/* Post Header & Content */}
                <div className="p-5 sm:p-6">
                  {/* Top Row: Author & Metadata */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 shadow-xs ${
                          post.isAnonymous
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-[#0F172A] text-white'
                        }`}
                      >
                        {post.isAnonymous ? (
                          <EyeOff className="w-4 h-4 text-amber-700" />
                        ) : (
                          post.author?.fullName ? post.author.fullName.charAt(0) : 'Ö'
                        )}
                      </div>

                      {/* Name, Verified & Faculty */}
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-extrabold text-slate-900">
                            {post.isAnonymous
                              ? (post.author?.fullName || 'Anonim Öğrenci')
                              : (post.author?.fullName || 'DPÜ Öğrencisi')}
                          </span>
                          {!post.isAnonymous && (
                            <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          )}
                          <span className="text-[11px] text-slate-400 font-normal">
                            • {formatRelativeTime(post.createdAt)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] font-medium text-slate-500">
                            {post.author?.faculty || 'Dumlupınar Üniversitesi'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Topic Badge */}
                    <span
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
                    >
                      {post.topic}
                    </span>
                  </div>

                  {/* Post Content */}
                  <div className="text-sm text-slate-800 leading-relaxed font-normal whitespace-pre-line pl-0 sm:pl-[52px]">
                    {post.content}
                  </div>

                  {/* ── ACTION BAR (Tabular Nums) ── */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between pl-0 sm:pl-[52px] text-xs text-slate-500">
                    <div className="flex items-center gap-4 sm:gap-6">
                      {/* Comments Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleComments(post.id)}
                        className={`flex items-center gap-1.5 py-1.5 px-2.5 rounded-xl transition-colors cursor-pointer ${
                          isCommentsExpanded
                            ? 'bg-blue-50 text-blue-700 font-semibold'
                            : 'hover:bg-slate-100 hover:text-slate-900'
                        }`}
                        title="Yorumları gör ve yanıt yaz"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span className="tabular-nums font-semibold">{post.commentCount}</span>
                        <span className="hidden sm:inline">Yanıt</span>
                      </button>

                      {/* Likes Button */}
                      <button
                        type="button"
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-1.5 py-1.5 px-2.5 rounded-xl transition-all cursor-pointer ${
                          post.hasLiked
                            ? 'text-rose-600 bg-rose-50 font-bold'
                            : 'hover:bg-rose-50 hover:text-rose-600'
                        }`}
                        title="Beğen"
                      >
                        <Heart
                          className={`w-4 h-4 transition-transform ${
                            post.hasLiked ? 'fill-rose-500 text-rose-500 scale-110' : ''
                          }`}
                        />
                        <span className="tabular-nums font-semibold">{post.likeCount}</span>
                      </button>

                      {/* Views Badge */}
                      <div
                        className="flex items-center gap-1.5 py-1.5 px-2 text-slate-400 select-none cursor-default"
                        title="Görüntülenme Sayısı"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="tabular-nums font-medium">{post.viewCount}</span>
                        <span className="hidden sm:inline">görüntülenme</span>
                      </div>
                    </div>

                    {/* Report Flag */}
                    <button
                      type="button"
                      onClick={() => setReportingPostId(post.id)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="İçeriği Bildir"
                    >
                      <Flag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* ── EXPANDABLE INLINE REPLIES SECTION ── */}
                {isCommentsExpanded && (
                  <div className="bg-slate-50/80 border-t border-slate-100 p-5 sm:p-6 pl-5 sm:pl-16 space-y-4">
                    {/* Existing Replies List */}
                    {postComments.length > 0 ? (
                      <div className="space-y-3">
                        {postComments.map((comment) => (
                          <div
                            key={comment.id}
                            className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs"
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-900">
                                  {comment.isAnonymous
                                    ? 'Anonim Öğrenci'
                                    : (comment.author?.fullName || 'Öğrenci')}
                                </span>
                                {!comment.isAnonymous && (
                                  <BadgeCheck className="w-3 h-3 text-emerald-600" />
                                )}
                                <span className="text-[10px] text-slate-400">
                                  {comment.author?.faculty}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400">
                                {formatRelativeTime(comment.createdAt)}
                              </span>
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed">
                              {comment.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic py-1">
                        Bu gönderiye henüz yanıt verilmemiş. İlk yanıtı siz yazın!
                      </p>
                    )}

                    {/* Quick Reply Composer */}
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        value={commentDrafts[post.id] || ''}
                        onChange={(e) =>
                          setCommentDrafts((prev) => ({ ...prev, [post.id]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleAddComment(post.id);
                          }
                        }}
                        placeholder="Yanıtınızı yazın (Enter ile gönder)..."
                        className="flex-1 h-10 px-3.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 transition-colors shadow-2xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddComment(post.id)}
                        disabled={!commentDrafts[post.id]?.trim() || submittingComment[post.id]}
                        className="h-10 px-4 bg-[#0F172A] hover:bg-[#0F766E] disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed shrink-0 flex items-center gap-1.5 shadow-2xs"
                      >
                        {submittingComment[post.id] ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Send className="w-3.5 h-3.5" />
                        )}
                        <span>Gönder</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── REPORT CONFIRMATION MODAL ── */}
      {reportingPostId && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setReportingPostId(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-11 h-11 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3.5">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900 text-center mb-1">
              İçeriği Bildir
            </h3>
            <p className="text-xs text-slate-500 text-center mb-4 leading-relaxed">
              Bu gönderinin DPÜ Kampüs topluluk kurallarını ihlal ettiğini düşünüyorsanız lütfen sebebi belirtin.
            </p>

            <div className="space-y-2 mb-5">
              {[
                'Uygunsuz / Hakaret İçeren İçerik',
                'Spam veya Reklam',
                'Yanıltıcı Bilgi',
                'Telif / Özel Hayat İhlali',
              ].map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    reportReason === reason
                      ? 'border-slate-900 bg-slate-50 font-semibold text-slate-900'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="reportReason"
                    value={reason}
                    checked={reportReason === reason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="text-slate-900 focus:ring-slate-900"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setReportingPostId(null)}
                className="h-10 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleConfirmReport}
                className="h-10 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Bildir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
