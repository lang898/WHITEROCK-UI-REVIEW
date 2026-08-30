export interface LocaleConfig {
  id: string;
  htmlLang: string;
  hreflang: string;
  outputDir: string;
  urlPath: string;
  domain: string;
  label: string;
  switchLabel: string;
  brand: string;
  brandMark: string;
  tagline: string;
  legalName: string;
  contactId: string;
  default?: boolean;
}

export interface ProductSpec {
  SKU?: string;
  Use?: string;
  Size?: string;
  Colors?: string;
  Sink?: string;
  Edge?: string;
  MOQ?: string;
  LeadTime?: string;
  Packaging?: string;
  Backsplash?: string;
  Thickness?: string;
  Finish?: string;
  SlabSize?: string;
  Sizes?: string;
  Material?: string;
  Stone?: string;
  Base?: string;
  Surface?: string;
  Input?: string;
  Scope?: string;
  QC?: string;
  Shipping?: string;
  Contents?: string;
  Cost?: string;
}

export interface ProductItem {
  title: string;
  sku: string;
  category: string;
  material: string;
  image: string;
  description: string;
  specs: ProductSpec;
  imageWebp?: string;
  imageWidth?: number;
  imageHeight?: number;
  isIllustrative?: boolean;
  caption?: string;
  imageType?: string;
  techSheetPdf?: string;
  dimensions?: string;
  thicknesses?: string[];
  edges?: string[];
  sinkCompatibility?: string;
  moq?: string;
  leadTime?: string;
  packaging?: string;
}

export interface ColorItem {
  slug: string;
  name: string;
  material: 'Marble' | 'Granite' | 'Quartz' | 'Quartzite' | 'Travertine' | 'Engineered Marble';
  colorFamily: 'White' | 'Grey' | 'Black' | 'Beige' | 'Green';
  finishes: string[];
  thicknesses: string[];
  sizes: string[];
  swatchImage: string;
  imageType: string;
  description: string;
  techSheetPdf?: string;
  relatedProducts?: string[];
  caption?: string;
  image?: string;
  pattern?: string;
  primaryTone?: string;
  applications?: string[];
  recommendedUses?: string[];
  suitability?: string[];
  maintenanceLevel?: 'Low' | 'Moderate' | 'Elevated';
}

export interface StoneTypeInfo {
  id: 'marble' | 'granite' | 'quartz' | 'quartzite' | 'travertine' | 'engineered-marble';
  name: ColorItem['material'];
  eyebrow: string;
  headline: string;
  summary: string;
  image: string;
  imageAlt: string;
  imageCaption: string;
  hardness: string;
  absorption: string;
  maintenance: string;
  applications: string[];
  caveat: string;
}

export interface FinishItem {
  slug: string;
  name: string;
  description: string;
  image: string;
  imageType: string;
  recommendedFor: string[];
}

export interface EdgeItem {
  slug: string;
  name: string;
  description: string;
  image: string;
  imageType: string;
}

export interface ApplicationItem {
  title: string;
  category: string;
  description: string;
  image: string;
  imageType: string;
  caption: string;
  imageAlt: string;
  featuredColor: string;
  featuredColorSlug: string;
}

export interface EquipmentItem {
  name: string;
  function?: string;
  purpose?: string;
  brand?: string;
  quantity?: string;
  keySpec?: string;
  accuracy?: string;
  category?: string;
  drawing?: string;
  media?: string;
  localFile?: string;
  location?: string;
  imageType?: string;
  alt?: string;
  caption?: string;
}

export interface FactoryGalleryItem {
  id?: string;
  title: string;
  titleEn?: string;
  titleZh?: string;
  category?: string;
  facility?: string;
  image: string;
  localFile?: string;
  imageWebp?: string;
  imageAvif?: string;
  alt: string;
  imageType?: string;
  caption?: string;
  equipment?: string;
  specs?: string;
  description?: string;
}

export interface FurnitureTopVisual {
  id: string;
  title: string;
  form: string;
  image: string;
  imageWebp?: string;
  imageAvif?: string;
  alt: string;
  caption: string;
}

export interface ResourceItem {
  title: string;
  category: string;
  description: string;
  file: string;
}

export interface NewsItem {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  body: string;
  image: string;
  imageAlt: string;
  imageType: string;
  caption: string;
}

export interface FaqItem {
  q: string;
  a: string;
  question?: string;
  answer?: string;
  category?: string;
}

