import React, { useEffect, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, Check, GitCompare, Package, Search } from 'lucide-react';
import { colors, photoGalleries } from '../data';
import { t } from '../i18n';
import { routePath } from '../routes';
import { formatMeasurement } from '../utils/measurements';
import { StoneVisualizer } from '../components/StoneVisualizer';
import { ColorSwatchImage } from '../components/ColorSwatchImage';
import { Tag } from '../components/ui/Tag';
import { PhotoReferenceRail } from '../components/PhotoReferenceRail';
import type { ColorItem, LocaleConfig } from '../types';

type ColorFamily = ColorItem['colorFamily'];

interface ColorsViewProps {
  onSelectColor: (color: ColorItem) => void;
  onAddColorSample: (color: ColorItem) => void;
  currentLocale: LocaleConfig;
  onToggleCompare: (color: ColorItem) => void;
  compareIds: string[];
  setCurrentTab: (tab: string) => void;
  family?: ColorFamily;
}

const familyDefinitions: Array<{
  name: ColorFamily;
  routeId: string;
  representativeSlug: string;
  description: string;
}> = [
  { name: 'White', routeId: 'color-white', representativeSlug: 'calacatta-crest', description: 'Bright white through soft Carrara movement for vanity, kitchen, furniture, and coordinated interior programs.' },
  { name: 'Grey', routeId: 'color-grey', representativeSlug: 'silver-ash', description: 'Mineral grey, concrete, silver, and smoke directions for restrained residential and commercial palettes.' },
  { name: 'Black', routeId: 'color-black', representativeSlug: 'graphite-crystal', description: 'Dense dark stone directions with graphite, pearl, and veined character for strong visual contrast.' },
  { name: 'Beige', routeId: 'color-beige', representativeSlug: 'warm-ivory', description: 'Warm ivory, sand, cream, and travertine directions for softer material schemes.' },
  { name: 'Green', routeId: 'color-green', representativeSlug: 'verde-forest', description: 'Expressive green marble and granite directions for feature surfaces and selected furniture pieces.' },
];

const materialRoute: Record<string, string> = {
  Marble: 'stone-marble',
  Granite: 'stone-granite',
  Quartz: 'stone-quartz',
  Quartzite: 'stone-quartzite',
  Travertine: 'stone-travertine',
  'Engineered Marble': 'stone-engineered-marble',
};

