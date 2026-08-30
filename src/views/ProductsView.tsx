import React, { useMemo, useState } from 'react';
import { ArrowRight, Check, GitCompare, Plus, Search } from 'lucide-react';
import { products } from '../data';
import { t } from '../i18n';
import { formatMeasurement } from '../utils/measurements';
import type { LocaleConfig, ProductItem } from '../types';

interface ProductsViewProps {
  onSelectProduct: (product: ProductItem) => void;
  onAddToCart: (product: ProductItem) => void;
  currentLocale: LocaleConfig;
  onToggleCompare: (product: ProductItem) => void;
  compareIds: string[];
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  onSelectProduct, onAddToCart, currentLocale, onToggleCompare, compareIds
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFullCatalog, setShowFullCatalog] = useState(false);
  const categories = useMemo(() => ['All', 'Vanity Tops', 'Kitchen Countertops', 'Furniture Tops', 'Project Products'], []);
  const representativeSkus = useMemo(() => [
    'WR-VT24', 'WR-VT31', 'WR-KT-QC', 'WR-KT-NS',
    'WR-FR-RM', 'WR-FR-OT', 'WR-HT', 'WR-WJ-MED'
  ], []);

  const productProgramFor = (product: ProductItem) => {
    if (product.category === 'Bathroom Vanity Top' || product.category === 'Vanity Top') return 'Vanity Tops';
    if (product.category === 'Kitchen Countertop') return 'Kitchen Countertops';
    if (product.category === 'Furniture Top' || product.category === 'Stone Furniture') return 'Furniture Tops';
    return 'Project Products';
  };

  const filteredProducts = products.filter((product) => {
    const search = searchQuery.trim().toLowerCase();
    return (selectedCategory === 'All' || productProgramFor(product) === selectedCategory) &&
      (!search || [product.title, product.sku, product.material, product.description].join(' ').toLowerCase().includes(search));
  });
  const featuredMode = selectedCategory === 'All' && !searchQuery.trim() && !showFullCatalog;
  const displayedProducts = featuredMode
    ? representativeSkus.map((sku) => products.find((product) => product.sku === sku)!).filter(Boolean)
    : filteredProducts;

  const chooseCategory = (category: string) => {
    setSelectedCategory(category);
    setShowFullCatalog(category !== 'All');
  };

  return (
    <div className="wr-catalog-page">
      <header className="wr-catalog-hero wr-catalog-hero--centered">
        <div><span className="wr-eyebrow">{t(currentLocale, 'productCatalog')}</span><h1>Products</h1></div>
        <p>Browse the range, then open any item for dimensions, materials, finishes, packing, and quotation details.</p>
      </header>

      <div className="wr-catalog-layout">
        <aside className="wr-filter-rail" aria-label="Product filters">
          <div className="wr-filter-rail__heading"><span>Filter catalog</span><small>{displayedProducts.length} results</small></div>
          <label className="wr-search-input"><Search /><input value={searchQuery} onChange={(event) => { setSearchQuery(event.target.value); if (event.target.value) setShowFullCatalog(true); }} placeholder={t(currentLocale, 'searchPlaceholder')} /></label>
          <fieldset><legend>Category</legend>{categories.map((category) => <button key={category} className={selectedCategory === category ? 'is-active' : ''} onClick={() => chooseCategory(category)}><span>{category === 'All' ? t(currentLocale, 'all') : category}</span>{selectedCategory === category && <Check />}</button>)}</fieldset>
          <div className="wr-filter-note"><strong>MM + IMPERIAL REFERENCE</strong><p>Millimetres are primary. Rounded inch references support North American review; final dimensions require approved drawings.</p></div>
          {!compareIds.length && <div className="wr-filter-note wr-compare-empty"><GitCompare /><strong>No comparison selected</strong><p>Select two or three products to compare specifications side by side.</p></div>}
        </aside>

        <main className="wr-product-grid" aria-live="polite">
          {featuredMode && <div className="wr-product-grid__intro"><div><span className="wr-eyebrow">Featured Products</span><h2>{displayedProducts.length} of {products.length} products</h2><p>A representative selection is shown first. Open the complete catalog to review all current product programs.</p></div><button className="wr-button wr-button--secondary" onClick={() => setShowFullCatalog(true)}>View Full Catalog<ArrowRight /></button></div>}
          {!featuredMode && selectedCategory === 'All' && !searchQuery.trim() && <div className="wr-product-grid__intro wr-product-grid__intro--compact"><div><span className="wr-eyebrow">Full Catalog</span><h2>{filteredProducts.length} products</h2></div><button className="wr-button wr-button--ghost" onClick={() => setShowFullCatalog(false)}>Show Featured</button></div>}
          {displayedProducts.map((product) => {
            const compared = compareIds.includes(`product:${product.sku}`);
            const dimensions = product.specs.Size || product.specs.Sizes || product.dimensions;
            return (
              <article className="wr-catalog-card" key={product.sku}>
                <button className="wr-catalog-card__media" onClick={() => onSelectProduct(product)} aria-label={`View ${product.title}`}>
                  <img src={product.image} alt={product.imageType === 'render' ? `${product.title} illustrative render` : product.title} width={product.imageWidth || 1536} height={product.imageHeight || 1024} loading="lazy" />
                  <span className="wr-catalog-card__sku">{product.sku}</span>
                </button>
                <div className="wr-catalog-card__body">
                  {product.imageType === 'render' && <span className="wr-catalog-card__render-note">Illustrative render</span>}
                  <small>{productProgramFor(product)} · {product.material}</small>
                  <h2>{product.title}</h2>
                  <p>{formatMeasurement(product.description)}</p>
                  <dl>
                    <div><dt>{t(currentLocale, 'dimensions')}</dt><dd>{formatMeasurement(dimensions)}</dd></div>
                    <div><dt>{t(currentLocale, 'finish')}</dt><dd>{product.specs.Finish || 'Confirm by sample'}</dd></div>
                    <div><dt>MOQ</dt><dd>{product.specs.MOQ || product.moq || 'Confirm by quotation'}</dd></div>
                  </dl>
                  <div className="wr-catalog-card__actions">
                    <button className="wr-button wr-button--primary" onClick={() => onAddToCart(product)}><Plus />{t(currentLocale, 'addRfq')}</button>
                    <button className={`wr-button wr-button--ghost ${compared ? 'is-active' : ''}`} onClick={() => onToggleCompare(product)}><GitCompare />{compared ? t(currentLocale, 'compared') : t(currentLocale, 'compare')}</button>
                    <button className="wr-icon-button" onClick={() => onSelectProduct(product)} aria-label={t(currentLocale, 'fullSpecs')}><ArrowRight /></button>
                  </div>
                </div>
              </article>
            );
          })}
          {!displayedProducts.length && <div className="wr-empty-state"><h2>{t(currentLocale, 'noResults')}</h2><button className="wr-button wr-button--secondary" onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setShowFullCatalog(false); }}>{t(currentLocale, 'clear')}</button></div>}
        </main>
      </div>

      <section className="wr-size-reference" aria-labelledby="size-reference-title">
        <div><span className="wr-eyebrow">Common size reference</span><h2 id="size-reference-title">North American vanity and counter dimensions.</h2><p>Use these dimensions to begin the discussion. Sink model, cabinet, overhang, backsplash, finished edge, and final drawing govern production.</p></div>
        <div className="wr-size-reference__table" role="table" aria-label="Common North American stone top sizes">
          <div role="row"><strong role="columnheader">Program</strong><strong role="columnheader">Inches</strong><strong role="columnheader">Millimetres</strong></div>
          {[
            ['Single vanity', '25 × 22 in', '635 × 559 mm'],
            ['Single vanity', '31 × 22 in', '787 × 559 mm'],
            ['Single vanity', '37 × 22 in', '940 × 559 mm'],
            ['Single / offset vanity', '49 × 22 in', '1245 × 559 mm'],
            ['Double vanity', '61 × 22 in', '1549 × 559 mm'],
            ['Kitchen counter depth', '25½ in', '648 mm'],
          ].map(([program, imperial, metric]) => <div role="row" key={`${program}-${imperial}`}><span role="cell">{program}</span><span role="cell">{imperial}</span><span role="cell">{metric}</span></div>)}
        </div>
      </section>
    </div>
  );
};
