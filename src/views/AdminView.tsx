import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Inbox,
  Package,
  Palette,
  Briefcase,
  FileText,
  Settings,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  Building,
  MapPin,
  Globe2,
  FileSpreadsheet,
  RefreshCw,
  X,
  Printer,
  ChevronRight,
  Sparkles,
  Mail,
  Phone,
  MessageSquare,
  ShieldCheck,
  ExternalLink,
  Save,
  Check,
  Layers
} from 'lucide-react';
import {
  products as defaultProducts,
  colors as defaultColors,
  projects as defaultProjects,
  news as defaultNews,
  siteConfig as defaultSiteConfig
} from '../data';
import type {
  WebsiteInquiry,
  SiteCmsSettings,
  ProductItem,
  ColorItem,
  LocaleConfig
} from '../types';

interface AdminViewProps {
  currentLocale: LocaleConfig;
  setCurrentTab: (tab: string) => void;
}

// Initial Mock Inquiries for Website Form Submissions
const initialInquiries: WebsiteInquiry[] = [
  {
    id: 'inq-101',
    inquiryNumber: 'INQ-2026-889',
    type: 'RFQ Quote',
    clientName: 'Marcus Vance',
    companyName: 'Apex Multi-Family Development Group',
    email: 'm.vance@apexdev.com',
    phone: '+1 (214) 555-0192',
    countryState: 'Dallas, Texas (USA)',
    projectType: '320-Unit Apartment Renovation',
    itemsRequested: [
      '240 pcs - 22" x 37" Calacatta Quartz Vanity Tops with buyer-approved sinks',
      '80 pcs - 22" x 61" Double Bowl Vanity Tops with 4" Backsplash',
      '320 pcs - 4" End-splashes (Left & Right Universal)'
    ],
    message: 'We require a Vietnam port quotation and container load review. Please list available origin and export documents for our customs broker.',
    submittedAt: '2026-08-22 14:32',
    status: 'New',
    priority: 'High',
    internalNotes: 'Sent drawing to engineering team for CAD takeoff review. Ready for quotation.',
    estimatedUnits: 320
  },
  {
    id: 'inq-102',
    inquiryNumber: 'INQ-2026-890',
    type: 'Sample Kit',
    clientName: 'Elena Rostova',
    companyName: 'Coastal Hospitality FF&E Procurements',
    email: 'elena@coastalff-e.com',
    phone: '+1 (305) 555-0814',
    countryState: 'Miami Beach, Florida (USA)',
    projectType: 'Hyatt Regency Suite Upgrade',
    itemsRequested: [
      '102 × 102 mm (4" × 4") physical swatch: Calacatta Gold (WR-Q801)',
      '102 × 102 mm (4" × 4") physical swatch: Pure White (WR-Q101)',
      '102 × 102 mm (4" × 4") physical swatch: Nero Marquina Natural Marble'
    ],
    message: 'Please air courier a physical sample box to our Miami design studio for developer board approval next Wednesday.',
    submittedAt: '2026-08-21 09:15',
    status: 'Sample Shipped',
    priority: 'High',
    internalNotes: 'Draft inquiry record only. Add a real tracking number and dispatch location after shipment.',
    estimatedUnits: 3
  },
  {
    id: 'inq-103',
    inquiryNumber: 'INQ-2026-891',
    type: 'Trade Program',
    clientName: 'David Sterling',
    companyName: 'Pacific Rim Stone & Tile Wholesale',
    email: 'd.sterling@pacificrimstone.com',
    phone: '+1 (206) 555-4921',
    countryState: 'Seattle, Washington (USA)',
    projectType: 'Regional Distributor Warehouse Stocking',
    itemsRequested: [
      '3 x 40HQ Containers Mixed Vanity Tops (31", 37", 49", 61")',
      'Private label inner cartons with distributor UPC barcodes'
    ],
    message: 'Applying for distributor tier pricing. We distribute across Washington, Oregon, and Idaho. Need full container load pricing list.',
    submittedAt: '2026-08-20 18:40',
    status: 'Contacted',
    priority: 'Medium',
    internalNotes: 'Emailed Trade Partner wholesale catalog and container loading sheets.',
    estimatedUnits: 650
  },
  {
    id: 'inq-104',
    inquiryNumber: 'INQ-2026-892',
    type: 'Contact Form',
    clientName: 'Brian Miller',
    companyName: 'Miller Architectural Design',
    email: 'bmiller@millerarch.com',
    phone: '+1 (415) 555-8833',
    countryState: 'San Francisco, California (USA)',
    projectType: 'Commercial Office Tower Waterfall Reception',
    itemsRequested: ['Mitered 6cm Waterfall Apron custom countertop in Carrara Quartz'],
    message: 'Can your Vietnam plant fabricate seamless mitered waterfall legs and book-matched veining for a 12ft executive reception counter?',
    submittedAt: '2026-08-19 11:20',
    status: 'Quoted',
    priority: 'Standard',
    internalNotes: 'Quoted $4,850 FOB Cat Lai including steel-reinforced export crate.',
    estimatedUnits: 1
  }
];