export const ColorsView: React.FC<ColorsViewProps> = ({
  onSelectColor,
  onAddColorSample,
  currentLocale,
  onToggleCompare,
  compareIds,
  setCurrentTab,
  family,
}) => {
  const [selectedMaterial, setSelectedMaterial] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(() => window.innerWidth < 768 ? 4 : 9);
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const materials = ['All', 'Marble', 'Granite', 'Quartz', 'Quartzite', 'Travertine', 'Engineered Marble'];

  const filteredColors = colors.filter((color) => {
    const search = searchQuery.trim().toLowerCase();
    return (!family || color.colorFamily === family) &&
      (selectedMaterial === 'All' || color.material === selectedMaterial) &&
      (!search || [color.name, color.description, color.colorFamily, color.material].join(' ').toLowerCase().includes(search));
  });
  const visibleColors = filteredColors.slice(0, visibleCount);
  const hasMore = visibleCount < filteredColors.length;

  useEffect(() => {
    const updatePageSize = () => setPageSize(window.innerWidth < 768 ? 4 : 9);
    window.addEventListener('resize', updatePageSize, { passive: true });
    return () => window.removeEventListener('resize', updatePageSize);
  }, []);

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [pageSize, selectedMaterial, family, searchQuery]);

  if (!family) {
    return (
      <div className="wr-catalog-page wr-color-page wr-taxonomy-page">
        <header className="wr-catalog-hero wr-catalog-hero--centered">
          <div><span className="wr-eyebrow">{t(currentLocale, 'colorLibrary')}</span><h1>Choose a color family.</h1></div>
          <p>Start with the overall palette, then open a family to compare material type, finish, thickness, recommended use, and physical sample options.</p>
        </header>

        <section className="wr-taxonomy-grid wr-taxonomy-grid--color" aria-label="Color families">
          {familyDefinitions.map((definition) => {
            const representative = colors.find((color) => color.slug === definition.representativeSlug)!;
            const count = colors.filter((color) => color.colorFamily === definition.name).length;
            return (
              <article className="wr-taxonomy-card" key={definition.name}>
                <a href={routePath(definition.routeId)} onClick={(event) => { event.preventDefault(); setCurrentTab(definition.routeId); }}>
                  <figure className="wr-taxonomy-card__swatch"><ColorSwatchImage color={representative} /></figure>
                  <div className="wr-taxonomy-card__body">
                    <span className="wr-taxonomy-card__meta">{count} color references</span>
                    <h2>{definition.name}</h2>
                    <p>{definition.description}</p>
                    <strong>Explore {definition.name.toLowerCase()} colors<ArrowRight /></strong>
                  </div>
                </a>
              </article>
            );
          })}
        </section>

        <section className="wr-taxonomy-support" aria-labelledby="color-preview-title">
          <div className="wr-section-heading wr-section-intro">
            <span className="wr-eyebrow">Visual comparison</span>
            <h2 id="color-preview-title">Preview a selected surface in a room setting.</h2>
          </div>
          <StoneVisualizer currentLocale={currentLocale} onRequestSample={onAddColorSample} />
        </section>

        <section className="wr-photo-library wr-photo-library--materials" aria-labelledby="physical-material-title">
          <div className="wr-section-heading wr-section-intro">
            <span className="wr-eyebrow">Physical material review</span>
            <h2 id="physical-material-title">Slabs and samples from the selection process.</h2>
            <p>Physical references show natural movement, finish response, and lot variation before final sample approval.</p>
          </div>
          <PhotoReferenceRail items={photoGalleries.materialReferences} ariaLabel="Physical slab and stone sample references" aspect="square" />
        </section>
      </div>
    );
  }

  const currentFamily = familyDefinitions.find((item) => item.name === family)!;

  return (
    <div className="wr-catalog-page wr-color-page">
      <button className="wr-taxonomy-back" onClick={() => setCurrentTab('colors')}><ArrowLeft />All color families</button>
      <header className="wr-catalog-hero wr-catalog-hero--centered">
        <div><span className="wr-eyebrow">Color family</span><h1>{family}</h1></div>
        <p>{currentFamily.description} Digital textures are illustrative references and do not guarantee slab or batch appearance.</p>
      </header>

      <div className="wr-catalog-layout">
        <aside className="wr-filter-rail" aria-label="Color family and material filters">
          <div className="wr-filter-rail__heading"><span>{family} colors</span><small>Showing {Math.min(visibleCount, filteredColors.length)} of {filteredColors.length}</small></div>
          <label className="wr-search-input"><Search /><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder={t(currentLocale, 'searchPlaceholder')} /></label>
          <fieldset><legend>{t(currentLocale, 'material')}</legend>{materials.map((material) => <button key={material} className={selectedMaterial === material ? 'is-active' : ''} onClick={() => setSelectedMaterial(material)}><span>{material === 'All' ? t(currentLocale, 'all') : material}</span>{selectedMaterial === material && <Check />}</button>)}</fieldset>
          <fieldset><legend>Color families</legend>{familyDefinitions.map((item) => <button key={item.name} className={item.name === family ? 'is-active' : ''} onClick={() => setCurrentTab(item.routeId)}><span>{item.name}</span>{item.name === family && <Check />}</button>)}</fieldset>
          {!compareIds.length && <div className="wr-filter-note wr-compare-empty"><GitCompare /><strong>No comparison selected</strong><p>Select two or three colors to compare specifications and textures side by side.</p></div>}
        </aside>

        <main className="wr-swatch-grid" aria-live="polite">
          {visibleColors.map((color) => {
            const compared = compareIds.includes(`color:${color.slug}`);
            return (
              <article className="wr-swatch-card" key={color.slug}>
                <button className="wr-swatch-card__media" onClick={() => onSelectColor(color)} aria-label={`View ${color.name}`}>
                  <ColorSwatchImage color={color} />
                  <span className="wr-catalog-card__sku">{color.material}</span>
                </button>
                <div className="wr-swatch-card__body">
                  <Tag>{color.material}</Tag>
                  <small>{color.colorFamily}</small>
                  <h2>{color.name}</h2>
                  <p>{color.description}</p>
                  <dl>
                    <div><dt>Finish</dt><dd>{color.finishes.join(', ')}</dd></div>
                    <div><dt>Thickness</dt><dd>{formatMeasurement(color.thicknesses.join(', '))}</dd></div>
                    <div><dt>Use</dt><dd>{color.recommendedUses?.slice(0, 2).join(', ')}</dd></div>
                  </dl>
                  <button className="wr-text-link" onClick={() => setCurrentTab(materialRoute[color.material])}>View {color.material}<ArrowRight /></button>
                  <div className="wr-catalog-card__actions">
                    <button className="wr-button wr-button--primary" onClick={() => onAddColorSample(color)}><Package />Order sample</button>
                    <button className="wr-button wr-button--secondary" onClick={() => onToggleCompare(color)} aria-pressed={compared}><GitCompare />{compared ? 'Selected' : 'Compare'}</button>
                  </div>
                </div>
              </article>
            );
          })}
          {hasMore && <button className="wr-load-more" onClick={() => setVisibleCount((count) => count + pageSize)}><ArrowDown />Show more colors</button>}
          {!filteredColors.length && <div className="wr-empty-state"><p>No colors match these filters.</p><button className="wr-button wr-button--secondary" onClick={() => { setSelectedMaterial('All'); setSearchQuery(''); }}>Clear filters</button></div>}
        </main>
      </div>
    </div>
  );
};
