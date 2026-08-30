import React, { useState } from 'react';
import { Check, GitCompare, Package, Search } from 'lucide-react';
import { colors } from '../data';
import { t } from '../i18n';
import { formatMeasurement } from '../utils/measurements';
import { StoneVisualizer } from '../components/StoneVisualizer';
import type { ColorItem, LocaleConfig } from '../types';

interface ColorsViewProps {
  onSelectColor: (color: ColorItem) => void;
  onAddColorSample: (color: ColorItem) => void;
  currentLocale: LocaleConfig;
  onToggleCompare: (color: ColorItem) => void;
  compareIds: string[];
}

export const ColorsView: React.FC<ColorsViewProps> = ({
  onSelectColor, onAddColorSample, currentLocale, onToggleCompare, compareIds
}) => {
  const [selectedMaterial, setSelectedMaterial] = useState('All');
  const [selectedFamily, setSelectedFamily] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const materials = ['All', 'Marble', 'Granite', 'Quartz', 'Quartzite', 'Travertine', 'Engineered Marble'];
  const families = ['All', 'White', 'Grey', 'Black', 'Beige', 'Green'];

  const filteredColors = colors.filter((color) => {
    const search = searchQuery.trim().toLowerCase();
    return (selectedMaterial === 'All' || color.material === selectedMaterial) &&
      (selectedFamily === 'All' || color.colorFamily === selectedFamily) &&
      (!search || [color.name, color.description, color.colorFamily, color.material].join(' ').toLowerCase().includes(search));
  });

  return (
    <div className="wr-catalog-page wr-color-page">
      <header className="wr-catalog-hero wr-catalog-hero--color wr-catalog-hero--centered">
        <div><span className="wr-eyebrow">{t(currentLocale, 'colorLibrary')}</span><h1>Color is the first decision. A physical sample is the final one.</h1></div>
        <p>{t(currentLocale, 'colorIntro')} Digital textures are illustrative references and do not guarantee slab or batch appearance.</p>
      </header>

      <StoneVisualizer currentLocale={currentLocale} onRequestSample={onAddColorSample} />

      <div className="wr-catalog-layout">
        <aside className="wr-filter-rail" aria-label="Color filters">
          <div className="wr-filter-rail__heading"><span>Filter colors</span><small>{filteredColors.length} results</small></div>
          <label className="wr-search-input"><Search /><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder={t(currentLocale, 'searchPlaceholder')} /></label>
          <fieldset><legend>{t(currentLocale, 'material')}</legend>{materials.map((material) => <button key={material} className={selectedMaterial === material ? 'is-active' : ''} onClick={() => setSelectedMaterial(material)}><span>{material === 'All' ? t(currentLocale, 'all') : material}</span>{selectedMaterial === material && <Check />}</button>)}</fieldset>
          <fieldset><legend>Color family</legend>{families.map((family) => <button key={family} className={selectedFamily === family ? 'is-active' : ''} onClick={() => setSelectedFamily(family)}><span>{family === 'All' ? t(currentLocale, 'all') : family}</span>{selectedFamily === family && <Check />}</button>)}</fieldset>
          {!compareIds.length && <div className="wr-filter-note wr-compare-empty"><GitCompare /><strong>No comparison selected</strong><p>Select two or three colors to compare material, finish, and thickness.</p></div>}
        </aside>

        <main className="wr-swatch-grid" aria-live="polite">
          {filteredColors.map((color) => {
            const compared = compareIds.includes(`color:${color.slug}`);
            return (
              <article className="wr-swatch-card" key={color.slug}>
                <button className="wr-swatch-card__media" onClick={() => onSelectColor(color)} aria-label={`View ${color.name}`}>
                  <img src={color.swatchImage} alt={`${color.name} illustrative digital swatch`} width="800" height="800" loading="lazy" />
                  <span className="wr-media-disclosure">Illustrative digital swatch · confirm by sample</span>
                </button>
                <div className="wr-swatch-card__body">
                  <small>{color.material} · {color.colorFamily}</small><h2>{color.name}</h2><p>{color.description}</p>
                  <dl><div><dt>{t(currentLocale, 'finish')}</dt><dd>{color.finishes.join(', ')}</dd></div><div><dt>{t(currentLocale, 'thickness')}</dt><dd>{formatMeasurement(color.thicknesses.join(', '))}</dd></div><div><dt>Suitability</dt><dd>{color.suitability?.join(', ')}</dd></div><div><dt>Maintenance</dt><dd>{color.maintenanceLevel}</dd></div></dl>
                  <div className="wr-catalog-card__actions"><button className="wr-button wr-button--primary" onClick={() => onAddColorSample(color)}><Package />Order sample</button><button className={`wr-button wr-button--ghost ${compared ? 'is-active' : ''}`} onClick={() => onToggleCompare(color)}><GitCompare />{compared ? t(currentLocale, 'compared') : t(currentLocale, 'compare')}</button></div>
                </div>
              </article>
            );
          })}
          {!filteredColors.length && <div className="wr-empty-state"><h2>{t(currentLocale, 'noResults')}</h2><button className="wr-button wr-button--secondary" onClick={() => { setSelectedMaterial('All'); setSelectedFamily('All'); setSearchQuery(''); }}>{t(currentLocale, 'clear')}</button></div>}
        </main>
      </div>
    </div>
  );
};
