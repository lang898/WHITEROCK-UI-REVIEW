/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ContactRail } from './components/ContactRail';
import { BackToTop } from './components/BackToTop';
import { AppErrorBoundary } from './components/AppErrorBoundary';
import { PageSeo } from './components/PageSeo';
import { RouteLoading } from './components/RouteLoading';
import { ImageLightbox, type LightboxImage } from './components/ImageLightbox';
import { MobileActionBar } from './components/MobileActionBar';
import { HomeView } from './views/HomeView';
import { locales, siteConfig } from './data/site';
import { colors } from './data';
import type { ProductItem, ColorItem, RfqCartItem, LocaleConfig, CompareEntry } from './types';
import type { ShareContent } from './components/SocialShareModal';
import { routeIdFromLocation, routePath, routesById, type RouteId } from './routes';

const AboutView = lazy(() => import('./views/AboutView').then((module) => ({ default: module.AboutView })));
const ProductsView = lazy(() => import('./views/ProductsView').then((module) => ({ default: module.ProductsView })));
const MaterialsView = lazy(() => import('./views/MaterialsView').then((module) => ({ default: module.MaterialsView })));
const ColorsView = lazy(() => import('./views/ColorsView').then((module) => ({ default: module.ColorsView })));
const FinishesEdgesView = lazy(() => import('./views/FinishesEdgesView').then((module) => ({ default: module.FinishesEdgesView })));
const FactoryView = lazy(() => import('./views/FactoryView').then((module) => ({ default: module.FactoryView })));
const ApplicationsView = lazy(() => import('./views/ApplicationsView').then((module) => ({ default: module.ApplicationsView })));
const PartnersView = lazy(() => import('./views/PartnersView').then((module) => ({ default: module.PartnersView })));
const ResourcesView = lazy(() => import('./views/ResourcesView').then((module) => ({ default: module.ResourcesView })));
const ContactView = lazy(() => import('./views/ContactView').then((module) => ({ default: module.ContactView })));
const SampleRequestView = lazy(() => import('./views/SampleRequestView').then((module) => ({ default: module.SampleRequestView })));
const StoneTypeView = lazy(() => import('./views/StoneTypeView').then((module) => ({ default: module.StoneTypeView })));
const EventsView = lazy(() => import('./views/EventsView').then((module) => ({ default: module.EventsView })));
const RfqLandingView = lazy(() => import('./views/RfqLandingView').then((module) => ({ default: module.RfqLandingView })));
const CompareLandingView = lazy(() => import('./views/CompareLandingView').then((module) => ({ default: module.CompareLandingView })));
const RfqModal = lazy(() => import('./components/RfqModal').then((module) => ({ default: module.RfqModal })));
const ProductModal = lazy(() => import('./components/ProductModal').then((module) => ({ default: module.ProductModal })));
const ColorModal = lazy(() => import('./components/ColorModal').then((module) => ({ default: module.ColorModal })));
const SocialShareModal = lazy(() => import('./components/SocialShareModal').then((module) => ({ default: module.SocialShareModal })));
const GlobalSearch = lazy(() => import('./components/GlobalSearch').then((module) => ({ default: module.GlobalSearch })));
const ComparePanel = lazy(() => import('./components/ComparePanel').then((module) => ({ default: module.ComparePanel })));

