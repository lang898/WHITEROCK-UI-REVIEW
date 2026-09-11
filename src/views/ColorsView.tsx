import React, { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, Check, Filter, GitCompare, Package, Search, X } from 'lucide-react';
import { colors, photoGalleries } from '../data';
import { t } from '../i18n';
import { routePath } from '../routes';
import { formatMeasurement } from '../utils/measurements';
import { StoneVisualizer } from '../components/StoneVisualizer';
import { ColorSwatchImage } from '../components/ColorSwatchImage';
import { Tag } from '../components/ui/Tag';
import { PhotoReferenceRail } from '../components/PhotoReferenceRail';
import { MaterialDisclaimer } from '../components/MaterialDisclaimer';
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

const familyDefinitions: Array<{ name: ColorFamily; routeId: string; representativeSlug: string; description: string }> = [
  { name: 'White', routeId: 'color-white', representativeSlug: 'calacatta-crest', description: 'Bright white through soft Carrara movement for vanity, kitchen, furniture, and coordinated interior programs.' },
  { name: 'Grey', routeId: 'color-grey', representativeSlug: 'silver-ash', description: 'Mineral grey, concrete, silver, and smoke directions for restrained residential and commercial palettes.' },
  { name: 'Black', routeId: 'color-black', representativeSlug: 'graphite-crystal', description: 'Dense dark stone directions with graphite, pearl, and veined character for strong visual contrast.' },
  { name: 'Beige', routeId: 'color-beige', representativeSlug: 'warm-ivory', description: 'Warm ivory, sand, cream, and travertine directions for softer material schemes.' },
  { name: 'Green', routeId: 'color-green', representativeSlug: 'verde-forest', description: 'Expressive green marble and granite directions for feature surfaces and selected furniture pieces.' },
];

const materialRoute: Record<string, string> = {
  Marble: 'stone-marble', Granite: 'stone-granite', Quartz: 'stone-quartz', Quartzite: 'stone-quartzite', Travertine: 'stone-travertine', 'Engineered Marble': 'stone-engineered-marble',
};

const toggleSetValue = (set: Set<string>, value: string) => {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
};

