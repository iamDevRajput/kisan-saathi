import prisma from '../../../../../src/lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { id: postId } = req.query
  const { userId } = req.body
  if (!userId) return res.status(400).json({ error: 'userId required' })

  try {
    const existing = await prisma.postSave.findUnique({
      where: { postId_userId: { postId, userId } }
    })

    if (existing) {
      await prisma.postSave.delete({ where: { postId_userId: { postId, userId } } })
      await prisma.post.update({ where: { id: postId }, data: { savesCount: { decrement: 1 } } })
      return res.status(200).json({ saved: false })
    } else {
      await prisma.postSave.create({ data: { postId, userId } })
      await prisma.post.update({ where: { id: postId }, data: { savesCount: { increment: 1 } } })
      return res.status(200).json({ saved: true })
    }
  } catch (err) {
    console.error('[posts/save]', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
