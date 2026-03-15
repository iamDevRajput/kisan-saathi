import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';
import type { ApiResponse, WeatherData, DailyForecast, AgriculturalIndices } from '@/types';

// Simulated weather service
async function fetchWeatherData(
  latitude: number,
  longitude: number,
  location?: string
): Promise<WeatherData> {
  // In production, integrate with OpenWeatherMap, IMD, or other weather APIs
  // For demo, generating realistic mock data
  
  const now = new Date();
  const baseTemp = 25 + Math.sin((now.getMonth() / 12) * 2 * Math.PI) * 10;
  
  // Current weather
  const current = {
    date: now,
    temperature: Math.round(baseTemp + Math.random() * 5),
    feelsLike: Math.round(baseTemp + Math.random() * 5 - 2),
    humidity: 40 + Math.floor(Math.random() * 40),
    pressure: 1013 + Math.floor(Math.random() * 20 - 10),
    windSpeed: 5 + Math.random() * 15,
    windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
    visibility: 8 + Math.random() * 4,
    uvIndex: Math.round(3 + Math.random() * 8),
    condition: ['CLEAR', 'PARTLY_CLOUDY', 'CLOUDY'][Math.floor(Math.random() * 3)] as any,
    description: 'Partly cloudy',
    icon: '02d',
    rainfall: Math.random() > 0.7 ? Math.round(Math.random() * 20) : 0,
    rainfallProbability: Math.round(Math.random() * 40),
  };

  // 7-day forecast
  const forecast: DailyForecast[] = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() + i + 1);
    
    const dayTemp = baseTemp + Math.sin((i / 7) * Math.PI) * 5;
    const rainProb = Math.random();
    
    return {
      date,
      minTemp: Math.round(dayTemp - 5 - Math.random() * 3),
      maxTemp: Math.round(dayTemp + 5 + Math.random() * 3),
      humidity: 35 + Math.floor(Math.random() * 45),
      rainfall: rainProb > 0.6 ? Math.round(Math.random() * 25) : 0,
      rainfallProbability: Math.round(rainProb * 100),
      condition: rainProb > 0.7 ? 'RAIN' : ['CLEAR', 'PARTLY_CLOUDY', 'CLOUDY'][Math.floor(Math.random() * 3)] as any,
      description: rainProb > 0.7 ? 'Light rain expected' : 'Partly cloudy',
      icon: rainProb > 0.7 ? '10d' : '02d',
      windSpeed: 5 + Math.random() * 12,
      agriculturalAdvice: generateAgriculturalAdvice(dayTemp, rainProb),
    };
  });

  // Agricultural indices
  const agriculturalIndices: AgriculturalIndices = {
    heatIndex: Math.round(current.temperature + current.humidity * 0.05),
    soilMoistureIndex: Math.round(30 + current.rainfallProbability * 0.4 + (100 - current.humidity) * 0.3),
    pestRiskIndex: Math.round(current.temperature > 25 && current.humidity > 60 ? 70 + Math.random() * 20 : 30 + Math.random() * 30),
    irrigationRecommendation: current.rainfallProbability > 60 
      ? 'No irrigation needed - Rain expected'
      : current.humidity < 40 
        ? 'Irrigate lightly - Low humidity'
        : 'Monitor soil moisture',
    fieldWorkSuitability: current.rainfall > 5 || current.windSpeed > 20 
      ? 'POOR' 
      : current.rainfallProbability > 50 
        ? 'FAIR' 
        : 'GOOD',
  };

  return {
    location: location || `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
    latitude,
    longitude,
    current,
    forecast,
    agriculturalIndices,
  };
}

function generateAgriculturalAdvice(temp: number, rainProb: number): string[] {
  const advice: string[] = [];
  
  if (temp > 35) {
    advice.push('High temperature expected - Ensure adequate irrigation');
    advice.push('Consider mulching to retain soil moisture');
  }
  if (temp < 15) {
    advice.push('Low temperature expected - Protect sensitive crops');
  }
  if (rainProb > 0.7) {
    advice.push('Heavy rain expected - Check drainage systems');
    advice.push('Avoid spraying fertilizers/pesticides');
  }
  if (rainProb < 0.2) {
    advice.push('Dry conditions expected - Plan irrigation schedule');
  }
  if (advice.length === 0) {
    advice.push('Favorable weather for field operations');
    advice.push('Good conditions for fertilizer application');
  }
  
  return advice;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<WeatherData>>
) {
  // Check authentication
  const session = await getSession({ req });
  if (!session?.user?.id) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized. Please sign in.',
    });
  }

  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use GET or POST.',
    });
  }

  try {
    let latitude: number;
    let longitude: number;
    let location: string | undefined;

    if (req.method === 'POST') {
      ({ latitude, longitude, location } = req.body);
    } else {
      // GET request - use query params
      latitude = parseFloat(req.query.latitude as string);
      longitude = parseFloat(req.query.longitude as string);
      location = req.query.location as string;
    }

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        error: 'Valid latitude and longitude are required',
      });
    }

    // Fetch weather data
    const weatherData = await fetchWeatherData(latitude, longitude, location);

    // Save to database
    await prisma.weatherData.create({
      data: {
        location: weatherData.location,
        latitude,
        longitude,
        temperature: weatherData.current.temperature,
        feelsLike: weatherData.current.feelsLike,
        humidity: weatherData.current.humidity,
        pressure: weatherData.current.pressure,
        windSpeed: weatherData.current.windSpeed,
        windDirection: weatherData.current.windDirection,
        visibility: weatherData.current.visibility,
        uvIndex: weatherData.current.uvIndex,
        condition: weatherData.current.condition,
        description: weatherData.current.description,
        icon: weatherData.current.icon,
        rainfall: weatherData.current.rainfall,
        rainfallProbability: weatherData.current.rainfallProbability,
        forecast: weatherData.forecast as any,
        heatIndex: weatherData.agriculturalIndices.heatIndex,
        soilMoistureIndex: weatherData.agriculturalIndices.soilMoistureIndex,
        pestRiskIndex: weatherData.agriculturalIndices.pestRiskIndex,
      },
    });

    // Log activity
    await prisma.userActivity.create({
      data: {
        userId: session.user.id,
        activityType: 'WEATHER_CHECKED',
        description: `Checked weather for ${weatherData.location}`,
        metadata: {
          location: weatherData.location,
          temperature: weatherData.current.temperature,
          condition: weatherData.current.condition,
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: weatherData,
      message: 'Weather data fetched successfully',
    });
  } catch (error) {
    console.error('Weather API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch weather data',
    });
  }
}
