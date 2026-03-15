import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';
import type { ApiResponse, MarketPrice, PaginatedResponse } from '@/types';

// Sample market data generator
function generateMarketPrices(
  cropName?: string,
  marketName?: string,
  state?: string,
  category?: string,
  skip: number = 0,
  take: number = 10
): { data: MarketPrice[]; total: number } {
  const crops = [
    { name: 'Wheat', category: 'CEREALS', markets: ['Delhi', 'Ludhiana', 'Kanpur'], basePrice: 2200 },
    { name: 'Rice', category: 'CEREALS', markets: ['Karnal', 'Kolkata', 'Hyderabad'], basePrice: 2000 },
    { name: 'Maize', category: 'CEREALS', markets: ['Indore', 'Bhopal', 'Jaipur'], basePrice: 1800 },
    { name: 'Cotton', category: 'FIBERS', markets: ['Rajkot', 'Nagpur', 'Guntur'], basePrice: 6000 },
    { name: 'Soybean', category: 'OILSEEDS', markets: ['Indore', 'Ujjain', 'Dewas'], basePrice: 3800 },
    { name: 'Groundnut', category: 'OILSEEDS', markets: ['Rajkot', 'Junagadh', 'Ahmedabad'], basePrice: 5500 },
    { name: 'Mustard', category: 'OILSEEDS', markets: ['Jaipur', 'Alwar', 'Bharatpur'], basePrice: 4500 },
    { name: 'Tomato', category: 'VEGETABLES', markets: ['Azadpur', 'Pune', 'Bangalore'], basePrice: 1500 },
    { name: 'Onion', category: 'VEGETABLES', markets: ['Lasalgaon', 'Pune', 'Bangalore'], basePrice: 2000 },
    { name: 'Potato', category: 'VEGETABLES', markets: ['Agra', 'Farukhabad', 'Lucknow'], basePrice: 1200 },
    { name: 'Turmeric', category: 'SPICES', markets: ['Nizamabad', 'Erode', 'Sangli'], basePrice: 7000 },
    { name: 'Chilli', category: 'SPICES', markets: ['Guntur', 'Warangal', 'Raichur'], basePrice: 8000 },
  ];

  const states = ['Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh', 'Gujarat', 'Maharashtra', 'Karnataka', 'Andhra Pradesh', 'Telangana', 'Rajasthan'];

  let allPrices: MarketPrice[] = [];
  let id = 1;

  crops.forEach(crop => {
    if (cropName && !crop.name.toLowerCase().includes(cropName.toLowerCase())) return;
    if (category && crop.category !== category) return;

    crop.markets.forEach((market, idx) => {
      if (marketName && !market.toLowerCase().includes(marketName.toLowerCase())) return;

      const stateName = states[(id + idx) % states.length];
      if (state && !stateName.toLowerCase().includes(state.toLowerCase())) return;

      const priceChange = (Math.random() - 0.5) * 400;
      const currentPrice = crop.basePrice + priceChange;
      const previousPrice = crop.basePrice;

      allPrices.push({
        id: `price-${id++}`,
        cropName: crop.name,
        cropVariety: Math.random() > 0.5 ? 'Grade A' : 'Grade B',
        category: crop.category as any,
        marketName: market,
        state: stateName,
        district: `${market} District`,
        price: Math.round(currentPrice),
        unit: 'quintal',
        currency: 'INR',
        previousPrice: Math.round(previousPrice),
        priceChange: Math.round(priceChange),
        priceChangePercent: Math.round((priceChange / previousPrice) * 100 * 100) / 100,
        trend: priceChange > 50 ? 'UP' : priceChange < -50 ? 'DOWN' : 'STABLE',
        grade: Math.random() > 0.5 ? 'A' : 'B',
        minPrice: Math.round(currentPrice * 0.9),
        maxPrice: Math.round(currentPrice * 1.1),
        avgPrice: Math.round(currentPrice),
        arrivals: Math.round(100 + Math.random() * 900),
        arrivalDate: new Date(),
        forecastPrice: Math.round(currentPrice + (Math.random() - 0.5) * 200),
        forecastTrend: Math.random() > 0.5 ? 'UP' : 'STABLE',
      });
    });
  });

  const total = allPrices.length;
  const data = allPrices.slice(skip, skip + take);

  return { data, total };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<PaginatedResponse<MarketPrice>>>
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
    const { 
      cropName, 
      marketName, 
      state, 
      category,
      page = '1', 
      limit = '10' 
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10)));
    const skip = (pageNum - 1) * limitNum;

    // Fetch prices from database or generate mock data
    let prices = await prisma.marketPrice.findMany({
      where: {
        ...(cropName && { cropName: { contains: cropName as string, mode: 'insensitive' } }),
        ...(marketName && { marketName: { contains: marketName as string, mode: 'insensitive' } }),
        ...(state && { state: { contains: state as string, mode: 'insensitive' } }),
        ...(category && { category: category as any }),
      },
      orderBy: { arrivalDate: 'desc' },
      skip,
      take: limitNum,
    });

    let total = await prisma.marketPrice.count({
      where: {
        ...(cropName && { cropName: { contains: cropName as string, mode: 'insensitive' } }),
        ...(marketName && { marketName: { contains: marketName as string, mode: 'insensitive' } }),
        ...(state && { state: { contains: state as string, mode: 'insensitive' } }),
        ...(category && { category: category as any }),
      },
    });

    // If no data in database, generate mock data
    if (prices.length === 0) {
      const mockData = generateMarketPrices(
        cropName as string,
        marketName as string,
        state as string,
        category as string,
        skip,
        limitNum
      );
      prices = mockData.data as any;
      total = mockData.total;
    }

    // Log activity
    await prisma.userActivity.create({
      data: {
        userId: session.user.id,
        activityType: 'PRICE_CHECKED',
        description: `Checked market prices${cropName ? ` for ${cropName}` : ''}`,
        metadata: {
          cropName: cropName || 'all',
          marketName: marketName || 'all',
          resultsCount: prices.length,
        },
      },
    });

    const totalPages = Math.ceil(total / limitNum);

    return res.status(200).json({
      success: true,
      data: {
        data: prices as any,
        meta: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        },
      },
    });
  } catch (error) {
    console.error('Market prices error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch market prices',
    });
  }
}
