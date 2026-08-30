import React from 'react';
import { ArrowUpRight, Mail, MapPin, Phone, Settings, Share2 } from 'lucide-react';
import { WhatsAppIcon } from './SocialIcons';
import { FacebookIcon, InstagramIcon, LinkedInIcon, PinterestIcon, XIcon } from './SocialIcons';
import { siteConfig } from '../data/site';
import { t } from '../i18n';
import type { LocaleConfig } from '../types';

interface FooterProps {
  currentLocale: LocaleConfig;
  setCurrentTab: (tab: string) => void;
  onOpenShare?: () => void;
  showInquiryCta?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ currentLocale, setCurrentTab, onOpenShare, showInquiryCta = true }) => {
  const socialLinks = [
    { label: 'Facebook', href: siteConfig.social.facebook, Icon: FacebookIcon },
    { label: 'Instagram', href: siteConfig.social.instagram, Icon: InstagramIcon },
    { label: 'LinkedIn', href: siteConfig.social.linkedin, Icon: LinkedInIcon },
    { label: 'Pinterest', href: siteConfig.social.pinterest, Icon: PinterestIcon },
    { label: 'X', href: siteConfig.social.x, Icon: XIcon }
  ];
  const sitemap = [
    { title: t(currentLocale, 'collections'), links: [
      ['products', t(currentLocale, 'products')], ['colors', t(currentLocale, 'colors')], ['finishes', t(currentLocale, 'finishes')]
    ] },
    { title: t(currentLocale, 'stoneTypes'), links: [
      ['stone-marble', 'Marble'], ['stone-granite', 'Granite'], ['stone-quartz', 'Quartz'], ['stone-quartzite', 'Quartzite'], ['stone-travertine', 'Travertine'], ['stone-engineered-marble', 'Engineered Marble']
    ] },
    { title: t(currentLocale, 'company'), links: [
      ['about', t(currentLocale, 'about')], ['factory', t(currentLocale, 'factory')], ['events', t(currentLocale, 'events')]
    ] },
    { title: t(currentLocale, 'trade'), links: [
      ['applications', t(currentLocale, 'applications')], ['partners', t(currentLocale, 'partners')], ['samples', t(currentLocale, 'samples')], ['resources', t(currentLocale, 'resources')], ['contact', t(currentLocale, 'contact')]
    ] }
  ];

  return (
    <footer className="wr-footer">
      {showInquiryCta && <section className="wr-footer__cta">
        <div><span className="wr-eyebrow">Direct B2B inquiry</span><h2>Bring us the drawing. We will help define the stone package.</h2></div>
        <button className="wr-button wr-button--primary" onClick={() => setCurrentTab('contact')}>{t(currentLocale, 'requestQuote')}<ArrowUpRight /></button>
      </section>}

      <div className="wr-footer__main">
        <div className="wr-footer__brand">
          <img className="wr-footer__logo" src="/assets/brand/whiterock-logo-refined.svg" alt="WHITEROCK Marble &amp; Granite" width="360" height="82" />
          <p>Natural and engineered stone manufacturing in Binh Phuoc Province, Vietnam. Product specifications, availability, documentation, and commercial terms are confirmed in writing for each order.</p>
          <address>
            <span><MapPin />{siteConfig.address}</span>
            <a href={`mailto:${siteConfig.email}`}><Mail />{siteConfig.email}</a>
            <a href={`tel:${siteConfig.telHref}`}><Phone />{siteConfig.tel}</a>
          </address>
          <nav className="wr-footer__socials" aria-label="Social media">
            {socialLinks.map(({ label, href, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label} (opens in a new tab)`} title={label}>
                <Icon />
              </a>
            ))}
          </nav>
        </div>

        <nav className="wr-footer__sitemap" aria-label="Footer sitemap">
          {sitemap.map((group) => (
            <div key={group.title}><h3>{group.title}</h3>{group.links.map(([id, label]) => <button key={id} onClick={() => setCurrentTab(id)}>{label}</button>)}</div>
          ))}
        </nav>

        <div className="wr-footer__contact">
          <h3>Direct contact</h3>
          <a href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"><WhatsAppIcon />WhatsApp<ArrowUpRight /></a>
          <a href={`mailto:${siteConfig.email}`}><Mail />Email<ArrowUpRight /></a>
          {onOpenShare && <button onClick={onOpenShare}><Share2 />Share website</button>}
        </div>
      </div>

      <div className="wr-footer__bottom">
        <p>© {new Date().getFullYear()} WHITEROCK COMPANY LIMITED. All rights reserved.</p>
        <button onClick={() => setCurrentTab('admin')}><Settings />Website administration</button>
      </div>
    </footer>
  );
};
