import React, { useEffect, useState } from 'react';
import { CheckCircle2, Maximize2, Minimize2, Plus, RotateCcw, X, ZoomIn, ZoomOut } from 'lucide-react';
import type { ColorItem } from '../types';
import { ShareButton } from './ShareButton';
import type { ShareContent } from './SocialShareModal';
import { formatMeasurement } from '../utils/measurements';
import { Modal } from './ui/Modal';
import { ColorSwatchImage } from './ColorSwatchImage';
import { MaterialDisclaimer } from './MaterialDisclaimer';

interface ColorModalProps {
  color: ColorItem | null;
  onClose: () => void;
  onRequestSample: (color: ColorItem) => void;
  onShare?: (content: ShareContent) => void;
}

export const ColorModal: React.FC<ColorModalProps> = ({ color, onClose, onRequestSample, onShare }) => {
  const [zoom, setZoom] = useState(1);
  const [focus, setFocus] = useState({ x: 50, y: 50 });
  const [fullScreen, setFullScreen] = useState(false);

  const zoomIn = () => setZoom((value) => Math.min(3, Number((value + 0.5).toFixed(1))));
  const zoomOut = () => setZoom((value) => Math.max(1, Number((value - 0.5).toFixed(1))));
  const reset = () => { setZoom(1); setFocus({ x: 50, y: 50 }); };

  useEffect(() => {
    setZoom(1);
    setFocus({ x: 50, y: 50 });
    setFullScreen(false);
  }, [color?.slug]);

  useEffect(() => {
    if (!fullScreen) return;
    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopImmediatePropagation();
        setFullScreen(false);
      } else if (event.key === '+' || event.key === '=') {
        event.preventDefault();
        zoomIn();
      } else if (event.key === '-') {
        event.preventDefault();
        zoomOut();
      } else if (event.key === '0') {
        event.preventDefault();
        reset();
      }
    };
    window.addEventListener('keydown', handleKeyboard, true);
    return () => window.removeEventListener('keydown', handleKeyboard, true);
  }, [fullScreen]);

  if (!color) return null;

  const shareContent: ShareContent = {
    title: `${color.name} (${color.material})`,
    text: `Review ${color.name} ${color.material}. Listed thicknesses: ${formatMeasurement(color.thicknesses.join(', '))}. Confirm availability with a physical sample and written quotation.`,
    image: color.image || color.swatchImage,
    material: color.material,
    specs: `${color.pattern} pattern, ${color.primaryTone} tone. Uses: ${color.applications.join(', ')}.`,
    type: 'color',
  };

  return (
    <Modal onClose={onClose} ariaLabel={`${color.name} color details`} panelClassName="wr-detail-dialog wr-detail-dialog--color">
      <div className="wr-modal-header">
        <div className="flex items-center gap-3"><span className="tech-badge text-stone-800 bg-stone-50 px-2.5 py-1 border border-stone-200">{color.material}</span><h3 className="font-bold text-lg text-[#1d1d1f]">{color.name}</h3></div>
        <button onClick={onClose} className="wr-modal-close" aria-label="Close color details"><X className="w-5 h-5" /></button>
      </div>

      <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div
              className={`wr-texture-viewer relative aspect-square overflow-hidden bg-stone-100 border border-black/[0.06]${fullScreen ? ' is-fullscreen' : ''}`}
              onPointerMove={(event) => {
                if (zoom === 1) return;
                const rect = event.currentTarget.getBoundingClientRect();
                setFocus({ x: ((event.clientX - rect.left) / rect.width) * 100, y: ((event.clientY - rect.top) / rect.height) * 100 });
              }}
            >
              <ColorSwatchImage color={color} width={1600} height={1600} loading="eager" style={{ transform: `scale(${zoom})`, transformOrigin: `${focus.x}% ${focus.y}%` }} />
              <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-md text-xs font-semibold text-[#1d1d1f]">{color.colorFamily} Palette</div>
              {color.caption && <div className="absolute bottom-2 inset-x-2 text-center text-xs text-white bg-black/60 backdrop-blur-xs py-1">{color.caption}</div>}
              <div className="wr-texture-viewer__controls" aria-label="Texture zoom controls">
                <button className="wr-icon-button" onClick={zoomIn} aria-label="Zoom in"><ZoomIn /></button>
                <button className="wr-icon-button" onClick={zoomOut} aria-label="Zoom out"><ZoomOut /></button>
                <button className="wr-icon-button" onClick={reset} aria-label="Reset texture view"><RotateCcw /></button>
                <button className="wr-icon-button" onClick={() => setFullScreen((value) => !value)} aria-label={fullScreen ? 'Exit full screen texture view' : 'Open full screen texture view'}>{fullScreen ? <Minimize2 /> : <Maximize2 />}</button>
              </div>
              {fullScreen && <span className="wr-texture-viewer__keyboard-help">+ / − zoom · 0 reset · Esc exit</span>}
            </div>
            <p className="text-sm text-[#6e6e73] leading-relaxed">{color.description}</p>
            <MaterialDisclaimer type="digital-image" compact />
          </div>

          <div className="space-y-5">
            <section><span className="tech-badge text-[#86868b] block mb-2">AVAILABLE SURFACE FINISHES</span><div className="flex flex-wrap gap-1.5">{color.finishes.map((finish) => <span key={finish} className="px-3 py-1 bg-[#f5f5f7] text-[#1d1d1f] text-xs font-medium border border-black/[0.05]">{finish}</span>)}</div></section>
            <section><span className="tech-badge text-[#86868b] block mb-2">STANDARD THICKNESSES</span><div className="flex flex-wrap gap-1.5">{color.thicknesses.map((thickness) => <span key={thickness} className="px-3 py-1 bg-[#f5f5f7] text-[#1d1d1f] text-xs font-medium border border-black/[0.05]">{formatMeasurement(thickness)}</span>)}</div></section>
            <section><span className="tech-badge text-[#86868b] block mb-2">PRIMARY SPECIFICATIONS & USES</span><div className="space-y-2 text-sm text-[#1d1d1f]">{color.applications.map((app) => <div key={app} className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-stone-600 shrink-0" /><span>{app}</span></div>)}</div></section>
          </div>
        </div>
      </div>

      <div className="px-6 sm:px-8 py-4 border-t border-black/[0.06] bg-[#fbfbfd] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2"><button onClick={onClose} className="wr-button wr-button--ghost">Close</button>{onShare && <ShareButton content={shareContent} onShare={onShare} variant="pill" label="Share Color" />}</div>
        <button onClick={() => { onRequestSample(color); onClose(); }} className="wr-button wr-button--primary"><Plus className="w-4 h-4" /><span>Order sample</span></button>
      </div>
    </Modal>
  );
};
