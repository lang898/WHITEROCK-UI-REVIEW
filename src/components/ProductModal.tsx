import React from 'react';
import { ArrowRight, Plus, X } from 'lucide-react';
import { products } from '../data';
import type { ProductItem } from '../types';
import { ShareButton } from './ShareButton';
import type { ShareContent } from './SocialShareModal';
import { formatMeasurement } from '../utils/measurements';
import { Modal } from './ui/Modal';
import { MaterialDisclaimer } from './MaterialDisclaimer';

interface ProductModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onAddToCart: (product: ProductItem) => void;
  onShare?: (content: ShareContent) => void;
  onSelectRelated?: (product: ProductItem) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onAddToCart, onShare, onSelectRelated }) => {
  if (!product) return null;

  const dimensions = formatMeasurement(product.dimensions || product.specs.Size || product.specs.Sizes || 'Confirm by approved drawing');
  const thicknesses = formatMeasurement(product.thicknesses?.length ? product.thicknesses.join(', ') : (product.specs.Thickness || 'Confirm by quotation'));
  const edges = product.edges?.length ? product.edges.join(', ') : (product.specs.Edge || 'Confirm by approved drawing');
  const sinkIntegration = product.sinkCompatibility || product.specs.Sink || 'Confirm by approved drawing';
  const moq = product.moq || product.specs.MOQ || 'Confirm by quotation';
  const leadTime = product.leadTime || product.specs.LeadTime || 'Confirm by quotation';
  const packaging = product.packaging || product.specs.Packaging || 'Order-specific export packing';
  const relatedProducts = products.filter((item) => item.sku !== product.sku && (item.category === product.category || item.material === product.material)).slice(0, 3);
  const quickRows = [
    { label: 'Standard / reference size', value: dimensions },
    { label: 'Thickness options', value: thicknesses },
    { label: 'Edge direction', value: edges },
    { label: 'Sink / opening', value: sinkIntegration },
  ];

  const shareContent: ShareContent = {
    title: `${product.title} (${product.sku})`,
    text: `${product.title} (${product.sku}) - ${product.material}. Final specifications and availability are confirmed in the written quotation.`,
    image: product.image,
    material: product.material,
    specs: `Dimensions: ${dimensions} | Thickness: ${thicknesses} | MOQ: ${moq}`,
    type: 'product',
  };

  return (
    <Modal onClose={onClose} ariaLabel={`${product.title} specifications`} panelClassName="wr-detail-dialog wr-detail-dialog--product wr-modal-enter">
      <div className="wr-modal-header">
        <div className="min-w-0"><span className="tech-badge text-stone-500">{product.sku} · {product.material}</span><h3 className="mt-1 truncate text-lg">{product.title}</h3></div>
        <button onClick={onClose} className="wr-modal-close" aria-label="Close product details"><X className="w-5 h-5" /></button>
      </div>

      <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="space-y-4">
            <div className="relative aspect-4/3 overflow-hidden border border-black/10 bg-stone-100">
              <picture>{product.imageAvif && <source srcSet={product.imageAvif} type="image/avif" />}{product.imageWebp && <source srcSet={product.imageWebp} type="image/webp" />}<img src={product.image} alt={product.imageAlt || (product.isIllustrative ? `${product.title} illustrative render` : product.title)} width={product.imageWidth || 1600} height={product.imageHeight || 1200} loading="lazy" className="wr-media-zoom h-full w-full object-cover" onError={(event) => { event.currentTarget.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450"><rect width="600" height="450" fill="%23f5f5f7"/><text x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%231d1d1f" font-family="sans-serif" font-size="20">${product.sku}</text></svg>`; }} /></picture>
              {product.isIllustrative && <span className="absolute bottom-3 right-3 bg-black/75 px-3 py-1 text-xs font-semibold text-white">Illustrative render</span>}
            </div>
            <p className="text-sm leading-6 text-stone-600">{formatMeasurement(product.description)}</p>
            <MaterialDisclaimer type="quotation-confirmation" compact />
          </div>

          <div className="space-y-5">
            <section aria-labelledby="product-specifications-heading"><span className="tech-badge text-stone-500">Product specifications</span><h4 id="product-specifications-heading" className="sr-only">Product specifications</h4><dl className="mt-3 divide-y divide-black/10 border-y border-black/10 text-sm"><div className="grid grid-cols-[9rem_1fr] gap-4 py-3"><dt className="text-stone-500">Standard sizing</dt><dd className="font-medium text-stone-900">{dimensions}</dd></div><div className="grid grid-cols-[9rem_1fr] gap-4 py-3"><dt className="text-stone-500">Thickness</dt><dd>{thicknesses}</dd></div><div className="grid grid-cols-[9rem_1fr] gap-4 py-3"><dt className="text-stone-500">Edge profiles</dt><dd>{edges}</dd></div><div className="grid grid-cols-[9rem_1fr] gap-4 py-3"><dt className="text-stone-500">Sink / cutout</dt><dd>{sinkIntegration}</dd></div></dl></section>
            <section aria-labelledby="product-commercial-heading"><span className="tech-badge text-stone-500">Commercial & export reference</span><h4 id="product-commercial-heading" className="sr-only">Commercial and export reference</h4><dl className="mt-3 divide-y divide-black/10 border-y border-black/10 text-sm"><div className="grid grid-cols-[9rem_1fr] gap-4 py-3"><dt className="text-stone-500">MOQ</dt><dd>{moq}</dd></div><div className="grid grid-cols-[9rem_1fr] gap-4 py-3"><dt className="text-stone-500">Lead time</dt><dd>{leadTime}</dd></div><div className="grid grid-cols-[9rem_1fr] gap-4 py-3"><dt className="text-stone-500">Packing</dt><dd>{packaging}</dd></div><div className="grid grid-cols-[9rem_1fr] gap-4 py-3"><dt className="text-stone-500">Import treatment</dt><dd>Confirm with the buyer's customs broker</dd></div></dl></section>
          </div>
        </div>

        <section className="wr-product-quick-table" aria-labelledby="product-quick-table-heading"><span className="tech-badge">Dimension quick reference</span><h4 id="product-quick-table-heading" className="sr-only">Dimension quick reference</h4><div>{quickRows.map((row) => <article key={row.label}><span>{row.label}</span><strong>{row.value}</strong></article>)}</div></section>

        {relatedProducts.length > 0 && <section className="wr-related-products" aria-labelledby="related-products-heading"><div><span className="tech-badge">Related products</span><h3 id="related-products-heading">Continue the product shortlist.</h3></div><div className="wr-related-products__grid">{relatedProducts.map((item) => <button key={item.sku} type="button" onClick={() => onSelectRelated ? onSelectRelated(item) : undefined}><img src={item.imageWebp || item.image} alt={item.imageAlt || item.title} width="480" height="360" loading="lazy" /><span><small>{item.sku} · {item.material}</small><strong>{item.title}</strong><i>View product<ArrowRight /></i></span></button>)}</div></section>}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/10 bg-stone-50 px-6 py-4 sm:px-8"><div className="flex items-center gap-2"><button onClick={onClose} className="wr-button wr-button--ghost">Close</button>{onShare && <ShareButton content={shareContent} onShare={onShare} variant="pill" label="Share Product" />}</div><button onClick={() => { onAddToCart(product); onClose(); }} className="wr-button wr-button--primary"><Plus className="w-4 h-4" /><span>Add to RFQ</span></button></div>
    </Modal>
  );
};
