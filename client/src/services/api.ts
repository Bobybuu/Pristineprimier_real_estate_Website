import { Property, PropertyFilters, Favorite, Inquiry, SavedSearch, PaginatedResponse } from '@/types/property';

const API_BASE_URL = 'http://localhost:8000/api';

// Helper function to handle API responses
async function handleResponse(response: Response) {
  const data = await response.json().catch(() => ({ 
    message: 'Network error' 
  }));
  
  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }
  return data;
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

// Get CSRF token
export async function getCsrfToken(): Promise<string> {
  const cookieToken = getCsrfTokenFromCookie();
  if (cookieToken) {
    return cookieToken;
  }

  // Fallback to API endpoint
  try {
    const response = await fetch(`${API_BASE_URL}/auth/csrf/`, {
      credentials: 'include',
    });
    const data = await response.json();
    return data.csrfToken;
  } catch (error) {
    console.error('Failed to get CSRF token:', error);
    throw new Error('Unable to get CSRF token');
  }
}

// Generic API request function
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const csrfToken = await getCsrfToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
      ...options.headers,
    },
    credentials: 'include',
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  return handleResponse(response);
}

// Auth API functions
export const authAPI = {
  // Login
  async login(credentials: { username: string; password: string }) {
    return apiRequest('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Register
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

  // Logout
  async logout() {
    return apiRequest('/auth/logout/', {
      method: 'POST',
    });
  },

  // Get current user
  async getCurrentUser() {
    return apiRequest('/auth/me/');
  },

  // Seller application
  async submitSellerApplication(applicationData: any) {
    return apiRequest('/auth/seller/apply/', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  },
};

// Properties API - Updated to use fetch instead of axios
export const propertiesAPI = {
  // Get all properties with filters
  async getAll(filters: PropertyFilters = {}): Promise<PaginatedResponse<Property>> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v));
        } else {
          params.append(key, value.toString());
        }
      }
    });
    
    return apiRequest(`/properties/?${params}`);
  },

  // Get featured properties
  async getFeatured(): Promise<PaginatedResponse<Property>> {
    return apiRequest('/properties/?featured=true&status=published');
  },

  // Get single property
  async getById(id: number): Promise<Property> {
    return apiRequest(`/properties/${id}/`);
  },

  // Create property (for sellers)
  async create(propertyData: Partial<Property>): Promise<Property> {
    return apiRequest('/properties/', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
  },

  // Update property (for sellers)
  async update(id: number, propertyData: Partial<Property>): Promise<Property> {
    return apiRequest(`/properties/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(propertyData),
    });
  },

  // Delete property
  async delete(id: number): Promise<void> {
    return apiRequest(`/properties/${id}/`, {
      method: 'DELETE',
    });
  },

  // Toggle favorite
  async toggleFavorite(propertyId: number): Promise<{status: string}> {
    return apiRequest(`/properties/${propertyId}/favorite/`, {
      method: 'POST',
    });
  },

  // Get user's favorites
  async getFavorites(): Promise<Favorite[]> {
    return apiRequest('/properties/my_favorites/');
  },

  // Get user's properties (for sellers)
  async getMyProperties(): Promise<Property[]> {
    return apiRequest('/properties/my_properties/');
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
      method: 'PUT',
      body: JSON.stringify(searchData),
    });
  },

  async delete(id: number): Promise<void> {
    return apiRequest(`/saved-searches/${id}/`, {
      method: 'DELETE',
    });
  },
};

// Remove the default export since we're not using axios anymore
// export default api;