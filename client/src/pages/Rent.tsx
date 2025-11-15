import { useState,useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import PropertyCard from '@/components/PropertyCard';
import { useRentalProperties } from '@/hooks/useRentalProperties';
import { PropertyFilters } from '@/types/property';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Link } from '@radix-ui/react-navigation-menu';

const Rent = () => {
  const [filters, setFilters] = useState<PropertyFilters>({});
  const { rentalProperties, loading, error, refetch } = useRentalProperties(filters);

  const handleSearch = (searchFilters: PropertyFilters) => {
    setFilters(searchFilters);
  };
useEffect(() => {
  // Canonical URL
  const canonicalUrl = `https://www.pristineprimier.com/rent`;
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', canonicalUrl);

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.pristineprimier.com/"
      },
      {
        "@type": "ListItem", 
        "position": 2,
        "name": "Properties for Rent in Kenya",
        "item": "https://www.pristineprimier.com/rent"
      }
    ]
  };

  // Remove existing schema if any
  const existingSchema = document.querySelector('script[type="application/ld+json"]');
  if (existingSchema) {
    existingSchema.remove();
  }

  // Add new schema
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(breadcrumbSchema);
  document.head.appendChild(script);
}, []);
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-secondary py-1">
          <div className="container mx-auto px-4">
            <h1 className="text-center mb-2 font-light text-3xl tracking-tight">Rental Properties</h1>
            <p className="text-center text-muted-foreground  mb-4 max-w-2xl mx-auto">
              Find your perfect rental property from our curated selection
            </p>
            <SearchBar variant="inline" onSearch={handleSearch} />
          </div>
        </section>

        {/* ... rest of the component remains the same, just replace properties with rentalProperties ... */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">
                {loading ? 'Loading...' : `${rentalProperties.length} Rental Properties Available`}
              </h2>
            </div>

            {loading && (
              <div className="text-center py-12">
                <LoadingSpinner size="lg" />
                <p className="text-muted-foreground mt-4">Loading rental properties...</p>
              </div>
            )}

            {!loading && rentalProperties.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rentalProperties.map((property) => (
                  <PropertyCard 
                    key={property.id} 
                    property={property} 
                    linkTo={`/property/${property.seo_slug || property.id}`}
                  />
                ))}
              </div>
            )}

            {!loading && rentalProperties.length === 0 && (
              <div className="text-center py-12 bg-muted rounded-lg">
                <p className="text-muted-foreground text-lg">
                  No rental properties currently available. Check back soon!
                </p>
              </div>
            )}
          </div>
          {/* Related Properties Section */}
{!loading && rentalProperties.length > 0 && (
  <div className="mt-12 bg-gray-50 rounded-xl p-6 border">
    <h3 className="text-xl font-semibold mb-4">Interested in Buying?</h3>
    <p className="text-gray-600 mb-4">
      Check out properties available for purchase in your preferred locations.
    </p>
    <div className="flex flex-wrap gap-3">
      <a
        href="/buy" 
        className="bg-white px-4 py-2 rounded-lg border hover:bg-green-50 hover:border-green-200 transition-colors text-green-600 font-medium"
      >
        Houses for Sale in Nairobi
      </a>
      <a
        href="/buy?property_type=land" 
        className="bg-white px-4 py-2 rounded-lg border hover:bg-green-50 hover:border-green-200 transition-colors text-green-600 font-medium"
      >
        Land for Sale in Kenya
      </a>
      <a 
        href="/services" 
        className="bg-white px-4 py-2 rounded-lg border hover:bg-green-50 hover:border-green-200 transition-colors text-green-600 font-medium"
      >
        Commercial Properties
      </a>
    </div>
  </div>
)}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Rent;