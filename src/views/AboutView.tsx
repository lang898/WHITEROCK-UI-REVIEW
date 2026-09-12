import React from 'react';
import { ArrowRight, Check, Factory, Gem, MapPin, Ship } from 'lucide-react';
import { siteConfig } from '../data';
import { Button } from '../components/ui/Button';
import { routePath } from '../routes';
import type { LocaleConfig } from '../types';

export type AboutSection = 'story' | 'vietnam';

interface AboutViewProps {
  currentLocale: LocaleConfig;
  setCurrentTab: (tab: string) => void;
  onOpenShareModal?: () => void;
  section?: AboutSection;
}

const capabilities = [
  'Bathroom vanity tops with approved sink cutouts and optional assembly',
  'Kitchen counters, islands, waterfall ends, and coordinated backsplashes',
  'Furniture surfaces for dining, coffee, console, and hospitality programs',
  'Commercial cut-to-size components from buyer drawings and schedules',
  'CAD and DXF review for shop drawings, openings, profiles, and labels',
  'Order-specific inspection, protective packing, and load planning',
];

export const AboutView: React.FC<AboutViewProps> = ({ setCurrentTab, section }) => {
  const showStory = !section || section === 'story';
  const showVietnam = !section || section === 'vietnam';

  return (
    <div className="wr-about-page">
      <header className="wr-about-hero">
        <picture><source srcSet="/assets/owner/enhanced/factory-exterior-enhanced-1280.avif" type="image/avif" /><source srcSet="/assets/owner/enhanced/factory-exterior-enhanced-1280.webp" type="image/webp" /><img src="/assets/owner/enhanced/factory-exterior-enhanced.jpg" alt="Stone manufacturing facility in Dong Nai, Vietnam" width="1448" height="1086" fetchPriority="high" /></picture>
        <div />
        <section><span className="wr-eyebrow wr-eyebrow--light">{siteConfig.displayBrand}</span><h1>{section === 'story' ? 'A stone program starts with the material and the drawing.' : section === 'vietnam' ? 'Direct manufacturing in Dong Nai, Vietnam.' : 'Stone experience carried into direct Vietnam manufacturing.'}</h1><p>Natural and engineered stone products are fabricated for B2B programs with material selection, approved drawings, production controls, inspection, packing, and shipment preparation connected in one workflow.</p></section>
      </header>

      {!section && <section className="wr-about-module-grid wr-section-band" aria-label="About sections"><a href={routePath('about-story')} onClick={(event) => { event.preventDefault(); setCurrentTab('about-story'); }}><Gem /><h2>Our Story</h2><p>How material review, drawings, production, and order controls connect.</p><strong>Read the story<ArrowRight /></strong></a><a href={routePath('about-vietnam')} onClick={(event) => { event.preventDefault(); setCurrentTab('about-vietnam'); }}><Factory /><h2>Vietnam Manufacturing</h2><p>How direct fabrication in Dong Nai supports repeat and project stone programs.</p><strong>View manufacturing<ArrowRight /></strong></a></section>}

      {showStory && <section className="wr-about-story wr-section-band wr-section-band--mist" aria-labelledby="about-story-title">
        <div><span className="wr-eyebrow">Our story</span><h2 id="about-story-title">Material knowledge becomes useful when the drawing controls the work.</h2><p>WHITEROCK COMPANY LIMITED operates as a Vietnam stone manufacturer for natural and engineered stone programs. The working model is straightforward: define the material direction, confirm the drawing, control fabrication against the approved requirements, inspect the finished components, then prepare the order for shipment.</p><p>The result is a manufacturing process built around the actual product instead of a generic catalog specification. Vanity tops, kitchen surfaces, furniture pieces, and commercial components all follow the same sequence of material review, drawing approval, production, inspection, and packing.</p><Button variant="secondary" onClick={() => setCurrentTab('factory')}>Review the factory<ArrowRight /></Button></div>
        <figure><picture><source srcSet="/assets/owner/enhanced/vanity-workshop-overhead-enhanced-1280.avif" type="image/avif" /><source srcSet="/assets/owner/enhanced/vanity-workshop-overhead-enhanced-1280.webp" type="image/webp" /><img src="/assets/owner/enhanced/vanity-workshop-overhead-enhanced.jpg" alt="Vanity tops arranged across production worktables" width="1448" height="1086" loading="lazy" /></picture><figcaption>Vanity-top production overview</figcaption></figure>
      </section>}

      {showVietnam && <section className="wr-about-vietnam wr-section-band" aria-labelledby="about-vietnam-title"><div className="wr-section-heading wr-section-intro"><span className="wr-eyebrow">Vietnam manufacturing</span><h2 id="about-vietnam-title">Direct production for stone programs in Dong Nai.</h2><p>Cutting, CNC machining, edge processing, polishing, dimensional inspection, finish review, protective packing, and shipment preparation are coordinated from the Vietnam manufacturing base.</p></div><div className="wr-about-capabilities"><div>{capabilities.map((capability) => <article key={capability}><Check /><span>{capability}</span></article>)}</div></div></section>}

      <section className="wr-about-contact wr-section-band wr-section-band--mist"><article><Factory /><h3>Legal entity</h3><p>{siteConfig.legalName}</p></article><article><MapPin /><h3>Factory</h3><p>{siteConfig.address}</p></article><article><Ship /><h3>Export desk</h3><p>{siteConfig.email}<br />{siteConfig.tel}</p></article><div><Gem /><h2>Discuss a material or production program.</h2><Button onClick={() => setCurrentTab('contact')}>Contact the team<ArrowRight /></Button></div></section>
    </div>
  );
};
