import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { successResponse, errors, paginate } from '../../../lib/apiResponse';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return errors.methodNotAllowed(res, ['GET']);
  }

  try {
    const { userId, cropId, page = '1', limit = '20' } = req.query;

    const where: any = {};
    if (userId && typeof userId === 'string') where.userId = userId;
    if (cropId && typeof cropId === 'string') where.cropProfileId = cropId;

    const advisories = await prisma.cropAdvisory.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        cropProfile: {
          select: { name: true, variety: true },
        },
      },
    });

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const { items, meta } = paginate(advisories, pageNum, limitNum);

    return successResponse(res, items, undefined, 200, meta);

  } catch (error) {
    console.error('Advisory list error:', error);
    return errors.serverError(res, error as Error);
  }
}
