import React, { useState } from 'react';
import {
  Building,
  ShieldCheck,
  CheckCircle2,
  Maximize2,
  Layers,
  Wrench,
  Package,
  FileCheck,
  Cpu,
  Eye,
  Camera,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  ArrowRight,
  Info,
  Factory,
  Globe2,
  MapPin,
  Check,
  Ruler
} from 'lucide-react';
import { factory, company, ownerImages } from '../data';
import { ProductionMap } from '../components/ProductionMap';
import type { LocaleConfig, FactoryGalleryItem, EquipmentItem } from '../types';

interface FactoryViewProps {
  currentLocale: LocaleConfig;
  setCurrentTab: (tab: string) => void;
}

export const FactoryView: React.FC<FactoryViewProps> = ({
  currentLocale,
  setCurrentTab,
}) => {
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState<string>('All');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const ownerImagePaths = new Set(ownerImages.map((item) => item.image));
  const galleryItems = [
    ...(factory.gallery as FactoryGalleryItem[]).filter((item) => !ownerImagePaths.has(item.image)),
    ...ownerImages
  ];
  const categories = [
    'All',
    ...Array.from(new Set(galleryItems.map((item) => item.category).filter(Boolean) as string[]))
  ];
  const equipmentItems = factory.equipment as EquipmentItem[];

  const filteredItems = galleryItems.filter((item) => {
    if (selectedGalleryCategory === 'All') return true;
    return item.category?.toLowerCase().includes(selectedGalleryCategory.toLowerCase()) ||
           item.title?.toLowerCase().includes(selectedGalleryCategory.toLowerCase());
  });

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex - 1 + galleryItems.length) % galleryItems.length);
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex + 1) % galleryItems.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 space-y-24 sm:space-y-28">
      {/* Top Header & Context Banner (Apple Display + Industrial Precision) */}
      <div className="wr-factory-intro space-y-4">
        <div className="wr-panel-eyebrow">
          <Factory className="w-3.5 h-3.5 text-stone-700" />
          <span className="tech-badge">20,000 M² DIRECT VIETNAM FABRICATION PLANT • BÌNH PHƯỚC</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-[-0.035em] text-[#1d1d1f]">
          Direct Vietnam Manufacturing Plant.
        </h1>
        <p className="text-base sm:text-xl text-[#6e6e73] leading-relaxed max-w-3xl font-normal">
          {factory.heroCopy}
        </p>
      </div>

      <figure className="wr-factory-hero-media">
        <picture>
          <source
            srcSet="/assets/owner/enhanced/production-hall-aisle-enhanced-1280.avif"
            type="image/avif"
          />
          <source
            srcSet="/assets/owner/enhanced/production-hall-aisle-enhanced-1280.webp"
            type="image/webp"
          />
          <img
            src="/assets/owner/enhanced/production-hall-aisle-enhanced.jpg"
            alt="Owner-supplied view along a central stone production aisle"
            width={1448}
            height={1086}
            loading="eager"
            fetchPriority="high"
          />
        </picture>
        <figcaption>Production hall overview · owner supplied</figcaption>
      </figure>

      {/* Production Footprint Stats Grid (Apple Numbers with Monospace Engineering Badges) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {factory.stats.map((stat, idx) => (
          <div
            key={idx}
            className="wr-card p-6 sm:p-8 space-y-2 flex flex-col justify-between"
          >
            <div className="tech-badge text-[#86868b]">
              {stat.label}
            </div>
            <div className="flex items-baseline justify-between pt-2">
              <span className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1d1d1f]">
                {stat.value}
              </span>
              <span className="text-[10px] text-stone-800 font-bold bg-stone-50 px-2 py-0.5 rounded-full border border-stone-200">
                {stat.confirmed ? 'Confirmed' : 'Pending'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <section className="wr-retailer-audits" aria-labelledby="retailer-audits-title">
        <div className="wr-section-heading wr-section-intro">
          <span className="wr-eyebrow">Retailer approval & audit framework</span>
          <h2 id="retailer-audits-title">Owner-confirmed THD factory status with document boundaries.</h2>
          <p>{factory.retailerAudits.intro}</p>
        </div>
        <div className="wr-retailer-audits__grid">
          {factory.retailerAudits.items.map((item) => (
            <article key={item.code}>
              <span>{item.code}</span>
              <h3>{item.name}</h3>
              <p>{item.scope}</p>
              <small>{item.status}</small>
            </article>
          ))}
        </div>
      </section>

      {/* Interactive Vietnam Production Base Map & Logistics Matrix */}
      <div className="wr-card p-4 sm:p-8">
        <ProductionMap currentLocale={currentLocale} />
      </div>

      {/* Core Machinery & Fabrication Capabilities */}
      <section className="space-y-8">
        <div className="space-y-2 max-w-3xl">
          <div className="tech-badge text-[#86868b]">
            MACHINERY & CNC SPECIFICATIONS
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#1d1d1f]">
            High-Throughput Stone Processing & Edge Lines
          </h2>
          <p className="text-xs sm:text-sm text-[#86868b]">
            Production dimensions and inspection limits are agreed in approved drawings and the order quality plan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {equipmentItems.map((item, idx) => (
            <div
              key={idx}
              className="wr-card wr-equipment-card p-6 sm:p-8 flex flex-col justify-between group"
            >
              <figure className={`wr-equipment-card__media ${item.imageType === 'icon' ? 'is-diagram' : ''}`}>
                <img
                  src={item.media || item.drawing}
                  alt={item.alt || `${item.name} visual reference`}
                  width={item.imageType === 'icon' ? 640 : 980}
                  height={item.imageType === 'icon' ? 420 : 735}
                  loading="lazy"
                />
                {item.imageType === 'real' && <figcaption>Owner-supplied photo · editorial crop</figcaption>}
              </figure>
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-semibold text-[#1d1d1f] bg-black/[0.04] px-3 py-1 rounded-full border border-black/[0.05]">
                    {item.quantity} In Operation
                  </span>
                  <span className="text-[11px] font-semibold text-stone-800 bg-stone-50 px-3 py-1 rounded-full border border-stone-200 font-mono">
                    {item.keySpec || item.accuracy || 'Specification confirmed per order'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#1d1d1f]">
                  {item.name}
                </h3>
                <p className="text-xs text-[#86868b] leading-relaxed">
                  {item.function || item.purpose}
                </p>
              </div>

              <div className="pt-3 border-t border-black/[0.06] flex items-center justify-between text-xs">
                <span className="tech-badge text-[#86868b]">{item.location || 'VIETNAM FACTORY REFERENCE'}</span>
                <CheckCircle2 className="w-4 h-4 text-stone-600" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Real Workshop Photo Gallery */}
      <section className="space-y-8 wr-card p-6 sm:p-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/[0.06] pb-6">
          <div className="space-y-2">
            <div className="tech-badge text-[#86868b]">
              OWNER IMAGE LIBRARY
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f]">
              Workshop, Product & Equipment Views
            </h2>
            <p className="text-xs sm:text-sm text-[#86868b] max-w-2xl">
              Browse owner-supplied images covering production staging, equipment, inspection, finishing, and vanity-top preparation.
            </p>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-full bg-[#f5f5f7] border border-black/[0.06]">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedGalleryCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  selectedGalleryCategory === cat
                    ? 'bg-[#111113] text-white shadow-xs font-semibold'
                    : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item, idx) => {
            const originalIndex = galleryItems.findIndex((g) => g.id === item.id || g.title === item.title);

            return (
              <div
                key={item.id || idx}
                onClick={() => setSelectedPhotoIndex(originalIndex >= 0 ? originalIndex : 0)}
                className="wr-gallery-card bg-white border border-black/[0.08] hover:border-black/20 overflow-hidden flex flex-col transition-colors group cursor-pointer"
              >
                {/* Photo Image Stage */}
                <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                  <picture>
                    {item.imageAvif && <source srcSet={item.imageAvif} type="image/avif" />}
                    {item.imageWebp && <source srcSet={item.imageWebp} type="image/webp" />}
                    <img
                      src={item.image}
                      alt={item.alt || item.title}
                      width={960}
                      height={720}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="wr-media-zoom"
                    />
                  </picture>
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-semibold text-[#1d1d1f] shadow-xs">
                    {item.category || 'Fabrication'}
                  </div>
                  {item.caption && <span className="wr-media-disclosure">{item.caption}</span>}
                </div>

                {/* Card Meta Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-[#1d1d1f] group-hover:text-stone-900 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#86868b] line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-black/[0.06] flex items-center justify-between text-xs text-[#1d1d1f] font-semibold">
                    <span>Inspect High-Res</span>
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedPhotoIndex !== null && galleryItems[selectedPhotoIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={() => setSelectedPhotoIndex(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-[#161617] rounded-3xl overflow-hidden border border-white/10 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-16/10 bg-black">
              <img
                src={galleryItems[selectedPhotoIndex].image}
                alt={galleryItems[selectedPhotoIndex].title}
                width={1440}
                height={960}
                loading="lazy"
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => setSelectedPhotoIndex(null)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <button
                onClick={handlePrevPhoto}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNextPhoto}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 text-white space-y-2">
              <span className="tech-badge text-stone-300">
                {galleryItems[selectedPhotoIndex].category}
              </span>
              <h3 className="text-xl font-bold">{galleryItems[selectedPhotoIndex].title}</h3>
              <p className="text-sm text-[#a1a1a6] leading-relaxed">
                {galleryItems[selectedPhotoIndex].description}
              </p>
              {galleryItems[selectedPhotoIndex].caption && (
                <p className="text-xs text-[#d2d2d7]">
                  {galleryItems[selectedPhotoIndex].caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
