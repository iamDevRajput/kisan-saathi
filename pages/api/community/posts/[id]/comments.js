import prisma from '../../../../../src/lib/prisma'

export default async function handler(req, res) {
  const { id: postId } = req.query

  if (req.method === 'GET') {
    try {
      const { page = 1 } = req.query
      const skip = (parseInt(page) - 1) * 10

      const comments = await prisma.comment.findMany({
        where:   { postId, parentId: null },
        include: {
          user:    { select: { id: true, name: true, image: true } },
          replies: {
            include: { user: { select: { id: true, name: true, image: true } } },
            orderBy: { createdAt: 'asc' },
            take:    5,
          }
        },
        orderBy: [{ likesCount: 'desc' }, { createdAt: 'asc' }],
        skip,
        take: 10,
      })

      const total = await prisma.comment.count({ where: { postId, parentId: null } })
      return res.status(200).json({ comments, total, hasMore: skip + comments.length < total })
    } catch (err) {
      console.error('[posts/comments GET]', err)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  if (req.method === 'POST') {
    try {
      const { userId, content, parentId } = req.body
      if (!userId || !content) return res.status(400).json({ error: 'userId and content required' })

      const comment = await prisma.comment.create({
        data: { postId, userId, content, parentId: parentId || null },
        include: { user: { select: { id: true, name: true, image: true } } }
      })
      await prisma.post.update({ where: { id: postId }, data: { commentsCount: { increment: 1 } } })
      return res.status(201).json({ comment })
    } catch (err) {
      console.error('[posts/comments POST]', err)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
