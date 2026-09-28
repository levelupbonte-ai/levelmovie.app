import { useEffect } from 'react';
import IDENTITY from '../config/identity';

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
    setMetaTag('name', 'author', IDENTITY.personName);

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
    setMetaTag('property', 'og:site_name', IDENTITY.orgName);
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

    // Organization (Single Source of Truth with persistent @id)
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': 'https://levelup-ecosystem.com/#org',
      name: IDENTITY.orgName,
      url: 'https://levelup-ecosystem.com',
      logo: 'https://levelup-ecosystem.com/assets/img/logo.png',
      description: IDENTITY.orgOneLiner,
      founder: {
        '@id': 'https://levelup-ecosystem.com/about/richelieu-bonte#person',
      },
      email: IDENTITY.contactEmail,
      areaServed: 'Worldwide',
      knowsAbout: [
        'Web design',
        'Web development',
        'Website security',
        'Local SEO',
        'AI-assisted development',
      ],
      ...(IDENTITY.sameAs && IDENTITY.sameAs.length > 0 ? { sameAs: IDENTITY.sameAs } : {}),
    });

    // LevelStudio SoftwareApplication
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      '@id': 'https://levelup-ecosystem.com/#levelstudio',
      name: IDENTITY.studioName,
      url: 'https://levelup-ecosystem.com/preview/instant',
      applicationCategory: 'WebApplication',
      operatingSystem: 'All',
      description: "LevelStudio is LevelUp Ecosystem's instant creation and automated AI draft generator, allowing clients to test website concepts before human engineering.",
      creator: {
        '@id': 'https://levelup-ecosystem.com/#org',
      },
      isPartOf: {
        '@id': 'https://levelup-ecosystem.com/#org',
      },
    });

    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: IDENTITY.orgName,
      alternateName: [IDENTITY.studioName, 'LevelUp Ecosystem Web Design', 'LevelUp'],
      url: 'https://levelup-ecosystem.com',
      hasPart: [
        {
          '@type': 'WebPage',
          name: IDENTITY.studioName,
          url: 'https://levelup-ecosystem.com/preview/instant',
          description: "LevelStudio - Espace de création et prototype de site web instantané",
        },
        {
          '@type': 'WebPage',
          name: 'Services',
          url: 'https://levelup-ecosystem.com/services',
        },
        {
          '@type': 'WebPage',
          name: 'Pricing',
          url: 'https://levelup-ecosystem.com/pricing',
        },
        {
          '@type': 'WebPage',
          name: 'Projects',
          url: 'https://levelup-ecosystem.com/projects',
        },
        {
          '@type': 'WebPage',
          name: 'About',
          url: 'https://levelup-ecosystem.com/about',
        },
        {
          '@type': 'WebPage',
          name: IDENTITY.personName,
          url: 'https://levelup-ecosystem.com/about/richelieu-bonte',
        },
        {
          '@type': 'WebPage',
          name: 'Contact',
          url: 'https://levelup-ecosystem.com/contact',
        },
      ],
    });

    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Site Navigation Sitelinks',
      itemListElement: [
        {
          '@type': 'SiteNavigationElement',
          position: 1,
          name: 'Studio',
          description: 'LevelUp Studio - Espace de création et générateur de site IA',
          url: 'https://levelup-ecosystem.com/preview/instant'
        },
        {
          '@type': 'SiteNavigationElement',
          position: 2,
          name: 'Services',
          description: 'Web design, booking systems, and care plans',
          url: 'https://levelup-ecosystem.com/services'
        },
        {
          '@type': 'SiteNavigationElement',
          position: 3,
          name: 'Pricing',
          description: 'Transparent upfront web design pricing',
          url: 'https://levelup-ecosystem.com/pricing'
        },
        {
          '@type': 'SiteNavigationElement',
          position: 4,
          name: 'Projects',
          description: 'Selected client websites and case studies',
          url: 'https://levelup-ecosystem.com/projects'
        },
        {
          '@type': 'SiteNavigationElement',
          position: 5,
          name: 'Contact',
          description: 'Get in touch with LevelUp Ecosystem',
          url: 'https://levelup-ecosystem.com/contact'
        }
      ]
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
