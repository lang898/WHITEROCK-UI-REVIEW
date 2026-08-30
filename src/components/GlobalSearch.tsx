import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Gem, Layers, Package, Search, X } from 'lucide-react';
import { colors, products } from '../data';
import { t } from '../i18n';
import type { ColorItem, LocaleConfig, ProductItem } from '../types';

interface GlobalSearchProps {
  isOpen: boolean;
  locale: LocaleConfig;
  onClose: () => void;
  onNavigate: (route: string) => void;
  onSelectProduct: (product: ProductItem) => void;
  onSelectColor: (color: ColorItem) => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  isOpen, locale, onClose, onNavigate, onSelectProduct, onSelectColor
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 50);
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen, onClose]);

  const normalized = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!normalized) return { products: products.slice(0, 4), colors: colors.slice(0, 4), materials: [] as string[] };
    const productResults = products.filter((item) =>
      [item.title, item.sku, item.category, item.material, item.description].join(' ').toLowerCase().includes(normalized)
    ).slice(0, 6);
    const colorResults = colors.filter((item) =>
      [item.name, item.material, item.colorFamily, item.description].join(' ').toLowerCase().includes(normalized)
    ).slice(0, 6);
    const materials = Array.from(new Set([...products.map((item) => item.material), ...colors.map((item) => item.material)]))
      .filter((item) => item.toLowerCase().includes(normalized)).slice(0, 4);
    return { products: productResults, colors: colorResults, materials };
  }, [normalized]);

  if (!isOpen) return null;

  const noResults = !results.products.length && !results.colors.length && !results.materials.length;

  return (
    <div className="wr-modal-backdrop wr-search-backdrop" role="dialog" aria-modal="true" aria-label={t(locale, 'search')}>
      <div className="wr-search-panel">
        <div className="wr-search-field">
          <Search aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t(locale, 'searchPlaceholder')}
            aria-label={t(locale, 'searchPlaceholder')}
          />
          <button className="wr-icon-button" onClick={onClose} aria-label="Close search"><X /></button>
        </div>

        <div className="wr-search-results">
          {noResults && <p className="wr-search-empty">{t(locale, 'noResults')}</p>}

          {!!results.products.length && (
            <section aria-labelledby="search-products-title">
              <h2 id="search-products-title"><Package /> {t(locale, 'products')}</h2>
              <div className="wr-search-list">
                {results.products.map((product) => (
                  <button key={product.sku} onClick={() => { onSelectProduct(product); onClose(); }}>
                    <span><strong>{product.title}</strong><small>{product.sku} · {product.material}</small></span><ArrowRight />
                  </button>
                ))}
              </div>
            </section>
          )}

          {!!results.colors.length && (
            <section aria-labelledby="search-colors-title">
              <h2 id="search-colors-title"><Layers /> {t(locale, 'colors')}</h2>
              <div className="wr-search-list">
                {results.colors.map((color) => (
                  <button key={color.slug} onClick={() => { onSelectColor(color); onClose(); }}>
                    <span><strong>{color.name}</strong><small>{color.material} · {color.colorFamily}</small></span><ArrowRight />
                  </button>
                ))}
              </div>
            </section>
          )}

          {!!results.materials.length && (
            <section aria-labelledby="search-materials-title">
              <h2 id="search-materials-title"><Gem /> {t(locale, 'material')}</h2>
              <div className="wr-search-list">
                {results.materials.map((material) => (
                  <button key={material} onClick={() => { onNavigate('colors'); onClose(); }}>
                    <span><strong>{material}</strong><small>Browse related colors and products</small></span><ArrowRight />
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
