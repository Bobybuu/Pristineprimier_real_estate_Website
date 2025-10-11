import { useState } from 'react';
import { Search, MapPin, DollarSign, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PropertyFilters } from '@/types/property';

interface SearchBarProps {
  onSearch?: (filters: PropertyFilters) => void;
  variant?: 'hero' | 'inline';
}

const SearchBar = ({ onSearch, variant = 'hero' }: SearchBarProps) => {
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    state: '',
    min_price: '',
    max_price: '',
    property_type: '',
    min_bedrooms: '',
    min_bathrooms: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert frontend filters to backend PropertyFilters format
    const backendFilters: PropertyFilters = {
      search: filters.search,
      city: filters.city,
      state: filters.state,
      min_price: filters.min_price,
      max_price: filters.max_price,
      property_type: filters.property_type === 'all' ? '' : filters.property_type,
      min_bedrooms: filters.min_bedrooms === 'any' ? '' : filters.min_bedrooms,
      min_bathrooms: filters.min_bathrooms === 'any' ? '' : filters.min_bathrooms,
    };

    // Clean up empty values
    const cleanFilters = Object.fromEntries(
      Object.entries(backendFilters).filter(([_, value]) => value !== '')
    );

    onSearch?.(cleanFilters);
  };

  const updateFilter = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const isHero = variant === 'hero';

  return (
    <form
      onSubmit={handleSubmit}
      className={`${
        isHero
          ? 'bg-background/95 backdrop-blur-sm shadow-elegant rounded-lg p-6 max-w-5xl w-full'
          : 'bg-background border rounded-lg p-4'
      }`}
    >
      <div className={`grid gap-4 ${isHero ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4'}`}>
        {/* Search/Location */}
        <div className={isHero ? 'lg:col-span-2' : ''}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by title, description, or location..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>

        {/* City */}
        <div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="City"
              value={filters.city}
              onChange={(e) => updateFilter('city', e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>

        {/* Property Type */}
        <div>
          <Select value={filters.property_type} onValueChange={(value) => updateFilter('property_type', value)}>
            <SelectTrigger className="h-12">
              <Home className="h-5 w-5 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="land">Land</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="rental">Rental</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="sale">For Sale</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="number"
              placeholder="Min Price"
              value={filters.min_price}
              onChange={(e) => updateFilter('min_price', e.target.value)}
              className="pl-9 h-12"
            />
          </div>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="number"
              placeholder="Max Price"
              value={filters.max_price}
              onChange={(e) => updateFilter('max_price', e.target.value)}
              className="pl-9 h-12"
            />
          </div>
        </div>

        {/* Beds */}
        <div>
          <Select value={filters.min_bedrooms} onValueChange={(value) => updateFilter('min_bedrooms', value)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Beds" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Beds</SelectItem>
              <SelectItem value="1">1+ Beds</SelectItem>
              <SelectItem value="2">2+ Beds</SelectItem>
              <SelectItem value="3">3+ Beds</SelectItem>
              <SelectItem value="4">4+ Beds</SelectItem>
              <SelectItem value="5">5+ Beds</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Baths */}
        <div>
          <Select value={filters.min_bathrooms} onValueChange={(value) => updateFilter('min_bathrooms', value)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Baths" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Baths</SelectItem>
              <SelectItem value="1">1+ Baths</SelectItem>
              <SelectItem value="2">2+ Baths</SelectItem>
              <SelectItem value="3">3+ Baths</SelectItem>
              <SelectItem value="4">4+ Baths</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <Button
          type="submit"
          variant={isHero ? 'hero' : 'default'}
          size="lg"
          className={isHero ? 'lg:col-span-3 h-12' : 'h-12'}
        >
          <Search className="h-5 w-5 mr-2" />
          Search Properties
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;