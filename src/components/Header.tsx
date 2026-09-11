import React, { useEffect, useState } from 'react';
import { ChevronDown, FileText, Mail, Menu, Package, Search, X } from 'lucide-react';
import { WhatsAppIcon } from './SocialIcons';
import { siteConfig } from '../data/site';
import { productNavigation, routePath, stoneMaterialNavigation, type NavigationGroup } from '../routes';
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

const desktopNavigation: readonly NavigationGroup[] = [
  {
    label: 'Products',
    items: [
      { id: 'products', label: 'All Products' },
      ...productNavigation,
    ],
  },
  {
    label: 'Materials',
    items: [
      { id: 'materials', label: 'All Materials' },
      ...stoneMaterialNavigation,
      { id: 'colors', label: 'Colors' },
      { id: 'finishes', label: 'Finishes & Edges' },
      { id: 'applications', label: 'Applications' },
      { id: 'samples', label: 'Samples' },
      { id: 'resources', label: 'Technical Documents' },
    ],
  },
  { label: 'Factory', id: 'factory' },
  {
    label: 'Resources',
    items: [
      { id: 'applications', label: 'Applications' },
      { id: 'resources', label: 'Technical Resources' },
      { id: 'partners', label: 'Trade Program' },
    ],
  },
  {
    label: 'About',
    items: [
      { id: 'about', label: 'About the manufacturer' },
      { id: 'contact', label: 'Contact & support' },
    ],
  },
] as const;

const materialMegaColumns = [
  {
    title: 'Stone type',
    items: [{ id: 'materials', label: 'All Materials' }, ...stoneMaterialNavigation],
  },
  {
    title: 'Explore',
    items: [
      { id: 'colors', label: 'Colors' },
      { id: 'finishes', label: 'Finishes' },
      { id: 'finish-edges', label: 'Edge Profiles' },
      { id: 'applications', label: 'Applications' },
    ],
  },
  {
    title: 'Specify',
    items: [
      { id: 'samples', label: 'Samples' },
      { id: 'resources', label: 'Technical Documents' },
      { id: 'resources', label: 'Care & Maintenance' },
    ],
  },
] as const;

