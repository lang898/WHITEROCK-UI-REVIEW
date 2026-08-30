import React, { useState } from 'react';
import { ArrowRightLeft, Check, Trash2, X } from 'lucide-react';
import { t } from '../i18n';
import type { CompareEntry, LocaleConfig } from '../types';
import { formatMeasurement } from '../utils/measurements';

interface ComparePanelProps {
  items: CompareEntry[];
  locale: LocaleConfig;
  onRemove: (id: string) => void;
  onClear: () => void;
}

function value(entry: CompareEntry, field: 'material' | 'dimensions' | 'thickness' | 'finish' | 'application'): string {
  if (entry.kind === 'product') {
    const item = entry.item;
    if (field === 'material') return item.material;
    if (field === 'dimensions') return item.specs.Size || item.specs.Sizes || item.dimensions || 'By approved drawing';
    if (field === 'thickness') return item.specs.Thickness || item.thicknesses?.join(', ') || 'Confirm by quotation';
    if (field === 'finish') return item.specs.Finish || 'Confirm by sample';
    return item.specs.Use || item.category;
  }
  const item = entry.item;
  if (field === 'material') return item.material;
  if (field === 'dimensions') return item.sizes.join(', ');
  if (field === 'thickness') return item.thicknesses.join(', ');
  if (field === 'finish') return item.finishes.join(', ');
  return item.applications?.join(', ') || 'Confirm by project';
}

function entryTitle(entry: CompareEntry): string {
  return entry.kind === 'product' ? entry.item.title : entry.item.name;
}

export const ComparePanel: React.FC<ComparePanelProps> = ({ items, locale, onRemove, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [revealPosition, setRevealPosition] = useState(50);
  if (!items.length) return null;

  const colorEntries = items.filter((entry): entry is Extract<CompareEntry, { kind: 'color' }> => entry.kind === 'color');

  const fields = [
    ['material', t(locale, 'material')],
    ['dimensions', t(locale, 'dimensions')],
    ['thickness', t(locale, 'thickness')],
    ['finish', t(locale, 'finish')],
    ['application', t(locale, 'application')]
  ] as const;

  return (
    <>
      <aside className="wr-compare-tray" aria-label="Comparison selection">
        <div><ArrowRightLeft /><strong>{t(locale, 'compare')}</strong><span>{items.length}/3</span></div>
        <div className="wr-compare-tray__items">
          {items.map((entry) => <span key={entry.id}>{entryTitle(entry)}<button onClick={() => onRemove(entry.id)} aria-label={`${t(locale, 'remove')} ${entryTitle(entry)}`}><X /></button></span>)}
        </div>
        <button className="wr-button wr-button--light" onClick={() => setIsOpen(true)} disabled={items.length < 2}>{t(locale, 'compare')}</button>
      </aside>

      {isOpen && (
        <div className="wr-modal-backdrop" role="dialog" aria-modal="true" aria-label={t(locale, 'compare')}>
          <div className="wr-compare-dialog">
            <header><div><span className="wr-eyebrow">B2B shortlist</span><h2>{t(locale, 'compare')}</h2></div><button className="wr-icon-button" onClick={() => setIsOpen(false)} aria-label="Close comparison"><X /></button></header>
            <div className="wr-compare-media-grid" style={{ '--compare-columns': items.length } as React.CSSProperties}>
              {items.map((entry) => {
                const image = entry.kind === 'color' ? entry.item.swatchImage : entry.item.image;
                return <figure key={entry.id}><img src={image} alt={`${entryTitle(entry)} comparison view`} width="900" height="700" /><figcaption>{entryTitle(entry)}{entry.kind === 'color' ? ' · illustrative digital swatch' : ''}</figcaption></figure>;
              })}
            </div>
            {colorEntries.length >= 2 && (
              <section className="wr-color-reveal" aria-label={`Drag to compare ${colorEntries[0].item.name} and ${colorEntries[1].item.name}`}>
                <div className="wr-color-reveal__stage">
                  <img src={colorEntries[0].item.swatchImage} alt={`${colorEntries[0].item.name} illustrative digital swatch`} width="1200" height="700" />
                  <div className="wr-color-reveal__overlay" style={{ width: `${revealPosition}%` }}><img src={colorEntries[1].item.swatchImage} alt={`${colorEntries[1].item.name} illustrative digital swatch`} width="1200" height="700" /></div>
                  <span className="wr-color-reveal__line" style={{ left: `${revealPosition}%` }} aria-hidden="true" />
                  <span className="wr-color-reveal__label wr-color-reveal__label--left">{colorEntries[1].item.name}</span>
                  <span className="wr-color-reveal__label wr-color-reveal__label--right">{colorEntries[0].item.name}</span>
                </div>
                <input type="range" min="5" max="95" value={revealPosition} onInput={(event) => setRevealPosition(Number(event.currentTarget.value))} aria-label="Texture comparison position" />
                <p>Digital swatches are visual planning references. Confirm color, movement, and batch range with physical samples.</p>
              </section>
            )}
            <div className="wr-compare-table" style={{ '--compare-columns': items.length } as React.CSSProperties}>
              <div className="wr-compare-table__label" />
              {items.map((entry) => <div className="wr-compare-table__head" key={entry.id}><span>{entry.kind}</span><strong>{entryTitle(entry)}</strong><small>{entry.kind === 'product' ? entry.item.sku : entry.item.colorFamily}</small></div>)}
              {fields.map(([field, label]) => (
                <React.Fragment key={field}>
                  <div className="wr-compare-table__label">{label}</div>
                  {items.map((entry) => <div key={`${entry.id}-${field}`}>{field === 'material' ? value(entry, field) : formatMeasurement(value(entry, field))}{field === 'material' && <Check aria-hidden="true" />}</div>)}
                </React.Fragment>
              ))}
            </div>
            <footer><button className="wr-button wr-button--ghost" onClick={onClear}><Trash2 /> {t(locale, 'clear')}</button><button className="wr-button wr-button--primary" onClick={() => setIsOpen(false)}>Done</button></footer>
          </div>
        </div>
      )}
    </>
  );
};
