import React from 'react';
import type { PhotoReferenceItem } from '../types';

interface PhotoReferenceRailProps {
  items: PhotoReferenceItem[];
  ariaLabel: string;
  aspect?: 'landscape' | 'square';
}

export const PhotoReferenceRail: React.FC<PhotoReferenceRailProps> = ({
  items,
  ariaLabel,
  aspect = 'landscape',
}) => (
  <div className={`wr-photo-rail wr-photo-rail--${aspect}`} role="list" aria-label={ariaLabel}>
    {items.map((item) => (
      <figure className="wr-photo-rail__item" role="listitem" key={item.id}>
        <picture>
          {item.imageAvif && <source srcSet={item.imageAvif} type="image/avif" />}
          {item.imageWebp && <source srcSet={item.imageWebp} type="image/webp" />}
          <img src={item.image} alt={item.alt} width={item.width} height={item.height} loading="lazy" />
        </picture>
        <figcaption>{item.caption}</figcaption>
      </figure>
    ))}
  </div>
);
