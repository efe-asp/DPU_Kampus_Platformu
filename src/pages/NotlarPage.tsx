import React, { useState, useEffect } from 'react';
import { FileText, ThumbsUp, Download, Users, Calendar, ChevronDown, Search, ArrowUpRight, CheckCircle2, BookOpen } from 'lucide-react';
import { ApiService } from '../services/api';
import type { NoteDTO, ProjectTeamDTO } from '../types';

const FACULTIES = [
  'Tüm Fakülteler',
  'Mühendislik Fakültesi',
  'Kütahya Teknik Bilimler MYO',
  'Fen-Edebiyat Fakültesi',
  'İİBF',
  'Eğitim Fakültesi',
  'Güzel Sanatlar Fakültesi',
];

const PROJECT_TYPE_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  'Teknofest': { bg: 'bg-[#FEF3C7]', text: 'text-[#D97706]', border: 'border-[#FDE68A]' },
  'TÜBİTAK': { bg: 'bg-[#EFF6FF]', text: 'text-[#2563EB]', border: 'border-[#BFDBFE]' },
  'Bitirme Projesi': { bg: 'bg-[#F4F4F5]', text: 'text-[#18181B]', border: 'border-[#E4E4E7]' },
  'Yarışma': { bg: 'bg-[#CCFBF1]', text: 'text-[#0F766E]', border: 'border-[#99F6E4]' },
};

