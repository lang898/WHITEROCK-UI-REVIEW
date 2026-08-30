import React from 'react';
import { ArrowRight, Check, FileText, Package, Plus } from 'lucide-react';
import { colors, factory, products } from '../data';
import type { ColorItem, LocaleConfig, ProductItem, RfqCartItem } from '../types';
import type { ShareContent } from '../components/SocialShareModal';
import { HomeHeroCarousel } from '../components/HomeHeroCarousel';
import { ComplianceSection } from '../components/ComplianceSection';

interface HomeViewProps {
  setCurrentTab: (tab: string) => void;
  onSelectProduct: (product: ProductItem) => void;
  onSelectColor: (color: ColorItem) => void;
  onAddToCart: (product: ProductItem | RfqCartItem) => void;
  onAddColorSample: (color: ColorItem) => void;
  currentLocale: LocaleConfig;
  onOpenShareModal: (content?: ShareContent) => void;
}

const assetPath = (path: string) => `/${path.replace(/^\/+/, '')}`;

const materialRoutes = [
  ['Marble', 'stone-marble'],
  ['Granite', 'stone-granite'],
  ['Quartz', 'stone-quartz'],
  ['Quartzite', 'stone-quartzite'],
  ['Travertine', 'stone-travertine'],
  ['Engineered Marble', 'stone-engineered-marble'],
] as const;

const productProgramLabels: Record<string, string> = {
  'Vanity Top': 'Vanity Tops',
  'Kitchen Countertop': 'Kitchen Countertops',
  'Furniture Top': 'Furniture Tops',
  'Stone Furniture': 'Furniture Tops',
  'Project Product': 'Project Stone',
};

