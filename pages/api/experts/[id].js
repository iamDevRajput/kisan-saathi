// pages/api/experts/[id].js
import prisma from '../../../src/lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    const expert = await prisma.expert.findUnique({
      where: { id },
      include: {
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!expert) {
      return res.status(404).json({ success: false, message: 'Expert not found' });
    }

    // Identify similar experts by crops/specializations
    const similarExperts = await prisma.expert.findMany({
      where: {
        id: { not: id },
        OR: [
          { crops: { hasSome: expert.crops } },
          { specializations: { hasSome: expert.specializations } }
        ]
      },
      take: 4,
      orderBy: { rating: 'desc' }
    });

    return res.status(200).json({ 
      success: true, 
      data: {
        ...expert,
        similarExperts
      } 
    });

  } catch (error) {
    console.error('[API Expert Details] Error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
}
