import React from 'react';
import { AlertTriangle, Box, Download, FileCode2, FileText, Gauge, PackageCheck } from 'lucide-react';
import { resources } from '../data';
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
      title: 'Product Catalog Framework',
      category: 'Catalog',
      description: 'Current starter PDF. Replace with the owner-approved full product-line catalog when supplied.',
      file: catalog?.file,
      status: 'Starter PDF available',
      Icon: FileText
    },
    {
      title: 'Thickness Technical Data',
      category: 'Technical data',
      description: 'Separate product-specific sheets for each offered thickness and material family.',
      status: 'Owner files pending',
      Icon: Gauge
    },
    {
      title: 'Care & Maintenance Guide',
      category: 'Maintenance',
      description: 'Current starter PDF. Final instructions must be confirmed against each exact material and finish.',
      file: care?.file,
      status: 'Starter PDF available',
      Icon: Box
    },
    {
      title: 'Packing & Container Loading Guide',
      category: 'Export packing',
      description: 'Framework reserved for owner-approved crate, labeling, bracing, moisture protection, and loading instructions.',
      status: 'Owner file pending',
      Icon: PackageCheck
    },
    {
      title: 'CAD / DXF Drawing Blocks',
      category: 'Design files',
      description: 'Framework reserved for approved vanity, cutout, edge, and installation drawing blocks.',
      status: 'Owner files pending',
      Icon: FileCode2
    }
  ];

  return (
    <div className="wr-resources-page">
      <header className="wr-catalog-hero wr-catalog-hero--centered">
        <div><span className="wr-eyebrow">Technical document center</span><h1>Download what is published. See what still needs owner files.</h1></div>
        <p>The library separates available starter documents from placeholders. No certificate, test report, CAD block, capacity sheet, or packing claim is presented as final until the source file is approved.</p>
      </header>

      <section className="wr-document-center" aria-labelledby="document-center-title">
        <div className="wr-section-heading wr-section-intro"><span className="wr-eyebrow">Requested library</span><h2 id="document-center-title">Five document groups for technical buyers.</h2></div>
        <div className="wr-document-grid">
          {documentCenter.map(({ title, category, description, file, status, Icon }) => (
            <article key={title} className={file ? 'is-available' : 'is-pending'}>
              <header><Icon /><span>{category}</span></header>
              <h3>{title}</h3>
              <p>{description}</p>
              <small>{status}</small>
              {file ? <a className="wr-button wr-button--primary" href={`/${file.replace(/^\/+/, '')}`} download><Download />Download PDF</a> : <button className="wr-button wr-button--secondary" disabled><FileText />File pending</button>}
            </article>
          ))}
        </div>
      </section>

      <section className="wr-resource-safety">
        <AlertTriangle />
        <div><span className="wr-eyebrow">Fabrication safety</span><h2>Use the exact product SDS and applicable workplace requirements.</h2><p>Cutting, grinding, or polishing stone can generate respirable crystalline silica. Fabricators must use the exact product documentation and the controls required by their jurisdiction and work conditions. WHITEROCK-specific procedures or certifications will be published only when owner-approved source documents are supplied.</p></div>
      </section>

      <section className="wr-resource-archive" aria-labelledby="resource-archive-title">
        <div><span className="wr-eyebrow">Starter archive</span><h2 id="resource-archive-title">Additional draft and reference PDFs.</h2></div>
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
