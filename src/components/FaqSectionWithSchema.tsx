import React, { useState, useEffect, useMemo } from 'react';
import {
  HelpCircle,
  ChevronDown,
  Search,
  Check,
  Copy,
  Code2,
  FileCheck,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Filter
} from 'lucide-react';
import { faqList, faqIntro } from '../data';
import type { FaqItem, LocaleConfig } from '../types';

interface FaqSectionWithSchemaProps {
  currentLocale?: LocaleConfig;
  title?: string;
  subtitle?: string;
  categoryFilter?: string;
  showSchemaInspector?: boolean;
  className?: string;
}

export const FaqSectionWithSchema: React.FC<FaqSectionWithSchemaProps> = ({
  currentLocale,
  title = 'Frequently Asked Questions & B2B Stone Guide',
  subtitle = 'Practical procurement guidance for specifications, samples, documentation, and container planning. Final terms require written confirmation.',
  categoryFilter,
  showSchemaInspector = true,
  className = ''
}) => {
  const [activeCategory, setActiveCategory] = useState<string>(categoryFilter || 'All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [showRawJsonLd, setShowRawJsonLd] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    faqList.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return ['All', ...Array.from(set)];
  }, []);

  // Filtered FAQ items based on search and category
  const filteredFaqs = useMemo(() => {
    return faqList.filter((item) => {
      const q = item.question || item.q || '';
      const a = item.answer || item.a || '';
      const cat = item.category || '';

      const matchesCat =
        activeCategory === 'All' ||
        cat.toLowerCase() === activeCategory.toLowerCase();

      const matchesSearch =
        q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCat && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Construct valid Schema.org FAQPage JSON-LD object
  const faqSchemaData = useMemo(() => {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'name': 'WHITEROCK Surfaces Vietnam B2B Stone Manufacturing FAQ',
      'description': faqIntro,
      'mainEntity': faqList.map((item) => ({
        '@type': 'Question',
        'name': item.question || item.q,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': item.answer || item.a
        }
      }))
    };
  }, []);

  const schemaString = useMemo(() => {
    return JSON.stringify(faqSchemaData, null, 2);
  }, [faqSchemaData]);

  // Ensure JSON-LD is injected in document.head for search crawlers
  useEffect(() => {
    const scriptId = 'whiterock-stone-faq-jsonld';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.text = schemaString;

    return () => {
      // Keep script tag in head for crawlers
    };
  }, [schemaString]);

  const handleCopyJsonLd = () => {
    navigator.clipboard.writeText(schemaString);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className={`space-y-8 ${className}`}>
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3 max-w-3xl">
          <div className="wr-panel-eyebrow wr-panel-eyebrow--compact">
            <HelpCircle className="w-3.5 h-3.5 text-stone-600" />
            <span className="tech-badge">TECHNICAL & PROCUREMENT KNOWLEDGE BASE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-[#1d1d1f]">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-[#6e6e73] leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Schema.org Badge */}
        {showSchemaInspector && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowRawJsonLd(!showRawJsonLd)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/[0.03] hover:bg-black/[0.06] text-[#1d1d1f] text-xs font-semibold transition-colors cursor-pointer border border-black/[0.06]"
            >
              <Code2 className="w-3.5 h-3.5 text-stone-700" />
              <span>{showRawJsonLd ? 'Hide Schema.org JSON-LD' : 'View Schema.org JSON-LD'}</span>
            </button>
          </div>
        )}
      </div>

      {/* JSON-LD Schema Drawer */}
      {showRawJsonLd && (
        <div className="wr-card wr-card--soft p-6 sm:p-8 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-black/[0.08] pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-stone-400" />
              <span className="text-xs font-mono font-bold text-[#6e6e73]">
                SEO Microdata: Schema.org / FAQPage (Auto-Injected in &lt;head&gt;)
              </span>
            </div>
            <button
              onClick={handleCopyJsonLd}
              className="wr-button wr-button--secondary text-xs font-mono"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-stone-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Copied to Clipboard' : 'Copy JSON-LD'}</span>
            </button>
          </div>

          <pre className="text-[11px] font-mono text-stone-300 max-h-64 overflow-y-auto p-4 rounded-xl bg-black/60 border border-white/10 whitespace-pre-wrap leading-relaxed">
            {schemaString}
          </pre>
        </div>
      )}

      {/* Search & Category Filter Bar */}
      <div className="wr-card p-4 sm:p-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#86868b] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search keywords (e.g. samples, lead time, sinks)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#f5f5f7] border border-black/[0.06] rounded-full text-xs text-[#1d1d1f] focus:outline-none focus:border-black/30 focus:bg-white"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#111113] text-white shadow-xs font-semibold'
                  : 'bg-black/[0.03] text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/[0.06]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="wr-card p-12 text-center space-y-2">
            <HelpCircle className="w-8 h-8 text-[#86868b] mx-auto opacity-40" />
            <p className="text-xs text-[#86868b]">No FAQ entries match your current search query.</p>
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            const question = faq.question || faq.q || '';
            const answer = faq.answer || faq.a || '';

            return (
              <div
                key={idx}
                className={`wr-card overflow-hidden transition-all duration-300 ${
                  isOpen ? 'border-black/20 shadow-md' : 'hover:border-black/15'
                }`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {faq.category && (
                      <span className="tech-badge text-stone-800 bg-stone-50 px-2.5 py-0.5 rounded-full border border-stone-200 shrink-0">
                        {faq.category}
                      </span>
                    )}
                    <h3 className="font-bold text-sm sm:text-base text-[#1d1d1f]">
                      {question}
                    </h3>
                  </div>
                  <div className={`p-1 rounded-full text-[#86868b] transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#1d1d1f]' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-[#6e6e73] leading-relaxed border-t border-black/[0.04] bg-[#fbfbfd] space-y-3 animate-fade-in">
                    <p>{answer}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
