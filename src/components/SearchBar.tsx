import { useState } from 'react';
import { Search, MapPin, DollarSign, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SearchBarProps {
  onSearch?: (filters: SearchFilters) => void;
  variant?: 'hero' | 'inline';
}

export interface SearchFilters {
  location: string;
  minPrice: string;
  maxPrice: string;
  propertyType: string;
  beds: string;
  baths: string;
}

const SearchBar = ({ onSearch, variant = 'hero' }: SearchBarProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    minPrice: '',
    maxPrice: '',
    propertyType: 'all',
    beds: 'any',
    baths: 'any',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(filters);
  };

  const updateFilter = (key: keyof SearchFilters, value: string) => {
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
        {/* Location */}
        <div className={isHero ? 'lg:col-span-2' : ''}>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="City, State, or ZIP"
              value={filters.location}
              onChange={(e) => updateFilter('location', e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>

        {/* Property Type */}
        <div>
          <Select value={filters.propertyType} onValueChange={(value) => updateFilter('propertyType', value)}>
            <SelectTrigger className="h-12">
              <Home className="h-5 w-5 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="condo">Condo</SelectItem>
              <SelectItem value="townhouse">Townhouse</SelectItem>
              <SelectItem value="land">Land</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={(e) => updateFilter('minPrice', e.target.value)}
              className="pl-9 h-12"
            />
          </div>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={(e) => updateFilter('maxPrice', e.target.value)}
              className="pl-9 h-12"
            />
          </div>
        </div>

        {/* Beds */}
        <div>
          <Select value={filters.beds} onValueChange={(value) => updateFilter('beds', value)}>
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
          <Select value={filters.baths} onValueChange={(value) => updateFilter('baths', value)}>
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
