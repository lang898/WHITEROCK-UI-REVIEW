import React, { useState } from 'react';
import { ChevronRight, Layers3 } from 'lucide-react';
import { applications, colors } from '../data';
import type { ColorItem, LocaleConfig } from '../types';

interface ApplicationsViewProps {
  onSelectColor: (color: ColorItem) => void;
  currentLocale: LocaleConfig;
}

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({ onSelectColor }) => {
  const [selectedCat, setSelectedCat] = useState('All');
  const categories = ['All', 'Kitchen', 'Bathroom', 'Hotel', 'Commercial'];
  const filteredApps = applications.filter((app) => {
    if (selectedCat === 'All') return true;
    const category = app.category.toLowerCase();
    if (selectedCat === 'Kitchen') return category.includes('kitchen');
    if (selectedCat === 'Bathroom') return category.includes('bath') || category.includes('multi-family');
    if (selectedCat === 'Hotel') return category.includes('hospitality') || category.includes('hotel');
    return ['commercial', 'restaurant', 'retail', 'furniture', 'outdoor'].some((term) => category.includes(term));
  });

  return (
    <div className="wr-applications-page">
      <header className="wr-catalog-hero wr-catalog-hero--centered">
        <div><span className="wr-eyebrow">Applications and inspiration</span><h1>See how stone changes the character of a space.</h1></div>
        <p>Filter by kitchen, bathroom, hotel, or commercial use, then move from visual direction to a physical sample and project drawing.</p>
      </header>

      <section className="wr-application-filter" aria-label="Filter applications by space">
        <div role="tablist" aria-label="Application spaces">
          {categories.map((category) => <button role="tab" aria-selected={selectedCat === category} key={category} className={selectedCat === category ? 'is-active' : ''} onClick={() => setSelectedCat(category)}>{category}</button>)}
        </div>
        <span>{filteredApps.length} application directions</span>
      </section>

      <section className="wr-application-grid" aria-live="polite">
        {filteredApps.map((item) => {
          const matchedColor = colors.find((color) => color.slug === item.featuredColorSlug);
          return (
            <article key={item.title}>
              <div className="wr-application-card__media"><img src={item.image} alt={item.imageAlt} width="1200" height="900" loading="lazy" /><span>{item.category}</span></div>
              <div className="wr-application-card__body"><small>Application direction</small><h2>{item.title}</h2><p>{item.description}</p><footer><span><Layers3 />{item.featuredColor}</span>{matchedColor && <button className="wr-button wr-button--secondary" onClick={() => onSelectColor(matchedColor)}>View surface<ChevronRight /></button>}</footer></div>
            </article>
          );
        })}
      </section>
    </div>
  );
};
