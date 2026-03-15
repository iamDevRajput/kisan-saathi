import useSWR from 'swr';
import { useState } from 'react';

const fetcher = (url: string) => fetch(url).then(r => r.json());

interface PriceQuery {
  state?: string;
  district?: string;
  commodity?: string;
  mandi?: string;
}

export function useMarketPrices(query: PriceQuery = {}) {
  const params = new URLSearchParams();
  if (query.state) params.append('state', query.state);
  if (query.district) params.append('district', query.district);
  if (query.commodity) params.append('commodity', query.commodity);
  if (query.mandi) params.append('mandi', query.mandi);

  const { data, error, mutate, isLoading } = useSWR(
    `/api/market/prices?${params.toString()}`,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 1800000, // Refresh every 30 minutes
    }
  );

  return {
    prices: data?.data?.prices || [],
    summary: data?.data?.summary,
    isLoading,
    error: error?.message,
    refresh: mutate,
  };
}

export function useMarketTrends(commodity: string, days: number = 30) {
  const { data, error, isLoading } = useSWR(
    commodity ? `/api/market/trends?commodity=${commodity}&days=${days}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  return {
    priceHistory: data?.data?.priceHistory || [],
    analysis: data?.data?.analysis,
    isLoading,
    error: error?.message,
  };
}

export function useBestMandi(commodity: string, userLat?: number, userLng?: number) {
  const [isSearching, setIsSearching] = useState(false);

  const { data, error, mutate, isLoading } = useSWR(
    commodity && userLat && userLng
      ? `/api/market/best-mandi?commodity=${commodity}&userLat=${userLat}&userLng=${userLng}`
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const findBestMandi = async (commodityName: string, lat: number, lng: number, radiusKm: number = 100) => {
    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/market/best-mandi?commodity=${commodityName}&userLat=${lat}&userLng=${lng}&radiusKm=${radiusKm}`
      );
      const result = await response.json();
      return result.data;
    } finally {
      setIsSearching(false);
    }
  };

  return {
    bestMandi: data?.data?.bestMandi,
    alternatives: data?.data?.alternatives || [],
    summary: data?.data?.summary,
    isLoading: isLoading || isSearching,
    error: error?.message,
    findBestMandi,
    refresh: mutate,
  };
}

export function usePriceAlerts(userId?: string) {
  const [isCreating, setIsCreating] = useState(false);

  const { data, mutate } = useSWR(
    userId ? `/api/market/alerts?userId=${userId}` : null,
    fetcher
  );

  const createAlert = async (alertData: {
    commodity: string;
    targetPrice: number;
    alertType: 'PRICE_ABOVE' | 'PRICE_BELOW';
  }) => {
    setIsCreating(true);
    try {
      const response = await fetch('/api/market/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertData),
      });
      const result = await response.json();
      mutate();
      return result.data;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    alerts: data?.data || [],
    isCreating,
    createAlert,
    refresh: mutate,
  };
}
