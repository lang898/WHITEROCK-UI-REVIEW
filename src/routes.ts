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
  | 'stone-engineered-marble';

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
      { id: 'about', label: 'About the manufacturer' },
      { id: 'contact', label: 'Contact & support' },
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
      { id: 'about', label: 'About the manufacturer' },
      { id: 'contact', label: 'Contact & support' },
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
  ogImage: string;
}

const brandSuffix = 'NATURAL & ENGINEERED STONE';
const factoryOg = '/assets/owner/enhanced/production-hall-aisle-enhanced.jpg';
const kitchenOg = '/assets/owner/countertops/waterfall-kitchen-island.jpg';
const vanityOg = '/assets/owner/enhanced/vanity-inspection-sequence-a-enhanced.jpg';
const furnitureOg = '/assets/owner/countertops/oval-travertine-coffee-top.jpg';
const materialOg = '/assets/materials/white-marble-v2.jpg';

export const routes: RouteDefinition[] = [
  { id: 'home', path: '/', title: `Stone Surfaces | ${brandSuffix}`, description: 'Natural and engineered stone fabrication in Vietnam for vanity tops, countertops, furniture surfaces, and project programs.', schemaType: 'WebPage', ogImage: '/assets/brand/whiterock-waterfall-social.jpg' },
  { id: 'about', path: '/about/', title: `About the Manufacturer | ${brandSuffix}`, description: 'Review the legal entity, Vietnam manufacturing approach, factory scope, and drawing-led stone program support.', schemaType: 'AboutPage', ogImage: '/assets/owner/enhanced/factory-exterior-enhanced.jpg' },
  { id: 'products', path: '/products/', title: `Products | ${brandSuffix}`, description: 'Browse vanity tops, kitchen countertops, furniture surfaces, and project stone products prepared for B2B quotation.', schemaType: 'CollectionPage', ogImage: kitchenOg },
  { id: 'product-vanity', path: '/products/vanity-tops/', title: `Vanity Tops | ${brandSuffix}`, description: 'Review vanity top references, dimensions, materials, sink cutouts, finishes, and drawing-led fabrication options.', schemaType: 'CollectionPage', ogImage: vanityOg },
  { id: 'product-kitchen', path: '/products/kitchen-countertops/', title: `Kitchen Countertops | ${brandSuffix}`, description: 'Review kitchen countertop, island, backsplash, waterfall, material, edge, and fabrication references.', schemaType: 'CollectionPage', ogImage: kitchenOg },
  { id: 'product-furniture', path: '/products/furniture-tops/', title: `Furniture Tops | ${brandSuffix}`, description: 'Review stone furniture surfaces for dining, coffee, console, and hospitality programs made to approved drawings.', schemaType: 'CollectionPage', ogImage: furnitureOg },
  { id: 'product-project', path: '/products/project-products/', title: `Project Products | ${brandSuffix}`, description: 'Review commercial, hospitality, architectural, cut-to-size, and custom project stone fabrication references.', schemaType: 'CollectionPage', ogImage: factoryOg },
  { id: 'materials', path: '/materials/', title: `Stone Materials | ${brandSuffix}`, description: 'Compare marble, granite, quartz, quartzite, travertine, and engineered marble before reviewing colors and fabrication options.', schemaType: 'CollectionPage', ogImage: materialOg },
  { id: 'colors', path: '/colors/', title: `Color Library | ${brandSuffix}`, description: 'Compare material, color family, finish, thickness, recommended use, and physical sample options.', schemaType: 'CollectionPage', ogImage: '/assets/colors/alpine-carrara.jpg' },
  { id: 'color-white', path: '/colors/white/', title: `White Stone Colors | ${brandSuffix}`, description: 'Compare white natural and engineered stone color directions, finishes, thicknesses, uses, and sample options.', schemaType: 'CollectionPage', ogImage: '/assets/colors/alpine-carrara.jpg' },
  { id: 'color-grey', path: '/colors/grey/', title: `Grey Stone Colors | ${brandSuffix}`, description: 'Compare grey stone color directions, finishes, thicknesses, uses, and physical sample options.', schemaType: 'CollectionPage', ogImage: '/assets/materials/granite-v2.jpg' },
  { id: 'color-black', path: '/colors/black/', title: `Black Stone Colors | ${brandSuffix}`, description: 'Compare black stone color directions, finishes, thicknesses, uses, and physical sample options.', schemaType: 'CollectionPage', ogImage: '/assets/materials/granite-v2.jpg' },
  { id: 'color-beige', path: '/colors/beige/', title: `Beige Stone Colors | ${brandSuffix}`, description: 'Compare beige and warm stone color directions, finishes, thicknesses, uses, and sample options.', schemaType: 'CollectionPage', ogImage: '/assets/owner/countertops/oval-travertine-coffee-top.jpg' },
  { id: 'color-green', path: '/colors/green/', title: `Green Stone Colors | ${brandSuffix}`, description: 'Compare green natural-stone color directions, finishes, uses, and physical sample options.', schemaType: 'CollectionPage', ogImage: materialOg },
  { id: 'factory', path: '/factory/', title: `Vietnam Stone Factory | ${brandSuffix}`, description: 'Review cutting, CNC, finishing, inspection, packing, production evidence, and drawing-led fabrication controls.', schemaType: 'AboutPage', ogImage: factoryOg },
  { id: 'finishes', path: '/finishes/', title: `Finishes and Edges | ${brandSuffix}`, description: 'Compare stone surface finishes, edge profiles, sink details, and fabrication directions.', schemaType: 'CollectionPage', ogImage: '/assets/owner/enhanced/manual-profile-polishing-enhanced.jpg' },
  { id: 'finish-surfaces', path: '/finishes/surface-finishes/', title: `Surface Finishes | ${brandSuffix}`, description: 'Review polished, honed, and textured stone surface finish references and specification considerations.', schemaType: 'CollectionPage', ogImage: '/assets/owner/enhanced/manual-profile-polishing-enhanced.jpg' },
  { id: 'finish-edges', path: '/finishes/edge-profiles/', title: `Stone Edge Profiles | ${brandSuffix}`, description: 'Review stone edge profile directions and drawing-led fabrication considerations.', schemaType: 'CollectionPage', ogImage: '/assets/owner/enhanced/edge-polisher-close-enhanced.jpg' },
  { id: 'finish-sink', path: '/finishes/sink-integration/', title: `Sink and Assembly Details | ${brandSuffix}`, description: 'Review sink cutout, faucet layout, assembly, and packing considerations for vanity top programs.', schemaType: 'CollectionPage', ogImage: vanityOg },
  { id: 'applications', path: '/applications/', title: `Applications | ${brandSuffix}`, description: 'Explore kitchen, bathroom, hospitality, commercial, and furniture stone application directions.', schemaType: 'CollectionPage', ogImage: kitchenOg },
  { id: 'application-kitchen', path: '/applications/kitchen/', title: `Kitchen Applications | ${brandSuffix}`, description: 'Explore stone kitchen countertops, islands, backsplashes, materials, and surface directions.', schemaType: 'CollectionPage', ogImage: '/assets/applications/modern-kitchen-inspiration.jpg' },
  { id: 'application-bathroom', path: '/applications/bathroom/', title: `Bathroom Applications | ${brandSuffix}`, description: 'Explore vanity top, multi-family bathroom, and wet-area stone application directions.', schemaType: 'CollectionPage', ogImage: '/assets/applications/master-bath-inspiration.jpg' },
  { id: 'application-hotel', path: '/applications/hotel/', title: `Hotel Applications | ${brandSuffix}`, description: 'Explore hotel bathroom, lobby, reception, and hospitality stone application directions.', schemaType: 'CollectionPage', ogImage: '/assets/applications/hotel-lobby-inspiration.jpg' },
  { id: 'application-commercial', path: '/applications/commercial/', title: `Commercial Applications | ${brandSuffix}`, description: 'Explore commercial, retail, restaurant, furniture, and project stone application directions.', schemaType: 'CollectionPage', ogImage: '/assets/applications/restaurant-counter-inspiration.jpg' },
  { id: 'partners', path: '/partners/', title: `Trade Program | ${brandSuffix}`, description: 'Review B2B support for importers, builders, distributors, designers, and repeat stone programs.', schemaType: 'WebPage', ogImage: factoryOg },
  { id: 'resources', path: '/resources/', title: `Technical Resources | ${brandSuffix}`, description: 'Access or request product, care, safety, packing, CAD, and technical documents for stone programs.', schemaType: 'CollectionPage', ogImage: '/assets/materials/quartz-v2.jpg' },
  { id: 'contact', path: '/contact/', title: `Contact & Support | ${brandSuffix}`, description: 'Contact the Vietnam manufacturing team for samples, technical documents, supplier qualification, and existing-order support.', schemaType: 'ContactPage', ogImage: '/assets/owner/enhanced/factory-exterior-enhanced.jpg' },
  { id: 'samples', path: '/samples/', title: `Order Stone Samples | ${brandSuffix}`, description: 'Build a physical sample box to confirm shortlisted natural and engineered stone directions before quotation.', schemaType: 'WebPage', ogImage: materialOg },
  { id: 'events', path: '/events/', title: `Fairs and Events | ${brandSuffix}`, description: 'Review confirmed future meeting and exhibition updates from the Vietnam stone manufacturing team.', schemaType: 'WebPage', ogImage: '/assets/owner/enhanced/factory-exterior-enhanced.jpg' },
  { id: 'stone-marble', path: '/stone-types/marble/', title: `Marble | ${brandSuffix}`, description: 'Review marble properties, care, applications, colors, finishes, samples, and technical-document status.', schemaType: 'CollectionPage', ogImage: '/assets/materials/white-marble-v2.jpg' },
  { id: 'stone-granite', path: '/stone-types/granite/', title: `Granite | ${brandSuffix}`, description: 'Review granite properties, care, applications, colors, finishes, samples, and technical-document status.', schemaType: 'CollectionPage', ogImage: '/assets/materials/granite-v2.jpg' },
  { id: 'stone-quartz', path: '/stone-types/quartz/', title: `Quartz | ${brandSuffix}`, description: 'Review engineered quartz properties, care, applications, colors, finishes, samples, and document status.', schemaType: 'CollectionPage', ogImage: '/assets/materials/quartz-v2.jpg' },
  { id: 'stone-quartzite', path: '/stone-types/quartzite/', title: `Quartzite | ${brandSuffix}`, description: 'Review quartzite properties, material variation, applications, colors, samples, and technical-document status.', schemaType: 'CollectionPage', ogImage: '/assets/brand/hero-stone-v2.jpg' },
  { id: 'stone-travertine', path: '/stone-types/travertine/', title: `Travertine | ${brandSuffix}`, description: 'Review travertine properties, fill and finish considerations, furniture applications, samples, and document status.', schemaType: 'CollectionPage', ogImage: '/assets/owner/countertops/fluted-travertine-dining-top.jpg' },
  { id: 'stone-engineered-marble', path: '/stone-types/engineered-marble/', title: `Engineered Marble | ${brandSuffix}`, description: 'Review engineered marble properties, repeat-program applications, samples, care, and technical-document status.', schemaType: 'CollectionPage', ogImage: '/assets/materials/engineered-marble-v2.jpg' },
];

export const routesById = Object.fromEntries(routes.map((route) => [route.id, route])) as Record<RouteId, RouteDefinition>;

export function routePath(routeId: string): string {
  return routesById[routeId as RouteId]?.path ?? routesById.home.path;
}

export function routeIdFromLocation(location: Location = window.location): RouteId {
  const legacyHash = location.hash.replace(/^#\/?/, '').split('/')[0];
  if (legacyHash && legacyHash in routesById) return legacyHash as RouteId;

  const pathname = location.pathname.replace(/\/index\.html$/, '/').replace(/\/+$/, '') || '/';
  const match = routes.find((route) => route.path.replace(/\/+$/, '') === pathname.replace(/\/+$/, ''));
  return match?.id ?? 'home';
}
