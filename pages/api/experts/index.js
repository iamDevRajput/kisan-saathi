// pages/api/experts/index.js
import prisma from '../../../src/lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { 
      search, 
      specialization, 
      language,
      maxPrice, 
      minRating, 
      isKVK, 
      isOnline, 
      page = 1, 
      limit = 9 
    } = req.query;

    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nameHindi: { contains: search } },
        { crops: { hasSome: [search.toLowerCase()] } }
      ];
    }

    if (specialization) {
      where.specializations = { hasSome: [specialization] };
    }

    if (language) {
      where.languages = { hasSome: [language] };
    }

    if (maxPrice !== undefined) {
      where.pricePerCall = { lte: parseInt(maxPrice) };
    }

    if (minRating !== undefined) {
      where.rating = { gte: parseFloat(minRating) };
    }

    if (isKVK === 'true') {
      where.isKVK = true;
    }

    if (isOnline === 'true') {
      where.isOnline = true;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [experts, total] = await Promise.all([
      prisma.expert.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: [
          { isFeatured: 'desc' },
          { rating: 'desc' }
        ]
      }),
      prisma.expert.count({ where })
    ]);

    // Cache for 5 mins
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');

    return res.status(200).json({
      success: true,
      data: experts,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('[API Experts Index] Error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
}
