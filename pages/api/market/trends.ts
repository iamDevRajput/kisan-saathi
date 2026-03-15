import type { NextApiRequest, NextApiResponse } from 'next';
import { successResponse, errors } from '../../../lib/apiResponse';
import { marketTrendsQuerySchema } from '../../../lib/validators';

const BASE_PRICES: Record<string, number> = {
  wheat: 2275, rice: 2183, mustard: 5450, potato: 1250,
  onion: 1800, sugarcane: 350, cotton: 6620, maize: 2090,
  chickpea: 5335, lentil: 6000, soybean: 4600, barley: 1850,
};

function generateHistoricalPrice(basePrice: number, daysAgo: number, commodity: string): number {
  const seed = commodity.charCodeAt(0) + daysAgo;
  const seasonalTrend = Math.sin(daysAgo / 30 * Math.PI) * 0.05;
  const dailyVariation = ((Math.sin(seed * 0.1) + 1) / 2) * 0.06 - 0.03;
  return Math.round(basePrice * (1 + seasonalTrend + dailyVariation));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return errors.methodNotAllowed(res, ['GET']);
  }

  try {
    const validationResult = marketTrendsQuerySchema.safeParse(req.query);
    if (!validationResult.success) {
      return errors.validationError(res, validationResult.error.errors);
    }

    const { commodity, mandi, days } = validationResult.data;
    const basePrice = BASE_PRICES[commodity.toLowerCase()] || 2000;
    
    const today = new Date();
    const priceHistory = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const price = generateHistoricalPrice(basePrice, i, commodity);
      
      priceHistory.push({
        date: date.toISOString().split('T')[0],
        price,
        volume: Math.round(500 + Math.random() * 2000),
      });
    }

    // Calculate trend analysis
    const recentPrices = priceHistory.slice(-7).map(p => p.price);
    const olderPrices = priceHistory.slice(0, 7).map(p => p.price);
    const recentAvg = recentPrices.reduce((a, b) => a + b, 0) / recentPrices.length;
    const olderAvg = olderPrices.reduce((a, b) => a + b, 0) / olderPrices.length;
    const trendPercent = ((recentAvg - olderAvg) / olderAvg) * 100;
    
    const minPrice = Math.min(...priceHistory.map(p => p.price));
    const maxPrice = Math.max(...priceHistory.map(p => p.price));
    const avgPrice = Math.round(priceHistory.reduce((a, b) => a + b.price, 0) / priceHistory.length);

    return successResponse(res, {
      commodity,
      mandi: mandi || 'All UP Mandis',
      period: `${days} days`,
      priceHistory,
      analysis: {
        minPrice,
        maxPrice,
        avgPrice,
        currentPrice: priceHistory[priceHistory.length - 1].price,
        trend: trendPercent > 2 ? 'UP' : trendPercent < -2 ? 'DOWN' : 'STABLE',
        trendPercent: Math.round(trendPercent * 100) / 100,
        volatility: Math.round(((maxPrice - minPrice) / avgPrice) * 10000) / 100,
      },
    });

  } catch (error) {
    console.error('Market trends error:', error);
    return errors.serverError(res, error as Error);
  }
}
