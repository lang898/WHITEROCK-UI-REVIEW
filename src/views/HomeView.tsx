import React, { useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, FileText, Package } from 'lucide-react';
import { colors, ownerImages } from '../data';
import { t } from '../i18n';
import type { ColorItem, LocaleConfig, ProductItem, RfqCartItem } from '../types';
import type { ShareContent } from '../components/SocialShareModal';
import { HeroCarousel } from '../components/HeroCarousel';
import { RetailCompliance } from '../components/RetailCompliance';
import { ColorSwatchImage } from '../components/ColorSwatchImage';
import { openRfqBuilder } from '../lib/uiEvents';

interface HomeViewProps {
  setCurrentTab: (tab: string) => void;
  onSelectProduct: (product: ProductItem) => void;
  onSelectColor: (color: ColorItem) => void;
  onAddToCart: (product: ProductItem | RfqCartItem) => void;
  onAddColorSample: (color: ColorItem) => void;
  currentLocale: LocaleConfig;
  onOpenShareModal: (content?: ShareContent) => void;
}

const productPrograms = [
  { title: 'Bathroom vanity tops', copy: 'Single and double-bowl tops fabricated to approved cabinet, sink, and faucet specifications.', image: '/assets/owner/enhanced/vanity-inspection-sequence-a-enhanced.jpg', alt: 'Finished vanity tops arranged for inspection at a Vietnam stone factory' },
  { title: 'Kitchen countertops', copy: 'Countertops, islands, waterfall ends, cutouts, and edge details made from buyer drawings.', image: '/assets/owner/countertops/waterfall-kitchen-island.jpg', alt: 'Finished waterfall kitchen island in natural stone' },
  { title: 'Furniture surfaces', copy: 'Stone tops for coffee tables, consoles, dining tables, and repeat furniture programs.', image: '/assets/owner/countertops/oval-travertine-coffee-top.jpg', alt: 'Oval travertine furniture top in a finished interior setting' },
  { title: 'Project products', copy: 'Cut-to-size components, thresholds, sills, wall pieces, and commercial stone packages.', image: '/assets/owner/enhanced/material-staging-hall-enhanced.jpg', alt: 'Finished stone project components staged at a Vietnam factory' },
] as const;

const editorialStory = [
  {
    number: '01',
    title: 'Start with the material.',
    image: '/assets/materials/white-marble-v2.jpg',
    alt: 'White natural stone surface reference',
    copy: 'The selection begins with material family, visual range, finish, thickness, and intended use. Digital references help narrow the direction; physical samples and the applicable production lot establish the material range used for approval.',
  },
  {
    number: '02',
    title: 'Translate the drawing into production.',
    image: '/assets/owner/enhanced/cnc-cutting-line-enhanced.jpg',
    alt: 'CNC stone cutting and machining line in Vietnam',
    copy: 'Approved dimensions, openings, profiles, sink details, and repeat-component geometry move into cutting, CNC, edge processing, and polishing. Production controls remain tied to the approved drawing and agreed sample rather than to a generic website specification.',
  },
  {
    number: '03',
    title: 'Finish with the application in mind.',
    image: '/assets/owner/countertops/waterfall-kitchen-island.jpg',
    alt: 'Finished natural stone waterfall kitchen island',
    copy: 'The finished product brings material selection and fabrication together. Final inspection, protection, packing, marks, and shipment preparation are coordinated for the actual product, handling method, destination, and confirmed order documents.',
  },
] as const;

const buyerProcess = [
  { title: 'Drawing review', copy: 'We review dimensions, cutouts, sink details, materials, finishes, quantity, and destination before quotation.' },
  { title: 'Production', copy: 'Cutting, CNC, edge processing, polishing, and assembly follow the approved sample and production drawing.' },
  { title: 'Quality control', copy: 'Critical dimensions, surface condition, cutouts, finish, and order requirements are checked before release.' },
  { title: 'Packing', copy: 'Packing is selected for the product, handling method, container plan, and buyer requirements.' },
  { title: 'Shipment handoff', copy: 'Final quantities, packing records, marks, and order documents are coordinated for the confirmed shipment.' },
] as const;

