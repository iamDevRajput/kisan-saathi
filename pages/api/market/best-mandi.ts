import type { NextApiRequest, NextApiResponse } from 'next';
import { successResponse, errors } from '../../../lib/apiResponse';
import { bestMandiQuerySchema } from '../../../lib/validators';

const UP_MANDIS = [
  { name: 'Meerut', lat: 28.9845, lng: 77.7064 },
  { name: 'Agra', lat: 27.1767, lng: 78.0081 },
  { name: 'Lucknow', lat: 26.8467, lng: 80.9462 },
  { name: 'Varanasi', lat: 25.3176, lng: 82.9739 },
  { name: 'Kanpur', lat: 26.4499, lng: 80.3319 },
  { name: 'Mathura', lat: 27.4924, lng: 77.6737 },
  { name: 'Aligarh', lat: 27.8974, lng: 78.0880 },
  { name: 'Bareilly', lat: 28.3670, lng: 79.4304 },
  { name: 'Moradabad', lat: 28.8386, lng: 78.7733 },
  { name: 'Gorakhpur', lat: 26.7606, lng: 83.3732 },
  { name: 'Jhansi', lat: 25.4484, lng: 78.5685 },
  { name: 'Prayagraj', lat: 25.4358, lng: 81.8463 },
  { name: 'Saharanpur', lat: 29.9680, lng: 77.5510 },
  { name: 'Muzaffarnagar', lat: 29.4727, lng: 77.7085 },
  { name: 'Hapur', lat: 28.7307, lng: 77.7759 },
];

const BASE_PRICES: Record<string, number> = {
  wheat: 2275, rice: 2183, mustard: 5450, potato: 1250,
  onion: 1800, sugarcane: 350, cotton: 6620, maize: 2090,
  chickpea: 5335, lentil: 6000, soybean: 4600, barley: 1850,
};

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function generatePrice(basePrice: number, mandiName: string): number {
  const seed = mandiName.charCodeAt(0) + new Date().getDate();
  const variation = ((Math.sin(seed) + 1) / 2) * 0.16 - 0.08;
  return Math.round(basePrice * (1 + variation));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return errors.methodNotAllowed(res, ['GET']);
  }

  try {
    const validationResult = bestMandiQuerySchema.safeParse(req.query);
    if (!validationResult.success) {
      return errors.validationError(res, validationResult.error.errors);
    }

    const { commodity, userLat, userLng, radiusKm } = validationResult.data;
    const basePrice = BASE_PRICES[commodity.toLowerCase()] || 2000;

    const mandisWithData = UP_MANDIS.map(mandi => {
      const distance = calculateDistance(userLat, userLng, mandi.lat, mandi.lng);
      const price = generatePrice(basePrice, mandi.name);
      return {
        ...mandi,
        distance: Math.round(distance * 10) / 10,
        price,
        inRange: distance <= radiusKm,
      };
    });

    const mandisInRange = mandisWithData
      .filter(m => m.inRange)
      .sort((a, b) => b.price - a.price);

    if (mandisInRange.length === 0) {
      return successResponse(res, {
        bestMandi: null,
        message: `${radiusKm} किमी के दायरे में कोई मंडी नहीं मिली`,
        nearestMandi: mandisWithData.sort((a, b) => a.distance - b.distance)[0],
      });
    }

    const bestMandi = mandisInRange[0];
    const avgPrice = Math.round(mandisInRange.reduce((sum, m) => sum + m.price, 0) / mandisInRange.length);

    return successResponse(res, {
      commodity,
      userLocation: { lat: userLat, lng: userLng },
      radiusKm,
      bestMandi: {
        name: bestMandi.name,
        price: bestMandi.price,
        distance: bestMandi.distance,
        priceAdvantage: bestMandi.price - avgPrice,
        coordinates: { lat: bestMandi.lat, lng: bestMandi.lng },
      },
      alternatives: mandisInRange.slice(1, 4).map(m => ({
        name: m.name,
        price: m.price,
        distance: m.distance,
      })),
      summary: {
        mandisInRange: mandisInRange.length,
        avgPrice,
        highestPrice: bestMandi.price,
        lowestPrice: mandisInRange[mandisInRange.length - 1].price,
      },
    });

  } catch (error) {
    console.error('Best mandi error:', error);
    return errors.serverError(res, error as Error);
  }
}
