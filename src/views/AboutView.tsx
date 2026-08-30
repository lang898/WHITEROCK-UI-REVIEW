import React from 'react';
import {
  Building2,
  ShieldCheck,
  Award,
  Globe2,
  CheckCircle2,
  Gem,
  Factory,
  Layers,
  ArrowRight,
  Sparkles,
  Compass,
  FileCheck,
  Ship,
  MapPin,
  Users,
  Calendar,
  Check
} from 'lucide-react';
import { siteConfig, company, factory, ownerImages } from '../data';
import type { LocaleConfig } from '../types';

interface AboutViewProps {
  currentLocale: LocaleConfig;
  setCurrentTab: (tab: string) => void;
  onOpenShareModal?: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  currentLocale,
  setCurrentTab,
  onOpenShareModal,
}) => {
  const facilityImage = ownerImages.find((image) => image.id === 'owner-library-11')!;
  const milestones = [
    {
      year: '2000s',
      title: 'Foundation & Craftsmanship Roots',
      desc: 'Owner-provided company information describes more than two decades of experience working with natural and engineered stone.'
    },
    {
      year: '2015',
      title: 'North American Expansion',
      desc: 'Expanded product development for common North American vanity-top dimensions, sink cutouts, backsplashes, and project schedules.'
    },
    {
      year: '2020',
      title: 'Vietnam Modern Plant Commissioning',
      desc: 'Established WHITEROCK COMPANY LIMITED (Công Ty TNHH Whiterock) in Binh Phuoc Province, Vietnam with an owner-reported 20,000 m² manufacturing site.'
    },
    {
      year: 'Present',
      title: 'Global Direct Stone Group',
      desc: 'Owner-provided information lists published annual capacity above 100,000 m². Current allocation is confirmed during quotation.'
    }
  ];

  const corePillars = [
    {
      icon: <Factory className="w-6 h-6 text-stone-600" />,
      title: '20,000 m² Vietnam Facility',
      desc: 'Independent export manufacturing plant in Binh Phuoc Province, Vietnam equipped with automated infrared bridge saws, multi-spindle edge polishers, and 5-axis CNC machining centers.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-stone-600" />,
      title: 'Order-Specific Trade Review',
      desc: 'Product origin, classification, customs treatment, and required export documents must be confirmed for each shipment with qualified advisers.'
    },
    {
      icon: <Award className="w-6 h-6 text-indigo-600" />,
      title: '20+ Years Stone Mastery',
      desc: 'Decades of profound stone fabrication expertise spanning natural marble, granite, quartz, porcelain slabs, waterjet medallions, and hand-carved architectural fireplace mantels.'
    },
    {
      icon: <Globe2 className="w-6 h-6 text-stone-600" />,
      title: 'Material Selection Support',
      desc: 'Available stone, slab selection, batch range, samples, and commercial terms are confirmed for each order.'
    }
  ];

  const capabilities = [
    'Prefabricated bathroom vanity tops with buyer-approved sink cutouts and optional assembly',
    'Custom kitchen countertops & waterfall islands with 45° mitered vein flow',
    'Luxury indoor & outdoor stone furniture (dining, coffee & hospitality tables)',
    'Intricate 5-axis CNC waterjet medallions and decorative floor borders',
    'Hand-carved architectural marble fireplace mantels and hearths',
    'Commercial cut-to-size dimensional stone, thresholds, shower curbs & window sills',
    'Free CAD/DXF shop drawing drafting and automated take-off estimation',
    'Order-specific export packing plans and identification labels'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 space-y-24 sm:space-y-28">
      
      {/* ========================================================================= */}
      {/* Hero Header */}
      {/* ========================================================================= */}
      <div className="text-center max-w-4xl mx-auto space-y-5">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-500/10 border border-stone-500/20 text-stone-900 text-xs font-bold shadow-2xs">
          <Gem className="w-3.5 h-3.5 text-stone-700" />
          <span className="tech-badge">WHITEROCK MARBLE & GRANITE • COMPANY PROFILE</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#1d1d1f] leading-tight">
          Over 20 Years of Stone Mastery.
          <br />
          <span className="bg-gradient-to-r from-stone-700 via-stone-600 to-[#1d1d1f] bg-clip-text text-transparent">
            Direct Vietnam Manufacturing Power.
          </span>
        </h1>
        
        <p className="text-base sm:text-xl text-[#6e6e73] leading-relaxed max-w-3xl mx-auto">
          Whiterock Marble & Granite (Công Ty TNHH Whiterock) manufactures natural and engineered stone products in Binh Phuoc Province, Vietnam. Product scope and commercial terms are confirmed for each project.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* Dual Facility & Global Network Hero Card */}
      {/* ========================================================================= */}
      <div className="wr-card p-6 sm:p-12 overflow-hidden relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase text-stone-700 font-bold tracking-wider">
                OUR STORY & LEGACY
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold text-[#1d1d1f] tracking-tight">
                Craftsmanship Meets Industrial Precision
              </h2>
            </div>

            <p className="text-sm sm:text-base text-[#6e6e73] leading-relaxed">
              Owner-provided company information describes more than two decades of stone-industry experience. WHITEROCK applies that experience to natural and engineered stone programs for international project buyers.
            </p>

            <p className="text-sm sm:text-base text-[#6e6e73] leading-relaxed">
              In 2020, WHITEROCK established its manufacturing presence in <strong>Binh Phuoc Province, Vietnam</strong>. Owner-provided information lists a 20,000 m² site with published annual capacity above 100,000 m².
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-black/[0.06]">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-[#1d1d1f]">20,000 <span className="text-sm font-normal text-[#86868b]">m²</span></div>
                <div className="text-xs text-[#86868b] mt-0.5">Vietnam Plant Area</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-stone-700">100,000+ <span className="text-sm font-normal text-[#86868b]">m²/yr</span></div>
                <div className="text-xs text-[#86868b] mt-0.5">Annual Output Capacity</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="rounded-2xl overflow-hidden border border-black/[0.08] shadow-md aspect-16/10 relative group">
              <picture className="block w-full h-full">
                <source srcSet={facilityImage.imageAvif} type="image/avif" />
                <source srcSet={facilityImage.imageWebp} type="image/webp" />
                <img
                  src={facilityImage.image}
                  alt={facilityImage.alt}
                  width={1448}
                  height={1086}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                <div className="text-white space-y-1">
                  <div className="text-sm font-bold flex items-center gap-2">
                    <Factory className="w-4 h-4 text-stone-400" />
                    <span>WHITEROCK VIETNAM PLANT</span>
                  </div>
                  <p className="text-xs text-white/80">
                    Quốc Lộ 14, Đội 2, Ấp 3, Xã Đồng Tiến, Huyện Đồng Phú, Tỉnh Bình Phước, Vietnam
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[#6e6e73] px-2">
              <span>Legal Name: <strong>{siteConfig.legalName}</strong></span>
              <span className="text-stone-700 font-bold">Trade terms confirmed per shipment</span>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4 Core Pillars */}
      {/* ========================================================================= */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-mono uppercase text-[#86868b] font-semibold tracking-wider">
            WHY ARCHITECTS & DEVELOPERS CHOOSE US
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] tracking-tight">
            The Whiterock Advantage
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {corePillars.map((p, i) => (
            <div key={i} className="wr-card p-6 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#f5f5f7] flex items-center justify-center">
                {p.icon}
              </div>
              <h3 className="text-lg font-bold text-[#1d1d1f]">
                {p.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#6e6e73] leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Comprehensive Capabilities Checklist */}
      {/* ========================================================================= */}
      <div className="wr-card wr-card--soft p-8 sm:p-12">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/[0.04] text-[#6e6e73] text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>FULL-SCOPE FABRICATION & TURNKEY EXPORT</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
            One Direct Manufacturing Partner for All Your Commercial Stone Requirements
          </h2>

          <p className="text-sm sm:text-base text-[#6e6e73] leading-relaxed">
            From architectural drawing review and custom finish matching to optional sink assembly, packing, and overseas shipment planning.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4">
            {capabilities.map((cap, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#1d1d1f]">
                <div className="w-4 h-4 rounded-full bg-black/[0.05] text-[#1d1d1f] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <span>{cap}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-6">
            <button
              onClick={() => setCurrentTab('products')}
              className="wr-button wr-button--primary"
            >
              <span>Explore 6 Product Lines</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setCurrentTab('contact')}
              className="wr-button wr-button--secondary"
            >
              Request Factory Direct Quote
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Company Timeline */}
      {/* ========================================================================= */}
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="text-center space-y-2">
          <div className="text-xs font-mono uppercase text-[#86868b] font-semibold tracking-wider">
            20+ YEARS JOURNEY
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] tracking-tight">
            Key Milestones in Our Growth
          </h2>
        </div>

        <div className="relative border-l-2 border-stone-200/80 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-10">
          {milestones.map((m, idx) => (
            <div key={idx} className="relative group">
              {/* Dot */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-stone-600 shadow-xs"></div>
              
              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-900 text-xs font-bold font-mono">
                  {m.year}
                </span>
                <h3 className="text-lg font-bold text-[#1d1d1f]">
                  {m.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#6e6e73] leading-relaxed">
                  {m.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Official Factory Contact & Location Card */}
      {/* ========================================================================= */}
      <div className="wr-card p-6 sm:p-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          <div className="space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold text-[#1d1d1f]">
              <MapPin className="w-4 h-4 text-stone-600" />
              <span>VIETNAM FACTORY ADDRESS</span>
            </div>
            <p className="text-xs text-[#6e6e73] leading-relaxed">
              {siteConfig.address}
              <br />
              <span className="text-[#86868b]">Postcode: {siteConfig.zip} • Port: {siteConfig.port}</span>
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold text-[#1d1d1f]">
              <Ship className="w-4 h-4 text-stone-600" />
              <span>DIRECT EXPORT DESK</span>
            </div>
            <p className="text-xs text-[#6e6e73] leading-relaxed">
              Email: <strong>{siteConfig.email}</strong>
              <br />
              Tel: <strong>{siteConfig.tel}</strong> (WhatsApp / Calls)
            </p>
          </div>

          <div className="space-y-2 flex flex-col justify-center items-center md:items-start">
            <div className="text-xs font-bold text-[#1d1d1f]">
              INSTANT FACTORY INQUIRY
            </div>
            <p className="text-xs text-[#6e6e73] mb-2">
              Direct communication in English and Vietnamese.
            </p>
            <button
              onClick={() => setCurrentTab('contact')}
              className="px-5 py-2 rounded-full bg-[#111113] hover:bg-black text-white text-xs font-semibold cursor-pointer shadow-sm transition-all"
            >
              Contact Sales Team
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
