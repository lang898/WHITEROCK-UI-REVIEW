export type RouteId =
  | 'home'
  | 'products'
  | 'product-kitchen'
  | 'product-vanity'
  | 'product-table'
  | 'product-furniture'
  | 'product-commercial'
  | 'materials'
  | 'stone-marble'
  | 'stone-granite'
  | 'stone-quartz'
  | 'stone-quartzite'
  | 'stone-travertine'
  | 'stone-engineered-marble'
  | 'colors'
  | 'color-white'
  | 'color-grey'
  | 'color-black'
  | 'color-beige'
  | 'color-green'
  | 'color-blue'
  | 'finishes'
  | 'finish-surfaces'
  | 'finish-edges'
  | 'finish-sink'
  | 'applications'
  | 'application-kitchen'
  | 'application-bathroom'
  | 'application-furniture'
  | 'application-commercial'
  | 'factory'
  | 'factory-overview'
  | 'factory-production'
  | 'factory-quality'
  | 'factory-compliance'
  | 'resources'
  | 'resources-documents'
  | 'resources-cad'
  | 'resources-care'
  | 'resources-packing'
  | 'resources-samples'
  | 'resources-faq'
  | 'about'
  | 'about-story'
  | 'about-vietnam'
  | 'contact'
  | 'samples'
  | 'rfq'
  | 'compare'
  | 'partners'
  | 'events';

export interface NavigationItem {
  id: RouteId;
  label: string;
}

export interface NavigationGroup {
  label: string;
  id: RouteId;
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
  { id: 'product-kitchen', label: 'Kitchen Countertops' },
  { id: 'product-vanity', label: 'Vanity Tops' },
  { id: 'product-table', label: 'Table Tops' },
  { id: 'product-furniture', label: 'Furniture Surfaces' },
  { id: 'product-commercial', label: 'Commercial Programs' },
] as const;

export const colorNavigation: readonly NavigationItem[] = [
  { id: 'color-white', label: 'White' },
  { id: 'color-grey', label: 'Grey' },
  { id: 'color-black', label: 'Black' },
  { id: 'color-beige', label: 'Beige' },
  { id: 'color-green', label: 'Green' },
  { id: 'color-blue', label: 'Blue' },
] as const;

export const finishNavigation: readonly NavigationItem[] = [
  { id: 'finish-surfaces', label: 'Surface Finishes' },
  { id: 'finish-edges', label: 'Edge Profiles' },
  { id: 'finish-sink', label: 'Sink & Assembly Details' },
] as const;

export const applicationNavigation: readonly NavigationItem[] = [
  { id: 'application-kitchen', label: 'Kitchen' },
  { id: 'application-bathroom', label: 'Bathroom' },
  { id: 'application-furniture', label: 'Furniture' },
  { id: 'application-commercial', label: 'Commercial & Hospitality' },
] as const;

export const factoryNavigation: readonly NavigationItem[] = [
  { id: 'factory-overview', label: 'Overview' },
  { id: 'factory-production', label: 'Production' },
  { id: 'factory-quality', label: 'Quality Control' },
  { id: 'factory-compliance', label: 'Compliance' },
] as const;

export const resourceNavigation: readonly NavigationItem[] = [
  { id: 'resources-documents', label: 'Technical Documents' },
  { id: 'resources-cad', label: 'CAD & DXF' },
  { id: 'resources-care', label: 'Care & Maintenance' },
  { id: 'resources-packing', label: 'Packing & Shipping' },
  { id: 'resources-samples', label: 'Sample Program' },
  { id: 'resources-faq', label: 'FAQ' },
] as const;

export const aboutNavigation: readonly NavigationItem[] = [
  { id: 'about-story', label: 'Our Story' },
  { id: 'about-vietnam', label: 'Vietnam Manufacturing' },
  { id: 'contact', label: 'Contact' },
] as const;

export const primaryNavigation: readonly NavigationGroup[] = [
  { label: 'Products', id: 'products', items: productNavigation },
  { label: 'Materials', id: 'materials', items: stoneMaterialNavigation },
  { label: 'Factory', id: 'factory', items: factoryNavigation },
  { label: 'Resources', id: 'resources', items: resourceNavigation },
  { label: 'About', id: 'about', items: aboutNavigation },
  { label: 'Contact', id: 'contact' },
] as const;

