import { useEffect } from 'react';
import { siteConfig } from '../data/site';
import { routesById, type RouteId } from '../routes';

interface PageSeoProps {
  routeId: RouteId;
  language: string;
}

function setMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([name, value]) => element?.setAttribute(name, value));
}

function setCanonical(url: string) {
  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = url;
}

export function PageSeo({ routeId, language }: PageSeoProps) {
  useEffect(() => {
    const route = routesById[routeId];
    const canonicalUrl = new URL(route.path, siteConfig.productionDomain).toString();
    const socialImage = new URL(`/${siteConfig.ogImage}`, siteConfig.productionDomain).toString();

    const pageTitle = route.title;
    document.title = pageTitle;
    document.documentElement.lang = language;
    setCanonical(canonicalUrl);
    setMeta('meta[name="description"]', { name: 'description', content: route.description });
    setMeta('meta[name="robots"]', {
      name: 'robots',
      content: route.noIndex ? 'noindex, nofollow' : 'index, follow',
    });
    setMeta('meta[property="og:title"]', { property: 'og:title', content: pageTitle });
    setMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: siteConfig.brand });
    setMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: route.description,
    });
    setMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
    setMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    setMeta('meta[property="og:image"]', { property: 'og:image', content: socialImage });
    setMeta('meta[property="og:image:alt"]', { property: 'og:image:alt', content: siteConfig.ogImageAlt });
    setMeta('meta[property="og:image:width"]', { property: 'og:image:width', content: String(siteConfig.ogImageWidth) });
    setMeta('meta[property="og:image:height"]', { property: 'og:image:height', content: String(siteConfig.ogImageHeight) });
    setMeta('meta[property="og:image:type"]', { property: 'og:image:type', content: 'image/jpeg' });
    setMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    setMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: pageTitle });
    setMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: route.description });
    setMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: socialImage });
    setMeta('meta[name="twitter:image:alt"]', { name: 'twitter:image:alt', content: siteConfig.ogImageAlt });

    const previousSchema = document.getElementById('view-structured-data');
    previousSchema?.remove();

    if (!route.noIndex) {
      const graph: Record<string, unknown>[] = [
        {
          '@type': route.schemaType,
          '@id': `${canonicalUrl}#page`,
          name: route.title,
          description: route.description,
          url: canonicalUrl,
          isPartOf: { '@id': `${siteConfig.productionDomain}/#website` },
          about: { '@id': `${siteConfig.productionDomain}/#organization` },
        },
      ];

      if (routeId === 'home') {
        graph.push(
          {
            '@type': 'Organization',
            '@id': `${siteConfig.productionDomain}/#organization`,
            name: siteConfig.legalName,
            alternateName: siteConfig.brand,
            slogan: siteConfig.tagline,
            url: siteConfig.productionDomain,
            email: siteConfig.email,
            telephone: siteConfig.tel,
            address: {
              '@type': 'PostalAddress',
              streetAddress: siteConfig.address,
              addressCountry: 'VN',
            },
          },
          {
            '@type': 'WebSite',
            '@id': `${siteConfig.productionDomain}/#website`,
            name: siteConfig.brand,
            url: siteConfig.productionDomain,
            publisher: { '@id': `${siteConfig.productionDomain}/#organization` },
          },
        );
      } else {
        graph.push({
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: siteConfig.productionDomain,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: route.title,
              item: canonicalUrl,
            },
          ],
        });
      }

      const schema = document.createElement('script');
      schema.id = 'view-structured-data';
      schema.type = 'application/ld+json';
      schema.text = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
      document.head.appendChild(schema);
    }
  }, [language, routeId]);

  return null;
}
