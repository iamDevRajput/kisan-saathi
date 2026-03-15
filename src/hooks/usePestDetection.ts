import useSWR from 'swr';
import { useState } from 'react';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function usePestDetection(userId?: string) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: history, mutate } = useSWR(
    userId ? `/api/pest-detection/history?userId=${userId}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const analyzeImage = async (imageUrl: string, cropName?: string) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/pest-detection/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl, cropName }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to analyze image');
      }

      mutate();
      return result.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const uploadAndAnalyze = async (file: File, cropName?: string) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      // Convert file to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });

      // For now, we'll use the base64 directly (in production, upload to Cloudinary first)
      return analyzeImage(base64, cropName);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    history: history?.data || [],
    isAnalyzing,
    error,
    analyzeImage,
    uploadAndAnalyze,
    refresh: mutate,
  };
}

export function usePestAlerts(district?: string) {
  const { data, error, mutate } = useSWR(
    `/api/pest-detection/alerts${district ? `?district=${district}` : ''}`,
    fetcher,
    { refreshInterval: 300000 } // Refresh every 5 minutes
  );

  return {
    alerts: data?.data || [],
    isLoading: !data && !error,
    error: error?.message,
    refresh: mutate,
  };
}
