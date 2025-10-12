// services/propertyApi.ts
const API_BASE_URL = 'https://api.pristineprimier.com/api';

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
  private getCSRFToken(): string {
    // Get CSRF token from cookie
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];
    
    console.log('CSRF Token found:', cookieValue ? 'Yes' : 'No');
    return cookieValue || '';
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const csrfToken = this.getCSRFToken();
    
    console.log(`Making API request to: ${url}`);
    console.log('CSRF Token available:', !!csrfToken);
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add CSRF token if available
    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken;
    }

    try {
      const response = await fetch(url, {
        headers,
        credentials: 'include',
        ...options,
      });
      
      console.log(`Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log(`Error response: ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('API response:', data);
      return data;
      
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
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

  async getMyProperties() {
    return this.request('/properties/my_properties/');
  }

  // Test method to check available endpoints
  async testEndpoints() {
    console.log('Testing available endpoints...');
    
    const endpoints = [
      '/properties/',
      '/properties/create/',
      '/create/',
      '/properties/my_properties/',
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