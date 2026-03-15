// pages/api/wiki/recommend.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    const { district, soil, irrigation, area, budget, season } = req.body

    // Simple mapping for UP districts to lat/lng for Weather API
    const districtCoords = {
      'Agra': { lat: 27.1767, lng: 78.0081 },
      'Aligarh': { lat: 27.8974, lng: 78.0880 },
      'Meerut': { lat: 28.9845, lng: 77.7064 },
      'Lucknow': { lat: 26.8467, lng: 80.9462 },
      'Kanpur': { lat: 26.4499, lng: 80.3319 },
      'Varanasi': { lat: 25.3176, lng: 82.9739 },
      // Default to center UP if not exact
      'default': { lat: 26.8467, lng: 80.9462 }
    }

    const coords = districtCoords[district] || districtCoords['default']

    // 1. Fetch Weather from Open-Meteo
    let weatherData = null
    try {
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&current=temperature_2m,relative_humidity_2m,precipitation&timezone=Asia/Kolkata`
      const weatherRes = await fetch(weatherUrl)
      if (weatherRes.ok) {
        const wJson = await weatherRes.json()
        weatherData = wJson.current
      }
    } catch (e) {
      console.error('Weather API failed', e)
    }

    // Prepare weather string
    const weatherString = weatherData 
      ? `Current Temp: ${weatherData.temperature_2m}°C, Humidity: ${weatherData.relative_humidity_2m}%` 
      : 'Typical seasonal weather for UP'

    // 2. Call Anthropic API
    const prompt = `
You are an Expert Indian agricultural scientist.
The user wants crop recommendations for farming in Uttar Pradesh with these details:
- District: ${district}
- Soil Type: ${soil}
- Irrigation Facility: ${irrigation}
- Land Area (Acres): ${area}
- Budget: ${budget}
- Season: ${season}
- Live Weather: ${weatherString}

You MUST return a JSON object with EXACTLY this structure:
{
  "recommendations": [
    {
      "rank": 1,
      "cropName": "English Name",
      "cropNameHindi": "Hindi Name",
      "cropSlug": "url-slug-example-wheat",
      "matchPercent": 95,
      "profitPerAcre": "Estimated Profit (Number format like 30000)",
      "investmentPerAcre": "Estimated Cost (Number like 15000)",
      "duration": "120 days",
      "whyGood": ["Reason 1", "Reason 2"],
      "warnings": ["Warning 1", "Warning 2"],
      "bestVariety": "Variety Name",
      "soilScore": 9,
      "waterScore": 8,
      "seasonScore": 10,
      "budgetScore": 9
    }
  ],
  "summary": "Brief English summary of the analysis",
  "summaryHindi": "Brief Hindi summary of the analysis",
  "seasonAdvice": "English advice for the season",
  "weatherNote": "English note based on current weather",
  "weatherNoteHindi": "Hindi note based on current weather"
}

Provide exactly 3 recommendations. Reply ONLY with the valid JSON, no markdown formatting (\`\`\`json etc.). Do not include any other text.
`

    const anthropicKey = process.env.ANTHROPIC_API_KEY
    
    // If no API key or default placeholder, return detailed mock response that matches schema
    if (!anthropicKey || anthropicKey === 'your-anthropic-api-key') {
      console.log('No ANTHROPIC_API_KEY found, returning rich mock data.')
      return res.status(200).json({
        success: true,
        data: {
          summary: "Based on your inputs (Alluvial soil, tubewell irrigation in Rabi season), the optimal choices are traditional winter staples with high market demand.",
          summaryHindi: "आपके इनपुट (जलोढ़ मिट्टी, ट्यूबवेल सिंचाई और रबी सीजन) के आधार पर, सबसे अच्छे विकल्प पारंपरिक सर्दियों की फसलें हैं जिनकी बाजार में अच्छी मांग है।",
          weatherNote: `Current condition: ${weatherData ? weatherData.temperature_2m : '25'}°C. Perfect for early sowing.`,
          weatherNoteHindi: `वर्तमान स्थिति: ${weatherData ? weatherData.temperature_2m : '25'}°C. जल्दी बुवाई के लिए उत्तम।`,
          seasonAdvice: "Ensure timely sowing within the next 2-3 weeks.",
          recommendations: [
            {
              rank: 1,
              cropName: "Wheat",
              cropNameHindi: "गेहूं",
              cropSlug: "wheat",
              matchPercent: 96,
              profitPerAcre: 25000,
              investmentPerAcre: 15000,
              duration: "135 days",
              whyGood: ["Perfect match for your loamy soil", "Reliable market price (MSP)", "Tubewell irrigation is sufficient"],
              warnings: ["Requires timely 3-4 irrigations", "Watch out for unseasonal rains at maturity"],
              bestVariety: "HD 2967",
              soilScore: 9,
              waterScore: 9,
              seasonScore: 10,
              budgetScore: 9
            },
            {
              rank: 2,
              cropName: "Mustard",
              cropNameHindi: "सरसों",
              cropSlug: "mustard",
              matchPercent: 88,
              profitPerAcre: 32000,
              investmentPerAcre: 12000,
              duration: "110 days",
              whyGood: ["Lower water requirement", "High current market price for oilseeds", "Fits well in mixed cropping"],
              warnings: ["Susceptible to frost damage in Jan", "Aphid attacks require monitoring"],
              bestVariety: "Pusa Mustard-30",
              soilScore: 8,
              waterScore: 10,
              seasonScore: 9,
              budgetScore: 10
            },
            {
              rank: 3,
              cropName: "Potato",
              cropNameHindi: "आलू",
              cropSlug: "potato",
              matchPercent: 82,
              profitPerAcre: 45000,
              investmentPerAcre: 28000,
              duration: "90 days",
              whyGood: ["High cash return per acre", "Short duration, allows summer crop", "Tubewell supports required frequent light irrigation"],
              warnings: ["High initial seed cost", "High risk of Late Blight disease", "Cold storage costs may apply if market is low"],
              bestVariety: "Kufri Bahar",
              soilScore: 9,
              waterScore: 7,
              seasonScore: 8,
              budgetScore: 6
            }
          ]
        }
      })
    }

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022', // updated to latest model
        max_tokens: 1500,
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    })

    if (!anthropicRes.ok) {
      const errorText = await anthropicRes.text()
      console.error('Anthropic API Error:', errorText)
      throw new Error('AI API failed')
    }

    const aiData = await anthropicRes.json()
    const responseText = aiData.content[0].text
    
    // Parse JSON
    let parsedResult
    try {
      const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim()
      parsedResult = JSON.parse(jsonStr)
    } catch (e) {
      console.error('Failed to parse Anthropic JSON:', responseText)
      throw new Error('Invalid JSON from AI')
    }

    return res.status(200).json({ success: true, data: parsedResult })
  } catch (error) {
    console.error('Recommend API Error:', error)
    return res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}