export const ColorsView: React.FC<ColorsViewProps> = ({
  onSelectColor, onAddColorSample, currentLocale, onToggleCompare, compareIds, setCurrentTab, family,
}) => {
  const [selectedMaterials, setSelectedMaterials] = useState<Set<string>>(new Set());
  const [selectedFamilies, setSelectedFamilies] = useState<Set<string>>(() => new Set(family ? [family] : []));
  const [selectedFinishes, setSelectedFinishes] = useState<Set<string>>(new Set());
  const [selectedThicknesses, setSelectedThicknesses] = useState<Set<string>>(new Set());
  const [selectedUses, setSelectedUses] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(() => window.innerWidth < 768 ? 4 : 9);
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [previewColor, setPreviewColor] = useState<ColorItem | null>(null);

  const materials = useMemo(() => Array.from(new Set(colors.map((color) => color.material))).sort(), []);
  const finishes = useMemo(() => Array.from(new Set(colors.flatMap((color) => color.finishes))).sort(), []);
  const thicknesses = useMemo(() => Array.from(new Set(colors.flatMap((color) => color.thicknesses))).sort(), []);
  const uses = useMemo(() => Array.from(new Set(colors.flatMap((color) => color.recommendedUses || []))).sort(), []);

  useEffect(() => {
    setSelectedFamilies(new Set(family ? [family] : []));
  }, [family]);

  const filteredColors = colors.filter((color) => {
    const search = searchQuery.trim().toLowerCase();
    const materialMatch = !selectedMaterials.size || selectedMaterials.has(color.material);
    const familyMatch = !selectedFamilies.size || selectedFamilies.has(color.colorFamily);
    const finishMatch = !selectedFinishes.size || Array.from(selectedFinishes).some((finish) => color.finishes.includes(finish));
    const thicknessMatch = !selectedThicknesses.size || Array.from(selectedThicknesses).some((thickness) => color.thicknesses.includes(thickness));
    const useMatch = !selectedUses.size || Array.from(selectedUses).some((use) => color.recommendedUses?.includes(use));
    const searchMatch = !search || [color.name, color.description, color.colorFamily, color.material, ...color.finishes, ...(color.recommendedUses || [])].join(' ').toLowerCase().includes(search);
    return materialMatch && familyMatch && finishMatch && thicknessMatch && useMatch && searchMatch;
  });
  const visibleColors = filteredColors.slice(0, visibleCount);
  const hasMore = visibleCount < filteredColors.length;
  const defaultFamilyCount = family && selectedFamilies.has(family) ? 1 : 0;
  const activeFilterCount = selectedMaterials.size + Math.max(0, selectedFamilies.size - defaultFamilyCount) + selectedFinishes.size + selectedThicknesses.size + selectedUses.size;

  useEffect(() => {
    const updatePageSize = () => setPageSize(window.innerWidth < 768 ? 4 : 9);
    window.addEventListener('resize', updatePageSize, { passive: true });
    return () => window.removeEventListener('resize', updatePageSize);
  }, []);

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [pageSize, selectedMaterials, selectedFamilies, selectedFinishes, selectedThicknesses, selectedUses, searchQuery]);

  useEffect(() => {
    if (!previewColor || !filteredColors.some((color) => color.slug === previewColor.slug)) setPreviewColor(filteredColors[0] || null);
  }, [filteredColors, previewColor]);

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
            return <article className="wr-taxonomy-card" key={definition.name}><a href={routePath(definition.routeId)} onClick={(event) => { event.preventDefault(); setCurrentTab(definition.routeId); }}><figure className="wr-taxonomy-card__swatch"><ColorSwatchImage color={representative} /></figure><div className="wr-taxonomy-card__body"><span className="wr-taxonomy-card__meta">{count} color references</span><h2>{definition.name}</h2><p>{definition.description}</p><strong>Explore {definition.name.toLowerCase()} colors<ArrowRight /></strong></div></a></article>;
          })}
        </section>
        <section className="wr-taxonomy-support" aria-labelledby="color-preview-title">
          <div className="wr-section-heading wr-section-intro"><span className="wr-eyebrow">Visual comparison</span><h2 id="color-preview-title">Preview a selected surface in a room setting.</h2></div>
          <StoneVisualizer currentLocale={currentLocale} onRequestSample={onAddColorSample} />
        </section>
        <section className="wr-photo-library wr-photo-library--materials" aria-labelledby="physical-material-title">
          <div className="wr-section-heading wr-section-intro"><span className="wr-eyebrow">Physical material review</span><h2 id="physical-material-title">Slabs and samples from the selection process.</h2><p>Physical references show natural movement, finish response, and lot variation before final sample approval.</p></div>
          <PhotoReferenceRail items={photoGalleries.materialReferences} ariaLabel="Physical slab and stone sample references" aspect="square" />
        </section>
      </div>
    );
  }

  const currentFamily = familyDefinitions.find((item) => item.name === family)!;
  const clearFilters = () => {
    setSelectedMaterials(new Set());
    setSelectedFamilies(new Set(family ? [family] : []));
    setSelectedFinishes(new Set());
    setSelectedThicknesses(new Set());
    setSelectedUses(new Set());
    setSearchQuery('');
  };

  const activeChips = [
    ...Array.from(selectedMaterials).map((value) => ({ group: 'Material', value, remove: () => setSelectedMaterials((current) => toggleSetValue(current, value)) })),
    ...Array.from(selectedFamilies).filter((value) => value !== family).map((value) => ({ group: 'Color', value, remove: () => setSelectedFamilies((current) => toggleSetValue(current, value)) })),
    ...Array.from(selectedFinishes).map((value) => ({ group: 'Finish', value, remove: () => setSelectedFinishes((current) => toggleSetValue(current, value)) })),
    ...Array.from(selectedThicknesses).map((value) => ({ group: 'Thickness', value, remove: () => setSelectedThicknesses((current) => toggleSetValue(current, value)) })),
    ...Array.from(selectedUses).map((value) => ({ group: 'Use', value, remove: () => setSelectedUses((current) => toggleSetValue(current, value)) })),
  ];

  const filterGroup = (title: string, values: string[], selected: Set<string>, setter: React.Dispatch<React.SetStateAction<Set<string>>>) => (
    <fieldset><legend>{title}</legend>{values.map((value) => <button type="button" key={value} className={selected.has(value) ? 'is-active' : ''} onClick={() => setter((current) => toggleSetValue(current, value))}><span>{value}</span>{selected.has(value) && <Check />}</button>)}</fieldset>
  );

  return (
    <div className="wr-catalog-page wr-color-page">
      <button className="wr-taxonomy-back" onClick={() => setCurrentTab('colors')}><ArrowLeft />All color families</button>
      <header className="wr-catalog-hero wr-catalog-hero--centered">
        <div><span className="wr-eyebrow">Color family</span><h1>{family}</h1></div>
        <p>{currentFamily.description}</p>
        <MaterialDisclaimer type="digital-image" compact />
      </header>

      <div className="wr-mobile-filter-toolbar">
        <button className="wr-button wr-button--secondary" type="button" onClick={() => setFiltersOpen(true)}><Filter />Filters{activeFilterCount ? ` (${activeFilterCount})` : ''}</button>
        <span>{filteredColors.length} results · {activeFilterCount} filters</span>
      </div>
      {activeChips.length > 0 && <div className="wr-active-filter-chips" aria-label="Active filters">{activeChips.map((chip) => <button type="button" key={`${chip.group}-${chip.value}`} onClick={chip.remove}>{chip.group}: {chip.value}<X /></button>)}<button type="button" onClick={clearFilters}>Clear all</button></div>}

      <div className="wr-catalog-layout">
        <aside className={`wr-filter-rail wr-filter-sheet${filtersOpen ? ' is-open' : ''}`} aria-label="Color filters">
          <div className="wr-filter-sheet__mobile-header"><strong>Filters</strong><button className="wr-icon-button" onClick={() => setFiltersOpen(false)} aria-label="Close filters"><X /></button></div>
          <div className="wr-filter-rail__heading"><span>{family} colors</span><small>{filteredColors.length} results · {activeFilterCount} filters</small></div>
          <label className="wr-search-input"><Search /><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder={t(currentLocale, 'searchPlaceholder')} /></label>
          {filterGroup('Material', materials, selectedMaterials, setSelectedMaterials)}
          {filterGroup('Color family', familyDefinitions.map((item) => item.name), selectedFamilies, setSelectedFamilies)}
          {filterGroup('Finish', finishes, selectedFinishes, setSelectedFinishes)}
          {filterGroup('Thickness', thicknesses, selectedThicknesses, setSelectedThicknesses)}
          {filterGroup('Recommended use', uses, selectedUses, setSelectedUses)}
          <button className="wr-button wr-button--ghost" type="button" onClick={clearFilters}>Clear filters</button>
          <button className="wr-button wr-button--primary wr-filter-sheet__apply" type="button" onClick={() => setFiltersOpen(false)}>Show {filteredColors.length} results</button>
          {!compareIds.length && <div className="wr-filter-note wr-compare-empty"><GitCompare /><strong>No comparison selected</strong><p>Select two or three colors to compare specifications and textures side by side.</p></div>}
        </aside>

        <div className="wr-color-results">
          {previewColor && <aside className="wr-color-hover-preview" aria-live="polite"><div><span className="wr-eyebrow">Live material preview</span><h2>{previewColor.name}</h2><p>{previewColor.material} · {previewColor.finishes.slice(0, 2).join(' · ')}</p></div><ColorSwatchImage color={previewColor} width={900} height={520} /></aside>}
          <main className="wr-swatch-grid" aria-live="polite">
            {visibleColors.map((color) => {
              const compared = compareIds.includes(`color:${color.slug}`);
              return (
                <article className="wr-swatch-card" key={color.slug} onMouseEnter={() => setPreviewColor(color)} onFocus={() => setPreviewColor(color)}>
                  <button className="wr-swatch-card__media" onClick={() => onSelectColor(color)} aria-label={`View ${color.name}`}><ColorSwatchImage color={color} /><span className="wr-catalog-card__sku">{color.material}</span></button>
                  <div className="wr-swatch-card__body">
                    <Tag>{color.material}</Tag><small>{color.colorFamily}</small><h2>{color.name}</h2>
                    <dl><div><dt>Finish</dt><dd>{color.finishes.slice(0, 2).join(', ')}</dd></div><div><dt>Thickness</dt><dd>{formatMeasurement(color.thicknesses.join(', '))}</dd></div></dl>
                    <button className="wr-text-link" onClick={() => setCurrentTab(materialRoute[color.material])}>View {color.material}<ArrowRight /></button>
                    <div className="wr-catalog-card__actions"><button className="wr-button wr-button--primary" onClick={() => onAddColorSample(color)}><Package />Order sample</button><button className="wr-button wr-button--secondary" onClick={() => onToggleCompare(color)} aria-pressed={compared}><GitCompare />{compared ? 'Selected' : 'Compare'}</button></div>
                  </div>
                </article>
              );
            })}
            {hasMore && <button className="wr-load-more" onClick={() => setVisibleCount((count) => count + pageSize)}><ArrowDown />Show more colors</button>}
            {!filteredColors.length && <div className="wr-empty-state"><p>No colors match these filters.</p><button className="wr-button wr-button--secondary" onClick={clearFilters}>Clear filters</button></div>}
          </main>
        </div>
      </div>
    </div>
  );
};
