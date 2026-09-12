import React from 'react';
import { ArrowRightLeft, Layers3, Package } from 'lucide-react';

interface CompareLandingViewProps {
  setCurrentTab: (tab: string) => void;
  selectionCount: number;
}

export const CompareLandingView: React.FC<CompareLandingViewProps> = ({ setCurrentTab, selectionCount }) => (
  <div className="wr-landing-page">
    <header className="wr-landing-hero">
      <span className="wr-eyebrow">Material & product comparison</span>
      <h1>Compare the shortlist before you sample it.</h1>
      <p>Select up to three products or colors from the catalog. The comparison tray keeps material, thickness, finish, technical references, and application guidance together.</p>
      <div className="wr-landing-hero__actions">
        <button className="wr-button wr-button--primary" onClick={() => setCurrentTab('materials')}><Layers3 />Browse Materials</button>
        <button className="wr-button wr-button--secondary" onClick={() => setCurrentTab('colors')}><ArrowRightLeft />Browse Colors</button>
      </div>
    </header>
    <section className="wr-compare-landing-status wr-section-band">
      <ArrowRightLeft />
      <div><span className="wr-eyebrow">Current shortlist</span><h2>{selectionCount ? `${selectionCount} item${selectionCount === 1 ? '' : 's'} selected` : 'No items selected yet'}</h2><p>{selectionCount >= 2 ? 'Open the comparison tray at the bottom of the screen to review the selected items side by side.' : 'Choose Compare on material or product cards. Two or three items unlock the full comparison view.'}</p></div>
      <button className="wr-button wr-button--secondary" onClick={() => setCurrentTab('samples')}><Package />Sample Box</button>
    </section>
  </div>
);
