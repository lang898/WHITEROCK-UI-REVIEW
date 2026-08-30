import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

interface BackToTopProps {
  threshold?: number;
  className?: string;
}

export const BackToTop: React.FC<BackToTopProps> = ({
  threshold = 420,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const totalScrollHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (totalScrollHeight > 0) {
        const progress = Math.min(100, Math.max(0, (currentScrollY / totalScrollHeight) * 100));
        setScrollProgress(progress);
      }

      if (currentScrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) {
    return null;
  }

  // Radius and circumference for circular progress indicator
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div
      className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 flex items-center justify-center transition-all duration-300 ${className}`}
    >
      <button
        type="button"
        id="floating-back-to-top-btn"
        onClick={scrollToTop}
        aria-label="Scroll back to top of page"
        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-white/90 hover:bg-white text-[#1d1d1f] hover:text-black shadow-lg backdrop-blur-md border border-black/[0.08] hover:border-black/20 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black/20"
      >
        {/* Subtle SVG Progress Ring */}
        <svg
          className="absolute inset-0 w-12 h-12 -rotate-90 pointer-events-none"
          viewBox="0 0 44 44"
        >
          {/* Background track */}
          <circle
            cx="22"
            cy="22"
            r={radius}
            className="stroke-black/[0.06]"
            strokeWidth="2"
            fill="transparent"
          />
          {/* Active progress track */}
          <circle
            cx="22"
            cy="22"
            r={radius}
            className="stroke-stone-600 transition-all duration-150"
            strokeWidth="2.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Arrow Icon */}
        <ArrowUp className="w-5 h-5 transition-transform duration-300 text-[#1d1d1f] group-hover:text-stone-800" />

        {/* Floating Tooltip on Hover */}
        <div className="absolute right-full mr-3 px-2.5 py-1 rounded-full bg-[#111113]/90 text-white text-[11px] font-medium tracking-wide whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-md backdrop-blur-xs flex items-center gap-1.5">
          <span>Back to Top</span>
          <span className="text-[10px] text-stone-400 font-mono">
            {Math.round(scrollProgress)}%
          </span>
        </div>
      </button>
    </div>
  );
};
