import React from 'react';
import { AlertTriangle, Box, Download, FileCode2, FileText, Gauge, PackageCheck } from 'lucide-react';
import { resources } from '../data';
import { siteConfig } from '../data/site';
import { FaqSectionWithSchema } from '../components/FaqSectionWithSchema';
import type { LocaleConfig } from '../types';

interface ResourcesViewProps {
  currentLocale: LocaleConfig;
}

interface DocumentEntry {
  title: string;
  category: string;
  description: string;
  file?: string;
  status: string;
  Icon: React.ComponentType<{ className?: string }>;
}

export const ResourcesView: React.FC<ResourcesViewProps> = ({ currentLocale }) => {
  const catalog = resources.find((item) => item.category === 'Catalog');
  const care = resources.find((item) => item.category === 'Care');
  const documentCenter: DocumentEntry[] = [
    {
      title: 'Furniture Surface Reference Catalog',
      category: 'Catalog',
      description: 'A reference catalog showing furniture surface forms and material directions within the broader WHITEROCK product scope.',
      file: catalog?.file,
      status: 'PDF available',
      Icon: FileText
    },
    {
      title: 'Thickness Technical Data',
      category: 'Technical data',
      description: 'Separate product-specific sheets for each offered thickness and material family.',
      status: 'Available by request',
      Icon: Gauge
    },
    {
      title: 'Care & Maintenance Guide',
      category: 'Maintenance',
      description: 'General care guidance. Final instructions are confirmed against each exact material and finish.',
      file: care?.file,
      status: 'PDF available',
      Icon: Box
    },
    {
      title: 'Packing & Container Loading Guide',
      category: 'Export packing',
      description: 'Order-specific guidance for crates, labels, bracing, moisture protection, and container loading.',
      status: 'Available by request',
      Icon: PackageCheck
    },
    {
      title: 'CAD / DXF Drawing Blocks',
      category: 'Design files',
      description: 'Vanity, cutout, edge, and installation drawing blocks shared against the selected product program.',
      status: 'Available by request',
      Icon: FileCode2
    }
  ];

  return (
    <div className="wr-resources-page">
      <header className="wr-catalog-hero wr-catalog-hero--centered">
        <div><span className="wr-eyebrow">Technical document center</span><h1>Documents for specification, care, packing, and fabrication.</h1></div>
        <p>Download the public reference files or request product-specific technical sheets, CAD blocks, packing guidance, and assessment records from the team.</p>
      </header>

      <section className="wr-document-center" aria-labelledby="document-center-title">
        <div className="wr-section-heading wr-section-intro"><span className="wr-eyebrow">Requested library</span><h2 id="document-center-title">Five document groups for technical buyers.</h2></div>
        <div className="wr-document-grid">
          {documentCenter.map(({ title, category, description, file, status, Icon }) => (
            <article key={title} className={file ? 'is-available' : 'is-request'}>
              <header><Icon /><span>{category}</span></header>
              <h3>{title}</h3>
              <p>{description}</p>
              <small>{status}</small>
              {file ? <a className="wr-button wr-button--primary" href={`/${file.replace(/^\/+/, '')}`} download><Download />Download PDF</a> : <a className="wr-button wr-button--secondary" href={`mailto:${siteConfig.email}?subject=${encodeURIComponent(`Technical document request: ${title}`)}`}><FileText />Request document</a>}
            </article>
          ))}
        </div>
      </section>

      <section className="wr-resource-safety">
        <AlertTriangle />
        <div><span className="wr-eyebrow">Fabrication safety</span><h2>Use the exact product SDS and applicable workplace requirements.</h2><p>Cutting, grinding, or polishing stone can generate respirable crystalline silica. Fabricators must use the exact product documentation and the controls required by their jurisdiction, process, and work conditions.</p></div>
      </section>

      <section className="wr-resource-archive" aria-labelledby="resource-archive-title">
        <div><span className="wr-eyebrow">Document archive</span><h2 id="resource-archive-title">Additional reference PDFs.</h2></div>
        <div>{resources.filter((item) => ![catalog?.title, care?.title].includes(item.title)).map((item) => <a key={item.title} href={`/${item.file.replace(/^\/+/, '')}`} download><FileText /><span><strong>{item.title}</strong><small>{item.category} · verify scope and revision before use</small></span><Download /></a>)}</div>
      </section>

      <FaqSectionWithSchema
        currentLocale={currentLocale}
        title="Technical Data, Testing & Export Documentation FAQ"
        subtitle="Current answers on document status, material verification, and order-specific records."
        showSchemaInspector={false}
      />
    </div>
  );
};
