import React from 'react';
import { ArrowLeft, ArrowRight, ChevronRight, Layers3 } from 'lucide-react';
import { applications, colors } from '../data';
import { routePath } from '../routes';
import type { ApplicationItem, ColorItem, LocaleConfig } from '../types';

export type ApplicationCategory = 'Kitchen' | 'Bathroom' | 'Hotel' | 'Commercial';

interface ApplicationsViewProps {
  onSelectColor: (color: ColorItem) => void;
  currentLocale: LocaleConfig;
  setCurrentTab: (tab: string) => void;
  category?: ApplicationCategory;
}

const applicationDefinitions: Array<{
  name: ApplicationCategory;
  routeId: string;
  description: string;
}> = [
  { name: 'Kitchen', routeId: 'application-kitchen', description: 'Countertops, islands, waterfall ends, backsplashes, and coordinated surface directions for kitchen programs.' },
  { name: 'Bathroom', routeId: 'application-bathroom', description: 'Vanity tops and multi-family bathroom directions where sink, wall return, edge, and wet-area details are reviewed together.' },
  { name: 'Hotel', routeId: 'application-hotel', description: 'Bathroom, reception, lobby, and other hospitality surface directions for repeat room and public-area programs.' },
  { name: 'Commercial', routeId: 'application-commercial', description: 'Retail, restaurant, furniture, outdoor, and commercial counter directions reviewed against the project brief.' },
];

const belongsToCategory = (item: ApplicationItem, category: ApplicationCategory) => {
  const sourceCategory = item.category.toLowerCase();
  if (category === 'Kitchen') return sourceCategory.includes('kitchen');
  if (category === 'Bathroom') return sourceCategory.includes('bath') || sourceCategory.includes('multi-family');
  if (category === 'Hotel') return sourceCategory.includes('hospitality') || sourceCategory.includes('hotel');
  return ['commercial', 'restaurant', 'retail', 'furniture', 'outdoor'].some((term) => sourceCategory.includes(term));
};

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({ onSelectColor, setCurrentTab, category }) => {
  if (!category) {
    return (
      <div className="wr-catalog-page wr-taxonomy-page">
        <header className="wr-catalog-hero wr-catalog-hero--centered">
          <div><span className="wr-eyebrow">Applications and inspiration</span><h1>Choose the space you are planning.</h1></div>
          <p>Open an application category to review relevant product forms, material directions, and surface references before moving into samples and drawings.</p>
        </header>
        <section className="wr-taxonomy-grid" aria-label="Application categories">
          {applicationDefinitions.map((definition) => {
            const items = applications.filter((item) => belongsToCategory(item, definition.name));
            const representative = items[0];
            if (!representative) return null;
            return (
              <article className="wr-taxonomy-card" key={definition.name}>
                <a href={routePath(definition.routeId)} onClick={(event) => { event.preventDefault(); setCurrentTab(definition.routeId); }}>
                  <figure><img src={representative.image} alt={representative.imageAlt} width="1200" height="900" loading="lazy" /></figure>
                  <div className="wr-taxonomy-card__body">
                    <span className="wr-taxonomy-card__meta"><Layers3 />{items.length} application directions</span>
                    <h2>{definition.name}</h2>
                    <p>{definition.description}</p>
                    <strong>View applications<ArrowRight /></strong>
                  </div>
                </a>
              </article>
            );
          })}
        </section>
      </div>
    );
  }

  const definition = applicationDefinitions.find((item) => item.name === category)!;
  const filteredApplications = applications.filter((item) => belongsToCategory(item, category));

  return (
    <div className="wr-applications-page">
      <button className="wr-taxonomy-back" onClick={() => setCurrentTab('applications')}><ArrowLeft />All application categories</button>
      <header className="wr-catalog-hero wr-catalog-hero--centered">
        <div><span className="wr-eyebrow">Application category</span><h1>{category}</h1></div>
        <p>{definition.description} Final material, dimensions, finish, construction, and suitability remain project-specific.</p>
      </header>

      <nav className="wr-category-tabs" aria-label="Application categories">
        {applicationDefinitions.map((item) => <button className={item.name === category ? 'is-active' : ''} key={item.name} onClick={() => setCurrentTab(item.routeId)}>{item.name}</button>)}
      </nav>

      <section className="wr-application-grid" aria-live="polite">
        {filteredApplications.map((item) => {
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
