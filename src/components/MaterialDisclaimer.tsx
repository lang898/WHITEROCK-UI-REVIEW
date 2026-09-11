import React from 'react';
import { materialDisclaimers, type MaterialDisclaimerType } from '../data/disclaimers';

interface MaterialDisclaimerProps {
  type: MaterialDisclaimerType;
  compact?: boolean;
  className?: string;
}

export function MaterialDisclaimer({ type, compact = false, className = '' }: MaterialDisclaimerProps) {
  const disclaimer = materialDisclaimers[type];
  return (
    <aside className={`wr-material-disclaimer${compact ? ' wr-material-disclaimer--compact' : ''} ${className}`.trim()}>
      <strong>{disclaimer.title}.</strong>{' '}
      <span>{disclaimer.text}</span>
    </aside>
  );
}
