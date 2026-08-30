import React from 'react';
import { Mail } from 'lucide-react';
import { WhatsAppIcon } from './SocialIcons';
import { siteConfig } from '../data/site';

interface ContactRailProps {
  className?: string;
}

export const ContactRail: React.FC<ContactRailProps> = ({
  className = ''
}) => {
  const whatsappNumber = siteConfig.whatsapp.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hello WHITEROCK Stone Vietnam, I am interested in getting a project quotation / stone vanity top catalog.'
  )}`;

  return (
    <aside
      id="contact-rail-sidebar"
      aria-label="Quick contact"
      className={`fixed right-0 top-1/2 -translate-y-1/2 z-40 flex flex-col items-end gap-2 pr-2.5 select-none ${className}`}
    >
      {/* WhatsApp Direct Inquiry */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        id="rail-whatsapp-btn"
        className="group flex items-center bg-white hover:bg-[#1d1d1f] border border-stone-300 hover:border-[#1d1d1f] rounded-full p-2.5 shadow-lg backdrop-blur-md transition-all duration-300 cursor-pointer overflow-hidden text-[#1d1d1f] hover:text-white"
        title="Chat on WhatsApp (Fastest Response)"
      >
        <div className="flex items-center justify-center w-6 h-6 shrink-0">
          <WhatsAppIcon className="w-5 h-5" />
        </div>
        <span className="wr-contact-rail-label">
          WhatsApp Direct
        </span>
      </a>

      {/* Direct Email Contact */}
      <a
        href={`mailto:${siteConfig.email}?subject=WHITEROCK%20Stone%20Project%20Inquiry`}
        id="rail-email-btn"
        className="group flex items-center bg-white hover:bg-stone-600 border border-stone-300 hover:border-stone-500 rounded-full p-2.5 shadow-lg backdrop-blur-md transition-all duration-300 cursor-pointer overflow-hidden text-stone-800 hover:text-white"
        title={`Send Email: ${siteConfig.email}`}
      >
        <div className="flex items-center justify-center w-6 h-6 shrink-0">
          <Mail className="w-5 h-5" />
        </div>
        <span className="wr-contact-rail-label">
          Email Factory
        </span>
      </a>

    </aside>
  );
};
