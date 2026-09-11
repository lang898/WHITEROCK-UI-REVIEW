import React from 'react';
import { Plus, X } from 'lucide-react';
import type { ProductItem } from '../types';
import { ShareButton } from './ShareButton';
import type { ShareContent } from './SocialShareModal';
import { formatMeasurement } from '../utils/measurements';
import { Modal } from './ui/Modal';

interface ProductModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onAddToCart: (product: ProductItem) => void;
  onShare?: (content: ShareContent) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onAddToCart, onShare }) => {
  if (!product) return null;

  const dimensions = formatMeasurement(product.dimensions || product.specs.Size || 'Confirm by approved drawing');
  const thicknesses = formatMeasurement(product.thicknesses?.length ? product.thicknesses.join(', ') : (product.specs.Thickness || 'Confirm by quotation'));
  const edges = product.edges?.length ? product.edges.join(', ') : (product.specs.Edge || 'Confirm by approved drawing');
  const sinkIntegration = product.sinkCompatibility || product.specs.Sink || 'Confirm by approved drawing';
  const moq = product.moq || product.specs.MOQ || 'Confirm by quotation';
  const leadTime = product.leadTime || product.specs.LeadTime || 'Confirm by quotation';
  const packaging = product.packaging || product.specs.Packaging || 'Order-specific export packing';

  const shareContent: ShareContent = {
    title: `${product.title} (${product.sku})`,
    text: `WHITEROCK Vietnam: ${product.title} (${product.sku}) - ${product.material}. Final specifications and availability are confirmed in the written quotation.`,
    image: product.image,
    material: product.material,
    specs: `Dimensions: ${dimensions} | Thickness: ${thicknesses} | MOQ: ${moq}`,
    type: 'product',
  };

  return (
    <Modal onClose={onClose} ariaLabel={`${product.title} specifications`} panelClassName="wr-detail-dialog wr-detail-dialog--product">
      <div className="wr-modal-header">
        <div className="min-w-0">
          <span className="tech-badge text-stone-500">{product.sku} · {product.material}</span>
          <h3 className="mt-1 truncate text-lg">{product.title}</h3>
        </div>
        <button onClick={onClose} className="wr-modal-close" aria-label="Close product details"><X className="w-5 h-5" /></button>
      </div>

      <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="space-y-4">
            <div className="relative aspect-4/3 overflow-hidden border border-black/10 bg-stone-100">
              <picture>
                {product.imageAvif && <source srcSet={product.imageAvif} type="image/avif" />}
                {product.imageWebp && <source srcSet={product.imageWebp} type="image/webp" />}
                <img
                  src={product.image}
                  alt={product.imageAlt || (product.isIllustrative ? `${product.title} illustrative render` : product.title)}
                  width={product.imageWidth || 1600}
                  height={product.imageHeight || 1200}
                  loading="lazy"
                  className="wr-media-zoom h-full w-full object-cover"
                  onError={(event) => {
                    const target = event.currentTarget;
                    target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450"><rect width="600" height="450" fill="%23f5f5f7"/><rect x="40" y="40" width="520" height="370" fill="%23ffffff" stroke="%23d1d1d6" stroke-width="2"/><text x="50%25" y="46%25" dominant-baseline="middle" text-anchor="middle" fill="%231d1d1f" font-family="sans-serif" font-size="20" font-weight="bold">${product.sku}</text><text x="50%25" y="56%25" dominant-baseline="middle" text-anchor="middle" fill="%236e6e73" font-family="sans-serif" font-size="14">${product.category}</text></svg>`;
                  }}
                />
              </picture>
              {product.isIllustrative && <span className="absolute bottom-3 right-3 bg-black/75 px-3 py-1 text-[10px] font-semibold text-white">Illustrative render</span>}
            </div>
            <p className="text-sm leading-6 text-stone-600">{formatMeasurement(product.description)}</p>
            <p className="border-l-2 border-stone-300 pl-4 text-xs leading-5 text-stone-500">
              Product information shown here is a reference for inquiry. Final dimensions, material, finish, cutouts, edge details, packing, availability, and price are confirmed by approved drawing and written quotation.
            </p>
          </div>

          <div className="space-y-5">
            <section aria-labelledby="product-specifications-heading">
              <span className="tech-badge text-stone-500">Product specifications</span>
              <h4 id="product-specifications-heading" className="sr-only">Product specifications</h4>
              <dl className="mt-3 divide-y divide-black/10 border-y border-black/10 text-sm">
                <div className="grid grid-cols-[9rem_1fr] gap-4 py-3"><dt className="text-stone-500">Standard sizing</dt><dd className="font-medium text-stone-900">{dimensions}</dd></div>
                <div className="grid grid-cols-[9rem_1fr] gap-4 py-3"><dt className="text-stone-500">Thickness</dt><dd>{thicknesses}</dd></div>
                <div className="grid grid-cols-[9rem_1fr] gap-4 py-3"><dt className="text-stone-500">Edge profiles</dt><dd>{edges}</dd></div>
                <div className="grid grid-cols-[9rem_1fr] gap-4 py-3"><dt className="text-stone-500">Sink / cutout</dt><dd>{sinkIntegration}</dd></div>
              </dl>
            </section>

            <section aria-labelledby="product-commercial-heading">
              <span className="tech-badge text-stone-500">Commercial & export reference</span>
              <h4 id="product-commercial-heading" className="sr-only">Commercial and export reference</h4>
              <dl className="mt-3 divide-y divide-black/10 border-y border-black/10 text-sm">
                <div className="grid grid-cols-[9rem_1fr] gap-4 py-3"><dt className="text-stone-500">MOQ</dt><dd>{moq}</dd></div>
                <div className="grid grid-cols-[9rem_1fr] gap-4 py-3"><dt className="text-stone-500">Lead time</dt><dd>{leadTime}</dd></div>
                <div className="grid grid-cols-[9rem_1fr] gap-4 py-3"><dt className="text-stone-500">Packing</dt><dd>{packaging}</dd></div>
                <div className="grid grid-cols-[9rem_1fr] gap-4 py-3"><dt className="text-stone-500">Import treatment</dt><dd>Confirm with the buyer's customs broker</dd></div>
              </dl>
            </section>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/10 bg-stone-50 px-6 py-4 sm:px-8">
        <div className="flex items-center gap-2">
          <button onClick={onClose} className="wr-button wr-button--ghost">Close</button>
          {onShare && <ShareButton content={shareContent} onShare={onShare} variant="pill" label="Share Product" />}
        </div>
        <button
          onClick={() => {
            onAddToCart(product);
            onClose();
          }}
          className="wr-button wr-button--primary"
        >
          <Plus className="w-4 h-4" />
          <span>Add to RFQ</span>
        </button>
      </div>
    </Modal>
  );
};
