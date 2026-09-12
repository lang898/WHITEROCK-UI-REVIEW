import React from 'react';
import { ArrowRight, Download, Droplets, FileText, Gauge, GitCompare, Mail, Package, Ruler, Scale, ShieldCheck, Sparkles } from 'lucide-react';
import { colors, edges, stoneTypes } from '../data';
import { siteConfig } from '../data/site';
import { Tag } from '../components/ui/Tag';
import { ColorSwatchImage } from '../components/ColorSwatchImage';
import { MaterialDisclaimer } from '../components/MaterialDisclaimer';
import { openRfqBuilder } from '../lib/uiEvents';
import type { ColorItem, LocaleConfig, StoneTypeInfo } from '../types';

interface StoneTypeViewProps {
  stoneTypeId: StoneTypeInfo['id'];
  currentLocale: LocaleConfig;
  onSelectColor: (color: ColorItem) => void;
  onAddColorSample: (color: ColorItem) => void;
  onToggleCompare?: (color: ColorItem) => void;
  compareIds?: string[];
  setCurrentTab: (tab: string) => void;
}

const averageFromText = (value: string) => {
  const values = value.match(/\d+(?:\.\d+)?/g)?.map(Number) || [0];
  return values.reduce((sum, item) => sum + item, 0) / values.length;
};

const fallbackApplicationImages = [
  { image: '/assets/applications/modern-kitchen-inspiration.jpg', alt: 'Kitchen stone application planning reference', caption: 'Kitchen application planning reference' },
  { image: '/assets/applications/master-bath-inspiration.jpg', alt: 'Bathroom stone application planning reference', caption: 'Bathroom application planning reference' },
  { image: '/assets/owner/countertops/oval-travertine-coffee-top.jpg', alt: 'Furniture stone application planning reference', caption: 'Furniture application planning reference' },
];

