import React, { useEffect, useState } from 'react';
import { ChevronDown, FileText, Mail, Menu, Package, Search, X } from 'lucide-react';
import { WhatsAppIcon } from './SocialIcons';
import { siteConfig } from '../data/site';
import { routePath } from '../routes';
import { t } from '../i18n';
import type { LocaleConfig } from '../types';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  cartCount: number;
  openCart: () => void;
  sampleCount: number;
  openSamples: () => void;
  currentLocale: LocaleConfig;
  setLocale: (loc: LocaleConfig) => void;
  onOpenShare?: () => void;
  onOpenSearch: () => void;
}

const materialItems = [
  { id: 'colors', label: 'Color Library' },
  { id: 'stone-marble', label: 'Marble' },
  { id: 'stone-granite', label: 'Granite' },
  { id: 'stone-quartz', label: 'Quartz' },
  { id: 'stone-quartzite', label: 'Quartzite' },
  { id: 'stone-travertine', label: 'Travertine' },
  { id: 'stone-engineered-marble', label: 'Engineered Marble' },
  { id: 'finishes', label: 'Finishes & Edges' },
] as const;

export const Header: React.FC<HeaderProps> = ({
  currentTab, setCurrentTab, cartCount, openCart, sampleCount, openSamples, currentLocale, onOpenSearch
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > 24);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    return () => window.removeEventListener('scroll', updateHeader);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && setMobileMenuOpen(false);
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [mobileMenuOpen]);

  const navigate = (id: string) => {
    setCurrentTab(id);
    setMobileMenuOpen(false);
  };

  const link = (id: string, label: string) => (
    <a className={currentTab === id ? 'is-active' : ''} href={routePath(id)} onClick={(event) => { event.preventDefault(); navigate(id); }}>{label}</a>
  );

  const materialActive = materialItems.some((item) => item.id === currentTab);
  const aboutActive = ['about', 'contact', 'events'].includes(currentTab);

  return (
    <header className={`wr-header ${isScrolled ? 'is-scrolled' : ''}`.trim()}>
      <div className="wr-header__utility">
        <p>WHITEROCK COMPANY LIMITED · Binh Phuoc, Vietnam</p>
        <div>
          <a href={`mailto:${siteConfig.email}`}><Mail aria-hidden="true" />{siteConfig.email}</a>
          <a href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"><WhatsAppIcon />WhatsApp</a>
        </div>
      </div>

      <div className="wr-header__main">
        <a className="wr-brand" href={routePath('home')} aria-label="WHITEROCK home" onClick={(event) => { event.preventDefault(); navigate('home'); }}>
          <img className="wr-brand__mark" src="/assets/brand/whiterock-mark-refined.svg" alt="" width="80" height="80" aria-hidden="true" />
          <span><strong>WHITEROCK</strong><small>NATURAL &amp; ENGINEERED STONE</small></span>
        </a>

        <nav className="wr-nav" aria-label="Primary navigation">
          {link('products', 'Products')}
          <details className={materialActive ? 'is-active' : ''}>
            <summary>Materials<ChevronDown aria-hidden="true" /></summary>
            <div className="wr-nav__menu wr-nav__menu--wide">
              {materialItems.map((item) => <a key={item.id} href={routePath(item.id)} onClick={(event) => { event.preventDefault(); navigate(item.id); event.currentTarget.closest('details')?.removeAttribute('open'); }}>{item.label}</a>)}
            </div>
          </details>
          {link('factory', 'Factory')}
          {link('applications', 'Applications')}
          {link('resources', 'Resources')}
          <details className={aboutActive ? 'is-active' : ''}>
            <summary>About<ChevronDown aria-hidden="true" /></summary>
            <div className="wr-nav__menu">
              <a href={routePath('about')} onClick={(event) => { event.preventDefault(); navigate('about'); }}>About WHITEROCK</a>
              <a href={routePath('contact')} onClick={(event) => { event.preventDefault(); navigate('contact'); }}>Contact</a>
              <a href={routePath('events')} onClick={(event) => { event.preventDefault(); navigate('events'); }}>Fairs &amp; Events</a>
            </div>
          </details>
        </nav>

        <div className="wr-header__actions">
          <button className="wr-icon-button" onClick={onOpenSearch} aria-label={t(currentLocale, 'search')} title={t(currentLocale, 'search')}><Search /></button>
          <button className="wr-button wr-button--secondary wr-header__samples" onClick={openSamples} aria-label={`Samples (${sampleCount})`}><Package /><span>Samples</span>{sampleCount > 0 && <b>{sampleCount}</b>}</button>
          <button className="wr-button wr-button--primary wr-header__rfq" onClick={openCart} aria-label={`RFQ (${cartCount})`}><FileText /><span>RFQ</span>{cartCount > 0 && <b>{cartCount}</b>}</button>
          <button className="wr-icon-button wr-header__menu-toggle" onClick={() => setMobileMenuOpen((open) => !open)} aria-expanded={mobileMenuOpen} aria-label="Toggle menu">{mobileMenuOpen ? <X /> : <Menu />}</button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="wr-mobile-nav wr-mobile-nav--grouped" aria-label="Mobile navigation">
          <a href={routePath('home')} onClick={(event) => { event.preventDefault(); navigate('home'); }}>Home</a>
          <details>
            <summary>Products<ChevronDown /></summary>
            <div>
              <a href={routePath('products')} onClick={(event) => { event.preventDefault(); navigate('products'); }}>All Products</a>
              <a href={routePath('products')} onClick={(event) => { event.preventDefault(); navigate('products'); }}>Vanity Tops</a>
              <a href={routePath('products')} onClick={(event) => { event.preventDefault(); navigate('products'); }}>Countertops</a>
              <a href={routePath('products')} onClick={(event) => { event.preventDefault(); navigate('products'); }}>Furniture Tops</a>
              <a href={routePath('products')} onClick={(event) => { event.preventDefault(); navigate('products'); }}>Project Products</a>
            </div>
          </details>
          <details>
            <summary>Materials<ChevronDown /></summary>
            <div>{materialItems.map((item) => <a key={item.id} href={routePath(item.id)} onClick={(event) => { event.preventDefault(); navigate(item.id); }}>{item.label}</a>)}</div>
          </details>
          <details>
            <summary>Company<ChevronDown /></summary>
            <div>
              <a href={routePath('about')} onClick={(event) => { event.preventDefault(); navigate('about'); }}>About</a>
              <a href={routePath('factory')} onClick={(event) => { event.preventDefault(); navigate('factory'); }}>Factory</a>
              <a href={routePath('contact')} onClick={(event) => { event.preventDefault(); navigate('contact'); }}>Contact</a>
            </div>
          </details>
          <details>
            <summary>Resources<ChevronDown /></summary>
            <div>
              <a href={routePath('finishes')} onClick={(event) => { event.preventDefault(); navigate('finishes'); }}>Finishes &amp; Edges</a>
              <a href={routePath('applications')} onClick={(event) => { event.preventDefault(); navigate('applications'); }}>Applications</a>
              <a href={routePath('resources')} onClick={(event) => { event.preventDefault(); navigate('resources'); }}>Technical Resources</a>
              <a href={routePath('samples')} onClick={(event) => { event.preventDefault(); navigate('samples'); }}>Samples</a>
            </div>
          </details>
          <button className="wr-button wr-button--secondary" onClick={() => { openSamples(); setMobileMenuOpen(false); }}><Package />Samples ({sampleCount})</button>
          <button className="wr-button wr-button--primary" onClick={() => { openCart(); setMobileMenuOpen(false); }}>Request a Quote ({cartCount})</button>
        </nav>
      )}
    </header>
  );
};
