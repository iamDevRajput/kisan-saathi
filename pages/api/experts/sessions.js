// pages/api/experts/sessions.js
import prisma from '../../../src/lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { status, userId = 'user-mock' } = req.query;

    const where = {
      userId
    };

    if (status) {
      where.status = status;
    }

    const sessions = await prisma.expertBooking.findMany({
      where,
      include: {
        expert: {
          select: {
            id: true,
            name: true,
            nameHindi: true,
            title: true,
            titleHindi: true,
            avatar: true,
            pricePerCall: true,
            organization: true
          }
        },
        review: true
      },
      orderBy: { date: 'desc' }
    });

    return res.status(200).json({ success: true, data: sessions });

  } catch (error) {
    console.error('[API Expert Sessions] Error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
}
