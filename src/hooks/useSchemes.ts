import useSWR from 'swr';
import { useState } from 'react';

const fetcher = (url: string) => fetch(url).then(r => r.json());

interface SchemeQuery {
  category?: string;
  state?: string;
}

export function useSchemes(query: SchemeQuery = {}) {
  const params = new URLSearchParams();
  if (query.category) params.append('category', query.category);
  if (query.state) params.append('state', query.state);

  const { data, error, isLoading } = useSWR(
    `/api/schemes/all?${params.toString()}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  return {
    schemes: data?.data?.schemes || [],
    total: data?.data?.total || 0,
    categories: data?.data?.categories || [],
    isLoading,
    error: error?.message,
  };
}

interface EligibilityData {
  landArea?: number;
  landType?: string;
  annualIncome?: number;
  hasKCC?: boolean;
  hasPMKisan?: boolean;
  category?: string;
  state?: string;
}

export function useEligibilityCheck() {
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const checkEligibility = async (data: EligibilityData) => {
    setIsChecking(true);
    setError(null);

    try {
      const response = await fetch('/api/schemes/check-eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to check eligibility');
      }

      setResult(result.data);
      return result.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setIsChecking(false);
    }
  };

  return {
    result,
    isChecking,
    error,
    checkEligibility,
    clearResult: () => setResult(null),
  };
}

export function useSchemeApplications(userId?: string) {
  const { data, error, mutate, isLoading } = useSWR(
    userId ? `/api/schemes/my-applications?userId=${userId}` : null,
    fetcher
  );

  const applyForScheme = async (schemeId: string, applicationData: any) => {
    try {
      const response = await fetch(`/api/schemes/${schemeId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to submit application');
      }

      mutate();
      return result.data;
    } catch (err) {
      throw err;
    }
  };

  return {
    applications: data?.data || [],
    isLoading,
    error: error?.message,
    applyForScheme,
    refresh: mutate,
  };
}
