import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, TouchEvent } from 'react';
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';
import { siteConfig } from '../data/site';

type HeroSlide = {
  chapter: string;
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
    chapter: 'Application',
    label: 'Finished applications',
    caption: 'Natural and engineered stone fabricated for residential, hospitality, and commercial programs.',
    src: '/assets/owner/countertops/waterfall-kitchen-island.jpg',
    webp: '/assets/owner/countertops/waterfall-kitchen-island-1280.webp',
    avif: '/assets/owner/countertops/waterfall-kitchen-island-1280.avif',
    alt: 'Finished stone waterfall kitchen island fabricated for a project application',
  },
  {
    chapter: 'Drawing',
    label: 'Made to drawing',
    caption: 'Vanity tops and project components produced to approved drawings, samples, cutouts, and sink details.',
    src: '/assets/owner/enhanced/vanity-production-detail-enhanced.jpg',
    webp: '/assets/owner/enhanced/vanity-production-detail-enhanced-1280.webp',
    avif: '/assets/owner/enhanced/vanity-production-detail-enhanced-1280.avif',
    alt: 'Vanity tops in production at a Vietnam stone factory',
  },
  {
    chapter: 'Manufacturing',
    label: 'Vietnam manufacturing',
    caption: 'Cutting, CNC, edge processing, polishing, and fabrication coordinated in Dong Nai.',
    src: '/assets/owner/enhanced/cnc-cutting-line-enhanced.jpg',
    webp: '/assets/owner/enhanced/cnc-cutting-line-enhanced-1280.webp',
    avif: '/assets/owner/enhanced/cnc-cutting-line-enhanced-1280.avif',
    alt: 'CNC stone cutting and fabrication line at a Vietnam factory',
  },
  {
    chapter: 'QC',
    label: 'Quality controlled',
    caption: 'Dimensions, surfaces, cutouts, and finish are checked against the approved product before release.',
    src: '/assets/owner/enhanced/quality-inspection-team-enhanced.jpg',
    webp: '/assets/owner/enhanced/quality-inspection-team-enhanced-1280.webp',
    avif: '/assets/owner/enhanced/quality-inspection-team-enhanced-1280.avif',
    alt: 'Production team reviewing stone components during quality inspection in Vietnam',
  },
  {
    chapter: 'Repeat',
    label: 'Repeat-program readiness',
    caption: 'Matched vanity-top lots are organized for inspection, specification control, and repeat-order consistency.',
    src: '/assets/owner/enhanced/vanity-inspection-sequence-b-enhanced.jpg',
    webp: '/assets/owner/enhanced/vanity-inspection-sequence-b-enhanced-1280.webp',
    avif: '/assets/owner/enhanced/vanity-inspection-sequence-b-enhanced-1280.avif',
    alt: 'Matched vanity tops aligned for inspection at a Vietnam factory',
  },
  {
    chapter: 'Shipment',
    label: 'Order staging',
    caption: 'Finished components are organized by order for final checks, packing preparation, and shipment handoff.',
    src: '/assets/owner/enhanced/material-staging-hall-enhanced.jpg',
    webp: '/assets/owner/enhanced/material-staging-hall-enhanced-1280.webp',
    avif: '/assets/owner/enhanced/material-staging-hall-enhanced-1280.avif',
    alt: 'Finished stone components staged by order at a Vietnam factory',
  },
];

const AUTOPLAY_MS = 5500;
const MANUAL_PAUSE_MS = 12000;
const slideNumber = (index: number) => String(index + 1).padStart(2, '0');

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onExploreProducts, onRequestQuote }) => {
  const [active, setActive] = useState(0);
  const [manualPaused, setManualPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
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
  const autoplayBlocked = reduceMotion || manualPaused || userPaused;

  useEffect(() => {
    if (autoplayBlocked) return;
    const timer = window.setTimeout(() => setActive((current) => (current + 1) % slides.length), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [active, autoplayBlocked]);

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
      className={`wr-trust-hero wr-trust-hero--cinematic${userPaused || reduceMotion ? ' is-user-paused' : ''}`}
      aria-roledescription="carousel"
      aria-label="Stone manufacturing and project capabilities"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="wr-trust-hero__media" aria-live="off">
        {slides.map((slide, index) => (
          <picture className={`wr-trust-hero__slide${index === active ? ' is-active' : ''}`} aria-hidden={index !== active} key={slide.label}>
            {slide.avif && <source srcSet={slide.avif} type="image/avif" />}
            {slide.webp && <source srcSet={slide.webp} type="image/webp" />}
            <img src={slide.src} alt={slide.alt} width="2000" height="956" loading={index === 0 ? 'eager' : 'lazy'} fetchPriority={index === 0 ? 'high' : 'auto'} decoding="async" />
          </picture>
        ))}
      </div>

      <div className="wr-trust-hero__overlay" aria-hidden="true" />

      <div className="wr-trust-hero__inner">
        <div className="wr-trust-hero__copy">
          <p className="wr-trust-hero__eyebrow">{siteConfig.displayBrand} · Vietnam manufacturing</p>
          <h1>Stone, shaped to your drawing.</h1>
          <p className="wr-trust-hero__lead">Natural and engineered stone fabrication for vanity tops, countertops, furniture surfaces, and project programs.</p>
          <div className="wr-trust-hero__actions">
            <button className="wr-button wr-button--light" type="button" onClick={onRequestQuote}>Request a Quote</button>
            <button className="wr-button wr-button--outline-light" type="button" onClick={onExploreProducts}>Explore Products</button>
          </div>
        </div>

        <div className="wr-trust-hero__meta">
          <div className="wr-trust-hero__caption" aria-live="polite">
            <span>{slides[active].label}</span>
            <p>{slides[active].caption}</p>
          </div>

          <div className="wr-trust-hero__chapters" aria-label="Hero chapters">
            {slides.map((slide, index) => (
              <button key={slide.chapter} type="button" className={index === active ? 'is-active' : ''} aria-current={index === active ? 'true' : undefined} onClick={() => goTo(index)}>
                <span>{slideNumber(index)}</span>{slide.chapter}
              </button>
            ))}
          </div>

          <div className="wr-trust-hero__controls" aria-label="Carousel controls">
            <button type="button" onClick={previous} aria-label="Previous slide"><ArrowLeft size={18} aria-hidden="true" /><span>Previous</span></button>
            <button type="button" className="wr-trust-hero__playback" onClick={() => setUserPaused((paused) => !paused)} aria-pressed={userPaused} aria-label={userPaused ? 'Play hero slideshow' : 'Pause hero slideshow'}>
              {userPaused ? <Play size={18} aria-hidden="true" /> : <Pause size={18} aria-hidden="true" />}
              <span>{userPaused ? 'Play' : 'Pause'}</span>
            </button>
            <div className="wr-trust-hero__counter" aria-label={`Slide ${active + 1} of ${slides.length}`}>
              <span>{slideNumber(active)}</span>
              <div className="wr-trust-hero__progress" aria-hidden="true"><i style={{ width: `${((active + 1) / slides.length) * 100}%` }} /></div>
              <span>{String(slides.length).padStart(2, '0')}</span>
            </div>
            <button type="button" onClick={next} aria-label="Next slide"><span>Next</span><ArrowRight size={18} aria-hidden="true" /></button>
          </div>
        </div>
      </div>
    </section>
  );
};
