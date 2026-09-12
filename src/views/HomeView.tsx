import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Factory, FileText, Gauge, MessageCircle, Package, Ruler, Ship, Upload } from 'lucide-react';
import { colors, ownerImages } from '../data';
import type { ColorItem, LocaleConfig, ProductItem, RfqCartItem } from '../types';
import type { ShareContent } from '../components/SocialShareModal';
import { HeroCarousel } from '../components/HeroCarousel';
import { MaterialWall } from '../components/MaterialWall';
import { RetailCompliance } from '../components/RetailCompliance';
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

type StatIcon = React.ComponentType<{ size?: number; strokeWidth?: number; 'aria-hidden'?: boolean }>;

const assetPath = (value: string) => value.startsWith('/') ? value : `/${value}`;

const productPrograms = [
  { title: 'Bathroom vanity tops', copy: 'Single and double-bowl tops fabricated to approved cabinet, sink, and faucet specifications.', image: '/assets/owner/enhanced/vanity-inspection-sequence-a-enhanced.jpg', alt: 'Finished vanity tops arranged for inspection at a Vietnam stone factory' },
  { title: 'Kitchen countertops', copy: 'Countertops, islands, waterfall ends, cutouts, and edge details made from buyer drawings.', image: '/assets/owner/countertops/waterfall-kitchen-island.jpg', alt: 'Finished waterfall kitchen island in natural stone' },
  { title: 'Furniture surfaces', copy: 'Stone tops for coffee tables, consoles, dining tables, and repeat furniture programs.', image: '/assets/owner/countertops/oval-travertine-coffee-top.jpg', alt: 'Oval travertine furniture top in a finished interior setting' },
  { title: 'Project products', copy: 'Cut-to-size components, thresholds, sills, wall pieces, and commercial stone packages.', image: '/assets/owner/enhanced/material-staging-hall-enhanced.jpg', alt: 'Finished stone project components staged at a Vietnam factory' },
] as const;

const editorialStory = [
  { number: '01', title: 'Start with the material.', image: '/assets/materials/white-marble-v2.jpg', alt: 'White natural stone surface reference', copy: 'Material family, visual range, finish, thickness, and intended use establish the direction before fabrication.' },
  { number: '02', title: 'Shape it to the drawing.', image: '/assets/owner/enhanced/cnc-cutting-line-enhanced.jpg', alt: 'CNC stone cutting and machining line in Vietnam', copy: 'Approved dimensions, openings, profiles, sink details, and repeat geometry move into cutting, CNC, edge processing, and polishing.' },
  { number: '03', title: 'Finish for the application.', image: '/assets/owner/countertops/waterfall-kitchen-island.jpg', alt: 'Finished natural stone waterfall kitchen island', copy: 'Inspection, protection, packing, marks, and shipment preparation are coordinated around the finished product and destination.' },
] as const;

const buyerProcess = [
  { title: 'Drawing review', copy: 'Dimensions, cutouts, sink details, materials, finishes, quantity, and destination are reviewed before quotation.' },
  { title: 'Production', copy: 'Cutting, CNC, edge processing, polishing, and assembly follow the approved sample and production drawing.' },
  { title: 'Quality control', copy: 'Critical dimensions, surface condition, cutouts, finish, and order requirements are checked before release.' },
  { title: 'Packing', copy: 'Packing is selected for the product, handling method, container plan, and buyer requirements.' },
  { title: 'Shipment handoff', copy: 'Final quantities, packing records, marks, and order documents are coordinated for the confirmed shipment.' },
] as const;

const statItems: Array<{ value: number; prefix?: string; suffix?: string; label: string; Icon: StatIcon }> = [
  { value: 20, suffix: '+', label: 'Years stone experience', Icon: Ruler },
  { value: 20000, label: 'm² Vietnam plant', Icon: Factory },
  { value: 100000, suffix: '+', label: 'm² annual capacity', Icon: Gauge },
  { value: 50, label: 'Containers / month', Icon: Ship },
];

