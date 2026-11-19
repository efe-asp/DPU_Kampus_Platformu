import React, { useState } from 'react';
import { X, Package } from 'lucide-react';
import { ApiService } from '../services/api';
import type { ListingDTO, Condition, Category, PickupPoint, CreateListingRequest } from '../types';

const PRODUCT_IMAGES = [
  { label: 'Hesap Makinesi', url: '/images/products/hesap-makinesi.svg' },
  { label: 'Ders Notu', url: '/images/products/ders-notu.svg' },
  { label: 'Kahve Makinesi', url: '/images/products/kahve-makinesi.svg' },
  { label: 'Masa Lambası', url: '/images/products/masa-lambasi.svg' },
  { label: 'Çizim Seti', url: '/images/products/cizim-seti.svg' },
  { label: 'Klavye', url: '/images/products/klavye.svg' },
];

const CONDITIONS: Condition[] = ['Sıfır Gibi', 'Az Kullanılmış', 'İyi', 'Orta'];
const CATEGORIES: Category[] = ['Ders Kitabı & Not', 'Elektronik', 'Ev & Yurt', 'Kırtasiye'];
const PICKUP_POINTS: PickupPoint[] = ['Merkez Kütüphane', 'Bedesten Çarşı', 'Mühendislik Kantini', 'KTB MYO', 'KYK Yurtlar'];

interface NewListingModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (listing: ListingDTO) => void;
}

export default function NewListingModal({ open, onClose, onCreated }: NewListingModalProps) {
  const [isFree, setIsFree] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState<Condition>('Az Kullanılmış');
  const [category, setCategory] = useState<Category>('Elektronik');
  const [pickupPoint, setPickupPoint] = useState<PickupPoint>('Mühendislik Kantini');
  const [selectedImage, setSelectedImage] = useState(PRODUCT_IMAGES[0].url);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const req: CreateListingRequest = {
        title,
        description,
        price: isFree ? 0 : Number(price),
        condition,
        category: isFree ? 'Askıda Ücretsiz' : category,
        pickupPoint,
        imageUrl: selectedImage,
        isFree,
      };
      const listing = await ApiService.createListing(req);
      onCreated(listing);
      // Reset
      setTitle(''); setDescription(''); setPrice(''); setIsFree(false);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-3 py-2.5 text-sm bg-white border border-[#E4E4E7] rounded-lg text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:ring-1 focus:ring-[#18181B] transition-colors";
  const labelClass = "block text-xs font-medium text-[#18181B] mb-1.5";

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-[#E4E4E7] rounded-2xl w-full max-w-lg shadow-xl my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E4E4E7]">
          <div>
            <h2 className="text-base font-semibold text-[#18181B]">Yeni İlan Paylaş</h2>
            <p className="text-xs text-[#71717A] mt-0.5">Kampüs pazarında herkese görünür olacak</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#71717A] hover:bg-[#F4F4F5] transition-colors">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Free toggle */}
          <div className="flex items-center justify-between p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl">
            <div>
              <p className="text-sm font-medium text-[#15803D]">Askıda Ücretsiz Ver</p>
              <p className="text-xs text-[#4ADE80] mt-0.5">İhtiyaç sahibi öğrencilere ücretsiz bağışla</p>
            </div>
            <button
              type="button"
              onClick={() => setIsFree(!isFree)}
              className={`relative w-11 h-6 rounded-full transition-colors ${isFree ? 'bg-[#0F766E]' : 'bg-[#E4E4E7]'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isFree ? 'translate-x-5' : ''}`} />
            </button>
          </div>

          {/* Image picker */}
          <div>
            <label className={labelClass}>Ürün Görseli</label>
            <div className="grid grid-cols-6 gap-2">
              {PRODUCT_IMAGES.map(img => (
                <button
                  key={img.url}
                  type="button"
                  onClick={() => setSelectedImage(img.url)}
                  className={`aspect-square rounded-lg border-2 p-2 flex items-center justify-center transition-colors ${
                    selectedImage === img.url ? 'border-[#18181B] bg-[#F4F4F5]' : 'border-[#E4E4E7] bg-white hover:border-[#A1A1AA]'
                  }`}
                  title={img.label}
                >
                  <img src={img.url} alt={img.label} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className={labelClass}>İlan Başlığı</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ürününüzü kısaca tanımlayın" className={inputClass} required />
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Açıklama</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Ürün durumu, özellikler, satış sebebi..." className={inputClass + ' resize-none'} rows={3} required />
          </div>

          {/* Price (if not free) */}
          {!isFree && (
            <div>
              <label className={labelClass}>Fiyat (₺)</label>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0" min="1" className={inputClass} required />
            </div>
          )}

          {/* Condition */}
          <div>
            <label className={labelClass}>Ürün Durumu</label>
            <select value={condition} onChange={e => setCondition(e.target.value as Condition)} className={inputClass}>
              {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Category (if not free) */}
          {!isFree && (
            <div>
              <label className={labelClass}>Kategori</label>
              <select value={category} onChange={e => setCategory(e.target.value as Category)} className={inputClass}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}

          {/* Pickup */}
          <div>
            <label className={labelClass}>Teslim Noktası</label>
            <select value={pickupPoint} onChange={e => setPickupPoint(e.target.value as PickupPoint)} className={inputClass}>
              {PICKUP_POINTS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#18181B] text-white text-sm font-medium rounded-lg hover:bg-[#27272A] disabled:opacity-50 transition-colors"
          >
            {loading ? 'Paylaşılıyor...' : 'İlanı Yayınla'}
          </button>
        </form>
      </div>
    </div>
  );
}