export const mobileNavigation = primaryNavigation;

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
const resourceOg = '/assets/materials/quartz-v2.jpg';
const aboutOg = '/assets/owner/enhanced/factory-exterior-enhanced.jpg';

const route = (id: RouteId, path: string, title: string, description: string, schemaType = 'WebPage', ogImage = materialOg): RouteDefinition => ({
  id, path, title: `${title} | ${brandSuffix}`, description, schemaType, ogImage,
});

export const routes: RouteDefinition[] = [
  { id: 'home', path: '/', title: `Stone Surfaces | ${brandSuffix}`, description: 'Natural and engineered stone fabrication in Vietnam for vanity tops, countertops, furniture surfaces, and project programs.', schemaType: 'WebPage', ogImage: '/assets/brand/whiterock-waterfall-social.jpg' },

  route('products', '/products/', 'Products', 'Browse kitchen countertops, vanity tops, table tops, furniture surfaces, and commercial stone programs.', 'CollectionPage', kitchenOg),
  route('product-kitchen', '/products/kitchen-countertops/', 'Kitchen Countertops', 'Stone countertops, islands, waterfall ends, backsplashes, cutouts, and edge details made to approved drawings.', 'CollectionPage', kitchenOg),
  route('product-vanity', '/products/vanity-tops/', 'Vanity Tops', 'Single- and double-bowl vanity tops with sink cutouts, backsplashes, edge details, and dimensions confirmed by drawing.', 'CollectionPage', vanityOg),
  route('product-table', '/products/table-tops/', 'Table Tops', 'Stone table tops for dining, coffee, console, hospitality, and custom furniture programs.', 'CollectionPage', furnitureOg),
  route('product-furniture', '/products/furniture-surfaces/', 'Furniture Surfaces', 'Natural and engineered stone surfaces fabricated for furniture and repeat production programs.', 'CollectionPage', furnitureOg),
  route('product-commercial', '/products/commercial/', 'Commercial Programs', 'Cut-to-size and custom stone components for commercial, hospitality, retail, and project programs.', 'CollectionPage', factoryOg),

  route('materials', '/materials/', 'Materials', 'Compare marble, granite, quartz, quartzite, travertine, and engineered marble by color, finish, care, and application.', 'CollectionPage', materialOg),
  route('stone-marble', '/materials/marble/', 'Marble', 'Review marble properties, colors, finishes, care, applications, samples, and technical documents.', 'CollectionPage', '/assets/materials/white-marble-v2.jpg'),
  route('stone-granite', '/materials/granite/', 'Granite', 'Review granite properties, colors, finishes, care, applications, samples, and technical documents.', 'CollectionPage', '/assets/materials/granite-v2.jpg'),
  route('stone-quartz', '/materials/quartz/', 'Quartz', 'Review engineered quartz properties, colors, finishes, care, applications, samples, and technical documents.', 'CollectionPage', '/assets/materials/quartz-v2.jpg'),
  route('stone-quartzite', '/materials/quartzite/', 'Quartzite', 'Review quartzite properties, material movement, applications, samples, and technical documents.', 'CollectionPage', '/assets/brand/hero-stone-v2.jpg'),
  route('stone-travertine', '/materials/travertine/', 'Travertine', 'Review travertine properties, fill and finish choices, furniture applications, care, samples, and documents.', 'CollectionPage', '/assets/owner/countertops/fluted-travertine-dining-top.jpg'),
  route('stone-engineered-marble', '/materials/engineered-marble/', 'Engineered Marble', 'Review engineered marble properties, repeat-program applications, care, samples, and technical documents.', 'CollectionPage', '/assets/materials/engineered-marble-v2.jpg'),

  route('colors', '/colors/', 'Color Library', 'Browse stone colors by material, color family, finish, thickness, and recommended use.', 'CollectionPage', '/assets/colors/alpine-carrara.jpg'),
  route('color-white', '/colors/white/', 'White Stone Colors', 'Compare white natural and engineered stone colors, finishes, thicknesses, uses, and sample options.', 'CollectionPage', '/assets/colors/alpine-carrara.jpg'),
  route('color-grey', '/colors/grey/', 'Grey Stone Colors', 'Compare grey stone colors, finishes, thicknesses, uses, and sample options.', 'CollectionPage', '/assets/materials/granite-v2.jpg'),
  route('color-black', '/colors/black/', 'Black Stone Colors', 'Compare black stone colors, finishes, thicknesses, uses, and sample options.', 'CollectionPage', '/assets/materials/granite-v2.jpg'),
  route('color-beige', '/colors/beige/', 'Beige Stone Colors', 'Compare beige and warm stone colors, finishes, thicknesses, uses, and sample options.', 'CollectionPage', furnitureOg),
  route('color-green', '/colors/green/', 'Green Stone Colors', 'Compare green stone colors, finishes, uses, and physical sample options.', 'CollectionPage', materialOg),
  route('color-blue', '/colors/blue/', 'Blue Stone Colors', 'Compare blue stone colors, finishes, uses, and physical sample options.', 'CollectionPage', '/assets/brand/hero-stone-v2.jpg'),

  route('finishes', '/finishes/', 'Finishes & Edges', 'Compare stone surface finishes, edge profiles, sink details, and fabrication directions.', 'CollectionPage', '/assets/owner/enhanced/manual-profile-polishing-enhanced.jpg'),
  route('finish-surfaces', '/finishes/surface-finishes/', 'Surface Finishes', 'Review polished, honed, and textured finish directions.', 'CollectionPage', '/assets/owner/enhanced/manual-profile-polishing-enhanced.jpg'),
  route('finish-edges', '/finishes/edge-profiles/', 'Edge Profiles', 'Review stone edge profile directions and drawing-led fabrication considerations.', 'CollectionPage', '/assets/owner/enhanced/edge-polisher-close-enhanced.jpg'),
  route('finish-sink', '/finishes/sink-integration/', 'Sink & Assembly Details', 'Review sink cutout, faucet layout, assembly, and packing considerations.', 'CollectionPage', vanityOg),

  route('applications', '/applications/', 'Applications', 'Explore kitchen, bathroom, furniture, commercial, and hospitality stone applications.', 'CollectionPage', kitchenOg),
  route('application-kitchen', '/applications/kitchen/', 'Kitchen Applications', 'Explore kitchen countertops, islands, backsplashes, materials, and surface directions.', 'CollectionPage', '/assets/applications/modern-kitchen-inspiration.jpg'),
  route('application-bathroom', '/applications/bathroom/', 'Bathroom Applications', 'Explore vanity tops, wet-area surfaces, and bathroom stone directions.', 'CollectionPage', '/assets/applications/master-bath-inspiration.jpg'),
  route('application-furniture', '/applications/furniture/', 'Furniture Applications', 'Explore stone surfaces for dining, coffee, console, and hospitality furniture.', 'CollectionPage', furnitureOg),
  route('application-commercial', '/applications/commercial/', 'Commercial Applications', 'Explore commercial, retail, restaurant, hospitality, and project stone applications.', 'CollectionPage', '/assets/applications/restaurant-counter-inspiration.jpg'),

  route('factory', '/factory/', 'Vietnam Stone Factory', 'Review the Vietnam manufacturing site, production, quality controls, compliance records, and shipment preparation.', 'AboutPage', factoryOg),
  route('factory-overview', '/factory/overview/', 'Factory Overview', 'Review the Vietnam facility, manufacturing scope, and core stone programs.', 'AboutPage', factoryOg),
  route('factory-production', '/factory/production/', 'Production', 'Review cutting, CNC, polishing, fabrication, and packing stages.', 'AboutPage', '/assets/owner/enhanced/cnc-cutting-line-enhanced.jpg'),
  route('factory-quality', '/factory/quality/', 'Quality Control', 'Review dimensional inspection, finish checks, production evidence, and order controls.', 'AboutPage', '/assets/owner/qc/digital-thickness-inspection.jpg'),
  route('factory-compliance', '/factory/compliance/', 'Compliance', 'Review available supply-chain, responsible-sourcing, quality-system, and safety documentation.', 'AboutPage', factoryOg),

  route('resources', '/resources/', 'Resources', 'Access technical documents, CAD support, care guidance, packing information, sample support, and FAQs.', 'CollectionPage', resourceOg),
  route('resources-documents', '/resources/documents/', 'Technical Documents', 'Access or request TDS, SDS, product, safety, and technical documents.', 'CollectionPage', resourceOg),
  route('resources-cad', '/resources/cad/', 'CAD & DXF', 'Request CAD and DXF fabrication and drawing support for stone programs.', 'CollectionPage', factoryOg),
  route('resources-care', '/resources/care/', 'Care & Maintenance', 'Review stone care, cleaning, sealing, and maintenance guidance.', 'CollectionPage', materialOg),
  route('resources-packing', '/resources/packing/', 'Packing & Shipping', 'Review packing, protection, marks, bracing, and shipment preparation guidance.', 'CollectionPage', '/assets/owner/enhanced/material-staging-hall-enhanced.jpg'),
  route('resources-samples', '/resources/samples/', 'Sample Program', 'Build a physical sample shortlist before quotation or specification.', 'CollectionPage', materialOg),
  route('resources-faq', '/resources/faq/', 'FAQ', 'Review common questions about materials, documents, samples, production, and export support.', 'FAQPage', resourceOg),

  route('about', '/about/', 'About', 'Learn about the legal entity, Vietnam manufacturing approach, stone experience, and drawing-led production model.', 'AboutPage', aboutOg),
  route('about-story', '/about/story/', 'Our Story', 'Learn how stone experience, drawing control, and Vietnam manufacturing come together.', 'AboutPage', aboutOg),
  route('about-vietnam', '/about/vietnam/', 'Vietnam Manufacturing', 'Review the Dong Nai manufacturing base and direct production model.', 'AboutPage', factoryOg),
  route('contact', '/contact/', 'Contact', 'Contact the Vietnam team for project support, samples, technical documents, and quotation preparation.', 'ContactPage', aboutOg),
  route('samples', '/samples/', 'Samples', 'Build a physical sample box to confirm shortlisted material directions.', 'WebPage', materialOg),
  route('rfq', '/rfq/', 'Request a Quote', 'Prepare a stone RFQ with selected materials, products, drawings, quantities, and project details.', 'WebPage', kitchenOg),
  route('compare', '/compare/', 'Compare Materials & Products', 'Compare shortlisted stone colors and products side by side before sampling or quotation.', 'WebPage', materialOg),
  route('partners', '/partners/', 'Trade Program', 'B2B support for importers, builders, distributors, designers, and repeat stone programs.', 'WebPage', factoryOg),
  route('events', '/events/', 'Fairs & Events', 'Confirmed future meeting and exhibition updates from the Vietnam stone manufacturing team.', 'WebPage', aboutOg),
];

