import React, { useEffect, useState } from 'react';
import { CheckCircle2, FileText, Maximize2, Minimize2, Package, RotateCcw, X, ZoomIn, ZoomOut } from 'lucide-react';
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
  onAddToRfq?: (color: ColorItem) => void;
  onShare?: (content: ShareContent) => void;
}

export const ColorModal: React.FC<ColorModalProps> = ({ color, onClose, onRequestSample, onAddToRfq, onShare }) => {
  const [zoom, setZoom] = useState(1);
  const [focus, setFocus] = useState({ x: 50, y: 50 });
  const [fullScreen, setFullScreen] = useState(false);
  const zoomIn = () => setZoom((value) => Math.min(3, Number((value + 0.5).toFixed(1))));
  const zoomOut = () => setZoom((value) => Math.max(1, Number((value - 0.5).toFixed(1))));
  const reset = () => { setZoom(1); setFocus({ x: 50, y: 50 }); };

  useEffect(() => { setZoom(1); setFocus({ x: 50, y: 50 }); setFullScreen(false); }, [color?.slug]);
  useEffect(() => {
    if (!fullScreen) return;
    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopImmediatePropagation(); setFullScreen(false); }
      else if (event.key === '+' || event.key === '=') { event.preventDefault(); zoomIn(); }
      else if (event.key === '-') { event.preventDefault(); zoomOut(); }
      else if (event.key === '0') { event.preventDefault(); reset(); }
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
    <Modal onClose={onClose} ariaLabel={`${color.name} color details`} panelClassName="wr-detail-dialog wr-detail-dialog--color wr-modal-enter">
      <div className="wr-modal-header">
        <div className="wr-modal-title"><span className="tech-badge">{color.material}</span><h3>{color.name}</h3></div>
        <button onClick={onClose} className="wr-modal-close" aria-label="Close color details"><X /></button>
      </div>

      <div className="wr-color-modal-body">
        <div className="wr-color-modal-grid">
          <div className="wr-color-modal-media">
            <div className={`wr-texture-viewer${fullScreen ? ' is-fullscreen' : ''}`}
              onPointerMove={(event) => {
                if (zoom === 1) return;
                const rect = event.currentTarget.getBoundingClientRect();
                setFocus({ x: ((event.clientX - rect.left) / rect.width) * 100, y: ((event.clientY - rect.top) / rect.height) * 100 });
              }}>
              <ColorSwatchImage color={color} width={1600} height={1600} loading="eager" style={{ transform: `scale(${zoom})`, transformOrigin: `${focus.x}% ${focus.y}%` }} />
              <div className="wr-texture-viewer__label">{color.colorFamily} Palette</div>
              {color.caption && <div className="wr-texture-viewer__caption">{color.caption}</div>}
              <div className="wr-texture-viewer__controls" aria-label="Texture zoom controls">
                <button className="wr-icon-button" onClick={zoomIn} aria-label="Zoom in"><ZoomIn /></button>
                <button className="wr-icon-button" onClick={zoomOut} aria-label="Zoom out"><ZoomOut /></button>
                <button className="wr-icon-button" onClick={reset} aria-label="Reset texture view"><RotateCcw /></button>
                <button className="wr-icon-button" onClick={() => setFullScreen((value) => !value)} aria-label={fullScreen ? 'Exit full screen texture view' : 'Open full screen texture view'}>{fullScreen ? <Minimize2 /> : <Maximize2 />}</button>
              </div>
              {fullScreen && <span className="wr-texture-viewer__keyboard-help">+ / − zoom · 0 reset · Esc exit</span>}
            </div>
            <MaterialDisclaimer type="digital-image" compact />
          </div>

          <div className="wr-color-modal-info">
            <section><span className="wr-detail-label">Material</span><strong>{color.material}</strong></section>
            <section><span className="wr-detail-label">Finish</span><div className="wr-detail-chips">{color.finishes.map((finish) => <span key={finish}>{finish}</span>)}</div></section>
            <section><span className="wr-detail-label">Thickness</span><div className="wr-detail-chips">{color.thicknesses.map((thickness) => <span key={thickness}>{formatMeasurement(thickness)}</span>)}</div></section>
            <section><span className="wr-detail-label">Recommended use</span><div className="wr-detail-list">{color.applications.map((app) => <div key={app}><CheckCircle2 /><span>{app}</span></div>)}</div></section>
            <section><span className="wr-detail-label">Description</span><p>{color.description}</p></section>
          </div>
        </div>
      </div>

      <div className="wr-modal-footer wr-color-modal-actions">
        <div><button onClick={onClose} className="wr-button wr-button--ghost">Close</button>{onShare && <ShareButton content={shareContent} onShare={onShare} variant="pill" label="Share Color" />}</div>
        <div><button onClick={() => onRequestSample(color)} className="wr-button wr-button--secondary"><Package />Add to Sample Box</button>{onAddToRfq && <button onClick={() => onAddToRfq(color)} className="wr-button wr-button--primary"><FileText />Add to RFQ</button>}</div>
      </div>
    </Modal>
  );
};
