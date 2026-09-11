import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, FileText, Filter, GitCompare, Search, X } from 'lucide-react';
import { products } from '../data';
import { t } from '../i18n';
import { routePath } from '../routes';
import { formatMeasurement } from '../utils/measurements';
import type { LocaleConfig, ProductItem } from '../types';

export type ProductProgram = 'Vanity Tops' | 'Kitchen Countertops' | 'Furniture Tops' | 'Project Products';

interface ProductsViewProps {
  onSelectProduct: (product: ProductItem) => void;
  onAddToCart: (product: ProductItem) => void;
  currentLocale: LocaleConfig;
  onToggleCompare: (product: ProductItem) => void;
  compareIds: string[];
  setCurrentTab: (tab: string) => void;
  program?: ProductProgram;
}

const productProgramFor = (product: ProductItem): ProductProgram => {
  if (product.category === 'Bathroom Vanity Top') return 'Vanity Tops';
  if (product.category === 'Kitchen Countertop') return 'Kitchen Countertops';
  if (product.category === 'Furniture Top' || product.category === 'Stone Furniture') return 'Furniture Tops';
  return 'Project Products';
};

const programDefinitions: Array<{ name: ProductProgram; routeId: string; representativeSku: string; description: string }> = [
  { name: 'Vanity Tops', routeId: 'product-vanity', representativeSku: 'WR-VT31', description: 'Single- and double-bowl vanity top references with sink cutouts, backsplashes, edge details, and dimensions confirmed by drawing.' },
  { name: 'Kitchen Countertops', routeId: 'product-kitchen', representativeSku: 'WR-KT-QC', description: 'Countertop, island, backsplash, and waterfall directions developed around the selected material, layout, edge, and approved drawing.' },
  { name: 'Furniture Tops', routeId: 'product-furniture', representativeSku: 'WR-FR-OT', description: 'Round, oval, rectangular, and custom stone surfaces for dining, coffee, console, and hospitality furniture programs.' },
  { name: 'Project Products', routeId: 'product-project', representativeSku: 'WR-HT', description: 'Commercial, hospitality, architectural, waterjet, fireplace, sill, and coordinated stone packages reviewed project by project.' },
];

