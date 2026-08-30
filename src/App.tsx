/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ContactRail } from './components/ContactRail';
import { BackToTop } from './components/BackToTop';
import { AppErrorBoundary } from './components/AppErrorBoundary';
import { PageSeo } from './components/PageSeo';
import { RouteLoading } from './components/RouteLoading';
import { ImageLightbox, type LightboxImage } from './components/ImageLightbox';
import { HomeView } from './views/HomeView';

import { locales } from './data/site';
import { colors } from './data';
import type { ProductItem, ColorItem, RfqCartItem, LocaleConfig, CompareEntry } from './types';
import type { ShareContent } from './components/SocialShareModal';
import { routeIdFromLocation, routePath, routesById, type RouteId } from './routes';

const AboutView = lazy(() => import('./views/AboutView').then((module) => ({ default: module.AboutView })));
const ProductsView = lazy(() => import('./views/ProductsView').then((module) => ({ default: module.ProductsView })));
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
const AdminView = lazy(() => import('./views/AdminView').then((module) => ({ default: module.AdminView })));

const RfqModal = lazy(() => import('./components/RfqModal').then((module) => ({ default: module.RfqModal })));
const ProductModal = lazy(() => import('./components/ProductModal').then((module) => ({ default: module.ProductModal })));
const ColorModal = lazy(() => import('./components/ColorModal').then((module) => ({ default: module.ColorModal })));
const SocialShareModal = lazy(() => import('./components/SocialShareModal').then((module) => ({ default: module.SocialShareModal })));
const GlobalSearch = lazy(() => import('./components/GlobalSearch').then((module) => ({ default: module.GlobalSearch })));
const ComparePanel = lazy(() => import('./components/ComparePanel').then((module) => ({ default: module.ComparePanel })));

