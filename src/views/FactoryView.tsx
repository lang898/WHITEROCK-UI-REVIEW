import React, { useState } from 'react';
import { ArrowRight, FileCheck2, PackageCheck, Ruler } from 'lucide-react';
import { factory, photoGalleries } from '../data';
import { Button } from '../components/ui/Button';
import { PhotoReferenceRail } from '../components/PhotoReferenceRail';
import { RetailCompliance } from '../components/RetailCompliance';
import { openRfqBuilder } from '../lib/uiEvents';
import type { LocaleConfig, PhotoReferenceItem } from '../types';

interface FactoryViewProps {
  currentLocale: LocaleConfig;
  setCurrentTab: (tab: string) => void;
}

const capabilityTabs = [
  {
    id: 'cutting', label: 'Cutting', title: 'Cut-to-size production from approved drawings.',
    copy: 'Stone components are nested, cut, and routed to the dimensions and openings defined in the order documents.',
    image: '/assets/owner/enhanced/cnc-cutting-line-enhanced.jpg', alt: 'Stone cutting line inside the Vietnam factory',
    controls: 'Overall dimensions, part geometry, layout and primary openings', evidence: 'Cutting-line and staged-component production photographs', confirmedBy: 'Approved production drawing',
  },
  {
    id: 'cnc', label: 'CNC', title: 'Machining for openings, profiles, and repeat components.',
    copy: 'Digital files guide sink cutouts, faucet holes, profiles, and repeatable component geometry for the agreed product.',
    image: '/assets/owner/enhanced/edge-processing-line-enhanced.jpg', alt: 'Stone machining equipment in the production hall',
    controls: 'Sink cutouts, faucet holes, profiles and repeat component geometry', evidence: 'CNC / machining production photographs and dimensional checks', confirmedBy: 'Approved drawing and digital file',
  },
  {
    id: 'polishing', label: 'Polishing', title: 'Edge and surface finishing to the approved sample.',
    copy: 'Automated and manual stations are used for straight edges, profiles, surface preparation, and final finish review.',
    image: '/assets/owner/enhanced/manual-profile-polishing-enhanced.jpg', alt: 'Manual profile polishing station for stone components',
    controls: 'Edge shape, surface finish, visible workmanship and approved appearance', evidence: 'Edge-processing and hand-finishing production photographs', confirmedBy: 'Approved sample and drawing',
  },
  {
    id: 'quality', label: 'Quality', title: 'Inspection checkpoints tied to the purchase order.',
    copy: 'Material range, dimensions, openings, alignment, surface finish, edge finish, labels, and packing are reviewed against the agreed criteria.',
    image: '/assets/owner/qc/digital-thickness-inspection.jpg', alt: 'Digital caliper measuring a polished stone component',
    controls: 'Dimensions, thickness, surface, openings, finish, labels and agreed acceptance points', evidence: 'Instrument readings, inspection photographs and order records', confirmedBy: 'PO, approved drawing and acceptance plan',
  },
  {
    id: 'packing', label: 'Packing', title: 'Packing planned around the product and transport route.',
    copy: 'Protective materials, cartons, crates, racks, labels, moisture protection, and bracing are selected for the confirmed load plan.',
    image: '/assets/owner/enhanced/material-staging-hall-enhanced.jpg', alt: 'Finished stone components staged before packing',
    controls: 'Protection, labels, unit count, handling method, bracing and load preparation', evidence: 'Packing records, marks and staged-order photographs', confirmedBy: 'Approved packing plan and shipment documents',
  },
] as const;

const assetUrl = (asset: string) => asset.startsWith('/') ? asset : `/${asset}`;

