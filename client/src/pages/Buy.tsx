import { useState, useEffect } from 'react';
import { Grid, List, Map } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import PropertyCard from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useProperties } from '@/hooks/useProperties';
import { PropertyFilters } from '@/types/property';
import LoadingSpinner from '@/components/LoadingSpinner';

// Remove the local Property interface and use the one from '@/types/property'

interface SearchFilters {
  property_type?: string;
  min_price?: string;
  max_price?: string;
  bedrooms?: string;
  city?: string;
  state?: string;
  search?: string;
}

const Buy = () => {
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Use the custom hook instead of local state management
  const { properties, loading, error } = useProperties(filters);

  const handleSearch = (searchFilters: PropertyFilters) => {
    setFilters(searchFilters);
  };

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error('Failed to load properties. Please try again.');
    }
  }, [error]);

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
                  <div className="space-y-4">
                    {/* Property Type Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Property Type</label>
                      <select 
                        className="w-full p-2 border rounded-md text-sm"
                        value={filters.property_type || ''}
                        onChange={(e) => handleSearch({ ...filters, property_type: e.target.value })}
                      >
                        <option value="">All Types</option>
                        <option value="apartment">Apartment</option>
                        <option value="land">Land</option>
                        <option value="commercial">Commercial</option>
                        <option value="rental">Rental</option>
                        <option value="sale">For Sale</option>
                      </select>
                    </div>

                    {/* Price Range Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Price Range</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          className="w-full p-2 border rounded-md text-sm"
                          value={filters.min_price || ''}
                          onChange={(e) => handleSearch({ ...filters, min_price: e.target.value })}
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          className="w-full p-2 border rounded-md text-sm"
                          value={filters.max_price || ''}
                          onChange={(e) => handleSearch({ ...filters, max_price: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Bedrooms Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Bedrooms</label>
                      <select 
                        className="w-full p-2 border rounded-md text-sm"
                        value={filters.min_bedrooms || ''}
                        onChange={(e) => handleSearch({ ...filters, min_bedrooms: e.target.value })}
                      >
                        <option value="">Any</option>
                        <option value="1">1+</option>
                        <option value="2">2+</option>
                        <option value="3">3+</option>
                        <option value="4">4+</option>
                        <option value="5">5+</option>
                      </select>
                    </div>

                    {/* Location Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">City</label>
                      <input
                        type="text"
                        placeholder="Enter city"
                        className="w-full p-2 border rounded-md text-sm"
                        value={filters.city || ''}
                        onChange={(e) => handleSearch({ ...filters, city: e.target.value })}
                      />
                    </div>

                    {/* Clear Filters */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setFilters({})}
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </aside>

              {/* Main Content */}
              <div className="flex-1">
                {/* View Controls */}
                <div className="flex items-center justify-between mb-6">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{properties.length}</span> properties found
                    {Object.keys(filters).length > 0 && (
                      <span className="ml-2">(with filters applied)</span>
                    )}
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

                {/* Error State */}
                {error && (
                  <div className="text-center py-12 bg-destructive/10 rounded-lg">
                    <p className="text-destructive text-lg mb-4">Failed to load properties</p>
                    <Button 
                      onClick={() => window.location.reload()}
                      variant="outline"
                    >
                      Try Again
                    </Button>
                  </div>
                )}

                {/* Loading State */}
                {loading && (
                  <div className="text-center py-12">
                    <LoadingSpinner size="lg" />
                    <p className="text-muted-foreground mt-4">Loading properties...</p>
                  </div>
                )}

                {/* Property Grid/List */}
                {!loading && !error && properties.length > 0 && (
                  <div
                    className={
                      viewMode === 'grid'
                        ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                        : 'flex flex-col gap-6'
                    }
                  >
                    {properties.map((property) => (
                      <PropertyCard 
                        key={property.id} 
                        property={property}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                )}

                {/* No Results */}
                {!loading && !error && properties.length === 0 && (
                  <div className="text-center py-12">
                    <div className="max-w-md mx-auto">
                      <Map className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">No properties found</h3>
                      <p className="text-muted-foreground mb-4">
                        {Object.keys(filters).length > 0 
                          ? 'Try adjusting your search filters to see more results.'
                          : 'No properties are currently available. Check back later!'
                        }
                      </p>
                      {Object.keys(filters).length > 0 && (
                        <Button
                          variant="outline"
                          onClick={() => setFilters({})}
                        >
                          Clear All Filters
                        </Button>
                      )}
                    </div>
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