// services/api.ts
import { Property, PropertyFilters, Favorite, Inquiry, SavedSearch, PaginatedResponse } from '@/types/property';

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

// Helper function to handle API responses
async function handleResponse(response: Response) {
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

// Get CSRF token from cookie
function getCsrfTokenFromCookie(): string | null {
  const name = 'csrftoken';
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${name}=`))
    ?.split('=')[1];
  return cookieValue || null;
}

// Get CSRF token with better error handling
export async function getCsrfToken(): Promise<string> {
  // Try to get from cookie first
  const cookieToken = getCsrfTokenFromCookie();
  if (cookieToken) {
    return cookieToken;
  }

  // If no cookie token, try to fetch from API
  try {
    const response = await fetch(`${API_BASE_URL}/auth/csrf/`, {
      credentials: 'include',
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.csrfToken;
    }
  } catch (error) {
    console.warn('Failed to get CSRF token from API, using empty token:', error);
  }
  
  // Return empty string as fallback (some endpoints might work without CSRF)
  return '';
}

// Generic API request function with better error handling
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const csrfToken = await getCsrfToken();
  
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
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    return await handleResponse(response);
  } catch (error) {
    console.error(`API Request failed for ${endpoint}:`, error);
    throw error;
  }
}

// Image URL helper function - FIXED to handle double media issue
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

// Placeholder image as data URL to avoid 404
export const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5YzljOWMiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';

// Auth API functions
export const authAPI = {
  async login(credentials: { username: string; password: string }) {
    return apiRequest('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  async register(userData: {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    user_type: string;
    phone_number: string;
  }) {
    return apiRequest('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async logout() {
    return apiRequest('/auth/logout/', {
      method: 'POST',
    });
  },

  async getCurrentUser() {
    return apiRequest('/auth/me/');
  },

  async submitSellerApplication(applicationData: any) {
    return apiRequest('/auth/seller/apply/', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  },
};

// Properties API
export const propertiesAPI = {
  async getAll(filters: PropertyFilters = {}): Promise<PaginatedResponse<Property>> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v.toString()));
        } else {
          params.append(key, value.toString());
        }
      }
    });
    
    return apiRequest(`/properties/?${params.toString()}`);
  },

  async getFeatured(): Promise<PaginatedResponse<Property>> {
    return apiRequest('/properties/?featured=true&limit=6');
  },

  async getById(id: number): Promise<Property> {
    return apiRequest(`/properties/${id}/`);
  },

  async create(propertyData: Partial<Property>): Promise<Property> {
    return apiRequest('/properties/', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
  },

  async update(id: number, propertyData: Partial<Property>): Promise<Property> {
    return apiRequest(`/properties/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(propertyData),
    });
  },

  async delete(id: number): Promise<void> {
    return apiRequest(`/properties/${id}/`, {
      method: 'DELETE',
    });
  },

  async toggleFavorite(propertyId: number): Promise<{status: string}> {
    return apiRequest(`/properties/${propertyId}/favorite/`, {
      method: 'POST',
    });
  },

  async getFavorites(): Promise<Favorite[]> {
    return apiRequest('/properties/favorites/');
  },

  async getMyProperties(): Promise<Property[]> {
    return apiRequest('/properties/my-properties/');
  },
};

// Inquiries API
export const inquiriesAPI = {
  async create(inquiryData: Omit<Inquiry, 'id' | 'created_at' | 'property_title'>): Promise<Inquiry> {
    return apiRequest('/inquiries/', {
      method: 'POST',
      body: JSON.stringify(inquiryData),
    });
  },

  async getAll(): Promise<Inquiry[]> {
    return apiRequest('/inquiries/');
  },

  async getById(id: number): Promise<Inquiry> {
    return apiRequest(`/inquiries/${id}/`);
  },
};

// Saved Searches API
export const savedSearchesAPI = {
  async create(searchData: Omit<SavedSearch, 'id' | 'created_at'>): Promise<SavedSearch> {
    return apiRequest('/saved-searches/', {
      method: 'POST',
      body: JSON.stringify(searchData),
    });
  },

  async getAll(): Promise<SavedSearch[]> {
    return apiRequest('/saved-searches/');
  },

  async update(id: number, searchData: Partial<SavedSearch>): Promise<SavedSearch> {
    return apiRequest(`/saved-searches/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(searchData),
    });
  },

  async delete(id: number): Promise<void> {
    return apiRequest(`/saved-searches/${id}/`, {
      method: 'DELETE',
    });
  },
};