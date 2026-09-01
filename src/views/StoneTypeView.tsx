import React from 'react';
import { ArrowRight, Droplets, Gauge, Package, Ruler, Scale, ShieldCheck } from 'lucide-react';
import { colors, stoneTypes } from '../data';
import { Tag } from '../components/ui/Tag';
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
          <picture>
            {stoneType.imageWebp && <source srcSet={stoneType.imageWebp} type="image/webp" />}
            <img src={stoneType.image} alt={stoneType.imageAlt} width="1600" height="1100" loading="eager" fetchPriority="high" />
          </picture>
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
        <article><Gauge /><span>Mohs hardness</span><p>{stoneType.hardness}</p></article>
        <article><Droplets /><span>Water absorption</span><p>{stoneType.absorption}</p></article>
        <article><Scale /><span>Density</span><p>{stoneType.density}</p></article>
        <article><Ruler /><span>Flexural strength</span><p>{stoneType.flexuralStrength}</p></article>
      </section>
      <p className="wr-stone-type-note">Typical values. Batch-specific test reports are confirmed per order.</p>

      <section className="wr-stone-type-colors wr-section-band wr-section-band--mist" aria-labelledby="stone-type-colors-title">
        <div className="wr-section-heading wr-section-intro">
          <span className="wr-eyebrow">Surface directions</span>
          <h2 id="stone-type-colors-title">Explore {stoneType.name.toLowerCase()} colors.</h2>
          <p>Use the digital library to create a shortlist, then review the physical sample and available production lot before approval.</p>
        </div>

        {materialColors.length > 0 ? (
          <div className="wr-stone-type-color-grid">
            {materialColors.map((color) => (
              <article className="wr-swatch-card" key={color.slug}>
                <button className="wr-swatch-card__media" onClick={() => onSelectColor(color)} aria-label={`View ${color.name}`}>
                  <img src={color.swatchImage} alt={`${color.name} ${color.material} surface texture`} width="800" height="800" loading="lazy" />
                  <span className="wr-swatch-card__overlay"><strong>{color.material}</strong><small>{color.finishes.slice(0, 2).join(' · ')}</small></span>
                  <span className="wr-media-disclosure">{color.imageType === 'render' ? 'Illustrative digital swatch' : 'Material reference photograph'}</span>
                </button>
                <div className="wr-swatch-card__body">
                  <Tag>{color.material}</Tag>
                  <small>{color.colorFamily} · {color.finishes.join(', ')}</small>
                  <h3>{color.name}</h3>
                  <p>{color.description}</p>
                  <button className="wr-swatch-card__stone-link" onClick={() => setCurrentTab(`stone-${stoneType.id}`)}>View all {stoneType.name.toLowerCase()} colors<ArrowRight /></button>
                  <button className="wr-button wr-button--primary" onClick={() => onAddColorSample(color)}><Package />Order sample</button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="wr-stone-type-empty">
            <span>Ask for the current {stoneType.name.toLowerCase()} selection.</span>
            <p>We will review available materials, finish, thickness, format, and supporting technical information for your project.</p>
            <button className="wr-button wr-button--secondary" onClick={() => setCurrentTab('contact')}>Discuss a material requirement<ArrowRight /></button>
          </div>
        )}
      </section>

      {stoneType.gallery && stoneType.gallery.length > 1 && (
        <section className="wr-stone-type-gallery wr-section-band wr-section-band--mist" aria-labelledby="stone-type-gallery-title">
          <div className="wr-section-heading wr-section-intro">
            <span className="wr-eyebrow">Application references</span>
            <h2 id="stone-type-gallery-title">Review scale, movement, and setting.</h2>
            <p>These references support early material conversations. The selected stone, finish, construction, and exposure are assessed for the project.</p>
          </div>
          <div className="wr-stone-type-gallery__grid">
            {stoneType.gallery.map((item) => (
              <figure key={`${stoneType.id}-${item.image}`}>
                <picture>
                  {item.imageWebp && <source srcSet={item.imageWebp} type="image/webp" />}
                  <img src={item.image} alt={item.alt} width="1280" height="960" loading="lazy" />
                </picture>
                <figcaption>{item.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className="wr-stone-type-applications wr-section-band" aria-labelledby="stone-type-application-title">
        <div className="wr-stone-type-application-layout">
          <figure><picture>{stoneType.applicationImageWebp && <source srcSet={stoneType.applicationImageWebp} type="image/webp" />}<img src={stoneType.applicationImage.startsWith('/') ? stoneType.applicationImage : `/${stoneType.applicationImage}`} alt={stoneType.applicationAlt} width="1600" height="1100" loading="lazy" /></picture><figcaption>{stoneType.applicationCaption}</figcaption></figure>
          <div>
            <span className="wr-eyebrow">Application and care</span>
            <h2 id="stone-type-application-title">Where {stoneType.name.toLowerCase()} is commonly considered.</h2>
            <p>{stoneType.caveat}</p>
            <h3>Suitability</h3>
            <div className="wr-stone-type-tags">{stoneType.suitability.map((item) => <span key={item}>{item}</span>)}</div>
            <h3>Maintenance</h3>
            <p>{stoneType.maintenance}</p>
          </div>
        </div>
        <div className="wr-stone-type-use-grid">{stoneType.applications.map((application) => <span key={application}><ShieldCheck />{application}</span>)}</div>
        <div className="wr-section-action"><button className="wr-button wr-button--secondary" onClick={() => setCurrentTab('applications')}>View application directions<ArrowRight /></button></div>
      </section>
    </div>
  );
};