export const ProductsView: React.FC<ProductsViewProps> = ({ onSelectProduct, onAddToCart, currentLocale, onToggleCompare, compareIds, setCurrentTab, program }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  if (!program) {
    return (
      <div className="wr-catalog-page wr-taxonomy-page">
        <header className="wr-catalog-hero wr-catalog-hero--centered"><div><span className="wr-eyebrow">{t(currentLocale, 'productCatalog')}</span><h1>Products</h1></div><p>Select a product category to see its design references, dimensions, materials, finishes, packing information, and quotation details.</p></header>
        <section className="wr-taxonomy-grid" aria-label="Product categories">
          {programDefinitions.map((definition) => {
            const representative = products.find((item) => item.sku === definition.representativeSku);
            const count = products.filter((item) => productProgramFor(item) === definition.name).length;
            if (!representative) return null;
            return <article className="wr-taxonomy-card" key={definition.name}><a href={routePath(definition.routeId)} onClick={(event) => { event.preventDefault(); setCurrentTab(definition.routeId); }}><figure><picture>{representative.imageAvif && <source srcSet={representative.imageAvif} type="image/avif" />}{representative.imageWebp && <source srcSet={representative.imageWebp} type="image/webp" />}<img src={representative.image} alt={representative.imageAlt || representative.title} width={representative.imageWidth || 1536} height={representative.imageHeight || 1024} loading="lazy" /></picture></figure><div className="wr-taxonomy-card__body"><span className="wr-taxonomy-card__meta">{count} design references</span><h2>{definition.name}</h2><p>{definition.description}</p><strong>View category<ArrowRight /></strong></div></a></article>;
          })}
        </section>
      </div>
    );
  }

  const definition = programDefinitions.find((item) => item.name === program)!;
  const filteredProducts = products.filter((product) => {
    const search = searchQuery.trim().toLowerCase();
    return productProgramFor(product) === program && (!search || [product.title, product.sku, product.material, product.description].join(' ').toLowerCase().includes(search));
  });

  return (
    <div className="wr-catalog-page">
      <button className="wr-taxonomy-back" onClick={() => setCurrentTab('products')}><ArrowLeft />All product categories</button>
      <header className="wr-catalog-hero wr-catalog-hero--centered"><div><span className="wr-eyebrow">Product category</span><h1>{program}</h1></div><p>{definition.description} Open any reference to review detailed specification fields and prepare an RFQ.</p></header>

      <div className="wr-mobile-filter-toolbar"><button className="wr-button wr-button--secondary" onClick={() => setFiltersOpen(true)}><Filter />Filters</button><span>{filteredProducts.length} results</span></div>
      {searchQuery && <div className="wr-active-filter-chips"><button type="button" onClick={() => setSearchQuery('')}>Search: {searchQuery}<X /></button></div>}

      <div className="wr-catalog-layout">
        <aside className={`wr-filter-rail wr-filter-sheet${filtersOpen ? ' is-open' : ''}`} aria-label="Product category and search">
          <div className="wr-filter-sheet__mobile-header"><strong>Product filters</strong><button className="wr-icon-button" onClick={() => setFiltersOpen(false)} aria-label="Close filters"><X /></button></div>
          <div className="wr-filter-rail__heading"><span>{program}</span><small>{filteredProducts.length} results</small></div>
          <label className="wr-search-input"><Search /><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder={t(currentLocale, 'searchPlaceholder')} /></label>
          <fieldset><legend>Product categories</legend>{programDefinitions.map((item) => <button key={item.name} className={item.name === program ? 'is-active' : ''} onClick={() => { setCurrentTab(item.routeId); setFiltersOpen(false); }}><span>{item.name}</span>{item.name === program && <Check />}</button>)}</fieldset>
          <button className="wr-button wr-button--primary wr-filter-sheet__apply" onClick={() => setFiltersOpen(false)}>Show {filteredProducts.length} results</button>
          <div className="wr-filter-note"><strong>MM + IMPERIAL REFERENCE</strong><p>Millimetres are primary. Rounded inch references support North American review; final dimensions require approved drawings.</p></div>
          {!compareIds.length && <div className="wr-filter-note wr-compare-empty"><GitCompare /><strong>No comparison selected</strong><p>Select two or three products to compare specifications side by side.</p></div>}
        </aside>

        <main className="wr-product-grid" aria-live="polite">
          {filteredProducts.map((product) => {
            const compared = compareIds.includes(`product:${product.sku}`);
            return (
              <article className="wr-catalog-card" key={product.sku}>
                <button className="wr-catalog-card__media" onClick={() => onSelectProduct(product)} aria-label={`View ${product.title}`}><picture>{product.imageAvif && <source srcSet={product.imageAvif} type="image/avif" />}{product.imageWebp && <source srcSet={product.imageWebp} type="image/webp" />}<img src={product.image} alt={product.imageAlt || (product.imageType === 'render' ? `${product.title} illustrative render` : product.title)} width={product.imageWidth || 1536} height={product.imageHeight || 1024} loading="lazy" /></picture><span className="wr-catalog-card__sku">{product.sku}</span></button>
                <div className="wr-catalog-card__body">
                  {product.imageType === 'render' && <span className="wr-catalog-card__render-note">Illustrative render</span>}
                  <small>{productProgramFor(product)} · {product.material}</small><h2>{product.title}</h2>
                  <dl><div><dt>Dimensions</dt><dd>{formatMeasurement(product.dimensions || 'By approved drawing')}</dd></div><div><dt>Thickness</dt><dd>{formatMeasurement(product.thicknesses?.join(', ') || 'Confirm by quotation')}</dd></div></dl>
                  <div className="wr-catalog-card__actions"><button className="wr-button wr-button--primary" onClick={() => onAddToCart(product)}><FileText />Add to RFQ</button><button className="wr-button wr-button--secondary" onClick={() => onToggleCompare(product)} aria-pressed={compared}><GitCompare />{compared ? 'Selected' : 'Compare'}</button></div>
                </div>
              </article>
            );
          })}
          {!filteredProducts.length && <div className="wr-empty-state"><p>No matching references in this category.</p><button className="wr-button wr-button--secondary" onClick={() => setSearchQuery('')}>Clear search</button></div>}
        </main>
      </div>
    </div>
  );
};
