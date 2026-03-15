import prisma from '../../../src/lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { userId, commodity, targetPrice, condition, mandiId } = req.body
    if (!userId || !commodity || !targetPrice || !condition) {
      return res.status(400).json({ error: 'userId, commodity, targetPrice, condition are required' })
    }
    if (!['ABOVE', 'BELOW'].includes(condition)) {
      return res.status(400).json({ error: 'condition must be ABOVE or BELOW' })
    }

    const alert = await prisma.userPriceAlert.create({
      data: { userId, commodity, targetPrice: parseFloat(targetPrice), condition, mandiId: mandiId || null }
    })
    return res.status(201).json({ alert, message: 'Price alert set successfully' })
  } catch (err) {
    console.error('[mandi/price-alert]', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