function AnimatedStat({ value, prefix = '', suffix = '', label, Icon }: (typeof statItems)[number]) {
  const ref = useRef<HTMLElement>(null);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      setDisplayValue(value);
      return;
    }

    let frame = 0;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      const start = performance.now();
      const animate = (now: number) => {
        const progress = Math.min(1, (now - start) / 400);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(Math.round(value * eased));
        if (progress < 1) frame = window.requestAnimationFrame(animate);
      };
      frame = window.requestAnimationFrame(animate);
    }, { threshold: 0.35 });
    observer.observe(node);
    return () => {
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <article ref={ref} className="wr-home-stat">
      <Icon size={28} strokeWidth={1.35} aria-hidden="true" />
      <strong>{prefix}{displayValue.toLocaleString('en-US')}{suffix}</strong>
      <span>{label}</span>
    </article>
  );
}

function HomeBeforeAfter() {
  const [split, setSplit] = useState(52);
  const color = colors.find((item) => item.slug === 'calacatta-crest') || colors[0];
  const texture = assetPath(color.swatchAvif || color.swatchWebp || color.swatchImage);
  const scene = '/assets/owner/countertops/waterfall-kitchen-island.jpg';
  const mask = 'polygon(0 48%, 72% 28%, 100% 37%, 100% 67%, 29% 88%, 0 76%)';

  return (
    <section className="wr-home-before-after wr-section-band" aria-labelledby="home-before-after-title">
      <div className="wr-section-heading wr-section-intro">
        <span className="wr-eyebrow">See the surface in context</span>
        <h2 id="home-before-after-title">Move from the original scene to a material preview.</h2>
        <p>Drag the divider to compare the original kitchen image with a simulated stone direction.</p>
      </div>
      <div className="wr-home-before-after__stage">
        <img src={scene} alt="Original waterfall kitchen island scene" width="1600" height="1100" loading="lazy" />
        <div className="wr-home-before-after__preview" style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }} aria-hidden="true">
          <img src={scene} alt="" width="1600" height="1100" loading="lazy" />
          <div className="wr-home-before-after__surface" style={{ clipPath: mask, backgroundImage: `url(${texture})` }} />
        </div>
        <span className="wr-home-before-after__label wr-home-before-after__label--preview">Material preview</span>
        <span className="wr-home-before-after__label wr-home-before-after__label--original">Original</span>
        <div className="wr-home-before-after__divider" style={{ left: `${split}%` }} aria-hidden="true"><i>↔</i></div>
        <input aria-label="Compare original and material preview" type="range" min="0" max="100" value={split} onChange={(event) => setSplit(Number(event.target.value))} />
      </div>
      <p className="wr-home-before-after__note">Simulated material preview for visual direction only.</p>
    </section>
  );
}

