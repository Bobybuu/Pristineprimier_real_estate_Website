export interface PropertyImage {
  id: number;
  image: string;
  caption: string;
  is_primary: boolean;
  order: number;
  property: number;
}

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface Property {
  id: number;
  title: string;
  description: string;
  property_type: 'land' | 'commercial' | 'rental' | 'apartment' | 'sale';
  status: 'draft' | 'pending' | 'published' | 'sold' | 'rented';
  address: string;
  city: string;
  state: string;
  zip_code: string;
  latitude: string | null;
  longitude: string | null;
  price: string;
  price_unit: string;
  bedrooms: number | null;
  bathrooms: number | null;
  square_feet: number | null;
  lot_size: string | null;
  year_built: number | null;
  has_garage: boolean;
  has_pool: boolean;
  has_garden: boolean;
  has_fireplace: boolean;
  has_central_air: boolean;
  seller: User;
  agent: User | null;
  images: PropertyImage[];
  primary_image?: PropertyImage;
  is_favorited: boolean;
  featured: boolean;
  views_count: number;
  created_at: string;
  published_at: string | null;
  seller_name?: string;
  updated_at?: string;
  images_count?: number;
}

export interface PropertyFilters {
  search?: string;
  city?: string;
  state?: string;
  min_price?: string;
  max_price?: string;
  property_type?: string;
  min_bedrooms?: string;
  min_bathrooms?: string;
  min_square_feet?: string;
  has_garage?: boolean;
  has_pool?: boolean;
  has_garden?: boolean;
}

export interface Favorite {
  id: number;
  property: Property;
  created_at: string;
}

export interface Inquiry {
  id: number;
  property: number;
  property_title: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  inquiry_type: 'general' | 'tour' | 'price';
  preferred_date: string | null;
  status: 'new' | 'contacted' | 'scheduled' | 'closed';
  created_at: string;
}

export interface SavedSearch {
  id: number;
  name: string;
  search_params: PropertyFilters;
  is_active: boolean;
  created_at: string;
}

export interface ApiResponse<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface PropertyFilters {
  search?: string;
  city?: string;
  state?: string;
  min_price?: string;
  max_price?: string;
  property_type?: string;
  min_bedrooms?: string;
  min_bathrooms?: string;
  min_square_feet?: string;
  has_garage?: boolean;
  has_pool?: boolean;
  has_garden?: boolean;
  featured?: boolean;
  status?: string;
}

// If you have a separate SearchFilters interface, make sure it's compatible
export interface SearchFilters extends PropertyFilters {
  // Add any additional search-specific filters here
}

export interface PropertyData {
  title: string;
  description: string;
  property_type: string;
  status: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  price: number | null;
  price_unit: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  square_feet?: number | null;
  lot_size?: number | null;
  year_built?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  has_garage: boolean;
  has_pool: boolean;
  has_garden: boolean;
  has_fireplace: boolean;
  has_central_air: boolean;
  featured: boolean;
}

