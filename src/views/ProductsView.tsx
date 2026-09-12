import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, FileText, Filter, GitCompare, Search, X } from 'lucide-react';
import { products } from '../data';
import { t } from '../i18n';
import { routePath } from '../routes';
import { formatMeasurement } from '../utils/measurements';
import { openRfqBuilder } from '../lib/uiEvents';
import type { LocaleConfig, ProductItem } from '../types';

export type ProductProgram = 'Kitchen Countertops' | 'Vanity Tops' | 'Table Tops' | 'Furniture Surfaces' | 'Commercial Programs';

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
  if (product.category === 'Kitchen Countertop') return 'Kitchen Countertops';
  if (product.category === 'Bathroom Vanity Top') return 'Vanity Tops';
  if (product.category === 'Furniture Top') return 'Table Tops';
  if (product.category === 'Stone Furniture') return 'Furniture Surfaces';
  return 'Commercial Programs';
};

const programDefinitions: Array<{ name: ProductProgram; routeId: string; description: string }> = [
  { name: 'Kitchen Countertops', routeId: 'product-kitchen', description: 'Countertops, islands, waterfall ends, backsplashes, cutouts, and edge details made to approved drawings.' },
  { name: 'Vanity Tops', routeId: 'product-vanity', description: 'Single- and double-bowl vanity tops with sink cutouts, backsplashes, edge details, and dimensions confirmed by drawing.' },
  { name: 'Table Tops', routeId: 'product-table', description: 'Round, oval, rectangular, and custom stone table tops for dining, coffee, console, and hospitality programs.' },
  { name: 'Furniture Surfaces', routeId: 'product-furniture', description: 'Stone surfaces and components for repeat furniture programs, coordinated around the approved material and geometry.' },
  { name: 'Commercial Programs', routeId: 'product-commercial', description: 'Cut-to-size, hospitality, retail, architectural, and coordinated stone packages reviewed project by project.' },
];

const textValue = (product: ProductItem, key: 'finish' | 'size' | 'use') => {
  if (key === 'finish') return product.specs.Finish || 'Confirm by sample';
  if (key === 'size') return product.specs.Size || product.specs.Sizes || product.dimensions || 'By approved drawing';
  return product.specs.Use || product.category;
};

