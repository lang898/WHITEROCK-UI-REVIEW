import React, { useState } from 'react';
import {
  Layers,
  Box,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Package,
  Truck,
  Plus,
  Minus,
  FileText,
  DollarSign,
  Info,
  ChevronRight,
  Maximize2,
  RefreshCw,
  Compass,
  Ruler
} from 'lucide-react';
import type { VanityConfig, RfqCartItem } from '../types';

interface VanityConfiguratorProps {
  onAddToCart?: (item: RfqCartItem) => void;
  className?: string;
  isCompact?: boolean;
}

export const standardVanitySizes = [
  { key: '22x31', label: '22" x 31" Single Bowl', length: 31, width: 22, bowl: 'Single', defaultQty: 40, weightLbs: 72, containerFit: 360, desc: 'Studio & Powder Bath standard' },
  { key: '22x37', label: '22" x 37" Single Bowl', length: 37, width: 22, bowl: 'Single', defaultQty: 80, weightLbs: 85, containerFit: 310, desc: 'Most popular Multi-Family 1-Bedroom top' },
  { key: '22x43', label: '22" x 43" Single Bowl', length: 43, width: 22, bowl: 'Single', defaultQty: 40, weightLbs: 98, containerFit: 270, desc: 'Spacious guest bathroom vanity' },
  { key: '22x49', label: '22" x 49" Single Bowl', length: 49, width: 22, bowl: 'Single', defaultQty: 60, weightLbs: 112, containerFit: 240, desc: 'Master & Ensuite single-basin package' },
  { key: '22x61-single', label: '22" x 61" Single Bowl', length: 61, width: 22, bowl: 'Single', defaultQty: 20, weightLbs: 138, containerFit: 190, desc: 'Single bowl with expansive countertop prep area' },
  { key: '22x61-double', label: '22" x 61" Double Bowl', length: 61, width: 22, bowl: 'Double', defaultQty: 60, weightLbs: 145, containerFit: 180, desc: 'Standard North American 2-Bedroom Dual Bowl' },
  { key: '22x73-double', label: '22" x 73" Double Bowl', length: 73, width: 22, bowl: 'Double', defaultQty: 20, weightLbs: 172, containerFit: 150, desc: 'Executive master vanity with dual undermount basins' },
  { key: '36x96-island', label: '36" x 96" Kitchen Island', length: 96, width: 36, bowl: 'Single', defaultQty: 15, weightLbs: 290, containerFit: 85, desc: 'Hospitality & multi-family kitchen island waterfall prep' }
];

export const stoneOptions = [
  { name: 'Pure White Quartz (Arctic Snow)', material: 'Engineered Quartz', color: '#f8fafc', border: '#e2e8f0', priceIdx: '$$', baseRate: 115, tag: 'High-Volume Multi-Family Standard' },
  { name: 'Calacatta Gold Quartz (Warm Vein)', material: 'Calacatta Quartz', color: '#fbfbfa', border: '#fef3c7', priceIdx: '$$$', baseRate: 145, tag: 'Luxury Hospitality Choice' },
  { name: 'Carrara Mist Quartz (Subtle Grey)', material: 'Engineered Quartz', color: '#f1f5f9', border: '#cbd5e1', priceIdx: '$$', baseRate: 125, tag: 'Modern Contemporary Standard' },
  { name: 'Natural Carrara White Marble', material: 'Carrara White Marble', color: '#f8fafc', border: '#94a3b8', priceIdx: '$$$', baseRate: 165, tag: 'Italian Block Sourced / Vietnam Fabricated' },
  { name: 'Sintered Stone Calacatta Silk', material: 'Sintered Stone', color: '#ffffff', border: '#e5e7eb', priceIdx: '$$$$', baseRate: 175, tag: 'Zero Porosity / Stain & Heat Proof' },
  { name: 'Absolute Black Honed Granite', material: 'Pure Black Granite', color: '#1c1917', border: '#44403c', priceIdx: '$$$', baseRate: 135, tag: 'High-Traffic Commercial Classic' }
];

