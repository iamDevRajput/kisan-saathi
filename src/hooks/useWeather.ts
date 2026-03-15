import useSWR from 'swr';
import { useState, useEffect } from 'react';

const fetcher = (url: string) => fetch(url).then(r => r.json());

interface Location {
  lat: number;
  lng: number;
}

export function useWeather(location?: Location, days: number = 7) {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(location || null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Get user's current location if not provided
  useEffect(() => {
    if (!location && typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          setLocationError('Unable to get your location. Please enable location access.');
          // Default to Delhi if location not available
          setCurrentLocation({ lat: 28.6139, lng: 77.2090 });
        }
      );
    }
  }, [location]);

  const { data, error, mutate, isLoading } = useSWR(
    currentLocation 
      ? `/api/weather/forecast?lat=${currentLocation.lat}&lng=${currentLocation.lng}&days=${days}` 
      : null,
    fetcher,
    { 
      revalidateOnFocus: false,
      refreshInterval: 3600000, // Refresh every hour
    }
  );

  const setLocation = (lat: number, lng: number) => {
    setCurrentLocation({ lat, lng });
    setLocationError(null);
  };

  return {
    forecast: data?.data?.forecast || [],
    alerts: data?.data?.alerts,
    location: currentLocation,
    isLoading: isLoading || (!currentLocation && !locationError),
    error: error?.message || locationError,
    setLocation,
    refresh: mutate,
  };
}

export function useWeatherAlerts(userId?: string) {
  const { data, error, mutate } = useSWR(
    userId ? `/api/weather/alerts?userId=${userId}` : null,
    fetcher,
    { refreshInterval: 300000 }
  );

  return {
    alerts: data?.data || [],
    isLoading: !data && !error,
    error: error?.message,
    refresh: mutate,
  };
}
