import React, { useMemo, useState } from 'react';
import { ArrowRight, Bath, Building2, Check, CookingPot, GitCompare, Plus, Search, TableProperties } from 'lucide-react';
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
  const productPrograms = useMemo(() => [
    { id: 'Vanity Tops', icon: Bath, description: 'Single and double bowl programs, cutouts, backsplashes, and packaged sets.' },
    { id: 'Kitchen Countertops', icon: CookingPot, description: 'Cut-to-size counters, islands, waterfall ends, and coordinated backsplashes.' },
    { id: 'Furniture Tops', icon: TableProperties, description: 'Custom dining, coffee, console, and occasional-table surfaces by drawing.' },
    { id: 'Project Products', icon: Building2, description: 'Hospitality, multi-family, commercial, waterjet, and architectural stone packages.' }
  ], []);
  const categories = useMemo(() => ['All', ...productPrograms.map((program) => program.id)], [productPrograms]);
  const representativeSkus = useMemo(() => [
    'WR-VT24', 'WR-VT31', 'WR-KT-QC', 'WR-KT-NS',
    'WR-FR-RM', 'WR-FR-OT', 'WR-HT', 'WR-WJ-MED'
  ], []);

  const productProgramFor = (product: ProductItem) => {
    if (product.category === 'Bathroom Vanity Top') return 'Vanity Tops';
    if (product.category === 'Kitchen Countertop') return 'Kitchen Countertops';
    if (product.category === 'Furniture Top' || product.category === 'Stone Furniture') return 'Furniture Tops';
    return 'Project Products';
  };

  const filteredProducts = products.filter((product) => {
    const search = searchQuery.trim().toLowerCase();
    return (selectedCategory === 'All' || productProgramFor(product) === selectedCategory) &&
      (!search || [product.title, product.sku, product.material, product.description].join(' ').toLowerCase().includes(search));
  });
  const displayedProducts = selectedCategory === 'All' && !searchQuery.trim()
    ? representativeSkus.map((sku) => products.find((product) => product.sku === sku)!).filter(Boolean)
    : filteredProducts;

  return (
    <div className="wr-catalog-page">
      <header className="wr-catalog-hero wr-catalog-hero--centered">
        <div><span className="wr-eyebrow">{t(currentLocale, 'productCatalog')} · B2B</span><h1>Four core product programs, built around your drawings.</h1></div>
        <p>Vanity tops, kitchen countertops, furniture tops, and project products form the core WHITEROCK offer. Dimensions, stone selection, fabrication details, quantity, and packing are confirmed for each quotation.</p>
      </header>

      <section className="wr-product-programs" aria-label="Core product programs">
        {productPrograms.map(({ id, icon: Icon, description }) => (
          <button key={id} className={selectedCategory === id ? 'is-active' : ''} onClick={() => setSelectedCategory(id)}>
            <Icon aria-hidden="true" />
            <span><strong>{id}</strong><small>{description}</small></span>
            <ArrowRight aria-hidden="true" />
          </button>
        ))}
      </section>

      <div className="wr-catalog-layout">
        <aside className="wr-filter-rail" aria-label="Product filters">
          <div className="wr-filter-rail__heading"><span>Filter catalog</span><small>{displayedProducts.length} results</small></div>
          <label className="wr-search-input"><Search /><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder={t(currentLocale, 'searchPlaceholder')} /></label>
          <fieldset><legend>Category</legend>{categories.map((category) => <button key={category} className={selectedCategory === category ? 'is-active' : ''} onClick={() => setSelectedCategory(category)}><span>{category === 'All' ? t(currentLocale, 'all') : category}</span>{selectedCategory === category && <Check />}</button>)}</fieldset>
          <div className="wr-filter-note"><strong>MM + IMPERIAL REFERENCE</strong><p>Millimetres are primary. Rounded inch references support North American review; final dimensions require approved drawings.</p></div>
          {!compareIds.length && <div className="wr-filter-note wr-compare-empty"><GitCompare /><strong>No comparison selected</strong><p>Select two or three products to compare specifications side by side.</p></div>}
        </aside>

        <main className="wr-product-grid" aria-live="polite">
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
                  {product.imageType === 'render' && <span className="wr-catalog-card__render-note">Illustrative render · not actual product</span>}
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
          {!displayedProducts.length && <div className="wr-empty-state"><h2>{t(currentLocale, 'noResults')}</h2><button className="wr-button wr-button--secondary" onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}>{t(currentLocale, 'clear')}</button></div>}
        </main>
      </div>
    </div>
  );
};
