import prisma from '../../../src/lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { lat, lng, radius = 50 } = req.query
    if (!lat || !lng) return res.status(400).json({ error: 'lat and lng required' })

    const R = 6371
    const userLat = parseFloat(lat)
    const userLng = parseFloat(lng)

    // Get recent pest + weather alerts (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000)
    const alerts = await prisma.post.findMany({
      where:   { type: { in: ['PEST_ALERT', 'WEATHER_ALERT'] }, createdAt: { gte: sevenDaysAgo }, lat: { not: null } },
      include: { user: { select: { name: true, image: true } } },
      orderBy: { createdAt: 'desc' },
    })

    // Filter by radius
    const r = parseFloat(radius)
    const nearby = alerts.filter(a => {
      if (!a.lat || !a.lng) return false
      const dLat = (a.lat - userLat) * Math.PI / 180
      const dLng = (a.lng - userLng) * Math.PI / 180
      const x = Math.sin(dLat/2)**2 + Math.cos(userLat*Math.PI/180)*Math.cos(a.lat*Math.PI/180)*Math.sin(dLng/2)**2
      const dist = R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x))
      return dist <= r
    }).slice(0, 10)

    return res.status(200).json({ alerts: nearby, total: nearby.length })
  } catch (err) {
    console.error('[community/nearby-alerts]', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
