import React from 'react';
import type { ColorItem } from '../types';

type ColorSwatchImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'width' | 'height' | 'color'> & {
  color: ColorItem;
  width?: number | string;
  height?: number | string;
};

export const ColorSwatchImage: React.FC<ColorSwatchImageProps> = ({
  color,
  width = 800,
  height = 800,
  ...imageProps
}) => (
  <picture>
    {color.swatchAvif && <source srcSet={color.swatchAvif} type="image/avif" />}
    {color.swatchWebp && <source srcSet={color.swatchWebp} type="image/webp" />}
    <img src={color.swatchImage} alt={color.imageAlt} width={width} height={height} {...imageProps} />
  </picture>
);
