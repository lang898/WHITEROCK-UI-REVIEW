import React from 'react';
import { CalendarDays, Mail } from 'lucide-react';
import type { LocaleConfig } from '../types';

interface EventsViewProps {
  currentLocale: LocaleConfig;
  setCurrentTab: (tab: string) => void;
}

export const EventsView: React.FC<EventsViewProps> = ({ setCurrentTab }) => (
  <div className="wr-events-page">
    <header className="wr-catalog-hero wr-catalog-hero--centered">
      <div><span className="wr-eyebrow">Fairs & events</span><h1>Meet WHITEROCK through direct factory conversations.</h1></div>
      <p>Upcoming exhibition schedules and meeting opportunities will be announced here when dates and locations are confirmed.</p>
    </header>
    <section className="wr-events-empty">
      <CalendarDays />
      <span className="wr-eyebrow">Factory contact</span>
      <h2>Discuss your program directly with the manufacturing team.</h2>
      <p>Share your material shortlist, drawings, expected quantity, destination, and target schedule to begin a project review.</p>
      <button className="wr-button wr-button--primary" onClick={() => setCurrentTab('contact')}><Mail />Contact the factory team</button>
    </section>
  </div>
);
