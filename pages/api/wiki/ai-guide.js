import prisma from '../../../src/lib/prisma'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function getCurrentSeason() {
  const month = new Date().getMonth() + 1
  if (month >= 10 || month <= 3) return 'Rabi (रबी)'
  if (month >= 6 && month <= 9) return 'Kharif (खरीफ)'
  return 'Zaid (जायद)'
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const { cropSlug, district, landArea, experience } = req.body

  if (!cropSlug || !district || !landArea || !experience) {
    return res.status(400).json({ success: false, error: 'cropSlug, district, landArea, experience are required' })
  }

  try {
    const crop = await prisma.cropWiki.findUnique({
      where: { slug: cropSlug },
      select: { nameHindi: true, name: true, seasons: true, profitAnalysis: true, nutrition: true, pestsDiseases: true }
    })

    if (!crop) {
      return res.status(404).json({ success: false, error: 'Crop not found' })
    }

    const today = new Date().toLocaleDateString('hi-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    const currentSeason = getCurrentSeason()

    const prompt = `You are an expert Indian agronomist. Create a personalized farming guide for ${crop.nameHindi} (${crop.name}) in ${district}, Uttar Pradesh.

Farm Details:
- Land: ${landArea} acres
- Experience: ${experience}
- Season: ${currentSeason}
- Date: ${today}
- Crop Data: ${JSON.stringify({ seasons: crop.seasons, nutrition: crop.nutrition, profitAnalysis: crop.profitAnalysis })}

Return ONLY valid JSON (no extra text):
{
  "personalizedTips": ["tip1 in Hindi", "tip2 in Hindi", "tip3 in Hindi", "tip4 in Hindi", "tip5 in Hindi"],
  "weeklyTasks": [
    {"week": 1, "tasks": ["task1 in Hindi", "task2 in Hindi"]},
    {"week": 2, "tasks": ["task1 in Hindi", "task2 in Hindi"]},
    {"week": 3, "tasks": ["task1 in Hindi"]},
    {"week": 4, "tasks": ["task1 in Hindi", "task2 in Hindi"]}
  ],
  "estimatedCost": 75000,
  "estimatedProfit": 150000,
  "bestVariety": "variety name for this district",
  "firstActionToday": "Specific action to take today in Hindi with ₹ amount",
  "warnings": ["warning1 in Hindi", "warning2 in Hindi"]
}

All text must be in Hindi. Include specific ₹ amounts. Be specific to ${district} district conditions.`

    // If no valid key is provided, return mock data
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your-anthropic-api-key') {
      console.log('No valid ANTHROPIC_API_KEY found, returning mock guide.')
      return res.status(200).json({ 
        success: true, 
        data: { 
          crop: { name: crop.nameHindi || crop.name }, 
          guide: {
            personalizedTips: ['मिट्टी की अच्छी तरह जुताई करें।', 'समय पर खाद डालें।', 'उचित सिंचाई का ध्यान रखें।'],
            weeklyTasks: [
              { week: 1, tasks: ['खेत की तैयारी', 'बीज उपचार'] },
              { week: 2, tasks: ['बुवाई', 'हल्की सिंचाई'] },
              { week: 3, tasks: ['निराई-गुड़ाई'] },
              { week: 4, tasks: ['पहली खाद डालना'] }
            ],
            estimatedCost: Number(landArea) * 15000,
            estimatedProfit: Number(landArea) * 45000,
            bestVariety: 'उन्नत स्थानीय किस्म',
            firstActionToday: 'खेत की मिट्टी की जाँच करवाएं (₹500)',
            warnings: ['मौसम के अनुसार सिंचाई बदलें।', 'कीटों का ध्यान रखें।']
          } 
        } 
      })
    }

    const message = await anthropic.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }]
    })

    let aiData
    try {
      const raw = message.content[0].text.trim()
      const jsonMatch = raw.match(/\{[\s\S]*\}/)
      aiData = JSON.parse(jsonMatch ? jsonMatch[0] : raw)
    } catch {
      aiData = {
        personalizedTips: ['AI से जानकारी लोड हो रही है...'],
        weeklyTasks: [{ week: 1, tasks: ['आज अपने खेत की जाँच करें।'] }],
        estimatedCost: Number(landArea) * 18000,
        estimatedProfit: Number(landArea) * 50000,
        bestVariety: 'स्थानीय किस्म',
        firstActionToday: 'अपने खेत की मिट्टी जाँच करवाएं।',
        warnings: []
      }
    }

    return res.status(200).json({ success: true, data: { crop: { name: crop.nameHindi }, guide: aiData } })
  } catch (error) {
    console.error('[wiki/ai-guide] Error:', error)
    return res.status(500).json({ success: false, error: 'AI guide generation failed' })
  } finally {
    await prisma.$disconnect()
  }
}
