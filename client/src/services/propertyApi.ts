// services/propertyApi.ts

// Environment-based configuration
const getApiBaseUrl = (): string => {
  const isProduction = import.meta.env.MODE === 'production';

  if (isProduction) {
    return import.meta.env.VITE_API_URL || 'https://api.pristineprimier.com/api';
  }
  return import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
};

const getMediaBaseUrl = (): string => {
  const isProduction = import.meta.env.MODE === 'production';

  if (isProduction) {
    return import.meta.env.VITE_MEDIA_URL || 'https://api.pristineprimier.com';
  }
  return import.meta.env.VITE_MEDIA_URL || 'http://localhost:8000';
};

const API_BASE_URL = getApiBaseUrl();
export const MEDIA_BASE_URL = getMediaBaseUrl();

// Placeholder image as data URL to avoid 404
export const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5YzljOWMiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';

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

class PropertyApi {
  // Helper function to handle API responses with comprehensive error handling
  private async handleResponse(response: Response) {
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.detail || errorMessage;
      } catch {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }
    
    // For 204 No Content responses
    if (response.status === 204) {
      return {};
    }
    
    try {
      return await response.json();
    } catch {
      return { message: 'Success' };
    }
  }

  // Get CSRF token from cookie with fallback
  private getCSRFToken(): string {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];
    
    console.log('CSRF Token found:', cookieValue ? 'Yes' : 'No');
    return cookieValue || '';
  }

  // Generic API request function with better error handling
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const csrfToken = this.getCSRFToken();
    
    console.log(`Making API request to: ${url}`);
    console.log('CSRF Token available:', !!csrfToken);
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(csrfToken && { 'X-CSRFToken': csrfToken }),
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    };

    try {
      const response = await fetch(url, config);
      return await this.handleResponse(response);
    } catch (error) {
      console.error(`API Request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Image URL helper function - handles double media issue
  getImageUrl(imagePath: string): string {
    if (!imagePath) {
      return PLACEHOLDER_IMAGE;
    }
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Remove leading slash
    let cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    
    // Handle the double media prefix issue
    // If path already starts with 'media/', remove it to avoid duplication
    if (cleanPath.startsWith('media/')) {
      // Remove the 'media/' prefix since we'll add it back
      cleanPath = cleanPath.replace(/^media\//, '');
    }
    
    // Construct the final URL with single media prefix
    return `${MEDIA_BASE_URL}/media/${cleanPath}`;
  }

  async createProperty(propertyData: PropertyData) {
    console.log('Creating property with data:', propertyData);
    
    // Try multiple endpoints - your Django setup might use different patterns
    const endpoints = [
      '/properties/',  // Standard DRF ViewSet endpoint
      '/properties/create/',  // Custom endpoint
      '/create/',  // Simple endpoint
    ];

    for (const endpoint of endpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`);
        const result = await this.request(endpoint, {
          method: 'POST',
          body: JSON.stringify(propertyData),
        });
        console.log(`Success with endpoint: ${endpoint}`);
        return result;
      } catch (error: any) {
        console.log(`Endpoint ${endpoint} failed:`, error.message);
        // Continue to next endpoint
        continue;
      }
    }
    
    throw new Error('All property creation endpoints failed. Please check your Django URLs configuration.');
  }

  async getProperties(filters?: any) {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(v => queryParams.append(key, v.toString()));
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });
    }
    
    const endpoint = queryParams.toString() 
      ? `/properties/?${queryParams.toString()}`
      : '/properties/';
      
    return this.request(endpoint);
  }

  async getFeaturedProperties() {
    return this.request('/properties/?featured=true&limit=6');
  }

  async getPropertyById(id: string) {
    return this.request(`/properties/${id}/`);
  }

  async updateProperty(id: string, propertyData: Partial<PropertyData>) {
    return this.request(`/properties/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(propertyData),
    });
  }

  async deleteProperty(id: string) {
    return this.request(`/properties/${id}/`, {
      method: 'DELETE',
    });
  }

  async getMyProperties() {
    return this.request('/properties/my_properties/');
  }

  async toggleFavorite(propertyId: string) {
    return this.request(`/properties/${propertyId}/favorite/`, {
      method: 'POST',
    });
  }

  async getFavorites() {
    return this.request('/properties/my_favorites/');
  }

  async uploadImages(propertyId: string, images: File[], captions: string[] = [], isPrimary: boolean[] = []) {
    console.log(`Uploading ${images.length} images for property ${propertyId}`);
    
    const formData = new FormData();
    const csrfToken = this.getCSRFToken();
    
    images.forEach((image, index) => {
      formData.append('images', image);
      formData.append(`image_captions[${index}]`, captions[index] || '');
      formData.append(`image_is_primary[${index}]`, (isPrimary[index] || index === 0).toString());
    });

    const headers: HeadersInit = {};
    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/properties/${propertyId}/upload_images/`, {
        method: 'POST',
        credentials: 'include',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Image upload failed: ${response.status}, ${errorText}`);
      }

      const result = await response.json();
      console.log('Image upload successful:', result);
      return result;
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  }

  // Test method to check available endpoints
  async testEndpoints() {
    console.log('Testing available endpoints...');
    
    const endpoints = [
      '/properties/',
      '/properties/create/',
      '/create/',
      '/properties/my_properties/',
      '/properties/my_favorites/',
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'OPTIONS',
          credentials: 'include',
        });
        console.log(`Endpoint ${endpoint}: ${response.status} - ${response.statusText}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`Allowed methods for ${endpoint}:`, data);
        }
      } catch (error) {
        console.log(`Endpoint ${endpoint} test failed:`, error);
      }
    }
  }
}

export const propertyApi = new PropertyApi();