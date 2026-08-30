import React, { useState, useRef, useCallback } from 'react';
import {
  MapPin,
  Globe2,
  Ship,
  ShieldCheck,
  Factory,
  Cpu,
  Layers,
  Anchor,
  Truck,
  ArrowRight,
  Sparkles,
  FileCheck,
  Clock,
  Compass,
  Boxes,
  CheckCircle2,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Move,
  Maximize2,
  X,
  Award,
  Building2,
  Box
} from 'lucide-react';
import type { LocaleConfig } from '../types';

interface ProductionMapProps {
  currentLocale?: LocaleConfig;
  onSelectFacility?: (facilityId: string) => void;
  className?: string;
}

export const ProductionMap: React.FC<ProductionMapProps> = ({
  className = ''
}) => {
  // Active Tab / Detail Selector
  const [activeTab, setActiveTab] = useState<'facility' | 'shipping' | 'compliance' | 'machinery'>('facility');
  const [showShippingLanes, setShowShippingLanes] = useState<boolean>(true);
  const [hoveredPort, setHoveredPort] = useState<string | null>(null);

  // Pan and Zoom State
  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; panX: number; panY: number }>({ x: 0, y: 0, panX: 0, panY: 0 });
  const stageContainerRef = useRef<HTMLDivElement>(null);

  // Clamp Pan within container bounds
  const clampPan = useCallback((newPan: { x: number; y: number }, currentZoom: number) => {
    if (!stageContainerRef.current) return newPan;
    const rect = stageContainerRef.current.getBoundingClientRect();
    const maxPanX = ((currentZoom - 1) * rect.width) / 2;
    const maxPanY = ((currentZoom - 1) * rect.height) / 2;

    if (currentZoom <= 1) {
      return { x: 0, y: 0 };
    }

    return {
      x: Math.max(-maxPanX, Math.min(maxPanX, newPan.x)),
      y: Math.max(-maxPanY, Math.min(maxPanY, newPan.y))
    };
  }, []);

  const handleZoomIn = () => {
    setZoom((prevZoom) => {
      const nextZoom = Math.min(3.0, Number((prevZoom + 0.35).toFixed(2)));
      setPan((prevPan) => clampPan(prevPan, nextZoom));
      return nextZoom;
    });
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => {
      const nextZoom = Math.max(1.0, Number((prevZoom - 0.35).toFixed(2)));
      setPan((prevPan) => (nextZoom <= 1.0 ? { x: 0, y: 0 } : clampPan(prevPan, nextZoom)));
      return nextZoom;
    });
  };

  const handleResetView = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    const nextPan = {
      x: dragStartRef.current.panX + deltaX,
      y: dragStartRef.current.panY + deltaY
    };

    setPan(clampPan(nextPan, zoom));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 0.2 : -0.2;
    setZoom((prevZoom) => {
      const nextZoom = Math.max(1.0, Math.min(3.0, Number((prevZoom + zoomDelta).toFixed(2))));
      setPan((prevPan) => (nextZoom <= 1.0 ? { x: 0, y: 0 } : clampPan(prevPan, nextZoom)));
      return nextZoom;
    });
  };

  return (
    <section id="vietnam-production-map" className={`space-y-8 ${className}`}>
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-6">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100 text-stone-900 text-xs font-bold border border-stone-300">
            <Compass className="w-3.5 h-3.5 text-stone-700" />
            <span>Vietnam Manufacturing Hub & Trans-Pacific Freight Logistics</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
            Direct Vietnam Fabrication & Ocean Shipping Grid
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Owner-provided information describes a <strong>20,000 m² production site in Binh Phuoc Province</strong>. Product origin, customs treatment, shipping route, transit time, and required documents are confirmed for each shipment.
          </p>
        </div>

        {/* View Selection Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 shrink-0 bg-stone-100 p-1.5 rounded-2xl border border-stone-200 shadow-xs">
          {[
            { id: 'facility', label: 'Plant Specs', icon: Factory },
            { id: 'shipping', label: 'Ocean Routes', icon: Ship },
            { id: 'machinery', label: 'CNC Lines', icon: Cpu },
            { id: 'compliance', label: 'Trade Documents', icon: ShieldCheck }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-white text-stone-900 shadow-xs border border-stone-300'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-stone-700' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Map & Intelligence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Col (7 Cols): Interactive Light-Themed Geographic SVG Stage */}
        <div className="lg:col-span-7 bg-white border border-stone-200 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between relative overflow-hidden">
          {/* Map Top Status Strip */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-600 animate-pulse" />
              <span className="text-stone-700 font-medium">
                Production Hub: <strong className="text-stone-950 font-bold">Binh Phuoc Province, Vietnam</strong>
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowShippingLanes(!showShippingLanes)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-all cursor-pointer flex items-center gap-1.5 ${
                  showShippingLanes
                    ? 'bg-stone-50 border-stone-300 text-stone-900 font-bold'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:text-stone-900'
                }`}
              >
                <Ship className="w-3.5 h-3.5 text-stone-700" />
                <span>{showShippingLanes ? 'Ocean Lanes Active' : 'Show Ocean Lanes'}</span>
              </button>

              <span className="text-[10px] font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                Scale: {Math.round(zoom * 100)}%
              </span>
            </div>
          </div>

          {/* Interactive SVG Stage */}
          <div
            ref={stageContainerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            className={`relative w-full aspect-[4/3] sm:aspect-[16/11] my-4 rounded-2xl bg-stone-50 border border-stone-200 overflow-hidden shadow-inner flex items-center justify-center select-none ${
              zoom > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
            }`}
          >
            {/* Floating Zoom Controls */}
            <div className="absolute top-3 right-3 z-30 flex flex-col gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-stone-300 shadow-md">
              <button
                onClick={handleZoomIn}
                className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-600 hover:text-white text-stone-700 transition-colors cursor-pointer"
                title="Zoom In"
                aria-label="Zoom in"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleZoomOut}
                disabled={zoom <= 1.0}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  zoom <= 1.0
                    ? 'opacity-40 text-stone-400 bg-stone-50 cursor-not-allowed'
                    : 'bg-stone-100 hover:bg-stone-600 hover:text-white text-stone-700'
                }`}
                title="Zoom Out"
                aria-label="Zoom out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetView}
                className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                title="Reset View"
                aria-label="Reset zoom and pan"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {zoom > 1 && (
              <div className="absolute top-3 left-3 z-30 bg-white/90 border border-stone-300 px-2.5 py-1 rounded-lg text-[10px] font-mono text-stone-700 flex items-center gap-1.5 shadow-xs">
                <Move className="w-3 h-3 text-stone-700" />
                <span>Drag to Pan · Wheel to Zoom</span>
              </div>
            )}

            {/* Transform Layer */}
            <div
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: 'center center',
                transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
                width: '100%',
                height: '100%'
              }}
              className="flex items-center justify-center"
            >
              <svg
                viewBox="0 0 800 600"
                className="w-full h-full object-contain filter drop-shadow-sm select-none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="vnLandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1d1d1f" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#047857" stopOpacity="0.95" />
                  </linearGradient>
                  <linearGradient id="shippingGradUS" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#059669" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.8" />
                  </linearGradient>
                </defs>

                {/* Ocean Background */}
                <rect width="800" height="600" fill="#f8fafc" />

                {/* Grid Lines */}
                <line x1="80" y1="150" x2="740" y2="150" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="80" y1="300" x2="740" y2="300" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="80" y1="450" x2="740" y2="450" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="200" y1="50" x2="200" y2="550" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="400" y1="50" x2="400" y2="550" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="600" y1="50" x2="600" y2="550" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />

                {/* Continental Southeast Asia Context */}
                <path
                  d="M 120,60 L 260,50 L 370,60 L 440,110 L 400,200 L 320,240 L 280,310 L 260,420 L 310,480 L 360,450 L 380,380 L 360,300 L 350,220 L 280,180 L 200,160 Z"
                  fill="#e2e8f0"
                  stroke="#cbd5e1"
                  strokeWidth="1.5"
                />

                {/* Vietnam Coastline Strip (S-Shape Highlight) */}
                <path
                  d="M 370,110 L 420,130 L 440,160 L 420,220 L 435,270 L 470,330 L 485,390 L 460,460 L 415,480 L 380,470 L 390,430 L 430,410 L 420,340 L 380,280 L 370,110 Z"
                  fill="url(#vnLandGrad)"
                  stroke="#047857"
                  strokeWidth="2.5"
                />

                {/* Hainan Island reference */}
                <path
                  d="M 460,180 C 475,175 490,185 488,205 C 480,220 460,225 450,210 Z"
                  fill="#cbd5e1"
                  stroke="#94a3b8"
                  strokeWidth="1"
                />

                {/* Water Body Labels */}
                <text x="540" y="320" fill="#94a3b8" fontSize="11" fontFamily="monospace" letterSpacing="3" fontWeight="bold">
                  REGIONAL OCEAN ROUTE
                </text>
                <text x="520" y="340" fill="#64748b" fontSize="9" fontFamily="sans-serif">
                  (DIRECT TRANS-PACIFIC CONTAINER ROUTE)
                </text>

                {/* Ocean Shipping Lanes */}
                {showShippingLanes && (
                  <g>
                    {/* Cat Lai to US West Coast */}
                    <path
                      d="M 418,460 Q 560,470 680,430 T 790,360"
                      fill="none"
                      stroke="url(#shippingGradUS)"
                      strokeWidth="3"
                      strokeDasharray="6 4"
                    />
                    <circle cx="640" cy="442" r="4.5" fill="#2563eb" />
                    <text x="648" y="446" fill="#1e40af" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                      US West Coast: 18-22 Days
                    </text>

                    {/* Cat Lai to US Gulf / East Coast */}
                    <path
                      d="M 418,460 Q 580,520 700,500 T 790,470"
                      fill="none"
                      stroke="#059669"
                      strokeWidth="2.5"
                      strokeDasharray="5 3"
                    />
                    <circle cx="650" cy="510" r="4.5" fill="#059669" />
                    <text x="658" y="514" fill="#065f46" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                      US East Coast & Gulf: 28-34 Days
                    </text>

                    {/* Port of Cat Lai (Ho Chi Minh City) Marker */}
                    <circle
                      cx="418"
                      cy="460"
                      r="6"
                      fill="#059669"
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredPort('Cat Lai Port, Ho Chi Minh City (45 km)')}
                      onMouseLeave={() => setHoveredPort(null)}
                    />
                    <text x="325" y="464" fill="#065f46" fontSize="10.5" fontFamily="sans-serif" fontWeight="bold">
                      Cat Lai Port
                    </text>
                  </g>
                )}

                {/* MAIN VIETNAM PLANT MARKER */}
                <g className="cursor-pointer">
                  <circle
                    cx="412"
                    cy="435"
                    r="24"
                    fill="#1d1d1f"
                    fillOpacity="0.25"
                    className="animate-ping"
                    style={{ transformOrigin: '412px 435px', animationDuration: '2.5s' }}
                  />
                  <circle
                    cx="412"
                    cy="435"
                    r="12"
                    fill="#059669"
                    fillOpacity="0.3"
                    stroke="#047857"
                    strokeWidth="2"
                  />
                  <circle
                    cx="412"
                    cy="435"
                    r="7"
                    fill="#ffffff"
                    stroke="#047857"
                    strokeWidth="4"
                  />

                  {/* Info Card Tooltip */}
                  <rect
                    x="210"
                    y="390"
                    width="190"
                    height="58"
                    rx="10"
                    fill="#ffffff"
                    stroke="#059669"
                    strokeWidth="2"
                    className="shadow-lg"
                  />
                  <text x="220" y="410" fill="#065f46" fontSize="11" fontWeight="bold" fontFamily="serif">
                    WHITEROCK VIETNAM
                  </text>
                  <text x="220" y="425" fill="#334155" fontSize="9" fontFamily="sans-serif" fontWeight="600">
                    20,000 m² Facility · Owner Reported
                  </text>
                  <text x="220" y="439" fill="#d97706" fontSize="8.5" fontFamily="monospace">
                    Binh Phuoc · Capacity by Current Quote
                  </text>
                </g>

                {/* Map Inset Legend */}
                <g transform="translate(24, 490)">
                  <rect width="210" height="74" rx="8" fill="#ffffff" stroke="#e2e8f0" opacity="0.95" />
                  <text x="12" y="16" fill="#0f172a" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                    VIETNAM EXPORT LOGISTICS
                  </text>
                  <circle cx="20" cy="32" r="4.5" fill="#059669" />
                  <text x="32" y="35" fill="#334155" fontSize="8.5" fontFamily="sans-serif">
                    20,000 m² Binh Phuoc Site
                  </text>
                  <circle cx="20" cy="48" r="4.5" fill="#2563eb" />
                  <text x="32" y="51" fill="#334155" fontSize="8.5" fontFamily="sans-serif">
                    Cat Lai Port Ocean Terminal (45 km)
                  </text>
                  <line x1="16" y1="63" x2="26" y2="63" stroke="#2563eb" strokeWidth="2" strokeDasharray="3 2" />
                  <text x="32" y="66" fill="#64748b" fontSize="8" fontFamily="sans-serif">
                    Direct Trans-Pacific Ocean Freight Line
                  </text>
                </g>
              </svg>
            </div>

            {hoveredPort && (
              <div className="absolute bottom-4 right-4 bg-white border border-stone-400 px-3 py-1.5 rounded-xl shadow-md text-xs text-stone-900 font-mono flex items-center gap-2 z-30">
                <Anchor className="w-3.5 h-3.5 text-stone-700" />
                <span>Port Gateway: {hoveredPort}</span>
              </div>
            )}
          </div>

          {/* Bottom Quick Summary */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-stone-100 text-xs">
            <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
              <span className="text-[10px] font-mono text-stone-500 block uppercase">Plant Footprint</span>
              <strong className="text-stone-900 font-serif text-sm">20,000 m²</strong>
            </div>
            <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
              <span className="text-[10px] font-mono text-stone-700 block uppercase">Customs Treatment</span>
              <strong className="text-stone-900 font-serif text-sm">Broker Review</strong>
            </div>
            <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
              <span className="text-[10px] font-mono text-stone-500 block uppercase">Port Distance</span>
              <strong className="text-stone-900 font-serif text-sm">45 km (Cat Lai)</strong>
            </div>
            <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
              <span className="text-[10px] font-mono text-stone-500 block uppercase">Transit Time</span>
              <strong className="text-stone-800 font-serif text-sm">Carrier Quote</strong>
            </div>
          </div>
        </div>

        {/* Right Col (5 Cols): Interactive Tab Detail Intelligence Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-5 bg-white border border-stone-200 rounded-3xl p-6 sm:p-7 shadow-xs">
          {/* Facility Specs View */}
          {activeTab === 'facility' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-stone-800 font-bold text-xs uppercase tracking-wider bg-stone-50 px-3 py-1 rounded-full border border-stone-200 w-fit">
                <Building2 className="w-3.5 h-3.5" />
                <span>Manufacturing Plant Profile</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-900">
                WHITEROCK COMPANY LIMITED
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Owner-provided information describes a stone manufacturing site in Binh Phuoc Province serving order-specific commercial and residential surface programs.
              </p>

              <div className="space-y-2.5 pt-2">
                {[
                  { label: 'Address', val: 'Binh Phuoc Province, Vietnam; confirm full delivery address before visiting' },
                  { label: 'Annual Output', val: 'Current capacity and allocation confirmed during quotation' },
                  { label: 'Primary Materials', val: 'Engineered Quartz, Natural Carrara/Calacatta Marble, Granite' },
                  { label: 'Target Market', val: 'North America (Hotels, Multi-Family, Kitchen & Bath Distributors)' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs">
                    <span className="text-stone-500 block font-medium mb-0.5">{item.label}:</span>
                    <strong className="text-stone-900 font-sans">{item.val}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ocean Shipping View */}
          {activeTab === 'shipping' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-stone-800 font-bold text-xs uppercase tracking-wider bg-stone-50 px-3 py-1 rounded-full border border-stone-200 w-fit">
                <Ship className="w-3.5 h-3.5" />
                <span>Ocean Freight Port Timelines</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-900">
                Direct Vessel Sailings to Major US Ports
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Containers are staged directly at Cat Lai Port & Cai Mep Deepwater Terminal for rapid customs clearance and uninterrupted trans-Pacific transit.
              </p>

              <div className="space-y-2 pt-2">
                {[
                  { port: 'US West Coast (LA / Long Beach / Oakland)', time: '18 - 22 Days', freq: 'Weekly Vessel Calls' },
                  { port: 'US East Coast & Gulf (Houston / Savannah / NY)', time: '28 - 34 Days', freq: 'Direct Panama Route' },
                  { port: 'Europe (Rotterdam / Hamburg / Felixstowe)', time: '24 - 30 Days', freq: 'Direct Suez Route' },
                  { port: 'Australia (Sydney / Melbourne / Brisbane)', time: '14 - 18 Days', freq: 'Direct Express' }
                ].map((route, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                    <div>
                      <strong className="text-stone-900 block font-sans">{route.port}</strong>
                      <span className="text-[11px] text-stone-500">{route.freq}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-900 font-mono font-bold text-xs">
                      {route.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Machinery View */}
          {activeTab === 'machinery' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-xs uppercase tracking-wider bg-stone-100 px-3 py-1 rounded-full border border-stone-300 w-fit">
                <Cpu className="w-3.5 h-3.5 text-stone-700" />
                <span>Advanced Automated Machinery</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-900">
                High-Precision CNC & Continuous Edge Lines
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Owner-supplied photos show bridge cutting, multi-spindle processing, edge processing, and production staging. Models and acceptance limits require owner and order confirmation.
              </p>

              <div className="space-y-2 pt-2 text-xs">
                {[
                  { name: 'Bridge Cutting Equipment', desc: 'Cutting method and limits follow the approved production drawings.' },
                  { name: 'Quad-Spindle CNC Machining Centers', desc: 'Automated undermount basin cutouts, faucet drillings, and curved arches.' },
                  { name: 'Continuous Edge Processing Lines', desc: 'Available edge and finish programs are confirmed by sample.' },
                  { name: 'Vanity Preparation Workstations', desc: 'Optional sink assembly follows the buyer-approved model and mounting detail.' }
                ].map((mach, i) => (
                  <div key={i} className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                    <strong className="text-stone-900 block text-xs">{mach.name}</strong>
                    <span className="text-stone-600 text-[11px] leading-relaxed">{mach.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compliance View */}
          {activeTab === 'compliance' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-xs uppercase tracking-wider bg-stone-100 px-3 py-1 rounded-full border border-stone-300 w-fit">
                <ShieldCheck className="w-3.5 h-3.5 text-stone-700" />
                <span>Order Documentation Review</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-900">
                Confirm Requirements Before Production
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Classification, origin, destination rules, tests, labels, packing, and export documents vary by product and shipment. Confirm requirements with qualified advisers and record them in the purchase order.
              </p>

              <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-stone-600 shrink-0" />
                  <span>Broker Rate Review</span>
                </div>
                <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-stone-600 shrink-0" />
                  <span>Origin Documents Reviewed</span>
                </div>
                <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-stone-600 shrink-0" />
                  <span>Packing Requirements Agreed</span>
                </div>
                <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-stone-600 shrink-0" />
                  <span>Product Documents Confirmed</span>
                </div>
              </div>
            </div>
          )}

          {/* Action CTA Bar */}
          <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row gap-3">
            <a
              href={`mailto:SALES@WHITEROCKSTONE.COM?subject=Vietnam Factory Inquiry`}
              className="flex-1 py-3 px-4 rounded-xl bg-stone-600 hover:bg-stone-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all text-center"
            >
              <span>Contact Vietnam Engineering Team</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
