import { useEffect } from 'react';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  noindex?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
}

export default function SEO({
  title,
  description,
  canonical,
  ogType = 'website',
  ogImage = '/assets/img/og-image.png',
  noindex = false,
  breadcrumbs,
  jsonLd,
}: SEOProps) {
  useEffect(() => {
    // 1. Page Title
    document.title = title;

    // Helper for meta tags
    const setMetaTag = (attrName: string, attrVal: string, content: string) => {
      let tag = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attrName, attrVal);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    // Helper for link tags
    const setLinkTag = (rel: string, href: string) => {
      let tag = document.querySelector(`link[rel="${rel}"]`);
      if (!tag) {
        tag = document.createElement('link');
        tag.setAttribute(rel, rel);
        document.head.appendChild(tag);
      }
      tag.setAttribute('href', href);
    };

    // 2. Standard Meta
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');

    // 3. Canonical
    const currentOrigin = 'https://levelup-ecosystem.com';
    const resolvedCanonical = canonical
      ? (canonical.startsWith('http') ? canonical : `${currentOrigin}${canonical.startsWith('/') ? '' : '/'}${canonical}`)
      : (typeof window !== 'undefined' ? `${currentOrigin}${window.location.pathname.replace(/\/$/, '') || '/'}` : currentOrigin);
    setLinkTag('canonical', resolvedCanonical);

    // 4. OpenGraph
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:url', resolvedCanonical);
    setMetaTag('property', 'og:site_name', 'LevelUp Ecosystem');
    const fullOgImage = ogImage.startsWith('http') ? ogImage : `${currentOrigin}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`;
    setMetaTag('property', 'og:image', fullOgImage);
    setMetaTag('property', 'og:image:width', '1200');
    setMetaTag('property', 'og:image:height', '630');

    // 5. Twitter
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', fullOgImage);

    // 6. JSON-LD scripts management
    const scriptId = 'page-seo-jsonld';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const schemas: any[] = [];

    // Always include Organization & WebSite baseline on root or all pages
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'LevelUp Ecosystem',
      url: 'https://levelup-ecosystem.com',
      logo: 'https://levelup-ecosystem.com/assets/img/logo.png',
      description: 'Web design and development studio building secure, AI-assisted websites for local businesses, creators, and portfolios.',
      founder: {
        '@type': 'Person',
        name: 'Richelieu Bonte',
      },
      areaServed: 'Worldwide',
      knowsAbout: [
        'Web design',
        'Web development',
        'Website security',
        'Local SEO',
        'AI-assisted development',
      ],
      email: 'contact@levelup-ecosystem.com',
    });

    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'LevelUp Ecosystem',
      alternateName: 'LevelUp',
      url: 'https://levelup-ecosystem.com'
    });

    // Optional BreadcrumbList schema
    if (breadcrumbs && breadcrumbs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: crumb.name,
          item: crumb.url.startsWith('http') ? crumb.url : `${currentOrigin}${crumb.url.startsWith('/') ? '' : '/'}${crumb.url}`
        }))
      });
    }

    // Custom injected schema
    if (jsonLd) {
      if (Array.isArray(jsonLd)) {
        schemas.push(...jsonLd);
      } else {
        schemas.push(jsonLd);
      }
    }

    scriptTag.textContent = JSON.stringify(schemas, null, 2);

    return () => {
      // Clean up dynamic jsonld on unmount if needed
    };
  }, [title, description, canonical, ogType, ogImage, noindex, breadcrumbs, jsonLd]);

  return null;
}
