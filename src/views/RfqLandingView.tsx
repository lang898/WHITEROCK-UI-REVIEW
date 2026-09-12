import React from 'react';
import { FileText, Package, Upload } from 'lucide-react';
import { openRfqBuilder } from '../lib/uiEvents';

interface RfqLandingViewProps {
  setCurrentTab: (tab: string) => void;
}

export const RfqLandingView: React.FC<RfqLandingViewProps> = ({ setCurrentTab }) => (
  <div className="wr-landing-page">
    <header className="wr-landing-hero wr-landing-hero--dark">
      <span className="wr-eyebrow wr-eyebrow--light">Request for quotation</span>
      <h1>Start with the drawing.</h1>
      <p>Bring the drawing, material direction, quantity, destination, and target schedule into one quotation package.</p>
      <div className="wr-landing-hero__actions">
        <button className="wr-button wr-button--light" onClick={openRfqBuilder}><Upload />Open RFQ Builder</button>
        <button className="wr-button wr-button--outline-light" onClick={() => setCurrentTab('samples')}><Package />Build Sample Box</button>
      </div>
    </header>
    <section className="wr-landing-grid wr-section-band">
      <article><span>01</span><FileText /><h2>Drawing</h2><p>Upload the project drawing or describe the required dimensions, openings, edge details, and assembly scope.</p></article>
      <article><span>02</span><Package /><h2>Material</h2><p>Add shortlisted colors or products so the quotation starts from a clear physical-sample direction.</p></article>
      <article><span>03</span><Upload /><h2>Project details</h2><p>Add quantity, destination, and schedule so fabrication, packing, and shipment assumptions can be reviewed together.</p></article>
    </section>
    <section className="wr-page-cta"><div><span className="wr-eyebrow">Ready to quote</span><h2>Keep the drawing and material shortlist in one RFQ.</h2></div><button className="wr-button wr-button--primary" onClick={openRfqBuilder}>Open RFQ Builder</button></section>
  </div>
);
