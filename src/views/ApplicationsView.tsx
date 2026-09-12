import React from 'react';
import { ArrowLeft, ArrowRight, ChevronRight, FileText, Layers3, Package } from 'lucide-react';
import { applications, colors } from '../data';
import { LandingHero } from '../components/LandingHero';
import { routePath } from '../routes';
import { openRfqBuilder } from '../lib/uiEvents';
import type { ApplicationItem, ColorItem, LocaleConfig } from '../types';

export type ApplicationCategory = 'Kitchen' | 'Bathroom' | 'Furniture' | 'Commercial';

interface ApplicationsViewProps {
  onSelectColor: (color: ColorItem) => void;
  onAddColorSample?: (color: ColorItem) => void;
  currentLocale: LocaleConfig;
  setCurrentTab: (tab: string) => void;
  category?: ApplicationCategory;
}

const applicationDefinitions: Array<{ name: ApplicationCategory; routeId: string; description: string }> = [
  { name: 'Kitchen', routeId: 'application-kitchen', description: 'Countertops, islands, waterfall ends, backsplashes, and coordinated surface directions for kitchen programs.' },
  { name: 'Bathroom', routeId: 'application-bathroom', description: 'Vanity tops and bathroom directions where sink, wall return, edge, and wet-area details are reviewed together.' },
  { name: 'Furniture', routeId: 'application-furniture', description: 'Dining, coffee, console, and hospitality furniture surfaces developed around material, shape, thickness, and edge.' },
  { name: 'Commercial', routeId: 'application-commercial', description: 'Retail, restaurant, hospitality, public-area, and commercial counter directions reviewed against the project brief.' },
];

const belongsToCategory = (item: ApplicationItem, category: ApplicationCategory) => {
  const sourceCategory = item.category.toLowerCase();
  if (category === 'Kitchen') return sourceCategory.includes('kitchen');
  if (category === 'Bathroom') return sourceCategory.includes('bath') || sourceCategory.includes('multi-family');
  if (category === 'Furniture') return sourceCategory.includes('furniture') || sourceCategory.includes('table');
  return ['commercial', 'restaurant', 'retail', 'hospitality', 'hotel', 'outdoor'].some((term) => sourceCategory.includes(term));
};

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({ onSelectColor, onAddColorSample, setCurrentTab, category }) => {
  if (!category) {
    const hero = applications[0];
    return (
      <div className="wr-catalog-page wr-taxonomy-page">
        <LandingHero eyebrow="Applications" title="Choose the space before the surface." description="Move from kitchen, bathroom, furniture, or commercial use into material directions, physical samples, and a drawing-led RFQ." image={hero.image} imageAlt={hero.imageAlt} />
        <section className="wr-taxonomy-grid" aria-label="Application categories">{applicationDefinitions.map((definition) => {
          const items = applications.filter((item) => belongsToCategory(item, definition.name));
          const representative = items[0] || applications[0];
          return <article className="wr-taxonomy-card" key={definition.name}><a href={routePath(definition.routeId)} onClick={(event) => { event.preventDefault(); setCurrentTab(definition.routeId); }}><figure><img src={representative.image} alt={representative.imageAlt} width="1200" height="900" loading="lazy" /></figure><div className="wr-taxonomy-card__body"><span className="wr-taxonomy-card__meta"><Layers3 />{items.length} directions</span><h2>{definition.name}</h2><p>{definition.description}</p><strong>View applications<ArrowRight /></strong></div></a></article>;
        })}</section>
        <section className="wr-page-cta"><div><span className="wr-eyebrow">Project application</span><h2>Already have a drawing?</h2><p>Start the RFQ and add the material direction as the shortlist develops.</p></div><button className="wr-button wr-button--primary" onClick={openRfqBuilder}><FileText />Start RFQ</button></section>
      </div>
    );
  }

  const definition = applicationDefinitions.find((item) => item.name === category)!;
  const filteredApplications = applications.filter((item) => belongsToCategory(item, category));
  const hero = filteredApplications[0] || applications[0];

  return (
    <div className="wr-applications-page">
      <LandingHero eyebrow="Application category" title={category} description={definition.description} image={hero.image} imageAlt={hero.imageAlt} />
      <button className="wr-taxonomy-back" onClick={() => setCurrentTab('applications')}><ArrowLeft />All applications</button>
      <nav className="wr-category-tabs" aria-label="Application categories">{applicationDefinitions.map((item) => <button className={item.name === category ? 'is-active' : ''} key={item.name} onClick={() => setCurrentTab(item.routeId)}>{item.name}</button>)}</nav>
      <section className="wr-application-grid" aria-live="polite">{filteredApplications.map((item) => {
        const matchedColor = colors.find((color) => color.slug === item.featuredColorSlug);
        return <article key={item.title}><div className="wr-application-card__media"><img src={item.image} alt={item.imageAlt} width="1200" height="900" loading="lazy" /><span>{item.category}</span></div><div className="wr-application-card__body"><small>Application direction</small><h2>{item.title}</h2><p>{item.description}</p><footer><span><Layers3 />{item.featuredColor}</span>{matchedColor && <div className="wr-application-card__actions"><button className="wr-button wr-button--secondary" onClick={() => onSelectColor(matchedColor)}>View surface<ChevronRight /></button>{onAddColorSample && <button className="wr-button wr-button--secondary" onClick={() => onAddColorSample(matchedColor)}><Package />Sample</button>}</div>}</footer></div></article>;
      })}</section>
      <section className="wr-page-cta"><div><span className="wr-eyebrow">{category} project</span><h2>Turn the application into a material and drawing package.</h2></div><div><button className="wr-button wr-button--secondary" onClick={() => setCurrentTab('samples')}><Package />Samples</button><button className="wr-button wr-button--primary" onClick={openRfqBuilder}><FileText />Start RFQ</button></div></section>
    </div>
  );
};
