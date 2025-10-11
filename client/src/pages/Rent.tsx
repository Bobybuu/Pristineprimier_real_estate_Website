import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import PropertyCard from '@/components/PropertyCard';
import { mockProperties } from '@/lib/mockData';
import type { Property } from '@/lib/mockData';

const Rent = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRentals();
  }, []);

  const loadRentals = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call - GET /api/properties?status=rent
      await new Promise((resolve) => setTimeout(resolve, 500));
      const rentals = mockProperties.filter((p) => p.status === 'rent');
      setProperties(rentals);
    } catch (error) {
      console.error('Failed to load rentals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (filters: any) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call with filters
      console.log('Search rentals with filters:', filters);
      await new Promise((resolve) => setTimeout(resolve, 500));
      const rentals = mockProperties.filter((p) => p.status === 'rent');
      setProperties(rentals);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-secondary py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-center mb-6">Rental Properties</h1>
            <p className="text-center text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Find your perfect rental home from our curated selection
            </p>
            <SearchBar variant="inline" onSearch={handleSearch} />
          </div>
        </section>

        {/* Rental Info Section */}
        <section className="py-12 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-semibold mb-4 text-center">Why Rent With Us?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal mb-2">500+</div>
                  <p className="text-muted-foreground">Available Rentals</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal mb-2">24/7</div>
                  <p className="text-muted-foreground">Maintenance Support</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal mb-2">98%</div>
                  <p className="text-muted-foreground">Tenant Satisfaction</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Properties Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">
                {loading ? 'Loading...' : `${properties.length} Rental Properties Available`}
              </h2>
            </div>

            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-4">Loading rental properties...</p>
              </div>
            )}

            {!loading && properties.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}

            {!loading && properties.length === 0 && (
              <div className="text-center py-12 bg-muted rounded-lg">
                <p className="text-muted-foreground text-lg">
                  No rental properties currently available. Check back soon!
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Rent;
