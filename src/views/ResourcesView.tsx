import React, { useMemo, useState } from 'react';
import { AlertTriangle, ArrowRight, Download, FileText, Filter, HelpCircle, Mail, Package, PencilRuler, ShieldCheck, Sparkles, Wrench, X } from 'lucide-react';
import resourcesData from '../../data/resources.json';
import complianceData from '../../data/compliance.json';
import { siteConfig } from '../data/site';
import { LandingHero } from '../components/LandingHero';
import { FaqSectionWithSchema } from '../components/FaqSectionWithSchema';
import { routePath } from '../routes';
import { openRfqBuilder } from '../lib/uiEvents';
import type { LocaleConfig } from '../types';

type AccessState = 'public' | 'available-on-request' | 'order-specific';
export type ResourceSection = 'documents' | 'cad' | 'care' | 'packing' | 'samples' | 'faq';
type DocumentEntry = { id: string; title: string; category: string; documentType: string; materialFamilies: string[]; description: string; revision: string; revisionDate: string | null; fileSize: string | null; access: AccessState; public: boolean; file: string | null };

interface ResourcesViewProps { currentLocale: LocaleConfig; setCurrentTab?: (tab: string) => void; section?: ResourceSection; }

const accessLabels: Record<AccessState, string> = { public: 'Public download', 'available-on-request': 'Available on request', 'order-specific': 'Order-specific' };
const resourceModules = [
  { id: 'resources-documents', key: 'documents', title: 'Technical Documents', copy: 'TDS, SDS, product references, safety information, and material-specific records.', Icon: FileText },
  { id: 'resources-cad', key: 'cad', title: 'CAD & DXF', copy: 'Drawing blocks and fabrication files for cutouts, edges, vanity tops, and project components.', Icon: PencilRuler },
  { id: 'resources-care', key: 'care', title: 'Care & Maintenance', copy: 'Cleaning, sealing, stain response, and maintenance guidance by material family.', Icon: Sparkles },
  { id: 'resources-packing', key: 'packing', title: 'Packing & Shipping', copy: 'Protection, labels, bracing, packing, and container preparation references.', Icon: Package },
  { id: 'resources-samples', key: 'samples', title: 'Sample Program', copy: 'Build a physical sample shortlist before final material approval or quotation.', Icon: Wrench },
  { id: 'resources-faq', key: 'faq', title: 'FAQ', copy: 'Answers on materials, documentation, samples, production, and export support.', Icon: HelpCircle },
] as const;

const heroImages: Record<ResourceSection | 'default', { image: string; alt: string }> = {
  default: { image: '/assets/materials/quartz-v2.jpg', alt: 'Stone surface technical resource reference' },
  documents: { image: '/assets/owner/qc/digital-thickness-inspection.jpg', alt: 'Digital dimensional inspection of a stone component' },
  cad: { image: '/assets/owner/enhanced/cnc-cutting-line-enhanced.jpg', alt: 'CNC stone fabrication line guided by production drawings' },
  care: { image: '/assets/materials/white-marble-v2.jpg', alt: 'White natural stone surface care reference' },
  packing: { image: '/assets/owner/enhanced/material-staging-hall-enhanced.jpg', alt: 'Finished stone components staged for packing' },
  samples: { image: '/assets/materials/white-marble-v2.jpg', alt: 'Physical stone sample surface' },
  faq: { image: '/assets/owner/enhanced/production-hall-aisle-enhanced.jpg', alt: 'Vietnam stone production hall' },
};

