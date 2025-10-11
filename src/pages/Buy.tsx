import { useState, useEffect } from 'react';
import { Grid, List, Map } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import PropertyCard from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { mockProperties } from '@/lib/mockData';
import type { Property } from '@/lib/mockData';

const Buy = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // TODO: Replace with actual API call - GET /api/properties
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setLoading(true);
    try {
      // TODO: await propertyApi.search(filters);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
      setProperties(mockProperties);
    } catch (error) {
      console.error('Failed to load properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (filters: any) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call with filters
      // const results = await propertyApi.search(filters);
      console.log('Search with filters:', filters);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setProperties(mockProperties);
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
        {/* Page Header with Search */}
        <section className="bg-secondary py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-center mb-6">Buy a House</h1>
            <p className="text-center text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Discover your perfect property from our extensive listings
            </p>
            <SearchBar variant="inline" onSearch={handleSearch} />
          </div>
        </section>

        {/* Results Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar */}
              <aside className="lg:w-64 flex-shrink-0">
                <div className="bg-card border rounded-lg p-6 sticky top-20">
                  <h3 className="font-semibold mb-4">Advanced Filters</h3>
                  {/* TODO: Add advanced filter components */}
                  <p className="text-sm text-muted-foreground">
                    Additional filters will be added here for property features, amenities, and more.
                  </p>
                </div>
              </aside>

              {/* Main Content */}
              <div className="flex-1">
                {/* View Controls */}
                <div className="flex items-center justify-between mb-6">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{properties.length}</span> properties found
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Map Integration Placeholder */}
                <div id="property-map" className="bg-muted rounded-lg h-64 mb-6 flex items-center justify-center border">
                  <div className="text-center">
                    <Map className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Map integration will be added here
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      MapBox API Key required
                    </p>
                  </div>
                </div>

                {/* Loading State */}
                {loading && (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground mt-4">Loading properties...</p>
                  </div>
                )}

                {/* Property Grid/List */}
                {!loading && properties.length > 0 && (
                  <div
                    className={
                      viewMode === 'grid'
                        ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                        : 'flex flex-col gap-6'
                    }
                  >
                    {properties.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>
                )}

                {/* No Results */}
                {!loading && properties.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No properties found. Try adjusting your filters.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Buy;
