// Mock data for crop wiki - no database required
const MOCK_CROPS = [
  {
    slug: 'wheat',
    name: 'Wheat',
    nameHindi: 'गेहूं',
    emoji: '🌾',
    category: 'CEREAL',
    seasons: { primary: 'Rabi', secondary: null },
    profitAnalysis: { rating: 4.5, marketDemand: 'High' }
  },
  {
    slug: 'mustard',
    name: 'Mustard',
    nameHindi: 'सरसों',
    emoji: '🌻',
    category: 'OILSEED',
    seasons: { primary: 'Rabi', secondary: null },
    profitAnalysis: { rating: 4.2, marketDemand: 'High' }
  },
  {
    slug: 'chickpea',
    name: 'Chickpea',
    nameHindi: 'चना',
    emoji: '🫘',
    category: 'PULSE',
    seasons: { primary: 'Rabi', secondary: null },
    profitAnalysis: { rating: 4.0, marketDemand: 'Medium' }
  },
  {
    slug: 'rice',
    name: 'Rice',
    nameHindi: 'धान',
    emoji: '🍚',
    category: 'CEREAL',
    seasons: { primary: 'Kharif', secondary: null },
    profitAnalysis: { rating: 4.3, marketDemand: 'High' }
  },
  {
    slug: 'cotton',
    name: 'Cotton',
    nameHindi: 'कपास',
    emoji: '🧶',
    category: 'FIBER',
    seasons: { primary: 'Kharif', secondary: null },
    profitAnalysis: { rating: 4.1, marketDemand: 'High' }
  }
]

function getCurrentSeason() {
  const month = new Date().getMonth() + 1
  if (month >= 10 || month <= 3) return 'Rabi'
  if (month >= 6 && month <= 9) return 'Kharif'
  return 'Zaid'
}

const SEASON_LABELS = {
  Rabi: { label: 'रबी', period: 'अक्टूबर - मार्च', months: 'Oct-Mar' },
  Kharif: { label: 'खरीफ', period: 'जून - सितंबर', months: 'Jun-Sep' },
  Zaid: { label: 'जायद', period: 'अप्रैल - जून', months: 'Apr-Jun' }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const currentSeason = getCurrentSeason()
    
    // Filter crops for current season
    const crops = MOCK_CROPS.filter(crop => 
      crop.seasons.primary === currentSeason || 
      crop.seasons.primary === 'Both' ||
      crop.seasons.primary === 'Annual'
    ).slice(0, 10)

    return res.status(200).json({
      success: true,
      data: {
        season: currentSeason,
        seasonLabel: SEASON_LABELS[currentSeason],
        crops
      }
    })
  } catch (error) {
    console.error('[wiki/seasonal] Error:', error)
    return res.status(500).json({ success: false, error: 'Failed to get seasonal crops' })
  }
}
