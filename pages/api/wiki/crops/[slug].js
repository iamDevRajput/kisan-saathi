// Mock data for crop wiki - no database required
const MOCK_CROPS = {
  wheat: {
    slug: 'wheat',
    name: 'Wheat',
    nameHindi: 'गेहूं',
    emoji: '🌾',
    category: 'CEREAL',
    scientificName: 'Triticum aestivum',
    seasons: { primary: 'Rabi', secondary: null },
    profitAnalysis: { rating: 4.5, marketDemand: 'High' },
    viewsCount: 1250,
    description: 'Major cereal crop grown in Rabi season',
    descriptionHindi: 'रबी सीजन में उगाई जाने वाली प्रमुख अनाज फसल'
  },
  rice: {
    slug: 'rice',
    name: 'Rice',
    nameHindi: 'धान',
    emoji: '🍚',
    category: 'CEREAL',
    scientificName: 'Oryza sativa',
    seasons: { primary: 'Kharif', secondary: null },
    profitAnalysis: { rating: 4.3, marketDemand: 'High' },
    viewsCount: 1100,
    description: 'Staple food grain crop of India',
    descriptionHindi: 'भारत की मुख्य खाद्य फसल'
  },
  mustard: {
    slug: 'mustard',
    name: 'Mustard',
    nameHindi: 'सरसों',
    emoji: '🌻',
    category: 'OILSEED',
    scientificName: 'Brassica juncea',
    seasons: { primary: 'Rabi', secondary: null },
    profitAnalysis: { rating: 4.2, marketDemand: 'High' },
    viewsCount: 980,
    description: 'Oilseed crop with high market demand',
    descriptionHindi: 'उच्च बाजार मांग के साथ तिलहन फसल'
  },
  chickpea: {
    slug: 'chickpea',
    name: 'Chickpea',
    nameHindi: 'चना',
    emoji: '🫘',
    category: 'PULSE',
    scientificName: 'Cicer arietinum',
    seasons: { primary: 'Rabi', secondary: null },
    profitAnalysis: { rating: 4.0, marketDemand: 'Medium' },
    viewsCount: 850,
    description: 'Protein-rich pulse crop',
    descriptionHindi: 'प्रोटीन से भरपूर दलहन फसल'
  },
  cotton: {
    slug: 'cotton',
    name: 'Cotton',
    nameHindi: 'कपास',
    emoji: '🧶',
    category: 'FIBER',
    scientificName: 'Gossypium hirsutum',
    seasons: { primary: 'Kharif', secondary: null },
    profitAnalysis: { rating: 4.1, marketDemand: 'High' },
    viewsCount: 720,
    description: 'Important fiber crop for textile industry',
    descriptionHindi: 'वस्त्र उद्योग के लिए महत्वपूर्ण रेशेदार फसल'
  },
  sugarcane: {
    slug: 'sugarcane',
    name: 'Sugarcane',
    nameHindi: 'गन्ना',
    emoji: '🎋',
    category: 'CASH_CROP',
    scientificName: 'Saccharum officinarum',
    seasons: { primary: 'Annual', secondary: null },
    profitAnalysis: { rating: 4.4, marketDemand: 'High' },
    viewsCount: 690,
    description: 'High-value cash crop for sugar production',
    descriptionHindi: 'चीनी उत्पादन के लिए उच्च मूल्य की नकद फसल'
  },
  potato: {
    slug: 'potato',
    name: 'Potato',
    nameHindi: 'आलू',
    emoji: '🥔',
    category: 'VEGETABLE',
    scientificName: 'Solanum tuberosum',
    seasons: { primary: 'Rabi', secondary: null },
    profitAnalysis: { rating: 3.9, marketDemand: 'High' },
    viewsCount: 650,
    description: 'Versatile vegetable crop with year-round demand',
    descriptionHindi: 'बहुमुखी सब्जी फसल जिसकी साल भर मांग रहती है'
  },
  tomato: {
    slug: 'tomato',
    name: 'Tomato',
    nameHindi: 'टमाटर',
    emoji: '🍅',
    category: 'VEGETABLE',
    scientificName: 'Solanum lycopersicum',
    seasons: { primary: 'Annual', secondary: null },
    profitAnalysis: { rating: 3.8, marketDemand: 'Medium' },
    viewsCount: 620,
    description: 'Popular vegetable used in daily cooking',
    descriptionHindi: 'रोजाना खाना पकाने में इस्तेमाल होने वाली लोकप्रिय सब्जी'
  }
}

export default async function handler(req, res) {
  const { slug } = req.query

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  if (!slug) {
    return res.status(400).json({ success: false, error: 'Slug is required' })
  }

  try {
    const crop = MOCK_CROPS[slug]

    if (!crop) {
      return res.status(404).json({ success: false, error: 'Crop not found' })
    }

    // Find related crops from same category
    const related = Object.values(MOCK_CROPS)
      .filter(c => c.category === crop.category && c.slug !== slug)
      .slice(0, 4)

    return res.status(200).json({
      success: true,
      data: { ...crop, relatedCropsData: related }
    })
  } catch (error) {
    console.error('[wiki/crops/[slug]] Error:', error)
    return res.status(500).json({ success: false, error: 'Failed to fetch crop' })
  }
}