export interface RfqCartItem {
  id: string;
  title: string;
  type: 'product' | 'color' | 'sample';
  sku?: string;
  productSku?: string;
  material?: string;
  category?: string;
  selectedColor?: string;
  selectedFinish?: string;
  selectedEdge?: string;
  selectedThickness?: string;
  quantity: number;
  notes?: string;
  specSummary?: string;
}

export type CompareEntry =
  | { id: string; kind: 'product'; item: ProductItem }
  | { id: string; kind: 'color'; item: ColorItem };

export interface WebsiteInquiry {
  id: string;
  inquiryNumber: string;
  type: 'RFQ Quote' | 'Sample Kit' | 'Trade Program' | 'Contact Form' | 'Custom Takeoff';
  clientName: string;
  companyName: string;
  email: string;
  phone: string;
  countryState: string;
  projectType: string;
  itemsRequested?: string[];
  message: string;
  submittedAt: string;
  status: 'New' | 'Contacted' | 'Quoted' | 'Sample Shipped' | 'Archived';
  priority: 'High' | 'Medium' | 'Standard';
  internalNotes?: string;
  estimatedUnits?: number;
}

export interface SiteCmsSettings {
  brandName: string;
  tagline: string;
  companyEmail: string;
  directPhone: string;
  whatsApp: string;
  vietnamAddress: string;
  tariffNotice: string;
  exportCapacity: string;
  enableSampleKitCta: boolean;
  enableTariffCalculator: boolean;
}

export interface AdminRfqOrder {
  id: string;
  rfqNumber: string;
  projectName: string;
  clientCompany: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  destinationState: string;
  projectType: 'Multi-Family' | 'Hospitality Hotel' | 'Student Housing' | 'Commercial' | 'Retail / Wholesaler';
  material: string;
  color: string;
  items: {
    name: string;
    size: string;
    quantity: number;
    unitPrice: number;
    sinkIncluded: boolean;
    backsplashIncluded: boolean;
  }[];
  totalUnits: number;
  estimatedTotalUsd: number;
  estimatedContainers: number;
  section301SavingsUsd: number;
  status: 'New Inquiry' | 'CAD Review' | 'Quotation Sent' | 'Deposit Paid' | 'In Production' | 'Crated & Staged' | 'Shipped / At Sea';
  cOStatus: 'Owner Verified' | 'Pending Verification' | 'Buyer Broker Review';
  leadDate: string;
  targetShipDate: string;
  assignedPlant: string;
}

export interface ContainerShipment {
  containerNumber: string;
  bookingRef: string;
  vesselName: string;
  carrier: string;
  originPort: string;
  destinationPort: string;
  departureDate: string;
  etaDate: string;
  status: 'Loading at Factory' | 'Customs Cleared Cat Lai' | 'At Sea' | 'Approaching US Port' | 'Discharged / Delivered';
  totalCrates: number;
  payloadKg: number;
  payloadLbs: number;
  projectName: string;
  client: string;
  ispm15Certified: boolean;
}

export interface SampleDispatchOrder {
  id: string;
  trackingNumber: string;
  carrier: 'FedEx International Priority' | 'DHL Express' | 'UPS Worldwide';
  firmName: string;
  contactPerson: string;
  address: string;
  cityStateZip: string;
  materialsRequested: string[];
  requestDate: string;
  status: 'Preparing Swatches' | 'Dispatched' | 'Delivered' | 'Project Follow-Up';
}

export interface MachinerySchedule {
  id: string;
  name: string;
  code: string;
  plant: string;
  category: 'Bridge Saw' | 'Edge Polisher' | 'CNC Basin Profiler' | 'Epoxy Bonding Rig' | 'Overhead Crane';
  status: 'Operational (Running)' | 'Scheduled Maintenance' | 'Idle / Setup';
  currentJob: string;
  dailyYieldM2: number;
  operator: string;
  nextServiceDate: string;
}

export interface VanityConfig {
  sizeKey: string;
  label: string;
  lengthInch: number;
  widthInch: number;
  bowlCount: 'Single' | 'Double';
  sinkType: 'Undermount Rectangular UPC' | 'Undermount Oval UPC' | 'Top Mount Vessel' | 'No Sink (Cutout Only)';
  color: string;
  material: 'Engineered Quartz' | 'Carrara White Marble' | 'Calacatta Quartz' | 'Sintered Stone' | 'Pure Black Granite';
  thickness: '2cm (3/4")' | '3cm (1-1/4")' | '4cm Mitered Laminated';
  edge: 'Eased Flat' | 'Bevel 1/4"' | 'Full Bullnose' | 'Ogee Edge' | 'Mitered 1.5"';
  backsplash: boolean;
  sidesplash: boolean;
  quantity: number;
}
