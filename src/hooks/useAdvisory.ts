import useSWR from 'swr';
import { useState } from 'react';

const fetcher = (url: string) => fetch(url).then(r => r.json());

interface AdvisoryInput {
  cropName: string;
  stage: string;
  location: string;
  soilData?: {
    nitrogen?: number;
    phosphorus?: number;
    potassium?: number;
    pH?: number;
  };
  weatherData?: {
    temperature?: number;
    humidity?: number;
    rainfall?: number;
  };
  language?: string;
}

export function useAdvisory(userId?: string) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data, mutate, isLoading } = useSWR(
    userId ? `/api/advisory?userId=${userId}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const generateAdvisory = async (input: AdvisoryInput) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await fetch('/api/advisory/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to generate advisory');
      }
      
      mutate();
      return result.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  const markAsRead = async (advisoryId: string) => {
    try {
      await fetch(`/api/advisory/${advisoryId}`, {
        method: 'PUT',
      });
      mutate();
    } catch (err) {
      console.error('Failed to mark advisory as read:', err);
    }
  };

  return {
    advisories: data?.data || [],
    isLoading,
    isGenerating,
    error,
    generateAdvisory,
    markAsRead,
    refresh: mutate,
  };
}