export const edgeProfiles = [
  { name: 'Eased 2cm / 3cm', desc: 'Flat polished with slight 1.5mm pencil radius bevel', popular: true },
  { name: '1/4" Bevel Edge', desc: 'Crisp architectural chamfer, prevents chipping', popular: false },
  { name: 'Full Bullnose', desc: 'Smooth 180° continuous curved radius', popular: false },
  { name: '1.5" Mitered Apron', desc: 'Seamless 45° laminated edge for luxury thick appearance', popular: true }
];

export const sinkOptions = [
  {
    id: 'undermount-rect',
    name: 'Optional Rectangular Ceramic Basin Assembly',
    desc: 'Final sink model, dimensions, mounting method, and documents require buyer approval',
    badge: 'Model Approval Required',
    cost: 32
  },
  {
    id: 'undermount-oval',
    name: 'Optional Oval Ceramic Basin Assembly',
    desc: 'Quoted against the exact buyer-selected sink template and mounting specification',
    badge: 'Model Approval Required',
    cost: 28
  },
  {
    id: 'cutout-only',
    name: 'Precision CNC Basin Cutout & Polished Rim (No Sink Included)',
    desc: 'Cut to client sink template with smoothed & water-honed rim, faucet hole drilled',
    badge: 'Client Sinks On-Site',
    cost: 12
  }
];

