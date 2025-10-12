// services/propertyApi.ts

// Environment-based configuration
import { Property, PropertyData, PropertyImage } from '@/types/property';

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

// EXACT SAME Image URL helper function - FIXED to handle double media issue
export const getImageUrl = (imagePath: string): string => {
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
};

// EXACT SAME Placeholder image as data URL to avoid 404
export const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5YzljOWMiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';



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
    
    return cookieValue || '';
  }

  // Generic API request function with better error handling
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const csrfToken = this.getCSRFToken();
    
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

  // Get primary image URL for a property - uses the EXACT SAME getImageUrl function
 // FIXED: Get primary image URL for a property
  getPrimaryImageUrl(property: Property): string {
    console.log('🔍 Getting primary image for property:', {
      id: property.id,
      title: property.title,
      primary_image: property.primary_image,
      images: property.images,
    });

    // Try primary_image field first - handle both string and PropertyImage types
    if (property.primary_image) {
      if (typeof property.primary_image === 'string') {
        console.log('📸 Using primary_image as string:', property.primary_image);
        return getImageUrl(property.primary_image);
      } else if (property.primary_image && typeof property.primary_image === 'object' && 'image' in property.primary_image) {
        console.log('📸 Using primary_image.image:', property.primary_image.image);
        return getImageUrl(property.primary_image.image);
      }
    }

    // Try images array - find primary image
    if (property.images && property.images.length > 0) {
      const primaryImage = property.images.find(img => img.is_primary) || property.images[0];
      console.log('🖼️ Using images array - primary image:', primaryImage);
      // FIX: Pass primaryImage.image (string) instead of primaryImage (object)
      return getImageUrl(primaryImage.image);
    }

    // No images available
    console.log('❌ No images found for property:', property.id);
    return PLACEHOLDER_IMAGE;
  }
  // Property CRUD operations
  async createProperty(propertyData: PropertyData): Promise<Property> {
    console.log('Creating property with data:', propertyData);
    
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
        continue;
      }
    }
    
    throw new Error('All property creation endpoints failed.');
  }

  async getProperties(filters?: any): Promise<{ results: Property[] }> {
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

  async getFeaturedProperties(): Promise<{ results: Property[] }> {
    return this.request('/properties/?featured=true&limit=6');
  }

  async getPropertyById(id: string): Promise<Property> {
    return this.request(`/properties/${id}/`);
  }

  async updateProperty(id: string, propertyData: Partial<PropertyData>): Promise<Property> {
    return this.request(`/properties/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(propertyData),
    });
  }

  async deleteProperty(id: string): Promise<void> {
    return this.request(`/properties/${id}/`, {
      method: 'DELETE',
    });
  }

  async getMyProperties(): Promise<Property[]> {
    return this.request('/properties/my_properties/');
  }

  async toggleFavorite(propertyId: string): Promise<{status: string}> {
    return this.request(`/properties/${propertyId}/favorite/`, {
      method: 'POST',
    });
  }

  async getFavorites(): Promise<Property[]> {
    return this.request('/properties/my_favorites/');
  }

  // IMAGE-SPECIFIC ENDPOINTS
  async getPropertyImages(propertyId: string): Promise<PropertyImage[]> {
    return this.request(`/properties/${propertyId}/images/`);
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

  async setPrimaryImage(propertyId: string, imageId: string): Promise<void> {
    return this.request(`/properties/${propertyId}/images/${imageId}/set_primary/`, {
      method: 'POST',
    });
  }

  async deleteImage(propertyId: string, imageId: string): Promise<void> {
    return this.request(`/properties/${propertyId}/images/${imageId}/`, {
      method: 'DELETE',
    });
  }

  async updateImageCaption(propertyId: string, imageId: string, caption: string): Promise<PropertyImage> {
    return this.request(`/properties/${propertyId}/images/${imageId}/`, {
      method: 'PATCH',
      body: JSON.stringify({ caption }),
    });
  }

  // Enhanced property fetching with images
  async getPropertyWithImages(id: string): Promise<Property> {
    try {
      // First get the property
      const property = await this.getPropertyById(id);
      
      // Then try to get images if they're not included
      if (!property.images || property.images.length === 0) {
        try {
          const images = await this.getPropertyImages(id);
          property.images = images;
        } catch (error) {
          console.warn('Could not fetch additional images for property:', id);
        }
      }
      
      return property;
    } catch (error) {
      console.error('Error fetching property with images:', error);
      throw error;
    }
  }
}

export const propertyApi = new PropertyApi();