function AppContent() {
  const [currentTab, setCurrentTab] = useState<RouteId>(() => routeIdFromLocation());
  const [currentLocale, setCurrentLocale] = useState<LocaleConfig>(locales[0]);

  useEffect(() => {
    const syncRouteFromUrl = () => setCurrentTab(routeIdFromLocation());

    window.addEventListener('popstate', syncRouteFromUrl);
    window.addEventListener('hashchange', syncRouteFromUrl);

    const initialRoute = routeIdFromLocation();
    if (window.location.hash) {
      window.history.replaceState({ routeId: initialRoute }, '', routePath(initialRoute));
    }

    return () => {
      window.removeEventListener('popstate', syncRouteFromUrl);
      window.removeEventListener('hashchange', syncRouteFromUrl);
    };
  }, []);

  // Modals state
  const [isRfqModalOpen, setIsRfqModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorItem | null>(null);
  const [shareModalContent, setShareModalContent] = useState<ShareContent | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [compareItems, setCompareItems] = useState<CompareEntry[]>([]);
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null);
  const [sampleSlugs, setSampleSlugs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('whiterock_sample_box');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // RFQ Cart State
  const [cartItems, setCartItems] = useState<RfqCartItem[]>(() => {
    try {
      const saved = localStorage.getItem('whiterock_rfq_cart');
      return saved ? (JSON.parse(saved) as RfqCartItem[]).filter((item) => item.type !== 'sample') : [];
    } catch {
      return [];
    }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('whiterock_rfq_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('whiterock_sample_box', JSON.stringify(sampleSlugs));
    } catch (e) {
      console.error(e);
    }
  }, [sampleSlugs]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  useEffect(() => {
    const openSearch = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable;
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsSearchOpen(true);
      } else if (event.key === '/' && !isTyping) {
        event.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', openSearch);
    return () => window.removeEventListener('keydown', openSearch);
  }, []);

  useEffect(() => {
    const openContentImage = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLImageElement)) return;
      if (!target.closest('main')) return;
      if (target.closest('button, a, [data-lightbox-ignore], .wr-gallery-card, .wr-modal-backdrop')) return;
      const src = target.currentSrc || target.src;
      if (!src || src.startsWith('data:')) return;
      setLightboxImage({ src, alt: target.alt || 'WHITEROCK image detail' });
    };
    document.addEventListener('click', openContentImage);
    return () => document.removeEventListener('click', openContentImage);
  }, []);

  const toggleCompare = (entry: CompareEntry) => {
    setCompareItems((current) => {
      if (current.some((item) => item.id === entry.id)) return current.filter((item) => item.id !== entry.id);
      if (current.length >= 3) {
        showToast('Compare up to 3 products or colors at a time');
        return current;
      }
      return [...current, entry];
    });
  };

  const handleOpenShare = (content?: ShareContent) => {
    if (content) {
      setShareModalContent(content);
    } else {
      setShareModalContent({
        title: 'WHITEROCK SURFACES VIETNAM - Direct B2B Stone & Vanity Top Manufacturer',
        text: 'Stone manufacturing in Vietnam for quartz, marble, granite, countertops, vanity tops, and custom fabrication. Specifications and trade terms are confirmed by quotation.',
        type: 'site'
      });
    }
  };

  const handleAddToCart = (prod: ProductItem | RfqCartItem) => {
    if ('type' in prod && prod.type === 'product' && !('specs' in prod)) {
      // It's already a configured RfqCartItem from VanityConfigurator
      setCartItems((prev) => [...prev, prod as RfqCartItem]);
      showToast(`Added ${prod.title} to RFQ package`);
      return;
    }

    const p = prod as ProductItem;
    const existing = cartItems.find((item) => item.sku === p.sku);
    if (existing) {
      setCartItems((prev) =>
        prev.map((i) => (i.sku === p.sku ? { ...i, quantity: i.quantity + 1 } : i))
      );
    } else {
      const newItem: RfqCartItem = {
        id: `prod_${p.sku}_${Date.now()}`,
        title: p.title,
        type: 'product',
        sku: p.sku,
        material: p.material,
        selectedThickness: p.specs.Thickness || '20 mm (3/4") / 30 mm (1¼")',
        selectedEdge: p.specs.Edge || 'Eased',
        quantity: 1,
      };
      setCartItems((prev) => [...prev, newItem]);
    }
    showToast(`Added ${p.sku} to RFQ kit`);
  };

  const handleAddColorSample = (color: ColorItem) => {
    if (sampleSlugs.includes(color.slug)) {
      showToast(`${color.name} is already in the sample box`);
      return;
    }
    if (sampleSlugs.length >= 6) {
      showToast('The sample box holds up to 6 colors');
      return;
    }
    setSampleSlugs((current) => [...current, color.slug]);
    showToast(`Added ${color.name} to the sample box`);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as RfqCartItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Scroll to top on tab switch
  const handleTabChange = (tab: string) => {
    const nextRoute = routesById[tab as RouteId] ? (tab as RouteId) : 'home';
    const nextPath = routePath(nextRoute);

    setCurrentTab(nextRoute);
    if (window.location.pathname !== nextPath || window.location.hash) {
      window.history.pushState({ routeId: nextRoute }, '', nextPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="hybrid-site min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans antialiased selection:bg-stone-200 selection:text-stone-900">
      <PageSeo routeId={currentTab} language={currentLocale.id} />
      {/* Header with Navigation and RFQ Count */}
      <Header
        currentTab={currentTab}
        setCurrentTab={handleTabChange}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        openCart={() => setIsRfqModalOpen(true)}
        sampleCount={sampleSlugs.length}
        openSamples={() => handleTabChange('samples')}
        currentLocale={currentLocale}
        setLocale={setCurrentLocale}
        onOpenShare={() => handleOpenShare()}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main View Router */}
      <Suspense fallback={<RouteLoading />}>
        <main className="flex-1">
        {currentTab === 'home' && (
          <HomeView
            setCurrentTab={handleTabChange}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onSelectColor={(c) => setSelectedColor(c)}
            onAddToCart={handleAddToCart}
            onAddColorSample={handleAddColorSample}
            currentLocale={currentLocale}
            onOpenShareModal={handleOpenShare}
          />
        )}

        {currentTab === 'about' && (
          <AboutView
            currentLocale={currentLocale}
            setCurrentTab={handleTabChange}
            onOpenShareModal={handleOpenShare}
          />
        )}

        {currentTab === 'products' && (
          <ProductsView
            onSelectProduct={(p) => setSelectedProduct(p)}
            onAddToCart={handleAddToCart}
            currentLocale={currentLocale}
            onToggleCompare={(product) => toggleCompare({ id: `product:${product.sku}`, kind: 'product', item: product })}
            compareIds={compareItems.map((item) => item.id)}
          />
        )}

        {currentTab === 'colors' && (
          <ColorsView
            onSelectColor={(c) => setSelectedColor(c)}
            onAddColorSample={handleAddColorSample}
            currentLocale={currentLocale}
            onToggleCompare={(color) => toggleCompare({ id: `color:${color.slug}`, kind: 'color', item: color })}
            compareIds={compareItems.map((item) => item.id)}
          />
        )}

        {currentTab === 'finishes' && (
          <FinishesEdgesView
            setCurrentTab={handleTabChange}
            currentLocale={currentLocale}
          />
        )}

        {currentTab === 'factory' && (
          <FactoryView
            currentLocale={currentLocale}
            setCurrentTab={handleTabChange}
          />
        )}

        {currentTab === 'applications' && (
          <ApplicationsView
            onSelectColor={(c) => setSelectedColor(c)}
            currentLocale={currentLocale}
          />
        )}

        {currentTab === 'partners' && (
          <PartnersView
            setCurrentTab={handleTabChange}
            currentLocale={currentLocale}
          />
        )}

        {currentTab === 'resources' && (
          <ResourcesView
            currentLocale={currentLocale}
          />
        )}

        {currentTab === 'contact' && (
          <ContactView
            currentLocale={currentLocale}
            onOpenShareModal={handleOpenShare}
          />
        )}

        {currentTab === 'samples' && (
          <SampleRequestView
            samples={colors.filter((color) => sampleSlugs.includes(color.slug))}
            currentLocale={currentLocale}
            onRemove={(slug) => setSampleSlugs((current) => current.filter((item) => item !== slug))}
            onClear={() => setSampleSlugs([])}
            setCurrentTab={handleTabChange}
          />
        )}

        {currentTab.startsWith('stone-') && (
          <StoneTypeView
            stoneTypeId={currentTab.replace('stone-', '') as 'marble' | 'granite' | 'quartz' | 'quartzite' | 'travertine' | 'engineered-marble'}
            currentLocale={currentLocale}
            onSelectColor={(color) => setSelectedColor(color)}
            onAddColorSample={handleAddColorSample}
            setCurrentTab={handleTabChange}
          />
        )}

        {currentTab === 'events' && (
          <EventsView currentLocale={currentLocale} setCurrentTab={handleTabChange} />
        )}

        {currentTab === 'admin' && (
          <AdminView
            currentLocale={currentLocale}
            setCurrentTab={handleTabChange}
          />
        )}
        </main>
      </Suspense>

      {/* Footer */}
      <Footer
        currentLocale={currentLocale}
        setCurrentTab={handleTabChange}
        onOpenShare={() => handleOpenShare()}
        showInquiryCta={currentTab !== 'home'}
      />

      {/* Floating Quick Action Contact & Quote Rail */}
      <ContactRail />

      {/* Floating Back to Top Navigation */}
      <BackToTop threshold={350} />

      <ImageLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />

      {/* Modal code is requested only after the related interaction begins. */}
      <Suspense fallback={null}>
        {isRfqModalOpen && (
          <RfqModal
            isOpen
            onClose={() => setIsRfqModalOpen(false)}
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            currentLocale={currentLocale}
          />
        )}

        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={handleAddToCart}
            onShare={handleOpenShare}
          />
        )}

        {selectedColor && (
          <ColorModal
            color={selectedColor}
            onClose={() => setSelectedColor(null)}
            onRequestSample={handleAddColorSample}
            onShare={handleOpenShare}
          />
        )}

        {shareModalContent && (
          <SocialShareModal
            isOpen
            onClose={() => setShareModalContent(null)}
            content={shareModalContent}
          />
        )}

        {isSearchOpen && (
          <GlobalSearch
            isOpen
            locale={currentLocale}
            onClose={() => setIsSearchOpen(false)}
            onNavigate={handleTabChange}
            onSelectProduct={(product) => setSelectedProduct(product)}
            onSelectColor={(color) => setSelectedColor(color)}
          />
        )}

        <ComparePanel
          items={compareItems}
          locale={currentLocale}
          onRemove={(id) => setCompareItems((items) => items.filter((item) => item.id !== id))}
          onClear={() => setCompareItems([])}
        />
      </Suspense>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 border border-stone-700 text-white text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <span className="w-2 h-2 rounded-full bg-stone-400 animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppErrorBoundary>
      <AppContent />
    </AppErrorBoundary>
  );
}
