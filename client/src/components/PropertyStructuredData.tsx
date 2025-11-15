import { useEffect } from 'react';
import { Property } from '@/types/property';

interface PropertyStructuredDataProps {
  property: Property;
}

const PropertyStructuredData: React.FC<PropertyStructuredDataProps> = ({ property }) => {
  
  // 🔍 DEBUG: Verify execution and property data
  useEffect(() => {
    if (!property) return;
    
    console.log('🔍 PropertyStructuredData RUNNING with:', {
      hasImages: property.images?.length > 0,
      imageCount: property.images?.length,
      primaryImage: property.primary_image?.image,
      title: property.title
    });
  }, [property]);

  useEffect(() => {
    if (!property) return;

    // Generate structured data based on property type
    const structuredData = {
      "@context": "https://schema.org",
      "@type": getSchemaType(property.property_type),
      "name": property.title,
      "description": property.short_description || property.description.slice(0, 200),
      "url": property.canonical_url || window.location.href,
      "image": property.images?.map(img => getImageUrl(img.image, 'large')) || [],
      "address": {
        "@type": "PostalAddress",
        "streetAddress": property.address,
        "addressLocality": property.city,
        "addressRegion": property.state,
        "postalCode": property.zip_code,
        "addressCountry": "KE"
      },
      ...(property.latitude && property.longitude && {
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": property.latitude,
          "longitude": property.longitude
        }
      }),
      ...getPropertySpecificData(property)
    };

    // Remove existing structured data
    const existingScript = document.getElementById('property-structured-data');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.id = 'property-structured-data';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.body.appendChild(script);

    return () => {
      // Cleanup on unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [property]);

  const getSchemaType = (propertyType: Property['property_type']): string => {
    switch (propertyType) {
      case 'land':
        return 'Landform';
      case 'apartment':
        return 'Apartment';
      case 'commercial':
        return 'CommercialProperty';
      case 'rental':
        return 'RentalProperty';
      case 'sale':
        return 'SingleFamilyResidence';
      default:
        return 'Product';
    }
  };

  const getPropertySpecificData = (property: Property) => {
    // FIXED: Use actual status values from your Property interface
    const isAvailable = property.status === 'published' || property.status === 'pending';
    
    const baseData: any = {
      "offers": {
        "@type": "Offer",
        "price": parseFloat(property.price),
        "priceCurrency": "KES",
        "availability": isAvailable ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        "url": property.canonical_url || window.location.href
      }
    };

    // ✅ ADDED: Update OG Image tags when property has images
    if (property.images && property.images.length > 0) {
      const primaryImage = property.primary_image || property.images[0];
      const imageUrl = getImageUrl(primaryImage.image, 'large');
      
      // Add to structured data
      baseData.image = imageUrl;
      
      // Update OG image tag in real-time with delay to ensure DOM is ready
      setTimeout(() => {
        const ogImage = document.querySelector('meta[property="og:image"]');
        const twitterImage = document.querySelector('meta[name="twitter:image"]');
        
        if (ogImage) {
          ogImage.setAttribute('content', imageUrl);
          console.log('🖼️ Updated OG Image to:', imageUrl);
        }
        if (twitterImage) {
          twitterImage.setAttribute('content', imageUrl);
          console.log('🖼️ Updated Twitter Image to:', imageUrl);
        }
        
        // Verify the update worked
        const updatedOG = document.querySelector('meta[property="og:image"]')?.content;
        console.log('✅ OG Image Update Verified:', updatedOG === imageUrl ? 'SUCCESS' : 'FAILED');
      }, 100);
    } else {
      console.log('🖼️ No property images available for OG update');
    }

    // Add property-specific details
    if (property.property_type !== 'land') {
      if (property.bedrooms) baseData.numberOfRooms = property.bedrooms;
      if (property.bathrooms) baseData.numberOfBathroomsTotal = property.bathrooms;
      if (property.square_feet) {
        baseData.floorSize = {
          "@type": "QuantitativeValue",
          "value": property.square_feet,
          "unitCode": "FTK"
        };
      }
    }

    if (property.property_type === 'land' && property.size_acres) {
      baseData.additionalProperty = {
        "@type": "PropertyValue",
        "name": "landSize",
        "value": `${property.size_acres} acres`,
        "unitCode": "ACR"
      };
    }

    if (property.year_built) {
      baseData.yearBuilt = property.year_built;
    }

    return baseData;
  };

  const getImageUrl = (imagePath: string, size: 'large' | 'medium' | 'small' = 'large'): string => {
    if (!imagePath) {
      console.log('🖼️ No image path provided');
      return '';
    }
    
    if (imagePath.startsWith('http')) {
      console.log('🖼️ Using full URL:', imagePath);
      return imagePath;
    }
    
    const baseUrl = 'https://www.pristineprimier.com/media/';
    const fullUrl = `${baseUrl}${imagePath}`;
    console.log('🖼️ Generated media URL:', fullUrl);
    return fullUrl;
  };

  return null;
};

export default PropertyStructuredData;