import React from 'react';
import { ArrowRight, Droplets, Gauge, Package, ShieldCheck } from 'lucide-react';
import { colors, stoneTypes } from '../data';
import type { ColorItem, LocaleConfig, StoneTypeInfo } from '../types';

interface StoneTypeViewProps {
  stoneTypeId: StoneTypeInfo['id'];
  currentLocale: LocaleConfig;
  onSelectColor: (color: ColorItem) => void;
  onAddColorSample: (color: ColorItem) => void;
  setCurrentTab: (tab: string) => void;
}

export const StoneTypeView: React.FC<StoneTypeViewProps> = ({
  stoneTypeId,
  onSelectColor,
  onAddColorSample,
  setCurrentTab
}) => {
  const stoneType = stoneTypes.find((item) => item.id === stoneTypeId) || stoneTypes[0];
  const materialColors = colors.filter((color) => color.material === stoneType.name);

  return (
    <div className="wr-stone-type-page">
      <header className="wr-stone-type-hero">
        <figure>
          <img src={stoneType.image} alt={stoneType.imageAlt} width="1600" height="1100" loading="eager" fetchPriority="high" />
          <figcaption>{stoneType.imageCaption}</figcaption>
        </figure>
        <div>
          <span className="wr-eyebrow">{stoneType.eyebrow}</span>
          <h1>{stoneType.name}</h1>
          <h2>{stoneType.headline}</h2>
          <p>{stoneType.summary}</p>
          <button className="wr-button wr-button--primary" onClick={() => setCurrentTab('samples')}><Package />Build a sample box</button>
        </div>
      </header>

      <section className="wr-stone-type-specs" aria-label={`${stoneType.name} technical reference`}>
        <article><Gauge /><span>Hardness reference</span><p>{stoneType.hardness}</p></article>
        <article><Droplets /><span>Water absorption</span><p>{stoneType.absorption}</p></article>
        <article><ShieldCheck /><span>Maintenance</span><p>{stoneType.maintenance}</p></article>
      </section>

      <section className="wr-stone-type-colors wr-section-band wr-section-band--mist" aria-labelledby="stone-type-colors-title">
        <div className="wr-section-heading wr-section-intro">
          <span className="wr-eyebrow">Published color directions</span>
          <h2 id="stone-type-colors-title">{stoneType.name} colors from the current library.</h2>
          <p>This list is generated directly from <code>colors.json</code>. Digital swatches remain illustrative until replaced with owner-approved slab photography.</p>
        </div>

        {materialColors.length > 0 ? (
          <div className="wr-stone-type-color-grid">
            {materialColors.map((color) => (
              <article className="wr-swatch-card" key={color.slug}>
                <button className="wr-swatch-card__media" onClick={() => onSelectColor(color)} aria-label={`View ${color.name}`}>
                  <img src={color.swatchImage} alt={`${color.name} illustrative digital swatch`} width="800" height="800" loading="lazy" />
                  <span className="wr-media-disclosure">Illustrative digital swatch · confirm by sample</span>
                </button>
                <div className="wr-swatch-card__body">
                  <small>{color.colorFamily} · {color.finishes.join(', ')}</small>
                  <h3>{color.name}</h3>
                  <p>{color.description}</p>
                  <button className="wr-button wr-button--primary" onClick={() => onAddColorSample(color)}><Package />Order sample</button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="wr-stone-type-empty">
            <span>No named {stoneType.name} swatches are currently published.</span>
            <p>Material photography, names, availability, and test documents will be added only after owner approval.</p>
            <button className="wr-button wr-button--secondary" onClick={() => setCurrentTab('contact')}>Discuss a material requirement<ArrowRight /></button>
          </div>
        )}
      </section>

      <section className="wr-stone-type-applications wr-section-band" aria-labelledby="stone-type-application-title">
        <div className="wr-section-heading wr-section-intro">
          <span className="wr-eyebrow">Typical application review</span>
          <h2 id="stone-type-application-title">Where {stoneType.name.toLowerCase()} is commonly considered.</h2>
          <p>{stoneType.caveat}</p>
        </div>
        <div>{stoneType.applications.map((application) => <span key={application}>{application}</span>)}</div>
        <div className="wr-section-action"><button className="wr-button wr-button--secondary" onClick={() => setCurrentTab('applications')}>View application directions<ArrowRight /></button></div>
      </section>
    </div>
  );
};
