// services/inquiryApi.ts
import { toast } from 'sonner';

const API_BASE_URL = 'http://localhost:8000/api'; // Adjust to your Django server

export interface InquiryData {
  name: string;
  email: string;
  phone: string;
  message: string;
  property?: string; // property ID for property inquiries
  inquiry_type?: string;
  preferred_date?: string;
  address?: string; // for valuation/management requests
  sqft?: string;
  serviceType?: string;
}

class InquiryApi {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async submitPropertyInquiry(propertyId: string, data: Omit<InquiryData, 'property'>) {
    return this.request(`/properties/${propertyId}/inquire/`, {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        inquiry_type: 'property_inquiry'
      }),
    });
  }

  async submitValuationRequest(data: InquiryData) {
    return this.request('/inquiries/', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        inquiry_type: 'valuation_request',
        message: `Valuation request for: ${data.address}\nSquare Footage: ${data.sqft}\n\nAdditional Details: ${data.message}`
      }),
    });
  }

  async submitManagementRequest(data: InquiryData) {
    return this.request('/inquiries/', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        inquiry_type: 'management_request',
        message: `Management request for: ${data.address}\nService Type: ${data.serviceType}\n\nAdditional Details: ${data.message}`
      }),
    });
  }

  async submitGeneralInquiry(data: InquiryData) {
    return this.request('/inquiries/', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        inquiry_type: 'general_inquiry'
      }),
    });
  }
}

export const inquiryApi = new InquiryApi();