// components/SEOHead.tsx
import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  keywords?: string;
  structuredData?: object;
}

const SEOHead: React.FC<SEOHeadProps> = ({ 
  title = "PristinePrimier Real Estate Kenya | Property for Sale & Rent | Houses, Apartments & Land",
  description = "PristinePrimier Real Estate Kenya - Find your dream home, property for sale, houses for rent, land for sale, and commercial property in Nairobi, Karen, Westlands, Kilimani, and across Kenya.",
  image = "/web-app-manifest-512x512.png",
  url = "https://pristineprimier.com",
  keywords = "real estate Kenya, property for sale Kenya, houses for sale Nairobi",
  structuredData
}) => {
  
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags dynamically
    const updateMetaTag = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!tag) {
        tag = document.createElement('meta');
        tag.name = name;
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    const updatePropertyTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    // Update primary meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);

    // Update Open Graph tags
    updatePropertyTag('og:title', title);
    updatePropertyTag('og:description', description);
    updatePropertyTag('og:image', image);
    updatePropertyTag('og:url', url);
    updatePropertyTag('og:type', 'website');
    updatePropertyTag('og:site_name', 'PristinePrimier Real Estate Kenya');

    // Update Twitter tags
    updatePropertyTag('twitter:card', 'summary_large_image');
    updatePropertyTag('twitter:title', title);
    updatePropertyTag('twitter:description', description);
    updatePropertyTag('twitter:image', image);

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;

  }, [title, description, image, url, keywords]);

  // For structured data, we'll add it to the body
  useEffect(() => {
    if (structuredData) {
      // Remove existing structured data script
      const existingScript = document.getElementById('structured-data');
      if (existingScript) {
        existingScript.remove();
      }

      // Add new structured data script
      const script = document.createElement('script');
      script.id = 'structured-data';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(structuredData);
      document.body.appendChild(script);
    }
  }, [structuredData]);

  return null; 
};

export default SEOHead;