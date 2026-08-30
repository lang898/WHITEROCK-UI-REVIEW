import React from 'react';
import {
  Handshake,
  CheckCircle2,
  Package,
  Clock,
  Layers,
  Sparkles,
  ShieldCheck,
  Send,
  Building,
  FileSpreadsheet,
  ArrowRight,
  Boxes,
  Compass,
  FileCheck
} from 'lucide-react';
import { partners, siteConfig } from '../data';
import type { LocaleConfig } from '../types';

interface PartnersViewProps {
  setCurrentTab: (tab: string) => void;
  currentLocale: LocaleConfig;
}

export const PartnersView: React.FC<PartnersViewProps> = ({
  setCurrentTab,
  currentLocale,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 space-y-24 sm:space-y-28">
      {/* Header Banner (Unified Apple Display + Keynote Style) */}
      <div className="space-y-4 max-w-4xl">
        <div className="wr-panel-eyebrow">
          <Handshake className="w-3.5 h-3.5 text-stone-600" />
          <span className="tech-badge">B2B DISTRIBUTOR & BUILDER PARTNERSHIPS • DIRECT FACTORY</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-[-0.035em] text-[#1d1d1f]">
          Trade Partner Program & Direct Supply.
        </h1>
        <p className="text-base sm:text-xl text-[#6e6e73] leading-relaxed max-w-3xl font-normal">
          {partners.intro}
        </p>

        {/* Industrial Highlights */}
        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
          <span className="wr-info-pill">
            <CheckCircle2 className="w-3.5 h-3.5 text-stone-600 shrink-0" />
            <span className="tech-badge">Direct Container Loading (Cat Lai Port)</span>
          </span>
          <span className="wr-info-pill">
            <ShieldCheck className="w-3.5 h-3.5 text-stone-600 shrink-0" />
            <span className="tech-badge">Order-Specific Trade Document Review</span>
          </span>
        </div>
      </div>

      {/* Program Core Parameters Matrix (Apple Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="wr-card p-6 sm:p-8 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="tech-badge text-stone-800 bg-stone-50 px-2.5 py-1 rounded-full border border-stone-200">
              PROGRAM 01
            </span>
            <h3 className="font-bold text-lg text-[#1d1d1f]">Flexible MOQs</h3>
            <p className="text-xs text-[#86868b] leading-relaxed">
              Standard vanity tops start at <strong className="text-[#1d1d1f]">10–20 pcs</strong> per SKU. Mixed-SKU container loading supported for distributor warehouse consolidation.
            </p>
          </div>
          <div className="pt-3 border-t border-black/[0.06] text-xs font-mono text-[#86868b]">
            40HQ CONTAINER OPTIMIZED
          </div>
        </div>

        <div className="wr-card p-6 sm:p-8 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="tech-badge text-stone-800 bg-stone-50 px-2.5 py-1 rounded-full border border-stone-200">
              PROGRAM 02
            </span>
            <h3 className="font-bold text-lg text-[#1d1d1f]">Lead Times</h3>
            <p className="text-xs text-[#86868b] leading-relaxed">
              Sample chips dispatch within <strong className="text-[#1d1d1f]">7–15 days</strong>. Production orders complete in <strong className="text-[#1d1d1f]">25–55 days</strong> based on CAD drawing sign-off.
            </p>
          </div>
          <div className="pt-3 border-t border-black/[0.06] text-xs font-mono text-[#86868b]">
            RAPID AIR COURIER SAMPLES
          </div>
        </div>

        <div className="wr-card p-6 sm:p-8 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="tech-badge text-stone-800 bg-stone-50 px-2.5 py-1 rounded-full border border-stone-200">
              PROGRAM 03
            </span>
            <h3 className="font-bold text-lg text-[#1d1d1f]">OEM / Private Label</h3>
            <p className="text-xs text-[#86868b] leading-relaxed">
              Custom inner carton branding, UPC/EAN barcode labeling, branded instruction sheets, and custom corner guard configurations.
            </p>
          </div>
          <div className="pt-3 border-t border-black/[0.06] text-xs font-mono text-[#86868b]">
            CUSTOM BRANDED PACKAGING
          </div>
        </div>

        <div className="wr-card p-6 sm:p-8 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="tech-badge text-stone-800 bg-stone-50 px-2.5 py-1 rounded-full border border-stone-200">
              PROGRAM 04
            </span>
            <h3 className="font-bold text-lg text-[#1d1d1f]">Export Crate Standards</h3>
            <p className="text-xs text-[#86868b] leading-relaxed">
              Order-specific plywood crate plans can include foam buffers, banding, and moisture protection according to product and destination requirements.
            </p>
          </div>
          <div className="pt-3 border-t border-black/[0.06] text-xs font-mono text-[#86868b]">
            ISPM-15 COMPLIANT
          </div>
        </div>
      </div>

      {/* Target Partner Profiles */}
      <section className="wr-card p-6 sm:p-10 space-y-8">
        <div className="max-w-2xl space-y-2">
          <div className="tech-badge text-[#86868b]">WHO WE SERVE</div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#1d1d1f]">
            Customized Solutions by Industry Sector
          </h2>
          <p className="text-xs sm:text-sm text-[#86868b]">
            Tailored commercial terms and fabrication schedules for distributors, builders, and hospitality procurement teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-[#fbfbfd] border border-black/[0.06] rounded-3xl p-6 sm:p-8 space-y-4">
            <h4 className="font-bold text-base text-[#1d1d1f]">Regional Stone Distributors</h4>
            <ul className="text-xs text-[#6e6e73] space-y-3">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-stone-600 shrink-0" />
                <span>Repeat container program tiered pricing</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-stone-600 shrink-0" />
                <span>Showroom sample tower & box sets</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-stone-600 shrink-0" />
                <span>Exclusive regional color protections</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#fbfbfd] border border-black/[0.06] rounded-3xl p-6 sm:p-8 space-y-4">
            <h4 className="font-bold text-base text-[#1d1d1f]">Multi-Family Builders</h4>
            <ul className="text-xs text-[#6e6e73] space-y-3">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-stone-600 shrink-0" />
                <span>Unit-by-unit BOQ cut-to-size kits</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-stone-600 shrink-0" />
                <span>Buyer-approved sink and cutout options</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-stone-600 shrink-0" />
                <span>Direct job site container deliveries</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#fbfbfd] border border-black/[0.06] rounded-3xl p-6 sm:p-8 space-y-4">
            <h4 className="font-bold text-base text-[#1d1d1f]">Hospitality FF&E Groups</h4>
            <ul className="text-xs text-[#6e6e73] space-y-3">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-stone-600 shrink-0" />
                <span>Mockup suite sample room packages</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-stone-600 shrink-0" />
                <span>Complex laminated mitered waterfalls</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-stone-600 shrink-0" />
                <span>Product-specific test documents when currently available</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Action Banner */}
      <div className="wr-card wr-card--soft p-10 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-xl">
          <div className="tech-badge text-[#6e6e73]">DIRECT FACTORY ONBOARDING</div>
          <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#1d1d1f]">
            Ready to Onboard as an Official Trade Partner?
          </h3>
          <p className="text-xs sm:text-sm text-[#6e6e73] leading-relaxed">
            Receive wholesale FOB price lists, 40HQ container load maps, physical sample towers, and dedicated engineering support.
          </p>
        </div>

        <button
          onClick={() => setCurrentTab('contact')}
          className="wr-button wr-button--primary shrink-0"
        >
          Apply for Trade Partnership
        </button>
      </div>
    </div>
  );
};
