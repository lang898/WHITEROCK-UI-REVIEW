import React from 'react';
import type { LocaleConfig } from '../types';

interface AdminViewProps {
  currentLocale: LocaleConfig;
  setCurrentTab: (tab: string) => void;
}

/**
 * Public builds intentionally contain no customer, inquiry, quotation or project records.
 * A future administration workspace must use a separately authenticated application or
 * a server-enforced authentication boundary before any operational data is introduced.
 */
export const AdminView: React.FC<AdminViewProps> = ({ setCurrentTab }) => (
  <section className="wr-admin-disabled wr-section-band" aria-labelledby="admin-disabled-title">
    <span className="wr-eyebrow">Private workspace</span>
    <h1 id="admin-disabled-title">Administration is not available on the public website.</h1>
    <p>This production build does not contain customer records, inquiry records, quotations or project administration data.</p>
    <button className="wr-button wr-button--primary" onClick={() => setCurrentTab('home')}>Return to website</button>
  </section>
);
