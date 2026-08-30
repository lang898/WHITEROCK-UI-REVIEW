import React from 'react';
import {
  X,
  Plus,
  Layers,
  FileText,
  Sparkles,
  Download,
  Check,
  Package,
  ShieldCheck,
  CheckCircle2,
  Share2
} from 'lucide-react';
import type { ColorItem } from '../types';
import { ShareButton } from './ShareButton';
import type { ShareContent } from './SocialShareModal';
import { formatMeasurement } from '../utils/measurements';

interface ColorModalProps {
  color: ColorItem | null;
  onClose: () => void;
  onRequestSample: (color: ColorItem) => void;
  onShare?: (content: ShareContent) => void;
}

export const ColorModal: React.FC<ColorModalProps> = ({
  color,
  onClose,
  onRequestSample,
  onShare,
}) => {
  if (!color) return null;

  const shareContent: ShareContent = {
    title: `${color.name} (${color.material})`,
    text: `Review ${color.name} ${color.material} from WHITEROCK Vietnam. Listed thicknesses: ${formatMeasurement(color.thicknesses.join(', '))}. Confirm availability with a physical sample and written quotation.`,
    image: color.image,
    material: color.material,
    specs: `${color.pattern} pattern, ${color.primaryTone} tone. Uses: ${color.applications.join(', ')}.`,
    type: 'color'
  };

  return (
    <div className="wr-modal-backdrop" role="dialog" aria-modal="true" aria-label={`${color.name} color details`} onClick={onClose}>
      <div
        className="relative bg-white rounded-[2rem] w-full max-w-3xl shadow-2xl text-[#1d1d1f] overflow-hidden max-h-[92vh] flex flex-col border border-black/[0.08]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="wr-modal-header">
          <div className="flex items-center gap-3">
            <span className="tech-badge text-stone-800 bg-stone-50 px-2.5 py-1 rounded-full border border-stone-200">
              {color.material}
            </span>
            <h3 className="font-bold text-lg text-[#1d1d1f]">
              {color.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="wr-modal-close"
            aria-label="Close color details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Swatch Image */}
            <div className="space-y-3">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-black/[0.06] group shadow-xs">
                <img
                  src={color.swatchImage}
                  alt={`${color.name} digital swatch`}
                  width={720}
                  height={720}
                  loading="lazy"
                  className="wr-media-zoom"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23f5f5f7"/><circle cx="200" cy="200" r="140" fill="%23e5e5ea" stroke="%23d1d1d6" stroke-width="2"/><text x="50%25" y="48%25" dominant-baseline="middle" text-anchor="middle" fill="%23b45309" font-family="sans-serif" font-size="18" font-weight="bold">${color.name}</text><text x="50%25" y="58%25" dominant-baseline="middle" text-anchor="middle" fill="%2386868b" font-family="sans-serif" font-size="13">${color.material} - ${color.colorFamily}</text></svg>`;
                  }}
                />
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-semibold text-[#1d1d1f] shadow-xs">
                  {color.colorFamily} Palette
                </div>
                {color.caption && (
                  <div className="absolute bottom-2 inset-x-2 text-center text-[10px] text-white bg-black/60 backdrop-blur-xs py-1 rounded-xl">
                    {color.caption}
                  </div>
                )}
              </div>

              <p className="text-xs text-[#6e6e73] leading-relaxed">
                {color.description}
              </p>
            </div>

            {/* Spec breakdown */}
            <div className="space-y-4">
              <div>
                <span className="tech-badge text-[#86868b] block mb-2">
                  AVAILABLE SURFACE FINISHES
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {color.finishes.map((f) => (
                    <span
                      key={f}
                      className="px-3 py-1 rounded-full bg-[#f5f5f7] text-[#1d1d1f] text-xs font-medium border border-black/[0.05]"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="tech-badge text-[#86868b] block mb-2">
                  STANDARD THICKNESSES
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {color.thicknesses.map((thickness) => (
                    <span
                      key={thickness}
                      className="px-3 py-1 rounded-full bg-[#f5f5f7] text-[#1d1d1f] text-xs font-medium border border-black/[0.05]"
                    >
                      {formatMeasurement(thickness)}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="tech-badge text-[#86868b] block mb-2">
                  PRIMARY SPECIFICATIONS & USES
                </span>
                <div className="space-y-1.5 text-xs text-[#1d1d1f]">
                  {color.applications.map((app) => (
                    <div key={app} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-stone-600 shrink-0" />
                      <span>{app}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
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
                label="Share Color"
              />
            )}
          </div>

          <button
            onClick={() => {
              onRequestSample(color);
              onClose();
            }}
            className="px-6 py-3 rounded-full bg-[#111113] hover:bg-black text-white text-xs font-medium flex items-center gap-2 cursor-pointer shadow-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Order sample</span>
          </button>
        </div>
      </div>
    </div>
  );
};
