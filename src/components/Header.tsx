import React, { useState } from 'react';
import { ChevronDown, FileText, Globe, Mail, Menu, Package, Search, X } from 'lucide-react';
import { WhatsAppIcon } from './SocialIcons';
import { locales, siteConfig } from '../data/site';
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

export const Header: React.FC<HeaderProps> = ({
  currentTab, setCurrentTab, cartCount, openCart, sampleCount, openSamples, currentLocale, setLocale, onOpenSearch
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const navGroups = [
    { label: t(currentLocale, 'collections'), items: [
      { id: 'products', label: t(currentLocale, 'products') },
      { id: 'colors', label: t(currentLocale, 'colors') },
      { id: 'finishes', label: t(currentLocale, 'finishes') }
    ] },
    { label: t(currentLocale, 'stoneTypes'), items: [
      { id: 'stone-marble', label: 'Marble' },
      { id: 'stone-granite', label: 'Granite' },
      { id: 'stone-quartz', label: 'Quartz' },
      { id: 'stone-quartzite', label: 'Quartzite' },
      { id: 'stone-travertine', label: 'Travertine' },
      { id: 'stone-engineered-marble', label: 'Engineered Marble' }
    ] },
    { label: t(currentLocale, 'company'), items: [
      { id: 'about', label: t(currentLocale, 'about') },
      { id: 'factory', label: t(currentLocale, 'factory') },
      { id: 'events', label: t(currentLocale, 'events') }
    ] },
    { label: t(currentLocale, 'inspiration'), items: [{ id: 'applications', label: t(currentLocale, 'applications') }] },
    { label: t(currentLocale, 'trade'), items: [
      { id: 'partners', label: t(currentLocale, 'partners') },
      { id: 'resources', label: t(currentLocale, 'resources') },
      { id: 'samples', label: t(currentLocale, 'samples') }
    ] },
    { label: t(currentLocale, 'contact'), items: [{ id: 'contact', label: t(currentLocale, 'contact') }] }
  ];

  const navigate = (id: string) => {
    setCurrentTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="wr-header">
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
          <span><strong>WHITEROCK</strong><small>MARBLE & GRANITE</small></span>
        </a>

        <nav className="wr-nav" aria-label="Primary navigation">
          {navGroups.map((group) => {
            const isActive = group.items.some((item) => item.id === currentTab);
            if (group.items.length === 1) {
              const item = group.items[0];
              return <a key={group.label} className={isActive ? 'is-active' : ''} href={routePath(item.id)} onClick={(event) => { event.preventDefault(); navigate(item.id); }}>{group.label}</a>;
            }
            return (
              <details key={group.label} className={isActive ? 'is-active' : ''}>
                <summary>{group.label}<ChevronDown aria-hidden="true" /></summary>
                <div className="wr-nav__menu">
                  {group.items.map((item) => (
                    <a key={item.id} href={routePath(item.id)} onClick={(event) => { event.preventDefault(); navigate(item.id); event.currentTarget.closest('details')?.removeAttribute('open'); }}>{item.label}</a>
                  ))}
                </div>
              </details>
            );
          })}
        </nav>

        <div className="wr-header__actions">
          <button className="wr-icon-button" onClick={onOpenSearch} aria-label={t(currentLocale, 'search')} title={t(currentLocale, 'search')}><Search /></button>
          <div className="wr-language">
            <button className="wr-icon-button wr-language__trigger" onClick={() => setLangDropdownOpen((open) => !open)} aria-expanded={langDropdownOpen} aria-label={`Select language: ${currentLocale.switchLabel}`}><Globe /><span>{currentLocale.switchLabel}</span></button>
            {langDropdownOpen && <div className="wr-language__menu">{locales.map((locale) => <button key={locale.id} className={locale.id === currentLocale.id ? 'is-active' : ''} onClick={() => { setLocale(locale); setLangDropdownOpen(false); }}>{locale.label}</button>)}</div>}
          </div>
          <button className="wr-button wr-button--secondary wr-header__samples" onClick={openSamples} aria-label={`${t(currentLocale, 'samples')} (${sampleCount})`}><Package /><span>{t(currentLocale, 'samples')}</span>{sampleCount > 0 && <b>{sampleCount}</b>}</button>
          <button className="wr-button wr-button--primary wr-header__rfq" onClick={openCart} aria-label={`${t(currentLocale, 'rfq')} (${cartCount})`}><FileText /> <span>{t(currentLocale, 'rfq')}</span>{cartCount > 0 && <b>{cartCount}</b>}</button>
          <button className="wr-icon-button wr-header__menu-toggle" onClick={() => setMobileMenuOpen((open) => !open)} aria-expanded={mobileMenuOpen} aria-label="Toggle menu">{mobileMenuOpen ? <X /> : <Menu />}</button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="wr-mobile-nav" aria-label="Mobile navigation">
          <a href={routePath('home')} onClick={(event) => { event.preventDefault(); navigate('home'); }}>{t(currentLocale, 'home')}</a>
          {navGroups.flatMap((group) => group.items).map((item) => <a key={item.id} className={currentTab === item.id ? 'is-active' : ''} href={routePath(item.id)} onClick={(event) => { event.preventDefault(); navigate(item.id); }}>{item.label}</a>)}
          <button className="wr-button wr-button--secondary" onClick={openSamples}><Package />{t(currentLocale, 'samples')} ({sampleCount})</button>
          <button className="wr-button wr-button--primary" onClick={openCart}>{t(currentLocale, 'rfq')} ({cartCount})</button>
        </nav>
      )}
    </header>
  );
};
