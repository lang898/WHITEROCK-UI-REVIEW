import React, { useMemo, useState } from 'react';
import { Maximize2 } from 'lucide-react';
import type { ProductItem } from '../types';
import { ImageLightbox, type ProductImage } from './ImageLightbox';

interface ProductGalleryProps {
  product: ProductItem;
}

type ProductWithImages = ProductItem & { images?: ProductImage[] };
const assetUrl = (value: string) => value.startsWith('/') ? value : `/${value}`;

export const ProductGallery: React.FC<ProductGalleryProps> = ({ product }) => {
  const productWithImages = product as ProductWithImages;
  const images = useMemo<ProductImage[]>(() => productWithImages.images?.length ? productWithImages.images : [{
    src: product.image,
    webp: product.imageWebp,
    avif: product.imageAvif,
    alt: product.imageAlt || product.title,
    caption: product.caption,
    label: 'Primary reference',
    placeholder: false,
  }], [product, productWithImages.images]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const active = images[activeIndex];

  return (
    <div className="wr-product-gallery">
      <button type="button" className="wr-product-gallery__main" data-lightbox-trigger onClick={() => setLightboxOpen(true)} aria-label={`Enlarge ${active.label || product.title}`}>
        <picture>
          {active.avif && <source srcSet={assetUrl(active.avif)} type="image/avif" />}
          {active.webp && <source srcSet={assetUrl(active.webp)} type="image/webp" />}
          <img src={assetUrl(active.src)} alt={active.alt} width={product.imageWidth || 1600} height={product.imageHeight || 1200} fetchPriority="high" />
        </picture>
        <span className="wr-product-gallery__zoom"><Maximize2 />Enlarge</span>
        {active.placeholder && <span className="wr-product-gallery__placeholder">Image placeholder</span>}
      </button>
      <div className="wr-product-gallery__thumbs" aria-label="Product image views">
        {images.map((image, index) => (
          <button
            type="button"
            key={`${image.src}-${index}`}
            data-gallery-thumb
            className={index === activeIndex ? 'is-active' : ''}
            onClick={() => setActiveIndex(index)}
            aria-label={`View ${image.label || `image ${index + 1}`}`}
            aria-pressed={index === activeIndex}
          >
            <img src={assetUrl(image.webp || image.src)} alt="" width="160" height="120" loading={index === 0 ? 'eager' : 'lazy'} />
            <span>{image.label || `View ${index + 1}`}</span>
            {image.placeholder && <small>Placeholder</small>}
          </button>
        ))}
      </div>
      {lightboxOpen && <ImageLightbox images={images} index={activeIndex} onIndexChange={setActiveIndex} onClose={() => setLightboxOpen(false)} />}
    </div>
  );
};