export const ProductsView: React.FC<ProductsViewProps> = ({ onSelectProduct, onAddToCart, currentLocale, onToggleCompare, compareIds, setCurrentTab, program }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [material, setMaterial] = useState('All');
  const [finish, setFinish] = useState('All');
  const [size, setSize] = useState('All');
  const [use, setUse] = useState('All');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const programProducts = useMemo(() => program ? products.filter((product) => productProgramFor(product) === program) : products, [program]);
  const materials = useMemo(() => ['All', ...Array.from(new Set(programProducts.map((item) => item.material))).sort()], [programProducts]);
  const finishes = useMemo(() => ['All', ...Array.from(new Set(programProducts.map((item) => textValue(item, 'finish')))).sort()], [programProducts]);
  const sizes = useMemo(() => ['All', ...Array.from(new Set(programProducts.map((item) => textValue(item, 'size')))).sort()], [programProducts]);
  const uses = useMemo(() => ['All', ...Array.from(new Set(programProducts.map((item) => textValue(item, 'use')))).sort()], [programProducts]);

  if (!program) {
    return (
      <div className="wr-catalog-page wr-taxonomy-page">
        <header className="wr-landing-hero wr-landing-hero--product"><span className="wr-eyebrow">Product programs</span><h1>Stone products built around the drawing.</h1><p>Choose the product family first, then narrow material, finish, dimensions, and use before adding references to an RFQ.</p></header>
        <section className="wr-taxonomy-grid wr-product-program-grid" aria-label="Product categories">{programDefinitions.map((definition) => {
          const matching = products.filter((item) => productProgramFor(item) === definition.name);
          const representative = matching[0] || products[0];
          return <article className="wr-taxonomy-card" key={definition.name}><a href={routePath(definition.routeId)} onClick={(event) => { event.preventDefault(); setCurrentTab(definition.routeId); }}><figure><picture>{representative.imageAvif && <source srcSet={representative.imageAvif} type="image/avif" />}{representative.imageWebp && <source srcSet={representative.imageWebp} type="image/webp" />}<img src={representative.image} alt={representative.imageAlt || representative.title} width={representative.imageWidth || 1536} height={representative.imageHeight || 1024} loading="lazy" /></picture></figure><div className="wr-taxonomy-card__body"><span className="wr-taxonomy-card__meta">{matching.length} references</span><h2>{definition.name}</h2><p>{definition.description}</p><strong>View program<ArrowRight /></strong></div></a></article>;
        })}</section>
        <section className="wr-page-cta"><div><span className="wr-eyebrow">Custom program</span><h2>Have a drawing instead of a standard product?</h2><p>Start an RFQ with the drawing, material direction, quantity, destination, and schedule.</p></div><button className="wr-button wr-button--primary" onClick={openRfqBuilder}>Start RFQ<ArrowRight /></button></section>
      </div>
    );
  }

  const filteredProducts = programProducts.filter((product) => {
    const search = searchQuery.trim().toLowerCase();
    return (!search || [product.title, product.sku, product.material, product.description].join(' ').toLowerCase().includes(search))
      && (material === 'All' || product.material === material)
      && (finish === 'All' || textValue(product, 'finish') === finish)
      && (size === 'All' || textValue(product, 'size') === size)
      && (use === 'All' || textValue(product, 'use') === use);
  });
  const activeFilters = [searchQuery, material !== 'All', finish !== 'All', size !== 'All', use !== 'All'].filter(Boolean).length;
  const definition = programDefinitions.find((item) => item.name === program)!;
  const clearFilters = () => { setSearchQuery(''); setMaterial('All'); setFinish('All'); setSize('All'); setUse('All'); };

  return (
    <div className="wr-catalog-page">
      <button className="wr-taxonomy-back" onClick={() => setCurrentTab('products')}><ArrowLeft />All product programs</button>
      <header className="wr-catalog-hero wr-catalog-hero--centered"><div><span className="wr-eyebrow">Product program</span><h1>{program}</h1></div><p>{definition.description}</p></header>
      <div className="wr-mobile-filter-toolbar"><button className="wr-button wr-button--secondary" onClick={() => setFiltersOpen(true)}><Filter />Filters{activeFilters ? ` (${activeFilters})` : ''}</button><span>{filteredProducts.length} results</span></div>
      <div className="wr-product-filter-summary">{filteredProducts.length} results · {activeFilters} filters</div>
      <div className="wr-catalog-layout">
        <aside className={`wr-filter-rail wr-filter-sheet${filtersOpen ? ' is-open' : ''}`} aria-label="Product filters">
          <div className="wr-filter-sheet__mobile-header"><strong>Product filters</strong><button className="wr-icon-button" onClick={() => setFiltersOpen(false)} aria-label="Close filters"><X /></button></div>
          <label className="wr-search-input"><Search /><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder={t(currentLocale, 'searchPlaceholder')} /></label>
          <label className="wr-select-filter"><span>Material</span><select value={material} onChange={(event) => setMaterial(event.target.value)}>{materials.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="wr-select-filter"><span>Finish</span><select value={finish} onChange={(event) => setFinish(event.target.value)}>{finishes.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="wr-select-filter"><span>Size</span><select value={size} onChange={(event) => setSize(event.target.value)}>{sizes.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="wr-select-filter"><span>Use</span><select value={use} onChange={(event) => setUse(event.target.value)}>{uses.map((item) => <option key={item}>{item}</option>)}</select></label>
          <fieldset><legend>Programs</legend>{programDefinitions.map((item) => <button key={item.name} className={item.name === program ? 'is-active' : ''} onClick={() => { setCurrentTab(item.routeId); setFiltersOpen(false); }}><span>{item.name}</span>{item.name === program && <Check />}</button>)}</fieldset>
          <button className="wr-button wr-button--ghost" onClick={clearFilters}>Clear filters</button><button className="wr-button wr-button--primary wr-filter-sheet__apply" onClick={() => setFiltersOpen(false)}>Show {filteredProducts.length} results</button>
        </aside>
        <main className="wr-product-grid" aria-live="polite">
          {filteredProducts.map((product) => {
            const compared = compareIds.includes(`product:${product.sku}`);
            return <article className="wr-catalog-card" key={product.sku}><button className="wr-catalog-card__media" onClick={() => onSelectProduct(product)} aria-label={`View ${product.title}`}><picture>{product.imageAvif && <source srcSet={product.imageAvif} type="image/avif" />}{product.imageWebp && <source srcSet={product.imageWebp} type="image/webp" />}<img src={product.image} alt={product.imageAlt || product.title} width={product.imageWidth || 1536} height={product.imageHeight || 1024} loading="lazy" /></picture><span className="wr-catalog-card__sku">{product.sku}</span></button><div className="wr-catalog-card__body"><small>{product.material}</small><h2>{product.title}</h2><dl><div><dt>Dimensions</dt><dd>{formatMeasurement(textValue(product, 'size'))}</dd></div><div><dt>Thickness</dt><dd>{formatMeasurement(product.specs.Thickness || product.thicknesses?.join(', ') || 'Confirm by quotation')}</dd></div></dl><div className="wr-catalog-card__actions"><button className="wr-button wr-button--primary" onClick={() => onAddToCart(product)}><FileText />RFQ</button><button className="wr-button wr-button--secondary" onClick={() => onToggleCompare(product)} aria-pressed={compared}><GitCompare />{compared ? 'Selected' : 'Compare'}</button></div></div></article>;
          })}
          {!filteredProducts.length && <div className="wr-empty-state"><Search /><h2>No products match these filters.</h2><p>Try different criteria or clear the current filters.</p><button className="wr-button wr-button--secondary" onClick={clearFilters}>Clear filters</button></div>}
        </main>
      </div>
    </div>
  );
};