export const AdminView: React.FC<AdminViewProps> = ({
  currentLocale,
  setCurrentTab
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'inquiries' | 'products' | 'colors' | 'projects' | 'news' | 'settings'
  >('inquiries');

  // Inquiries State
  const [inquiries, setInquiries] = useState<WebsiteInquiry[]>(() => {
    try {
      const saved = localStorage.getItem('whiterock_cms_inquiries');
      return saved ? JSON.parse(saved) : initialInquiries;
    } catch {
      return initialInquiries;
    }
  });

  // Products State
  const [productsList, setProductsList] = useState<ProductItem[]>(() => {
    try {
      const saved = localStorage.getItem('whiterock_cms_products');
      return saved ? JSON.parse(saved) : defaultProducts;
    } catch {
      return defaultProducts;
    }
  });

  // Colors State
  const [colorsList, setColorsList] = useState<ColorItem[]>(() => {
    try {
      const saved = localStorage.getItem('whiterock_cms_colors');
      return saved ? JSON.parse(saved) : defaultColors;
    } catch {
      return defaultColors;
    }
  });

  // Site Settings State
  const [siteSettings, setSiteSettings] = useState<SiteCmsSettings>(() => {
    try {
      const saved = localStorage.getItem('whiterock_cms_site_config');
      return saved
        ? JSON.parse(saved)
        : {
            brandName: 'WHITEROCK COMPANY LIMITED',
            tagline: 'Direct Countertop & Vanity Top Factory',
            companyEmail: defaultSiteConfig.email || 'llang@whiterockstone.com',
            directPhone: defaultSiteConfig.tel || '+84 0798 858 220',
            whatsApp: defaultSiteConfig.whatsapp || '+84 798 858 220',
            vietnamAddress: defaultSiteConfig.address,
            tariffNotice: 'Customs treatment requires buyer broker confirmation',
            exportCapacity: '100,000+ m² Annual Cut-to-Size Capacity',
            enableSampleKitCta: true,
            enableTariffCalculator: true
          };
    } catch {
      return {
        brandName: 'WHITEROCK COMPANY LIMITED',
        tagline: 'Direct Countertop & Vanity Top Factory',
        companyEmail: 'llang@whiterockstone.com',
        directPhone: '+84 0798 858 220',
        whatsApp: '+84 798 858 220',
        vietnamAddress: defaultSiteConfig.address,
        tariffNotice: 'Customs treatment requires buyer broker confirmation',
        exportCapacity: '100,000+ m² Annual Cut-to-Size Capacity',
        enableSampleKitCta: true,
        enableTariffCalculator: true
      };
    }
  });

  // UI Filter & Modal States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedInquiry, setSelectedInquiry] = useState<WebsiteInquiry | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit / Add Product Modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [newProductForm, setNewProductForm] = useState<Partial<ProductItem>>({
    title: '',
    sku: '',
    category: 'Bathroom Vanity',
    material: 'Engineered Quartz',
    image: 'assets/products/vanity-top-calacatta-warm.jpg',
    description: '',
    specs: {
      Size: '22" x 37" / 49" / 61"',
      Sink: 'Buyer-approved undermount model',
      Edge: 'Eased Flat Edge with 1/8" Bevel',
      MOQ: '20 pcs / SKU',
      LeadTime: '25–35 Days'
    }
  });

  // Edit / Add Color Modal
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [editingColor, setEditingColor] = useState<ColorItem | null>(null);
  const [newColorForm, setNewColorForm] = useState<Partial<ColorItem>>({
    name: '',
    slug: '',
    material: 'Quartz',
    colorFamily: 'White',
    finishes: ['Polished', 'Honed'],
    thicknesses: ['2cm (3/4")', '3cm (1-1/4")'],
    sizes: ['126" x 63"', '138" x 79"'],
    swatchImage: 'assets/colors/calacatta-gold-vein.jpg',
    imageType: 'photo',
    description: 'Crisp white base with subtle grey veins.'
  });

  // Save changes to LocalStorage
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdateInquiryStatus = (
    id: string,
    newStatus: WebsiteInquiry['status'],
    notes?: string
  ) => {
    const updated = inquiries.map((inq) =>
      inq.id === id
        ? {
            ...inq,
            status: newStatus,
            internalNotes: notes !== undefined ? notes : inq.internalNotes
          }
        : inq
    );
    setInquiries(updated);
    localStorage.setItem('whiterock_cms_inquiries', JSON.stringify(updated));
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry({
        ...selectedInquiry,
        status: newStatus,
        internalNotes: notes !== undefined ? notes : selectedInquiry.internalNotes
      });
    }
    triggerToast(`Inquiry ${id} status updated to "${newStatus}"`);
  };

  const handleDeleteInquiry = (id: string) => {
    if (confirm('Are you sure you want to delete this inquiry record?')) {
      const updated = inquiries.filter((inq) => inq.id !== id);
      setInquiries(updated);
      localStorage.setItem('whiterock_cms_inquiries', JSON.stringify(updated));
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
      triggerToast('Inquiry record deleted.');
    }
  };

  const handleSaveSiteSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('whiterock_cms_site_config', JSON.stringify(siteSettings));
    triggerToast('Site configuration updated & saved successfully!');
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.title || !newProductForm.sku) {
      alert('Product title and SKU are required.');
      return;
    }

    if (editingProduct) {
      const updated = productsList.map((p) =>
        p.sku === editingProduct.sku ? ({ ...p, ...newProductForm } as ProductItem) : p
      );
      setProductsList(updated);
      localStorage.setItem('whiterock_cms_products', JSON.stringify(updated));
      triggerToast(`Product "${newProductForm.sku}" updated successfully.`);
    } else {
      const newProd = {
        ...newProductForm,
        image: newProductForm.image || 'assets/products/vanity-top-calacatta-warm.jpg',
        specs: newProductForm.specs || {
          Size: '22" x 37"',
          MOQ: '20 pcs',
          LeadTime: '30 Days'
        }
      } as ProductItem;
      const updated = [newProd, ...productsList];
      setProductsList(updated);
      localStorage.setItem('whiterock_cms_products', JSON.stringify(updated));
      triggerToast(`New product "${newProd.sku}" added to catalog.`);
    }
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (sku: string) => {
    if (confirm(`Delete product SKU ${sku}?`)) {
      const updated = productsList.filter((p) => p.sku !== sku);
      setProductsList(updated);
      localStorage.setItem('whiterock_cms_products', JSON.stringify(updated));
      triggerToast(`Product SKU ${sku} deleted.`);
    }
  };

  const handleSaveColor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColorForm.name || !newColorForm.slug) {
      alert('Color name and slug are required.');
      return;
    }

    if (editingColor) {
      const updated = colorsList.map((c) =>
        c.slug === editingColor.slug ? ({ ...c, ...newColorForm } as ColorItem) : c
      );
      setColorsList(updated);
      localStorage.setItem('whiterock_cms_colors', JSON.stringify(updated));
      triggerToast(`Color swatch "${newColorForm.name}" updated.`);
    } else {
      const newCol = {
        ...newColorForm,
        swatchImage: newColorForm.swatchImage || 'assets/colors/calacatta-gold-vein.jpg',
        finishes: newColorForm.finishes || ['Polished', 'Honed'],
        thicknesses: newColorForm.thicknesses || ['2cm', '3cm'],
        sizes: newColorForm.sizes || ['126" x 63"']
      } as ColorItem;
      const updated = [newCol, ...colorsList];
      setColorsList(updated);
      localStorage.setItem('whiterock_cms_colors', JSON.stringify(updated));
      triggerToast(`New color "${newCol.name}" added to swatch library.`);
    }
    setIsColorModalOpen(false);
    setEditingColor(null);
  };

  const handleDeleteColor = (slug: string) => {
    if (confirm(`Delete stone color swatch "${slug}"?`)) {
      const updated = colorsList.filter((c) => c.slug !== slug);
      setColorsList(updated);
      localStorage.setItem('whiterock_cms_colors', JSON.stringify(updated));
      triggerToast(`Color swatch "${slug}" deleted.`);
    }
  };

  const exportInquiriesCsv = () => {
    const headers = [
      'Inquiry Number',
      'Date',
      'Type',
      'Client Name',
      'Company',
      'Email',
      'Phone',
      'Location',
      'Project Scope',
      'Status',
      'Priority',
      'Notes'
    ];
    const rows = inquiries.map((i) => [
      i.inquiryNumber,
      i.submittedAt,
      i.type,
      `"${i.clientName}"`,
      `"${i.companyName}"`,
      i.email,
      `"${i.phone}"`,
      `"${i.countryState}"`,
      `"${(i.itemsRequested || []).join('; ') || i.projectType}"`,
      i.status,
      i.priority,
      `"${i.internalNotes || ''}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `whiterock_website_inquiries_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('Inquiries exported to CSV successfully.');
  };

  // Filtered Inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.inquiryNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.countryState.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || inq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-stone-700 flex items-center gap-3 text-xs animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-stone-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Banner */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 text-stone-900 text-xs font-bold border border-stone-300">
            <LayoutDashboard className="w-3.5 h-3.5 text-stone-700" />
            <span>WHITEROCK Website CMS & Admin Portal (网站后台管理系统)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Website Content & Inquiries Management
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            Manage customer inquiries, RFQ submissions, product catalogs, stone swatches, and global contact settings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => setCurrentTab('home')}
            className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer border border-stone-200"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Website</span>
          </button>

          <button
            onClick={exportInquiriesCsv}
            className="px-4 py-2 rounded-xl bg-stone-600 hover:bg-stone-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Inquiries (CSV)</span>
          </button>
        </div>
      </div>

      {/* Metric Quick Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] text-stone-500 font-medium">Total Inquiries</span>
          <div className="text-xl font-bold text-stone-900 mt-1">{inquiries.length}</div>
          <span className="text-[10px] text-stone-600 font-medium">
            {inquiries.filter((i) => i.status === 'New').length} New Leads
          </span>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] text-stone-500 font-medium">RFQ Quotes</span>
          <div className="text-xl font-bold text-stone-900 mt-1">
            {inquiries.filter((i) => i.type === 'RFQ Quote').length}
          </div>
          <span className="text-[10px] text-stone-700 font-medium">Multi-Family / Hotel</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] text-stone-500 font-medium">Sample Requests</span>
          <div className="text-xl font-bold text-stone-900 mt-1">
            {inquiries.filter((i) => i.type === 'Sample Kit').length}
          </div>
          <span className="text-[10px] text-stone-600 font-medium">102 × 102 mm (4" × 4") chip swatches</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] text-stone-500 font-medium">Active Products</span>
          <div className="text-xl font-bold text-stone-900 mt-1">{productsList.length}</div>
          <span className="text-[10px] text-stone-500 font-medium">Vanities & Counters</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] text-stone-500 font-medium">Stone Swatches</span>
          <div className="text-xl font-bold text-stone-900 mt-1">{colorsList.length}</div>
          <span className="text-[10px] text-stone-500 font-medium">Quartz / Marble</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] text-stone-500 font-medium">Plant Status</span>
          <div className="text-sm font-bold text-stone-700 mt-1.5 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-stone-500 animate-pulse"></span>
            <span>Online</span>
          </div>
          <span className="text-[10px] text-stone-500 font-medium">Binh Phuoc, Vietnam</span>
        </div>
      </div>

      {/* Main CMS Tabbed Navigation */}
      <div className="bg-stone-100 p-1.5 rounded-2xl flex flex-wrap gap-1 border border-stone-200">
        <button
          onClick={() => setActiveSubTab('inquiries')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'inquiries'
              ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
          }`}
        >
          <Inbox className="w-4 h-4 text-stone-700" />
          <span>Inquiries & RFQ Leads</span>
          {inquiries.filter((i) => i.status === 'New').length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-stone-600 text-white font-mono text-[10px]">
              {inquiries.filter((i) => i.status === 'New').length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('products')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'products'
              ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
          }`}
        >
          <Package className="w-4 h-4 text-stone-700" />
          <span>Products Catalog ({productsList.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('colors')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'colors'
              ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
          }`}
        >
          <Palette className="w-4 h-4 text-stone-700" />
          <span>Stone Colors & Swatches ({colorsList.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('projects')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'projects'
              ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
          }`}
        >
          <Briefcase className="w-4 h-4 text-stone-700" />
          <span>Project Cases ({defaultProjects.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('news')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'news'
              ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
          }`}
        >
          <FileText className="w-4 h-4 text-stone-700" />
          <span>Articles & Guides ({defaultNews.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('settings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'settings'
              ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
          }`}
        >
          <Settings className="w-4 h-4 text-stone-700" />
          <span>Site Settings & Contact</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. INQUIRIES & LEADS TAB */}
      {/* ========================================================================= */}
      {activeSubTab === 'inquiries' && (
        <div className="space-y-6">
          {/* Controls & Search */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search inquiries by client, company, email, or RFQ#..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 font-medium">Status Filter:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-700 focus:outline-none focus:border-stone-500"
              >
                <option value="All">All Statuses ({inquiries.length})</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Quoted">Quoted</option>
                <option value="Sample Shipped">Sample Shipped</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Inquiries Table */}
          <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase tracking-wider font-mono text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4 font-bold">Inquiry #</th>
                    <th className="py-3.5 px-4 font-bold">Client / Company</th>
                    <th className="py-3.5 px-4 font-bold">Type & Project</th>
                    <th className="py-3.5 px-4 font-bold">Location</th>
                    <th className="py-3.5 px-4 font-bold">Submitted Date</th>
                    <th className="py-3.5 px-4 font-bold">Status</th>
                    <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {filteredInquiries.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-stone-500">
                        No customer inquiries match your search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredInquiries.map((inq) => (
                      <tr key={inq.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                          {inq.inquiryNumber}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-stone-900">{inq.clientName}</div>
                          <div className="text-stone-500 text-[11px]">{inq.companyName}</div>
                          <div className="text-stone-800 text-[10px] font-mono">{inq.email}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2 py-0.5 rounded-md bg-stone-50 text-stone-900 border border-stone-200 font-bold text-[10px] mb-1">
                            {inq.type}
                          </span>
                          <div className="text-stone-600 line-clamp-1 max-w-[200px]">
                            {inq.projectType}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-stone-600 font-medium">
                          {inq.countryState}
                        </td>
                        <td className="py-3.5 px-4 text-stone-500 font-mono text-[11px]">
                          {inq.submittedAt}
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={inq.status}
                            onChange={(e) =>
                              handleUpdateInquiryStatus(
                                inq.id,
                                e.target.value as WebsiteInquiry['status']
                              )
                            }
                            className={`px-2 py-1 rounded-lg text-[11px] font-bold border focus:outline-none cursor-pointer ${
                              inq.status === 'New'
                                ? 'bg-stone-100 text-stone-900 border-stone-300'
                                : inq.status === 'Sample Shipped'
                                ? 'bg-stone-100 text-stone-900 border-stone-300'
                                : inq.status === 'Quoted'
                                ? 'bg-stone-100 text-stone-900 border-stone-300'
                                : inq.status === 'Contacted'
                                ? 'bg-stone-100 text-stone-900 border-stone-300'
                                : 'bg-stone-100 text-stone-700 border-stone-300'
                            }`}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Quoted">Quoted</option>
                            <option value="Sample Shipped">Sample Shipped</option>
                            <option value="Archived">Archived</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-1.5">
                          <button
                            onClick={() => setSelectedInquiry(inq)}
                            className="p-1.5 text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                            title="View Full Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <a
                            href={`mailto:${inq.email}?subject=Re: WHITEROCK Quotation ${inq.inquiryNumber} - ${inq.projectType}`}
                            className="p-1.5 text-stone-600 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors inline-block"
                            title="Reply via Email"
                          >
                            <Send className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleDeleteInquiry(inq.id)}
                            className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                            title="Delete Inquiry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. PRODUCTS CATALOG CMS TAB */}
      {/* ========================================================================= */}
      {activeSubTab === 'products' && (
        <div className="space-y-6">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold font-serif text-stone-900">
                Products Catalog Manager ({productsList.length})
              </h2>
              <p className="text-xs text-stone-600 mt-1">
                Add, edit, or remove prefabricated vanity tops, kitchen countertops, and furniture items displayed on the public website.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingProduct(null);
                setNewProductForm({
                  title: '',
                  sku: `WR-V${Math.floor(100 + Math.random() * 900)}`,
                  category: 'Bathroom Vanity',
                  material: 'Engineered Quartz',
                  image: 'assets/products/vanity-top-calacatta-warm.jpg',
                  description: 'Prefabricated bathroom vanity top with optional buyer-approved undermount sink assembly.',
                  specs: {
                    Size: '22" x 37" / 49" / 61"',
                    Sink: 'Buyer-approved undermount model',
                    Edge: 'Eased Edge with Micro-Bevel',
                    MOQ: '20 pcs / SKU',
                    LeadTime: '25–35 Days'
                  }
                });
                setIsProductModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-stone-600 hover:bg-stone-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productsList.map((prod) => (
              <div
                key={prod.sku}
                className="bg-white border border-stone-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-stone-300 transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-stone-50 text-stone-900 font-mono text-[10px] font-bold rounded-md border border-stone-200">
                      {prod.sku}
                    </span>
                    <span className="text-[11px] text-stone-500 font-medium">
                      {prod.category}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-stone-900 text-base group-hover:text-stone-900 transition-colors">
                    {prod.title}
                  </h3>

                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {prod.description}
                  </p>

                  <div className="bg-stone-50 rounded-xl p-3 text-[11px] space-y-1 text-stone-600">
                    <div>
                      <span className="font-semibold text-stone-700">Sizes:</span>{' '}
                      {prod.specs.Size || prod.specs.Sizes || 'Standard Custom'}
                    </div>
                    <div>
                      <span className="font-semibold text-stone-700">Material:</span>{' '}
                      {prod.material}
                    </div>
                    <div>
                      <span className="font-semibold text-stone-700">MOQ:</span>{' '}
                      {prod.specs.MOQ || '20 pcs'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                  <button
                    onClick={() => {
                      setEditingProduct(prod);
                      setNewProductForm(prod);
                      setIsProductModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(prod.sku)}
                    className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. STONE COLORS CMS TAB */}
      {/* ========================================================================= */}
      {activeSubTab === 'colors' && (
        <div className="space-y-6">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold font-serif text-stone-900">
                Stone Colors & Swatches Library ({colorsList.length})
              </h2>
              <p className="text-xs text-stone-600 mt-1">
                Manage the full catalog of quartz, marble, and granite colors available for 102 × 102 mm (4" × 4") physical sample dispatch and container orders.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingColor(null);
                setNewColorForm({
                  name: '',
                  slug: `color-${Date.now()}`,
                  material: 'Quartz',
                  colorFamily: 'White',
                  finishes: ['Polished', 'Honed'],
                  thicknesses: ['2cm (3/4")', '3cm (1-1/4")'],
                  sizes: ['126" x 63"'],
                  swatchImage: 'assets/colors/calacatta-gold-vein.jpg',
                  imageType: 'photo',
                  description: 'High-definition quartz veining on durable resin base.'
                });
                setIsColorModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-stone-600 hover:bg-stone-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Color Swatch</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {colorsList.map((col) => (
              <div
                key={col.slug}
                className="bg-white border border-stone-200 rounded-2xl p-3.5 shadow-xs space-y-2.5 flex flex-col justify-between hover:border-stone-300 transition-all group"
              >
                <div className="space-y-2">
                  <div className="aspect-square bg-stone-100 rounded-xl overflow-hidden border border-stone-200/80 flex items-center justify-center relative group">
                    <img
                      src={col.swatchImage}
                      alt={col.name}
                      width={480}
                      height={480}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-stone-900/80 text-white text-[9px] font-mono">
                      {col.material}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-stone-900 text-xs truncate" title={col.name}>
                      {col.name}
                    </h4>
                    <p className="text-[10px] text-stone-500 font-mono">{col.colorFamily} Family</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-stone-100">
                  <button
                    onClick={() => {
                      setEditingColor(col);
                      setNewColorForm(col);
                      setIsColorModalOpen(true);
                    }}
                    className="text-[11px] text-stone-800 font-semibold hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteColor(col.slug)}
                    className="text-stone-400 hover:text-red-700 cursor-pointer p-0.5"
                    title="Delete Swatch"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. PROJECTS SHOWCASE CMS TAB */}
      {/* ========================================================================= */}
      {activeSubTab === 'projects' && (
        <div className="space-y-6">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs">
            <h2 className="text-xl font-bold font-serif text-stone-900">
              Factory Capability References
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              Owner-supplied factory references. Do not present these records as named customer projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {defaultProjects.map((proj, idx) => (
              <div
                key={idx}
                className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-50 text-stone-800 border border-stone-200 font-bold">
                    {proj.location}
                  </span>
                  <h3 className="font-serif font-bold text-lg text-stone-900">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {proj.summary}
                  </p>
                  <div className="p-3 bg-stone-50 rounded-xl text-xs space-y-1.5 text-stone-700">
                    <div>
                      <strong>Scope:</strong> {proj.scope}
                    </div>
                    <div>
                      <strong>Volume:</strong> {proj.quantity}
                    </div>
                    <div>
                      <strong>Material:</strong> {proj.material}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-stone-700 font-bold bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-200 inline-block">
                    Capability Reference
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. ARTICLES & TECHNICAL GUIDES CMS TAB */}
      {/* ========================================================================= */}
      {activeSubTab === 'news' && (
        <div className="space-y-6">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs">
            <h2 className="text-xl font-bold font-serif text-stone-900">
              Technical Procurement Articles & News CMS
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              Published technical guides, CAD takeoff recommendations, and stone quality audit documentation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {defaultNews.map((article, idx) => (
              <div
                key={idx}
                className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-50 text-stone-900 border border-stone-200 font-bold">
                      {article.category}
                    </span>
                    <span className="text-[11px] text-stone-400 font-mono">{article.date}</span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-stone-900">
                    {article.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-700 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Published
                  </span>
                  <span className="text-xs text-stone-400 font-mono">Slug: {article.slug}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. SITE SETTINGS & GLOBAL CONTACT CMS TAB */}
      {/* ========================================================================= */}
      {activeSubTab === 'settings' && (
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
          <div>
            <h2 className="text-2xl font-serif font-bold text-stone-900">
              Global Website Settings & Contact Information
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Changes made here update the live header micro-bar, inquiry emails, factory address, and customs-review notices across the website.
            </p>
          </div>

          <form onSubmit={handleSaveSiteSettings} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Brand Display Name</label>
                <input
                  type="text"
                  value={siteSettings.brandName}
                  onChange={(e) =>
                    setSiteSettings({ ...siteSettings, brandName: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Brand Tagline</label>
                <input
                  type="text"
                  value={siteSettings.tagline}
                  onChange={(e) =>
                    setSiteSettings({ ...siteSettings, tagline: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Sales Inquiries Email</label>
                <input
                  type="email"
                  value={siteSettings.companyEmail}
                  onChange={(e) =>
                    setSiteSettings({ ...siteSettings, companyEmail: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Direct Telephone / Office</label>
                <input
                  type="text"
                  value={siteSettings.directPhone}
                  onChange={(e) =>
                    setSiteSettings({ ...siteSettings, directPhone: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">WhatsApp Commercial Line</label>
                <input
                  type="text"
                  value={siteSettings.whatsApp}
                  onChange={(e) =>
                    setSiteSettings({ ...siteSettings, whatsApp: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-500 font-mono"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-stone-700">
                  Vietnam Manufacturing Facility Address
                </label>
                <input
                  type="text"
                  value={siteSettings.vietnamAddress}
                  onChange={(e) =>
                    setSiteSettings({ ...siteSettings, vietnamAddress: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">
                  Customs & Import Review Notice
                </label>
                <input
                  type="text"
                  value={siteSettings.tariffNotice}
                  onChange={(e) =>
                    setSiteSettings({ ...siteSettings, tariffNotice: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Export Capacity Text</label>
                <input
                  type="text"
                  value={siteSettings.exportCapacity}
                  onChange={(e) =>
                    setSiteSettings({ ...siteSettings, exportCapacity: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-500"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-stone-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  if (confirm('Reset all site settings to default factory values?')) {
                    localStorage.removeItem('whiterock_cms_site_config');
                    setSiteSettings({
                      brandName: 'WHITEROCK COMPANY LIMITED',
                      tagline: 'Direct Countertop & Vanity Top Factory',
                      companyEmail: defaultSiteConfig.email,
                      directPhone: defaultSiteConfig.tel,
                      whatsApp: defaultSiteConfig.whatsapp,
                      vietnamAddress: defaultSiteConfig.address,
                      tariffNotice: 'Customs treatment requires buyer broker confirmation',
                      exportCapacity: '100,000+ m² Annual Cut-to-Size Capacity',
                      enableSampleKitCta: true,
                      enableTariffCalculator: true
                    });
                    triggerToast('Settings reset to defaults.');
                  }
                }}
                className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-100 text-xs font-semibold transition-colors cursor-pointer"
              >
                Reset to Defaults
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-stone-600 hover:bg-stone-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Save Site Settings</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* INQUIRY DETAIL MODAL */}
      {/* ========================================================================= */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-900 font-mono text-xs font-bold border border-stone-300">
                  {selectedInquiry.inquiryNumber}
                </span>
                <h3 className="text-xl font-bold font-serif text-stone-900 mt-2">
                  {selectedInquiry.clientName}
                </h3>
                <p className="text-xs text-stone-500">{selectedInquiry.companyName}</p>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-2 rounded-xl text-stone-400 hover:bg-stone-100 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <div>
                <span className="text-stone-400 block">Email:</span>
                <a
                  href={`mailto:${selectedInquiry.email}`}
                  className="text-stone-800 font-mono font-bold hover:underline"
                >
                  {selectedInquiry.email}
                </a>
              </div>
              <div>
                <span className="text-stone-400 block">Phone:</span>
                <span className="font-mono text-stone-900 font-bold">
                  {selectedInquiry.phone}
                </span>
              </div>
              <div>
                <span className="text-stone-400 block">Location:</span>
                <span className="text-stone-900 font-medium">
                  {selectedInquiry.countryState}
                </span>
              </div>
              <div>
                <span className="text-stone-400 block">Submission Date:</span>
                <span className="font-mono text-stone-700">{selectedInquiry.submittedAt}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 font-mono">
                Project Scope & Requested Items
              </h4>
              <div className="p-4 bg-stone-50/60 rounded-2xl border border-stone-200/80 text-xs space-y-2 text-stone-800">
                <div className="font-bold text-stone-950">
                  Project: {selectedInquiry.projectType}
                </div>
                {selectedInquiry.itemsRequested && selectedInquiry.itemsRequested.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 text-stone-700 pl-1">
                    {selectedInquiry.itemsRequested.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
                {selectedInquiry.message && (
                  <p className="pt-2 border-t border-stone-200/60 text-stone-700 italic">
                    "{selectedInquiry.message}"
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700">Internal Admin Follow-up Notes</label>
              <textarea
                rows={3}
                defaultValue={selectedInquiry.internalNotes || ''}
                onBlur={(e) =>
                  handleUpdateInquiryStatus(
                    selectedInquiry.id,
                    selectedInquiry.status,
                    e.target.value
                  )
                }
                placeholder="Enter quotation pricing, container calculations, or dispatch notes..."
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-500"
              ></textarea>
            </div>

            <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500 font-medium">Status:</span>
                <select
                  value={selectedInquiry.status}
                  onChange={(e) =>
                    handleUpdateInquiryStatus(
                      selectedInquiry.id,
                      e.target.value as WebsiteInquiry['status']
                    )
                  }
                  className="px-3 py-1.5 bg-stone-100 border border-stone-300 rounded-xl text-xs font-bold text-stone-800 focus:outline-none"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Quoted">Quoted</option>
                  <option value="Sample Shipped">Sample Shipped</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedInquiry.email}?subject=WHITEROCK Direct Quotation ${selectedInquiry.inquiryNumber}&body=Dear ${selectedInquiry.clientName},%0D%0A%0D%0AThank you for reaching out to WHITEROCK SURFACES VIETNAM regarding ${selectedInquiry.projectType}...`}
                  className="px-4 py-2 bg-stone-600 hover:bg-stone-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Email Reply</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PRODUCT EDIT / ADD MODAL */}
      {/* ========================================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold font-serif text-stone-900">
                  {editingProduct ? `Edit Product: ${editingProduct.sku}` : 'Add New Product to Catalog'}
                </h3>
                <p className="text-xs text-stone-500">
                  Update dimensions, edge options, MOQ, and material description.
                </p>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 rounded-xl text-stone-400 hover:bg-stone-100 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={newProductForm.title || ''}
                    onChange={(e) => setNewProductForm({ ...newProductForm, title: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Product SKU *</label>
                  <input
                    type="text"
                    required
                    value={newProductForm.sku || ''}
                    onChange={(e) => setNewProductForm({ ...newProductForm, sku: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Category</label>
                  <select
                    value={newProductForm.category || 'Bathroom Vanity'}
                    onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="Bathroom Vanity">Bathroom Vanity</option>
                    <option value="Kitchen Countertop">Kitchen Countertop</option>
                    <option value="Commercial Hospitality">Commercial Hospitality</option>
                    <option value="Stone Furniture">Stone Furniture</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Primary Material</label>
                  <input
                    type="text"
                    value={newProductForm.material || 'Engineered Quartz'}
                    onChange={(e) => setNewProductForm({ ...newProductForm, material: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Description</label>
                <textarea
                  rows={3}
                  value={newProductForm.description || ''}
                  onChange={(e) =>
                    setNewProductForm({ ...newProductForm, description: e.target.value })
                  }
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Standard Sizes</label>
                  <input
                    type="text"
                    value={newProductForm.specs?.Size || ''}
                    onChange={(e) =>
                      setNewProductForm({
                        ...newProductForm,
                        specs: { ...newProductForm.specs, Size: e.target.value }
                      })
                    }
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">MOQ</label>
                  <input
                    type="text"
                    value={newProductForm.specs?.MOQ || '20 pcs'}
                    onChange={(e) =>
                      setNewProductForm({
                        ...newProductForm,
                        specs: { ...newProductForm.specs, MOQ: e.target.value }
                      })
                    }
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-600 hover:bg-stone-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* COLOR EDIT / ADD MODAL */}
      {/* ========================================================================= */}
      {isColorModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold font-serif text-stone-900">
                  {editingColor ? `Edit Color: ${editingColor.name}` : 'Add Stone Color Swatch'}
                </h3>
                <p className="text-xs text-stone-500">
                  Configure color name, family, material type, and image link.
                </p>
              </div>
              <button
                onClick={() => setIsColorModalOpen(false)}
                className="p-2 rounded-xl text-stone-400 hover:bg-stone-100 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveColor} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-stone-700">Color Name *</label>
                <input
                  type="text"
                  required
                  value={newColorForm.name || ''}
                  onChange={(e) =>
                    setNewColorForm({
                      ...newColorForm,
                      name: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/\s+/g, '-')
                    })
                  }
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Material Type</label>
                  <select
                    value={newColorForm.material || 'Quartz'}
                    onChange={(e) =>
                      setNewColorForm({
                        ...newColorForm,
                        material: e.target.value as ColorItem['material']
                      })
                    }
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="Quartz">Quartz (Engineered)</option>
                    <option value="Marble">Marble (Natural)</option>
                    <option value="Granite">Granite (Natural)</option>
                    <option value="Engineered Marble">Engineered Marble</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Color Family</label>
                  <select
                    value={newColorForm.colorFamily || 'White'}
                    onChange={(e) =>
                      setNewColorForm({
                        ...newColorForm,
                        colorFamily: e.target.value as ColorItem['colorFamily']
                      })
                    }
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="White">White</option>
                    <option value="Grey">Grey</option>
                    <option value="Black">Black</option>
                    <option value="Beige">Beige</option>
                    <option value="Green">Green</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Description</label>
                <textarea
                  rows={2}
                  value={newColorForm.description || ''}
                  onChange={(e) =>
                    setNewColorForm({ ...newColorForm, description: e.target.value })
                  }
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsColorModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-600 hover:bg-stone-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Save Swatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