const productProgramByRoute: Partial<Record<RouteId, 'Kitchen Countertops' | 'Vanity Tops' | 'Table Tops' | 'Furniture Surfaces' | 'Commercial Programs'>> = {
  'product-kitchen': 'Kitchen Countertops', 'product-vanity': 'Vanity Tops', 'product-table': 'Table Tops', 'product-furniture': 'Furniture Surfaces', 'product-commercial': 'Commercial Programs',
};
const colorFamilyByRoute: Partial<Record<RouteId, ColorItem['colorFamily']>> = {
  'color-white': 'White', 'color-grey': 'Grey', 'color-black': 'Black', 'color-beige': 'Beige', 'color-green': 'Green', 'color-blue': 'Blue',
};
const finishSectionByRoute: Partial<Record<RouteId, 'surface-finishes' | 'edge-profiles' | 'sink-integration'>> = {
  'finish-surfaces': 'surface-finishes', 'finish-edges': 'edge-profiles', 'finish-sink': 'sink-integration',
};
const applicationCategoryByRoute: Partial<Record<RouteId, 'Kitchen' | 'Bathroom' | 'Furniture' | 'Commercial'>> = {
  'application-kitchen': 'Kitchen', 'application-bathroom': 'Bathroom', 'application-furniture': 'Furniture', 'application-commercial': 'Commercial',
};
const factorySectionByRoute: Partial<Record<RouteId, 'overview' | 'production' | 'quality' | 'compliance'>> = {
  'factory-overview': 'overview', 'factory-production': 'production', 'factory-quality': 'quality', 'factory-compliance': 'compliance',
};
const resourceSectionByRoute: Partial<Record<RouteId, 'documents' | 'cad' | 'care' | 'packing' | 'samples' | 'faq'>> = {
  'resources-documents': 'documents', 'resources-cad': 'cad', 'resources-care': 'care', 'resources-packing': 'packing', 'resources-samples': 'samples', 'resources-faq': 'faq',
};
const aboutSectionByRoute: Partial<Record<RouteId, 'story' | 'vietnam'>> = { 'about-story': 'story', 'about-vietnam': 'vietnam' };
const colorFamilySlugs = new Set(['white', 'grey', 'black', 'beige', 'green', 'blue']);

function colorSlugFromBrowser(): string | null {
  if (typeof window === 'undefined') return null;
  const match = window.location.pathname.match(/^\/colors\/([^/]+)\/?$/);
  if (!match || colorFamilySlugs.has(match[1])) return null;
  return decodeURIComponent(match[1]);
}

function routeFromBrowser(): RouteId {
  return colorSlugFromBrowser() ? 'colors' : routeIdFromLocation();
}

