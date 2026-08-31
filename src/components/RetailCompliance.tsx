import { BadgeCheck, ClipboardCheck, ShieldCheck } from 'lucide-react';

const assessments = [
  {
    code: 'SCAN',
    title: 'Supply-chain security controls',
    description: 'Manufacturing and supply-chain controls aligned with retailer program requirements.',
    Icon: ShieldCheck,
  },
  {
    code: 'RESA',
    title: 'Responsible sourcing controls',
    description: 'Factory and supply-chain compliance assessment documentation is available for buyer review.',
    Icon: ClipboardCheck,
  },
  {
    code: 'QSA',
    title: 'Quality system controls',
    description: 'Quality-management and production-control systems assessed for retailer program requirements.',
    Icon: BadgeCheck,
  },
] as const;

interface RetailComplianceProps {
  compact?: boolean;
}

export const RetailCompliance: React.FC<RetailComplianceProps> = ({ compact = false }) => (
  <section className={`wr-compliance${compact ? ' wr-compliance--compact' : ''}`} aria-labelledby={`retail-compliance-title${compact ? '-compact' : ''}`}>
    <div className="wr-compliance__inner">
      <div className="wr-compliance__heading">
        <p className="wr-eyebrow">THD Program Assessment Experience</p>
        <h2 id={`retail-compliance-title${compact ? '-compact' : ''}`}>Retail &amp; Supply Chain Compliance</h2>
        <p>WHITEROCK maintains manufacturing, quality, and supply-chain systems aligned with major North American retail program requirements.</p>
      </div>

      <div className="wr-compliance__grid">
        {assessments.map(({ code, title, description, Icon }) => (
          <article className="wr-compliance__card" key={code}>
            <div className="wr-compliance__icon" aria-hidden="true"><Icon size={22} strokeWidth={1.6} /></div>
            <p className="wr-compliance__code">{code}</p>
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </div>

      <p className="wr-compliance__note">Assessment acronyms are shown as used in program documentation. Supporting records are available upon request.</p>
    </div>
  </section>
);
