import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Download,
  ExternalLink,
  Sparkles,
  QrCode,
  Layers,
  MessageCircle,
  FileText
} from 'lucide-react';
import {
  WhatsAppIcon,
  LinkedInIcon,
  InstagramIcon,
  PinterestIcon,
  XIcon,
  FacebookIcon
} from './SocialIcons';
import { siteConfig } from '../data';

export interface ShareContent {
  title: string;
  text?: string;
  url?: string;
  image?: string;
  material?: string;
  specs?: string;
  type?: 'color' | 'product' | 'config' | 'project' | 'page' | 'site';
}

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: ShareContent | null;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  content,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedSpec, setCopiedSpec] = useState(false);

  if (!isOpen || !content) return null;

  const currentUrl = content.url || (typeof window !== 'undefined' ? window.location.href : siteConfig.productionDomain);
  const shareTitle = content.title || siteConfig.brand;
  const shareText = content.text || `${shareTitle} - Direct Vietnam factory stone surfaces. Specifications and availability require written confirmation.`;

  // WhatsApp share payload
  const whatsappText = encodeURIComponent(
    `*${shareTitle}*\n${content.material ? `Material: ${content.material}\n` : ''}${content.specs ? `Specs: ${content.specs}\n` : ''}\nDirect Vietnam Factory Specification:\n${currentUrl}\n\nWHITEROCK COMPANY LIMITED`
  );
  const whatsappUrl = `https://api.whatsapp.com/send?text=${whatsappText}`;

  // LinkedIn share URL
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;

  // Pinterest pin URL
  const pinterestMedia = content.image ? encodeURIComponent(content.image) : '';
  const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(currentUrl)}&media=${pinterestMedia}&description=${encodeURIComponent(shareTitle)}`;

  // X (Twitter) URL
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`;

  // Facebook URL
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleCopyFullSpec = () => {
    const fullSpec = `========================================
WHITEROCK COMPANY LIMITED PROJECT NOTE
========================================
Item: ${shareTitle}
${content.material ? `Material: ${content.material}\n` : ''}${content.specs ? `Specification: ${content.specs}\n` : ''}
Factory: Binh Phuoc Province, Vietnam
Acceptance Criteria: Confirm in approved drawings, samples, and the written quotation
Website Link: ${currentUrl}
Direct Inquiries: ${siteConfig.email} | WhatsApp: ${siteConfig.whatsapp}
========================================`;
    navigator.clipboard.writeText(fullSpec);
    setCopiedSpec(true);
    setTimeout(() => setCopiedSpec(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: currentUrl,
        });
      } catch (err) {
        // User cancelled or share failed silently
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="wr-modal-backdrop">
      <div
        className="relative bg-white rounded-[2rem] w-full max-w-lg shadow-2xl text-[#1d1d1f] overflow-hidden border border-black/[0.08] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-black/[0.06] flex items-center justify-between bg-[#fbfbfd]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#111113] text-white flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#1d1d1f]">
                Share Specification & Stone Design
              </h3>
              <p className="text-[11px] text-[#86868b]">
                Multi-channel export & project collaboration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="wr-modal-close"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Preview Box */}
        <div className="p-6 space-y-6">
          <div className="p-3.5 rounded-2xl bg-[#f5f5f7] border border-black/[0.06] flex items-center gap-3.5">
            {content.image ? (
              <img
                src={content.image}
                alt={shareTitle}
                width={112}
                height={112}
                loading="lazy"
                className="w-14 h-14 rounded-xl object-cover border border-black/[0.08] shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-white border border-black/[0.08] flex items-center justify-center shrink-0">
                <Layers className="w-6 h-6 text-stone-700" />
              </div>
            )}
            <div className="overflow-hidden flex-1 space-y-0.5">
              <span className="text-[10px] uppercase font-mono font-bold text-stone-800 bg-stone-50 px-2 py-0.5 rounded-full border border-stone-200 inline-block">
                {content.material || 'STONE SPECIFICATION'}
              </span>
              <h4 className="font-bold text-sm text-[#1d1d1f] truncate">
                {shareTitle}
              </h4>
              <p className="text-[11px] text-[#86868b] truncate">
                {content.specs || 'Specifications and availability require written confirmation'}
              </p>
            </div>
          </div>

          {/* Social Platform Grid */}
          <div className="space-y-3">
            <span className="tech-badge text-[#86868b] block">
              SELECT SOCIAL OR PROCUREMENT CHANNEL
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {/* WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-[#1d1d1f]/5 hover:bg-[#1d1d1f]/15 border border-[#1d1d1f]/20 text-[#1d1d1f] transition-all group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center mb-1.5 shadow-2xs transition-transform">
                  <WhatsAppIcon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-[#1d1d1f]">WhatsApp</span>
                <span className="text-[9px] text-[#86868b]">Direct Message</span>
              </a>

              {/* LinkedIn */}
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-[#1d1d1f]/5 hover:bg-[#1d1d1f]/15 border border-[#1d1d1f]/20 text-[#1d1d1f] transition-all group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center mb-1.5 shadow-2xs transition-transform">
                  <LinkedInIcon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-[#1d1d1f]">LinkedIn</span>
                <span className="text-[9px] text-[#86868b]">B2B Post</span>
              </a>

              {/* Pinterest */}
              <a
                href={pinterestUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-[#1d1d1f]/5 hover:bg-[#1d1d1f]/15 border border-[#1d1d1f]/20 text-[#1d1d1f] transition-all group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center mb-1.5 shadow-2xs transition-transform">
                  <PinterestIcon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-[#1d1d1f]">Pinterest</span>
                <span className="text-[9px] text-[#86868b]">Save Pin</span>
              </a>

              {/* X / Twitter */}
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-black/[0.03] hover:bg-black/[0.08] border border-black/[0.08] text-[#1d1d1f] transition-all group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-[#111113] text-white flex items-center justify-center mb-1.5 shadow-2xs transition-transform">
                  <XIcon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#1d1d1f]">X / Post</span>
                <span className="text-[9px] text-[#86868b]">Tweet Link</span>
              </a>

              {/* Facebook */}
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-[#1d1d1f]/5 hover:bg-[#1d1d1f]/15 border border-[#1d1d1f]/20 text-[#1d1d1f] transition-all group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center mb-1.5 shadow-2xs transition-transform">
                  <FacebookIcon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-[#1d1d1f]">Facebook</span>
                <span className="text-[9px] text-[#86868b]">Feed Share</span>
              </a>

              {/* Copy Direct Link */}
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-[#f5f5f7] hover:bg-[#ebebee] border border-black/[0.08] text-[#1d1d1f] transition-all group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-white text-[#1d1d1f] border border-black/[0.1] flex items-center justify-center mb-1.5 shadow-2xs transition-transform">
                  {copied ? <Check className="w-4 h-4 text-stone-600" /> : <Copy className="w-4 h-4" />}
                </div>
                <span className="text-xs font-bold text-[#1d1d1f]">
                  {copied ? 'Copied!' : 'Copy Link'}
                </span>
                <span className="text-[9px] text-[#86868b]">Clipboard URL</span>
              </button>

              {/* Copy Full Text Specification */}
              <button
                type="button"
                onClick={handleCopyFullSpec}
                className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-[#f5f5f7] hover:bg-[#ebebee] border border-black/[0.08] text-[#1d1d1f] transition-all group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-white text-stone-700 border border-black/[0.1] flex items-center justify-center mb-1.5 shadow-2xs transition-transform">
                  {copiedSpec ? <Check className="w-4 h-4 text-stone-600" /> : <FileText className="w-4 h-4" />}
                </div>
                <span className="text-xs font-bold text-[#1d1d1f]">
                  {copiedSpec ? 'Spec Copied!' : 'Copy Spec'}
                </span>
                <span className="text-[9px] text-[#86868b]">For RFQ Email</span>
              </button>
            </div>
          </div>

          {/* Quick Share Link Bar */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-[#1d1d1f]">Direct Link:</span>
            <div className="flex items-center gap-2 p-2 rounded-2xl bg-[#f5f5f7] border border-black/[0.06]">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="flex-1 bg-transparent px-2 text-xs font-mono text-[#1d1d1f] focus:outline-none select-all"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-4 py-2 rounded-xl bg-[#111113] hover:bg-black text-white text-xs font-medium cursor-pointer transition-all flex items-center gap-1.5 shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-stone-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-black/[0.06] bg-[#fbfbfd] flex items-center justify-between text-xs">
          <span className="text-[11px] text-[#86868b]">
            WHITEROCK COMPANY LIMITED • Project details require confirmation
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-black/[0.06] hover:bg-black/[0.1] text-[#1d1d1f] text-xs font-semibold cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