export const VanityConfigurator: React.FC<VanityConfiguratorProps> = ({
  onAddToCart,
  className = '',
  isCompact = false
}) => {
  const [selectedSize, setSelectedSize] = useState(standardVanitySizes[1]); // 22x37
  const [selectedStone, setSelectedStone] = useState(stoneOptions[0]); // Pure White Quartz
  const [selectedThickness, setSelectedThickness] = useState<'2cm (3/4")' | '3cm (1-1/4")' | '4cm Mitered'>('2cm (3/4")');
  const [selectedEdge, setSelectedEdge] = useState(edgeProfiles[0]);
  const [selectedSink, setSelectedSink] = useState(sinkOptions[0]);
  const [faucetDrill, setFaucetDrill] = useState<'Single Hole' | '4" Centerset' | '8" Widespread'>('Single Hole');
  const [includeBacksplash, setIncludeBacksplash] = useState<boolean>(true);
  const [includeSideSplash, setIncludeSideSplash] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(80);
  const [addedNotice, setAddedNotice] = useState<boolean>(false);

  // Unit pricing formula
  const baseCost = selectedStone.baseRate;
  const sizeFactor = selectedSize.length / 37;
  const thicknessFactor = selectedThickness === '3cm (1-1/4")' ? 1.25 : selectedThickness === '4cm Mitered' ? 1.45 : 1.0;
  const splashAddon = (includeBacksplash ? 12 : 0) + (includeSideSplash ? 8 : 0);
  const sinkCount = selectedSize.bowl === 'Double' ? 2 : 1;
  const sinkCost = selectedSink.cost * sinkCount;

  const estimatedUnitFobPrice = Math.round((baseCost * sizeFactor * thicknessFactor) + splashAddon + sinkCost);
  const totalFobEstimate = estimatedUnitFobPrice * quantity;
  const estimatedContainers = Math.max(1, Math.ceil(quantity / selectedSize.containerFit));

  const handleAddConfigToRfq = () => {
    if (onAddToCart) {
      const item: RfqCartItem = {
        id: `config-${Date.now()}`,
        type: 'product',
        sku: `CUSTOM-${selectedSize.key.toUpperCase()}`,
        productSku: `CUSTOM-${selectedSize.key.toUpperCase()}`,
        title: `${selectedSize.label} - ${selectedStone.name}`,
        material: selectedStone.material,
        category: 'Custom Vanity Program',
        quantity: quantity,
        specSummary: `${selectedThickness}, ${selectedEdge.name}, ${selectedSink.name}, ${faucetDrill}${includeBacksplash ? ', +4" Backsplash' : ''}${includeSideSplash ? ', +Sidesplash' : ''}`,
        notes: `Estimated FOB Vietnam: $${estimatedUnitFobPrice}/unit (Total ~$${totalFobEstimate.toLocaleString()})`
      };
      onAddToCart(item);
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 3000);
    }
  };

  return (
    <div className={`wr-card p-6 sm:p-10 space-y-8 text-[#1d1d1f] ${className}`}>
      {/* Configurator Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/[0.06] pb-6">
        <div className="space-y-1.5">
          <div className="wr-panel-eyebrow wr-panel-eyebrow--compact">
            <Layers className="w-3.5 h-3.5 text-stone-600" />
            <span className="tech-badge">INTERACTIVE ARCHITECTURAL PROGRAM GENERATOR</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f]">
            North American Standard Vanity & Countertop Builder
          </h2>
          <p className="text-xs sm:text-sm text-[#86868b] max-w-2xl">
            Configure standard 22" depth bathroom vanity tops, undermount ceramic sink integrations, edge profiles, and obtain instant FOB Vietnam price estimates and container payload math.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-stone-800 bg-stone-50 px-3.5 py-1.5 rounded-full border border-stone-200 shrink-0">
          <ShieldCheck className="w-4 h-4 text-stone-600" />
          <span>Buyer-Approved Sink Options</span>
        </div>
      </div>

      {/* Main Grid: Options + Dynamic Summary Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Interactive Options */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Dimensions */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="tech-badge text-[#86868b]">
                STEP 1: SELECT STANDARD SIZES (22" DEPTH)
              </span>
              <span className="text-xs text-[#86868b]">{selectedSize.desc}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {standardVanitySizes.map((sz) => (
                <button
                  key={sz.key}
                  onClick={() => {
                    setSelectedSize(sz);
                    setQuantity(sz.defaultQty);
                  }}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    selectedSize.key === sz.key
                      ? 'bg-[#111113] text-white border-transparent shadow-xs font-semibold'
                      : 'bg-white text-[#1d1d1f] border-black/[0.08] hover:border-black/20'
                  }`}
                >
                  <span className="text-xs font-bold block">{sz.length}" x {sz.width}"</span>
                  <span className={`text-[10px] ${selectedSize.key === sz.key ? 'text-[#a1a1a6]' : 'text-[#86868b]'}`}>
                    {sz.bowl} Bowl
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Stone Selection */}
          <div className="space-y-2.5">
            <span className="tech-badge text-[#86868b] block">
              STEP 2: SELECT STONE MATERIAL & COLOR
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {stoneOptions.map((st) => (
                <div
                  key={st.name}
                  onClick={() => setSelectedStone(st)}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    selectedStone.name === st.name
                      ? 'bg-[#111113] text-white border-transparent shadow-xs'
                      : 'bg-white text-[#1d1d1f] border-black/[0.08] hover:border-black/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-5 h-5 rounded-full border border-black/10 shrink-0 shadow-2xs"
                      style={{ backgroundColor: st.color }}
                    />
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold block">{st.name.split('(')[0]}</span>
                      <span className={`text-[10px] block ${selectedStone.name === st.name ? 'text-[#a1a1a6]' : 'text-[#86868b]'}`}>
                        {st.tag}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold shrink-0">{st.priceIdx}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step 3: Thickness & Edge Profile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="tech-badge text-[#86868b] block">
                STEP 3: THICKNESS
              </span>
              <div className="flex flex-col gap-1.5">
                {(['2cm (3/4")', '3cm (1-1/4")', '4cm Mitered'] as const).map((th) => (
                  <button
                    key={th}
                    onClick={() => setSelectedThickness(th)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-medium text-left border transition-all cursor-pointer ${
                      selectedThickness === th
                        ? 'bg-[#111113] text-white border-transparent font-semibold shadow-xs'
                        : 'bg-white text-[#6e6e73] border-black/[0.08] hover:border-black/20 hover:text-[#1d1d1f]'
                    }`}
                  >
                    {th}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="tech-badge text-[#86868b] block">
                STEP 4: EDGE DETAIL
              </span>
              <div className="flex flex-col gap-1.5">
                {edgeProfiles.map((ed) => (
                  <button
                    key={ed.name}
                    onClick={() => setSelectedEdge(ed)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-medium text-left border transition-all cursor-pointer flex items-center justify-between ${
                      selectedEdge.name === ed.name
                        ? 'bg-[#111113] text-white border-transparent font-semibold shadow-xs'
                        : 'bg-white text-[#6e6e73] border-black/[0.08] hover:border-black/20 hover:text-[#1d1d1f]'
                    }`}
                  >
                    <span>{ed.name}</span>
                    {ed.popular && (
                      <span className={`text-[9px] px-2 py-0.5 rounded-full uppercase font-mono ${
                        selectedEdge.name === ed.name ? 'bg-white/20 text-white' : 'bg-black/[0.04] text-[#86868b]'
                      }`}>
                        Popular
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 5: Sink Program */}
          <div className="space-y-2.5">
            <span className="tech-badge text-[#86868b] block">
              STEP 5: SINK CUTOUT & OPTIONAL ASSEMBLY
            </span>
            <div className="space-y-2">
              {sinkOptions.map((sk) => (
                <div
                  key={sk.id}
                  onClick={() => setSelectedSink(sk)}
                  className={`p-4 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    selectedSink.id === sk.id
                      ? 'bg-[#111113] text-white border-transparent shadow-xs'
                      : 'bg-white text-[#1d1d1f] border-black/[0.08] hover:border-black/20'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-xs font-bold">{sk.name}</strong>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono ${
                        selectedSink.id === sk.id ? 'bg-stone-400 text-black font-bold' : 'bg-stone-50 text-stone-900 border border-stone-200'
                      }`}>
                        {sk.badge}
                      </span>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${selectedSink.id === sk.id ? 'text-[#a1a1a6]' : 'text-[#86868b]'}`}>
                      {sk.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output & Takeoff Summary Card */}
        <div className="lg:col-span-5 flex flex-col justify-between wr-card wr-card--soft p-6 sm:p-8 space-y-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-black/[0.08] pb-4">
              <span className="tech-badge text-[#6e6e73]">
                PROGRAM SPECIFICATION TAKEOFF
              </span>
              <span className="text-xs font-mono text-stone-400">
                PLANNING ESTIMATE ONLY
              </span>
            </div>

            {/* Config Specs Readout */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-black/[0.08]">
                <span className="text-[#6e6e73]">Program Dimension:</span>
                <strong className="font-mono text-[#1d1d1f]">{selectedSize.label}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-black/[0.08]">
                <span className="text-[#6e6e73]">Stone Surface:</span>
                <strong className="text-[#1d1d1f]">{selectedStone.name.split('(')[0]}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-black/[0.08]">
                <span className="text-[#6e6e73]">Thickness & Edge:</span>
                <span className="text-[#1d1d1f]">{selectedThickness} • {selectedEdge.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-black/[0.08]">
                <span className="text-[#6e6e73]">Basin Integration:</span>
                <span className="text-[#1d1d1f] font-medium">{selectedSink.name.split('(')[0]}</span>
              </div>
            </div>

            {/* Dynamic Financials */}
            <div className="p-6 bg-white border border-black/[0.08] space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-[#6e6e73]">Estimated FOB Vietnam / Unit:</span>
                <span className="text-2xl font-bold font-mono text-[#1d1d1f]">
                  ${estimatedUnitFobPrice} <span className="text-xs text-[#86868b] font-normal">USD</span>
                </span>
              </div>
              <div className="flex items-baseline justify-between pt-2 border-t border-black/[0.08]">
                <span className="text-xs text-[#6e6e73]">Estimated Total ({quantity} units):</span>
                <span className="text-xl font-bold font-mono text-[#1d1d1f]">
                  ${totalFobEstimate.toLocaleString()} USD
                </span>
              </div>
            </div>

            {/* Container Packaging Matrix */}
            <div className="p-4 bg-white border border-black/[0.08] text-xs space-y-1.5 font-mono">
              <div className="flex justify-between text-[#6e6e73]">
                <span>Container Fit:</span>
                <strong className="text-[#1d1d1f]">{selectedSize.containerFit} pcs / 40HQ</strong>
              </div>
              <div className="flex justify-between text-[#6e6e73]">
                <span>Estimated Volume:</span>
                <strong className="text-[#1d1d1f]">{estimatedContainers} x 40HQ Container(s)</strong>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={handleAddConfigToRfq}
              className="wr-button wr-button--primary w-full"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Program to RFQ Basket</span>
            </button>
            {addedNotice && (
              <div className="text-center text-xs text-stone-400 font-mono animate-fade-in flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Program Added to Your RFQ Basket!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
