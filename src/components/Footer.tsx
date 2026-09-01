import React from 'react';
import { ArrowUpRight, Mail, MapPin, Phone, Share2 } from 'lucide-react';
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
  ].filter((item) => Boolean(item.href));
  const sitemap = [
    { title: 'Products', links: [
      ['products', t(currentLocale, 'products')], ['applications', t(currentLocale, 'applications')], ['samples', t(currentLocale, 'samples')]
    ] },
    { title: 'Materials', links: [
      ['colors', t(currentLocale, 'colors')], ['finishes', t(currentLocale, 'finishes')], ['stone-marble', 'Marble'], ['stone-granite', 'Granite'], ['stone-quartz', 'Quartz'], ['stone-quartzite', 'Quartzite'], ['stone-travertine', 'Travertine'], ['stone-engineered-marble', 'Engineered Marble']
    ] },
    { title: 'Company', links: [
      ['factory', t(currentLocale, 'factory')], ['about', t(currentLocale, 'about')], ['contact', t(currentLocale, 'contact')]
    ] },
    { title: 'Resources', links: [
      ['resources', t(currentLocale, 'resources')], ['partners', t(currentLocale, 'partners')], ['contact', t(currentLocale, 'requestQuote')]
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
          <div className="wr-footer__brand-lockup">
            <img className="wr-brand__mark" src="/assets/brand/whiterock-mark-refined.svg" alt="WHITEROCK stone mark" width="80" height="80" />
            <span><strong>{siteConfig.brand}</strong><small>{siteConfig.tagline}</small></span>
          </div>
          <p>Natural and engineered stone manufacturing in Binh Phuoc Province, Vietnam. Product specifications, availability, documentation, and commercial terms are documented in writing for each order.</p>
          <address>
            <span><MapPin />{siteConfig.address}</span>
            <a href={`mailto:${siteConfig.email}`}><Mail />{siteConfig.email}</a>
            <a href={`tel:${siteConfig.telHref}`}><Phone />{siteConfig.tel}</a>
          </address>
          {socialLinks.length > 0 && <nav className="wr-footer__socials" aria-label="Social media">
            {socialLinks.map(({ label, href, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label} (opens in a new tab)`} title={label}>
                <Icon />
              </a>
            ))}
          </nav>}
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

      <p className="wr-footer__material-note"><strong>Color and sample note.</strong> Digital textures are visual references. Natural stone varies by block and lot, and engineered surfaces may vary by batch. Approve the final material, range, finish, and thickness with a physical sample and order documents.</p>

      <div className="wr-footer__bottom">
        <p>© {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.</p>
      </div>
    </footer>
  );
};
