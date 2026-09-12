import React from 'react';
import { ArrowRight, Factory, PackageCheck, Ruler, Ship } from 'lucide-react';
import { factory } from '../../data';
import { Button } from '../../components/ui/Button';

interface CapabilitiesViewProps {
  setCurrentTab: (tab: string) => void;
}

const publishedCapacityLabels = new Set([
  'Vietnam Plant Area',
  'Annual Production Capacity',
  'Monthly Container Output',
]);

const productionScope = [
  { icon: Ruler, title: 'Drawing-led fabrication', copy: 'Cut-to-size dimensions, openings, profiles, sink layouts, and repeat components are controlled from approved drawings and digital files.' },
  { icon: Factory, title: 'Integrated production', copy: 'Cutting, CNC machining, edge processing, polishing, inspection, and packing are coordinated through the Dong Nai manufacturing base.' },
  { icon: PackageCheck, title: 'Order-specific QC', copy: 'Dimensions, thickness, visible finish, openings, labels, and packing are checked against the purchase order and agreed acceptance criteria.' },
  { icon: Ship, title: 'Export preparation', copy: 'Protective packing, crate or rack selection, shipment marks, bracing, and load preparation are confirmed for the product and transport plan.' },
];

export const CapabilitiesView: React.FC<CapabilitiesViewProps> = ({ setCurrentTab }) => {
  const capacityStats = factory.stats.filter((stat) => publishedCapacityLabels.has(stat.label));

  return (
    <div className="wr-landing-page wr-about-capabilities-page">
      <header className="wr-landing-hero wr-landing-hero--dark">
        <span className="wr-eyebrow wr-eyebrow--light">About · Capabilities</span>
        <h1>Manufacturing capacity for repeat stone programs.</h1>
        <p>WHITEROCK combines material review, drawing control, fabrication, inspection, packing, and export preparation at its Dong Nai manufacturing base.</p>
        <div className="wr-landing-hero__actions">
          <Button variant="light" onClick={() => setCurrentTab('factory')}>Review the factory<ArrowRight /></Button>
          <Button variant="outlineLight" onClick={() => setCurrentTab('contact')}>Discuss a program</Button>
        </div>
      </header>

      <section className="wr-factory-stats wr-section-band" aria-label="Published manufacturing capacity">
        {capacityStats.map((stat) => <article key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></article>)}
      </section>

      <section className="wr-section-band wr-section-band--mist" aria-labelledby="capability-scope-title">
        <div className="wr-section-heading wr-section-intro">
          <span className="wr-eyebrow">Production scope</span>
          <h2 id="capability-scope-title">Capacity is useful only when the order controls are connected.</h2>
          <p>The published plant figures describe the manufacturing base. Actual project allocation, material availability, production sequence, and shipment timing are confirmed in the written quotation and production plan.</p>
        </div>
        <div className="wr-landing-grid">
          {productionScope.map(({ icon: Icon, title, copy }) => <article key={title}><Icon /><h2>{title}</h2><p>{copy}</p></article>)}
        </div>
      </section>

      <section className="wr-page-cta">
        <div><span className="wr-eyebrow">Program review</span><h2>Confirm material, drawings, quantity, destination, and target schedule.</h2><p>Capacity allocation and production timing are confirmed against the actual order package.</p></div>
        <div><Button onClick={() => setCurrentTab('contact')}>Contact the team<ArrowRight /></Button></div>
      </section>
    </div>
  );
};
