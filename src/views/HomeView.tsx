import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Factory, FileText, Gauge, MessageCircle, Package, Ruler, ShieldCheck, Ship, Upload } from 'lucide-react';
import { colors } from '../data';
import type { ColorItem, LocaleConfig, ProductItem, RfqCartItem } from '../types';
import type { ShareContent } from '../components/SocialShareModal';
import { HeroCarousel } from '../components/HeroCarousel';
import { MaterialWall } from '../components/MaterialWall';
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

const statItems: Array<{ value: number; suffix?: string; label: string; Icon: StatIcon }> = [
  { value: 20, suffix: '+', label: 'Years stone experience', Icon: Ruler },
  { value: 20000, label: 'm² Vietnam plant', Icon: Factory },
  { value: 100000, suffix: '+', label: 'm² annual capacity', Icon: Gauge },
  { value: 50, label: 'Containers / month', Icon: Ship },
];

const capabilityStages = [
  { number: '01', title: 'Drawing review', copy: 'Dimensions, cutouts, sink details, material direction, quantity, and destination establish the production brief.' },
  { number: '02', title: 'Cutting & CNC', copy: 'Approved drawings govern cutting, openings, profiles, repeat geometry, and machining.' },
  { number: '03', title: 'Finishing', copy: 'Edge processing, polishing, and visible surface finish follow the agreed material and sample direction.' },
  { number: '04', title: 'Quality control', copy: 'Dimensions, openings, surfaces, finish, and order criteria are checked before packing.' },
  { number: '05', title: 'Packing & shipment', copy: 'Protection, labels, bracing, load preparation, and shipment documents close the order path.' },
] as const;

const applications = [
  { title: 'Kitchen', route: 'application-kitchen', image: '/assets/applications/modern-kitchen-inspiration.jpg', copy: 'Countertops, islands, waterfall ends, backsplashes, and coordinated surface directions.' },
  { title: 'Bathroom', route: 'application-bathroom', image: '/assets/applications/master-bath-inspiration.jpg', copy: 'Vanity tops, sink details, wall returns, edges, and wet-area material directions.' },
  { title: 'Furniture', route: 'application-furniture', image: '/assets/owner/countertops/oval-travertine-coffee-top.jpg', copy: 'Dining, coffee, console, and hospitality surfaces shaped around form, thickness, and edge.' },
] as const;

function AnimatedStat({ value, suffix = '', label, Icon }: (typeof statItems)[number]) {
  const ref = useRef<HTMLElement>(null);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) { setDisplayValue(value); return; }
    let frame = 0;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      const start = performance.now();
      const animate = (now: number) => {
        const progress = Math.min(1, (now - start) / 400);
        setDisplayValue(Math.round(value * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) frame = window.requestAnimationFrame(animate);
      };
      frame = window.requestAnimationFrame(animate);
    }, { threshold: 0.35 });
    observer.observe(node);
    return () => { observer.disconnect(); if (frame) window.cancelAnimationFrame(frame); };
  }, [value]);

  return <article ref={ref} className="wr-home-stat"><Icon size={30} strokeWidth={1.2} aria-hidden={true} /><strong>{displayValue.toLocaleString('en-US')}{suffix}</strong><span>{label}</span></article>;
}

function HomeBeforeAfter() {
  const [split, setSplit] = useState(52);
  const color = colors.find((item) => item.slug === 'calacatta-crest') || colors[0];
  const texture = assetPath(color.swatchAvif || color.swatchWebp || color.swatchImage);
  const scene = '/assets/owner/countertops/waterfall-kitchen-island.jpg';
  const mask = 'polygon(0 48%, 72% 28%, 100% 37%, 100% 67%, 29% 88%, 0 76%)';
  return (
    <section className="wr-home-before-after wr-section-band" aria-labelledby="home-before-after-title">
      <div className="wr-section-heading wr-section-intro"><span className="wr-eyebrow">See the surface in context</span><h2 id="home-before-after-title">Move from the original scene to a material preview.</h2><p>Drag the divider to compare the original kitchen image with a simulated stone direction.</p></div>
      <div className="wr-home-before-after__stage">
        <img src={scene} alt="Original waterfall kitchen island scene" width="1600" height="1100" loading="lazy" />
        <div className="wr-home-before-after__preview" style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }} aria-hidden="true"><img src={scene} alt="" width="1600" height="1100" loading="lazy" /><div className="wr-home-before-after__surface" style={{ clipPath: mask, backgroundImage: `url(${texture})` }} /></div>
        <span className="wr-home-before-after__label wr-home-before-after__label--preview">Material preview</span><span className="wr-home-before-after__label wr-home-before-after__label--original">Original</span>
        <div className="wr-home-before-after__divider" style={{ left: `${split}%` }} aria-hidden="true"><i>↔</i></div>
        <input aria-label="Compare original and material preview" type="range" min="0" max="100" value={split} onChange={(event) => setSplit(Number(event.target.value))} />
      </div>
      <p className="wr-home-before-after__note">Simulated material preview for visual direction only.</p>
    </section>
  );
}

