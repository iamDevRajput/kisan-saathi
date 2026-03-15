import type { NextApiRequest, NextApiResponse } from 'next';
import { successResponse, errors, paginate } from '../../../lib/apiResponse';
import { marketPricesQuerySchema } from '../../../lib/validators';

// UP Mandis data
const UP_MANDIS = [
  { name: 'Meerut', nameHindi: 'मेरठ', lat: 28.9845, lng: 77.7064, district: 'Meerut' },
  { name: 'Agra', nameHindi: 'आगरा', lat: 27.1767, lng: 78.0081, district: 'Agra' },
  { name: 'Lucknow', nameHindi: 'लखनऊ', lat: 26.8467, lng: 80.9462, district: 'Lucknow' },
  { name: 'Varanasi', nameHindi: 'वाराणसी', lat: 25.3176, lng: 82.9739, district: 'Varanasi' },
  { name: 'Kanpur', nameHindi: 'कानपुर', lat: 26.4499, lng: 80.3319, district: 'Kanpur' },
  { name: 'Mathura', nameHindi: 'मथुरा', lat: 27.4924, lng: 77.6737, district: 'Mathura' },
  { name: 'Aligarh', nameHindi: 'अलीगढ़', lat: 27.8974, lng: 78.0880, district: 'Aligarh' },
  { name: 'Bareilly', nameHindi: 'बरेली', lat: 28.3670, lng: 79.4304, district: 'Bareilly' },
  { name: 'Moradabad', nameHindi: 'मुरादाबाद', lat: 28.8386, lng: 78.7733, district: 'Moradabad' },
  { name: 'Gorakhpur', nameHindi: 'गोरखपुर', lat: 26.7606, lng: 83.3732, district: 'Gorakhpur' },
  { name: 'Jhansi', nameHindi: 'झांसी', lat: 25.4484, lng: 78.5685, district: 'Jhansi' },
  { name: 'Prayagraj', nameHindi: 'प्रयागराज', lat: 25.4358, lng: 81.8463, district: 'Prayagraj' },
  { name: 'Saharanpur', nameHindi: 'सहारनपुर', lat: 29.9680, lng: 77.5510, district: 'Saharanpur' },
  { name: 'Muzaffarnagar', nameHindi: 'मुजफ्फरनगर', lat: 29.4727, lng: 77.7085, district: 'Muzaffarnagar' },
  { name: 'Hapur', nameHindi: 'हापुड़', lat: 28.7307, lng: 77.7759, district: 'Hapur' },
];

// Commodities with base prices
const COMMODITIES = [
  { name: 'Wheat', nameHindi: 'गेहूं', basePrice: 2275, unit: 'quintal', category: 'CEREALS' },
  { name: 'Rice', nameHindi: 'धान', basePrice: 2183, unit: 'quintal', category: 'CEREALS' },
  { name: 'Mustard', nameHindi: 'सरसों', basePrice: 5450, unit: 'quintal', category: 'OILSEEDS' },
  { name: 'Potato', nameHindi: 'आलू', basePrice: 1250, unit: 'quintal', category: 'VEGETABLES' },
  { name: 'Onion', nameHindi: 'प्याज', basePrice: 1800, unit: 'quintal', category: 'VEGETABLES' },
  { name: 'Sugarcane', nameHindi: 'गन्ना', basePrice: 350, unit: 'quintal', category: 'SUGAR' },
  { name: 'Cotton', nameHindi: 'कपास', basePrice: 6620, unit: 'quintal', category: 'FIBERS' },
  { name: 'Maize', nameHindi: 'मक्का', basePrice: 2090, unit: 'quintal', category: 'CEREALS' },
  { name: 'Chickpea', nameHindi: 'चना', basePrice: 5335, unit: 'quintal', category: 'PULSES' },
  { name: 'Lentil', nameHindi: 'मसूर', basePrice: 6000, unit: 'quintal', category: 'PULSES' },
  { name: 'Soybean', nameHindi: 'सोयाबीन', basePrice: 4600, unit: 'quintal', category: 'OILSEEDS' },
  { name: 'Barley', nameHindi: 'जौ', basePrice: 1850, unit: 'quintal', category: 'CEREALS' },
];

function generatePrice(basePrice: number, mandi: string, date: Date): { price: number; change: number; changePercent: number } {
  // Create deterministic but varying prices based on mandi and date
  const seed = mandi.charCodeAt(0) + date.getDate() + date.getMonth();
  const variation = ((Math.sin(seed) + 1) / 2) * 0.16 - 0.08; // -8% to +8%
  const price = Math.round(basePrice * (1 + variation));
  
  const yesterdaySeed = seed - 1;
  const yesterdayVariation = ((Math.sin(yesterdaySeed) + 1) / 2) * 0.16 - 0.08;
  const yesterdayPrice = Math.round(basePrice * (1 + yesterdayVariation));
  
  const change = price - yesterdayPrice;
  const changePercent = Math.round((change / yesterdayPrice) * 10000) / 100;
  
  return { price, change, changePercent };
}

function getTrend(changePercent: number): 'UP' | 'DOWN' | 'STABLE' {
  if (changePercent > 1) return 'UP';
  if (changePercent < -1) return 'DOWN';
  return 'STABLE';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return errors.methodNotAllowed(res, ['GET']);
  }

  try {
    const validationResult = marketPricesQuerySchema.safeParse(req.query);
    if (!validationResult.success) {
      return errors.validationError(res, validationResult.error.errors);
    }

    const { state, district, commodity, mandi, date } = validationResult.data;
    const today = date ? new Date(date) : new Date();
    
    let filteredMandis = UP_MANDIS;
    if (district) {
      filteredMandis = filteredMandis.filter(m => 
        m.district.toLowerCase() === district.toLowerCase() ||
        m.name.toLowerCase() === district.toLowerCase()
      );
    }
    if (mandi) {
      filteredMandis = filteredMandis.filter(m => 
        m.name.toLowerCase() === mandi.toLowerCase()
      );
    }

    let filteredCommodities = COMMODITIES;
    if (commodity) {
      filteredCommodities = filteredCommodities.filter(c => 
        c.name.toLowerCase() === commodity.toLowerCase() ||
        c.nameHindi === commodity
      );
    }

    const prices = [];
    for (const m of filteredMandis) {
      for (const c of filteredCommodities) {
        const { price, change, changePercent } = generatePrice(c.basePrice, m.name, today);
        const arrivals = Math.round(500 + Math.random() * 2000);
        
        prices.push({
          id: `${m.name}-${c.name}-${today.toISOString().split('T')[0]}`,
          commodity: c.name,
          commodityHindi: c.nameHindi,
          category: c.category,
          mandi: m.name,
          mandiHindi: m.nameHindi,
          district: m.district,
          state: 'UP',
          price,
          minPrice: Math.round(price * 0.95),
          maxPrice: Math.round(price * 1.05),
          unit: c.unit,
          change,
          changePercent,
          trend: getTrend(changePercent),
          arrivals,
          date: today.toISOString().split('T')[0],
          latitude: m.lat,
          longitude: m.lng,
        });
      }
    }

    const page = parseInt(req.query.page as string || '1', 10);
    const limit = parseInt(req.query.limit as string || '50', 10);
    const { items, meta } = paginate(prices, page, limit);

    return successResponse(res, {
      prices: items,
      summary: {
        totalMandis: filteredMandis.length,
        totalCommodities: filteredCommodities.length,
        date: today.toISOString().split('T')[0],
      },
    }, undefined, 200, meta);

  } catch (error) {
    console.error('Market prices error:', error);
    return errors.serverError(res, error as Error);
  }
}
