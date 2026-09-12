import React from 'react';
import { ArrowLeft, ArrowRight, FileText } from 'lucide-react';
import { products } from '../data';
import type { ProductItem } from '../types';
import type { ShareContent } from '../components/SocialShareModal';
import { ShareButton } from '../components/ShareButton';
import { MaterialDisclaimer } from '../components/MaterialDisclaimer';
import { ProductGallery } from '../components/ProductGallery';
import { Button } from '../components/ui/Button';
import { formatMeasurement } from '../utils/measurements';

interface ProductDetailViewProps {
  product: ProductItem;
  onAddToCart: (product: ProductItem) => void;
  onShare?: (content: ShareContent) => void;
  onSelectRelated: (product: ProductItem) => void;
  onBackToProducts: () => void;
}

const assetUrl = (value: string) => value.startsWith('/') ? value : `/${value}`;

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product, onAddToCart, onShare, onSelectRelated, onBackToProducts }) => {
  const dimensions = formatMeasurement(product.dimensions || product.specs.Size || product.specs.Sizes || 'Confirm by approved drawing');
  const thicknesses = formatMeasurement(product.thicknesses?.length ? product.thicknesses.join(', ') : (product.specs.Thickness || 'Confirm by quotation'));
  const edges = product.edges?.length ? product.edges.join(', ') : (product.specs.Edge || 'Confirm by approved drawing');
  const sinkIntegration = product.sinkCompatibility || product.specs.Sink || 'Confirm by approved drawing';
  const moq = product.moq || product.specs.MOQ || 'Confirm by quotation';
  const leadTime = product.leadTime || product.specs.LeadTime || 'Confirm by quotation';
  const packaging = product.packaging || product.specs.Packaging || 'Order-specific export packing';
  const relatedProducts = products.filter((item) => item.sku !== product.sku && (item.category === product.category || item.material === product.material)).slice(0, 3);
  const shareContent: ShareContent = {
    title: `${product.title} (${product.sku})`,
    text: `${product.title} (${product.sku}) - ${product.material}. Final specifications and availability are confirmed in the written quotation.`,
    image: assetUrl(product.image),
    material: product.material,
    specs: `Dimensions: ${dimensions} | Thickness: ${thicknesses} | MOQ: ${moq}`,
    type: 'product',
  };

  return (
    <div className="wr-landing-page wr-product-detail-page">
      <section className="wr-section-band wr-product-detail-hero" data-landing-hero>
        <button type="button" className="wr-text-link" onClick={onBackToProducts}><ArrowLeft />Back to products</button>
        <div className="wr-product-detail-layout">
          <ProductGallery product={product} />
          <div className="wr-product-detail-copy">
            <span className="wr-eyebrow">{product.sku} · {product.material}</span>
            <h1>{product.title}</h1>
            <p>{formatMeasurement(product.description)}</p>
            <MaterialDisclaimer type="quotation-confirmation" compact />
            <div className="wr-product-detail-actions">
              <Button onClick={() => onAddToCart(product)}><FileText />Add to RFQ</Button>
              {onShare && <ShareButton content={shareContent} onShare={onShare} variant="pill" label="Share Product" />}
            </div>
          </div>
        </div>
      </section>

      <section className="wr-section-band wr-section-band--mist" aria-labelledby="product-detail-specs">
        <div className="wr-section-heading"><span className="wr-eyebrow">Product specifications</span><h2 id="product-detail-specs">Reference details for quotation and drawing review.</h2></div>
        <div className="wr-landing-grid">
          <article><h2>Size & fabrication</h2><p><strong>Reference size:</strong> {dimensions}</p><p><strong>Thickness:</strong> {thicknesses}</p><p><strong>Edge:</strong> {edges}</p><p><strong>Sink / opening:</strong> {sinkIntegration}</p></article>
          <article><h2>Commercial reference</h2><p><strong>MOQ:</strong> {moq}</p><p><strong>Lead time:</strong> {leadTime}</p><p><strong>Packing:</strong> {packaging}</p></article>
          <article><h2>Order confirmation</h2><p>Final dimensions, openings, edge profiles, material lot, finish, packing, quantity, and schedule are confirmed by written quotation and approved drawing.</p></article>
        </div>
      </section>

      {relatedProducts.length > 0 && <section className="wr-section-band" aria-labelledby="product-detail-related"><div className="wr-section-heading"><span className="wr-eyebrow">Related products</span><h2 id="product-detail-related">Continue the product shortlist.</h2></div><div className="wr-landing-grid">{relatedProducts.map((item) => <article key={item.sku}><img src={assetUrl(item.imageWebp || item.image)} alt={item.imageAlt || item.title} width="480" height="360" loading="lazy" /><span className="wr-eyebrow">{item.sku} · {item.material}</span><h2>{item.title}</h2><button type="button" className="wr-text-link" onClick={() => onSelectRelated(item)}>View product<ArrowRight /></button></article>)}</div></section>}
    </div>
  );
};