export const FactoryView: React.FC<FactoryViewProps> = () => {
  const [activeCapability, setActiveCapability] = useState<(typeof capabilityTabs)[number]['id']>('cutting');
  const [activeEvidenceId, setActiveEvidenceId] = useState<'finished' | 'manufacturing' | 'quality'>('finished');
  const active = capabilityTabs.find((item) => item.id === activeCapability) || capabilityTabs[0];
  const layoutReference: PhotoReferenceItem = {
    id: 'slab-layout-review', image: assetUrl(factory.qc.manufacturingReference.image), imageWebp: assetUrl(factory.qc.manufacturingReference.imageWebp), imageAvif: assetUrl(factory.qc.manufacturingReference.imageAvif), alt: factory.qc.manufacturingReference.imageAlt, caption: factory.qc.manufacturingReference.caption, width: factory.qc.manufacturingReference.width, height: factory.qc.manufacturingReference.height,
  };
  const existingQualityReferences: PhotoReferenceItem[] = factory.qc.media.map((item) => ({
    id: item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'), image: assetUrl(item.image), imageWebp: assetUrl(item.imageWebp), imageAvif: assetUrl(item.imageAvif), alt: item.imageAlt, caption: item.caption, width: item.width, height: item.height,
  }));
  const evidenceGroups = {
    finished: { label: 'Finished tops', title: 'Finished products across current production references.', copy: 'Multiple sizes, materials, opening layouts, backsplashes, and edge profiles are documented as production references.', items: photoGalleries.productProduction },
    manufacturing: { label: 'Material & layout', title: 'Material faces, layout marks, and fabrication staging.', copy: 'These records show how material movement, component position, cutouts, and large-format pieces are reviewed before the next production step.', items: [layoutReference, ...photoGalleries.manufacturingReferences] },
    quality: { label: 'Quality checks', title: 'Instrument readings and visual inspection records.', copy: 'Thickness, gloss, and marked surface features are documented against the acceptance criteria agreed for the order.', items: [...existingQualityReferences, ...photoGalleries.qualityReferences] },
  } as const;
  const activeEvidence = evidenceGroups[activeEvidenceId];

  return (
    <div className="wr-factory-page">
      <header className="wr-factory-page__hero">
        <picture>
          <source srcSet="/assets/owner/enhanced/production-hall-aisle-enhanced-1280.webp" type="image/webp" />
          <img src="/assets/owner/enhanced/production-hall-aisle-enhanced.jpg" alt="Stone production hall at the Vietnam factory" width="1448" height="1086" loading="eager" fetchPriority="high" />
        </picture>
        <div className="wr-factory-page__overlay" />
        <div className="wr-factory-page__intro">
          <span className="wr-eyebrow wr-eyebrow--light">Dong Nai · Vietnam</span>
          <h1>Direct stone manufacturing, organized around the drawing.</h1>
          <p>The current public factory profile describes a 20,000 m² manufacturing site for vanity tops, kitchen countertops, furniture surfaces, and project components. Published capacity figures remain subject to owner confirmation.</p>
        </div>
      </header>

      <section className="wr-factory-stats wr-section-band" aria-label="Factory figures">
        {factory.stats.slice(0, 4).map((stat) => <article key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></article>)}
      </section>

      <section className="wr-factory-capability wr-section-band wr-section-band--mist" aria-labelledby="factory-capability-title">
        <div className="wr-section-heading wr-section-intro">
          <span className="wr-eyebrow">Manufacturing capability</span>
          <h2 id="factory-capability-title">Five stages tied to documented controls.</h2>
          <p>Each stage shows what is controlled, what evidence is available, and which order document governs acceptance.</p>
        </div>
        <div className="wr-factory-tabs" role="tablist" aria-label="Factory capabilities">
          {capabilityTabs.map((item) => <button key={item.id} role="tab" aria-selected={activeCapability === item.id} className={activeCapability === item.id ? 'is-active' : ''} onClick={() => setActiveCapability(item.id)}>{item.label}</button>)}
        </div>
        <article className="wr-factory-tab-panel" role="tabpanel">
          <img src={active.image} alt={active.alt} width="1448" height="1086" loading="lazy" />
          <div><span>{active.label}</span><h3>{active.title}</h3><p>{active.copy}</p></div>
        </article>
        <dl className="wr-factory-evidence-matrix">
          <div><dt>Controls</dt><dd>{active.controls}</dd></div>
          <div><dt>Evidence</dt><dd>{active.evidence}</dd></div>
          <div><dt>Confirmed by</dt><dd>{active.confirmedBy}</dd></div>
        </dl>
      </section>

      <section className="wr-factory-proof wr-section-band" aria-labelledby="factory-proof-title">
        <div className="wr-section-heading wr-section-intro">
          <span className="wr-eyebrow">Production evidence</span>
          <h2 id="factory-proof-title">Products, process, and inspection in one evidence library.</h2>
          <p>Production photography is grouped by decision stage. Final acceptance remains tied to the approved drawing and order criteria.</p>
        </div>
        <div className="wr-evidence-tabs" role="tablist" aria-label="Production evidence groups">
          {(Object.keys(evidenceGroups) as Array<keyof typeof evidenceGroups>).map((id) => (
            <button key={id} type="button" role="tab" aria-selected={activeEvidenceId === id} className={activeEvidenceId === id ? 'is-active' : ''} onClick={() => setActiveEvidenceId(id)}>{evidenceGroups[id].label}<span>{evidenceGroups[id].items.length}</span></button>
          ))}
        </div>
        <div className="wr-evidence-panel" role="tabpanel">
          <div className="wr-evidence-panel__heading"><h3>{activeEvidence.title}</h3><p>{activeEvidence.copy}</p></div>
          <PhotoReferenceRail items={[...activeEvidence.items]} ariaLabel={`${activeEvidence.label} photographic references`} />
        </div>
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
        <div><span className="wr-eyebrow">Factory-led quotation</span><h2>Share the drawing, quantity, destination, and target schedule.</h2><p>Material, fabrication route, inspection points, and packing method are reviewed as one order package.</p></div>
        <Button onClick={openRfqBuilder}>Start an RFQ<ArrowRight /></Button>
      </section>
    </div>
  );
};
