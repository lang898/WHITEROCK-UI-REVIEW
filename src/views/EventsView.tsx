import React from 'react';
import { CalendarX, Mail } from 'lucide-react';
import type { LocaleConfig } from '../types';

interface EventsViewProps {
  currentLocale: LocaleConfig;
  setCurrentTab: (tab: string) => void;
}

export const EventsView: React.FC<EventsViewProps> = ({ setCurrentTab }) => (
  <div className="wr-events-page">
    <header className="wr-catalog-hero wr-catalog-hero--centered">
      <div><span className="wr-eyebrow">Fairs & events</span><h1>No WHITEROCK trade-fair participation is currently published.</h1></div>
      <p>WHITEROCK has not provided any past or upcoming exhibition participation record. This page remains available only as a controlled framework for owner-approved announcements.</p>
    </header>
    <section className="wr-events-empty">
      <CalendarX />
      <span className="wr-eyebrow">No event schedule</span>
      <h2>Direct factory conversations remain available year-round.</h2>
      <p>No fair names, booth numbers, dates, venues, sponsorships, or attendance claims will be added without written owner confirmation.</p>
      <button className="wr-button wr-button--primary" onClick={() => setCurrentTab('contact')}><Mail />Contact the factory team</button>
    </section>
  </div>
);
