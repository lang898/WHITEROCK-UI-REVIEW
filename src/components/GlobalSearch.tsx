import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, FileText, Gem, Layers, Package, Search, X } from 'lucide-react';
import { colors, products } from '../data';
import resourcesData from '../../data/resources.json';
import { t } from '../i18n';
import type { ColorItem, LocaleConfig, ProductItem } from '../types';
import { Modal } from './ui/Modal';

interface GlobalSearchProps {
  isOpen: boolean;
  locale: LocaleConfig;
  onClose: () => void;
  onNavigate: (route: string) => void;
  onOpenRfq: () => void;
  onSelectProduct: (product: ProductItem) => void;
  onSelectColor: (color: ColorItem) => void;
  onAddColorSample?: (color: ColorItem) => void;
  onAddColorToRfq?: (color: ColorItem) => void;
}

type SearchDocument = { id: string; title: string; category: string; documentType: string; description: string; access: string };
const documents = resourcesData.items as SearchDocument[];
const materialRoutes: Record<string, string> = { Marble: 'stone-marble', Granite: 'stone-granite', Quartz: 'stone-quartz', Quartzite: 'stone-quartzite', Travertine: 'stone-travertine', 'Engineered Marble': 'stone-engineered-marble' };
const popularSearches = [
  { label: 'Quartz', route: 'stone-quartz' }, { label: 'Vanity', route: 'product-vanity' }, { label: 'Marble', route: 'stone-marble' }, { label: 'Samples', route: 'samples' }, { label: 'Documents', route: 'resources-documents' },
] as const;

