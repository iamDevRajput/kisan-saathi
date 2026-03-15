// pages/api/wiki/recommend.js

const MOCK_RESPONSE = (district, soil, season, weatherData) => ({
  summary: `Based on your ${district} location, ${soil} soil and ${season} season, the top recommendations are traditional winter staples with high market demand.`,
  summaryHindi: `${district} में आपकी ${soil} मिट्टी और ${season} सीजन के आधार पर, ये फसलें सबसे अच्छी हैं।`,
  weatherNote: `Current condition: ${weatherData ? weatherData.temperature_2m : '22'}°C, humidity ${weatherData ? weatherData.relative_humidity_2m : '60'}%. Ideal for sowing.`,
  weatherNoteHindi: `वर्तमान स्थिति: ${weatherData ? weatherData.temperature_2m : '22'}°C. बुवाई के लिए उत्तम।`,
  seasonAdvice: 'Ensure timely sowing within the next 2-3 weeks for best yield.',
  recommendations: [
    {
      rank: 1,
      cropName: 'Wheat',
      cropNameHindi: 'गेहूं',
      cropSlug: 'wheat',
      matchPercent: 96,
      profitPerAcre: 25000,
      investmentPerAcre: 15000,
      duration: '135 days',
      whyGood: [
        'Perfect match for your loamy soil',
        'Reliable government MSP price',
        'Tubewell irrigation is sufficient'
      ],
      warnings: [
        'Requires timely 3-4 irrigations',
        'Watch out for unseasonal rains at maturity'
      ],
      bestVariety: 'HD 2967',
      soilScore: 9,
      waterScore: 9,
      seasonScore: 10,
      budgetScore: 9
    },
    {
      rank: 2,
      cropName: 'Mustard',
      cropNameHindi: 'सरसों',
      cropSlug: 'mustard',
      matchPercent: 88,
      profitPerAcre: 32000,
      investmentPerAcre: 12000,
      duration: '110 days',
      whyGood: [
        'Lower water requirement than wheat',
        'High current market price for oilseeds',
        'Fits well in mixed cropping system'
      ],
      warnings: [
        'Susceptible to frost damage in January',
        'Monitor for aphid attacks'
      ],
      bestVariety: 'Pusa Mustard-30',
      soilScore: 8,
      waterScore: 10,
      seasonScore: 9,
      budgetScore: 10
    },
    {
      rank: 3,
      cropName: 'Potato',
      cropNameHindi: 'आलू',
      cropSlug: 'potato',
      matchPercent: 82,
      profitPerAcre: 45000,
      investmentPerAcre: 28000,
      duration: '90 days',
      whyGood: [
        'Highest cash return per acre',
        'Short duration allows a summer crop after',
        'Tubewell supports required frequent light irrigation'
      ],
      warnings: [
        'High initial seed and input cost',
        'High risk of Late Blight disease',
        'Market price volatility'
      ],
      bestVariety: 'Kufri Bahar',
      soilScore: 9,
      waterScore: 7,
      seasonScore: 8,
      budgetScore: 6
    }
  ]
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  console.log('[recommend.js] API called with body:', req.body)

  try {
    const { district, soil, irrigation, area, budget, season } = req.body

    if (!district || !soil || !season) {
      return res.status(400).json({ success: false, error: 'Missing required fields: district, soil, season' })
    }

    // Lat/lng for UP districts for weather API
    const districtCoords = {
      'Agra': { lat: 27.1767, lng: 78.0081 },
      'Aligarh': { lat: 27.8974, lng: 78.0880 },
      'Meerut': { lat: 28.9845, lng: 77.7064 },
      'Lucknow': { lat: 26.8467, lng: 80.9462 },
      'Kanpur': { lat: 26.4499, lng: 80.3319 },
      'Varanasi': { lat: 25.3176, lng: 82.9739 },
      'default': { lat: 26.8467, lng: 80.9462 }
    }

    const coords = districtCoords[district] || districtCoords['default']

    // Fetch weather from Open-Meteo (free, no key needed)
    let weatherData = null
    try {
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&current=temperature_2m,relative_humidity_2m,precipitation&timezone=Asia/Kolkata`
      const weatherRes = await fetch(weatherUrl, { signal: AbortSignal.timeout(3000) })
      if (weatherRes.ok) {
        const wJson = await weatherRes.json()
        weatherData = wJson.current
        console.log('[recommend.js] Weather fetched:', weatherData)
      }
    } catch (e) {
      console.warn('[recommend.js] Weather API failed, continuing without weather data:', e.message)
    }

    const anthropicKey = process.env.ANTHROPIC_API_KEY

    // If no valid API key, return rich mock data
    if (!anthropicKey || anthropicKey === 'your-anthropic-api-key' || anthropicKey === 'your_key_here') {
      console.log('[recommend.js] No valid ANTHROPIC_API_KEY. Returning rich mock data.')
      return res.status(200).json({
        success: true,
        data: MOCK_RESPONSE(district, soil, season, weatherData)
      })
    }

    // Real Anthropic call
    const weatherString = weatherData
      ? `Current Temp: ${weatherData.temperature_2m}°C, Humidity: ${weatherData.relative_humidity_2m}%`
      : 'Typical seasonal weather for Uttar Pradesh'

    const prompt = `You are an expert Indian agricultural scientist advising a farmer in Uttar Pradesh.
Farmer's details:
- District: ${district}, Uttar Pradesh
- Soil Type: ${soil}
- Irrigation: ${irrigation}
- Land Area: ${area} acres
- Budget: ${budget}
- Season: ${season}
- Live Weather: ${weatherString}

Return a JSON object with EXACTLY this structure (no markdown, no backticks, just raw JSON):
{
  "summary": "English summary sentence",
  "summaryHindi": "Hindi summary sentence",
  "weatherNote": "English weather note",
  "weatherNoteHindi": "Hindi weather note",
  "seasonAdvice": "English season advice",
  "recommendations": [
    {
      "rank": 1,
      "cropName": "English Name",
      "cropNameHindi": "Hindi Name",
      "cropSlug": "lowercase-slug",
      "matchPercent": 95,
      "profitPerAcre": 25000,
      "investmentPerAcre": 15000,
      "duration": "120 days",
      "whyGood": ["reason 1", "reason 2", "reason 3"],
      "warnings": ["warning 1", "warning 2"],
      "bestVariety": "Variety Name",
      "soilScore": 9,
      "waterScore": 8,
      "seasonScore": 10,
      "budgetScore": 9
    }
  ]
}
Provide exactly 3 recommendations. Reply ONLY with valid JSON.`

    console.log('[recommend.js] Calling Anthropic API...')
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }]
      })
    })

    if (!anthropicRes.ok) {
      const errData = await anthropicRes.json()
      console.error('[recommend.js] Anthropic API error:', errData)
      // Fall back to mock data when API fails
      console.log('[recommend.js] Falling back to mock data due to API error.')
      return res.status(200).json({
        success: true,
        data: MOCK_RESPONSE(district, soil, season, weatherData)
      })
    }

    const aiData = await anthropicRes.json()
    console.log('[recommend.js] Anthropic raw response (first 300 chars):', JSON.stringify(aiData).substring(0, 300))

    const responseText = aiData.content?.[0]?.text || ''
    console.log('[recommend.js] AI text (first 200 chars):', responseText.substring(0, 200))

    // Clean and parse JSON – strip markdown code fences if Claude adds them
    let parsedResult
    try {
      const cleaned = responseText
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```\s*$/i, '')
        .trim()
      parsedResult = JSON.parse(cleaned)
    } catch (e) {
      console.error('[recommend.js] Failed to parse AI JSON, falling back to mock. Raw text:', responseText)
      return res.status(200).json({
        success: true,
        data: MOCK_RESPONSE(district, soil, season, weatherData)
      })
    }

    console.log('[recommend.js] Sending structured result to client.')
    return res.status(200).json({ success: true, data: parsedResult })

  } catch (error) {
    console.error('[recommend.js] Fatal error:', error.message)
    return res.status(500).json({ success: false, error: 'Failed to generate recommendations' })
  }
}
