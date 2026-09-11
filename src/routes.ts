export type RouteId =
  | 'home'
  | 'about'
  | 'products'
  | 'product-vanity'
  | 'product-kitchen'
  | 'product-furniture'
  | 'product-project'
  | 'materials'
  | 'colors'
  | 'color-white'
  | 'color-grey'
  | 'color-black'
  | 'color-beige'
  | 'color-green'
  | 'factory'
  | 'finishes'
  | 'finish-surfaces'
  | 'finish-edges'
  | 'finish-sink'
  | 'applications'
  | 'application-kitchen'
  | 'application-bathroom'
  | 'application-hotel'
  | 'application-commercial'
  | 'partners'
  | 'resources'
  | 'contact'
  | 'samples'
  | 'events'
  | 'stone-marble'
  | 'stone-granite'
  | 'stone-quartz'
  | 'stone-quartzite'
  | 'stone-travertine'
  | 'stone-engineered-marble'
  | 'admin';

export interface NavigationItem {
  id: RouteId;
  label: string;
}

export interface NavigationGroup {
  label: string;
  id?: RouteId;
  items?: readonly NavigationItem[];
}

export const stoneMaterialNavigation: readonly NavigationItem[] = [
  { id: 'stone-marble', label: 'Marble' },
  { id: 'stone-granite', label: 'Granite' },
  { id: 'stone-quartz', label: 'Quartz' },
  { id: 'stone-quartzite', label: 'Quartzite' },
  { id: 'stone-travertine', label: 'Travertine' },
  { id: 'stone-engineered-marble', label: 'Engineered Marble' },
] as const;

export const productNavigation: readonly NavigationItem[] = [
  { id: 'product-vanity', label: 'Vanity Tops' },
  { id: 'product-kitchen', label: 'Kitchen Countertops' },
  { id: 'product-furniture', label: 'Furniture Tops' },
  { id: 'product-project', label: 'Project Products' },
] as const;

export const colorNavigation: readonly NavigationItem[] = [
  { id: 'color-white', label: 'White' },
  { id: 'color-grey', label: 'Grey' },
  { id: 'color-black', label: 'Black' },
  { id: 'color-beige', label: 'Beige' },
  { id: 'color-green', label: 'Green' },
] as const;

export const finishNavigation: readonly NavigationItem[] = [
  { id: 'finish-surfaces', label: 'Surface Finishes' },
  { id: 'finish-edges', label: 'Edge Profiles' },
  { id: 'finish-sink', label: 'Sink & Assembly Details' },
] as const;

export const applicationNavigation: readonly NavigationItem[] = [
  { id: 'application-kitchen', label: 'Kitchen' },
  { id: 'application-bathroom', label: 'Bathroom' },
  { id: 'application-hotel', label: 'Hotel' },
  { id: 'application-commercial', label: 'Commercial' },
] as const;

export const primaryNavigation: readonly NavigationGroup[] = [
  { label: 'Products', id: 'products' },
  { label: 'Materials', id: 'materials', items: stoneMaterialNavigation },
  { label: 'Colors', id: 'colors' },
  { label: 'Finishes & Edges', id: 'finishes' },
  { label: 'Factory', id: 'factory' },
  {
    label: 'Resources',
    items: [
      { id: 'applications', label: 'Applications' },
      { id: 'resources', label: 'Technical Resources' },
      { id: 'partners', label: 'Trade Program' },
    ],
  },
  {
    label: 'About',
    items: [
      { id: 'about', label: 'About WHITEROCK' },
      { id: 'contact', label: 'Contact' },
    ],
  },
] as const;

export const mobileNavigation: readonly NavigationGroup[] = [
  { label: 'Products', items: [{ id: 'products', label: 'All Product Categories' }, ...productNavigation] },
  { label: 'Materials', items: [{ id: 'materials', label: 'All Material Types' }, ...stoneMaterialNavigation] },
  { label: 'Colors', items: [{ id: 'colors', label: 'All Color Families' }, ...colorNavigation] },
  { label: 'Finishes & Edges', items: [{ id: 'finishes', label: 'All Fabrication Options' }, ...finishNavigation] },
  {
    label: 'Company',
    items: [
      { id: 'factory', label: 'Factory' },
      { id: 'about', label: 'About WHITEROCK' },
      { id: 'contact', label: 'Contact' },
    ],
  },
  {
    label: 'Resources',
    items: [
      { id: 'applications', label: 'All Applications' },
      ...applicationNavigation,
      { id: 'resources', label: 'Technical Resources' },
      { id: 'partners', label: 'Trade Program' },
    ],
  },
] as const;