const editDistance = (left: string, right: string) => {
  const matrix = Array.from({ length: left.length + 1 }, (_, row) => [row]);
  for (let column = 1; column <= right.length; column += 1) matrix[0][column] = column;
  for (let row = 1; row <= left.length; row += 1) {
    for (let column = 1; column <= right.length; column += 1) matrix[row][column] = Math.min(matrix[row - 1][column] + 1, matrix[row][column - 1] + 1, matrix[row - 1][column - 1] + (left[row - 1] === right[column - 1] ? 0 : 1));
  }
  return matrix[left.length][right.length];
};

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, locale, onClose, onNavigate, onOpenRfq, onSelectProduct, onSelectColor, onAddColorSample, onAddColorToRfq }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { if (!isOpen) return; const timer = window.setTimeout(() => inputRef.current?.focus(), 50); return () => window.clearTimeout(timer); }, [isOpen]);

  const pageEntries = [
    ['products', 'Products'], ['materials', 'Materials'], ['applications', 'Applications'], ['factory', 'Factory'], ['resources', 'Resources'], ['samples', 'Samples'], ['contact', 'Contact & support'], ['about', 'About'],
  ];

  const fuzzyScore = (value: string, search: string) => {
    const haystack = value.toLowerCase();
    if (!search) return 1;
    const directIndex = haystack.indexOf(search);
    if (directIndex >= 0) return 100 - directIndex;
    let searchIndex = 0;
    let score = 0;
    for (let index = 0; index < haystack.length && searchIndex < search.length; index += 1) {
      if (haystack[index] === search[searchIndex]) { score += index > 0 && haystack[index - 1] === search[Math.max(0, searchIndex - 1)] ? 3 : 1; searchIndex += 1; }
    }
    return searchIndex === search.length ? score : 0;
  };

  const normalized = query.trim().toLowerCase();
  const quoteIntent = normalized === 'rfq' || normalized.includes('quote') || normalized.includes('quotation') || normalized.includes('pricing');
  const Highlight = ({ text }: { text: string }) => {
    if (!normalized) return <>{text}</>;
    const directIndex = text.toLowerCase().indexOf(normalized);
    if (directIndex >= 0) return <>{text.slice(0, directIndex)}<mark>{text.slice(directIndex, directIndex + normalized.length)}</mark>{text.slice(directIndex + normalized.length)}</>;
    let searchIndex = 0;
    return <>{Array.from(text).map((character, index) => { const matched = searchIndex < normalized.length && character.toLowerCase() === normalized[searchIndex]; if (matched) searchIndex += 1; return matched ? <mark key={`${character}-${index}`}>{character}</mark> : character; })}</>;
  };

  const results = useMemo(() => {
    if (!normalized) return { products: products.slice(0, 5), colors: colors.slice(0, 5), materials: [] as string[], documents: documents.slice(0, 5), pages: [] as Array<{ route: string; label: string; score: number }> };
    const rank = <T,>(items: T[], text: (item: T) => string) => items.map((item) => ({ item, score: fuzzyScore(text(item), normalized) })).filter(({ score }) => score > 0).sort((a, b) => b.score - a.score).slice(0, 5).map(({ item }) => item);
    const productResults = rank(products, (item) => [item.title, item.sku, item.category, item.material, item.description].join(' '));
    const colorResults = rank(colors, (item) => [item.name, item.material, item.colorFamily, item.description].join(' '));
    const materials = rank(Array.from(new Set([...products.map((item) => item.material), ...colors.map((item) => item.material)])), (item) => item);
    const documentResults = rank(documents, (item) => [item.title, item.category, item.documentType, item.description].join(' '));
    const pages = pageEntries.map(([route, label]) => ({ route, label, score: fuzzyScore(label, normalized) })).filter(({ score }) => score > 0).sort((a, b) => b.score - a.score).slice(0, 5);
    return { products: productResults, colors: colorResults, materials, documents: documentResults, pages };
  }, [normalized]);

  const suggestion = useMemo(() => {
    if (normalized.length < 3 || quoteIntent) return '';
    const candidates = Array.from(new Set(['Carrara', ...colors.flatMap((item) => [item.name, item.material]), ...products.flatMap((item) => [item.title, item.material]), ...documents.map((item) => item.title), ...pageEntries.map(([, label]) => label)])).filter((candidate) => candidate.toLowerCase() !== normalized);
    const ranked = candidates.map((candidate) => ({ candidate, distance: editDistance(normalized, candidate.toLowerCase()) })).sort((left, right) => left.distance - right.distance || left.candidate.length - right.candidate.length);
    const closest = ranked[0];
    return closest && closest.distance <= Math.max(2, Math.floor(normalized.length * 0.34)) ? closest.candidate : '';
  }, [normalized, quoteIntent]);

  if (!isOpen) return null;
  const noResults = !quoteIntent && !results.products.length && !results.colors.length && !results.materials.length && !results.documents.length && !results.pages.length;
  const navigateAndClose = (route: string) => { onNavigate(route); onClose(); };

  return (
    <Modal onClose={onClose} ariaLabel={t(locale, 'search')} className="wr-search-backdrop" panelClassName="wr-search-panel wr-modal-enter">
      <div className="wr-search-field"><Search aria-hidden="true" /><input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search materials, colors, documents, products, or pages" aria-label={t(locale, 'searchPlaceholder')} /><button className="wr-icon-button" onClick={onClose} aria-label="Close search"><X /></button></div>
      {!normalized && <div className="wr-search-popular"><strong>Popular</strong><div>{popularSearches.map((item) => <button type="button" key={item.label} onClick={() => navigateAndClose(item.route)}>{item.label}</button>)}</div></div>}
      <div className="wr-search-results">
        {(quoteIntent || !normalized) && <section><h2><FileText />Actions</h2><div className="wr-search-list"><button onClick={() => { onClose(); onOpenRfq(); }}><span><strong>Request a Quote</strong><small>Open the RFQ Builder with products, materials, quantity, destination, and drawings.</small></span><ArrowRight /></button></div></section>}
        {suggestion && <div className="wr-search-suggestion" role="status"><div><strong>No exact results for “{query.trim()}”.</strong><span>Did you mean: {suggestion}?</span></div><button className="wr-button wr-button--secondary" onClick={() => setQuery(suggestion)}>Search {suggestion}<ArrowRight /></button></div>}
        {noResults && !suggestion && <div className="wr-search-empty"><Search /><strong>{t(locale, 'noResults')}</strong><span>Try a stone type, color, document, product, page name, or “RFQ”.</span></div>}

        {!!results.materials.length && <section><h2><Gem />Materials</h2><div className="wr-search-list">{results.materials.map((material) => <button key={material} onClick={() => navigateAndClose(materialRoutes[material] || 'materials')}><span><strong><Highlight text={material} /></strong><small>Open material page</small></span><ArrowRight /></button>)}</div></section>}

        {!!results.colors.length && <section><h2><Layers />Colors</h2><div className="wr-search-list">{results.colors.map((color) => <div className="wr-search-result-row" key={color.slug}><button className="wr-search-result-main" onClick={() => { onSelectColor(color); onClose(); }}><span><strong><Highlight text={color.name} /></strong><small><Highlight text={`${color.material} · ${color.colorFamily}`} /></small></span><ArrowRight /></button><div className="wr-search-result-actions">{onAddColorSample && <button onClick={() => onAddColorSample(color)}>Sample</button>}{onAddColorToRfq && <button onClick={() => onAddColorToRfq(color)}>RFQ</button>}</div></div>)}</div></section>}

        {!!results.documents.length && <section><h2><FileText />Documents</h2><div className="wr-search-list">{results.documents.map((doc) => <button key={doc.id} onClick={() => navigateAndClose(doc.documentType === 'CAD' ? 'resources-cad' : doc.documentType === 'Care' ? 'resources-care' : doc.documentType === 'Packing' ? 'resources-packing' : 'resources-documents')}><span><strong><Highlight text={doc.title} /></strong><small>{doc.documentType} · {doc.access === 'public' ? 'Public download' : 'Available on request'}</small></span><ArrowRight /></button>)}</div></section>}

        {!!results.products.length && <section><h2><Package />Products</h2><div className="wr-search-list">{results.products.map((product) => <button key={product.sku} onClick={() => { onSelectProduct(product); onClose(); }}><span><strong><Highlight text={product.title} /></strong><small><Highlight text={`${product.sku} · ${product.material}`} /></small></span><ArrowRight /></button>)}</div></section>}

        {!!results.pages.length && <section><h2><FileText />Pages</h2><div className="wr-search-list">{results.pages.map((page) => <button key={page.route} onClick={() => navigateAndClose(page.route)}><span><strong><Highlight text={page.label} /></strong><small>Open page</small></span><ArrowRight /></button>)}</div></section>}
      </div>
    </Modal>
  );
};
