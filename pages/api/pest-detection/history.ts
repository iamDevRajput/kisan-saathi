import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { successResponse, errors, paginate } from '../../../lib/apiResponse';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return errors.methodNotAllowed(res, ['GET']);
  }

  try {
    const { userId, status, page = '1', limit = '20' } = req.query;

    const where: any = {};
    if (userId && typeof userId === 'string') where.userId = userId;
    if (status && typeof status === 'string') where.status = status;

    const detections = await prisma.diseaseDetection.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        cropName: true,
        imageUrl: true,
        diseaseName: true,
        severity: true,
        confidence: true,
        status: true,
        estimatedLoss: true,
        createdAt: true,
      },
    });

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const { items, meta } = paginate(detections, pageNum, limitNum);

    return successResponse(res, items, undefined, 200, meta);

  } catch (error) {
    console.error('Pest detection history error:', error);
    return errors.serverError(res, error as Error);
  }
}
