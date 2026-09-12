import React from 'react';

interface LandingHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  imageWebp?: string;
  imageAvif?: string;
  actions?: React.ReactNode;
  id?: string;
  className?: string;
}

const assetUrl = (value: string) => value.startsWith('/') ? value : `/${value}`;

export const LandingHero: React.FC<LandingHeroProps> = ({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  imageWebp,
  imageAvif,
  actions,
  id,
  className = '',
}) => (
  <header id={id} data-landing-hero className={`wr-landing-hero-v2 ${className}`.trim()}>
    <picture className="wr-landing-hero-v2__media" aria-hidden="true">
      {imageAvif && <source srcSet={assetUrl(imageAvif)} type="image/avif" />}
      {imageWebp && <source srcSet={assetUrl(imageWebp)} type="image/webp" />}
      <img src={assetUrl(image)} alt="" width="1920" height="1080" loading="eager" fetchPriority="high" />
    </picture>
    <div className="wr-landing-hero-v2__overlay" aria-hidden="true" />
    <div className="wr-landing-hero-v2__content">
      <span className="wr-eyebrow wr-eyebrow--light">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
      {actions && <div className="wr-landing-hero-v2__actions">{actions}</div>}
    </div>
    <span className="sr-only">{imageAlt}</span>
  </header>
);
