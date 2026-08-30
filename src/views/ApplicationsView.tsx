import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Filter,
  Layers,
  ChevronRight,
  Building,
  CheckCircle2,
  Eye,
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import { applications, colors, ownerImages } from '../data';
import type { ApplicationItem, ColorItem, LocaleConfig } from '../types';

interface ApplicationsViewProps {
  onSelectColor: (color: ColorItem) => void;
  currentLocale: LocaleConfig;
}

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({
  onSelectColor,
  currentLocale,
}) => {
  const [selectedCat, setSelectedCat] = useState<string>('All');

  const categories = ['All', 'Kitchen', 'Bathroom', 'Hotel', 'Commercial'];
  const productionReferenceIds = new Set(['owner-library-07', 'owner-library-13', 'owner-library-17']);
  const productionReferences = ownerImages.filter((image) => productionReferenceIds.has(image.id));

  const filteredApps = applications.filter((app) => {
    if (selectedCat === 'All') return true;
    const category = app.category.toLowerCase();
    if (selectedCat === 'Kitchen') return category.includes('kitchen');
    if (selectedCat === 'Bathroom') return category.includes('bath') || category.includes('multi-family');
    if (selectedCat === 'Hotel') return category.includes('hospitality') || category.includes('hotel');
    return ['commercial', 'restaurant', 'retail', 'furniture', 'outdoor'].some((term) => category.includes(term));
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-16">
      {/* Header Banner (Unified Apple Display + Keynote Style) */}
      <div className="space-y-4 max-w-4xl">
        <div className="wr-panel-eyebrow">
          <Sparkles className="w-3.5 h-3.5 text-stone-600" />
          <span className="tech-badge">APPLICATIONS & PRODUCT DIRECTIONS</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-[-0.035em] text-[#1d1d1f]">
          Stone in Space: Application Gallery.
        </h1>
        <p className="text-base sm:text-xl text-[#6e6e73] leading-relaxed max-w-3xl font-normal">
          Explore kitchen, vanity, furniture-top, hospitality, and commercial stone possibilities. Owner-supplied previous website images are identified separately from application inspiration.
        </p>

        {/* Industrial Highlights */}
        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
          <span className="wr-info-pill">
            <CheckCircle2 className="w-3.5 h-3.5 text-stone-600 shrink-0" />
            <span className="tech-badge">Drawing-Led Project Review</span>
          </span>
          <span className="wr-info-pill">
            <Building className="w-3.5 h-3.5 text-stone-600 shrink-0" />
            <span className="tech-badge">Material & Sample Approval</span>
          </span>
        </div>
      </div>

      <section className="wr-application-production" aria-labelledby="application-production-title">
        <div className="wr-section-heading wr-section-intro">
          <span className="wr-eyebrow">Production context</span>
          <h2 id="application-production-title">Inspiration moves into drawing review, preparation, and inspection.</h2>
          <p>These owner-supplied views show the production environment behind stone preparation. The application gallery below combines owner-supplied previous website references with clearly labeled inspiration.</p>
        </div>
        <div className="wr-application-production__grid">
          {productionReferences.map((item) => (
            <figure key={item.id}>
              <picture>
                {item.imageAvif && <source srcSet={item.imageAvif} type="image/avif" />}
                {item.imageWebp && <source srcSet={item.imageWebp} type="image/webp" />}
                <img src={item.image} alt={item.alt} width={1448} height={1086} loading="lazy" />
              </picture>
              <figcaption>{item.title} · owner supplied</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Filter Segment Controls */}
      <div className="wr-card p-4 sm:p-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                selectedCat === cat
                  ? 'bg-[#111113] text-white shadow-xs font-semibold'
                  : 'bg-black/[0.03] text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/[0.06]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="text-xs text-[#86868b] font-mono">
          Showing {filteredApps.length} Applications
        </div>
      </div>

      {/* Applications Grid (Unified Apple Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredApps.map((item, idx) => {
          const matchedColor = colors.find((c) => c.slug === item.featuredColorSlug);

          return (
            <div
              key={idx}
              className="wr-card overflow-hidden flex flex-col justify-between group"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                <img
                  src={item.image}
                  alt={item.imageAlt}
                  width={1200}
                  height={900}
                  loading="lazy"
                  className="wr-media-zoom"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="500" height="375" viewBox="0 0 500 375"><rect width="500" height="375" fill="%23f5f5f7"/><text x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23d97706" font-family="sans-serif" font-weight="bold" font-size="18">${item.title}</text></svg>`;
                  }}
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-mono font-bold text-[#1d1d1f] shadow-xs">
                  {item.category.toUpperCase()}
                </div>
                {item.caption && (
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/70 text-[10px] text-white backdrop-blur-md">
                    {item.caption}
                  </div>
                )}
              </div>

              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-2">
                  <span className="tech-badge text-[#86868b] block">
                    APPLICATION DIRECTION
                  </span>
                  <h3 className="font-bold text-lg text-[#1d1d1f] group-hover:text-stone-900 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#86868b] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-black/[0.06] flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-[#86868b] uppercase tracking-wider block">Featured Stone:</span>
                    <strong className="text-[#1d1d1f]">{item.featuredColor}</strong>
                  </div>

                  {matchedColor && (
                    <button
                      onClick={() => onSelectColor(matchedColor)}
                      className="px-4 py-2 rounded-full bg-black/[0.04] hover:bg-black/[0.08] text-[#1d1d1f] font-semibold text-xs transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      <span>Swatch Specs</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
