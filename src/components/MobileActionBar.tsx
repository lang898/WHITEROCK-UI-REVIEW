import React from 'react';
import { FileText, Package } from 'lucide-react';

interface MobileActionBarProps {
  sampleCount: number;
  rfqCount: number;
  onSamples: () => void;
  onRfq: () => void;
}

export function MobileActionBar({ sampleCount, rfqCount, onSamples, onRfq }: MobileActionBarProps) {
  return (
    <nav className="wr-mobile-action-bar" aria-label="Buyer actions">
      <button type="button" onClick={onSamples}><Package /><span>Samples</span>{sampleCount > 0 && <b>{sampleCount}</b>}</button>
      <button type="button" onClick={onRfq}><FileText /><span>RFQ</span>{rfqCount > 0 && <b>{rfqCount}</b>}</button>
    </nav>
  );
}
