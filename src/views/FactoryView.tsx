import React, { useState } from 'react';
import { ArrowRight, Check, FileCheck2, PackageCheck, Ruler } from 'lucide-react';
import { factory } from '../data';
import { Button } from '../components/ui/Button';
import { RetailCompliance } from '../components/RetailCompliance';
import type { LocaleConfig } from '../types';

interface FactoryViewProps {
  currentLocale: LocaleConfig;
  setCurrentTab: (tab: string) => void;
}

const capabilityTabs = [
  {
    id: 'cutting',
    label: 'Cutting',
    title: 'Cut-to-size production from approved drawings.',
    copy: 'Stone components are nested, cut, and routed to the dimensions and openings defined in the order documents.',
    image: '/assets/owner/enhanced/cnc-cutting-line-enhanced.jpg',
    alt: 'Stone cutting line inside the WHITEROCK Vietnam factory',
  },
  {
    id: 'cnc',
    label: 'CNC',
    title: 'Machining for openings, profiles, and repeat components.',
    copy: 'Digital files guide sink cutouts, faucet holes, profiles, and repeatable component geometry for the agreed product.',
    image: '/assets/owner/enhanced/edge-processing-line-enhanced.jpg',
    alt: 'Stone machining equipment in the production hall',
  },
  {
    id: 'polishing',
    label: 'Polishing',
    title: 'Edge and surface finishing to the approved sample.',
    copy: 'Automated and manual stations are used for straight edges, profiles, surface preparation, and final finish review.',
    image: '/assets/owner/enhanced/manual-profile-polishing-enhanced.jpg',
    alt: 'Manual profile polishing station for stone components',
  },
  {
    id: 'quality',
    label: 'Quality',
    title: 'Inspection checkpoints tied to the purchase order.',
    copy: 'Material range, dimensions, openings, alignment, surface finish, edge finish, labels, and packing are reviewed against the agreed criteria.',
    image: '/assets/owner/enhanced/quality-inspection-team-enhanced.jpg',
    alt: 'Quality review of finished stone components on production racks',
  },
  {
    id: 'packing',
    label: 'Packing',
    title: 'Packing planned around the product and transport route.',
    copy: 'Protective materials, cartons, crates, racks, labels, moisture protection, and bracing are selected for the confirmed load plan.',
    image: '/assets/owner/enhanced/material-staging-hall-enhanced.jpg',
    alt: 'Finished stone components staged before packing',
  },
] as const;

export const FactoryView: React.FC<FactoryViewProps> = ({ setCurrentTab }) => {
  const [activeCapability, setActiveCapability] = useState<(typeof capabilityTabs)[number]['id']>('cutting');
  const active = capabilityTabs.find((item) => item.id === activeCapability) || capabilityTabs[0];

  return (
    <div className="wr-factory-page">
      <header className="wr-factory-page__hero">
        <img src="/assets/owner/enhanced/production-hall-aisle-enhanced.jpg" alt="Stone production hall at the WHITEROCK Vietnam factory" width="1448" height="1086" fetchPriority="high" />
        <div className="wr-factory-page__overlay" />
        <div className="wr-factory-page__intro">
          <span className="wr-eyebrow wr-eyebrow--light">Binh Phuoc · Vietnam</span>
          <h1>Direct stone manufacturing, organized around the drawing.</h1>
          <p>WHITEROCK operates a 20,000 m² stone manufacturing site for vanity tops, kitchen countertops, furniture surfaces, and project components.</p>
        </div>
      </header>

      <section className="wr-factory-stats wr-section-band" aria-label="Factory figures">
        {factory.stats.slice(0, 4).map((stat) => <article key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></article>)}
      </section>

      <section className="wr-factory-capability wr-section-band wr-section-band--mist" aria-labelledby="factory-capability-title">
        <div className="wr-section-heading wr-section-intro">
          <span className="wr-eyebrow">Manufacturing capability</span>
          <h2 id="factory-capability-title">Five production stages, one approved specification.</h2>
          <p>Move through the process to see where material, geometry, finish, inspection, and packing decisions are controlled.</p>
        </div>
        <div className="wr-factory-tabs" role="tablist" aria-label="Factory capabilities">
          {capabilityTabs.map((item) => <button key={item.id} role="tab" aria-selected={activeCapability === item.id} className={activeCapability === item.id ? 'is-active' : ''} onClick={() => setActiveCapability(item.id)}>{item.label}</button>)}
        </div>
        <article className="wr-factory-tab-panel" role="tabpanel">
          <img src={active.image} alt={active.alt} width="1448" height="1086" loading="lazy" />
          <div><span>{active.label}</span><h3>{active.title}</h3><p>{active.copy}</p><ul>{factory.flowSteps.map((step) => <li key={step.number}><Check />{step.title}</li>)}</ul></div>
        </article>
      </section>

      <RetailCompliance compact />

      <section className="wr-factory-controls wr-section-band wr-section-band--mist" aria-labelledby="factory-controls-title">
        <div className="wr-section-heading wr-section-intro"><span className="wr-eyebrow">Order controls</span><h2 id="factory-controls-title">Quality evidence follows the agreed acceptance plan.</h2></div>
        <div className="wr-factory-controls__grid">
          <article><Ruler /><h3>Dimensional inspection</h3><p>Overall dimensions, openings, faucet holes, sink alignment, and profiles are checked against the approved drawing.</p></article>
          <article><FileCheck2 /><h3>Documented criteria</h3><p>Sampling method, acceptance limits, rework rules, labels, and inspection records are agreed for the order.</p></article>
          <article><PackageCheck /><h3>Packing review</h3><p>Packing materials and container loading are calculated from the final bill of materials and transport plan.</p></article>
        </div>
      </section>

      <section className="wr-factory-cta wr-section-band">
        <div><span className="wr-eyebrow">Factory-led quotation</span><h2>Share the drawing, quantity, destination, and target schedule.</h2><p>We will review the material, fabrication route, inspection points, and packing method as one order package.</p></div>
        <Button onClick={() => setCurrentTab('contact')}>Start an RFQ<ArrowRight /></Button>
      </section>
    </div>
  );
};
