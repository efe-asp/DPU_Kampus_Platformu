import React, { useState } from 'react';
import { X, MapPin, CheckCircle } from 'lucide-react';
import type { ListingDTO } from '../types';

// Generate a crisp SVG QR code pattern (decorative, deterministic from listing id)
function generateQRPattern(seed: string): boolean[][] {
  const grid: boolean[][] = Array.from({ length: 21 }, () => Array(21).fill(false));
  // Corner finder patterns
  const setFinder = (r: number, c: number) => {
    for (let dr = 0; dr < 7; dr++) {
      for (let dc = 0; dc < 7; dc++) {
        const isEdge = dr === 0 || dr === 6 || dc === 0 || dc === 6;
        const isInner = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
        if (isEdge || isInner) grid[r + dr][c + dc] = true;
      }
    }
  };
  setFinder(0, 0);
  setFinder(0, 14);
  setFinder(14, 0);
  // Fill some data cells deterministically from seed
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  for (let r = 8; r < 21; r++) {
    for (let c = 8; c < 21; c++) {
      hash = (hash * 1664525 + 1013904223) | 0;
      grid[r][c] = hash % 3 !== 0;
    }
  }
  return grid;
}

interface QRModalProps {
  open: boolean;
  onClose: () => void;
  listing: ListingDTO;
}

export default function QRModal({ open, onClose, listing }: QRModalProps) {
  const [confirmed, setConfirmed] = useState(false);
  const pin = listing.id.split('').map(c => c.charCodeAt(0)).reduce((a, b) => a + b, 0).toString().slice(-6).padStart(6, '7');
  const qrGrid = generateQRPattern(listing.id);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-[#E4E4E7] rounded-2xl w-full max-w-sm shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E4E4E7]">
          <div>
            <h2 className="text-base font-semibold text-[#18181B]">QR Teslimat Kodu</h2>
            <p className="text-xs text-[#71717A] mt-0.5">Satıcıya gösterin, teslimatı onaylayın</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#71717A] hover:bg-[#F4F4F5] transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-5">
          {!confirmed ? (
            <>
              {/* QR Code SVG */}
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-white border-2 border-[#E4E4E7] rounded-xl inline-block">
                  <svg
                    viewBox="0 0 21 21"
                    width="168"
                    height="168"
                    xmlns="http://www.w3.org/2000/svg"
                    shapeRendering="crispEdges"
                  >
                    {qrGrid.map((row, r) =>
                      row.map((cell, c) =>
                        cell ? (
                          <rect
                            key={`${r}-${c}`}
                            x={c}
                            y={r}
                            width={1}
                            height={1}
                            fill="#18181B"
                          />
                        ) : null
                      )
                    )}
                  </svg>
                </div>
              </div>

              {/* PIN */}
              <div className="text-center mb-4">
                <p className="text-xs text-[#71717A] mb-1">6 Haneli Teslimat PIN</p>
                <p className="text-3xl font-bold tracking-[0.3em] text-[#18181B]" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {pin}
                </p>
              </div>

              {/* Pickup info */}
              <div className="flex items-center gap-2 justify-center text-sm text-[#71717A] mb-5">
                <MapPin size={14} className="text-[#0F766E]" />
                <span>{listing.pickupPoint}</span>
              </div>

              {/* Item info */}
              <div className="bg-[#F7F7F5] rounded-xl p-3 mb-5 text-sm">
                <p className="font-medium text-[#18181B] truncate">{listing.title}</p>
                <p className="text-xs text-[#71717A] mt-0.5" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {listing.isFree ? 'Ücretsiz' : `${listing.price.toLocaleString('tr-TR')} ₺`} · {listing.seller.fullName}
                </p>
              </div>

              <button
                onClick={() => setConfirmed(true)}
                className="w-full py-3 bg-[#0F766E] text-white text-sm font-medium rounded-lg hover:bg-[#0D6560] transition-colors"
              >
                Teslimatı Onayla
              </button>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-[#CCFBF1] flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-[#0F766E]" />
              </div>
              <h3 className="text-lg font-semibold text-[#18181B] mb-2">Teslimat Onaylandı</h3>
              <p className="text-sm text-[#71717A] mb-6">İşlem başarıyla tamamlandı. İlan arşive taşındı.</p>
              <button onClick={onClose} className="px-6 py-2.5 bg-[#18181B] text-white text-sm font-medium rounded-lg hover:bg-[#27272A] transition-colors">
                Kapat
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
