import prisma from '../../../src/lib/prisma'
import { getDistance, getDriveTime, isMandiOpen, sortMandis } from '../../../src/lib/geoUtils'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { lat, lng, radius = 50, commodity } = req.body

    if (!lat || !lng) {
      return res.status(400).json({ error: 'lat and lng are required' })
    }

    // Fetch all active mandis
    const mandis = await prisma.mandi.findMany({
      where: { isActive: true },
    })

    const today     = new Date(); today.setHours(0, 0, 0, 0)
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1)

    // Filter by radius + enrich with distance, price, change
    const enriched = await Promise.all(
      mandis.map(async (m) => {
        const distance = getDistance(lat, lng, m.lat, m.lng)
        if (distance > radius) return null

        let todayPrice     = null
        let yesterdayPrice = null
        let changePercent  = 0
        let change         = 0
        let arrivals       = 0

        if (commodity) {
          const [todayRow, yesterdayRow] = await Promise.all([
            prisma.mandiPrice.findFirst({
              where: { mandiId: m.id, commodity, date: { gte: today } },
              orderBy: { date: 'desc' }
            }),
            prisma.mandiPrice.findFirst({
              where: { mandiId: m.id, commodity, date: { gte: yesterday, lt: today } },
              orderBy: { date: 'desc' }
            })
          ])
          if (todayRow) {
            todayPrice     = todayRow.price
            arrivals       = todayRow.arrivals
            changePercent  = todayRow.changePercent
            change         = todayRow.change
          }
          if (yesterdayRow) yesterdayPrice = yesterdayRow.price
        }

        return {
          ...m,
          distance:      Math.round(distance * 10) / 10,
          driveTime:     getDriveTime(distance),
          todayPrice,
          yesterdayPrice,
          changePercent,
          change,
          arrivals,
          isOpen:        isMandiOpen(m.openTime),
          isBestPrice:   false, // filled below
        }
      })
    )

    const filtered = enriched.filter(Boolean)

    // Mark best price mandi
    if (commodity && filtered.length > 0) {
      const maxPrice = Math.max(...filtered.map(m => m.todayPrice || 0))
      filtered.forEach(m => { m.isBestPrice = m.todayPrice === maxPrice && maxPrice > 0 })
    }

    // Sort: price desc if commodity, else distance asc
    const sorted = sortMandis(filtered, commodity ? 'price' : 'distance')

    return res.status(200).json({
      mandis: sorted,
      total:  sorted.length,
      radius,
      commodity: commodity || null,
    })
  } catch (err) {
    console.error('[mandi/nearby]', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
