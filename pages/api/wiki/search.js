// Mock data for crop wiki - no database required
const MOCK_CROPS = [
  { slug: 'wheat', name: 'Wheat', nameHindi: 'गेहूं', emoji: '🌾', category: 'CEREAL', scientificName: 'Triticum aestivum' },
  { slug: 'rice', name: 'Rice', nameHindi: 'धान', emoji: '🍚', category: 'CEREAL', scientificName: 'Oryza sativa' },
  { slug: 'mustard', name: 'Mustard', nameHindi: 'सरसों', emoji: '🌻', category: 'OILSEED', scientificName: 'Brassica juncea' },
  { slug: 'chickpea', name: 'Chickpea', nameHindi: 'चना', emoji: '🫘', category: 'PULSE', scientificName: 'Cicer arietinum' },
  { slug: 'cotton', name: 'Cotton', nameHindi: 'कपास', emoji: '🧶', category: 'FIBER', scientificName: 'Gossypium hirsutum' },
  { slug: 'sugarcane', name: 'Sugarcane', nameHindi: 'गन्ना', emoji: '🎋', category: 'CASH_CROP', scientificName: 'Saccharum officinarum' },
  { slug: 'potato', name: 'Potato', nameHindi: 'आलू', emoji: '🥔', category: 'VEGETABLE', scientificName: 'Solanum tuberosum' },
  { slug: 'tomato', name: 'Tomato', nameHindi: 'टमाटर', emoji: '🍅', category: 'VEGETABLE', scientificName: 'Solanum lycopersicum' }
]

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const { q } = req.query

  if (!q || q.trim().length < 1) {
    return res.status(200).json({ success: true, data: [] })
  }

  try {
    const searchLower = q.toLowerCase()
    const results = MOCK_CROPS.filter(crop => 
      crop.name.toLowerCase().includes(searchLower) ||
      crop.nameHindi.includes(q) ||
      crop.scientificName.toLowerCase().includes(searchLower)
    ).slice(0, 10)

    return res.status(200).json({ success: true, data: results })
  } catch (error) {
    console.error('[wiki/search] Error:', error)
    return res.status(500).json({ success: false, error: 'Search failed' })
  }
}
