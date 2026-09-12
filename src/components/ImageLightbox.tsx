import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Minus, Plus, X, ZoomIn } from 'lucide-react';
import { Modal } from './ui/Modal';
import type { ProductImage } from '../types';

export interface LightboxImage {
  src: string;
  alt: string;
}

type LegacyImageLightboxProps = {
  image: LightboxImage | null;
  onClose: () => void;
  images?: never;
  index?: never;
  onIndexChange?: never;
};

type GalleryImageLightboxProps = {
  images: ProductImage[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  image?: never;
};

type ImageLightboxProps = LegacyImageLightboxProps | GalleryImageLightboxProps;

const assetUrl = (value: string) => value.startsWith('/') ? value : `/${value}`;
const clamp = (value: number) => Math.min(3, Math.max(1, value));

const GalleryImageLightbox: React.FC<GalleryImageLightboxProps> = ({ images, index, onIndexChange, onClose }) => {
  const [zoom, setZoom] = useState(1);
  const pinchStartRef = useRef<{ distance: number; zoom: number } | null>(null);
  const current = images[index];

  const move = (direction: number) => {
    onIndexChange((index + direction + images.length) % images.length);
    setZoom(1);
  };

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') move(-1);
      if (event.key === 'ArrowRight') move(1);
      if (event.key === '+' || event.key === '=') setZoom((value) => clamp(value + 0.25));
      if (event.key === '-') setZoom((value) => clamp(value - 0.25));
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [index, images.length, onClose]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, []);

  const touchDistance = (touches: React.TouchList) => {
    const a = touches[0];
    const b = touches[1];
    return Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
  };

  return (
    <div className="wr-image-lightbox wr-image-lightbox--gallery" role="dialog" aria-modal="true" aria-label="Product image viewer" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="wr-image-lightbox__toolbar">
        <span>{index + 1} / {images.length}</span>
        <div>
          <button type="button" onClick={() => setZoom((value) => clamp(value - 0.25))} aria-label="Zoom out"><Minus /></button>
          <strong data-lightbox-zoom>{Math.round(zoom * 100)}%</strong>
          <button type="button" onClick={() => setZoom((value) => clamp(value + 0.25))} aria-label="Zoom in"><Plus /></button>
          <button type="button" onClick={onClose} aria-label="Close image viewer"><X /></button>
        </div>
      </div>
      <button type="button" className="wr-image-lightbox__previous" onClick={() => move(-1)} aria-label="Previous image"><ChevronLeft /></button>
      <div
        className="wr-image-lightbox__stage"
        onWheel={(event) => { event.preventDefault(); setZoom((value) => clamp(value + (event.deltaY < 0 ? 0.2 : -0.2))); }}
        onTouchStart={(event) => {
          if (event.touches.length === 2) pinchStartRef.current = { distance: touchDistance(event.touches), zoom };
        }}
        onTouchMove={(event) => {
          if (event.touches.length !== 2 || !pinchStartRef.current) return;
          const ratio = touchDistance(event.touches) / pinchStartRef.current.distance;
          setZoom(clamp(pinchStartRef.current.zoom * ratio));
        }}
        onTouchEnd={() => { pinchStartRef.current = null; }}
      >
        <img src={assetUrl(current.avif || current.webp || current.src)} alt={current.alt} style={{ transform: `scale(${zoom})` }} draggable={false} />
        {current.placeholder && <span className="wr-image-lightbox__placeholder">Reference view placeholder</span>}
      </div>
      <button type="button" className="wr-image-lightbox__next" onClick={() => move(1)} aria-label="Next image"><ChevronRight /></button>
      <div className="wr-image-lightbox__caption"><strong>{current.label || 'Product reference'}</strong>{current.caption && <span>{current.caption}</span>}</div>
    </div>
  );
};

export const ImageLightbox: React.FC<ImageLightboxProps> = (props) => {
  if ('images' in props && props.images) return <GalleryImageLightbox {...props} />;
  if (!props.image) return null;
  return (
    <Modal onClose={props.onClose} ariaLabel={props.image.alt || 'Expanded image'} className="wr-image-lightbox" panelClassName="wr-image-lightbox__panel">
      <button className="wr-icon-button" onClick={props.onClose} aria-label="Close expanded image"><X /></button>
      <figure>
        <img src={props.image.src} alt={props.image.alt} width="1600" height="1200" />
        {props.image.alt && <figcaption><ZoomIn />{props.image.alt}</figcaption>}
      </figure>
    </Modal>
  );
};
