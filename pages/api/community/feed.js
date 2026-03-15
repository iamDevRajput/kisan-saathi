import prisma from '../../../src/lib/prisma'
import { getDistance } from '../../../src/lib/geoUtils'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { page = 1, limit = 10, filter = 'all', lat, lng, crop, userId } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const where = {}

    if (filter === 'my_crop' && crop) {
      where.crop = crop
    } else if (filter === 'alerts') {
      where.type = { in: ['PEST_ALERT', 'WEATHER_ALERT'] }
    } else if (filter === 'questions') {
      where.type = 'QUESTION'
    } else if (filter === 'tips') {
      where.type = 'TIP'
    }

    const posts = await prisma.post.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, image: true } },
        likes: userId ? { where: { userId } }    : false,
        saves: userId ? { where: { userId } }    : false,
        _count: { select: { likes: true, comments: true, saves: true } }
      },
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
      skip,
      take: parseInt(limit),
    })

    const total   = await prisma.post.count({ where })
    const hasMore = skip + posts.length < total

    // Enrich with distance if GPS provided
    let enriched = posts.map(p => ({
      ...p,
      hasLiked:  userId ? (p.likes?.length > 0)  : false,
      hasSaved:  userId ? (p.saves?.length > 0)  : false,
      distance:  (lat && lng && p.lat && p.lng)
        ? Math.round(getDistance(parseFloat(lat), parseFloat(lng), p.lat, p.lng) * 10) / 10
        : null,
    }))

    // Filter NEAR_ME
    if (filter === 'near_me' && lat && lng) {
      enriched = enriched.filter(p => p.distance !== null && p.distance <= 50)
    }

    return res.status(200).json({ posts: enriched, hasMore, total, page: parseInt(page) })
  } catch (err) {
    console.error('[community/feed]', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
