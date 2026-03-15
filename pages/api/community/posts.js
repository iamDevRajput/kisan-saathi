import prisma from '../../../src/lib/prisma'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { userId, type, title, content, images = [], tags = [], crop, isAnonymous, lat, lng, district, state } = req.body
      if (!userId || !type || !content) {
        return res.status(400).json({ error: 'userId, type, content are required' })
      }

      const post = await prisma.post.create({
        data: {
          userId, type, title, content, images, tags,
          crop: crop || null, isAnonymous: !!isAnonymous,
          lat: lat ? parseFloat(lat) : null,
          lng: lng ? parseFloat(lng) : null,
          district: district || null,
          state: state || null,
        },
        include: { user: { select: { id: true, name: true, image: true } } }
      })

      // Update postsCount on FarmerProfile
      await prisma.farmerProfile.upsert({
        where:  { userId },
        create: { userId, postsCount: 1 },
        update: { postsCount: { increment: 1 } }
      }).catch(() => {}) // non-critical

      return res.status(201).json({ post })
    } catch (err) {
      console.error('[community/posts POST]', err)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
