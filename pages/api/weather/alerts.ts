import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';
import type { ApiResponse, WeatherAlert } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<WeatherAlert[]>>
) {
  const session = await getSession({ req });
  if (!session?.user?.id) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
    });
  }

  if (req.method === 'GET') {
    try {
      // Get user's location
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { location: true, latitude: true, longitude: true },
      });

      // Fetch active alerts for user's location
      const alerts = await prisma.weatherAlert.findMany({
        where: {
          userId: session.user.id,
          isActive: true,
          OR: [
            { endsAt: { gte: new Date() } },
            { endsAt: null },
          ],
        },
        orderBy: { createdAt: 'desc' },
      });

      return res.status(200).json({
        success: true,
        data: alerts as any,
      });
    } catch (error) {
      console.error('Weather alerts error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch weather alerts',
      });
    }
  }

  if (req.method === 'PATCH') {
    // Mark alert as read
    try {
      const { alertId } = req.body;
      
      await prisma.weatherAlert.update({
        where: { id: alertId },
        data: { isRead: true },
      });

      return res.status(200).json({
        success: true,
        message: 'Alert marked as read',
      });
    } catch (error) {
      console.error('Update alert error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to update alert',
      });
    }
  }

  return res.status(405).json({
    success: false,
    error: 'Method not allowed',
  });
}