export interface RouteDefinition {
  id: RouteId;
  path: string;
  title: string;
  description: string;
  schemaType: string;
  noIndex?: boolean;
}

export const routes: RouteDefinition[] = [
  {
    id: 'home',
    path: '/',
    title: 'Stone Surfaces | WHITEROCK Vietnam Stone Manufacturer',
    description: 'Explore Vietnam granite, marble, vanity tops, kitchen counters, and drawing-led stone fabrication from a direct quartz supplier for global B2B projects.',
    schemaType: 'WebPage',
  },
  {
    id: 'about',
    path: '/about/',
    title: 'About | WHITEROCK Vietnam Stone Manufacturer',
    description: 'Meet a Vietnam granite and quartz supplier with direct stone fabrication capability for vanity, kitchen, furniture, and project programs.',
    schemaType: 'AboutPage',
  },
  {
    id: 'products',
    path: '/products/',
    title: 'Products | WHITEROCK Vietnam Stone Manufacturer',
    description: 'Browse Vietnam granite, marble, quartz, vanity, countertop, furniture, and architectural products from a direct stone fabrication and quartz supplier.',
    schemaType: 'CollectionPage',
  },
  {
    id: 'product-vanity',
    path: '/products/vanity-tops/',
    title: 'Vanity Tops | WHITEROCK Vietnam Stone Manufacturer',
    description: 'Review vanity top designs, dimensions, materials, sink cutouts, finishes, and packing references for drawing-led stone fabrication.',
    schemaType: 'CollectionPage',
  },
  {
    id: 'product-kitchen',
    path: '/products/kitchen-countertops/',
    title: 'Kitchen Countertops | WHITEROCK Vietnam Stone Manufacturer',
    description: 'Review kitchen countertop and island designs, materials, finishes, edge details, and drawing-led fabrication options.',
    schemaType: 'CollectionPage',
  },
  {
    id: 'product-furniture',
    path: '/products/furniture-tops/',
    title: 'Furniture Tops | WHITEROCK Vietnam Stone Manufacturer',
    description: 'Review stone furniture top designs for dining, coffee, console, and hospitality programs made to approved drawings.',
    schemaType: 'CollectionPage',
  },
  {
    id: 'product-project',
    path: '/products/project-products/',
    title: 'Project Products | WHITEROCK Vietnam Stone Manufacturer',
    description: 'Review custom project stone products, architectural pieces, commercial programs, and fabrication references.',
    schemaType: 'CollectionPage',
  },
  {
    id: 'materials',
    path: '/materials/',
    title: 'Stone Materials | WHITEROCK Vietnam Stone Manufacturer',
    description: 'Choose from marble, granite, quartz, quartzite, travertine, and engineered marble before reviewing colors and fabrication options.',
    schemaType: 'CollectionPage',
  },
  {
    id: 'colors',
    path: '/colors/',
    title: 'Color Library | WHITEROCK Vietnam Stone Manufacturer',
    description: 'Compare Vietnam granite, marble, and quartz colors by finish, thickness, and format from a stone fabrication factory and quartz supplier.',
    schemaType: 'CollectionPage',
  },
  {
    id: 'color-white',
    path: '/colors/white/',
    title: 'White Stone Colors | WHITEROCK Vietnam Stone Manufacturer',
    description: 'Compare white marble, quartz, quartzite, and engineered stone color directions, specifications, and sample options.',
    schemaType: 'CollectionPage',
  },
  {
    id: 'color-grey',
    path: '/colors/grey/',
    title: 'Grey Stone Colors | WHITEROCK Vietnam Stone Manufacturer',
    description: 'Compare grey granite, quartz, quartzite, and engineered stone color directions, specifications, and sample options.',
    schemaType: 'CollectionPage',
  },
  {
    id: 'color-black',
    path: '/colors/black/',
    title: 'Black Stone Colors | WHITEROCK Vietnam Stone Manufacturer',
    description: 'Compare black granite and marble color directions, specifications, finishes, and physical sample options.',
    schemaType: 'CollectionPage',
  },
  {
    id: 'color-beige',
    path: '/colors/beige/',
    title: 'Beige Stone Colors | WHITEROCK Vietnam Stone Manufacturer',
    description: 'Compare beige marble, quartz, travertine, and engineered stone color directions and physical sample options.',
    schemaType: 'CollectionPage',
  },
  {
    id: 'color-green',
    path: '/colors/green/',
    title: 'Green Stone Colors | WHITEROCK Vietnam Stone Manufacturer',
    description: 'Compare green marble and granite color directions, specifications, finishes, and physical sample options.',
    schemaType: 'CollectionPage',
  },
  {
    id: 'factory',
    path: '/factory/',
    title: 'Factory | WHITEROCK Vietnam Stone Manufacturer',
    description: 'Review Vietnam granite and quartz supplier capabilities for cutting, CNC, finishing, inspection, packing, and drawing-led stone fabrication.',
    schemaType: 'AboutPage',
  },
  {
    id: 'finishes',
    path: '/finishes/',
    title: 'Finishes and Edges | WHITEROCK Vietnam Stone Manufacturer',
    description: 'Compare finishes and edge profiles for Vietnam granite, marble, and quartz supplier programs supported by direct stone fabrication.',
    schemaType: 'CollectionPage',
  },
  {
    id: 'finish-surfaces',
    path: '/finishes/surface-finishes/',
    title: 'Surface Finishes | WHITEROCK Vietnam Stone Manufacturer',
    description: 'Review polished, honed, and textured stone surface finish references and recommended applications.',
    schemaType: 'CollectionPage',
  },
  {
    id: 'finish-edges',
    path: '/finishes/edge-profiles/',
    title: 'Stone Edge Profiles | WHITEROCK Vietnam Stone Manufacturer',
    description: 'Review standard, mitered, waterfall, and classic stone edge profile specifications and applications.',
    schemaType: 'CollectionPage',
  },
  {
    id: 'finish-sink',
    path: '/finishes/sink-integration/',
    title: 'Sink and Assembly Details | WHITEROCK Vietnam Stone Manufacturer',
    description: 'Review drawing-led sink cutout, faucet layout, assembly, and packing considerations for vanity top programs.',
    schemaType: 'CollectionPage',
  },
  {
    id: 'applications',
    path: '/applications/',
    title: 'Applications | WHITEROCK Vietnam Stone Manufacturer',
    description: 'Explore kitchen, bathroom, hospitality, and commercial applications from a Vietnam granite, stone fabrication, and quartz supplier.',
    schemaType: 'CollectionPage',
  },
  {
    id: 'application-kitchen',
    path: '/applications/kitchen/',
    title: 'Kitchen Applications | WHITEROCK Vietnam Stone Manufacturer',
    description: 'Explore stone kitchen countertops, islands, backsplashes, materials, and surface directions.',
    schemaType: 'CollectionPage',
  },
  {
    id: 'application-bathroom',
    path: '/applications/bathroom/',
    title: 'Bathroom Applications | WHITEROCK Vietnam Stone Manufacturer',
    description: 'Explore vanity top, multi-family bathroom, and wet-area stone application directions.',
    schemaType: 'CollectionPage',
  },
  {
    id: 'application-hotel',
    path: '/applications/hotel/',
    title: 'Hotel Applications | WHITEROCK Vietnam Stone Manufacturer',
    description: 'Explore hotel bathroom, lobby, reception, and hospitality stone application directions.',
    schemaType: 'CollectionPage',
  },
  {
    id: 'application-commercial',
    path: '/applications/commercial/',
    title: 'Commercial Applications | WHITEROCK Vietnam Stone Manufacturer',
    description: 'Explore commercial, retail, restaurant, furniture, and outdoor stone application directions.',
    schemaType: 'CollectionPage',
  },
  {
    id: 'partners',
    path: '/partners/',
    title: 'Trade Program | WHITEROCK Vietnam Stone Manufacturer',
    description: 'Review trade support for importers, builders, and distributors sourcing Vietnam granite, quartz supplier services, and stone fabrication.',
    schemaType: 'WebPage',
  },
  {
    id: 'resources',
    path: '/resources/',
    title: 'Technical Resources | WHITEROCK Vietnam Stone Manufacturer',
    description: 'Access product, care, packing, and technical resources for Vietnam granite, quartz supplier programs, and custom stone fabrication.',
    schemaType: 'CollectionPage',
  },
  {
    id: 'contact',
    path: '/contact/',
    title: 'Contact and RFQ | WHITEROCK Vietnam Stone Manufacturer',
    description: 'Contact a Vietnam granite and quartz supplier for samples, drawings, quotations, distribution, and custom stone fabrication.',
    schemaType: 'ContactPage',
  },
  {
    id: 'samples',
    path: '/samples/',
    title: 'Order Samples | WHITEROCK Vietnam Stone Manufacturer',
    description: 'Build a sample box for Vietnam granite, marble, and quartz supplier colors before moving into project stone fabrication.',
    schemaType: 'WebPage',
  },
  {
    id: 'events',
    path: '/events/',
    title: 'Fairs and Events | WHITEROCK Vietnam Stone Manufacturer',
    description: 'Find future updates from a Vietnam granite, quartz supplier, and stone fabrication manufacturer serving global B2B buyers.',
    schemaType: 'WebPage',
  },
  {
    id: 'stone-marble',
    path: '/stone-types/marble/',
    title: 'Marble | WHITEROCK Vietnam Stone Manufacturer',
    description: 'Review marble properties, care, applications, and colors from a Vietnam granite and quartz supplier with direct stone fabrication.',
    schemaType: 'CollectionPage',
  },
  {
    id: 'stone-granite',
    path: '/stone-types/granite/',
    title: 'Granite | WHITEROCK Vietnam Stone Manufacturer',
    description: 'Review Vietnam granite properties, care, applications, and colors from a quartz supplier with direct stone fabrication capability.',
    schemaType: 'CollectionPage',
  },
  {
    id: 'stone-quartz',
    path: '/stone-types/quartz/',
    title: 'Quartz | WHITEROCK Vietnam Stone Manufacturer',
    description: 'Review engineered quartz properties, care, and applications from a Vietnam granite and quartz supplier with stone fabrication capability.',
    schemaType: 'CollectionPage',
  },
  {
    id: 'stone-quartzite',
    path: '/stone-types/quartzite/',
    title: 'Quartzite | WHITEROCK Vietnam Stone Manufacturer',
    description: 'Review quartzite properties, care, and applications from a Vietnam granite and quartz supplier with custom stone fabrication.',
    schemaType: 'CollectionPage',
  },
  {
    id: 'stone-travertine',
    path: '/stone-types/travertine/',
    title: 'Travertine | WHITEROCK Vietnam Stone Manufacturer',
    description: 'Review travertine properties, care, furniture uses, and finishes from a Vietnam granite, stone fabrication, and quartz supplier.',
    schemaType: 'CollectionPage',
  },
  {
    id: 'stone-engineered-marble',
    path: '/stone-types/engineered-marble/',
    title: 'Engineered Marble | WHITEROCK Vietnam Stone Manufacturer',
    description: 'Review engineered marble properties and vanity uses from a Vietnam granite and quartz supplier with repeat stone fabrication capability.',
    schemaType: 'CollectionPage',
  },
  {
    id: 'admin',
    path: '/admin/',
    title: 'WHITEROCK Content Admin',
    description: 'Private WHITEROCK content administration workspace.',
    schemaType: 'WebPage',
    noIndex: true,
  },
];

export const routesById = Object.fromEntries(
  routes.map((route) => [route.id, route]),
) as Record<RouteId, RouteDefinition>;

export function routePath(routeId: string): string {
  return routesById[routeId as RouteId]?.path ?? routesById.home.path;
}

export function routeIdFromLocation(location: Location = window.location): RouteId {
  const legacyHash = location.hash.replace(/^#\/?/, '').split('/')[0];
  if (legacyHash && legacyHash in routesById) {
    return legacyHash as RouteId;
  }

  const segments = location.pathname
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean);
  const lastSegment = segments.at(-1)?.replace(/\.html$/, '') ?? '';

  if (!lastSegment || lastSegment === 'index') {
    return 'home';
  }

  const match = routes.find((route) => {
    const routeSegment = route.path.split('/').filter(Boolean).at(-1);
    return route.id === lastSegment || routeSegment === lastSegment;
  });
  return match?.id ?? 'home';
}
