/**
 * API Utilities for PristinePrimier Real Estate
 * All API endpoints are ready for Django backend integration
 * Currently using mock data for development
 */

const API_BASE_URL = process.env.VITE_API_URL || '/api';

// Generic fetch wrapper with error handling
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Failed:', error);
    throw error;
  }
}

// Property APIs
export const propertyApi = {
  // GET /api/properties?location=...&minPrice=...&maxPrice=...&type=...&beds=...&baths=...
  search: async (filters: Record<string, any>) => {
    const params = new URLSearchParams(filters).toString();
    // TODO: Replace with actual API endpoint
    return apiFetch(`/properties${params ? '?' + params : ''}`);
  },

  // GET /api/properties/featured
  getFeatured: async () => {
    // TODO: Replace with actual API endpoint
    return apiFetch('/properties/featured');
  },

  // GET /api/property/{id}
  getById: async (id: string) => {
    // TODO: Replace with actual API endpoint
    return apiFetch(`/property/${id}`);
  },

  // GET /api/property/{id}/images
  getImages: async (id: string) => {
    // TODO: Replace with actual API endpoint
    return apiFetch(`/property/${id}/images`);
  },
};

// User/Listing Management APIs
export const userApi = {
  // POST /api/listings (Create new listing)
  createListing: async (data: FormData) => {
    // TODO: Replace with actual API endpoint
    return fetch(`${API_BASE_URL}/listings`, {
      method: 'POST',
      body: data, // FormData for file uploads
    }).then(res => res.json());
  },

  // GET /api/users/me/listings
  getMyListings: async () => {
    // TODO: Replace with actual API endpoint
    return apiFetch('/users/me/listings');
  },
};

// Admin APIs
export const adminApi = {
  // GET /api/admin/stats
  getStats: async () => {
    // TODO: Replace with actual API endpoint
    return apiFetch('/admin/stats');
  },

  // GET /api/admin/listings
  getAllListings: async () => {
    // TODO: Replace with actual API endpoint
    return apiFetch('/admin/listings');
  },

  // PATCH /api/admin/listings/{id}
  updateListing: async (id: string, data: any) => {
    // TODO: Replace with actual API endpoint
    return apiFetch(`/admin/listings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // DELETE /api/admin/listings/{id}
  deleteListing: async (id: string) => {
    // TODO: Replace with actual API endpoint
    return apiFetch(`/admin/listings/${id}`, {
      method: 'DELETE',
    });
  },

  // GET /api/admin/users
  getAllUsers: async () => {
    // TODO: Replace with actual API endpoint
    return apiFetch('/admin/users');
  },

  // GET /api/admin/agents/pending
  getPendingAgents: async () => {
    // TODO: Replace with actual API endpoint
    return apiFetch('/admin/agents/pending');
  },

  // PATCH /api/admin/agents/{id}/approve
  approveAgent: async (id: string) => {
    // TODO: Replace with actual API endpoint
    return apiFetch(`/admin/agents/${id}/approve`, {
      method: 'PATCH',
    });
  },
};

// Contact/Inquiry APIs
export const contactApi = {
  // POST /api/inquiry
  submitInquiry: async (data: any) => {
    // TODO: Replace with actual API endpoint
    return apiFetch('/inquiry', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // POST /api/valuation-request
  submitValuation: async (data: any) => {
    // TODO: Replace with actual API endpoint
    return apiFetch('/valuation-request', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // POST /api/management-request
  submitManagementRequest: async (data: any) => {
    // TODO: Replace with actual API endpoint
    return apiFetch('/management-request', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Testimonials & Partners APIs
export const contentApi = {
  // GET /api/testimonials
  getTestimonials: async () => {
    // TODO: Replace with actual API endpoint
    return apiFetch('/testimonials');
  },

  // GET /api/partners
  getPartners: async () => {
    // TODO: Replace with actual API endpoint
    return apiFetch('/partners');
  },
};

export default {
  property: propertyApi,
  user: userApi,
  admin: adminApi,
  contact: contactApi,
  content: contentApi,
};
