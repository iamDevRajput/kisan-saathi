import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import type { ApiResponse } from '@/types';

interface PriceTrend {
  cropName: string;
  currentPrice: number;
  previousPrice: number;
  changePercent: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
  forecast: {
    nextWeek: number;
    nextMonth: number;
    confidence: number;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<PriceTrend[]>>
) {
  const session = await getSession({ req });
  if (!session?.user?.id) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
    });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    // Generate trend analysis
    const trends: PriceTrend[] = [
      {
        cropName: 'Wheat',
        currentPrice: 2250,
        previousPrice: 2200,
        changePercent: 2.27,
        trend: 'UP',
        forecast: {
          nextWeek: 2280,
          nextMonth: 2350,
          confidence: 0.85,
        },
      },
      {
        cropName: 'Rice',
        currentPrice: 1950,
        previousPrice: 2000,
        changePercent: -2.5,
        trend: 'DOWN',
        forecast: {
          nextWeek: 1920,
          nextMonth: 1900,
          confidence: 0.78,
        },
      },
      {
        cropName: 'Cotton',
        currentPrice: 6200,
        previousPrice: 6000,
        changePercent: 3.33,
        trend: 'UP',
        forecast: {
          nextWeek: 6350,
          nextMonth: 6500,
          confidence: 0.82,
        },
      },
      {
        cropName: 'Soybean',
        currentPrice: 3750,
        previousPrice: 3800,
        changePercent: -1.32,
        trend: 'DOWN',
        forecast: {
          nextWeek: 3720,
          nextMonth: 3800,
          confidence: 0.75,
        },
      },
      {
        cropName: 'Turmeric',
        currentPrice: 7200,
        previousPrice: 7000,
        changePercent: 2.86,
        trend: 'UP',
        forecast: {
          nextWeek: 7400,
          nextMonth: 7800,
          confidence: 0.80,
        },
      },
    ];

    return res.status(200).json({
      success: true,
      data: trends,
    });
  } catch (error) {
    console.error('Price trends error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch price trends',
    });
  }
}