export const HomeView: React.FC<HomeViewProps> = ({ setCurrentTab, onSelectColor, onAddColorSample }) => (
  <div className="wr-home wr-home--ultimate">
    <HeroCarousel onExploreProducts={() => setCurrentTab('products')} onRequestQuote={openRfqBuilder} />

    <MaterialWall onSelectColor={onSelectColor} onAddSample={onAddColorSample} />

    <section className="wr-home-brand-story wr-section-band wr-section-band--mist" aria-labelledby="home-brand-story-title">
      <figure><img src="/assets/owner/enhanced/vanity-workshop-overhead-enhanced.jpg" alt="Stone fabrication worktables in the Dong Nai factory" width="1448" height="1086" loading="lazy" /></figure>
      <div><span className="wr-eyebrow">Who we are</span><h2 id="home-brand-story-title">From material selection to finished component, in one production workflow.</h2><p>Natural and engineered stone programs move through material review, approved drawings, cutting, CNC machining, edge processing, polishing, inspection, packing, and shipment preparation from the Vietnam manufacturing base. Keeping those stages connected gives buyers one place to resolve the drawing, sample direction, production criteria, and packing requirements before the order moves forward.</p><button className="wr-text-link" onClick={() => setCurrentTab('about')}>About the manufacturer<ArrowRight /></button></div>
    </section>

    <HomeBeforeAfter />

    <section className="wr-home-capability-band" aria-labelledby="home-capability-title">
      <div className="wr-home-capability-band__intro"><span className="wr-eyebrow wr-eyebrow--light">What we control</span><h2 id="home-capability-title">Five stages, one team.</h2><p>From drawing review to shipment preparation, the production path stays tied to the approved product and order requirements.</p></div>
      <div className="wr-home-stats-v2__inner">{statItems.map((item) => <AnimatedStat key={item.label} {...item} />)}</div>
      <ol className="wr-home-capability-stages">{capabilityStages.map((stage) => <li key={stage.number}><span>{stage.number}</span><h3>{stage.title}</h3><p>{stage.copy}</p></li>)}</ol>
      <button className="wr-button wr-button--outline-light" onClick={() => setCurrentTab('factory')}>Review manufacturing<ArrowRight /></button>
    </section>

    <section className="wr-home-applications wr-section-band" aria-labelledby="home-applications-title">
      <div className="wr-section-heading wr-section-intro"><span className="wr-eyebrow">Where our stone goes</span><h2 id="home-applications-title">Kitchens, bathrooms, furniture, and commercial programs.</h2><p>Start from the finished setting, then move into the material and sample direction.</p></div>
      <div className="wr-home-applications__grid">{applications.map((item) => <article key={item.title}><button type="button" onClick={() => setCurrentTab(item.route)}><figure><img src={item.image} alt={`${item.title} stone application`} width="1200" height="900" loading="lazy" /></figure><div><span className="wr-eyebrow">Application</span><h3>{item.title}</h3><p>{item.copy}</p><strong>See materials<ArrowRight /></strong></div></button></article>)}</div>
      <div className="wr-section-action"><button className="wr-button wr-button--secondary" onClick={() => setCurrentTab('applications')}>Explore all applications<ArrowRight /></button></div>
    </section>

    <section className="wr-home-trust-band wr-section-band wr-section-band--mist" aria-labelledby="home-trust-title">
      <div className="wr-section-heading wr-section-intro"><span className="wr-eyebrow">Documents behind the order</span><h2 id="home-trust-title">Specification, compliance, and support stay visible.</h2><p>Public references, request-only records, and order-specific documentation are separated so buyers know what can be downloaded and what should be requested for the selected product.</p></div>
      <div className="wr-home-trust-band__grid">
        <article><ShieldCheck /><span>Compliance</span><h3>Factory and supply-chain records</h3><p>Available documentation is organized for qualified buyer review without customer logos or unsupported certification claims.</p><button className="wr-text-link" onClick={() => setCurrentTab('factory-compliance')}>Review compliance<ArrowRight /></button></article>
        <article><FileText /><span>Documents</span><h3>TDS, SDS, care, CAD, and packing</h3><p>Use the document center to download public files or request product-specific records.</p><button className="wr-text-link" onClick={() => setCurrentTab('resources-documents')}>Open documents<ArrowRight /></button></article>
        <article><Package /><span>Warranty & support</span><h3>Product documentation by program</h3><p>Warranty and commercial documentation is provided according to the supplied product and applicable program.</p><button className="wr-text-link" onClick={() => setCurrentTab('resources')}>Open resources<ArrowRight /></button></article>
      </div>
    </section>

    <section className="wr-home-final-v2" aria-labelledby="home-final-title">
      <div className="wr-home-final-v2__inner"><span className="wr-eyebrow wr-eyebrow--light">Start with the drawing</span><h2 id="home-final-title">Have a drawing? Let's quote it.</h2><p>Send the drawing, choose a sample direction, or speak directly with the team about the next project.</p><div className="wr-home-final-v2__actions"><button className="wr-button wr-button--light" onClick={openRfqBuilder}><Upload />Upload drawing</button><button className="wr-button wr-button--outline-light" onClick={() => setCurrentTab('samples')}><Package />Request a sample</button><button className="wr-button wr-button--outline-light" onClick={() => setCurrentTab('contact')}><MessageCircle />Talk to a specialist</button></div></div>
    </section>
  </div>
);
