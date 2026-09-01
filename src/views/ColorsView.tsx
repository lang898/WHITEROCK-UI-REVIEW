import React, { useEffect, useState } from 'react';
import { ArrowDown, ArrowRight, Check, GitCompare, Package, Search } from 'lucide-react';
import { colors } from '../data';
import { t } from '../i18n';
import { formatMeasurement } from '../utils/measurements';
import { StoneVisualizer } from '../components/StoneVisualizer';
import { Tag } from '../components/ui/Tag';
import type { ColorItem, LocaleConfig } from '../types';

interface ColorsViewProps {
  onSelectColor: (color: ColorItem) => void;
  onAddColorSample: (color: ColorItem) => void;
  currentLocale: LocaleConfig;
  onToggleCompare: (color: ColorItem) => void;
  compareIds: string[];
  setCurrentTab: (tab: string) => void;
}

export const ColorsView: React.FC<ColorsViewProps> = ({
  onSelectColor, onAddColorSample, currentLocale, onToggleCompare, compareIds, setCurrentTab
}) => {
  const [selectedMaterial, setSelectedMaterial] = useState('All');
  const [selectedFamily, setSelectedFamily] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(() => window.innerWidth < 768 ? 4 : 9);
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const materials = ['All', 'Marble', 'Granite', 'Quartz', 'Quartzite', 'Travertine', 'Engineered Marble'];
  const families = ['All', 'White', 'Grey', 'Black', 'Beige', 'Green'];
  const materialRoute: Record<string, string> = {
    Marble: 'stone-marble', Granite: 'stone-granite', Quartz: 'stone-quartz', Quartzite: 'stone-quartzite', Travertine: 'stone-travertine', 'Engineered Marble': 'stone-engineered-marble'
  };

  const filteredColors = colors.filter((color) => {
    const search = searchQuery.trim().toLowerCase();
    return (selectedMaterial === 'All' || color.material === selectedMaterial) &&
      (selectedFamily === 'All' || color.colorFamily === selectedFamily) &&
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
  }, [pageSize, selectedMaterial, selectedFamily, searchQuery]);

  return (
    <div className="wr-catalog-page wr-color-page">
      <header className="wr-catalog-hero wr-catalog-hero--color wr-catalog-hero--centered">
        <div><span className="wr-eyebrow">{t(currentLocale, 'colorLibrary')}</span><h1>Color is the first decision. A physical sample is the final one.</h1></div>
        <p>{t(currentLocale, 'colorIntro')} Digital textures are illustrative references and do not guarantee slab or batch appearance.</p>
      </header>

      <StoneVisualizer currentLocale={currentLocale} onRequestSample={onAddColorSample} />

      <div className="wr-catalog-layout">
        <aside className="wr-filter-rail" aria-label="Color filters">
          <div className="wr-filter-rail__heading"><span>Filter colors</span><small>Showing {Math.min(visibleCount, filteredColors.length)} of {filteredColors.length}</small></div>
          <label className="wr-search-input"><Search /><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder={t(currentLocale, 'searchPlaceholder')} /></label>
          <fieldset><legend>{t(currentLocale, 'material')}</legend>{materials.map((material) => <button key={material} className={selectedMaterial === material ? 'is-active' : ''} onClick={() => setSelectedMaterial(material)}><span>{material === 'All' ? t(currentLocale, 'all') : material}</span>{selectedMaterial === material && <Check />}</button>)}</fieldset>
          <fieldset><legend>Color family</legend>{families.map((family) => <button key={family} className={selectedFamily === family ? 'is-active' : ''} onClick={() => setSelectedFamily(family)}><span>{family === 'All' ? t(currentLocale, 'all') : family}</span>{selectedFamily === family && <Check />}</button>)}</fieldset>
          {!compareIds.length && <div className="wr-filter-note wr-compare-empty"><GitCompare /><strong>No comparison selected</strong><p>Select two or three colors to compare material, finish, and thickness.</p></div>}
        </aside>

        <main className="wr-swatch-grid" aria-live="polite">
          {visibleColors.map((color) => {
            const compared = compareIds.includes(`color:${color.slug}`);
            return (
              <article className="wr-swatch-card" key={color.slug}>
                <button className="wr-swatch-card__media" onClick={() => onSelectColor(color)} aria-label={`View ${color.name}`}>
                  <img src={color.swatchImage} alt={`${color.name} ${color.material} surface texture`} width="800" height="800" loading="lazy" />
                  <span className="wr-swatch-card__overlay"><strong>{color.material}</strong><small>{color.finishes.slice(0, 2).join(' · ')}</small></span>
                  <span className="wr-media-disclosure">{color.imageType === 'render' ? 'Illustrative digital swatch' : 'Material reference photograph'}</span>
                </button>
                <div className="wr-swatch-card__body">
                  <Tag>{color.material}</Tag><small>{color.colorFamily}</small><h2>{color.name}</h2><p>{color.description}</p>
                  <div className="wr-swatch-card__tags">{color.suitability?.slice(0, 2).map((item) => <span key={item}>{item}</span>)}</div>
                  <dl><div><dt>{t(currentLocale, 'finish')}</dt><dd>{color.finishes.join(', ')}</dd></div><div><dt>{t(currentLocale, 'thickness')}</dt><dd>{formatMeasurement(color.thicknesses.join(', '))}</dd></div><div><dt>Suitability</dt><dd>{color.suitability?.join(', ')}</dd></div><div><dt>Maintenance</dt><dd>{color.maintenanceLevel}</dd></div></dl>
                  <button className="wr-swatch-card__stone-link" onClick={() => setCurrentTab(materialRoute[color.material])}>View all {color.material.toLowerCase()} colors<ArrowRight /></button>
                  <div className="wr-catalog-card__actions"><button className="wr-button wr-button--primary" onClick={() => onAddColorSample(color)}><Package />Order sample</button><button className={`wr-button wr-button--ghost ${compared ? 'is-active' : ''}`} onClick={() => onToggleCompare(color)}><GitCompare />{compared ? t(currentLocale, 'compared') : t(currentLocale, 'compare')}</button></div>
                </div>
              </article>
            );
          })}
          {hasMore && <div className="wr-color-load-more">
            <p>Showing {visibleColors.length} of {filteredColors.length} colors</p>
            <button className="wr-button wr-button--secondary" onClick={() => setVisibleCount((count) => Math.min(count + pageSize, filteredColors.length))}>Load more colors<ArrowDown /></button>
          </div>}
          {!filteredColors.length && <div className="wr-empty-state"><h2>{t(currentLocale, 'noResults')}</h2><button className="wr-button wr-button--secondary" onClick={() => { setSelectedMaterial('All'); setSelectedFamily('All'); setSearchQuery(''); }}>{t(currentLocale, 'clear')}</button></div>}
        </main>
      </div>
    </div>
  );
};
