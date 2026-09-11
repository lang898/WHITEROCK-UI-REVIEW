import { BadgeCheck, ClipboardCheck, ShieldCheck } from 'lucide-react';
import complianceData from '../../data/compliance.json';

type ComplianceStatus = 'public' | 'available-on-request' | 'order-specific';

type ComplianceProgram = {
  code: string;
  title: string;
  description: string;
  status: ComplianceStatus;
};

const iconByCode: Record<string, typeof ShieldCheck> = {
  SCAN: ShieldCheck,
  RESA: ClipboardCheck,
  QSA: BadgeCheck,
};

interface RetailComplianceProps {
  compact?: boolean;
}

export const RetailCompliance: React.FC<RetailComplianceProps> = ({ compact = false }) => {
  const programs = complianceData.programs as ComplianceProgram[];
  const statusLabels = complianceData.statusLabels as Record<ComplianceStatus, string>;

  return (
    <section className={`wr-compliance${compact ? ' wr-compliance--compact' : ''}`} aria-labelledby={`retail-compliance-title${compact ? '-compact' : ''}`}>
      <div className="wr-compliance__inner">
        <div className="wr-compliance__heading">
          <p className="wr-eyebrow">{complianceData.eyebrow}</p>
          <h2 id={`retail-compliance-title${compact ? '-compact' : ''}`}>{complianceData.title}</h2>
          <p>{complianceData.intro}</p>
        </div>

        <div className="wr-compliance__grid">
          {programs.map(({ code, title, description, status }) => {
            const Icon = iconByCode[code] || ClipboardCheck;
            return (
              <article className="wr-compliance__card" key={code}>
                <div className="wr-compliance__icon" aria-hidden="true"><Icon size={22} strokeWidth={1.6} /></div>
                <p className="wr-compliance__code">{code}</p>
                <h3>{title}</h3>
                <p>{description}</p>
                <span className={`wr-compliance__status is-${status}`}>{statusLabels[status]}</span>
              </article>
            );
          })}
        </div>

        <p className="wr-compliance__note">Assessment terminology follows buyer-program documentation. No certification claim is made here; current scope and supporting records are confirmed before release.</p>
      </div>
    </section>
  );
};
