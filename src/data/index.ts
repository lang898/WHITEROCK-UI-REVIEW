import productsData from '../../data/products.json';
import colorsData from '../../data/colors.json';
import finishesData from '../../data/finishes.json';
import edgesData from '../../data/edges.json';
import applicationsData from '../../data/applications.json';
import factoryData from '../../data/factory.json';
import companyData from '../../data/company.json';
import pagesData from '../../data/pages.json';
import partnersData from '../../data/partners.json';
import resourcesData from '../../data/resources.json';
import newsData from '../../data/news.json';
import faqData from '../../data/faq.json';
import lookbookData from '../../data/lookbook.json';
import projectsData from '../../data/projects.json';
import ownerImagesData from '../../data/owner-images.json';
import furnitureTopsData from '../../data/furniture-tops.json';
import stoneTypesData from '../../data/stone-types.json';
import type {
  ProductItem,
  ColorItem,
  FinishItem,
  EdgeItem,
  ApplicationItem,
  EquipmentItem,
  FactoryGalleryItem,
  ResourceItem,
  NewsItem,
  FaqItem,
  FurnitureTopVisual,
  StoneTypeInfo
} from '../types';

export { locales, siteConfig } from './site';

const publicAsset = (path?: string): string | undefined => path && !path.startsWith('/') && !path.startsWith('http') ? `/${path}` : path;

export const products: ProductItem[] = (productsData.products as ProductItem[]).map((item) => ({
  ...item,
  image: publicAsset(item.image) || '',
  imageWebp: publicAsset(item.imageWebp),
  techSheetPdf: publicAsset(item.techSheetPdf),
  dimensions: item.dimensions || item.specs.Size || item.specs.Sizes || item.specs.SlabSize || 'By approved drawing',
  thicknesses: item.thicknesses?.length ? item.thicknesses : [item.specs.Thickness || 'Confirm by quotation'],
  edges: item.edges?.length ? item.edges : (item.specs.Edge ? item.specs.Edge.split(',').map((edge) => edge.trim()) : ['Confirm by approved drawing']),
  sinkCompatibility: item.sinkCompatibility || item.specs.Sink || 'Confirm by approved drawing',
  moq: item.moq || item.specs.MOQ || 'Confirm by quotation',
  leadTime: item.leadTime || item.specs.LeadTime || 'Confirm by quotation',
  packaging: item.packaging || item.specs.Packaging || 'Confirm by quotation'
}));
export const colors: ColorItem[] = (colorsData.colors as ColorItem[]).map((item) => ({
  ...item,
  swatchImage: publicAsset(item.swatchImage) || '',
  image: publicAsset(item.image),
  techSheetPdf: publicAsset(item.techSheetPdf),
  applications: item.applications?.length ? item.applications : item.relatedProducts || ['Interior project review'],
  recommendedUses: item.recommendedUses?.length ? item.recommendedUses : item.relatedProducts || ['Confirm by project'],
  suitability: item.suitability?.length ? item.suitability : (
    item.material === 'Granite'
      ? ['Interior', 'Wet-area by review', 'Exterior by exact stone review']
      : ['Interior', 'Wet-area by review']
  ),
  maintenanceLevel: item.maintenanceLevel || (
    item.material === 'Quartz' ? 'Low' : item.material === 'Engineered Marble' ? 'Moderate' : 'Elevated'
  )
}));
export const stoneTypes: StoneTypeInfo[] = (stoneTypesData.items as StoneTypeInfo[]).map((item) => ({
  ...item,
  image: publicAsset(item.image) || ''
}));
export const finishes: FinishItem[] = (finishesData.finishes as FinishItem[]).map((item) => ({ ...item, image: publicAsset(item.image) || '' }));
export const edges: EdgeItem[] = (edgesData.edges as EdgeItem[]).map((item) => ({ ...item, image: publicAsset(item.image) || '' }));
export const applications: ApplicationItem[] = (applicationsData.items as ApplicationItem[]).map((item) => ({ ...item, image: publicAsset(item.image) || '' }));
export const factory = factoryData;
export const company = companyData;
export const pages = pagesData;
export const partners = partnersData;
export const resources: ResourceItem[] = resourcesData.items as ResourceItem[];
export const news: NewsItem[] = newsData.items as NewsItem[];
export const faqList: FaqItem[] = ((faqData as any).items || []).map((item: any) => ({
  q: item.question || item.q || '',
  a: item.answer || item.a || '',
  question: item.question || item.q || '',
  answer: item.answer || item.a || '',
  category: item.category || 'General Procurement'
})) as FaqItem[];
export const faqIntro: string = (faqData as any).intro || 'Common questions from wholesale, project, and distributor buyers.';
export const lookbook = lookbookData.items;
export const projects = projectsData.items;
export const ownerImages: FactoryGalleryItem[] = ownerImagesData.items as FactoryGalleryItem[];
export const furnitureTops: FurnitureTopVisual[] = (furnitureTopsData.items as FurnitureTopVisual[]).map((item) => ({
  ...item,
  image: publicAsset(item.image) || '',
  imageWebp: publicAsset(item.imageWebp),
  imageAvif: publicAsset(item.imageAvif)
}));
