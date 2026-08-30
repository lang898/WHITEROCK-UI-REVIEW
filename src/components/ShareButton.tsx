import React from 'react';
import { Share2 } from 'lucide-react';
import type { ShareContent } from './SocialShareModal';

interface ShareButtonProps {
  content: ShareContent;
  onShare: (content: ShareContent) => void;
  className?: string;
  variant?: 'icon' | 'pill' | 'button';
  label?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  content,
  onShare,
  className = '',
  variant = 'icon',
  label = 'Share',
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare(content);
  };

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/[0.04] hover:bg-black/[0.08] text-[#1d1d1f] text-xs font-medium transition-all cursor-pointer border border-black/[0.06] hover:border-black/20 ${className}`}
        title={`Share ${content.title} via WhatsApp, LinkedIn, or Pinterest`}
      >
        <Share2 className="w-3.5 h-3.5 text-[#86868b]" />
        <span>{label}</span>
      </button>
    );
  }

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-[#fbfbfd] text-[#1d1d1f] text-xs font-medium border border-black/[0.08] hover:border-black/20 shadow-2xs transition-all cursor-pointer ${className}`}
        title={`Share ${content.title} to Social Media`}
      >
        <Share2 className="w-3.5 h-3.5 text-[#86868b]" />
        <span>{label}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`p-2.5 rounded-full bg-black/[0.04] hover:bg-black/[0.08] text-[#1d1d1f] transition-all cursor-pointer flex items-center justify-center border border-black/[0.04] ${className}`}
      title={`Share ${content.title} to WhatsApp, LinkedIn, or Pinterest`}
      aria-label={`Share ${content.title}`}
    >
      <Share2 className="w-4 h-4 text-[#6e6e73] hover:text-[#1d1d1f]" />
    </button>
  );
};