function AppContent() {
  const [currentTab, setCurrentTab] = useState<RouteId>(() => routeFromBrowser());
  const [currentLocale, setCurrentLocale] = useState<LocaleConfig>(locales[0]);
  const [isRfqModalOpen, setIsRfqModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorItem | null>(() => {
    const slug = colorSlugFromBrowser();
    return slug ? colors.find((color) => color.slug === slug) || null : null;
  });
  const colorReturnPathRef = useRef<string | null>(null);
  const [shareModalContent, setShareModalContent] = useState<ShareContent | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [compareItems, setCompareItems] = useState<CompareEntry[]>([]);
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null);
  const [sampleSlugs, setSampleSlugs] = useState<string[]>(() => {
    try { const saved = localStorage.getItem('whiterock_sample_box'); return saved ? JSON.parse(saved) : []; } catch { return []; }
  });
  const [cartItems, setCartItems] = useState<RfqCartItem[]>(() => {
    try { const saved = localStorage.getItem('whiterock_rfq_cart'); return saved ? (JSON.parse(saved) as RfqCartItem[]).filter((item) => item.type !== 'sample') : []; } catch { return []; }
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const syncRouteFromUrl = () => {
      const slug = colorSlugFromBrowser();
      setCurrentTab(slug ? 'colors' : routeIdFromLocation());
      setSelectedColor(slug ? colors.find((color) => color.slug === slug) || null : null);
    };
    window.addEventListener('popstate', syncRouteFromUrl);
    window.addEventListener('hashchange', syncRouteFromUrl);
    const initialSlug = colorSlugFromBrowser();
    const initialRoute = routeFromBrowser();
    if (!initialSlug) {
      const canonical = routePath(initialRoute);
      if (window.location.hash || window.location.pathname.replace(/\/+$/, '/') !== canonical) window.history.replaceState({ routeId: initialRoute }, '', canonical);
    }
    return () => { window.removeEventListener('popstate', syncRouteFromUrl); window.removeEventListener('hashchange', syncRouteFromUrl); };
  }, []);

  useEffect(() => { try { localStorage.setItem('whiterock_rfq_cart', JSON.stringify(cartItems)); } catch (error) { console.error(error); } }, [cartItems]);
  useEffect(() => { try { localStorage.setItem('whiterock_sample_box', JSON.stringify(sampleSlugs)); } catch (error) { console.error(error); } }, [sampleSlugs]);

  const showToast = (message: string) => { setToastMessage(message); window.setTimeout(() => setToastMessage(null), 3000); };

  useEffect(() => {
    const openSearch = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable;
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setIsSearchOpen(true); }
      else if (event.key === '/' && !isTyping) { event.preventDefault(); setIsSearchOpen(true); }
    };
    window.addEventListener('keydown', openSearch);
    return () => window.removeEventListener('keydown', openSearch);
  }, []);

  useEffect(() => {
    const openContentImage = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLImageElement) || !target.closest('main') || target.closest('button, a, [data-lightbox-ignore], .wr-gallery-card, .wr-modal-backdrop')) return;
      const src = target.currentSrc || target.src;
      if (!src || src.startsWith('data:')) return;
      setLightboxImage({ src, alt: target.alt || 'Stone image detail' });
    };
    document.addEventListener('click', openContentImage);
    return () => document.removeEventListener('click', openContentImage);
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const targets = Array.from(document.querySelectorAll<HTMLElement>('main > div > section:not(.wr-hero):not(.wr-factory-page__hero), main .wr-section-heading'));
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) { targets.forEach((target) => target.classList.add('is-visible')); return; }
      document.documentElement.classList.add('wr-reveal-ready');
      targets.forEach((target) => target.classList.add('wr-reveal'));
      const observer = new IntersectionObserver((entries) => { entries.forEach((entry) => { if (!entry.isIntersecting) return; entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }); }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      targets.forEach((target) => observer.observe(target));
      (window as Window & { __wrRevealObserver?: IntersectionObserver }).__wrRevealObserver?.disconnect();
      (window as Window & { __wrRevealObserver?: IntersectionObserver }).__wrRevealObserver = observer;
    });
    return () => { window.cancelAnimationFrame(frame); (window as Window & { __wrRevealObserver?: IntersectionObserver }).__wrRevealObserver?.disconnect(); document.documentElement.classList.remove('wr-reveal-ready'); };
  }, [currentTab]);

  const toggleCompare = (entry: CompareEntry) => {
    setCompareItems((current) => {
      if (current.some((item) => item.id === entry.id)) return current.filter((item) => item.id !== entry.id);
      if (current.length >= 3) { showToast('Compare up to 3 products or colors at a time'); return current; }
      return [...current, entry];
    });
  };

  const handleOpenShare = (content?: ShareContent) => setShareModalContent(content || { title: `${siteConfig.displayBrand} - ${siteConfig.tagline}`, text: 'Natural and engineered stone manufacturing in Vietnam for countertops, vanity tops, furniture surfaces, and custom fabrication.', type: 'site' });

  const handleSelectColor = (color: ColorItem) => {
    colorReturnPathRef.current = window.location.pathname;
    setSelectedColor(color);
    const colorPath = `/colors/${color.slug}/`;
    if (window.location.pathname !== colorPath) window.history.pushState({ colorSlug: color.slug }, '', colorPath);
  };

  const handleCloseColor = () => {
    setSelectedColor(null);
    if (colorSlugFromBrowser()) {
      const returnPath = colorReturnPathRef.current;
      const fallback = currentTab === 'colors' ? routePath('colors') : routePath(currentTab);
      window.history.replaceState({ routeId: currentTab }, '', returnPath || fallback);
    }
    colorReturnPathRef.current = null;
  };

  const handleAddToCart = (product: ProductItem | RfqCartItem) => {
    if ('type' in product && product.type === 'product' && !('specs' in product)) { setCartItems((previous) => [...previous, product]); showToast(`Added ${product.title} to RFQ package`); return; }
    const item = product as ProductItem;
    const existing = cartItems.find((cartItem) => cartItem.sku === item.sku);
    if (existing) setCartItems((previous) => previous.map((cartItem) => cartItem.sku === item.sku ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem));
    else setCartItems((previous) => [...previous, { id: `prod_${item.sku}_${Date.now()}`, title: item.title, type: 'product', sku: item.sku, material: item.material, selectedThickness: 'To be confirmed', selectedEdge: 'To be confirmed / per approved drawing', quantity: 1 }]);
    showToast(`Added ${item.sku} to RFQ kit`);
  };

  const handleAddColorSample = (color: ColorItem) => {
    if (sampleSlugs.includes(color.slug)) { showToast(`${color.name} is already in the sample box`); return; }
    if (sampleSlugs.length >= 6) { showToast('The sample box holds up to 6 colors'); return; }
    setSampleSlugs((current) => [...current, color.slug]);
    showToast(`Added ${color.name} to the sample box`);
  };

  const handleAddColorToRfq = (color: ColorItem) => {
    const id = `color:${color.slug}`;
    setCartItems((previous) => {
      if (previous.some((item) => item.id === id)) return previous;
      return [...previous, { id, title: color.name, type: 'color', material: color.material, selectedColor: color.name, selectedFinish: color.finishes[0] || 'To be confirmed', selectedThickness: 'To be confirmed', quantity: 1, specSummary: `${color.material} · ${color.name}` }];
    });
    showToast(`Added ${color.name} to RFQ`);
  };

  const handleContinueSamplesToRfq = () => {
    const selectedSamples = colors.filter((color) => sampleSlugs.includes(color.slug));
    setCartItems((previous) => {
      const existingIds = new Set(previous.map((item) => item.id));
      const additions: RfqCartItem[] = selectedSamples.filter((color) => !existingIds.has(`color:${color.slug}`)).map((color) => ({ id: `color:${color.slug}`, title: color.name, type: 'color', material: color.material, selectedColor: color.name, selectedFinish: color.finishes[0] || 'To be confirmed', selectedThickness: 'To be confirmed', quantity: 1, specSummary: `${color.material} · ${color.name} · physical sample selected` }));
      return [...previous, ...additions];
    });
    setIsRfqModalOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => setCartItems((previous) => previous.map((item) => item.id === id ? (item.quantity + delta > 0 ? { ...item, quantity: item.quantity + delta } : null) : item).filter(Boolean) as RfqCartItem[]);
  const handleRemoveItem = (id: string) => setCartItems((previous) => previous.filter((item) => item.id !== id));
  const handleClearCart = () => setCartItems([]);

  const handleTabChange = (tab: string) => {
    const nextRoute = routesById[tab as RouteId] ? (tab as RouteId) : 'home';
    const nextPath = routePath(nextRoute);
    setSelectedColor(null);
    colorReturnPathRef.current = null;
    setCurrentTab(nextRoute);
    if (window.location.pathname !== nextPath || window.location.hash) window.history.pushState({ routeId: nextRoute }, '', nextPath);
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };

  const rfqCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const compareIds = compareItems.map((item) => item.id);

  return (
    <div className="hybrid-site min-h-screen flex flex-col font-sans antialiased">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <PageSeo routeId={currentTab} language={currentLocale.id} selectedColor={selectedColor} />
      <Header currentTab={currentTab} setCurrentTab={handleTabChange} cartCount={rfqCount} openCart={() => setIsRfqModalOpen(true)} sampleCount={sampleSlugs.length} openSamples={() => handleTabChange('samples')} currentLocale={currentLocale} setLocale={setCurrentLocale} onOpenShare={() => handleOpenShare()} onOpenSearch={() => setIsSearchOpen(true)} />

      <Suspense fallback={<RouteLoading />}>
        <main id="main-content" className="flex-1" tabIndex={-1}>
          {currentTab === 'home' && <HomeView setCurrentTab={handleTabChange} onSelectProduct={setSelectedProduct} onSelectColor={handleSelectColor} onAddToCart={handleAddToCart} onAddColorSample={handleAddColorSample} currentLocale={currentLocale} onOpenShareModal={handleOpenShare} />}
          {(currentTab === 'about' || currentTab.startsWith('about-')) && <AboutView currentLocale={currentLocale} setCurrentTab={handleTabChange} onOpenShareModal={handleOpenShare} section={aboutSectionByRoute[currentTab]} />}
          {(currentTab === 'products' || currentTab.startsWith('product-')) && <ProductsView onSelectProduct={setSelectedProduct} onAddToCart={handleAddToCart} currentLocale={currentLocale} onToggleCompare={(product) => toggleCompare({ id: `product:${product.sku}`, kind: 'product', item: product })} compareIds={compareIds} setCurrentTab={handleTabChange} program={productProgramByRoute[currentTab]} />}
          {currentTab === 'materials' && <MaterialsView setCurrentTab={handleTabChange} />}
          {(currentTab === 'colors' || currentTab.startsWith('color-')) && <ColorsView onSelectColor={handleSelectColor} onAddColorSample={handleAddColorSample} currentLocale={currentLocale} onToggleCompare={(color) => toggleCompare({ id: `color:${color.slug}`, kind: 'color', item: color })} compareIds={compareIds} setCurrentTab={handleTabChange} family={colorFamilyByRoute[currentTab]} />}
          {(currentTab === 'finishes' || currentTab.startsWith('finish-')) && <FinishesEdgesView setCurrentTab={handleTabChange} currentLocale={currentLocale} section={finishSectionByRoute[currentTab]} />}
          {(currentTab === 'factory' || currentTab.startsWith('factory-')) && <FactoryView currentLocale={currentLocale} setCurrentTab={handleTabChange} section={factorySectionByRoute[currentTab]} />}
          {(currentTab === 'applications' || currentTab.startsWith('application-')) && <ApplicationsView onSelectColor={handleSelectColor} onAddColorSample={handleAddColorSample} currentLocale={currentLocale} setCurrentTab={handleTabChange} category={applicationCategoryByRoute[currentTab]} />}
          {currentTab === 'partners' && <PartnersView setCurrentTab={handleTabChange} currentLocale={currentLocale} />}
          {(currentTab === 'resources' || currentTab.startsWith('resources-')) && <ResourcesView currentLocale={currentLocale} setCurrentTab={handleTabChange} section={resourceSectionByRoute[currentTab]} />}
          {currentTab === 'contact' && <ContactView currentLocale={currentLocale} onOpenShareModal={handleOpenShare} />}
          {currentTab === 'samples' && <SampleRequestView samples={colors.filter((color) => sampleSlugs.includes(color.slug))} currentLocale={currentLocale} onRemove={(slug) => setSampleSlugs((current) => current.filter((item) => item !== slug))} onClear={() => setSampleSlugs([])} setCurrentTab={handleTabChange} onContinueToRfq={handleContinueSamplesToRfq} />}
          {currentTab.startsWith('stone-') && <StoneTypeView stoneTypeId={currentTab.replace('stone-', '') as 'marble' | 'granite' | 'quartz' | 'quartzite' | 'travertine' | 'engineered-marble'} currentLocale={currentLocale} onSelectColor={handleSelectColor} onAddColorSample={handleAddColorSample} onToggleCompare={(color) => toggleCompare({ id: `color:${color.slug}`, kind: 'color', item: color })} compareIds={compareIds} setCurrentTab={handleTabChange} />}
          {currentTab === 'rfq' && <RfqLandingView setCurrentTab={handleTabChange} />}
          {currentTab === 'compare' && <CompareLandingView setCurrentTab={handleTabChange} selectionCount={compareItems.length} />}
          {currentTab === 'events' && <EventsView currentLocale={currentLocale} setCurrentTab={handleTabChange} />}
        </main>
      </Suspense>

      <Footer currentLocale={currentLocale} setCurrentTab={handleTabChange} onOpenShare={() => handleOpenShare()} />
      <ContactRail />
      <MobileActionBar sampleCount={sampleSlugs.length} rfqCount={rfqCount} onSamples={() => handleTabChange('samples')} onRfq={() => setIsRfqModalOpen(true)} />
      <BackToTop threshold={350} />
      <ImageLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />

      <Suspense fallback={null}>
        {isRfqModalOpen && <RfqModal isOpen onClose={() => setIsRfqModalOpen(false)} cartItems={cartItems} onUpdateQuantity={handleUpdateQuantity} onRemoveItem={handleRemoveItem} onClearCart={handleClearCart} currentLocale={currentLocale} />}
        {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={handleAddToCart} onShare={handleOpenShare} />}
        {selectedColor && <ColorModal color={selectedColor} onClose={handleCloseColor} onRequestSample={handleAddColorSample} onAddToRfq={handleAddColorToRfq} onShare={handleOpenShare} />}
        {shareModalContent && <SocialShareModal isOpen onClose={() => setShareModalContent(null)} content={shareModalContent} />}
        {isSearchOpen && <GlobalSearch isOpen locale={currentLocale} onClose={() => setIsSearchOpen(false)} onNavigate={handleTabChange} onOpenRfq={() => setIsRfqModalOpen(true)} onSelectProduct={setSelectedProduct} onSelectColor={handleSelectColor} onAddColorSample={handleAddColorSample} onAddColorToRfq={handleAddColorToRfq} />}
        <ComparePanel items={compareItems} locale={currentLocale} onRemove={(id) => setCompareItems((items) => items.filter((item) => item.id !== id))} onClear={() => setCompareItems([])} onAddColorSample={handleAddColorSample} onAddColorToRfq={handleAddColorToRfq} />
      </Suspense>

      {toastMessage && <div className="wr-toast" role="status"><span className="wr-toast__dot" /><span>{toastMessage}</span></div>}
    </div>
  );
}

export default function App() {
  return <AppErrorBoundary><AppContent /></AppErrorBoundary>;
}
