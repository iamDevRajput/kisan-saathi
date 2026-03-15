// Mock data for crop wiki - no database required
const MOCK_CROPS = [
  {
    slug: 'wheat',
    name: 'Wheat',
    nameHindi: 'गेहूं',
    emoji: '🌾',
    category: 'CEREAL',
    seasons: { primary: 'Rabi', secondary: null },
    profitAnalysis: { rating: 4.5, marketDemand: 'High' },
    viewsCount: 1250
  },
  {
    slug: 'rice',
    name: 'Rice',
    nameHindi: 'धान',
    emoji: '🍚',
    category: 'CEREAL',
    seasons: { primary: 'Kharif', secondary: null },
    profitAnalysis: { rating: 4.3, marketDemand: 'High' },
    viewsCount: 1100
  },
  {
    slug: 'mustard',
    name: 'Mustard',
    nameHindi: 'सरसों',
    emoji: '🌻',
    category: 'OILSEED',
    seasons: { primary: 'Rabi', secondary: null },
    profitAnalysis: { rating: 4.2, marketDemand: 'High' },
    viewsCount: 980
  },
  {
    slug: 'chickpea',
    name: 'Chickpea',
    nameHindi: 'चना',
    emoji: '🫘',
    category: 'PULSE',
    seasons: { primary: 'Rabi', secondary: null },
    profitAnalysis: { rating: 4.0, marketDemand: 'Medium' },
    viewsCount: 850
  },
  {
    slug: 'cotton',
    name: 'Cotton',
    nameHindi: 'कपास',
    emoji: '🧶',
    category: 'FIBER',
    seasons: { primary: 'Kharif', secondary: null },
    profitAnalysis: { rating: 4.1, marketDemand: 'High' },
    viewsCount: 720
  },
  {
    slug: 'sugarcane',
    name: 'Sugarcane',
    nameHindi: 'गन्ना',
    emoji: '🎋',
    category: 'CASH_CROP',
    seasons: { primary: 'Annual', secondary: null },
    profitAnalysis: { rating: 4.4, marketDemand: 'High' },
    viewsCount: 690
  },
  {
    slug: 'potato',
    name: 'Potato',
    nameHindi: 'आलू',
    emoji: '🥔',
    category: 'VEGETABLE',
    seasons: { primary: 'Rabi', secondary: null },
    profitAnalysis: { rating: 3.9, marketDemand: 'High' },
    viewsCount: 650
  },
  {
    slug: 'tomato',
    name: 'Tomato',
    nameHindi: 'टमाटर',
    emoji: '🍅',
    category: 'VEGETABLE',
    seasons: { primary: 'Annual', secondary: null },
    profitAnalysis: { rating: 3.8, marketDemand: 'Medium' },
    viewsCount: 620
  }
]

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const { category, search, page = 1, limit = 15 } = req.query
  const skip = (Number(page) - 1) * Number(limit)

  try {
    // Filter crops
    let filteredCrops = [...MOCK_CROPS]
    
    if (category && category !== 'ALL') {
      filteredCrops = filteredCrops.filter(c => c.category === category.toUpperCase())
    }
    
    if (search) {
      const searchLower = search.toLowerCase()
      filteredCrops = filteredCrops.filter(c => 
        c.name.toLowerCase().includes(searchLower) ||
        c.nameHindi.includes(search)
      )
    }
    
    // Sort by views
    filteredCrops.sort((a, b) => b.viewsCount - a.viewsCount)
    
    const totalCount = filteredCrops.length
    const crops = filteredCrops.slice(skip, skip + Number(limit))

    return res.status(200).json({
      success: true,
      data: {
        crops,
        totalCount,
        page: Number(page),
        totalPages: Math.ceil(totalCount / Number(limit))
      }
    })
  } catch (error) {
    console.error('[wiki/crops] Error:', error)
    return res.status(500).json({ success: false, error: 'Failed to fetch crops' })
  }
}