function NotesSubTab() {
  const [notes, setNotes] = useState<NoteDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [faculty, setFaculty] = useState('');
  const [courseSearch, setCourseSearch] = useState('');
  const [upvotingId, setUpvotingId] = useState<string | null>(null);
  const [previewNote, setPreviewNote] = useState<NoteDTO | null>(null);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getNotes(
        faculty && faculty !== 'Tüm Fakülteler' ? faculty : undefined,
        courseSearch.trim() || undefined
      );
      setNotes(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [faculty]);

  const handleUpvote = async (id: string) => {
    setUpvotingId(id);
    try {
      const updated = await ApiService.upvoteNote(id);
      setNotes(prev => prev.map(n => n.id === id ? updated : n));
    } finally {
      setUpvotingId(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Search and Faculty filter */}
      <div className="bg-white border border-[#E4E4E7] rounded-xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative sm:w-64">
          <select
            value={faculty}
            onChange={(e) => setFaculty(e.target.value)}
            className="w-full appearance-none pl-3.5 pr-8 py-2 text-xs font-medium bg-[#F7F7F5] border border-[#E4E4E7] rounded-lg text-[#18181B] focus:outline-none focus:border-[#18181B] cursor-pointer"
          >
            {FACULTIES.map(f => (
              <option key={f} value={f === 'Tüm Fakülteler' ? '' : f}>{f}</option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71717A] pointer-events-none" />
        </div>

        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
          <input
            type="text"
            placeholder="Ders veya konu adı ile ara (örn: Veri Yapıları, Diferansiyel...)"
            value={courseSearch}
            onChange={(e) => setCourseSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') fetchNotes(); }}
            className="w-full pl-9 pr-24 py-2 text-xs bg-[#F7F7F5] border border-[#E4E4E7] rounded-lg text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#18181B]"
          />
          <button
            onClick={fetchNotes}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-[#18181B] text-white text-xs font-semibold rounded-md hover:bg-[#27272A] transition-colors"
          >
            Filtrele
          </button>
        </div>
      </div>

      {/* Notes list */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-[#E4E4E7] rounded-xl p-5 animate-pulse">
              <div className="h-5 bg-[#F4F4F5] rounded w-2/3 mb-2" />
              <div className="h-3 bg-[#F4F4F5] rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : notes.length === 0 ? (
        <div className="bg-white border border-[#E4E4E7] rounded-xl p-12 text-center">
          <FileText className="w-10 h-10 text-[#A1A1AA] mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-[#18181B]">Eşleşen Ders Notu Bulunamadı</h3>
          <p className="text-xs text-[#71717A] mt-1">Arama kriterlerinizi değiştirerek tekrar deneyebilirsiniz.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-white border border-[#E4E4E7] rounded-xl p-5 hover:border-[#18181B] transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-[#F7F7F5] border border-[#E4E4E7] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-[#0F766E]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-semibold text-[#18181B] bg-[#F7F7F5] border border-[#E4E4E7] px-2 py-0.5 rounded-full">
                        {note.faculty}
                      </span>
                      <span className="text-[11px] text-[#71717A]">
                        {note.semester}
                      </span>
                      <span className="text-[11px] text-[#71717A] tabular-nums">
                        · {note.pageCount} Sayfa
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-[#18181B] leading-snug mb-1">
                      {note.title}
                    </h3>
                    <p className="text-xs text-[#71717A] mb-2">{note.course}</p>

                    <div className="flex items-center gap-2 text-xs text-[#71717A]">
                      <div className="w-5 h-5 rounded-full bg-[#18181B] text-white text-[10px] font-bold flex items-center justify-center">
                        {note.uploader.fullName.charAt(0)}
                      </div>
                      <span>{note.uploader.fullName}</span>
                      <span>·</span>
                      <span className="text-[11px]">{new Date(note.uploadedAt).toLocaleDateString('tr-TR')}</span>
                    </div>
                  </div>
                </div>

                {/* Actions: Upvote & Download */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleUpvote(note.id)}
                    disabled={upvotingId === note.id}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                      note.hasUserUpvoted
                        ? 'bg-[#CCFBF1] text-[#0F766E] border-[#99F6E4]'
                        : 'bg-white text-[#71717A] border-[#E4E4E7] hover:border-[#18181B] hover:text-[#18181B]'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span className="tabular-nums">{note.upvotes}</span>
                  </button>

                  <button
                    onClick={() => setPreviewNote(note)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#18181B] hover:bg-[#27272A] text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    PDF İndir (Önizle)
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PDF Download / Preview Modal */}
      {previewNote && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E4E4E7] rounded-2xl w-full max-w-lg shadow-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#CCFBF1] border border-[#99F6E4] flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-[#0F766E]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#18181B]">{previewNote.title}</h3>
                  <p className="text-xs text-[#71717A]">{previewNote.course} · {previewNote.pageCount} Sayfa</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewNote(null)}
                className="text-[#71717A] hover:text-[#18181B] text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#F7F7F5] border border-[#E4E4E7] rounded-xl p-6 text-center mb-5">
              <p className="text-xs font-semibold text-[#18181B] mb-1">
                Kütahya Dumlupınar Üniversitesi Öğrenci Arşivi
              </p>
              <p className="text-[11px] text-[#71717A] max-w-sm mx-auto">
                Bu not {previewNote.uploader.fullName} tarafından DPÜ öğrencileriyle dayanışma amacıyla paylaşılmıştır.
              </p>
              <div className="mt-4 pt-3 border-t border-[#E4E4E7] text-left text-xs space-y-1.5">
                <p><strong>Fakülte:</strong> {previewNote.faculty}</p>
                <p><strong>Dönem:</strong> {previewNote.semester}</p>
                <p><strong>Dosya Formatı:</strong> Orijinal Vektör PDF (Yüksek Çözünürlük)</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setPreviewNote(null)}
                className="flex-1 py-2 text-xs font-semibold border border-[#E4E4E7] rounded-lg text-[#71717A] hover:bg-[#F7F7F5]"
              >
                Kapat
              </button>
              <a
                href="#download"
                onClick={(e) => {
                  e.preventDefault();
                  alert(`"${previewNote.title}" için PDF indirme simülasyonu başlatıldı.`);
                  setPreviewNote(null);
                }}
                className="flex-1 py-2 text-xs font-semibold bg-[#0F766E] hover:bg-[#115E59] text-white rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Dosyayı İndir (PDF)
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectsSubTab() {
  const [projects, setProjects] = useState<ProjectTeamDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [appliedSet, setAppliedSet] = useState<Set<string>>(new Set());
  const [applyingId, setApplyingId] = useState<string | null>(null);

  useEffect(() => {
    ApiService.getProjects()
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  const handleApply = async (id: string) => {
    setApplyingId(id);
    await new Promise(r => setTimeout(r, 450));
    setAppliedSet(prev => new Set(prev).add(id));
    setApplyingId(null);
  };

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white border border-[#E4E4E7] rounded-xl p-5 animate-pulse">
              <div className="h-5 bg-[#F4F4F5] rounded w-1/3 mb-2" />
              <div className="h-3 bg-[#F4F4F5] rounded w-full mb-1" />
              <div className="h-3 bg-[#F4F4F5] rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        projects.map((project) => {
          const badge = PROJECT_TYPE_STYLES[project.type] || { bg: 'bg-[#F4F4F5]', text: 'text-[#18181B]', border: 'border-[#E4E4E7]' };
          const isApplied = appliedSet.has(project.id);

          return (
            <div
              key={project.id}
              className="bg-white border border-[#E4E4E7] rounded-xl p-6 hover:border-[#18181B] transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badge.bg} ${badge.text} ${badge.border}`}>
                      {project.type}
                    </span>
                    {project.deadline && (
                      <span className="text-xs text-[#71717A] flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Son Başvuru: {new Date(project.deadline).toLocaleDateString('tr-TR')}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-[#18181B] mb-2 leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-xs text-[#71717A] leading-relaxed mb-4">
                    {project.description}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.skills.map(s => (
                      <span
                        key={s}
                        className="text-[11px] font-medium text-[#18181B] bg-[#F7F7F5] border border-[#E4E4E7] px-2.5 py-1 rounded-md"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-[#71717A]">
                    <div className="flex items-center gap-1.5 font-medium text-[#18181B]">
                      <Users className="w-3.5 h-3.5 text-[#0F766E]" />
                      <span className="tabular-nums">{project.currentMembers}/{project.teamSize} Kişi</span>
                    </div>
                    <span>·</span>
                    <span>Proje Lideri: {project.creator.fullName} ({project.creator.faculty})</span>
                  </div>
                </div>

                <div className="shrink-0 sm:self-center">
                  <button
                    onClick={() => handleApply(project.id)}
                    disabled={isApplied || applyingId === project.id}
                    className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 ${
                      isApplied
                        ? 'bg-[#CCFBF1] text-[#0F766E] border border-[#99F6E4] cursor-default'
                        : 'bg-[#18181B] hover:bg-[#27272A] text-white shadow-sm'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Başvuru İletildi
                      </>
                    ) : applyingId === project.id ? (
                      'Gönderiliyor...'
                    ) : (
                      <>
                        Ekibe Başvur
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default function NotlarPage() {
  const [activeTab, setActiveTab] = useState<'notes' | 'projects'>('notes');

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#18181B]">Ders Notu & Proje Ekibi</h1>
        <p className="text-sm text-[#71717A] mt-0.5">
          Dumlupınar Üniversitesi öğrenci not arşivi, çıkmış sorular ve yarışma proje takımları
        </p>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-[#E4E4E7] space-x-6">
        <button
          onClick={() => setActiveTab('notes')}
          className={`py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'notes'
              ? 'border-[#18181B] text-[#18181B]'
              : 'border-transparent text-[#71717A] hover:text-[#18181B]'
          }`}
        >
          <FileText className="w-4 h-4" />
          Ders Notları & Çıkmışlar
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          className={`py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'projects'
              ? 'border-[#18181B] text-[#18181B]'
              : 'border-transparent text-[#71717A] hover:text-[#18181B]'
          }`}
        >
          <Users className="w-4 h-4" />
          Proje & Yarışma Ekibi
        </button>
      </div>

      {/* Content */}
      {activeTab === 'notes' ? <NotesSubTab /> : <ProjectsSubTab />}
    </div>
  );
}
