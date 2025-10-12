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
          ? 'bg-white/95 backdrop-blur-sm shadow-lg rounded-xl p-4 max-w-4xl w-full border border-[#577A26]/20'
          : 'bg-white border border-[#577A26]/20 rounded-lg p-3'
      }`}
    >
      <div className={`grid gap-3 ${isHero ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4'}`}>
        {/* Search/Location */}
        <div className={isHero ? 'lg:col-span-2' : ''}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#577A26]" />
            <Input
              type="text"
              placeholder="Search by title, description, or location..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="pl-10 h-11 text-sm border-[#577A26]/30 focus:border-[#577A26] focus:ring-[#577A26]/20"
            />
          </div>
        </div>

        {/* City */}
        <div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#577A26]" />
            <Input
              type="text"
              placeholder="City"
              value={filters.city}
              onChange={(e) => updateFilter('city', e.target.value)}
              className="pl-10 h-11 text-sm border-[#577A26]/30 focus:border-[#577A26] focus:ring-[#577A26]/20"
            />
          </div>
        </div>

        {/* Property Type */}
        <div>
          <Select value={filters.property_type} onValueChange={(value) => updateFilter('property_type', value)}>
            <SelectTrigger className="h-11 text-sm border-[#577A26]/30 focus:border-[#577A26] focus:ring-[#577A26]/20">
              <Home className="h-4 w-4 mr-2 text-[#577A26]" />
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
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-[#577A26]" />
            <Input
              type="number"
              placeholder="Min Price"
              value={filters.min_price}
              onChange={(e) => updateFilter('min_price', e.target.value)}
              className="pl-8 h-11 text-sm border-[#577A26]/30 focus:border-[#577A26] focus:ring-[#577A26]/20"
            />
          </div>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-[#577A26]" />
            <Input
              type="number"
              placeholder="Max Price"
              value={filters.max_price}
              onChange={(e) => updateFilter('max_price', e.target.value)}
              className="pl-8 h-11 text-sm border-[#577A26]/30 focus:border-[#577A26] focus:ring-[#577A26]/20"
            />
          </div>
        </div>

        {/* State */}
        <div>
          <Input
            type="text"
            placeholder="State"
            value={filters.state}
            onChange={(e) => updateFilter('state', e.target.value)}
            className="h-11 text-sm border-[#577A26]/30 focus:border-[#577A26] focus:ring-[#577A26]/20"
          />
        </div>

        {/* Search Button */}
        <Button
          type="submit"
          className={`h-11 text-sm font-medium bg-[#577A26] hover:bg-[#577A26]/90 text-white border border-[#577A26] ${
            isHero ? 'lg:col-span-3' : ''
          }`}
        >
          <Search className="h-4 w-4 mr-2" />
          Search Properties
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;