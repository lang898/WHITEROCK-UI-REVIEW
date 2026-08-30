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
    description: 'Natural and engineered stone fabrication in Vietnam for vanity tops, countertops, furniture surfaces and drawing-led project programs.',
    schemaType: 'WebPage',
  },
  {
    id: 'about',
    path: '/about/',
    title: 'About | WHITEROCK Vietnam Stone Manufacturer',
    description: 'Learn about WHITEROCK COMPANY LIMITED, a Vietnam stone manufacturer serving project, wholesale and repeat program buyers.',
    schemaType: 'AboutPage',
  },
  {
    id: 'products',
    path: '/products/',
    title: 'Products | WHITEROCK Vietnam Stone Manufacturer',
    description: 'Browse custom fabricated stone vanity tops, kitchen countertops, furniture tops and project surfaces manufactured in Vietnam.',
    schemaType: 'CollectionPage',
  },
  {
    id: 'colors',
    path: '/colors/',
    title: 'Color Library | WHITEROCK Stone Materials',
    description: 'Browse marble, granite, quartz, quartzite, travertine and engineered marble colors for project fabrication and physical sample review.',
    schemaType: 'CollectionPage',
  },
  {
    id: 'factory',
    path: '/factory/',
    title: 'Factory | WHITEROCK Vietnam Stone Manufacturer',
    description: 'Explore WHITEROCK’s Vietnam stone fabrication facility, CNC capability, quality control, packing and THD program assessment experience.',
    schemaType: 'AboutPage',
  },
  {
    id: 'finishes',
    path: '/finishes/',
    title: 'Finishes & Edges | WHITEROCK Stone Fabrication',
    description: 'Review stone finishes and edge profiles for vanity, countertop, furniture and project fabrication by approved drawing and sample.',
    schemaType: 'CollectionPage',
  },
  {
    id: 'applications',
    path: '/applications/',
    title: 'Applications | WHITEROCK Stone Surfaces',
    description: 'Explore stone applications for kitchens, bathrooms, hospitality, furniture and commercial project programs.',
    schemaType: 'CollectionPage',
  },
  {
    id: 'partners',
    path: '/partners/',
    title: 'Trade Program | WHITEROCK Stone Manufacturing',
    description: 'Trade support for importers, distributors, builders and project buyers sourcing fabricated stone programs from Vietnam.',
    schemaType: 'WebPage',
  },
  {
    id: 'resources',
    path: '/resources/',
    title: 'Technical Resources | WHITEROCK Stone Manufacturing',
    description: 'Access product, care, packing and technical resources for specification, quotation and project stone fabrication.',
    schemaType: 'CollectionPage',
  },
  {
    id: 'contact',
    path: '/contact/',
    title: 'Contact & RFQ | WHITEROCK Vietnam Stone Manufacturer',
    description: 'Send drawings, material references, quantities and destination requirements to WHITEROCK for project review and quotation.',
    schemaType: 'ContactPage',
  },
  {
    id: 'samples',
    path: '/samples/',
    title: 'Order Samples | WHITEROCK Stone Materials',
    description: 'Build a physical sample request for selected WHITEROCK marble, granite, quartz and other stone colors before final specification.',
    schemaType: 'WebPage',
  },
  {
    id: 'events',
    path: '/events/',
    title: 'Fairs & Events | WHITEROCK',
    description: 'Trade fair and event updates from WHITEROCK COMPANY LIMITED in Vietnam.',
    schemaType: 'WebPage',
  },
  {
    id: 'stone-marble',
    path: '/stone-types/marble/',
    title: 'Marble | WHITEROCK Stone Materials',
    description: 'Review marble characteristics, care, applications and available colors for fabricated stone projects.',
    schemaType: 'CollectionPage',
  },
  {
    id: 'stone-granite',
    path: '/stone-types/granite/',
    title: 'Granite | WHITEROCK Stone Materials',
    description: 'Review granite characteristics, care, applications and available colors for interior and exterior project fabrication.',
    schemaType: 'CollectionPage',
  },
  {
    id: 'stone-quartz',
    path: '/stone-types/quartz/',
    title: 'Quartz | WHITEROCK Stone Materials',
    description: 'Review engineered quartz characteristics, care, applications and available colors for repeat countertop and vanity programs.',
    schemaType: 'CollectionPage',
  },
  {
    id: 'stone-quartzite',
    path: '/stone-types/quartzite/',
    title: 'Quartzite | WHITEROCK Stone Materials',
    description: 'Review quartzite characteristics, care and project applications before sample and fabrication approval.',
    schemaType: 'CollectionPage',
  },
  {
    id: 'stone-travertine',
    path: '/stone-types/travertine/',
    title: 'Travertine | WHITEROCK Stone Materials',
    description: 'Review travertine characteristics, finishes, care and recommended architectural applications.',
    schemaType: 'CollectionPage',
  },
  {
    id: 'stone-engineered-marble',
    path: '/stone-types/engineered-marble/',
    title: 'Engineered Marble | WHITEROCK Stone Materials',
    description: 'Review engineered marble characteristics, care and vanity applications for repeat project manufacturing.',
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
  if (routeId === 'admin') return routesById.home.path;
  return routesById[routeId as RouteId]?.path ?? routesById.home.path;
}

export function routeIdFromLocation(location: Location = window.location): RouteId {
  const legacyHash = location.hash.replace(/^#\/?/, '').split('/')[0];
  if (legacyHash === 'admin') return 'home';
  if (legacyHash && legacyHash in routesById) {
    return legacyHash as RouteId;
  }

  const segments = location.pathname
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean);
  const lastSegment = segments.at(-1)?.replace(/\.html$/, '') ?? '';

  if (!lastSegment || lastSegment === 'index' || lastSegment === 'admin') {
    return 'home';
  }

  const match = routes.find((route) => {
    const routeSegment = route.path.split('/').filter(Boolean).at(-1);
    return route.id === lastSegment || routeSegment === lastSegment;
  });
  return match?.id ?? 'home';
}
