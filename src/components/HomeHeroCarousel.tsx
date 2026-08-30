import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, FileText } from 'lucide-react';

interface HeroSlide {
  id: string;
  label: string;
  caption: string;
  image: string;
  imageWebp?: string;
  imageAvif?: string;
  alt: string;
  objectPosition?: string;
}

interface HomeHeroCarouselProps {
  onExploreProducts: () => void;
  onRequestQuote: () => void;
}

const slides: HeroSlide[] = [
  {
    id: 'application',
    label: 'Finished Applications',
    caption: 'Stone fabricated for residential, hospitality and commercial programs.',
    image: '/assets/owner/countertops/waterfall-kitchen-island.jpg',
    imageWebp: '/assets/owner/countertops/waterfall-kitchen-island-1280.webp',
    imageAvif: '/assets/owner/countertops/waterfall-kitchen-island-1280.avif',
    alt: 'Finished waterfall stone kitchen island application',
    objectPosition: 'center 56%',
  },
  {
    id: 'product',
    label: 'Made to Specification',
    caption: 'Fabricated to approved samples, drawings and project requirements.',
    image: '/assets/owner/enhanced/vanity-production-detail-enhanced.jpg',
    alt: 'Finished stone vanity tops prepared inside the WHITEROCK Vietnam factory',
    objectPosition: 'center',
  },
  {
    id: 'factory',
    label: 'Vietnam Manufacturing',
    caption: 'Cutting, CNC, polishing and fabrication under one production system.',
    image: '/assets/owner/enhanced/cnc-cutting-line-enhanced.jpg',
    alt: 'Stone cutting and CNC production equipment at the WHITEROCK Vietnam factory',
    objectPosition: 'center',
  },
  {
    id: 'quality',
    label: 'Quality Controlled',
    caption: 'Production controlled against approved drawings, samples and specifications.',
    image: '/assets/owner/enhanced/quality-inspection-team-enhanced.jpg',
    alt: 'Quality inspection of stone components at the WHITEROCK Vietnam factory',
    objectPosition: 'center',
  },
  {
    id: 'material',
    label: 'Material Selection',
    caption: 'Selected stone sourced through established material partners and quarry networks.',
    image: '/assets/owner/countertops/carrara-white-quarry-overview.jpg',
    alt: 'Carrara quarry region visited during stone block sourcing and material selection',
    objectPosition: 'center',
  },
  {
    id: 'supply',
    label: 'Project Supply',
    caption: 'Production, inspection, packing and shipment planned for repeat project programs.',
    image: '/assets/owner/enhanced/material-staging-hall-enhanced.jpg',
    alt: 'Stone components staged for inspection and packing in the WHITEROCK Vietnam factory',
    objectPosition: 'center',
  },
];

const AUTO_ADVANCE_MS = 5500;

export const HomeHeroCarousel: React.FC<HomeHeroCarouselProps> = ({ onExploreProducts, onRequestQuote }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [manualPauseUntil, setManualPauseUntil] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const activeSlide = slides[activeIndex];

  const goTo = useCallback((index: number, manual = false) => {
    setActiveIndex((index + slides.length) % slides.length);
    if (manual) setManualPauseUntil(Date.now() + AUTO_ADVANCE_MS * 2);
  }, []);

  const goPrevious = useCallback(() => goTo(activeIndex - 1, true), [activeIndex, goTo]);
  const goNext = useCallback(() => goTo(activeIndex + 1, true), [activeIndex, goTo]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (isPaused) return;

    const timer = window.setInterval(() => {
      if (Date.now() < manualPauseUntil) return;
      setActiveIndex((current) => (current + 1) % slides.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(timer);
  }, [isPaused, manualPauseUntil]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goPrevious();
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goNext();
    }
  };

  return (
    <section
      className="wr-hero-carousel"
      aria-roledescription="carousel"
      aria-label="WHITEROCK manufacturing and project capabilities"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsPaused(false);
      }}
      onTouchStart={(event) => { touchStartX.current = event.changedTouches[0]?.clientX ?? null; }}
      onTouchEnd={(event) => {
        if (touchStartX.current === null) return;
        const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
        const delta = endX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(delta) < 48) return;
        if (delta > 0) goPrevious(); else goNext();
      }}
    >
      <div className="wr-hero-carousel__media" aria-live="off">
        {slides.map((slide, index) => (
          <picture
            key={slide.id}
            className={`wr-hero-carousel__slide ${index === activeIndex ? 'is-active' : ''}`}
            aria-hidden={index !== activeIndex}
          >
            {slide.imageAvif && <source srcSet={slide.imageAvif} type="image/avif" />}
            {slide.imageWebp && <source srcSet={slide.imageWebp} type="image/webp" />}
            <img
              src={slide.image}
              alt={index === activeIndex ? slide.alt : ''}
              width="2000"
              height="1200"
              loading={index === 0 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? 'high' : 'auto'}
              decoding={index === 0 ? 'sync' : 'async'}
              style={{ objectPosition: slide.objectPosition }}
            />
          </picture>
        ))}
      </div>
      <div className="wr-hero-carousel__shade" aria-hidden="true" />

      <div className="wr-hero-carousel__inner">
        <div className="wr-hero-carousel__copy">
          <p className="wr-eyebrow wr-eyebrow--light">Direct stone manufacturing · Vietnam</p>
          <h1>Stone Selected. Made in Vietnam. Built to Drawing.</h1>
          <p className="wr-hero-carousel__lead">Natural and engineered stone fabrication for vanity tops, countertops, furniture surfaces and project programs.</p>
          <div className="wr-hero-carousel__actions">
            <button className="wr-button wr-button--light" onClick={onExploreProducts}>Explore Products<ArrowRight /></button>
            <button className="wr-button wr-button--outline-light" onClick={onRequestQuote}><FileText />Request a Quote</button>
          </div>
        </div>

        <div className="wr-hero-carousel__caption" aria-live="polite">
          <span>{String(activeIndex + 1).padStart(2, '0')}</span>
          <div><strong>{activeSlide.label}</strong><p>{activeSlide.caption}</p></div>
        </div>
      </div>

      <div className="wr-hero-carousel__controls">
        <div className="wr-hero-carousel__counter" aria-hidden="true">
          <span>{String(activeIndex + 1).padStart(2, '0')}</span>
          <i><b style={{ width: `${((activeIndex + 1) / slides.length) * 100}%` }} /></i>
          <span>{String(slides.length).padStart(2, '0')}</span>
        </div>
        <div className="wr-hero-carousel__arrows">
          <button type="button" onClick={goPrevious} aria-label="Previous hero image"><ArrowLeft /><span>Previous</span></button>
          <button type="button" onClick={goNext} aria-label="Next hero image"><span>Next</span><ArrowRight /></button>
        </div>
      </div>

      <div className="wr-hero-proof" aria-label="WHITEROCK manufacturing figures">
        <div><strong>20+ Years</strong><span>Stone Industry Experience</span></div>
        <div><strong>20,000 m²</strong><span>Vietnam Factory</span></div>
        <div><strong>100,000+ m²</strong><span>Annual Capacity</span></div>
        <div><strong>Up to 50</strong><span>Containers / Month</span></div>
      </div>
    </section>
  );
};
