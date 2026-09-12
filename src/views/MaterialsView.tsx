import React from 'react';
import { ArrowRight, Grid3X3, Layers3, Sparkles } from 'lucide-react';
import { colors, stoneTypes } from '../data';
import { LandingHero } from '../components/LandingHero';
import { applicationNavigation, colorNavigation, routePath } from '../routes';
import { openRfqBuilder } from '../lib/uiEvents';

interface MaterialsViewProps {
  setCurrentTab: (tab: string) => void;
}

const applicationImages: Record<string, string> = {
  'application-kitchen': '/assets/applications/modern-kitchen-inspiration.jpg',
  'application-bathroom': '/assets/applications/master-bath-inspiration.jpg',
  'application-furniture': '/assets/owner/countertops/oval-travertine-coffee-top.jpg',
  'application-commercial': '/assets/applications/restaurant-counter-inspiration.jpg',
};

export const MaterialsView: React.FC<MaterialsViewProps> = ({ setCurrentTab }) => {
  const heroStone = stoneTypes[0];
  return (
    <div className="wr-catalog-page wr-taxonomy-page">
      <LandingHero eyebrow="Material library" title="Start with the stone. Then narrow the surface." description="Compare six material families, browse by color, or begin with the application before building a physical sample shortlist." image={heroStone.image} imageWebp={heroStone.imageWebp} imageAlt={heroStone.imageAlt} />

      <section className="wr-section-band" aria-labelledby="materials-stone-title">
        <div className="wr-section-heading wr-section-intro"><span className="wr-eyebrow">Stone type</span><h2 id="materials-stone-title">Six material families.</h2><p>Open a material to review properties, technical references, colors, finishes, care guidance, and applications.</p></div>
        <div className="wr-taxonomy-grid wr-taxonomy-grid--three" aria-label="Stone material types">
          {stoneTypes.map((stoneType) => {
            const routeId = `stone-${stoneType.id}`;
            const colorCount = colors.filter((color) => color.material === stoneType.name).length;
            return (
              <article className="wr-taxonomy-card" key={stoneType.id}>
                <a href={routePath(routeId)} onClick={(event) => { event.preventDefault(); setCurrentTab(routeId); }}>
                  <figure><picture>{stoneType.imageWebp && <source srcSet={stoneType.imageWebp} type="image/webp" />}<img src={stoneType.image} alt={stoneType.imageAlt} width="1600" height="1200" loading="lazy" /></picture></figure>
                  <div className="wr-taxonomy-card__body"><span className="wr-taxonomy-card__meta"><Layers3 />{colorCount} color references</span><h2>{stoneType.name}</h2><p>{stoneType.summary}</p><strong>Review material<ArrowRight /></strong></div>
                </a>
              </article>
            );
          })}
        </div>
      </section>

      <section className="wr-material-entry-band wr-section-band wr-section-band--mist" aria-labelledby="materials-color-title">
        <div className="wr-section-heading wr-section-intro"><span className="wr-eyebrow">By color</span><h2 id="materials-color-title">Move from palette to physical sample.</h2></div>
        <div className="wr-color-family-entry-grid">
          {colorNavigation.map((item) => {
            const family = item.label as typeof colors[number]['colorFamily'];
            const sample = colors.find((color) => color.colorFamily === family);
            return <a key={item.id} href={routePath(item.id)} onClick={(event) => { event.preventDefault(); setCurrentTab(item.id); }}><figure>{sample && <img src={sample.swatchWebp || sample.swatchImage} alt={`${item.label} stone color direction`} width="700" height="700" loading="lazy" />}</figure><span>{item.label}</span><ArrowRight /></a>;
          })}
          <a className="wr-color-family-entry-grid__all" href={routePath('colors')} onClick={(event) => { event.preventDefault(); setCurrentTab('colors'); }}><Grid3X3 /><span>View all colors</span><ArrowRight /></a>
        </div>
      </section>

      <section className="wr-section-band" aria-labelledby="materials-application-title">
        <div className="wr-section-heading wr-section-intro"><span className="wr-eyebrow">By application</span><h2 id="materials-application-title">Choose by where the stone is going.</h2></div>
        <div className="wr-application-entry-grid">
          {applicationNavigation.map((item) => <a key={item.id} href={routePath(item.id)} onClick={(event) => { event.preventDefault(); setCurrentTab(item.id); }}><figure><img src={applicationImages[item.id]} alt={`${item.label} stone application`} width="1200" height="800" loading="lazy" /></figure><div><span className="wr-eyebrow">Application</span><h3>{item.label}</h3><strong>See suitable materials<ArrowRight /></strong></div></a>)}
        </div>
      </section>

      <section className="wr-page-cta"><div><Sparkles /><span className="wr-eyebrow">Specify the surface</span><h2>Need a physical sample or a drawing-based quote?</h2><p>Shortlist the material first, then carry the selection into samples or RFQ.</p></div><div><button className="wr-button wr-button--secondary" onClick={() => setCurrentTab('samples')}>Build Sample Box</button><button className="wr-button wr-button--primary" onClick={openRfqBuilder}>Start RFQ</button></div></section>
    </div>
  );
};
