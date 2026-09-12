import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronRight, FileText, Mail, Menu, Package, Search, X } from 'lucide-react';
import { WhatsAppIcon } from './SocialIcons';
import { colors } from '../data';
import { siteConfig } from '../data/site';
import {
  aboutNavigation,
  applicationNavigation,
  colorNavigation,
  factoryNavigation,
  finishNavigation,
  primaryNavigation,
  productNavigation,
  resourceNavigation,
  routePath,
  stoneMaterialNavigation,
  type RouteId,
} from '../routes';
import { t } from '../i18n';
import type { LocaleConfig } from '../types';
import { OPEN_RFQ_EVENT } from '../lib/uiEvents';
import './HeaderTuning.css';

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

const byColor = [...colorNavigation, { id: 'colors' as RouteId, label: 'View all colors' }];
const byApplication = applicationNavigation;

const simpleMenus: Partial<Record<RouteId, readonly { id: RouteId; label: string }[]>> = {
  products: [...productNavigation, { id: 'products', label: 'View all products' }],
  factory: factoryNavigation,
  resources: resourceNavigation,
  about: aboutNavigation,
};

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  cartCount,
  openCart,
  sampleCount,
  openSamples,
  currentLocale,
  onOpenSearch,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<RouteId | null>(null);
  const [openMobileGroup, setOpenMobileGroup] = useState<RouteId | null>(null);
  const [hoveredMaterial, setHoveredMaterial] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const triggerRefs = useRef<Partial<Record<RouteId, HTMLAnchorElement | null>>>({});
  const closeTimerRef = useRef<number | null>(null);
  const focusReturnRef = useRef<RouteId | null>(null);

  const cancelCloseTimer = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const scheduleClose = () => {
    cancelCloseTimer();
    closeTimerRef.current = window.setTimeout(() => setOpenMenu(null), 200);
  };

  useEffect(() => () => cancelCloseTimer(), []);
  useEffect(() => { if (openMenu !== 'materials') setHoveredMaterial(null); }, [openMenu]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
      if (window.scrollY > 100) setOpenMenu(null);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!navRef.current?.contains(target)) setOpenMenu(null);
      if (mobileMenuOpen && !headerRef.current?.contains(target)) setMobileMenuOpen(false);
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      if (openMenu) {
        focusReturnRef.current = openMenu;
        setOpenMenu(null);
      }
      if (mobileMenuOpen) setMobileMenuOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [openMenu, mobileMenuOpen]);

  useEffect(() => {
    if (openMenu !== null || !focusReturnRef.current) return;
    const id = focusReturnRef.current;
    focusReturnRef.current = null;
    const timer = window.setTimeout(() => {
      const trigger = triggerRefs.current[id] ?? document.querySelector<HTMLAnchorElement>(`[data-nav="${id}"]`);
      trigger?.focus({ preventScroll: true });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [openMenu]);

  useEffect(() => {
    setOpenMenu(null);
    setMobileMenuOpen(false);
  }, [currentTab]);

  useEffect(() => {
    const handleOpenRfq = () => openCart();
    window.addEventListener(OPEN_RFQ_EVENT, handleOpenRfq);
    return () => window.removeEventListener(OPEN_RFQ_EVENT, handleOpenRfq);
  }, [openCart]);

  const navigate = (id: RouteId) => {
    setOpenMenu(null);
    setMobileMenuOpen(false);
    setCurrentTab(id);
  };

  const isNavigationActive = (id: RouteId) => {
    if (currentTab === id) return true;
    if (id === 'products') return currentTab.startsWith('product-');
    if (id === 'materials') return currentTab.startsWith('stone-') || currentTab === 'colors' || currentTab.startsWith('color-') || currentTab === 'finishes' || currentTab.startsWith('finish-') || currentTab === 'applications' || currentTab.startsWith('application-');
    if (id === 'factory') return currentTab.startsWith('factory-');
    if (id === 'resources') return currentTab.startsWith('resources-');
    if (id === 'about') return currentTab.startsWith('about-');
    return false;
  };

  const handlePrimaryKeyDown = (event: React.KeyboardEvent<HTMLAnchorElement>, id: RouteId, hasMenu: boolean) => {
    if (!hasMenu) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setOpenMenu(id);
    }
  };

  const renderSimpleMenu = (id: RouteId) => {
    const entries = simpleMenus[id] || [];
    return (
      <div className="wr-nav__menu wr-nav__menu--simple">
        {entries.map((entry) => (
          <a key={`${id}-${entry.id}-${entry.label}`} href={routePath(entry.id)} onClick={(event) => { event.preventDefault(); navigate(entry.id); }}>{entry.label}</a>
        ))}
      </div>
    );
  };

  const materialSwatches = hoveredMaterial ? colors.filter((color) => color.material === hoveredMaterial).slice(0, 4) : [];
  const renderMaterialsMenu = () => (
    <div className="wr-nav__menu wr-nav__mega wr-nav__mega--materials">
      <div className="wr-material-cascade">
        <div className="wr-material-cascade__primary">
          {stoneMaterialNavigation.map((entry) => (
            <a
              key={entry.id}
              className={hoveredMaterial === entry.label ? 'is-active' : ''}
              href={routePath(entry.id)}
              onMouseEnter={() => setHoveredMaterial(entry.label)}
              onFocus={() => setHoveredMaterial(entry.label)}
              onClick={(event) => { event.preventDefault(); navigate(entry.id); }}
            >
              <span>{entry.label}</span><ChevronRight aria-hidden="true" />
            </a>
          ))}
          <span className="wr-material-cascade__divider" aria-hidden="true" />
          <a href={routePath('materials')} onClick={(event) => { event.preventDefault(); navigate('materials'); }}>View all materials</a>
          <a href={routePath('colors')} onClick={(event) => { event.preventDefault(); navigate('colors'); }}>Colors library</a>
        </div>
        {hoveredMaterial && (
          <div className="wr-material-cascade__panel">
            <strong>{hoveredMaterial} colors</strong>
            <div className="wr-material-cascade__swatches">
              {materialSwatches.map((color) => (
                <a key={color.slug} href={`/colors/${color.slug}/`}>
                  <img src={color.swatchWebp || color.swatchImage} alt={`${color.name} ${color.material} swatch`} width="160" height="160" loading="lazy" />
                  <span>{color.name}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const mobileEntries = (id: RouteId) => {
    if (id === 'materials') return [...stoneMaterialNavigation, ...byColor, ...byApplication, ...finishNavigation];
    return simpleMenus[id] || [];
  };

  return (
    <header ref={headerRef} className={`wr-header ${isScrolled ? 'is-scrolled' : ''}`.trim()}>
      <div className="wr-header__utility">
        <p>{siteConfig.legalName} · Dong Nai, Vietnam</p>
        <div>
          <a href={`mailto:${siteConfig.email}`}><Mail aria-hidden="true" />{siteConfig.email}</a>
          <a href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"><WhatsAppIcon />WhatsApp</a>
        </div>
      </div>

      <div className="wr-header__main">
        <a className="wr-brand" href={routePath('home')} aria-label="WHITEROCK home" onClick={(event) => { event.preventDefault(); navigate('home'); }}>
          <span className="wr-brand__wordmark"><strong>WHITEROCK</strong><small>Natural &amp; Engineered Stone</small></span>
        </a>

        <nav ref={navRef} className="wr-nav" aria-label="Primary navigation">
          {primaryNavigation.map((item) => {
            const hasMenu = Boolean(item.items?.length);
            const isOpen = openMenu === item.id;
            const active = isNavigationActive(item.id);
            return (
              <div
                key={item.id}
                className={`wr-nav__item${active ? ' is-active' : ''}${isOpen ? ' is-open' : ''}`}
                onMouseEnter={() => { cancelCloseTimer(); if (hasMenu) setOpenMenu(item.id); }}
                onMouseLeave={hasMenu ? scheduleClose : undefined}
              >
                <div className="wr-nav__primary-row">
                  <a
                    ref={(node) => { triggerRefs.current[item.id] = node; }}
                    data-nav={item.id}
                    href={routePath(item.id)}
                    className={active ? 'is-active' : ''}
                    onClick={(event) => { event.preventDefault(); navigate(item.id); }}
                    onKeyDown={(event) => handlePrimaryKeyDown(event, item.id, hasMenu)}
                  >{item.label}</a>
                  {hasMenu && <button type="button" className="wr-nav__toggle" aria-label={`Open ${item.label} menu`} aria-expanded={isOpen} onClick={() => setOpenMenu((current) => current === item.id ? null : item.id)}><ChevronDown aria-hidden="true" /></button>}
                </div>
                {hasMenu && isOpen && (item.id === 'materials' ? renderMaterialsMenu() : renderSimpleMenu(item.id))}
              </div>
            );
          })}
        </nav>

        <div className="wr-header__actions">
          <button className="wr-icon-button wr-header__search" onClick={onOpenSearch} aria-label={`${t(currentLocale, 'search')} (Ctrl+K)`} title={`${t(currentLocale, 'search')} (Ctrl+K)`}><Search /></button>
          <button className="wr-button wr-button--secondary wr-header__samples" onClick={openSamples} aria-label={`${t(currentLocale, 'samples')} (${sampleCount})`}><Package /><span>{t(currentLocale, 'samples')}</span>{sampleCount > 0 && <b>{sampleCount}</b>}</button>
          <button className="wr-button wr-button--primary wr-header__rfq" onClick={openCart} aria-label={`${t(currentLocale, 'rfq')} (${cartCount})`}><FileText /><span>{t(currentLocale, 'rfq')}</span>{cartCount > 0 && <b>{cartCount}</b>}</button>
          <button className="wr-icon-button wr-header__menu-toggle" onClick={() => setMobileMenuOpen((open) => !open)} aria-expanded={mobileMenuOpen} aria-label="Toggle menu">{mobileMenuOpen ? <X /> : <Menu />}</button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="wr-mobile-nav-shell" onMouseDown={(event) => { if (event.target === event.currentTarget) setMobileMenuOpen(false); }}>
          <nav className="wr-mobile-nav" aria-label="Mobile navigation">
            <div className="wr-mobile-nav__header"><strong>WHITEROCK</strong><button className="wr-icon-button" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu"><X /></button></div>
            <div className="wr-mobile-nav__groups">
              {primaryNavigation.map((group) => {
                const children = mobileEntries(group.id);
                const expanded = openMobileGroup === group.id;
                return (
                  <section className="wr-mobile-nav__group" key={group.id}>
                    <div className="wr-mobile-nav__primary">
                      <a href={routePath(group.id)} onClick={(event) => { event.preventDefault(); navigate(group.id); }}>{group.label}</a>
                      {children.length > 0 && <button type="button" aria-label={`${expanded ? 'Collapse' : 'Expand'} ${group.label}`} aria-expanded={expanded} onClick={() => setOpenMobileGroup((current) => current === group.id ? null : group.id)}><ChevronDown className={expanded ? 'is-rotated' : ''} /></button>}
                    </div>
                    {expanded && children.length > 0 && <div className="wr-mobile-nav__children">{children.map((entry, index) => <a key={`${group.id}-${entry.id}-${index}`} href={routePath(entry.id)} onClick={(event) => { event.preventDefault(); navigate(entry.id); }}>{entry.label}</a>)}</div>}
                  </section>
                );
              })}
            </div>
            <div className="wr-mobile-nav__actions">
              <button className="wr-button wr-button--secondary" onClick={() => { onOpenSearch(); setMobileMenuOpen(false); }}><Search />Search</button>
              <button className="wr-button wr-button--secondary" onClick={() => { openSamples(); setMobileMenuOpen(false); }}><Package />Samples {sampleCount > 0 && `(${sampleCount})`}</button>
              <button className="wr-button wr-button--primary" onClick={() => { openCart(); setMobileMenuOpen(false); }}><FileText />RFQ {cartCount > 0 && `(${cartCount})`}</button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
