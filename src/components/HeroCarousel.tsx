import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, TouchEvent } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { factory } from '../data';

type HeroSlide = {
  label: string;
  caption: string;
  src: string;
  webp?: string;
  avif?: string;
  alt: string;
};

interface HeroCarouselProps {
  onExploreProducts: () => void;
  onRequestQuote: () => void;
}

const slides: HeroSlide[] = [
  {
    label: 'Finished applications',
    caption: 'Stone fabricated for residential, hospitality, and commercial programs.',
    src: '/assets/owner/countertops/waterfall-kitchen-island.jpg',
    webp: '/assets/owner/countertops/waterfall-kitchen-island-1280.webp',
    avif: '/assets/owner/countertops/waterfall-kitchen-island-1280.avif',
    alt: 'Finished stone waterfall kitchen island fabricated for a project application',
  },
  {
    label: 'Made to specification',
    caption: 'Fabricated to approved samples, drawings, and project requirements.',
    src: '/assets/owner/countertops/carrara-kitchen-island.jpg',
    webp: '/assets/owner/countertops/carrara-kitchen-island-1280.webp',
    avif: '/assets/owner/countertops/carrara-kitchen-island-1280.avif',
    alt: 'Finished Carrara stone kitchen island made to approved project requirements',
  },
  {
    label: 'Vietnam manufacturing',
    caption: 'Cutting, CNC, polishing, and fabrication coordinated in one production system.',
    src: '/assets/owner/enhanced/cnc-cutting-line-enhanced.jpg',
    alt: 'CNC stone fabrication equipment at the WHITEROCK Vietnam factory',
  },
  {
    label: 'Quality controlled',
    caption: 'Production checked against approved drawings, samples, and specifications.',
    src: '/assets/owner/enhanced/quality-inspection-team-enhanced.jpg',
    alt: 'WHITEROCK quality inspection team checking fabricated stone products in Vietnam',
  },
  {
    label: 'Material selection',
    caption: 'Stone selected through established material partners and quarry networks.',
    src: '/assets/owner/countertops/carrara-white-quarry-overview.jpg',
    alt: 'Carrara stone material selection at a sourcing partner quarry',
  },
  {
    label: 'Project supply',
    caption: 'Production, inspection, packing, and shipment planned for repeat programs.',
    src: '/assets/owner/enhanced/material-staging-hall-enhanced.jpg',
    alt: 'Stone material and finished product staging for project production and shipment',
  },
];

const AUTOPLAY_MS = 5500;
const MANUAL_PAUSE_MS = 12000;

const slideNumber = (index: number) => String(index + 1).padStart(2, '0');

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onExploreProducts, onRequestQuote }) => {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [manualPaused, setManualPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const manualPauseTimer = useRef<number | null>(null);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setReduceMotion(media.matches);
    updateMotionPreference();
    media.addEventListener?.('change', updateMotionPreference);
    return () => media.removeEventListener?.('change', updateMotionPreference);
  }, []);

  useEffect(() => () => {
    if (manualPauseTimer.current !== null) window.clearTimeout(manualPauseTimer.current);
  }, []);

  const pauseAfterManualAction = useCallback(() => {
    setManualPaused(true);
    if (manualPauseTimer.current !== null) window.clearTimeout(manualPauseTimer.current);
    manualPauseTimer.current = window.setTimeout(() => {
      setManualPaused(false);
      manualPauseTimer.current = null;
    }, MANUAL_PAUSE_MS);
  }, []);

  const goTo = useCallback((index: number, manual = true) => {
    setActive((index + slides.length) % slides.length);
    if (manual) pauseAfterManualAction();
  }, [pauseAfterManualAction]);

  const previous = useCallback(() => goTo(active - 1), [active, goTo]);
  const next = useCallback(() => goTo(active + 1), [active, goTo]);

  useEffect(() => {
    if (reduceMotion || hovered || manualPaused) return;
    const timer = window.setTimeout(() => {
      setActive((current) => (current + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [active, hovered, manualPaused, reduceMotion]);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      previous();
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      next();
    }
  };

  const handleTouchStart = (event: TouchEvent<HTMLElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLElement>) => {
    if (touchStartX.current === null) return;
    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const distance = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(distance) < 44) return;
    if (distance > 0) previous();
    else next();
  };

  return (
    <section
      className="wr-trust-hero"
      aria-roledescription="carousel"
      aria-label="WHITEROCK manufacturing and project capabilities"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="wr-trust-hero__media" aria-live="off">
        {slides.map((slide, index) => (
          <picture
            className={`wr-trust-hero__slide${index === active ? ' is-active' : ''}`}
            aria-hidden={index !== active}
            key={slide.label}
          >
            {slide.avif && <source srcSet={slide.avif} type="image/avif" />}
            {slide.webp && <source srcSet={slide.webp} type="image/webp" />}
            <img
              src={slide.src}
              alt={slide.alt}
              width="2000"
              height="956"
              loading={index === 0 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? 'high' : 'auto'}
              decoding="async"
            />
          </picture>
        ))}
      </div>

      <div className="wr-trust-hero__overlay" aria-hidden="true" />

      <div className="wr-trust-hero__inner">
        <div className="wr-trust-hero__copy">
          <p className="wr-trust-hero__eyebrow">WHITEROCK · Vietnam stone fabrication</p>
          <h1>Stone Selected. Made in Vietnam. Built to Drawing.</h1>
          <p className="wr-trust-hero__lead">
            Natural and engineered stone fabrication for vanity tops, countertops, furniture surfaces, and project programs.
          </p>
          <div className="wr-trust-hero__actions">
            <button className="wr-button wr-button--light" type="button" onClick={onExploreProducts}>Explore Products</button>
            <button className="wr-button wr-button--outline-light" type="button" onClick={onRequestQuote}>Request a Quote</button>
          </div>
        </div>

        <div className="wr-trust-hero__meta">
          <div className="wr-trust-hero__caption" aria-live="polite">
            <span>{slides[active].label}</span>
            <p>{slides[active].caption}</p>
          </div>

          <div className="wr-trust-hero__controls" aria-label="Carousel controls">
            <button type="button" onClick={previous} aria-label="Previous slide">
              <ArrowLeft size={18} aria-hidden="true" />
              <span>Previous</span>
            </button>
            <div className="wr-trust-hero__counter" aria-label={`Slide ${active + 1} of ${slides.length}`}>
              <span>{slideNumber(active)}</span>
              <div className="wr-trust-hero__progress" aria-hidden="true">
                <i style={{ width: `${((active + 1) / slides.length) * 100}%` }} />
              </div>
              <span>{String(slides.length).padStart(2, '0')}</span>
            </div>
            <button type="button" onClick={next} aria-label="Next slide">
              <span>Next</span>
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className="wr-trust-hero__stats" aria-label="Manufacturing capability">
        {factory.stats.slice(0, 4).map((stat) => (
          <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>
        ))}
      </div>
    </section>
  );
};
