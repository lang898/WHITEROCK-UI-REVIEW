export type RouteId =
  | 'home'
  | 'about'
  | 'products'
  | 'colors'
  | 'factory'
  | 'finishes'
  | 'applications'
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

export const primaryNavigation: readonly NavigationGroup[] = [
  { label: 'Products', id: 'products' },
  { label: 'Materials', items: stoneMaterialNavigation },
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
  { label: 'Products', items: [{ id: 'products', label: 'Products' }] },
  { label: 'Materials', items: stoneMaterialNavigation },
  { label: 'Colors', items: [{ id: 'colors', label: 'Color Library' }] },
  { label: 'Finishes & Edges', items: [{ id: 'finishes', label: 'Finishes & Edges' }] },
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
      { id: 'applications', label: 'Applications' },
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
    id: 'colors',
    path: '/colors/',
    title: 'Color Library | WHITEROCK Vietnam Stone Manufacturer',
    description: 'Compare Vietnam granite, marble, and quartz colors by finish, thickness, and format from a stone fabrication factory and quartz supplier.',
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
    id: 'applications',
    path: '/applications/',
    title: 'Applications | WHITEROCK Vietnam Stone Manufacturer',
    description: 'Explore kitchen, bathroom, hospitality, and commercial applications from a Vietnam granite, stone fabrication, and quartz supplier.',
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
