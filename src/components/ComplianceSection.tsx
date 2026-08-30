import React from 'react';
import { ClipboardCheck, ShieldCheck, SlidersHorizontal } from 'lucide-react';

type ComplianceSectionProps = {
  compact?: boolean;
};

const credentials = [
  {
    code: 'SCAN',
    title: 'Supply-Chain Security Assessment',
    description: 'Manufacturing and supply-chain controls reviewed against retailer program requirements.',
    Icon: ShieldCheck,
  },
  {
    code: 'RESA',
    title: 'Responsible Sourcing Assessment',
    description: 'Factory and responsible-sourcing compliance assessment documentation available for buyer review.',
    Icon: ClipboardCheck,
  },
  {
    code: 'QSA',
    title: 'Quality System Assessment',
    description: 'Quality-management and production-control systems assessed for retailer program requirements.',
    Icon: SlidersHorizontal,
  },
] as const;

export const ComplianceSection: React.FC<ComplianceSectionProps> = ({ compact = false }) => (
  <section className={`wr-compliance wr-section-band${compact ? ' wr-compliance--compact' : ''}`} aria-labelledby={compact ? 'factory-compliance-title' : 'home-compliance-title'}>
    <div className="wr-section-heading wr-section-intro">
      <span className="wr-eyebrow">THD Program Assessment Experience</span>
      <h2 id={compact ? 'factory-compliance-title' : 'home-compliance-title'}>Retail &amp; Supply Chain Compliance</h2>
      <p>WHITEROCK maintains manufacturing, quality and supply-chain systems aligned with major North American retail program requirements.</p>
    </div>

    <div className="wr-compliance__grid">
      {credentials.map(({ code, title, description, Icon }) => (
        <article key={code} className="wr-compliance-card">
          <div className="wr-compliance-card__icon" aria-hidden="true"><Icon /></div>
          <span className="wr-compliance-card__code">{code}</span>
          <h3>{title}</h3>
          <p>{description}</p>
        </article>
      ))}
    </div>

    <p className="wr-compliance__note">Assessment documentation available upon request.</p>
  </section>
);
