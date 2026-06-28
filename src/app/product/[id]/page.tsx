"use client";

import React, { useState, useEffect } from 'react';
import { productService } from '@/services/productService';
import { Product, ProductVariation } from '@whiskers-bows/shared';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useNotification } from '@/context/NotificationContext';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { notify } = useNotification();
  const [id, setId] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedWidth, setSelectedWidth] = useState<string>('');
  const [selectedLength, setSelectedLength] = useState<string>('');
  const [selectedHardware, setSelectedHardware] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'desc' | 'size' | 'info'>('desc');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string>('');

  useEffect(() => {
    async function init() {
      const resolvedParams = await params;
      const productId = resolvedParams.id;
      setId(productId);
      try {
        const p = await productService.getProductById(productId);
        setProduct(p);
        if (p && p.variations && p.variations.length > 0) {
          const first = p.variations[0];
          setSelectedWidth(first.width);
          setSelectedLength(first.length);
          setSelectedHardware(first.hardware);
        }
        if (p && p.images && p.images.length > 0) {
          setMainImage(p.images[0]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [params]);

  if (loading) return <div className="container mx-auto py-20 text-center">Завантаження...</div>;
  if (!product) return <div className="container mx-auto py-20 text-center">Товар не знайдено.</div>;

  const selectedVariation = product.variations.find(v => 
    v.width === selectedWidth && 
    v.length === selectedLength && 
    v.hardware === selectedHardware
  ) || product.variations[0];

  const currentPrice = selectedVariation ? selectedVariation.price : product.basePrice;

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/catalog" className="hover:text-white transition-colors">Каталог</Link>
        <span>›</span>
        <Link href="/catalog/collars" className="hover:text-white transition-colors">Нашийники</Link>
        <span>›</span>
        <span className="text-gray-200 truncate">{product.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Gallery */}
        <div className="w-full lg:w-1/2">
          <div className="relative aspect-square bg-zinc-900 rounded-3xl overflow-hidden mb-4 group">
            <img 
              src={mainImage || 'https://placehold.co/600'} 
              alt={product.name} 
              className="w-full h-full object-cover" 
            />
            {/* Navigation Arrows */}
            <button 
              onClick={() => {
                const idx = product.images.indexOf(mainImage);
                setMainImage(product.images[(idx - 1 + product.images.length) % product.images.length]);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 hover:bg-black/50 text-white transition-all opacity-0 group-hover:opacity-100"
            >
              ←
            </button>
            <button 
              onClick={() => {
                const idx = product.images.indexOf(mainImage);
                setMainImage(product.images[(idx + 1) % product.images.length]);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 hover:bg-black/50 text-white transition-all opacity-0 group-hover:opacity-100"
            >
              →
            </button>
          </div>
          <div className="flex justify-center gap-4">
            {product.images.map((img, i) => (
              <div 
                key={i} 
                className={`w-20 h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${mainImage === img ? 'border-brand-yellow' : 'border-transparent hover:border-gray-500'}`}
                onClick={() => setMainImage(img)}
              >
                <img src={img} alt={product.name} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Configurator */}
        <div className="w-full lg:w-1/2">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold text-brand-yellow">
                Від {currentPrice} грн
              </div>
              <button 
                onClick={() => toggleWishlist(product, selectedVariation?.id || product.variations[0]?.id || '')}
                className="p-2 rounded-full border border-gray-700 hover:bg-zinc-800 transition-colors"
              >
                {isInWishlist(product.id, selectedVariation?.id || product.variations[0]?.id || '') ? '❤️' : '🤍'}
              </button>
            </div>
          </div>

          <div className="bg-zinc-900 p-8 rounded-3xl shadow-xl space-y-8 border border-zinc-800">
            {/* Width Selection */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium text-gray-300">Ширина</label>
                <button className="text-xs text-brand-yellow hover:underline">Розмірна сітка</button>
              </div>
              <div className="space-y-2">
                {[...new Set(product.variations.map(v => v.width))].map(width => (
                  <button 
                    key={width}
                    onClick={() => setSelectedWidth(width)}
                    className={`w-full flex justify-between items-center px-4 py-3 rounded-xl border transition-all ${selectedWidth === width ? 'border-brand-yellow bg-zinc-800 text-white' : 'border-zinc-700 text-gray-400 hover:border-gray-500'}`}
                  >
                    <span>{width}</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedWidth === width ? 'border-brand-yellow' : 'border-zinc-600'}`}>
                      {selectedWidth === width && <div className="w-2.5 h-2.5 rounded-full bg-brand-yellow" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Length Selection */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium text-gray-300">Довжина</label>
                <button className="text-xs text-brand-yellow hover:underline">Розмірна сітка</button>
              </div>
              <div className="space-y-2">
                {[...new Set(product.variations.map(v => v.length))].map(length => (
                  <button 
                    key={length}
                    onClick={() => setSelectedLength(length)}
                    className={`w-full flex justify-between items-center px-4 py-3 rounded-xl border transition-all ${selectedLength === length ? 'border-brand-yellow bg-zinc-800 text-white' : 'border-zinc-700 text-gray-400 hover:border-gray-500'}`}
                  >
                    <span>{length}</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedLength === length ? 'border-brand-yellow' : 'border-zinc-600'}`}>
                      {selectedLength === length && <div className="w-2.5 h-2.5 rounded-full bg-brand-yellow" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Hardware Selection */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium text-gray-300">Фурнітура</label>
                <span className="text-xs text-gray-500 cursor-help">ⓘ</span>
              </div>
              <div className="space-y-2">
                {[...new Set(product.variations.map(v => v.hardware))].map(hw => (
                  <button 
                    key={hw}
                    onClick={() => setSelectedHardware(hw)}
                    className={`w-full flex justify-between items-center px-4 py-3 rounded-xl border transition-all ${selectedHardware === hw ? 'border-brand-yellow bg-zinc-800 text-white' : 'border-zinc-700 text-gray-400 hover:border-gray-500'}`}
                  >
                    <span>{hw}</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedHardware === hw ? 'border-brand-yellow' : 'border-zinc-600'}`}>
                      {selectedHardware === hw && <div className="w-2.5 h-2.5 rounded-full bg-brand-yellow" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and CTA */}
            <div className="flex items-center justify-between gap-4 pt-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">Кількість</span>
                <div className="flex items-center border border-zinc-700 rounded-xl overflow-hidden">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 hover:bg-zinc-800 transition-colors border-r border-zinc-700">-</button>
                  <span className="px-4 py-2 font-medium w-12 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 hover:bg-zinc-800 transition-colors border-l border-zinc-700">+</button>
                </div>
              </div>
              <div className="text-2xl font-bold text-white">
                {currentPrice} грн
              </div>
            </div>

            <button 
              onClick={() => {
                if (selectedVariation) {
                  addToCart(product, selectedVariation, quantity);
                  notify('Товар додано до кошика!', 'success');
                }
              }}
              disabled={!product.isAvailable}
              className={`w-full py-4 font-bold rounded-xl transition-all shadow-lg cursor-pointer ${product.isAvailable ? 'bg-brand-yellow hover:bg-yellow-500 text-black' : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'}`}
            >
              {product.isAvailable ? 'Додати в кошик' : 'Немає в наявності'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-16 border-t border-zinc-800 pt-12">
        <div className="flex gap-12 border-b border-zinc-800 mb-8">
          {(['desc', 'size', 'info'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-base font-medium transition-colors relative ${activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              {tab === 'desc' ? 'Опис товару' : tab === 'size' ? 'Розмірна сітка' : 'Додаткова інформація'}
              {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-yellow" />}
            </button>
          ))}
        </div>
        <div className="text-gray-400 text-base leading-relaxed">
          {activeTab === 'desc' && (
            <div className="space-y-6 max-w-4xl">
              <p className="text-lg">{product.description}</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                {product.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-4 p-5 bg-zinc-900 rounded-2xl border border-zinc-800">
                    <span className="text-2xl">{f.icon}</span>
                    <div>
                      <div className="font-bold text-white">{f.title}</div>
                      <div className="text-sm text-gray-400">{f.description}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {activeTab === 'size' && (
            <div className="flex flex-col lg:flex-row gap-12 items-start">
              <div className="flex-grow space-y-8">
                {[
                  { label: 'XS', length: '15-25 см', width: '1.5 см', breeds: 'Йорк міні, чихуахуа, мальтезе міні, той терєр' },
                  { label: 'S', length: '20-30 см', width: '2 см', breeds: 'Йоркшерський терєр, басерджі, італійський грейхаунд, бішон фрізе басенджі, лавретка, папільйон, померанський шпіц, джек рассел, такса' },
                  { label: 'M', length: '30-45 см', width: '2.5 см', breeds: 'Бігль, мопс, французький бульдог, шиба-іну, кокер спанієль, пудель, бультерєр, джек рассел, коргі, вест хайленд' },
                  { label: 'L', length: '45-60 см', width: '2.5 см', breeds: 'Басет хаунд, акіта-іну, стаффорширський терєр, хаскі, лайка, маламут, лабрадор, доберман, пітбультерєр' },
                ].map(size => (
                  <div key={size.label} className="border-b border-zinc-800 pb-6 last:border-0">
                    <div className="text-xl font-bold text-white mb-4">{size.label}</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div><span className="text-gray-500">Довжина (охват шиї)</span> <span className="ml-2 block md:inline font-medium text-gray-300">{size.length}</span></div>
                      <div><span className="text-gray-500">Ширина</span> <span className="ml-2 block md:inline font-medium text-gray-300">{size.width}</span></div>
                      <div><span className="text-gray-500">Рекомендовано для порід</span> <span className="ml-2 block md:inline font-medium text-gray-300">{size.breeds}</span></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="w-full lg:w-1/3 flex flex-col items-center bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
                <div className="relative w-full max-w-[300px]">
                   <img src="https://placehold.co/400x300?text=Dog+Illustration" alt="Sizing guide" className="w-full opacity-80" />
                   <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
                      <div className="w-6 h-6 bg-brand-red text-white rounded-full flex items-center justify-center text-xs font-bold">A</div>
                      <span className="text-sm font-medium">Шия</span>
                   </div>
                </div>
                <div className="mt-6 text-center text-sm text-gray-500">
                  Будь ласка, виміряйте обхват шиї вашого улюбленця.
                </div>
              </div>
            </div>
          )}
          {activeTab === 'info' && (
            <div className="max-w-2xl space-y-3">
              <div className="flex justify-between py-4 border-b border-zinc-800">
                <span className="text-gray-500">Матеріал</span>
                <span className="font-medium text-white">Нейлонова стропа</span>
              </div>
              <div className="flex justify-between py-4 border-b border-zinc-800">
                <span className="text-gray-500">Країна</span>
                <span className="font-medium text-white">Україна (Handmade)</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

