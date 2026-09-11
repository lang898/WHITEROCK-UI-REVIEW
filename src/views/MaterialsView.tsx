import React from 'react';
import { ArrowRight, Layers3 } from 'lucide-react';
import { colors, stoneTypes } from '../data';
import { routePath } from '../routes';

interface MaterialsViewProps {
  setCurrentTab: (tab: string) => void;
}

export const MaterialsView: React.FC<MaterialsViewProps> = ({ setCurrentTab }) => (
  <div className="wr-catalog-page wr-taxonomy-page">
    <header className="wr-catalog-hero wr-catalog-hero--centered">
      <div><span className="wr-eyebrow">Material library</span><h1>Choose the stone type before the color and finish.</h1></div>
      <p>Compare the character, care considerations, and typical uses of six material groups. Open a material to review its colors, fabrication options, and application guidance.</p>
    </header>

    <section className="wr-taxonomy-grid wr-taxonomy-grid--three" aria-label="Stone material types">
      {stoneTypes.map((stoneType) => {
        const routeId = `stone-${stoneType.id}`;
        const colorCount = colors.filter((color) => color.material === stoneType.name).length;
        return (
          <article className="wr-taxonomy-card" key={stoneType.id}>
            <a href={routePath(routeId)} onClick={(event) => { event.preventDefault(); setCurrentTab(routeId); }}>
              <figure>
                <picture>
                  {stoneType.imageWebp && <source srcSet={stoneType.imageWebp} type="image/webp" />}
                  <img src={stoneType.image} alt={stoneType.imageAlt} width="1600" height="1200" loading="lazy" />
                </picture>
              </figure>
              <div className="wr-taxonomy-card__body">
                <span className="wr-taxonomy-card__meta"><Layers3 />{colorCount} color references</span>
                <h2>{stoneType.name}</h2>
                <p>{stoneType.summary}</p>
                <strong>Review {stoneType.name.toLowerCase()}<ArrowRight /></strong>
              </div>
            </a>
          </article>
        );
      })}
    </section>
  </div>
);
