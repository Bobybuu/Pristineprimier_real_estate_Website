// services/api.ts - FIXED VERSION
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

// Enhanced API request function with better auth handling
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  // Ensure endpoint starts with slash
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${formattedEndpoint}`;
  
  const csrfToken = await getCsrfToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(csrfToken && { 'X-CSRFToken': csrfToken }),
      ...options.headers,
    },
    credentials: 'include', // This is crucial for session authentication
    ...options,
  };

  try {
    console.log(`🔄 API Request: ${url}`, config);
    const response = await fetch(url, config);
    
    if (response.status === 403 || response.status === 401) {
      // Clear any invalid auth state
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token');
      throw new Error('Authentication required. Please log in again.');
    }
    
    return await handleResponse(response);
  } catch (error) {
    console.error(`❌ API Request failed for ${url}:`, error);
    throw error;
  }
}

// Helper function to handle API responses
async function handleResponse(response: Response) {
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.detail || errorData.error || errorMessage;
      
      // Handle specific Django REST framework error formats
      if (errorData.detail) {
        errorMessage = errorData.detail;
      } else if (typeof errorData === 'object') {
        // Handle field-specific errors
        const fieldErrors = Object.entries(errorData)
          .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
          .join('; ');
        if (fieldErrors) {
          errorMessage = fieldErrors;
        }
      }
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
      return data.csrfToken || data.csrf_token || '';
    }
  } catch (error) {
    console.warn('Failed to get CSRF token from API:', error);
  }
  
  return '';
}

// Auth API functions - UPDATED ENDPOINTS
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
    password_confirm?: string; // Make optional
  }) {
    // Ensure password_confirm is included if provided
    const registrationData = {
      ...userData,
      password_confirm: userData.password_confirm || userData.password,
    };
    
    console.log('📝 Registration data:', registrationData);
    return apiRequest('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(registrationData),
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

// Dashboard API functions - ADD THESE
export const dashboardAPI = {
  async getOverview() {
    return apiRequest('/auth/dashboard/overview/');
  },

  async getQuickStats() {
    return apiRequest('/auth/dashboard/quick-stats/');
  },

  async getProfile() {
    return apiRequest('/auth/dashboard/profile/');
  },

  async getActivities() {
    return apiRequest('/auth/dashboard/activities/');
  },

  async getSavedSearches() {
    return apiRequest('/auth/dashboard/saved-searches/');
  },
};

// Properties API - UPDATED ENDPOINTS
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
    return apiRequest('/properties/my_favorites/'); // Fixed endpoint
  },

  async getMyProperties(): Promise<Property[]> {
    return apiRequest('/properties/my_properties/'); // Fixed endpoint
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

// Image URL helper function
export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) {
    return PLACEHOLDER_IMAGE;
  }
  
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  let cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  
  if (cleanPath.startsWith('media/')) {
    cleanPath = cleanPath.replace(/^media\//, '');
  }
  
  return `${MEDIA_BASE_URL}/media/${cleanPath}`;
};

export const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5YzljOWMiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';