export const ResourcesView: React.FC<ResourcesViewProps> = ({ currentLocale, setCurrentTab = () => undefined, section }) => {
  const documents = resourcesData.items as DocumentEntry[];
  const [material, setMaterial] = useState('All');
  const [documentType, setDocumentType] = useState('All');
  const [access, setAccess] = useState<'All' | AccessState>('All');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const materials = useMemo(() => ['All', ...Array.from(new Set(documents.flatMap((item) => item.materialFamilies).filter((item) => item !== 'All'))).sort()], [documents]);
  const documentTypes = useMemo(() => ['All', ...Array.from(new Set(documents.map((item) => item.documentType))).sort()], [documents]);
  const sectionType = section === 'cad' ? 'CAD' : section === 'care' ? 'Care' : section === 'packing' ? 'Packing' : null;
  const filtered = documents.filter((item) => (!sectionType || item.documentType === sectionType) && (material === 'All' || item.materialFamilies.includes('All') || item.materialFamilies.includes(material)) && (documentType === 'All' || item.documentType === documentType) && (access === 'All' || item.access === access));
  const activeFilters = [material !== 'All', documentType !== 'All', access !== 'All'].filter(Boolean).length;
  const requestHref = (doc: DocumentEntry) => `mailto:${siteConfig.email}?subject=${encodeURIComponent(`Technical document request: ${doc.title}`)}`;
  const showLibrary = !section || ['documents', 'cad', 'care', 'packing'].includes(section);
  const heading = section ? resourceModules.find((item) => item.key === section) : null;
  const hero = heroImages[section || 'default'];

  return (
    <div className="wr-resources-page">
      <LandingHero eyebrow="Resources" title={heading?.title || 'Technical resources for specification and production.'} description={heading?.copy || 'Find documents, CAD support, care guidance, packing references, sample support, and answers for stone programs.'} image={hero.image} imageAlt={hero.alt} />
      {!section && <section className="wr-resource-module-grid wr-section-band" aria-label="Resource sections">{resourceModules.map(({ id, title, copy, Icon }) => <a key={id} href={routePath(id)} onClick={(event) => { event.preventDefault(); setCurrentTab(id); }}><Icon /><h2>{title}</h2><p>{copy}</p><strong>Open resource<ArrowRight /></strong></a>)}</section>}
      {section === 'samples' && <section className="wr-resource-feature wr-section-band"><div><span className="wr-eyebrow">Physical samples</span><h2>Build a material shortlist you can review in hand.</h2><p>Select up to six stone colors, submit the delivery information, then continue the same shortlist into RFQ.</p><button className="wr-button wr-button--primary" onClick={() => setCurrentTab('samples')}>Build Sample Box<ArrowRight /></button></div><figure><img src="/assets/materials/white-marble-v2.jpg" alt="Natural stone sample surface" width="1200" height="900" loading="lazy" /></figure></section>}
      {showLibrary && <section className="wr-document-center" aria-labelledby="document-center-title"><div className="wr-section-heading wr-section-intro"><span className="wr-eyebrow">Document library</span><h2 id="document-center-title">Find the right document in two steps.</h2><p>{filtered.length} documents · {activeFilters} active filters</p></div><div className="wr-mobile-filter-toolbar"><button className="wr-button wr-button--secondary" onClick={() => setFiltersOpen(true)}><Filter />Filters{activeFilters ? ` (${activeFilters})` : ''}</button><span>{filtered.length} results</span></div><div className={`wr-resource-filters wr-filter-sheet${filtersOpen ? ' is-open' : ''}`}><div className="wr-filter-sheet__mobile-header"><strong>Document filters</strong><button className="wr-icon-button" onClick={() => setFiltersOpen(false)} aria-label="Close filters"><X /></button></div><label><span>Material</span><select value={material} onChange={(event) => setMaterial(event.target.value)}>{materials.map((item) => <option key={item}>{item}</option>)}</select></label><label><span>Document type</span><select value={documentType} onChange={(event) => setDocumentType(event.target.value)}>{documentTypes.map((item) => <option key={item}>{item}</option>)}</select></label><label><span>Access</span><select value={access} onChange={(event) => setAccess(event.target.value as 'All' | AccessState)}><option>All</option><option value="public">Public download</option><option value="available-on-request">Available on request</option><option value="order-specific">Order-specific</option></select></label><button className="wr-button wr-button--ghost" onClick={() => { setMaterial('All'); setDocumentType('All'); setAccess('All'); }}>Clear</button><button className="wr-button wr-button--primary wr-filter-sheet__apply" onClick={() => setFiltersOpen(false)}>Show {filtered.length}</button></div><div className="wr-document-grid">{filtered.map((doc) => <article key={doc.id} className={doc.access === 'public' ? 'is-available' : 'is-request'}><header><FileText /><span>{doc.documentType}</span></header><h3>{doc.title}</h3><p>{doc.description}</p><dl className="wr-document-meta"><div><dt>Access</dt><dd>{accessLabels[doc.access]}</dd></div>{doc.revision && <div><dt>Edition</dt><dd>{doc.revision}</dd></div>}{doc.revisionDate && <div><dt>Date</dt><dd>{doc.revisionDate}</dd></div>}{doc.fileSize && <div><dt>Size</dt><dd>{doc.fileSize}</dd></div>}</dl>{doc.access === 'public' && doc.file ? <a className="wr-button wr-button--primary" href={`/${doc.file.replace(/^\/+/, '')}`} download><Download />Download</a> : <a className="wr-button wr-button--secondary" href={requestHref(doc)}><Mail />Request document</a>}</article>)}</div></section>}
      {(section === 'faq' || !section) && <FaqSectionWithSchema currentLocale={currentLocale} title="Technical Data, Testing & Export Documentation FAQ" subtitle="Answers on technical data, testing, safety, samples, and order-specific documentation." showSchemaInspector={false} />}
      <section className="wr-resource-safety"><AlertTriangle /><div><span className="wr-eyebrow">Fabrication safety</span><h2>{complianceData.silicaTitle}</h2><p>{complianceData.silicaCopy}</p></div></section>
      <section className="wr-page-cta"><div><ShieldCheck /><span className="wr-eyebrow">From document to order</span><h2>Need the sample or quotation that goes with the document?</h2></div><div><button className="wr-button wr-button--secondary" onClick={() => setCurrentTab('samples')}>Request Sample</button><button className="wr-button wr-button--primary" onClick={openRfqBuilder}>Request RFQ</button></div></section>
    </div>
  );
};
