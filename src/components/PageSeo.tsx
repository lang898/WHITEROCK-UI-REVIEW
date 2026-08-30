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

    document.title = route.title;
    document.documentElement.lang = language;
    setCanonical(canonicalUrl);
    setMeta('meta[name="description"]', { name: 'description', content: route.description });
    setMeta('meta[name="robots"]', {
      name: 'robots',
      content: route.noIndex ? 'noindex, nofollow' : 'index, follow',
    });
    setMeta('meta[property="og:title"]', { property: 'og:title', content: route.title });
    setMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: route.description,
    });
    setMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });

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