export const StoneTypeView: React.FC<StoneTypeViewProps> = ({ stoneTypeId, onSelectColor, onAddColorSample, onToggleCompare, compareIds = [], setCurrentTab }) => {
  const stoneType = stoneTypes.find((item) => item.id === stoneTypeId) || stoneTypes[0];
  const materialColors = colors.filter((color) => color.material === stoneType.name);
  const materialFinishes = Array.from(new Set(materialColors.flatMap((color) => color.finishes)));
  const publicTechSheets = materialColors.filter((color) => Boolean(color.techSheetPdf));
  const relatedDocs = [
    ...publicTechSheets.slice(0, 3).map((color) => ({ id: `tds-${color.slug}`, type: 'Technical data', title: `${color.name} technical sheet`, status: 'public' as const, file: color.techSheetPdf })),
    { id: 'care', type: 'Care', title: `${stoneType.name} care & maintenance guidance`, status: 'public' as const, file: '/assets/resources/stone-care-and-maintenance-guide.pdf' },
    { id: 'sds', type: 'SDS', title: `${stoneType.name} product SDS`, status: 'available-on-request' as const, file: undefined },
    { id: 'cad', type: 'CAD', title: `${stoneType.name} fabrication / drawing support`, status: 'available-on-request' as const, file: undefined },
  ];
  const technicalMetrics = [
    { label: 'Mohs hardness', value: stoneType.hardness, Icon: Gauge, maximum: 10, scale: '0 — 10' },
    { label: 'Water absorption', value: stoneType.absorption, Icon: Droplets, maximum: 3, scale: '0 — 3%' },
    { label: 'Density', value: stoneType.density, Icon: Scale, maximum: 3, scale: '0 — 3 g/cm³' },
    { label: 'Flexural strength', value: stoneType.flexuralStrength, Icon: Ruler, maximum: 40, scale: '0 — 40 MPa' },
  ].map((metric) => ({ ...metric, position: Math.min(100, Math.max(3, (averageFromText(metric.value) / metric.maximum) * 100)) }));
  const isEngineered = stoneType.name === 'Quartz' || stoneType.name === 'Engineered Marble';
  const carePoints = isEngineered
    ? ['Use a non-abrasive pH-neutral cleaner.', 'Avoid direct high heat and follow the selected product guidance.', 'Clean spills promptly and avoid aggressive chemicals.', 'Use the exact product care sheet for stain or chemical response.']
    : ['Use pH-neutral stone-care products.', 'Clean spills promptly and avoid acidic or aggressive cleaners.', 'Review sealing requirements for the selected stone, finish, and exposure.', 'Use the physical sample and material-specific care guidance before specification.'];
  const applicationGallery = [
    ...(stoneType.gallery || []),
    { image: stoneType.applicationImage.startsWith('/') ? stoneType.applicationImage : `/${stoneType.applicationImage}`, imageWebp: stoneType.applicationImageWebp, alt: stoneType.applicationAlt, caption: stoneType.applicationCaption },
    ...fallbackApplicationImages,
  ].filter((item, index, array) => array.findIndex((candidate) => candidate.image === item.image) === index).slice(0, 4);

  return (
    <div className="wr-stone-type-page">
      <header className="wr-stone-type-hero" id="stone-overview">
        <figure><picture>{stoneType.imageWebp && <source srcSet={stoneType.imageWebp} type="image/webp" />}<img src={stoneType.image} alt={stoneType.imageAlt} width="1600" height="1100" loading="eager" fetchPriority="high" /></picture><figcaption>{stoneType.imageCaption}</figcaption></figure>
        <div><span className="wr-eyebrow">{stoneType.eyebrow}</span><h1>{stoneType.name}</h1><h2>{stoneType.headline}</h2><p>{stoneType.summary}</p><div className="wr-stone-type-hero__actions"><button className="wr-button wr-button--primary" onClick={() => setCurrentTab('samples')}><Package />Build a sample box</button><button className="wr-button wr-button--secondary" onClick={openRfqBuilder}><FileText />Request RFQ</button></div></div>
      </header>

      <nav className="wr-stone-subnav" aria-label={`${stoneType.name} selection path`}><div className="wr-stone-subnav__inner"><strong>{stoneType.name}</strong><div className="wr-stone-subnav__links"><a href="#stone-overview">Overview</a><a href="#stone-colors">Colors <span>{materialColors.length}</span></a><a href="#stone-finishes">Finishes &amp; Edges</a><a href="#stone-documents">Documents</a><a href="#stone-applications">Applications</a></div><div className="wr-stone-subnav__actions"><button className="wr-button wr-button--secondary" onClick={() => setCurrentTab('samples')}><Package />Samples</button><button className="wr-button wr-button--primary" onClick={openRfqBuilder}><FileText />RFQ</button></div></div></nav>

      <section className="wr-stone-character wr-section-band" aria-labelledby="stone-character-title"><div><span className="wr-eyebrow">Material character</span><h2 id="stone-character-title">What to understand before selecting {stoneType.name.toLowerCase()}.</h2><p>{stoneType.summary} {stoneType.caveat}</p></div><figure><img src="/assets/owner/enhanced/cnc-cutting-line-enhanced.jpg" alt="Stone cutting and fabrication process reference" width="1448" height="1086" loading="lazy" /><figcaption>Fabrication process reference</figcaption></figure></section>

      <section className="wr-stone-tech-viz" aria-label={`${stoneType.name} technical reference`}>{technicalMetrics.map(({ label, value, Icon, position, scale }) => <article key={label} className="wr-stone-tech-viz__metric"><div className="wr-stone-tech-viz__heading"><Icon aria-hidden="true" /><span>{label}</span><strong>{value}</strong></div><div className="wr-stone-tech-viz__track"><i style={{ width: `${position}%` }} /><b style={{ left: `${position}%` }} /></div><small>{scale}</small></article>)}</section>
      <MaterialDisclaimer type="typical-technical-data" compact className="wr-stone-type-note" />

      <section className="wr-stone-type-colors wr-section-band wr-section-band--mist" id="stone-colors" aria-labelledby="stone-type-colors-title">
        <div className="wr-section-heading wr-section-intro"><span className="wr-eyebrow">Surface directions</span><h2 id="stone-type-colors-title">Explore {stoneType.name.toLowerCase()} colors.</h2><p>Shortlist online, then confirm the physical sample and applicable production lot.</p></div>
        {materialColors.length > 0 ? <div className="wr-stone-type-color-grid">{materialColors.map((color) => {
          const compared = compareIds.includes(`color:${color.slug}`);
          return <article className="wr-swatch-card wr-swatch-card--compact" key={color.slug}><button className="wr-swatch-card__media" onClick={() => onSelectColor(color)} aria-label={`View ${color.name}`}><ColorSwatchImage color={color} loading="lazy" /><span className="wr-media-disclosure">{color.imageType === 'render' ? 'Illustrative digital swatch' : 'Material reference photograph'}</span></button><div className="wr-swatch-card__body"><Tag>{color.material}</Tag><h3>{color.name}</h3><dl><div><dt>Finish</dt><dd>{color.finishes.slice(0, 2).join(', ')}</dd></div><div><dt>Thickness</dt><dd>{color.thicknesses.join(', ')}</dd></div></dl><div className="wr-swatch-card__actions"><button className="wr-button wr-button--primary" onClick={() => onAddColorSample(color)}><Package />Sample</button>{onToggleCompare && <button className="wr-button wr-button--secondary" aria-pressed={compared} onClick={() => onToggleCompare(color)}><GitCompare />{compared ? 'Selected' : 'Compare'}</button>}</div></div></article>;
        })}</div> : <div className="wr-stone-type-empty"><span>Ask for the current {stoneType.name.toLowerCase()} selection.</span><p>We will review available materials, finish, thickness, format, and supporting technical information for your project.</p><button className="wr-button wr-button--secondary" onClick={() => setCurrentTab('contact')}>Discuss a material requirement<ArrowRight /></button></div>}
      </section>

      <section className="wr-stone-type-fabrication wr-section-band" id="stone-finishes" aria-labelledby="stone-type-fabrication-title"><div className="wr-section-heading wr-section-intro"><span className="wr-eyebrow">Fabrication direction</span><h2 id="stone-type-fabrication-title">Set the finish and edge after the color.</h2><p>Final availability is reviewed against the selected color, thickness, drawing, and physical sample.</p></div><div className="wr-stone-type-fabrication__grid"><article><span>Available finish directions</span><h3>{materialFinishes.length} finishes represented in this color library</h3><div className="wr-stone-type-option-list">{materialFinishes.map((finish) => <Tag key={finish}>{finish}</Tag>)}</div></article><article><span>Edge profiles to review</span><h3>Profiles are selected with the approved thickness and drawing</h3><div className="wr-stone-type-option-list">{edges.map((edge) => <Tag key={edge.slug}>{edge.name}</Tag>)}</div></article></div><div className="wr-section-action"><button className="wr-button wr-button--secondary" onClick={() => setCurrentTab('finishes')}>Review finishes and edge details<ArrowRight /></button></div></section>

      <section className="wr-stone-type-gallery wr-section-band wr-section-band--mist" id="stone-applications" aria-labelledby="stone-type-gallery-title"><div className="wr-section-heading wr-section-intro"><span className="wr-eyebrow">Application references</span><h2 id="stone-type-gallery-title">Review scale, movement, and setting.</h2><p>These images are application-planning references, not customer case studies.</p></div><div className="wr-stone-type-gallery__grid">{applicationGallery.map((item) => <figure key={`${stoneType.id}-${item.image}`}><picture>{'imageWebp' in item && item.imageWebp && <source srcSet={item.imageWebp} type="image/webp" />}<img src={item.image} alt={item.alt} width="1280" height="960" loading="lazy" /></picture><figcaption>{item.caption}</figcaption></figure>)}</div></section>

      <section className="wr-stone-care wr-section-band" aria-labelledby="stone-care-title"><div><span className="wr-eyebrow">Care</span><h2 id="stone-care-title">Keep the care plan tied to the selected material.</h2><p>{stoneType.maintenance}</p></div><ul>{carePoints.map((point) => <li key={point}><ShieldCheck />{point}</li>)}</ul></section>

      <section className="wr-stone-type-documents wr-section-band wr-section-band--mist" id="stone-documents" aria-labelledby="stone-documents-title"><div className="wr-section-heading wr-section-intro"><span className="wr-eyebrow">Technical documents</span><h2 id="stone-documents-title">Documents tied to the selected material.</h2><p>Public reference files can be downloaded now. Product-specific SDS, test reports, and drawing files are available on request.</p></div><div className="wr-document-grid">{relatedDocs.map((doc) => <article key={doc.id} className={doc.status === 'public' ? 'is-available' : 'is-request'}><header><FileText /><span>{doc.type}</span></header><h3>{doc.title}</h3><small>{doc.status === 'public' ? 'Public reference' : 'Available on request'}</small>{doc.file ? <a className="wr-button wr-button--primary" href={doc.file} download><Download />Download</a> : <a className="wr-button wr-button--secondary" href={`mailto:${siteConfig.email}?subject=${encodeURIComponent(`${stoneType.name} document request: ${doc.title}`)}`}><Mail />Request document</a>}</article>)}</div><div className="wr-section-action"><button className="wr-button wr-button--secondary" onClick={() => setCurrentTab('resources-documents')}>Open document center<ArrowRight /></button></div></section>

      <section className="wr-stone-type-applications wr-section-band" aria-labelledby="stone-type-application-title"><div className="wr-stone-type-application-layout"><figure><picture>{stoneType.applicationImageWebp && <source srcSet={stoneType.applicationImageWebp} type="image/webp" />}<img src={stoneType.applicationImage.startsWith('/') ? stoneType.applicationImage : `/${stoneType.applicationImage}`} alt={stoneType.applicationAlt} width="1600" height="1100" loading="lazy" /></picture><figcaption>{stoneType.applicationCaption}</figcaption></figure><div><span className="wr-eyebrow">Suitability</span><h2 id="stone-type-application-title">Where {stoneType.name.toLowerCase()} is commonly considered.</h2><div className="wr-stone-type-tags">{stoneType.suitability.map((item) => <span key={item}>{item}</span>)}</div><div className="wr-stone-type-use-grid">{stoneType.applications.map((application) => <span key={application}><Sparkles />{application}</span>)}</div></div></div></section>

      <section className="wr-page-cta wr-stone-final-cta"><div><span className="wr-eyebrow">Specify {stoneType.name}</span><h2>Take the material into a physical sample or RFQ.</h2></div><div><button className="wr-button wr-button--secondary" onClick={() => setCurrentTab('samples')}><Package />Request Sample</button><button className="wr-button wr-button--primary" onClick={openRfqBuilder}><FileText />Start RFQ</button></div></section>
    </div>
  );
};
