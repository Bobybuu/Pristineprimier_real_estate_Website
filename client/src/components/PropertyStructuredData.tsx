import { useEffect } from 'react';
import { Property } from '@/types/property';

interface PropertyStructuredDataProps {
  property: Property;
}

const PropertyStructuredData: React.FC<PropertyStructuredDataProps> = ({ property }) => {
  
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
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    const baseUrl = 'https://www.pristineprimier.com/media/';
    return `${baseUrl}${imagePath}`;
  };

  return null;
};

export default PropertyStructuredData;