export const HomeView: React.FC<HomeViewProps> = ({ setCurrentTab, onSelectColor, onAddColorSample }) => {
  const cncImage = ownerImages.find((image) => image.id === 'owner-library-16')!;
  const vanitySequenceImage = ownerImages.find((image) => image.id === 'owner-library-06')!;

  return (
    <div className="wr-home wr-home--visual">
      <HeroCarousel onExploreProducts={() => setCurrentTab('products')} onRequestQuote={openRfqBuilder} />

      <MaterialWall onSelectColor={onSelectColor} onAddSample={onAddColorSample} />

      <HomeBeforeAfter />

      <section className="wr-home-stats-v2" aria-label="Manufacturing capability">
        <div className="wr-home-stats-v2__inner">{statItems.map((item) => <AnimatedStat key={item.label} {...item} />)}</div>
      </section>

      <section className="wr-home-programs wr-section-band" aria-labelledby="home-products-title">
        <div className="wr-section-heading wr-section-intro"><span className="wr-eyebrow">What we make</span><h2 id="home-products-title">Stone products built around the drawing.</h2><p>Finished stone work for residential programs, furniture production, and commercial projects.</p></div>
        <div className="wr-home-programs__grid">{productPrograms.map((program) => <article key={program.title}><button type="button" onClick={() => setCurrentTab('products')} aria-label={`Explore ${program.title}`}><img src={program.image} alt={program.alt} width="1448" height="1086" loading="lazy" /><span><small>Product program</small><strong>{program.title}</strong><p>{program.copy}</p><i>Explore products<ArrowRight /></i></span></button></article>)}</div>
      </section>

      <section className="wr-home-manufacturing wr-section-band wr-section-band--mist" aria-labelledby="home-manufacturing-title">
        <div className="wr-section-heading wr-section-intro"><span className="wr-eyebrow">Manufacturing approach</span><h2 id="home-manufacturing-title">Vietnam manufacturing aligned to the approved product.</h2><p>Cutting, edge processing, polishing, inspection, and packing are coordinated against the approved material sample and production drawing.</p></div>
        <div className="wr-home-manufacturing__media"><figure><img src={cncImage.image} alt="Stone cutting and machining line in the Vietnam factory" width="1448" height="1086" loading="lazy" /><figcaption>Cutting and machining</figcaption></figure><figure><img src={vanitySequenceImage.image} alt="Matched vanity tops aligned for inspection" width="1086" height="1448" loading="lazy" /><figcaption>Vanity-top inspection</figcaption></figure></div>
        <div className="wr-section-action"><button className="wr-button wr-button--secondary" onClick={() => setCurrentTab('factory')}>Review the factory<ArrowRight /></button></div>
      </section>

      <section className="wr-home-story wr-section-band" aria-labelledby="home-story-title">
        <div className="wr-section-heading wr-section-intro"><span className="wr-eyebrow">Material · fabrication · application</span><h2 id="home-story-title">One stone package, three connected decisions.</h2><p>Material selection, fabrication, and the finished application stay visually connected from the first sample to shipment.</p></div>
        <div className="wr-home-story__grid">{editorialStory.map((story) => <article key={story.number}><figure><img src={story.image} alt={story.alt} width="1448" height="1086" loading="lazy" /></figure><div><span>{story.number}</span><h3>{story.title}</h3><p>{story.copy}</p></div></article>)}</div>
      </section>

      <RetailCompliance compact />

      <section className="wr-section-band wr-section-band--mist" aria-labelledby="home-process-title">
        <div className="wr-section-heading wr-section-intro"><span className="wr-eyebrow">From drawing to shipment</span><h2 id="home-process-title">A buyer workflow built around approved requirements.</h2></div>
        <ol className="grid grid-cols-1 md:grid-cols-5 border-y border-black/10">{buyerProcess.map((step, index) => <li key={step.title} className="py-6 md:px-5 border-b md:border-b-0 md:border-l border-black/10 first:border-l-0 last:border-b-0"><span className="text-xs font-bold tracking-[0.08em] text-[#6e6e73]">{String(index + 1).padStart(2, '0')}</span><h3 className="mt-4 text-[1.05rem]">{step.title}</h3><p className="mt-3 text-sm leading-6 text-[#6e6e73]">{step.copy}</p></li>)}</ol>
      </section>

      <section className="wr-home-final-v2" aria-labelledby="home-final-title">
        <div className="wr-home-final-v2__inner">
          <span className="wr-eyebrow wr-eyebrow--light">Start with the drawing</span>
          <h2 id="home-final-title">Have a drawing? Let's quote it.</h2>
          <p>Send the drawing, choose a sample direction, or speak directly with the team about the next project.</p>
          <div className="wr-home-final-v2__actions">
            <button className="wr-button wr-button--light" onClick={openRfqBuilder}><Upload />Upload drawing</button>
            <button className="wr-button wr-button--outline-light" onClick={() => setCurrentTab('samples')}><Package />Request a sample</button>
            <button className="wr-button wr-button--outline-light" onClick={() => setCurrentTab('contact')}><MessageCircle />Talk to a specialist</button>
          </div>
        </div>
      </section>
    </div>
  );
};
