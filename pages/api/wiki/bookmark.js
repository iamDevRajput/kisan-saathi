import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import prisma from '../../../src/lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const session = await getServerSession(req, res, authOptions)
  if (!session?.user) {
    return res.status(401).json({ success: false, error: 'Authentication required' })
  }

  const { cropSlug } = req.body
  if (!cropSlug) {
    return res.status(400).json({ success: false, error: 'cropSlug is required' })
  }

  const userId = session.user.id || session.user.email

  try {
    const existing = await prisma.wikiBookmark.findUnique({
      where: { userId_cropSlug: { userId, cropSlug } }
    })

    if (existing) {
      await prisma.wikiBookmark.delete({ where: { userId_cropSlug: { userId, cropSlug } } })
      return res.status(200).json({ success: true, data: { bookmarked: false } })
    } else {
      await prisma.wikiBookmark.create({ data: { userId, cropSlug } })
      return res.status(200).json({ success: true, data: { bookmarked: true } })
    }
  } catch (error) {
    console.error('[wiki/bookmark] Error:', error)
    return res.status(500).json({ success: false, error: 'Bookmark operation failed' })
  } finally {
    await prisma.$disconnect()
  }
}
