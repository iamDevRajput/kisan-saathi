import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';
import { successResponse, errors } from '../../../../lib/apiResponse';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return errors.badRequest(res, 'Invalid advisory ID');
  }

  if (req.method === 'GET') {
    try {
      const advisory = await prisma.cropAdvisory.findUnique({
        where: { id },
        include: {
          cropProfile: true,
          user: {
            select: { name: true, location: true },
          },
        },
      });

      if (!advisory) {
        return errors.notFound(res, 'Advisory');
      }

      return successResponse(res, advisory);
    } catch (error) {
      return errors.serverError(res, error as Error);
    }
  }

  if (req.method === 'PUT') {
    try {
      const advisory = await prisma.cropAdvisory.update({
        where: { id },
        data: { isRead: true },
      });

      return successResponse(res, advisory, 'Advisory marked as read');
    } catch (error) {
      return errors.serverError(res, error as Error);
    }
  }

  return errors.methodNotAllowed(res, ['GET', 'PUT']);
}
