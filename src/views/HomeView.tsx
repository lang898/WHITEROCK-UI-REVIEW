import React, { useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, FileText, Package } from 'lucide-react';
import { colors, ownerImages } from '../data';
import { t } from '../i18n';
import type { ColorItem, LocaleConfig, ProductItem, RfqCartItem } from '../types';
import type { ShareContent } from '../components/SocialShareModal';
import { HeroCarousel } from '../components/HeroCarousel';
import { RetailCompliance } from '../components/RetailCompliance';

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

const productPrograms = [
  {
    title: 'Bathroom vanity tops',
    copy: 'Single and double-bowl tops fabricated to approved cabinet, sink, and faucet specifications.',
    image: '/assets/owner/enhanced/vanity-inspection-sequence-a-enhanced.jpg',
    alt: 'Finished vanity tops arranged for inspection at the WHITEROCK Vietnam factory',
  },
  {
    title: 'Kitchen countertops',
    copy: 'Countertops, islands, waterfall ends, cutouts, and edge details made from buyer drawings.',
    image: '/assets/owner/countertops/waterfall-kitchen-island.jpg',
    alt: 'Finished waterfall kitchen island in natural stone',
  },
  {
    title: 'Furniture surfaces',
    copy: 'Stone tops for coffee tables, consoles, dining tables, and repeat furniture programs.',
    image: '/assets/owner/countertops/oval-travertine-coffee-top.jpg',
    alt: 'Oval travertine furniture top in a finished interior setting',
  },
  {
    title: 'Project products',
    copy: 'Cut-to-size components, thresholds, sills, wall pieces, and commercial stone packages.',
    image: '/assets/owner/enhanced/material-staging-hall-enhanced.jpg',
    alt: 'Finished stone project components staged at the WHITEROCK Vietnam factory',
  },
] as const;

export const HomeView: React.FC<HomeViewProps> = ({
  setCurrentTab,
  onSelectColor,
  onAddColorSample,
  currentLocale,
}) => {
  const colorStripRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });
  const featuredColors = colors.slice(0, 6);
  const cncImage = ownerImages.find((image) => image.id === 'owner-library-16')!;
  const vanitySequenceImage = ownerImages.find((image) => image.id === 'owner-library-06')!;

  const scrollMaterials = (direction: -1 | 1) => {
    colorStripRef.current?.scrollBy({ left: direction * Math.min(720, window.innerWidth * 0.72), behavior: 'smooth' });
  };

  return (
    <div className="wr-home wr-home--compact">
      <HeroCarousel onExploreProducts={() => setCurrentTab('products')} onRequestQuote={() => setCurrentTab('contact')} />

      <section className="wr-home-programs wr-section-band" aria-labelledby="home-products-title">
        <div className="wr-section-heading wr-section-intro">
          <span className="wr-eyebrow">What we make</span>
          <h2 id="home-products-title">Stone products built around the drawing.</h2>
          <p>Finished stone work for residential programs, furniture production, and commercial projects.</p>
        </div>
        <div className="wr-home-programs__grid">
          {productPrograms.map((program) => (
            <article key={program.title}>
              <button type="button" onClick={() => setCurrentTab('products')} aria-label={`Explore ${program.title}`}>
                <img src={program.image} alt={program.alt} width="1448" height="1086" loading="lazy" />
                <span><small>Product program</small><strong>{program.title}</strong><p>{program.copy}</p><i>Explore products<ArrowRight /></i></span>
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="wr-home-colors wr-section-band wr-section-band--mist" aria-labelledby="home-colors-title">
        <div className="wr-section-heading wr-section-intro">
          <span className="wr-eyebrow">Materials</span>
          <h2 id="home-colors-title">Choose a material direction, then confirm the sample.</h2>
          <p>Review six leading surfaces here, or open the full library for stone type, finish, and application details.</p>
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
            <article key={color.slug}>
              <button onClick={() => onSelectColor(color)}><img src={assetPath(color.swatchImage)} alt={`${color.name} illustrative digital swatch`} width="800" height="800" loading="lazy" /><span>{color.name}</span></button>
              <div><small>{color.material} · Digital swatch</small><button className="wr-icon-button" onClick={() => onAddColorSample(color)} aria-label={`Order ${color.name} sample`}><Package /></button></div>
            </article>
          ))}
        </div>
        <div className="wr-section-action"><button className="wr-button wr-button--secondary" onClick={() => setCurrentTab('colors')}>Explore materials<ArrowRight /></button></div>
      </section>

      <section className="wr-home-manufacturing wr-section-band" aria-labelledby="home-manufacturing-title">
        <div className="wr-section-heading wr-section-intro"><span className="wr-eyebrow">Why WHITEROCK</span><h2 id="home-manufacturing-title">Vietnam manufacturing aligned to the approved product.</h2><p>Cutting, edge processing, polishing, inspection, and packing are coordinated against the approved material sample and production drawing.</p></div>
        <div className="wr-home-manufacturing__media">
          <figure><img src={cncImage.image} alt="Stone cutting and machining line in the Vietnam factory" width="1448" height="1086" loading="lazy" /><figcaption>Cutting and machining</figcaption></figure>
          <figure><img src={vanitySequenceImage.image} alt="Matched vanity tops aligned for inspection" width="1086" height="1448" loading="lazy" /><figcaption>Vanity-top inspection</figcaption></figure>
        </div>
        <div className="wr-section-action"><button className="wr-button wr-button--secondary" onClick={() => setCurrentTab('factory')}>Review the factory<ArrowRight /></button></div>
      </section>

      <RetailCompliance compact />

      <section id="origin" className="wr-origin wr-origin--compact wr-section-band" aria-labelledby="home-origin-title">
        <div className="wr-section-heading wr-section-intro">
          <span className="wr-eyebrow">Material sourcing · Carrara, Italy</span>
          <h2 id="home-origin-title">Carrara White selected for vanity-top production.</h2>
          <p>WHITEROCK regularly visits the Carrara quarry region to select blocks used as a principal raw material. We source and fabricate the stone; we do not operate the quarry.</p>
        </div>
        <div className="wr-origin__media">
          <figure><img src="/assets/owner/countertops/carrara-white-quarry-overview.jpg" alt="Carrara White quarry interior visited during block sourcing" width="2000" height="1500" loading="lazy" /><figcaption>Carrara quarry region</figcaption></figure>
          <figure><img src="/assets/owner/countertops/carrara-white-quarry-workface.jpg" alt="Carrara quarry workface reviewed during block sourcing" width="2000" height="1500" loading="lazy" /><figcaption>Block review in Carrara</figcaption></figure>
        </div>
      </section>

      <section className="wr-home-final wr-section-band" aria-labelledby="home-final-title">
        <div className="wr-home-final__inner">
          <div><span className="wr-eyebrow">Start with the specification</span><h2 id="home-final-title">Bring us the drawing. We will help define the stone package.</h2><p>Share the material direction, dimensions, quantity, destination, and target schedule for a production review.</p></div>
          <div><button className="wr-button wr-button--secondary" onClick={() => setCurrentTab('samples')}><Package />Order samples</button><button className="wr-button wr-button--primary" onClick={() => setCurrentTab('contact')}><FileText />{t(currentLocale, 'requestQuote')}</button></div>
        </div>
      </section>
    </div>
  );
};
