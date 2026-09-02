import React, { useEffect, useState } from 'react';
import { ChevronDown, FileText, Mail, Menu, Package, Search, X } from 'lucide-react';
import { WhatsAppIcon } from './SocialIcons';
import { siteConfig } from '../data/site';
import { mobileNavigation, primaryNavigation, routePath } from '../routes';
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
    const activeGroup = mobileNavigation.find((group) => group.items?.some((item) => item.id === currentTab));
    if (activeGroup) setOpenMobileGroups((groups) => groups.includes(activeGroup.label) ? groups : [...groups, activeGroup.label]);
  }, [currentTab, mobileMenuOpen]);

  const navigate = (id: string) => {
    setCurrentTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className={`wr-header ${isScrolled ? 'is-scrolled' : ''}`.trim()}>
      <div className="wr-header__utility">
        <p>{siteConfig.legalName} · Binh Phuoc, Vietnam</p>
        <div>
          <a href={`mailto:${siteConfig.email}`}><Mail aria-hidden="true" />{siteConfig.email}</a>
          <a href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"><WhatsAppIcon />WhatsApp</a>
        </div>
      </div>

      <div className="wr-header__main">
        <a className="wr-brand" href={routePath('home')} aria-label={`${siteConfig.brand} home`} onClick={(event) => { event.preventDefault(); navigate('home'); }}>
          <img className="wr-brand__mark" src="/assets/brand/whiterock-mark-refined.svg" alt="WHITEROCK stone mark" width="80" height="80" />
          <span><strong>{siteConfig.brand}</strong><small>{siteConfig.tagline}</small></span>
        </a>

        <nav className="wr-nav" aria-label="Primary navigation">
          {primaryNavigation.map((item) => {
            if (item.id) {
              return <a key={item.label} className={currentTab === item.id ? 'is-active' : ''} href={routePath(item.id)} onClick={(event) => { event.preventDefault(); navigate(item.id); }}>{item.label}</a>;
            }
            const isActive = item.items?.some((child) => child.id === currentTab);
            return (
              <details key={item.label} className={isActive ? 'is-active' : ''}>
                <summary>{item.label}<ChevronDown aria-hidden="true" /></summary>
                <div className="wr-nav__menu">
                  {item.items?.map((child) => (
                    <a key={child.id} href={routePath(child.id)} onClick={(event) => { event.preventDefault(); navigate(child.id); event.currentTarget.closest('details')?.removeAttribute('open'); }}>{child.label}</a>
                  ))}
                </div>
              </details>
            );
          })}
        </nav>

        <div className="wr-header__actions">
          <button className="wr-icon-button" onClick={onOpenSearch} aria-label={t(currentLocale, 'search')} title={t(currentLocale, 'search')}><Search /></button>
          <button className="wr-button wr-button--secondary wr-header__samples" onClick={openSamples} aria-label={`${t(currentLocale, 'samples')} (${sampleCount})`}><Package /><span>{t(currentLocale, 'samples')}</span>{sampleCount > 0 && <b>{sampleCount}</b>}</button>
          <button className="wr-button wr-button--primary wr-header__rfq" onClick={openCart} aria-label={`${t(currentLocale, 'rfq')} (${cartCount})`}><FileText /> <span>{t(currentLocale, 'rfq')}</span>{cartCount > 0 && <b>{cartCount}</b>}</button>
          <button className="wr-icon-button wr-header__menu-toggle" onClick={() => setMobileMenuOpen((open) => !open)} aria-expanded={mobileMenuOpen} aria-label="Toggle menu">{mobileMenuOpen ? <X /> : <Menu />}</button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="wr-mobile-nav" aria-label="Mobile navigation">
          {mobileNavigation.map((group) => (
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
              <div>{group.items?.map((item) => <a key={item.id} className={currentTab === item.id ? 'is-active' : ''} href={routePath(item.id)} onClick={(event) => { event.preventDefault(); navigate(item.id); }}>{item.label}</a>)}</div>
            </details>
          ))}
          <div className="wr-mobile-nav__actions">
            <button className="wr-button wr-button--secondary" onClick={openSamples}><Package />{t(currentLocale, 'samples')} ({sampleCount})</button>
            <button className="wr-button wr-button--primary" onClick={openCart}><FileText />Request a Quote ({cartCount})</button>
          </div>
        </nav>
      )}
    </header>
  );
};
