import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { routes, type RouteDefinition } from './src/routes';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const productionDomain = 'https://www.whiterockstone.com';
const displayBrand = 'NATURAL & ENGINEERED STONE';
const legalName = 'WHITEROCK COMPANY LIMITED';

const legacyRedirects: Record<string, string> = {
  '/products/furniture-tops/': '/products/table-tops/',
  '/products/project-products/': '/products/commercial/',
  '/stone-types/marble/': '/materials/marble/',
  '/stone-types/granite/': '/materials/granite/',
  '/stone-types/quartz/': '/materials/quartz/',
  '/stone-types/quartzite/': '/materials/quartzite/',
  '/stone-types/travertine/': '/materials/travertine/',
  '/stone-types/engineered-marble/': '/materials/engineered-marble/',
  '/applications/hotel/': '/applications/commercial/',
};

const escapeHtml = (value: string) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function upsertMeta(html: string, attribute: 'name' | 'property', key: string, value: string) {
  const expression = new RegExp(`<meta\\s+[^>]*${attribute}=["']${escapeRegExp(key)}["'][^>]*>`, 'i');
  const tag = `<meta ${attribute}="${key}" content="${escapeHtml(value)}" />`;
  return expression.test(html) ? html.replace(expression, tag) : html.replace('</head>', `    ${tag}\n  </head>`);
}

function routeHtml(template: string, route: RouteDefinition) {
  const canonical = new URL(route.path, productionDomain).toString();
  const socialImage = new URL(route.ogImage, productionDomain).toString();
  let html = template.replace(/<title>.*?<\/title>/is, `<title>${escapeHtml(route.title)}</title>`);
  html = upsertMeta(html, 'name', 'description', route.description);
  html = upsertMeta(html, 'property', 'og:title', route.title);
  html = upsertMeta(html, 'property', 'og:site_name', displayBrand);
  html = upsertMeta(html, 'property', 'og:description', route.description);
  html = upsertMeta(html, 'property', 'og:url', canonical);
  html = upsertMeta(html, 'property', 'og:type', 'website');
  html = upsertMeta(html, 'property', 'og:image', socialImage);
  html = upsertMeta(html, 'property', 'og:image:alt', `${route.title} social preview`);
  html = upsertMeta(html, 'name', 'twitter:card', 'summary_large_image');
  html = upsertMeta(html, 'name', 'twitter:title', route.title);
  html = upsertMeta(html, 'name', 'twitter:description', route.description);
  html = upsertMeta(html, 'name', 'twitter:image', socialImage);

  const canonicalTag = `<link rel="canonical" href="${canonical}" />`;
  const canonicalExpression = /<link\s+[^>]*rel=["']canonical["'][^>]*>/i;
  html = canonicalExpression.test(html) ? html.replace(canonicalExpression, canonicalTag) : html.replace('</head>', `    ${canonicalTag}\n  </head>`);
  html = html.replace(/\s*<script id="static-route-structured-data" type="application\/ld\+json">[\s\S]*?<\/script>/i, '');

  const graph: Record<string, unknown>[] = [{ '@type': route.schemaType, '@id': `${canonical}#page`, name: route.title, description: route.description, url: canonical, isPartOf: { '@id': `${productionDomain}/#website` }, about: { '@id': `${productionDomain}/#organization` } }];
  if (route.id === 'home') graph.push({ '@type': 'Organization', '@id': `${productionDomain}/#organization`, name: legalName, alternateName: displayBrand, url: productionDomain }, { '@type': 'WebSite', '@id': `${productionDomain}/#website`, name: displayBrand, url: productionDomain, publisher: { '@id': `${productionDomain}/#organization` } });
  else graph.push({ '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: productionDomain }, { '@type': 'ListItem', position: 2, name: route.title, item: canonical }] });
  const schema = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replaceAll('<', '\\u003c');
  return html.replace('</head>', `    <script id="static-route-structured-data" type="application/ld+json">${schema}</script>\n  </head>`);
}

function redirectHtml(target: string) {
  const absolute = new URL(target, productionDomain).toString();
  return `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page moved | ${displayBrand}</title><link rel="canonical" href="${absolute}"><meta http-equiv="refresh" content="0;url=${absolute}"></head><body><p>This page has moved. <a href="${absolute}">Continue</a>.</p><script>location.replace(${JSON.stringify(target)})</script></body></html>`;
}

const staticRoutePages = () => ({
  name: 'whiterock-static-route-pages',
  apply: 'build' as const,
  async closeBundle() {
    const distDir = path.resolve(rootDir, 'dist');
    const template = await readFile(path.join(distDir, 'index.html'), 'utf8');
    await Promise.all(routes.map(async (route) => {
      const relativePath = route.path.replace(/^\/+|\/+$/g, '');
      const outputDirectory = relativePath ? path.join(distDir, relativePath) : distDir;
      await mkdir(outputDirectory, { recursive: true });
      await writeFile(path.join(outputDirectory, 'index.html'), routeHtml(template, route), 'utf8');
    }));
    await Promise.all(Object.entries(legacyRedirects).map(async ([legacyPath, target]) => {
      const outputDirectory = path.join(distDir, legacyPath.replace(/^\/+|\/+$/g, ''));
      await mkdir(outputDirectory, { recursive: true });
      await writeFile(path.join(outputDirectory, 'index.html'), redirectHtml(target), 'utf8');
    }));
    const sitemap = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', ...routes.map((route) => `  <url><loc>${new URL(route.path, productionDomain).toString()}</loc></url>`), '</urlset>', ''].join('\n');
    await writeFile(path.join(distDir, 'sitemap.xml'), sitemap, 'utf8');
  },
});

export default defineConfig(() => ({
  plugins: [react(), tailwindcss(), staticRoutePages()],
  resolve: { alias: { '@': path.resolve(rootDir, '.') } },
  server: { hmr: process.env.DISABLE_HMR !== 'true', watch: process.env.DISABLE_HMR === 'true' ? null : {} },
}));
