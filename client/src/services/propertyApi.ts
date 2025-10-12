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
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        credentials: 'include',  // Important for cookies/authentication
        ...options,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // No need for getCSRFToken method since we're using credentials: 'include'

  async createProperty(propertyData: PropertyData) {
    return this.request('/properties/create/', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
  }

  async uploadImages(propertyId: string, images: File[], captions: string[] = [], isPrimary: boolean[] = []) {
    const formData = new FormData();
    
    images.forEach((image, index) => {
      formData.append('images', image);
      formData.append(`image_captions[${index}]`, captions[index] || '');
      formData.append(`image_is_primary[${index}]`, (isPrimary[index] || index === 0).toString());
    });

    const response = await fetch(`${API_BASE_URL}/properties/${propertyId}/upload_images/`, {
      method: 'POST',
      credentials: 'include',  // Important for cookies/authentication
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Image upload failed: ${response.status}`);
    }

    return await response.json();
  }

  async getMyProperties() {
    return this.request('/properties/my_properties/');
  }

  async updateProperty(propertyId: string, propertyData: Partial<PropertyData>) {
    return this.request(`/properties/${propertyId}/`, {
      method: 'PATCH',
      body: JSON.stringify(propertyData),
    });
  }

  async deleteProperty(propertyId: string) {
    return this.request(`/properties/${propertyId}/`, {
      method: 'DELETE',
    });
  }
}

export const propertyApi = new PropertyApi();