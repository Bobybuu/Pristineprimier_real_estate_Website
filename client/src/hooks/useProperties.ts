import { useState, useEffect } from 'react';
import { propertiesAPI } from '@/services/api';
import { Property, PropertyFilters, PaginatedResponse } from '@/types/property';

interface UsePropertiesReturn {
  properties: Property[];
  loading: boolean;
  error: string | null;
}

interface UseFeaturedPropertiesReturn {
  featuredProperties: Property[];
  loading: boolean;
  error: string | null;
}

export const useProperties = (filters: PropertyFilters = {}): UsePropertiesReturn => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await propertiesAPI.getAll(filters);
        
        // Handle the response structure correctly
        let propertiesArray: Property[] = [];
        
        if (response && 'results' in response) {
          // If response is PaginatedResponse with results
          propertiesArray = response.results;
        } else if (Array.isArray(response)) {
          // If response is directly an array
          propertiesArray = response;
        }
        
        console.log('Properties:', propertiesArray); // Debug log
        setProperties(propertiesArray);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch properties');
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [JSON.stringify(filters)]);

  return { properties, loading, error };
};

export const useFeaturedProperties = (): UseFeaturedPropertiesReturn => {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProperties = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await propertiesAPI.getFeatured();
        
        // Handle the response structure correctly
        let propertiesArray: Property[] = [];
        
        if (response && 'results' in response) {
          // If response is PaginatedResponse with results
          propertiesArray = response.results;
        } else if (Array.isArray(response)) {
          // If response is directly an array
          propertiesArray = response;
        }
        
        console.log('Featured properties:', propertiesArray); // Debug log
        setFeaturedProperties(propertiesArray);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch featured properties');
        console.error('Error fetching featured properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

  return { featuredProperties, loading, error };
};