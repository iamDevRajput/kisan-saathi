import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { successResponse, errors } from '../../../lib/apiResponse';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return errors.methodNotAllowed(res, ['GET']);
  }

  try {
    const { district, state = 'UP' } = req.query;

    const where: any = {
      state: state as string,
      isActive: true,
    };
    if (district && typeof district === 'string') {
      where.district = district;
    }

    const alerts = await prisma.pestAlert.findMany({
      where,
      orderBy: { reportedAt: 'desc' },
      take: 20,
    });

    return successResponse(res, alerts);

  } catch (error) {
    console.error('Pest alerts error:', error);
    return errors.serverError(res, error as Error);
  }
}