export const routesById = Object.fromEntries(routes.map((item) => [item.id, item])) as Record<RouteId, RouteDefinition>;

const legacyPathToRoute: Record<string, RouteId> = {
  '/products/furniture-tops': 'product-table',
  '/products/project-products': 'product-commercial',
  '/stone-types/marble': 'stone-marble',
  '/stone-types/granite': 'stone-granite',
  '/stone-types/quartz': 'stone-quartz',
  '/stone-types/quartzite': 'stone-quartzite',
  '/stone-types/travertine': 'stone-travertine',
  '/stone-types/engineered-marble': 'stone-engineered-marble',
  '/applications/hotel': 'application-commercial',
};

export function routePath(routeId: string): string {
  return routesById[routeId as RouteId]?.path ?? routesById.home.path;
}

export function routeIdFromLocation(location: Location = window.location): RouteId {
  const legacyHash = location.hash.replace(/^#\/?/, '').split('/')[0];
  if (legacyHash && legacyHash in routesById) return legacyHash as RouteId;

  const pathname = location.pathname.replace(/\/index\.html$/, '/').replace(/\/+$/, '') || '/';
  const legacy = legacyPathToRoute[pathname];
  if (legacy) return legacy;
  const match = routes.find((item) => item.path.replace(/\/+$/, '') === pathname);
  return match?.id ?? 'home';
}
