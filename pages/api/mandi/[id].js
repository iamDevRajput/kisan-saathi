import prisma from '../../../src/lib/prisma'

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const mandi = await prisma.mandi.findUnique({
        where: { id },
      })
      if (!mandi) return res.status(404).json({ error: 'Mandi not found' })

      // Get today's prices for all commodities
      const today = new Date(); today.setHours(0, 0, 0, 0)
      const prices = await prisma.mandiPrice.findMany({
        where: { mandiId: id, date: { gte: today } },
        orderBy: { price: 'desc' },
      })

      // 30-day price history grouped by commodity
      const thirtyDaysAgo = new Date(today)
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const history = await prisma.mandiPrice.findMany({
        where: { mandiId: id, date: { gte: thirtyDaysAgo } },
        orderBy: { date: 'asc' },
        select: { commodity, commodityHindi: true, price: true, date: true, changePercent: true, arrivals: true }
      })

      // Group history by commodity for Recharts
      const chartData = {}
      for (const row of history) {
        if (!chartData[row.commodity]) chartData[row.commodity] = []
        chartData[row.commodity].push({
          date: row.date.toISOString().split('T')[0],
          price: row.price,
          change: row.changePercent,
          arrivals: row.arrivals,
        })
      }

      return res.status(200).json({ mandi, todayPrices: prices, chartData })
    } catch (err) {
      console.error('[mandi/[id]]', err)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
