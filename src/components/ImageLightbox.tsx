import React, { useEffect } from 'react';
import { X, ZoomIn } from 'lucide-react';

export interface LightboxImage {
  src: string;
  alt: string;
}

interface ImageLightboxProps {
  image: LightboxImage | null;
  onClose: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({ image, onClose }) => {
  useEffect(() => {
    if (!image) return undefined;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [image, onClose]);

  if (!image) return null;

  return (
    <div className="wr-image-lightbox" role="dialog" aria-modal="true" aria-label={image.alt || 'Expanded image'} onClick={onClose}>
      <button className="wr-icon-button" onClick={onClose} aria-label="Close expanded image"><X /></button>
      <figure onClick={(event) => event.stopPropagation()}>
        <img src={image.src} alt={image.alt} />
        {image.alt && <figcaption><ZoomIn />{image.alt}</figcaption>}
      </figure>
    </div>
  );
};
