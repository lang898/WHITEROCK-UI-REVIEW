import React from 'react';
import { X, ZoomIn } from 'lucide-react';
import { Modal } from './ui/Modal';

export interface LightboxImage {
  src: string;
  alt: string;
}

interface ImageLightboxProps {
  image: LightboxImage | null;
  onClose: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <Modal onClose={onClose} ariaLabel={image.alt || 'Expanded image'} className="wr-image-lightbox" panelClassName="wr-image-lightbox__panel">
      <button className="wr-icon-button" onClick={onClose} aria-label="Close expanded image"><X /></button>
      <figure>
        <img src={image.src} alt={image.alt} width="1600" height="1200" />
        {image.alt && <figcaption><ZoomIn />{image.alt}</figcaption>}
      </figure>
    </Modal>
  );
};