export const Header: React.FC<HeaderProps> = ({
  currentTab, setCurrentTab, cartCount, openCart, sampleCount, openSamples, currentLocale, onOpenSearch
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openMobileGroups, setOpenMobileGroups] = useState<string[]>(['Products']);

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

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const activeGroup = desktopNavigation.find((group) =>
      group.items?.some((item) => item.id === currentTab) || group.id === currentTab
    );
    if (activeGroup?.items?.length) {
      setOpenMobileGroups((groups) => groups.includes(activeGroup.label) ? groups : [...groups, activeGroup.label]);
    }
  }, [currentTab, mobileMenuOpen]);

  useEffect(() => {
    const handleOpenRfq = () => openCart();
    window.addEventListener(OPEN_RFQ_EVENT, handleOpenRfq);
    return () => window.removeEventListener(OPEN_RFQ_EVENT, handleOpenRfq);
  }, [openCart]);

  const navigate = (id: string) => {
    setCurrentTab(id);
    setMobileMenuOpen(false);
  };

  const closeParentMenu = (target: HTMLElement) => target.closest('details')?.removeAttribute('open');

  const isNavigationActive = (id: string) => currentTab === id ||
    (id === 'products' && currentTab.startsWith('product-')) ||
    (id === 'materials' && currentTab.startsWith('stone-')) ||
    (id === 'colors' && currentTab.startsWith('color-')) ||
    (id === 'finishes' && currentTab.startsWith('finish-')) ||
    (id === 'applications' && currentTab.startsWith('application-'));

  return (
    <header className={`wr-header ${isScrolled ? 'is-scrolled' : ''}`.trim()}>
      <div className="wr-header__utility">
        <p>{siteConfig.legalName} · Dong Nai, Vietnam</p>
        <div>
          <a href={`mailto:${siteConfig.email}`}><Mail aria-hidden="true" />{siteConfig.email}</a>
          <a href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"><WhatsAppIcon />WhatsApp</a>
        </div>
      </div>

      <div className="wr-header__main">
        <a className="wr-brand" href={routePath('home')} aria-label={`${siteConfig.displayBrand} home`} onClick={(event) => { event.preventDefault(); navigate('home'); }}>
          <img className="wr-brand__mark" src="/assets/brand/whiterock-mark-refined.svg" alt="Stone manufacturer mark" width="80" height="80" />
          <span><strong>{siteConfig.displayBrand}</strong><small>{siteConfig.tagline}</small></span>
        </a>

        <nav className="wr-nav" aria-label="Primary navigation">
          {desktopNavigation.map((item) => {
            if (!item.items?.length && item.id) {
              return <a key={item.label} className={isNavigationActive(item.id) ? 'is-active' : ''} href={routePath(item.id)} onClick={(event) => { event.preventDefault(); navigate(item.id); }}>{item.label}</a>;
            }
            const isActive = Boolean(item.id && isNavigationActive(item.id)) || item.items?.some((child) => isNavigationActive(child.id));
            const isMaterials = item.label === 'Materials';
            return (
              <details key={item.label} className={isActive ? 'is-active' : ''}>
                <summary><span>{item.label}</span><ChevronDown aria-hidden="true" /></summary>
                {isMaterials ? (
                  <div className="wr-nav__menu wr-nav__mega">
                    {materialMegaColumns.map((column) => (
                      <div key={column.title} className="wr-nav__mega-column">
                        <strong>{column.title}</strong>
                        {column.items.map((child, index) => (
                          <a key={`${column.title}-${child.id}-${index}`} href={routePath(child.id)} onClick={(event) => { event.preventDefault(); navigate(child.id); closeParentMenu(event.currentTarget); }}>{child.label}</a>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="wr-nav__menu">
                    {item.items?.map((child) => (
                      <a key={child.id} href={routePath(child.id)} onClick={(event) => { event.preventDefault(); navigate(child.id); closeParentMenu(event.currentTarget); }}>{child.label}</a>
                    ))}
                  </div>
                )}
              </details>
            );
          })}
        </nav>

        <div className="wr-header__actions">
          <button className="wr-icon-button" onClick={onOpenSearch} aria-label={t(currentLocale, 'search')} title={t(currentLocale, 'search')}><Search /></button>
          <button className="wr-button wr-button--secondary wr-header__samples" onClick={openSamples} aria-label={`${t(currentLocale, 'samples')} (${sampleCount})`}><Package /><span>{t(currentLocale, 'samples')}</span>{sampleCount > 0 && <b>{sampleCount}</b>}</button>
          <button className="wr-button wr-button--primary wr-header__rfq" onClick={openCart} aria-label={`${t(currentLocale, 'rfq')} (${cartCount})`}><FileText /><span>{t(currentLocale, 'rfq')}</span>{cartCount > 0 && <b>{cartCount}</b>}</button>
          <button className="wr-icon-button wr-header__menu-toggle" onClick={() => setMobileMenuOpen((open) => !open)} aria-expanded={mobileMenuOpen} aria-label="Toggle menu">{mobileMenuOpen ? <X /> : <Menu />}</button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="wr-mobile-nav" aria-label="Mobile navigation">
          {desktopNavigation.map((group) => {
            if (!group.items?.length && group.id) {
              return <a key={group.label} className={isNavigationActive(group.id) ? 'is-active' : ''} href={routePath(group.id)} onClick={(event) => { event.preventDefault(); navigate(group.id!); }}>{group.label}</a>;
            }
            return (
              <details
                key={group.label}
                open={openMobileGroups.includes(group.label)}
                onToggle={(event) => {
                  const isOpen = event.currentTarget.open;
                  setOpenMobileGroups((groups) => isOpen
                    ? Array.from(new Set([...groups, group.label]))
                    : groups.filter((label) => label !== group.label));
                }}
              >
                <summary>{group.label}<ChevronDown aria-hidden="true" /></summary>
                <div>{group.items?.map((entry, index) => <a key={`${entry.id}-${index}`} className={isNavigationActive(entry.id) ? 'is-active' : ''} href={routePath(entry.id)} onClick={(event) => { event.preventDefault(); navigate(entry.id); }}>{entry.label}</a>)}</div>
              </details>
            );
          })}
          <div className="wr-mobile-nav__actions">
            <button className="wr-button wr-button--secondary" onClick={openSamples}><Package />{t(currentLocale, 'samples')} ({sampleCount})</button>
            <button className="wr-button wr-button--primary" onClick={openCart}><FileText />Request a Quote ({cartCount})</button>
          </div>
        </nav>
      )}
    </header>
  );
};
