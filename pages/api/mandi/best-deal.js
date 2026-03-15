import prisma from '../../../../src/lib/prisma'
import { getDistance, getDriveTime, formatPrice, savingsVsNearest } from '../../../../src/lib/geoUtils'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { commodity, lat, lng } = req.query
    if (!commodity) return res.status(400).json({ error: 'commodity is required' })

    const today = new Date(); today.setHours(0, 0, 0, 0)

    // Get today's prices for this commodity across all mandis
    const prices = await prisma.mandiPrice.findMany({
      where: { commodity, date: { gte: today } },
      include: { mandi: true },
      orderBy: { price: 'desc' },
      take: 20,
    })

    let enriched = prices.map(p => ({
      mandi: p.mandi,
      price: p.price,
      minPrice: p.minPrice,
      maxPrice: p.maxPrice,
      arrivals: p.arrivals,
      change: p.change,
      changePercent: p.changePercent,
      distance: null,
      driveTime: null,
    }))

    // Enrich with distance if GPS provided
    if (lat && lng) {
      enriched = enriched.map(e => {
        const dist = getDistance(parseFloat(lat), parseFloat(lng), e.mandi.lat, e.mandi.lng)
        return { ...e, distance: Math.round(dist * 10) / 10, driveTime: getDriveTime(dist) }
      })
      // Filter within 100km
      enriched = enriched.filter(e => e.distance <= 100)
    }

    // Top 3 by price
    const top3 = enriched.slice(0, 3)

    // Savings calculation: best vs nearest
    if (top3.length >= 2 && lat && lng) {
      const nearest = [...enriched].sort((a, b) => (a.distance || 999) - (b.distance || 999))[0]
      top3[0].savings = savingsVsNearest(top3[0].price, nearest?.price)
    }

    return res.status(200).json({ top3, commodity, total: enriched.length })
  } catch (err) {
    console.error('[mandi/best-deal]', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
