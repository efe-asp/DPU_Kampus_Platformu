import React, { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';
import { ApiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { User, ListingDTO, MessageDTO } from '../types';

const QUICK_REPLIES = [
  'Hâlâ satılık mı?',
  'Ne zaman teslim edebilirsiniz?',
  'Fiyat pazarlıklı mı?',
  'Ürünün fotoğrafını paylaşabilir misiniz?',
];

interface ChatDrawerProps {
  open: boolean;
  onClose: () => void;
  participant: User;
  listing?: ListingDTO;
}

export default function ChatDrawer({ open, onClose, participant, listing }: ChatDrawerProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<MessageDTO[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      ApiService.getMessages('conv1').then(setMessages);
    }
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (content: string = input.trim()) => {
    if (!content || sending) return;
    setSending(true);
    setInput('');
    try {
      const msg = await ApiService.sendMessage(participant.id, content, listing?.id);
      setMessages(prev => [...prev, msg]);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  };

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white border-l border-[#E4E4E7] z-50 flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E4E4E7] shrink-0">
          <div className="w-9 h-9 rounded-full bg-[#18181B] flex items-center justify-center text-white text-sm font-semibold">
            {participant.fullName.charAt(0)}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#18181B]">{participant.fullName}</p>
            <p className="text-xs text-[#71717A]">{participant.faculty}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#71717A] hover:bg-[#F4F4F5] transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Listing snapshot */}
        {listing && (
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E4E4E7] bg-[#F7F7F5] shrink-0">
            <div className="w-12 h-12 rounded-lg bg-white border border-[#E4E4E7] flex items-center justify-center p-1 shrink-0">
              <img src={listing.imageUrl} alt={listing.title} className="w-full h-full object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[#18181B] truncate">{listing.title}</p>
              <p className="text-xs text-[#0F766E] font-semibold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {listing.isFree ? 'Ücretsiz' : `${listing.price.toLocaleString('tr-TR')} ₺`}
              </p>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map(msg => {
            const isMe = msg.senderId === user?.id || msg.senderId === 'u1';
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] px-3 py-2 rounded-xl text-sm ${
                  isMe
                    ? 'bg-[#18181B] text-white rounded-tr-sm'
                    : 'bg-[#F4F4F5] text-[#18181B] rounded-tl-sm'
                }`}>
                  <p className="leading-relaxed">{msg.content}</p>
                  <p className={`text-[10px] mt-1 ${isMe ? 'text-[#A1A1AA]' : 'text-[#A1A1AA]'}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {formatTime(msg.sentAt)}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick replies */}
        <div className="px-4 py-2 border-t border-[#E4E4E7] flex gap-2 overflow-x-auto shrink-0 pb-2">
          {QUICK_REPLIES.map(qr => (
            <button
              key={qr}
              onClick={() => handleSend(qr)}
              className="shrink-0 px-3 py-1.5 text-xs text-[#18181B] border border-[#E4E4E7] rounded-full bg-white hover:bg-[#F7F7F5] transition-colors whitespace-nowrap"
            >
              {qr}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 px-4 py-3 border-t border-[#E4E4E7] shrink-0">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Mesajınızı yazın..."
            className="flex-1 px-3 py-2 text-sm bg-[#F4F4F5] border border-[#E4E4E7] rounded-lg text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:ring-1 focus:ring-[#18181B] focus:bg-white transition-colors"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || sending}
            className="p-2 bg-[#18181B] text-white rounded-lg hover:bg-[#27272A] disabled:opacity-40 transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </>
  );
}
