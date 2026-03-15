import Anthropic from '@anthropic-ai/sdk'
import prisma from '../../../src/lib/prisma'
import { getDistance } from '../../../src/lib/geoUtils'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { commodity, quantity, userLat, userLng, district } = req.body
    if (!commodity || !userLat || !userLng) {
      return res.status(400).json({ error: 'commodity, userLat, userLng are required' })
    }

    // Fetch today's prices for this commodity from nearby mandis
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const allPrices = await prisma.mandiPrice.findMany({
      where:   { commodity, date: { gte: today } },
      include: { mandi: true },
    })

    const nearby = allPrices
      .map(p => ({
        name:      p.mandi.name,
        nameHindi: p.mandi.nameHindi,
        district:  p.mandi.district,
        price:     p.price,
        arrivals:  p.arrivals,
        distance:  Math.round(getDistance(parseFloat(userLat), parseFloat(userLng), p.mandi.lat, p.mandi.lng) * 10) / 10,
      }))
      .filter(m => m.distance <= 150)
      .sort((a, b) => b.price - a.price)
      .slice(0, 6)

    if (nearby.length === 0) {
      return res.status(200).json({ recommendation: 'आपके 150 km क्षेत्र में आज का मंडी डेटा उपलब्ध नहीं है। कल पुनः प्रयास करें।' })
    }

    const mandiText = nearby.map(m =>
      `${m.nameHindi} (${m.district}, ${m.distance} km): ₹${m.price}/क्विंटल, आवक: ${m.arrivals} क्विंटल`
    ).join('\n')

    const prompt = `आप एक कृषि विशेषज्ञ हैं। एक किसान के लिए सलाह दीजिए:

किसान के पास: ${quantity || 'कुछ'} क्विंटल ${commodity} है
किसान का इलाका: ${district || 'उत्तर प्रदेश'}
आज का मंडी डेटा (नज़दीकी मंडियां):
${mandiText}

कृपया बताएं:
1. किस मंडी में बेचना सबसे फ़ायदेमंद होगा और क्यों?
2. आज बेचें या कुछ दिन रुकें?
3. अगले 3-5 दिनों में भाव का अनुमान?
4. परिवहन लागत से नेट फ़ायदा क्या होगा?

हिंदी में 4-5 वाक्यों में सीधी, व्यावहारिक सलाह दें। ₹ की मात्रा स्पष्ट लिखें।`

    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }]
    })

    const recommendation = message.content[0].text

    return res.status(200).json({ recommendation, mandiData: nearby })
  } catch (err) {
    console.error('[mandi/ai-recommendation]', err)
    return res.status(500).json({ error: 'AI recommendation failed' })
  }
}