export const HomeView: React.FC<HomeViewProps> = ({ setCurrentTab, onSelectColor, onAddColorSample, currentLocale }) => {
  const colorStripRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });
  const featuredColors = colors.slice(0, 6);
  const cncImage = ownerImages.find((image) => image.id === 'owner-library-16')!;
  const vanitySequenceImage = ownerImages.find((image) => image.id === 'owner-library-06')!;

  const scrollMaterials = (direction: -1 | 1) => {
    colorStripRef.current?.scrollBy({ left: direction * Math.min(720, window.innerWidth * 0.72), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };

  return (
    <div className="wr-home wr-home--compact">
      <HeroCarousel onExploreProducts={() => setCurrentTab('products')} onRequestQuote={openRfqBuilder} />

      <section className="wr-home-programs wr-section-band" aria-labelledby="home-products-title">
        <div className="wr-section-heading wr-section-intro"><span className="wr-eyebrow">What we make</span><h2 id="home-products-title">Stone products built around the drawing.</h2><p>Finished stone work for residential programs, furniture production, and commercial projects.</p></div>
        <div className="wr-home-programs__grid">{productPrograms.map((program) => <article key={program.title}><button type="button" onClick={() => setCurrentTab('products')} aria-label={`Explore ${program.title}`}><img src={program.image} alt={program.alt} width="1448" height="1086" loading="lazy" /><span><small>Product program</small><strong>{program.title}</strong><p>{program.copy}</p><i>Explore products<ArrowRight /></i></span></button></article>)}</div>
      </section>

      <section className="wr-home-colors wr-section-band wr-section-band--mist" aria-labelledby="home-colors-title">
        <div className="wr-section-heading wr-section-intro"><span className="wr-eyebrow">Materials</span><h2 id="home-colors-title">Choose a material direction, then confirm the sample.</h2><p>Review six leading surfaces here, or open the full library for stone type, finish, and application details.</p></div>
        <div className="wr-material-wall-controls"><button className="wr-icon-button" onClick={() => scrollMaterials(-1)} aria-label="Previous materials"><ChevronLeft /></button><button className="wr-icon-button" onClick={() => scrollMaterials(1)} aria-label="Next materials"><ChevronRight /></button></div>
        <div className="wr-color-strip wr-material-wall" ref={colorStripRef} aria-label="Featured material colors"
          onWheel={(event) => { if (Math.abs(event.deltaY) > Math.abs(event.deltaX) && colorStripRef.current) colorStripRef.current.scrollLeft += event.deltaY; }}
          onPointerDown={(event) => { const current = colorStripRef.current; if (!current || event.button !== 0) return; dragState.current = { active: event.pointerType === 'mouse', startX: event.clientX, scrollLeft: current.scrollLeft, moved: false }; }}
          onPointerMove={(event) => { const current = colorStripRef.current; if (!current || !dragState.current.active) return; const distance = event.clientX - dragState.current.startX; if (!dragState.current.moved) { if (Math.abs(distance) <= 5) return; dragState.current.moved = true; current.setPointerCapture(event.pointerId); } current.scrollLeft = dragState.current.scrollLeft - distance; }}
          onPointerUp={(event) => { dragState.current.active = false; const current = colorStripRef.current; if (current?.hasPointerCapture(event.pointerId)) current.releasePointerCapture(event.pointerId); }}
          onPointerCancel={() => { dragState.current.active = false; }} onLostPointerCapture={() => { dragState.current.active = false; }} onPointerLeave={() => { if (!dragState.current.moved) dragState.current.active = false; }}
          onClickCapture={(event) => { if (!dragState.current.moved || event.detail === 0) return; event.preventDefault(); event.stopPropagation(); dragState.current.moved = false; }}>
          {featuredColors.map((color) => <article key={color.slug}><button onClick={() => onSelectColor(color)}><ColorSwatchImage color={color} loading="lazy" draggable={false} /><span>{color.name}</span></button><div><small>{color.material} · {color.imageType === 'render' ? 'Digital swatch' : 'Material photograph'}</small><button className="wr-icon-button" onClick={() => onAddColorSample(color)} aria-label={`Order ${color.name} sample`}><Package /></button></div></article>)}
        </div>
        <div className="wr-section-action"><button className="wr-button wr-button--secondary" onClick={() => setCurrentTab('colors')}>Explore materials<ArrowRight /></button></div>
      </section>

      <section className="wr-home-manufacturing wr-section-band" aria-labelledby="home-manufacturing-title">
        <div className="wr-section-heading wr-section-intro"><span className="wr-eyebrow">Manufacturing approach</span><h2 id="home-manufacturing-title">Vietnam manufacturing aligned to the approved product.</h2><p>Cutting, edge processing, polishing, inspection, and packing are coordinated against the approved material sample and production drawing.</p></div>
        <div className="wr-home-manufacturing__media"><figure><img src={cncImage.image} alt="Stone cutting and machining line in the Vietnam factory" width="1448" height="1086" loading="lazy" /><figcaption>Cutting and machining</figcaption></figure><figure><img src={vanitySequenceImage.image} alt="Matched vanity tops aligned for inspection" width="1086" height="1448" loading="lazy" /><figcaption>Vanity-top inspection</figcaption></figure></div>
        <div className="wr-section-action"><button className="wr-button wr-button--secondary" onClick={() => setCurrentTab('factory')}>Review the factory<ArrowRight /></button></div>
      </section>

      <section className="wr-home-story wr-section-band wr-section-band--mist" aria-labelledby="home-story-title">
        <div className="wr-section-heading wr-section-intro"><span className="wr-eyebrow">Material · fabrication · application</span><h2 id="home-story-title">One stone package, three decisions that stay connected.</h2><p>Material selection, fabrication, and final application are reviewed as one order path rather than separate marketing claims.</p></div>
        <div className="wr-home-story__grid">{editorialStory.map((story) => <article key={story.number}><figure><img src={story.image} alt={story.alt} width="1448" height="1086" loading="lazy" /></figure><div><span>{story.number}</span><h3>{story.title}</h3><p>{story.copy}</p></div></article>)}</div>
      </section>

      <RetailCompliance compact />

      <section className="wr-section-band wr-section-band--mist" aria-labelledby="home-process-title">
        <div className="wr-section-heading wr-section-intro"><span className="wr-eyebrow">From drawing to shipment</span><h2 id="home-process-title">A buyer workflow built around approved requirements.</h2><p>Each program moves from specification review into controlled production, inspection, packing, and shipment preparation.</p></div>
        <ol className="grid grid-cols-1 md:grid-cols-5 border-y border-black/10">{buyerProcess.map((step, index) => <li key={step.title} className="py-6 md:px-5 border-b md:border-b-0 md:border-l border-black/10 first:border-l-0 last:border-b-0"><span className="text-xs font-bold tracking-[0.08em] text-[#6e6e73]">{String(index + 1).padStart(2, '0')}</span><h3 className="mt-4 text-[1.05rem]">{step.title}</h3><p className="mt-3 text-sm leading-6 text-[#6e6e73]">{step.copy}</p></li>)}</ol>
        <div className="wr-section-action"><button className="wr-button wr-button--secondary" onClick={() => setCurrentTab('factory')}>See manufacturing & QC<ArrowRight /></button></div>
      </section>

      <section className="wr-home-final wr-section-band" aria-labelledby="home-final-title"><div className="wr-home-final__inner"><div><span className="wr-eyebrow">Start with the specification</span><h2 id="home-final-title">Bring us the drawing. We will help define the stone package.</h2><p>Share the material direction, dimensions, quantity, destination, and target schedule for a production review.</p></div><div><button className="wr-button wr-button--secondary" onClick={() => setCurrentTab('samples')}><Package />Order samples</button><button className="wr-button wr-button--primary" onClick={openRfqBuilder}><FileText />{t(currentLocale, 'requestQuote')}</button></div></div></section>
    </div>
  );
};