export const HomeView: React.FC<HomeViewProps> = ({
  setCurrentTab,
  onSelectProduct,
  onSelectColor,
  onAddToCart,
  onAddColorSample,
}) => {
  const productPrograms = [
    products.find((product) => product.category === 'Vanity Top'),
    products.find((product) => product.category === 'Kitchen Countertop'),
    products.find((product) => product.category === 'Furniture Top' || product.category === 'Stone Furniture'),
    products.find((product) => !['Vanity Top', 'Kitchen Countertop', 'Furniture Top', 'Stone Furniture'].includes(product.category)),
  ].filter((product, index, list): product is ProductItem => Boolean(product) && list.indexOf(product) === index);

  const stats = factory.stats.slice(0, 4);

  return (
    <div className="wr-home">
      <HomeHeroCarousel
        onExploreProducts={() => setCurrentTab('products')}
        onRequestQuote={() => setCurrentTab('contact')}
      />

      <section className="wr-home-programs wr-section-band" aria-labelledby="home-programs-title">
        <div className="wr-section-heading wr-section-intro">
          <span className="wr-eyebrow">What we make</span>
          <h2 id="home-programs-title">Finished stone programs built around the buyer drawing.</h2>
          <p>Start with a standard program or send a project drawing. Material, dimensions, edges, cutouts, inspection and packing are confirmed before production.</p>
        </div>
        <div className="wr-home-programs__grid">
          {productPrograms.map((product) => (
            <article className="wr-home-program" key={product.sku}>
              <button className="wr-home-program__media" onClick={() => onSelectProduct(product)} aria-label={`View ${product.title}`}>
                {product.imageWebp ? (
                  <picture>
                    <source srcSet={assetPath(product.imageWebp)} type="image/webp" />
                    <img src={assetPath(product.image)} alt={product.title} width={product.imageWidth || 1600} height={product.imageHeight || 1200} loading="lazy" />
                  </picture>
                ) : (
                  <img src={assetPath(product.image)} alt={product.title} width={product.imageWidth || 1600} height={product.imageHeight || 1200} loading="lazy" />
                )}
              </button>
              <div className="wr-home-program__body">
                <span>{productProgramLabels[product.category] || 'Project Stone'}</span>
                <h3>{product.title}</h3>
                <p>{product.material} · {product.sku}</p>
                <div>
                  <button className="wr-text-link" onClick={() => onSelectProduct(product)}>View details<ArrowRight /></button>
                  <button className="wr-icon-button" onClick={() => onAddToCart(product)} aria-label={`Add ${product.title} to RFQ`}><Plus /></button>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="wr-section-action"><button className="wr-button wr-button--secondary" onClick={() => setCurrentTab('products')}>Explore Products<ArrowRight /></button></div>
      </section>

      <section className="wr-home-materials wr-section-band wr-section-band--mist" aria-labelledby="home-materials-title">
        <div className="wr-section-heading wr-section-intro">
          <span className="wr-eyebrow">Materials</span>
          <h2 id="home-materials-title">Natural and engineered stone, selected for the application.</h2>
          <p>Browse the material families first, then confirm the final color, range, finish and thickness with a physical sample and order documents.</p>
        </div>
        <div className="wr-home-materials__grid">
          {materialRoutes.map(([material, route]) => {
            const color = colors.find((item) => item.material === material);
            return (
              <article className="wr-home-material" key={material}>
                <button onClick={() => setCurrentTab(route)}>
                  {color && <img src={assetPath(color.swatchImage)} alt={`${color.name} ${material} surface reference`} width="800" height="800" loading="lazy" />}
                  <span><strong>{material}</strong><small>{color?.name || 'Explore material'}</small></span>
                  <ArrowRight />
                </button>
                {color && <div><button onClick={() => onSelectColor(color)}>View color</button><button onClick={() => onAddColorSample(color)}><Package />Sample</button></div>}
              </article>
            );
          })}
        </div>
        <div className="wr-section-action"><button className="wr-button wr-button--secondary" onClick={() => setCurrentTab('colors')}>View Color Library<ArrowRight /></button></div>
      </section>

      <section className="wr-home-manufacturing-v2 wr-section-band" aria-labelledby="home-manufacturing-title">
        <div className="wr-home-manufacturing-v2__heading">
          <div className="wr-section-heading">
            <span className="wr-eyebrow">Why WHITEROCK</span>
            <h2 id="home-manufacturing-title">Vietnam manufacturing with drawing-led control.</h2>
            <p>Cutting, CNC, edge processing, polishing, inspection and packing are coordinated against the approved material sample and production documents.</p>
          </div>
          <button className="wr-button wr-button--secondary" onClick={() => setCurrentTab('factory')}>Factory Capability<ArrowRight /></button>
        </div>
        <div className="wr-home-manufacturing-v2__stats">
          {stats.map((stat) => <article key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></article>)}
        </div>
        <div className="wr-home-manufacturing-v2__media">
          <figure><img src="/assets/owner/enhanced/cnc-cutting-line-enhanced.jpg" alt="Stone cutting and CNC equipment in the WHITEROCK Vietnam factory" width="1448" height="1086" loading="lazy" /><figcaption>Cutting &amp; CNC</figcaption></figure>
          <figure><img src="/assets/owner/enhanced/quality-inspection-team-enhanced.jpg" alt="Quality inspection of finished stone components in Vietnam" width="1448" height="1086" loading="lazy" /><figcaption>Inspection &amp; QC</figcaption></figure>
        </div>
      </section>

      <ComplianceSection />

      <section className="wr-home-proof wr-section-band wr-section-band--mist" aria-labelledby="home-proof-title">
        <div className="wr-section-heading wr-section-intro">
          <span className="wr-eyebrow">Material to shipment</span>
          <h2 id="home-proof-title">Evidence across sourcing, production, inspection and packing.</h2>
          <p>Carrara is one sourcing story within a broader natural and engineered stone program. WHITEROCK sources selected materials through established suppliers and fabricates the approved product in Vietnam.</p>
        </div>
        <div className="wr-home-proof__grid">
          <figure className="wr-home-proof__lead"><img src="/assets/owner/countertops/carrara-white-quarry-workface.jpg" alt="Carrara quarry workface reviewed during stone block sourcing" width="2000" height="1500" loading="lazy" /><figcaption><span>01</span><div><strong>Material Selection</strong><small>Supplier and quarry-network sourcing; WHITEROCK does not operate the quarry.</small></div></figcaption></figure>
          <figure><img src="/assets/owner/enhanced/vanity-production-detail-enhanced.jpg" alt="Stone vanity top production and preparation at the Vietnam factory" width="1448" height="1086" loading="lazy" /><figcaption><span>02</span><div><strong>Production</strong><small>Made to approved drawings and samples.</small></div></figcaption></figure>
          <figure><img src="/assets/owner/enhanced/material-staging-hall-enhanced.jpg" alt="Finished stone components staged before packing" width="1448" height="1086" loading="lazy" /><figcaption><span>03</span><div><strong>Project Supply</strong><small>Inspection, packing and shipment planning.</small></div></figcaption></figure>
        </div>
      </section>

      <section className="wr-home-final-cta wr-section-band" aria-labelledby="home-final-cta-title">
        <div>
          <span className="wr-eyebrow">Project review</span>
          <h2 id="home-final-cta-title">Have a drawing, specification or material reference?</h2>
          <p>Send us your drawings, quantities and destination requirements for project review.</p>
          <ul>
            <li><Check />Drawing or specification</li>
            <li><Check />Material / color</li>
            <li><Check />Dimensions and quantity</li>
            <li><Check />Destination and required timing</li>
          </ul>
        </div>
        <div className="wr-home-final-cta__actions">
          <button className="wr-button wr-button--primary" onClick={() => setCurrentTab('contact')}><FileText />Request a Quote</button>
          <button className="wr-button wr-button--secondary" onClick={() => setCurrentTab('samples')}><Package />Order Samples</button>
        </div>
      </section>
    </div>
  );
};
