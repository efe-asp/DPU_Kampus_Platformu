import React, { useState, useEffect } from 'react';
import { MapPin, MessageCircle, AlertCircle, CheckCircle } from 'lucide-react';
import { ApiService } from '../services/api';
import type { LostFoundDTO } from '../types';
import ChatDrawer from '../components/ChatDrawer';

const FILTERS = ['Tümü', 'Kayıp İlanları', 'Buluntu Eşyalar'];

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours} saat önce`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} gün önce`;
  return new Date(iso).toLocaleDateString('tr-TR');
}

export default function KayipBuluntuPage() {
  const [items, setItems] = useState<LostFoundDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Tümü');
  const [chatItem, setChatItem] = useState<LostFoundDTO | null>(null);

  useEffect(() => {
    setLoading(true);
    ApiService.getLostFound(activeFilter)
      .then(setItems)
      .finally(() => setLoading(false));
  }, [activeFilter]);

  return (
    <div className="p-6 max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-tight text-[#18181B]">Kayıp & Buluntu Panosu</h1>
        <p className="text-sm text-[#71717A] mt-0.5">Kayıp eşyalarınızı bildirin veya bulduklarınızı sahiplerine ulaştırın</p>
      </div>

      {/* Filter tabs */}
      <div className="flex border border-[#E4E4E7] rounded-xl overflow-hidden mb-6 bg-[#F7F7F5] p-1 w-fit gap-1">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeFilter === f
                ? 'bg-white text-[#18181B] shadow-sm border border-[#E4E4E7]'
                : 'text-[#71717A] hover:text-[#18181B]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Feed */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-[#E4E4E7] rounded-xl p-5 animate-pulse">
              <div className="h-5 bg-[#F4F4F5] rounded w-1/2 mb-2" />
              <div className="h-3 bg-[#F4F4F5] rounded w-3/4 mb-1" />
              <div className="h-3 bg-[#F4F4F5] rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle size={40} className="text-[#E4E4E7] mb-3" />
          <p className="text-sm font-medium text-[#71717A]">Bu kategoride ilan bulunamadı</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div
              key={item.id}
              className="bg-white border border-[#E4E4E7] rounded-xl p-5 hover:border-[#A1A1AA] transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* Status icon */}
                <div className={`mt-0.5 shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${
                  item.status === 'BULUNTU' ? 'bg-[#CCFBF1]' : 'bg-[#FEF3C7]'
                }`}>
                  {item.status === 'BULUNTU'
                    ? <CheckCircle size={18} className="text-[#0F766E]" />
                    : <AlertCircle size={18} className="text-[#D97706]" />
                  }
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                      item.status === 'BULUNTU'
                        ? 'text-[#0F766E] bg-[#CCFBF1] border-[#99F6E4]'
                        : 'text-[#D97706] bg-[#FEF3C7] border-[#FDE68A]'
                    }`}>
                      {item.status}
                    </span>
                    <span className="text-[11px] text-[#A1A1AA]" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {formatRelativeTime(item.createdAt)}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-[#18181B] mb-1 leading-snug">{item.title}</h3>
                  <p className="text-xs text-[#71717A] leading-relaxed mb-3 line-clamp-2">{item.description}</p>

                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-1.5 text-xs text-[#71717A]">
                        <MapPin size={12} />
                        <span>{item.location}</span>
                      </div>
                      <span className="text-xs text-[#A1A1AA]">
                        {item.status === 'BULUNTU' ? 'Bulan:' : 'Bildiren:'} {item.reportedBy.fullName}
                      </span>
                    </div>

                    <button
                      onClick={() => setChatItem(item)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#18181B] border border-[#E4E4E7] rounded-lg hover:bg-[#F7F7F5] transition-colors"
                    >
                      <MessageCircle size={13} />
                      Mesaj Gönder
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chat drawer */}
      {chatItem && (
        <ChatDrawer
          open={!!chatItem}
          onClose={() => setChatItem(null)}
          participant={chatItem.reportedBy}
        />
      )}
    </div>
  );
}
