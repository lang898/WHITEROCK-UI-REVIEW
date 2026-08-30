import React from 'react';
import { ArrowRight, Check, Factory, Gem, MapPin, Ship } from 'lucide-react';
import { factory, siteConfig } from '../data';
import { Button } from '../components/ui/Button';
import type { LocaleConfig } from '../types';

interface AboutViewProps {
  currentLocale: LocaleConfig;
  setCurrentTab: (tab: string) => void;
  onOpenShareModal?: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ setCurrentTab }) => {
  const capabilities = [
    'Bathroom vanity tops with approved sink cutouts and optional assembly',
    'Kitchen counters, islands, waterfall ends, and coordinated backsplashes',
    'Furniture surfaces for dining, coffee, console, and hospitality programs',
    'Commercial cut-to-size components from buyer drawings and schedules',
    'CAD and DXF review for shop drawings, openings, profiles, and labels',
    'Order-specific inspection, protective packing, and load planning',
  ];

  return (
    <div className="wr-about-page">
      <header className="wr-about-hero">
        <img src="/assets/owner/enhanced/factory-exterior-enhanced.jpg" alt="WHITEROCK stone manufacturing facility in Binh Phuoc, Vietnam" width="1448" height="1086" fetchPriority="high" />
        <div />
        <section>
          <span className="wr-eyebrow wr-eyebrow--light">WHITEROCK company profile</span>
          <h1>Stone experience carried into direct Vietnam manufacturing.</h1>
          <p>WHITEROCK manufactures natural and engineered stone products in Binh Phuoc Province for international B2B buyers, with specifications and commercial terms confirmed for each project.</p>
        </section>
      </header>

      <section className="wr-about-facts wr-section-band" aria-label="Company figures">
        {factory.stats.slice(0, 4).map((stat) => <article key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></article>)}
      </section>

      <section className="wr-about-story wr-section-band wr-section-band--mist" aria-labelledby="about-story-title">
        <div><span className="wr-eyebrow">Our manufacturing approach</span><h2 id="about-story-title">Craft knowledge, industrial discipline, clear order documents.</h2><p>More than two decades of stone-industry experience inform how the team reviews natural variation, engineered surface consistency, fabrication details, inspection, and packing. The 20,000 m² Vietnam facility supports an annual production capacity above 100,000 m² and monthly output of up to 50 containers.</p><Button variant="secondary" onClick={() => setCurrentTab('factory')}>Review the factory<ArrowRight /></Button></div>
        <figure><img src="/assets/owner/enhanced/vanity-workshop-overhead-enhanced.jpg" alt="Vanity tops arranged across production worktables" width="1448" height="1086" loading="lazy" /><figcaption>Vanity-top production overview</figcaption></figure>
      </section>

      <section className="wr-about-capabilities wr-section-band" aria-labelledby="about-capabilities-title">
        <div className="wr-section-heading wr-section-intro"><span className="wr-eyebrow">Core programs</span><h2 id="about-capabilities-title">One manufacturing partner across the stone package.</h2><p>The scope begins with a sample, drawing, quantity, destination, and schedule, then moves through written approval and order-specific production controls.</p></div>
        <div>{capabilities.map((capability) => <article key={capability}><Check /><span>{capability}</span></article>)}</div>
      </section>

      <section className="wr-about-contact wr-section-band wr-section-band--mist">
        <article><Factory /><h3>Legal entity</h3><p>{siteConfig.legalName}</p></article>
        <article><MapPin /><h3>Factory</h3><p>{siteConfig.address}</p></article>
        <article><Ship /><h3>Export desk</h3><p>{siteConfig.email}<br />{siteConfig.tel}</p></article>
        <div><Gem /><h2>Discuss a material or production program.</h2><Button onClick={() => setCurrentTab('contact')}>Contact the team<ArrowRight /></Button></div>
      </section>
    </div>
  );
};
