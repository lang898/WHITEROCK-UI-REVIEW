import React from 'react';
import {
  X,
  Plus,
  Package,
  Layers,
  FileText,
  Clock,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Download,
  CheckCircle2,
  Share2
} from 'lucide-react';
import type { ProductItem } from '../types';
import { ShareButton } from './ShareButton';
import type { ShareContent } from './SocialShareModal';
import { formatMeasurement } from '../utils/measurements';

interface ProductModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onAddToCart: (product: ProductItem) => void;
  onShare?: (content: ShareContent) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onShare,
}) => {
  if (!product) return null;

  const shareContent: ShareContent = {
    title: `${product.title} (${product.sku})`,
    text: `WHITEROCK Vietnam: ${product.title} (${product.sku}) - ${product.material}. Dimensions shown: ${formatMeasurement(product.dimensions)}. Final specifications and availability are confirmed in the written quotation.`,
    image: product.image,
    material: product.material,
    specs: `Dimensions: ${formatMeasurement(product.dimensions)} | Thickness: ${formatMeasurement(product.thicknesses.join(', '))} | MOQ: ${product.moq}`,
    type: 'product'
  };

  return (
    <div className="wr-modal-backdrop" role="dialog" aria-modal="true" aria-label={`${product.title} specifications`} onClick={onClose}>
      <div
        className="relative bg-white rounded-[2rem] w-full max-w-4xl shadow-2xl text-[#1d1d1f] overflow-hidden max-h-[92vh] flex flex-col border border-black/[0.08]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="wr-modal-header">
          <div className="flex items-center gap-3">
            <span className="tech-badge text-stone-800 bg-stone-50 px-2.5 py-1 rounded-full border border-stone-200">
              {product.sku}
            </span>
            <h3 className="font-bold text-lg text-[#1d1d1f] truncate max-w-md">
              {product.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="wr-modal-close"
            aria-label="Close product details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Visual & Media */}
            <div className="space-y-3">
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-stone-100 border border-black/[0.06] group shadow-xs">
                <img
                  src={product.image}
                  alt={product.isIllustrative ? `${product.title} illustrative render` : product.title}
                  width={960}
                  height={720}
                  loading="lazy"
                  className="wr-media-zoom"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450"><rect width="600" height="450" fill="%23f5f5f7"/><rect x="40" y="40" width="520" height="370" rx="12" fill="%23ffffff" stroke="%23d1d1d6" stroke-width="2"/><text x="50%25" y="45%25" dominant-baseline="middle" text-anchor="middle" fill="%23b45309" font-family="sans-serif" font-size="20" font-weight="bold">${product.sku}</text><text x="50%25" y="55%25" dominant-baseline="middle" text-anchor="middle" fill="%236e6e73" font-family="sans-serif" font-size="14">${product.category}</text><text x="50%25" y="85%25" dominant-baseline="middle" text-anchor="middle" fill="%2386868b" font-family="sans-serif" font-size="11">WHITEROCK VIETNAM FACTORY</text></svg>`;
                  }}
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-semibold text-[#1d1d1f] shadow-xs">
                  {product.material}
                </div>
                {product.isIllustrative && (
                  <div className="absolute bottom-2 right-2 px-3 py-1 rounded-full bg-black/70 text-[10px] text-white">
                    Illustrative render
                  </div>
                )}
              </div>

              <p className="text-xs text-[#6e6e73] leading-relaxed">
                {formatMeasurement(product.description)}
              </p>
            </div>

            {/* Specifications Matrix */}
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="tech-badge text-[#86868b] block">
                  DIMENSIONS & STANDARDS
                </span>
                <div className="p-4 rounded-2xl bg-[#f5f5f7] border border-black/[0.05] space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#86868b]">Standard Sizing:</span>
                    <strong className="font-mono text-[#1d1d1f]">{formatMeasurement(product.dimensions)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#86868b]">Thickness Options:</span>
                    <span className="text-[#1d1d1f]">{formatMeasurement(product.thicknesses.join(', '))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#86868b]">Edge Profiles:</span>
                    <span className="text-[#1d1d1f]">{product.edges.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#86868b]">Sink Integration:</span>
                    <span className="text-stone-700 font-medium">{product.sinkCompatibility}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="tech-badge text-[#86868b] block">
                  EXPORT LOGISTICS & PACKAGING
                </span>
                <div className="p-4 rounded-2xl bg-[#f5f5f7] border border-black/[0.05] space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#86868b]">Minimum Order (MOQ):</span>
                    <span className="text-[#1d1d1f]">{product.moq}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#86868b]">Lead Time:</span>
                    <span className="text-[#1d1d1f]">{product.leadTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#86868b]">Crate Standard:</span>
                    <span className="text-[#1d1d1f]">{product.packaging}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#86868b]">Import Treatment:</span>
                    <span className="text-[#1d1d1f] font-semibold">Confirm with the buyer's customs broker</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 sm:px-8 py-4 border-t border-black/[0.06] bg-[#fbfbfd] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-medium text-[#6e6e73] hover:text-[#1d1d1f] cursor-pointer"
            >
              Close
            </button>
            {onShare && (
              <ShareButton
                content={shareContent}
                onShare={onShare}
                variant="pill"
                label="Share Product"
              />
            )}
          </div>

          <button
            onClick={() => {
              onAddToCart(product);
              onClose();
            }}
            className="px-6 py-3 rounded-full bg-[#111113] hover:bg-black text-white text-xs font-medium flex items-center gap-2 cursor-pointer shadow-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add SKU to RFQ Inquiries</span>
          </button>
        </div>
      </div>
    </div>
  );
};
