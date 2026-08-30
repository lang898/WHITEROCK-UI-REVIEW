import React, { useRef, useState } from 'react';
import { ArrowDown, ArrowRight, Check, ChevronLeft, ChevronRight, FileText, GripVertical, Package, Plus } from 'lucide-react';
import { colors, factory, ownerImages, products } from '../data';
import { t } from '../i18n';
import type { ColorItem, LocaleConfig, ProductItem, RfqCartItem } from '../types';
import type { ShareContent } from '../components/SocialShareModal';

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

export const HomeView: React.FC<HomeViewProps> = ({
  setCurrentTab,
  onSelectProduct,
  onSelectColor,
  onAddToCart,
  onAddColorSample,
  currentLocale
}) => {
  const [heroReveal, setHeroReveal] = useState(58);
  const [activeColor, setActiveColor] = useState<ColorItem>(colors[0]);
  const colorStripRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });
  const featuredColors = colors.slice(0, 8);
  const showcaseSkus = ['WR-KT-QC', 'WR-FR-RM', 'WR-KT-NS'];
  const showcaseProducts = showcaseSkus.map((sku) => products.find((product) => product.sku === sku)!).filter(Boolean);
  const stats = factory.stats.slice(0, 4);
  const cncImage = ownerImages.find((image) => image.id === 'owner-library-16')!;
  const vanitySequenceImage = ownerImages.find((image) => image.id === 'owner-library-06')!;

  const programName = (product: ProductItem) => {
    if (product.category === 'Kitchen Countertop') return 'Kitchen countertops';
    if (product.category === 'Furniture Top' || product.category === 'Stone Furniture') return 'Furniture tops';
    return 'Project products';
  };

  const scrollMaterials = (direction: -1 | 1) => {
    colorStripRef.current?.scrollBy({ left: direction * Math.min(720, window.innerWidth * 0.72), behavior: 'smooth' });
  };

  return (
    <div className="wr-home">
      <section className="wr-hero wr-hero--compare" aria-labelledby="home-hero-title">
        <div className="wr-hero-compare" aria-hidden="true">
          <picture><source srcSet="/assets/owner/countertops/waterfall-kitchen-island-1280.avif" type="image/avif" /><source srcSet="/assets/owner/countertops/waterfall-kitchen-island-1280.webp" type="image/webp" /><img src="/assets/owner/countertops/waterfall-kitchen-island.jpg" alt="" width="2000" height="956" loading="eager" fetchPriority="high" /></picture>
          <picture className="wr-hero-compare__reveal" style={{ clipPath: `inset(0 ${100 - heroReveal}% 0 0)` }}><source srcSet="/assets/owner/countertops/carrara-kitchen-island-1280.avif" type="image/avif" /><source srcSet="/assets/owner/countertops/carrara-kitchen-island-1280.webp" type="image/webp" /><img src="/assets/owner/countertops/carrara-kitchen-island.jpg" alt="" width="2000" height="956" loading="eager" fetchPriority="high" /></picture>
        </div>
        <div className="wr-hero__shade" aria-hidden="true" />
        <div className="wr-hero__content">
          <p className="wr-eyebrow wr-eyebrow--light">Direct stone manufacturing · Vietnam</p>
          <h1 id="home-hero-title">Carrara Selected. Vietnam Made. Built to Drawing.</h1>
          <p className="wr-hero__lead">Vanity tops, kitchen countertops, furniture surfaces, and project stone fabricated from buyer-approved samples and drawings.</p>
          <div className="wr-hero__actions">
            <button className="wr-button wr-button--light" onClick={() => setCurrentTab('products')}>{t(currentLocale, 'exploreProducts')}<ArrowRight /></button>
            <button className="wr-button wr-button--outline-light" onClick={() => setCurrentTab('samples')}><Package />Order samples</button>
          </div>
        </div>
        <div className="wr-hero-compare__control">
          <span>Carrara application</span>
          <label>
            <span className="sr-only">Compare two stone applications</span>
            <input type="range" min="10" max="90" value={heroReveal} onChange={(event) => setHeroReveal(Number(event.target.value))} />
            <i style={{ left: `${heroReveal}%` }}><GripVertical /></i>
          </label>
          <span>Veined application</span>
        </div>
        <a className="wr-hero__scroll" href="#origin" aria-label="Continue to Carrara sourcing"><ArrowDown /></a>
      </section>

      <section id="origin" className="wr-origin wr-section-band" aria-labelledby="home-origin-title">
        <div className="wr-section-heading wr-section-intro">
          <span className="wr-eyebrow">Stone origin · Carrara, Italy</span>
          <h2 id="home-origin-title">Carrara White selected at its source.</h2>
          <p>WHITEROCK regularly visits the Carrara quarry region in Italy to select Carrara White blocks used as a principal raw material for vanity-top production. We source and fabricate the stone; we do not operate the quarry.</p>
        </div>
        <div className="wr-origin__media">
          <figure><img src="/assets/owner/countertops/carrara-white-quarry-overview.jpg" alt="Carrara White quarry interior visited during block sourcing" width="2000" height="1500" loading="lazy" /><figcaption>Carrara White quarry region</figcaption></figure>
          <figure><img src="/assets/owner/countertops/carrara-white-quarry-workface.jpg" alt="Carrara quarry workface reviewed during block sourcing" width="2000" height="1500" loading="lazy" /><figcaption>Block selection at the quarry workface</figcaption></figure>
        </div>
        <p className="wr-origin__note">Veining and color movement vary by block and lot. Final range, finish, dimensions, and acceptance criteria are confirmed through the approved sample and order documents.</p>
      </section>

      <section className="wr-home-colors wr-section-band wr-section-band--mist" aria-labelledby="home-colors-title">
        <div className="wr-section-heading wr-section-intro">
          <span className="wr-eyebrow">Material wall</span>
          <h2 id="home-colors-title">Move from visual direction to physical sample.</h2>
          <p>Hover or focus a surface to inspect its full texture. Drag or use the mouse wheel to move through the collection.</p>
        </div>
        <div className="wr-material-preview" aria-live="polite">
          <img src={assetPath(activeColor.swatchImage)} alt={`${activeColor.name} digital swatch preview`} width="1600" height="900" loading="lazy" />
          <div><span>{activeColor.material}</span><h3>{activeColor.name}</h3><p>{activeColor.description}</p><button className="wr-button wr-button--light" onClick={() => onSelectColor(activeColor)}>View surface<ArrowRight /></button></div>
        </div>
        <div className="wr-material-wall-controls"><button className="wr-icon-button" onClick={() => scrollMaterials(-1)} aria-label="Previous materials"><ChevronLeft /></button><button className="wr-icon-button" onClick={() => scrollMaterials(1)} aria-label="Next materials"><ChevronRight /></button></div>
        <div
          className="wr-color-strip wr-material-wall"
          ref={colorStripRef}
          aria-label="Featured material colors"
          onWheel={(event) => {
            if (Math.abs(event.deltaY) > Math.abs(event.deltaX) && colorStripRef.current) colorStripRef.current.scrollLeft += event.deltaY;
          }}
          onPointerDown={(event) => {
            const current = colorStripRef.current;
            if (!current) return;
            dragState.current = { active: true, startX: event.clientX, scrollLeft: current.scrollLeft, moved: false };
            current.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            const current = colorStripRef.current;
            if (!current || !dragState.current.active) return;
            const distance = event.clientX - dragState.current.startX;
            if (Math.abs(distance) > 5) dragState.current.moved = true;
            current.scrollLeft = dragState.current.scrollLeft - distance;
          }}
          onPointerUp={(event) => {
            dragState.current.active = false;
            colorStripRef.current?.releasePointerCapture(event.pointerId);
          }}
          onClickCapture={(event) => {
            if (!dragState.current.moved) return;
            event.preventDefault();
            event.stopPropagation();
            dragState.current.moved = false;
          }}
        >
          {featuredColors.map((color) => (
            <article key={color.slug} onMouseEnter={() => setActiveColor(color)} onFocus={() => setActiveColor(color)}>
              <button onClick={() => onSelectColor(color)}><img src={assetPath(color.swatchImage)} alt={`${color.name} digital swatch`} width="800" height="800" loading="lazy" /><span>{color.name}</span></button>
              <div><small>{color.material} · Digital swatch</small><button className="wr-icon-button" onClick={() => onAddColorSample(color)} aria-label={`Order ${color.name} sample`}><Package /></button></div>
            </article>
          ))}
        </div>
        <nav className="wr-use-finder" aria-label="Find materials by use">
          <span>Find by use</span>
          {['Countertops', 'Wall surfaces', 'Flooring', 'Furniture'].map((use) => <button key={use} onClick={() => setCurrentTab(use === 'Furniture' ? 'products' : 'applications')}>{use}<ArrowRight /></button>)}
        </nav>
        <div className="wr-section-action"><button className="wr-button wr-button--secondary" onClick={() => setCurrentTab('colors')}>Open color library<ArrowRight /></button></div>
      </section>

      <section className="wr-home-applications wr-section-band" aria-labelledby="home-products-title">
        <div className="wr-section-heading wr-section-intro"><span className="wr-eyebrow">Finished applications</span><h2 id="home-products-title">Stone surfaces resolved from drawing to packed component.</h2><p>Start from common North American dimensions or a buyer drawing, then confirm material, edge, cutouts, support details, quantity, inspection, and packing.</p></div>
        <div className="wr-home-applications__grid">
          {showcaseProducts.map((product, index) => (
            <article className={index === 0 ? 'wr-home-application wr-home-application--lead' : 'wr-home-application'} key={product.sku}>
              <button className="wr-home-application__media" onClick={() => onSelectProduct(product)}>
                {product.imageWebp && <picture><source srcSet={assetPath(product.imageWebp)} type="image/webp" /><img src={assetPath(product.image)} alt={product.title} width={product.imageWidth || 1600} height={product.imageHeight || 1200} loading="lazy" /></picture>}
                {!product.imageWebp && <img src={assetPath(product.image)} alt={product.title} width={product.imageWidth || 1600} height={product.imageHeight || 1200} loading="lazy" />}
              </button>
              <div className="wr-home-application__body"><span>{programName(product)}</span><h3>{product.title}</h3><div><button className="wr-text-link" onClick={() => onSelectProduct(product)}>View details<ArrowRight /></button><button className="wr-icon-button" onClick={() => onAddToCart(product)} aria-label={`Add ${product.title} to RFQ`}><Plus /></button></div></div>
            </article>
          ))}
        </div>
        <div className="wr-section-action"><button className="wr-button wr-button--secondary" onClick={() => setCurrentTab('products')}>Explore all product programs<ArrowRight /></button></div>
      </section>

      <section className="wr-home-manufacturing wr-section-band wr-section-band--mist" aria-labelledby="home-manufacturing-title">
        <div className="wr-section-heading wr-section-intro"><span className="wr-eyebrow">Vietnam manufacturing</span><h2 id="home-manufacturing-title">Production aligned to the approved product.</h2><p>Cutting, edge processing, polishing, inspection, and packing are coordinated against the approved material sample and production drawing.</p></div>
        <div className="wr-home-manufacturing__stats">{stats.map((stat) => <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}</div>
        <div className="wr-home-manufacturing__media">
          <figure><img src={cncImage.image} alt="Stone cutting and machining line in the Vietnam factory" width="1448" height="1086" loading="lazy" /><figcaption>Cutting and machining</figcaption></figure>
          <figure><img src={vanitySequenceImage.image} alt="Matched vanity tops aligned for inspection" width="1086" height="1448" loading="lazy" /><figcaption>Vanity-top inspection sequence</figcaption></figure>
        </div>
        <div className="wr-section-action"><button className="wr-button wr-button--secondary" onClick={() => setCurrentTab('factory')}>Review manufacturing capability<ArrowRight /></button></div>
      </section>

      <section className="wr-home-process wr-section-band" aria-labelledby="home-process-title">
        <div className="wr-section-heading wr-section-intro"><span className="wr-eyebrow">From drawing to shipment</span><h2 id="home-process-title">A buying process built around written approval.</h2></div>
        <ol>{[
          ['01', 'Share the brief', 'Send drawings, target material, destination, quantity, and schedule.'],
          ['02', 'Confirm the specification', 'Review samples, dimensions, edges, cutouts, quality plan, and packing method.'],
          ['03', 'Approve, inspect, and ship', 'Production follows the approved documents; inspection and shipment evidence are agreed for the order.']
        ].map(([number, title, body]) => <li key={number}><span>{number}</span><div><h3>{title}</h3><p>{body}</p></div><Check /></li>)}</ol>
        <div className="wr-process-cta"><div><span className="wr-eyebrow">Direct B2B inquiry</span><h2>Bring us the drawing. We will help define the stone package.</h2></div><button className="wr-button wr-button--primary" onClick={() => setCurrentTab('contact')}><FileText />{t(currentLocale, 'requestQuote')}</button></div>
      </section>
    </div>
  );
};
