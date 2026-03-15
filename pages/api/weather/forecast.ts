import type { NextApiRequest, NextApiResponse } from 'next';
import { successResponse, errors } from '../../../lib/apiResponse';
import { cacheWithFallback, CACHE_KEYS, CACHE_TTL } from '../../../lib/redis';
import { weatherForecastSchema } from '../../../lib/validators';

interface OpenMeteoResponse {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    windspeed_10m_max: number[];
    weathercode: number[];
  };
}

interface ForecastDay {
  date: string;
  tempMax: number;
  tempMin: number;
  rainfall: number;
  windSpeed: number;
  condition: string;
  conditionHindi: string;
  farmRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  farmActions: string[];
}

const WEATHER_CODES: Record<number, { en: string; hi: string }> = {
  0: { en: 'Clear sky', hi: 'साफ आसमान' },
  1: { en: 'Mainly clear', hi: 'मुख्यतः साफ' },
  2: { en: 'Partly cloudy', hi: 'आंशिक बादल' },
  3: { en: 'Overcast', hi: 'बादल छाए' },
  45: { en: 'Fog', hi: 'कोहरा' },
  48: { en: 'Depositing rime fog', hi: 'पाला कोहरा' },
  51: { en: 'Light drizzle', hi: 'हल्की बूंदाबांदी' },
  53: { en: 'Moderate drizzle', hi: 'बूंदाबांदी' },
  55: { en: 'Dense drizzle', hi: 'घनी बूंदाबांदी' },
  61: { en: 'Slight rain', hi: 'हल्की बारिश' },
  63: { en: 'Moderate rain', hi: 'बारिश' },
  65: { en: 'Heavy rain', hi: 'भारी बारिश' },
  71: { en: 'Slight snow', hi: 'हल्की बर्फबारी' },
  73: { en: 'Moderate snow', hi: 'बर्फबारी' },
  75: { en: 'Heavy snow', hi: 'भारी बर्फबारी' },
  77: { en: 'Snow grains', hi: 'ओले' },
  80: { en: 'Slight rain showers', hi: 'हल्की बौछार' },
  81: { en: 'Moderate rain showers', hi: 'बौछार' },
  82: { en: 'Violent rain showers', hi: 'तेज बौछार' },
  85: { en: 'Slight snow showers', hi: 'हल्की बर्फीली बौछार' },
  86: { en: 'Heavy snow showers', hi: 'भारी बर्फीली बौछार' },
  95: { en: 'Thunderstorm', hi: 'आंधी-तूफान' },
  96: { en: 'Thunderstorm with slight hail', hi: 'ओलावृष्टि' },
  99: { en: 'Thunderstorm with heavy hail', hi: 'भारी ओलावृष्टि' },
};

function getFarmRisk(rainfall: number, windSpeed: number, tempMax: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
  if (rainfall > 50 || windSpeed > 50 || tempMax > 45) return 'CRITICAL';
  if (rainfall > 25 || windSpeed > 35 || tempMax > 42) return 'HIGH';
  if (rainfall > 10 || windSpeed > 20 || tempMax > 38) return 'MEDIUM';
  return 'LOW';
}

function getFarmActions(rainfall: number, windSpeed: number, tempMax: number, tempMin: number): string[] {
  const actions: string[] = [];
  
  if (rainfall > 25) {
    actions.push('सिंचाई न करें - पर्याप्त वर्षा होगी');
    actions.push('जल निकासी की व्यवस्था जांचें');
  } else if (rainfall > 10) {
    actions.push('सिंचाई कम करें');
  } else if (rainfall < 2 && tempMax > 35) {
    actions.push('सुबह जल्दी या शाम को सिंचाई करें');
  }
  
  if (windSpeed > 35) {
    actions.push('छिड़काव न करें - तेज हवा');
    actions.push('पौधों को सहारा दें');
  }
  
  if (tempMax > 40) {
    actions.push('दोपहर में खेत में काम न करें');
    actions.push('मल्चिंग करें');
  }
  
  if (tempMin < 10) {
    actions.push('रात में पाले से बचाव करें');
    actions.push('सुबह धुआं करें');
  }
  
  if (actions.length === 0) {
    actions.push('सामान्य खेती कार्य जारी रखें');
  }
  
  return actions;
}

async function fetchWeatherFromOpenMeteo(lat: number, lng: number, days: number): Promise<ForecastDay[]> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,weathercode&timezone=Asia/Kolkata&forecast_days=${days}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }
  
  const data: OpenMeteoResponse = await response.json();
  
  return data.daily.time.map((date, i) => {
    const rainfall = data.daily.precipitation_sum[i];
    const windSpeed = data.daily.windspeed_10m_max[i];
    const tempMax = data.daily.temperature_2m_max[i];
    const tempMin = data.daily.temperature_2m_min[i];
    const weatherCode = data.daily.weathercode[i];
    const weather = WEATHER_CODES[weatherCode] || { en: 'Unknown', hi: 'अज्ञात' };
    
    return {
      date,
      tempMax,
      tempMin,
      rainfall,
      windSpeed,
      condition: weather.en,
      conditionHindi: weather.hi,
      farmRisk: getFarmRisk(rainfall, windSpeed, tempMax),
      farmActions: getFarmActions(rainfall, windSpeed, tempMax, tempMin),
    };
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return errors.methodNotAllowed(res, ['GET']);
  }

  try {
    const validationResult = weatherForecastSchema.safeParse(req.query);
    if (!validationResult.success) {
      return errors.validationError(res, validationResult.error.errors);
    }

    const { lat, lng, days } = validationResult.data;
    
    const forecast = await cacheWithFallback(
      CACHE_KEYS.WEATHER(lat, lng),
      CACHE_TTL.WEATHER,
      () => fetchWeatherFromOpenMeteo(lat, lng, days)
    );

    const criticalDays = forecast.filter(d => d.farmRisk === 'CRITICAL' || d.farmRisk === 'HIGH');
    
    return successResponse(res, {
      location: { lat, lng },
      forecast,
      alerts: criticalDays.length > 0 ? {
        count: criticalDays.length,
        message: `अगले ${days} दिनों में ${criticalDays.length} दिन खेती के लिए चुनौतीपूर्ण रहेंगे`,
        dates: criticalDays.map(d => d.date),
      } : null,
      fetchedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Weather forecast error:', error);
    return errors.serverError(res, error as Error);
  }
}
