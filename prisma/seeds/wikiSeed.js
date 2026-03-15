const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const crops = [
  {
    slug: 'wheat', name: 'Wheat', nameHindi: 'गेहूं', scientificName: 'Triticum aestivum',
    family: 'Poaceae', origin: 'Middle East', category: 'CEREAL', emoji: '🌾',
    description: 'Wheat is the most important Rabi crop of India grown extensively in UP, Punjab and Haryana.',
    descriptionHindi: 'गेहूं भारत की सबसे महत्वपूर्ण रबी फसल है जो उत्तर प्रदेश, पंजाब और हरियाणा में बड़े पैमाने पर उगाई जाती है।',
    climate: { temp: '20-25°C', rainfall: '450-650mm', humidity: '40-60%', sunlight: '6-8 hours' },
    soil: { type: 'Loamy', pH: '6.0-7.5', drainage: 'Well drained', organic: 'High' },
    seasons: { primary: 'Rabi', sowing: 'Oct 15 - Nov 30', harvest: 'Mar 15 - Apr 30', duration: '120-150 days' },
    varieties: [
      { name: 'HD-2967', yield: '45-50 q/acre', days: 150, suitable: 'UP, Haryana', best: true },
      { name: 'HD-3086', yield: '50-55 q/acre', days: 145, suitable: 'North India', best: false },
      { name: 'PBW-550', yield: '40-45 q/acre', days: 155, suitable: 'Punjab, UP', best: false },
      { name: 'K-9107',  yield: '35-40 q/acre', days: 130, suitable: 'UP, Bihar', best: false }
    ],
    nutrition: {
      nitrogen: { dose: '120 kg/ha', source: 'Urea', timing: '3 splits' },
      phosphorus: { dose: '60 kg/ha', source: 'DAP', timing: 'At sowing' },
      potassium: { dose: '40 kg/ha', source: 'MOP', timing: 'At sowing' }
    },
    irrigation: [
      { stage: 'CRI', days: 21, critical: true },
      { stage: 'Tillering', days: 42, critical: true },
      { stage: 'Ear emergence', days: 65, critical: true },
      { stage: 'Grain filling', days: 85, critical: true }
    ],
    pestsDiseases: [
      { name: 'Yellow Rust', hindi: 'पीली रतुआ', severity: 'HIGH', symptoms: 'Yellow stripes on leaves', treatment: 'Propiconazole 25% EC @ 0.1%' },
      { name: 'Aphids', hindi: 'माहू/चेपा', severity: 'MEDIUM', symptoms: 'Yellowing of leaves', treatment: 'Imidacloprid 17.8% SL @ 0.3ml/L' },
      { name: 'Loose Smut', hindi: 'अनावृत कंड', severity: 'MEDIUM', symptoms: 'Black powder in ears', treatment: 'Carboxin + Thiram DS' }
    ],
    harvesting: { method: 'Combine harvester', moisture: '12-14%', storage: 'Cool dry place', shelfLife: '12 months' },
    profitAnalysis: { costPerAcre: 18000, yieldPerAcre: 45, pricePerQuintal: 2275, msp: 2275, netProfit: 84375 },
    govtSupport: { msp: 2275, schemes: ['PM-Kisan', 'PMFBY', 'KCC'] },
    relatedCrops: ['mustard', 'chickpea', 'barley']
  },
  {
    slug: 'rice', name: 'Rice', nameHindi: 'धान', scientificName: 'Oryza sativa',
    family: 'Poaceae', origin: 'China/India', category: 'CEREAL', emoji: '🍚',
    description: 'Rice is the staple food of India and the primary Kharif crop grown in flooded fields.',
    descriptionHindi: 'धान भारत का मुख्य खाद्यान्न है और खरीफ सीजन की प्रमुख फसल है जो बाढ़ वाले खेतों में उगाई जाती है।',
    climate: { temp: '22-32°C', rainfall: '1000-2000mm', humidity: '60-80%', sunlight: '8 hours' },
    soil: { type: 'Clayey Loam', pH: '5.5-6.5', drainage: 'Poor drainage preferred', organic: 'Medium' },
    seasons: { primary: 'Kharif', sowing: 'Jun 15 - Jul 31', harvest: 'Oct 1 - Nov 30', duration: '90-120 days' },
    varieties: [
      { name: 'Pusa Basmati 1121', yield: '30-35 q/acre', days: 140, suitable: 'Punjab, Haryana, UP', best: true },
      { name: 'IR-64', yield: '40-45 q/acre', days: 105, suitable: 'All regions', best: false },
      { name: 'HMT Sona', yield: '35-40 q/acre', days: 115, suitable: 'UP, Bihar', best: false },
      { name: 'Swarna', yield: '38-42 q/acre', days: 155, suitable: 'Eastern India', best: false }
    ],
    nutrition: {
      nitrogen: { dose: '100 kg/ha', source: 'Urea', timing: '3 splits' },
      phosphorus: { dose: '50 kg/ha', source: 'DAP', timing: 'At transplanting' },
      potassium: { dose: '50 kg/ha', source: 'MOP', timing: 'At transplanting' }
    },
    irrigation: [
      { stage: 'Transplanting', days: 0, critical: true },
      { stage: 'Tillering', days: 30, critical: true },
      { stage: 'Panicle initiation', days: 55, critical: true },
      { stage: 'Grain filling', days: 80, critical: true }
    ],
    pestsDiseases: [
      { name: 'Blast', hindi: 'ब्लास्ट', severity: 'HIGH', symptoms: 'Diamond-shaped lesions on leaves', treatment: 'Tricyclazole 75% WP @ 0.6g/L' },
      { name: 'Brown Plant Hopper', hindi: 'भूरा माहू', severity: 'HIGH', symptoms: 'Yellowing, hopper burn', treatment: 'Imidacloprid 17.8% SL @ 0.3ml/L' },
      { name: 'Sheath Blight', hindi: 'शीथ ब्लाइट', severity: 'MEDIUM', symptoms: 'Oval lesions on sheath', treatment: 'Hexaconazole 5% EC @ 2ml/L' }
    ],
    harvesting: { method: 'Paddy harvester', moisture: '20-25%', storage: 'Silo', shelfLife: '18 months' },
    profitAnalysis: { costPerAcre: 20000, yieldPerAcre: 35, pricePerQuintal: 2300, msp: 2300, netProfit: 60500 },
    govtSupport: { msp: 2300, schemes: ['PM-Kisan', 'PMFBY', 'KCC', 'e-NAM'] },
    relatedCrops: ['wheat', 'maize', 'sugarcane']
  },
  {
    slug: 'mustard', name: 'Mustard', nameHindi: 'सरसों', scientificName: 'Brassica juncea',
    family: 'Brassicaceae', origin: 'Central Asia', category: 'OILSEED', emoji: '🌼',
    description: 'Mustard is the most important oilseed crop of Rabi season in India.',
    descriptionHindi: 'सरसों रबी सीजन की सबसे महत्वपूर्ण तिलहन फसल है जो उत्तर भारत में बड़े पैमाने पर उगाई जाती है।',
    climate: { temp: '15-25°C', rainfall: '300-450mm', humidity: '30-50%', sunlight: '6-8 hours' },
    soil: { type: 'Sandy Loam', pH: '6.0-7.0', drainage: 'Well drained', organic: 'Medium' },
    seasons: { primary: 'Rabi', sowing: 'Oct 1 - Nov 15', harvest: 'Feb 15 - Mar 31', duration: '110-140 days' },
    varieties: [
      { name: 'Pusa Bold', yield: '12-15 q/acre', days: 130, suitable: 'All India', best: true },
      { name: 'Varuna', yield: '10-12 q/acre', days: 125, suitable: 'UP, Rajasthan', best: false },
      { name: 'Kranti', yield: '11-14 q/acre', days: 120, suitable: 'North India', best: false },
      { name: 'RH-749', yield: '13-16 q/acre', days: 140, suitable: 'Haryana, UP', best: false }
    ],
    nutrition: {
      nitrogen: { dose: '80 kg/ha', source: 'Urea', timing: '2 splits' },
      phosphorus: { dose: '40 kg/ha', source: 'DAP', timing: 'At sowing' },
      potassium: { dose: '30 kg/ha', source: 'MOP', timing: 'At sowing' }
    },
    irrigation: [
      { stage: 'Germination', days: 7, critical: false },
      { stage: 'Branching', days: 30, critical: true },
      { stage: 'Flowering', days: 55, critical: true },
      { stage: 'Pod filling', days: 80, critical: true }
    ],
    pestsDiseases: [
      { name: 'Aphid', hindi: 'माहू', severity: 'HIGH', symptoms: 'Curled yellow leaves, honeydew', treatment: 'Dimethoate 30% EC @ 1ml/L' },
      { name: 'White Rust', hindi: 'सफेद रतुआ', severity: 'MEDIUM', symptoms: 'White blister on leaves', treatment: 'Metalaxyl + Mancozeb @ 2g/L' },
      { name: 'Alternaria Blight', hindi: 'अल्टरनेरिया', severity: 'MEDIUM', symptoms: 'Brown concentric spots', treatment: 'Iprodione 50% WP @ 2g/L' }
    ],
    harvesting: { method: 'Manual / combine', moisture: '8-10%', storage: 'Gunny bags', shelfLife: '12 months' },
    profitAnalysis: { costPerAcre: 12000, yieldPerAcre: 13, pricePerQuintal: 5650, msp: 5650, netProfit: 61450 },
    govtSupport: { msp: 5650, schemes: ['PM-Kisan', 'PMFBY', 'NMOOP subsidy'] },
    relatedCrops: ['wheat', 'chickpea', 'sunflower']
  },
  {
    slug: 'potato', name: 'Potato', nameHindi: 'आलू', scientificName: 'Solanum tuberosum',
    family: 'Solanaceae', origin: 'South America', category: 'VEGETABLE', emoji: '🥔',
    description: 'Potato is the most important vegetable crop of India with high commercial value.',
    descriptionHindi: 'आलू भारत की सबसे महत्वपूर्ण सब्जी फसल है जिसका बड़े पैमाने पर व्यावसायिक उत्पादन किया जाता है।',
    climate: { temp: '15-20°C', rainfall: '400-600mm', humidity: '50-70%', sunlight: '8-10 hours' },
    soil: { type: 'Sandy Loam', pH: '5.5-6.5', drainage: 'Well drained', organic: 'High' },
    seasons: { primary: 'Rabi', sowing: 'Oct 1 - Nov 30', harvest: 'Jan 15 - Mar 15', duration: '70-90 days' },
    varieties: [
      { name: 'Kufri Jyoti', yield: '80-100 q/acre', days: 80, suitable: 'All India', best: true },
      { name: 'Kufri Chandramukhi', yield: '70-90 q/acre', days: 70, suitable: 'North India', best: false },
      { name: 'Kufri Bahar', yield: '90-110 q/acre', days: 90, suitable: 'UP, Punjab', best: false },
      { name: 'Kufri Sindhuri', yield: '75-95 q/acre', days: 120, suitable: 'Hilly areas', best: false }
    ],
    nutrition: {
      nitrogen: { dose: '150 kg/ha', source: 'Urea', timing: '2 splits' },
      phosphorus: { dose: '80 kg/ha', source: 'DAP', timing: 'At planting' },
      potassium: { dose: '100 kg/ha', source: 'MOP', timing: 'At planting' }
    },
    irrigation: [
      { stage: 'Sprout emergence', days: 10, critical: true },
      { stage: 'Tuber initiation', days: 30, critical: true },
      { stage: 'Tuber bulking', days: 50, critical: true },
      { stage: 'Maturation', days: 70, critical: false }
    ],
    pestsDiseases: [
      { name: 'Late Blight', hindi: 'पछेती झुलसा', severity: 'HIGH', symptoms: 'Dark lesions on leaves', treatment: 'Mancozeb 75% WP @ 2.5g/L' },
      { name: 'Early Blight', hindi: 'अगेती झुलसा', severity: 'MEDIUM', symptoms: 'Target-shaped spots', treatment: 'Chlorothalonil 75% WP @ 2g/L' },
      { name: 'Aphid', hindi: 'माहू', severity: 'MEDIUM', symptoms: 'Stunted growth, virus spread', treatment: 'Imidacloprid 17.8% SL @ 0.5ml/L' }
    ],
    harvesting: { method: 'Manual / tractor digger', moisture: '80%', storage: 'Cold storage 4°C', shelfLife: '6 months' },
    profitAnalysis: { costPerAcre: 25000, yieldPerAcre: 100, pricePerQuintal: 800, msp: 0, netProfit: 55000 },
    govtSupport: { msp: 0, schemes: ['PM-Kisan', 'PMFBY', 'Cold storage subsidy'] },
    relatedCrops: ['tomato', 'onion', 'wheat']
  },
  {
    slug: 'tomato', name: 'Tomato', nameHindi: 'टमाटर', scientificName: 'Solanum lycopersicum',
    family: 'Solanaceae', origin: 'South America', category: 'VEGETABLE', emoji: '🍅',
    description: 'Tomato is a high-value vegetable crop grown year-round with excellent market demand.',
    descriptionHindi: 'टमाटर एक उच्च मूल्य वाली सब्जी फसल है जो साल भर उगाई जाती है और बाजार में इसकी अत्यधिक मांग रहती है।',
    climate: { temp: '20-27°C', rainfall: '400-600mm', humidity: '50-70%', sunlight: '8 hours' },
    soil: { type: 'Well-drained Loam', pH: '6.0-7.0', drainage: 'Good', organic: 'High' },
    seasons: { primary: 'Both', sowing: 'Jun-Jul / Nov-Dec', harvest: 'Oct-Nov / Feb-Mar', duration: '60-90 days' },
    varieties: [
      { name: 'Pusa Ruby', yield: '100-120 q/acre', days: 75, suitable: 'All India', best: true },
      { name: 'Hybrid Naveen', yield: '150-200 q/acre', days: 70, suitable: 'North India', best: false },
      { name: 'Pusa Early Dwarf', yield: '80-100 q/acre', days: 60, suitable: 'All India', best: false },
      { name: 'Arka Vikas', yield: '120-140 q/acre', days: 80, suitable: 'South India', best: false }
    ],
    nutrition: {
      nitrogen: { dose: '120 kg/ha', source: 'Urea', timing: '4 splits' },
      phosphorus: { dose: '80 kg/ha', source: 'DAP', timing: 'At transplant' },
      potassium: { dose: '60 kg/ha', source: 'MOP', timing: '2 splits' }
    },
    irrigation: [
      { stage: 'Transplanting', days: 0, critical: true },
      { stage: 'Flowering', days: 30, critical: true },
      { stage: 'Fruit set', days: 50, critical: true },
      { stage: 'Fruit development', days: 65, critical: true }
    ],
    pestsDiseases: [
      { name: 'Early Blight', hindi: 'अगेती झुलसा', severity: 'HIGH', symptoms: 'Dark concentric spots on leaves', treatment: 'Mancozeb 75% WP @ 2.5g/L' },
      { name: 'Whitefly', hindi: 'सफेद मक्खी', severity: 'HIGH', symptoms: 'Yellowing, sooty mold', treatment: 'Thiamethoxam 25% WG @ 0.3g/L' },
      { name: 'Fruit Borer', hindi: 'फल छेदक', severity: 'HIGH', symptoms: 'Bored fruits, frass', treatment: 'Chlorantraniliprole 18.5% SC @ 0.3ml/L' }
    ],
    harvesting: { method: 'Manual picking', moisture: '94%', storage: 'Cool dry place', shelfLife: '7-14 days' },
    profitAnalysis: { costPerAcre: 30000, yieldPerAcre: 150, pricePerQuintal: 600, msp: 0, netProfit: 60000 },
    govtSupport: { msp: 0, schemes: ['PM-Kisan', 'PMFBY', 'Horticulture Mission'] },
    relatedCrops: ['potato', 'onion', 'chilli']
  },
  {
    slug: 'onion', name: 'Onion', nameHindi: 'प्याज', scientificName: 'Allium cepa',
    family: 'Amaryllidaceae', origin: 'Central Asia', category: 'VEGETABLE', emoji: '🧅',
    description: 'Onion is one of the most important vegetables and spice crops of India.',
    descriptionHindi: 'प्याज भारत की सबसे महत्वपूर्ण सब्जी और मसाला फसल में से एक है जिसकी बाजार में हमेशा अच्छी मांग रहती है।',
    climate: { temp: '13-24°C', rainfall: '300-400mm', humidity: '50-70%', sunlight: '8 hours' },
    soil: { type: 'Sandy Loam to Clay Loam', pH: '6.0-7.5', drainage: 'Well drained', organic: 'Medium' },
    seasons: { primary: 'Rabi', sowing: 'Oct 15 - Nov 30', harvest: 'Mar 1 - Apr 30', duration: '90-120 days' },
    varieties: [
      { name: 'Nasik Red', yield: '80-100 q/acre', days: 110, suitable: 'All India', best: true },
      { name: 'Pusa Ratnar', yield: '70-90 q/acre', days: 120, suitable: 'North India', best: false },
      { name: 'Agrifound Dark Red', yield: '90-110 q/acre', days: 100, suitable: 'Maharashtra, Karnataka', best: false },
      { name: 'Arka Kalyan', yield: '80-100 q/acre', days: 120, suitable: 'South India', best: false }
    ],
    nutrition: {
      nitrogen: { dose: '100 kg/ha', source: 'Urea', timing: '3 splits' },
      phosphorus: { dose: '50 kg/ha', source: 'DAP', timing: 'At transplant' },
      potassium: { dose: '60 kg/ha', source: 'MOP', timing: '2 splits' }
    },
    irrigation: [
      { stage: 'Transplanting', days: 0, critical: true },
      { stage: 'Leaf development', days: 25, critical: true },
      { stage: 'Bulb initiation', days: 50, critical: true },
      { stage: 'Bulb development', days: 70, critical: true }
    ],
    pestsDiseases: [
      { name: 'Purple Blotch', hindi: 'बैंगनी धब्बा', severity: 'HIGH', symptoms: 'Purple-brown spots on leaves', treatment: 'Mancozeb @ 2g/L' },
      { name: 'Thrips', hindi: 'थ्रिप्स', severity: 'HIGH', symptoms: 'Silver streaks on leaves', treatment: 'Spinosad 45% SC @ 0.3ml/L' },
      { name: 'Stemphylium Blight', hindi: 'स्टेमफीलियम ब्लाइट', severity: 'MEDIUM', symptoms: 'Yellow spots with dark borders', treatment: 'Iprodione 50% WP @ 2g/L' }
    ],
    harvesting: { method: 'Manual pulling', moisture: '80%', storage: 'Well-ventilated store', shelfLife: '3-4 months' },
    profitAnalysis: { costPerAcre: 22000, yieldPerAcre: 90, pricePerQuintal: 700, msp: 0, netProfit: 41000 },
    govtSupport: { msp: 0, schemes: ['PM-Kisan', 'PMFBY', 'Horticulture Mission'] },
    relatedCrops: ['garlic', 'tomato', 'potato']
  },
  {
    slug: 'sugarcane', name: 'Sugarcane', nameHindi: 'गन्ना', scientificName: 'Saccharum officinarum',
    family: 'Poaceae', origin: 'New Guinea', category: 'CASH', emoji: '🎋',
    description: 'Sugarcane is the most important cash crop of India providing raw material for sugar industry.',
    descriptionHindi: 'गन्ना भारत की सबसे महत्वपूर्ण नकदी फसल है जो चीनी उद्योग के लिए कच्चा माल प्रदान करती है।',
    climate: { temp: '21-27°C', rainfall: '1200-1500mm', humidity: '60-80%', sunlight: '8-9 hours' },
    soil: { type: 'Deep Loamy', pH: '6.5-7.5', drainage: 'Good', organic: 'High' },
    seasons: { primary: 'Annual', sowing: 'Feb-Mar / Sep-Oct', harvest: 'Oct-Apr (12-18 months)', duration: '10-12 months' },
    varieties: [
      { name: 'Co-0238', yield: '350-400 q/acre', days: 365, suitable: 'UP, Punjab', best: true },
      { name: 'CoJ-64', yield: '300-350 q/acre', days: 365, suitable: 'Punjab, Haryana', best: false },
      { name: 'Co-86032', yield: '320-380 q/acre', days: 365, suitable: 'South India', best: false },
      { name: 'BO-91', yield: '280-330 q/acre', days: 365, suitable: 'UP, Bihar', best: false }
    ],
    nutrition: {
      nitrogen: { dose: '250 kg/ha', source: 'Urea', timing: '4 splits' },
      phosphorus: { dose: '80 kg/ha', source: 'DAP', timing: 'At planting' },
      potassium: { dose: '100 kg/ha', source: 'MOP', timing: '2 splits' }
    },
    irrigation: [
      { stage: 'Germination', days: 15, critical: true },
      { stage: 'Tillering (3 months)', days: 90, critical: true },
      { stage: 'Grand growth', days: 180, critical: true },
      { stage: 'Maturation', days: 300, critical: false }
    ],
    pestsDiseases: [
      { name: 'Red Rot', hindi: 'लाल सड़न', severity: 'HIGH', symptoms: 'Internal red discoloration, foul smell', treatment: 'Carbendazim 50% WP @ 1g/L' },
      { name: 'Sugarcane Borer', hindi: 'तना छेदक', severity: 'HIGH', symptoms: 'Dead hearts, bored stem', treatment: 'Chlorpyrifos 20% EC @ 2.5ml/L' },
      { name: 'Grassy Shoot', hindi: 'घासी शूट', severity: 'MEDIUM', symptoms: 'Narrow pale green shoots', treatment: 'Use disease-free seed material, hot water treatment' }
    ],
    harvesting: { method: 'Manual / mechanical harvester', moisture: '15-18%', storage: 'Process within 48hrs', shelfLife: '2-3 days after cutting' },
    profitAnalysis: { costPerAcre: 40000, yieldPerAcre: 380, pricePerQuintal: 350, msp: 315, netProfit: 93000 },
    govtSupport: { msp: 315, schemes: ['PM-Kisan', 'PMFBY', 'Sugar Mill payment guarantee'] },
    relatedCrops: ['rice', 'maize', 'cotton']
  },
  {
    slug: 'chickpea', name: 'Chickpea', nameHindi: 'चना', scientificName: 'Cicer arietinum',
    family: 'Fabaceae', origin: 'Middle East', category: 'PULSE', emoji: '🫘',
    description: 'Chickpea is the most important pulse crop of India grown in Rabi season.',
    descriptionHindi: 'चना भारत की सबसे महत्वपूर्ण दलहन फसल है जो रबी सीजन में उगाई जाती है।',
    climate: { temp: '15-25°C', rainfall: '300-450mm', humidity: '30-50%', sunlight: '6-8 hours' },
    soil: { type: 'Sandy Loam', pH: '6.0-8.0', drainage: 'Well drained', organic: 'Medium' },
    seasons: { primary: 'Rabi', sowing: 'Oct 15 - Nov 30', harvest: 'Feb 15 - Mar 31', duration: '90-110 days' },
    varieties: [
      { name: 'JG-11', yield: '12-15 q/acre', days: 100, suitable: 'MP, Rajasthan', best: true },
      { name: 'Pusa 256', yield: '10-12 q/acre', days: 95, suitable: 'North India', best: false },
      { name: 'Vijay', yield: '11-13 q/acre', days: 110, suitable: 'UP, Rajasthan', best: false },
      { name: 'JAKI-9218', yield: '13-16 q/acre', days: 90, suitable: 'All India', best: false }
    ],
    nutrition: {
      nitrogen: { dose: '20 kg/ha', source: 'DAP', timing: 'At sowing (starter dose)' },
      phosphorus: { dose: '60 kg/ha', source: 'DAP', timing: 'At sowing' },
      potassium: { dose: '20 kg/ha', source: 'MOP', timing: 'At sowing' }
    },
    irrigation: [
      { stage: 'Pre-sowing', days: -3, critical: true },
      { stage: 'Branching', days: 30, critical: false },
      { stage: 'Flowering', days: 55, critical: true },
      { stage: 'Pod filling', days: 75, critical: true }
    ],
    pestsDiseases: [
      { name: 'Wilt', hindi: 'उकठा रोग', severity: 'HIGH', symptoms: 'Sudden wilting and drying', treatment: 'Seed treatment with Trichoderma viride' },
      { name: 'Pod Borer', hindi: 'फली छेदक', severity: 'HIGH', symptoms: 'Bored pods, frass visible', treatment: 'Chlorantraniliprole 18.5% @ 0.3ml/L' },
      { name: 'Ascochyta Blight', hindi: 'असकोकाइटा', severity: 'MEDIUM', symptoms: 'Brown lesions on all parts', treatment: 'Zineb 75% WP @ 2g/L' }
    ],
    harvesting: { method: 'Manual / combine', moisture: '12%', storage: 'Airtight bins', shelfLife: '24 months' },
    profitAnalysis: { costPerAcre: 10000, yieldPerAcre: 12, pricePerQuintal: 5440, msp: 5440, netProfit: 55280 },
    govtSupport: { msp: 5440, schemes: ['PM-Kisan', 'PMFBY', 'Pulses subsidy NFSM'] },
    relatedCrops: ['wheat', 'mustard', 'lentil']
  },
  {
    slug: 'maize', name: 'Maize', nameHindi: 'मक्का', scientificName: 'Zea mays',
    family: 'Poaceae', origin: 'Mexico', category: 'CEREAL', emoji: '🌽',
    description: 'Maize is a versatile crop used for food, feed and industrial purposes.',
    descriptionHindi: 'मक्का एक बहुउद्देशीय फसल है जिसका उपयोग खाद्य, पशु चारे और उद्योग के लिए किया जाता है।',
    climate: { temp: '21-27°C', rainfall: '600-900mm', humidity: '50-70%', sunlight: '8-10 hours' },
    soil: { type: 'Well-drained Loam', pH: '6.0-7.5', drainage: 'Good', organic: 'High' },
    seasons: { primary: 'Kharif', sowing: 'Jun 15 - Jul 15', harvest: 'Sep 15 - Oct 31', duration: '80-100 days' },
    varieties: [
      { name: 'Ganga-11', yield: '30-35 q/acre', days: 90, suitable: 'North India', best: true },
      { name: 'DHM-117', yield: '35-40 q/acre', days: 95, suitable: 'All India', best: false },
      { name: 'Vivek QPM-9', yield: '28-32 q/acre', days: 85, suitable: 'Hill areas', best: false },
      { name: 'Pusa Composite-3', yield: '25-30 q/acre', days: 80, suitable: 'Plains', best: false }
    ],
    nutrition: {
      nitrogen: { dose: '120 kg/ha', source: 'Urea', timing: '3 splits' },
      phosphorus: { dose: '60 kg/ha', source: 'DAP', timing: 'At sowing' },
      potassium: { dose: '40 kg/ha', source: 'MOP', timing: 'At sowing' }
    },
    irrigation: [
      { stage: 'Germination', days: 7, critical: true },
      { stage: 'Tasseling', days: 50, critical: true },
      { stage: 'Silking', days: 60, critical: true },
      { stage: 'Grain filling', days: 75, critical: true }
    ],
    pestsDiseases: [
      { name: 'Fall Armyworm', hindi: 'फॉल आर्मीवर्म', severity: 'HIGH', symptoms: 'Ragged leaves, window paning', treatment: 'Emamectin Benzoate 5% SG @ 0.4g/L' },
      { name: 'Stem Borer', hindi: 'तना छेदक', severity: 'HIGH', symptoms: 'Dead hearts, shot holes', treatment: 'Chlorpyrifos 20% EC granules in whorl' },
      { name: 'Turcicum Blight', hindi: 'टर्सीकम ब्लाइट', severity: 'MEDIUM', symptoms: 'Elliptical tan lesions', treatment: 'Mancozeb 75% WP @ 2g/L' }
    ],
    harvesting: { method: 'Manual / combine', moisture: '25-30%', storage: 'Crib storage', shelfLife: '12 months (dry)' },
    profitAnalysis: { costPerAcre: 12000, yieldPerAcre: 32, pricePerQuintal: 1870, msp: 1870, netProfit: 47840 },
    govtSupport: { msp: 1870, schemes: ['PM-Kisan', 'PMFBY', 'NFS Mission'] },
    relatedCrops: ['wheat', 'rice', 'soybean']
  },
  {
    slug: 'turmeric', name: 'Turmeric', nameHindi: 'हल्दी', scientificName: 'Curcuma longa',
    family: 'Zingiberaceae', origin: 'South Asia', category: 'SPICE', emoji: '🟡',
    description: 'Turmeric is a high-value spice crop with immense medicinal and culinary importance.',
    descriptionHindi: 'हल्दी एक उच्च मूल्य वाली मसाला फसल है जिसका औषधीय और पाककला में अत्यधिक महत्व है।',
    climate: { temp: '20-30°C', rainfall: '1500-2000mm', humidity: '70-90%', sunlight: '5-7 hours (partial shade)' },
    soil: { type: 'Red Sandy Loam', pH: '5.5-7.0', drainage: 'Well drained', organic: 'Very High' },
    seasons: { primary: 'Kharif', sowing: 'Apr 15 - May 31', harvest: 'Jan 15 - Mar 31', duration: '7-9 months' },
    varieties: [
      { name: 'Erode Local', yield: '25-30 q/acre (dry)', days: 270, suitable: 'South India', best: true },
      { name: 'Pusa Sunrise', yield: '22-27 q/acre (dry)', days: 250, suitable: 'All India', best: false },
      { name: 'Roma', yield: '20-25 q/acre (dry)', days: 240, suitable: 'North India', best: false },
      { name: 'Suguna', yield: '24-28 q/acre (dry)', days: 260, suitable: 'Andhra Pradesh', best: false }
    ],
    nutrition: {
      nitrogen: { dose: '120 kg/ha', source: 'Urea', timing: '3 splits' },
      phosphorus: { dose: '60 kg/ha', source: 'DAP', timing: 'At planting' },
      potassium: { dose: '120 kg/ha', source: 'MOP', timing: '2 splits' }
    },
    irrigation: [
      { stage: 'Planting', days: 0, critical: true },
      { stage: 'Sprouting', days: 30, critical: true },
      { stage: 'Vegetative growth', days: 90, critical: true },
      { stage: 'Rhizome development', days: 180, critical: true }
    ],
    pestsDiseases: [
      { name: 'Rhizome Rot', hindi: 'प्रकंद सड़न', severity: 'HIGH', symptoms: 'Yellow wilting, rotting rhizome', treatment: 'Metalaxyl + Mancozeb @ 2g/L, soil drench' },
      { name: 'Leaf Blotch', hindi: 'पर्ण धब्बा', severity: 'MEDIUM', symptoms: 'Rectangular brown spots', treatment: 'Mancozeb 75% WP @ 2g/L' },
      { name: 'Shoot Borer', hindi: 'प्रकंद छेदक', severity: 'HIGH', symptoms: 'Bored pseudo stems, wilting', treatment: 'Chlorpyrifos 20% EC @ 2ml/L' }
    ],
    harvesting: { method: 'Mechanical digger', moisture: '80% fresh / 8-10% dry', storage: 'Dry, cool room', shelfLife: '18-24 months' },
    profitAnalysis: { costPerAcre: 35000, yieldPerAcre: 25, pricePerQuintal: 6000, msp: 0, netProfit: 115000 },
    govtSupport: { msp: 0, schemes: ['PM-Kisan', 'PMFBY', 'MIDH scheme', 'Spices Board support'] },
    relatedCrops: ['ginger', 'garlic', 'banana']
  },
  {
    slug: 'garlic', name: 'Garlic', nameHindi: 'लहसुन', scientificName: 'Allium sativum',
    family: 'Amaryllidaceae', origin: 'Central Asia', category: 'SPICE', emoji: '🧄',
    description: 'Garlic is an important spice and medicinal crop with very high market value.',
    descriptionHindi: 'लहसुन एक महत्वपूर्ण मसाला और औषधीय फसल है जिसकी बाजार में बहुत अधिक कीमत मिलती है।',
    climate: { temp: '12-24°C', rainfall: '300-500mm', humidity: '40-60%', sunlight: '8 hours (long days)' },
    soil: { type: 'Sandy Loam', pH: '6.0-7.0', drainage: 'Well drained', organic: 'High' },
    seasons: { primary: 'Rabi', sowing: 'Oct 1 - Nov 30', harvest: 'Mar 1 - May 31', duration: '130-180 days' },
    varieties: [
      { name: 'Yamuna Safed-3', yield: '50-60 q/acre', days: 160, suitable: 'Alluvial soils', best: true },
      { name: 'G-282', yield: '45-55 q/acre', days: 170, suitable: 'North India', best: false },
      { name: 'Phule Baswant', yield: '55-65 q/acre', days: 150, suitable: 'Maharashtra', best: false },
      { name: 'HG-6', yield: '48-58 q/acre', days: 165, suitable: 'MP, UP', best: false }
    ],
    nutrition: {
      nitrogen: { dose: '100 kg/ha', source: 'Urea', timing: '3 splits' },
      phosphorus: { dose: '50 kg/ha', source: 'DAP', timing: 'At planting' },
      potassium: { dose: '60 kg/ha', source: 'MOP', timing: '2 splits' }
    },
    irrigation: [
      { stage: 'Planting', days: 0, critical: true },
      { stage: 'Leaf development', days: 30, critical: true },
      { stage: 'Bulb initiation', days: 60, critical: true },
      { stage: 'Bulb swelling', days: 100, critical: true }
    ],
    pestsDiseases: [
      { name: 'Purple Blotch', hindi: 'बैंगनी धब्बा', severity: 'HIGH', symptoms: 'Small white spots turning purple', treatment: 'Mancozeb 75% WP @ 2g/L' },
      { name: 'Thrips', hindi: 'थ्रिप्स', severity: 'MEDIUM', symptoms: 'Silver streaks, curled leaves', treatment: 'Spinosad 45% SC @ 0.3ml/L' },
      { name: 'Basal Rot', hindi: 'जड़ सड़न', severity: 'HIGH', symptoms: 'Rotting at base, yellowing', treatment: 'Trichoderma viride seed treatment + soil application' }
    ],
    harvesting: { method: 'Manual lifting', moisture: '65%', storage: 'Well-ventilated, cool', shelfLife: '6-8 months' },
    profitAnalysis: { costPerAcre: 25000, yieldPerAcre: 55, pricePerQuintal: 2500, msp: 0, netProfit: 112500 },
    govtSupport: { msp: 0, schemes: ['PM-Kisan', 'PMFBY', 'MIDH scheme'] },
    relatedCrops: ['onion', 'turmeric', 'potato']
  },
  {
    slug: 'mango', name: 'Mango', nameHindi: 'आम', scientificName: 'Mangifera indica',
    family: 'Anacardiaceae', origin: 'South Asia', category: 'FRUIT', emoji: '🥭',
    description: 'Mango is the national fruit of India and king of fruits with immense commercial value.',
    descriptionHindi: 'आम भारत का राष्ट्रीय फल है और फलों का राजा है जिसका व्यावसायिक महत्व अत्यधिक है।',
    climate: { temp: '24-30°C', rainfall: '750-1500mm', humidity: '50-70%', sunlight: '8-10 hours' },
    soil: { type: 'Deep Alluvial', pH: '5.5-7.5', drainage: 'Well drained', organic: 'Medium' },
    seasons: { primary: 'Summer', sowing: 'Jul-Aug (planting)', harvest: 'Apr-Jun', duration: '3-5 years to fruiting' },
    varieties: [
      { name: 'Dashehari', yield: '200-300 kg/tree/year', days: 1460, suitable: 'UP, Uttarakhand', best: true },
      { name: 'Langra', yield: '150-250 kg/tree/year', days: 1460, suitable: 'UP, Bihar', best: false },
      { name: 'Alphonso', yield: '100-200 kg/tree/year', days: 1460, suitable: 'Maharashtra, Goa', best: false },
      { name: 'Mallika', yield: '200-300 kg/tree/year', days: 1460, suitable: 'South India', best: false }
    ],
    nutrition: {
      nitrogen: { dose: '1 kg/tree (adult)', source: 'Urea', timing: '2 splits' },
      phosphorus: { dose: '0.5 kg/tree', source: 'SSP', timing: 'Annually, pre-monsoon' },
      potassium: { dose: '1 kg/tree', source: 'MOP', timing: 'Annually' }
    },
    irrigation: [
      { stage: 'New planting (1st year)', days: 0, critical: true },
      { stage: 'Flowering', days: 1095, critical: true },
      { stage: 'Fruit set', days: 1120, critical: true },
      { stage: 'Fruit development', days: 1140, critical: true }
    ],
    pestsDiseases: [
      { name: 'Mango Hopper', hindi: 'मैंगो हॉपर', severity: 'HIGH', symptoms: 'Drying of flowers, black mold', treatment: 'Imidacloprid 17.8% SL @ 0.5ml/L at pre-flowering' },
      { name: 'Anthracnose', hindi: 'एन्थ्रेक्नोज', severity: 'HIGH', symptoms: 'Black lesions on fruits and leaves', treatment: 'Carbendazim 50% WP @ 1g/L' },
      { name: 'Mealybug', hindi: 'मीली बग', severity: 'HIGH', symptoms: 'White cottony masses, honeydew', treatment: 'Profenofos 50% EC @ 2ml/L, sticky bands on trunk' }
    ],
    harvesting: { method: 'Manual picking with pole', moisture: '70-80%', storage: 'Cold storage 8-12°C', shelfLife: '2-4 weeks' },
    profitAnalysis: { costPerAcre: 15000, yieldPerAcre: 100, pricePerQuintal: 2000, msp: 0, netProfit: 185000 },
    govtSupport: { msp: 0, schemes: ['PM-Kisan', 'PMFBY', 'NHM Horticulture', 'Export promotion'] },
    relatedCrops: ['banana', 'guava', 'papaya']
  },
  {
    slug: 'banana', name: 'Banana', nameHindi: 'केला', scientificName: 'Musa paradisiaca',
    family: 'Musaceae', origin: 'Southeast Asia', category: 'FRUIT', emoji: '🍌',
    description: 'Banana is one of the most important fruit crops of India grown throughout the year.',
    descriptionHindi: 'केला भारत की सबसे महत्वपूर्ण फल फसलों में से एक है जो साल भर उगाई जाती है।',
    climate: { temp: '20-35°C', rainfall: '1200-2500mm', humidity: '60-80%', sunlight: '8-9 hours' },
    soil: { type: 'Deep Rich Loam', pH: '6.0-7.5', drainage: 'Good', organic: 'Very High' },
    seasons: { primary: 'Annual', sowing: 'Jun-Jul / Dec-Jan', harvest: '11-14 months after planting', duration: '11-14 months' },
    varieties: [
      { name: 'G9 (Cavendish)', yield: '250-350 q/acre', days: 365, suitable: 'All India', best: true },
      { name: 'Robusta', yield: '200-280 q/acre', days: 390, suitable: 'South India', best: false },
      { name: 'Dwarf Cavendish', yield: '180-240 q/acre', days: 360, suitable: 'North India', best: false },
      { name: 'Grand Naine', yield: '280-360 q/acre', days: 350, suitable: 'Maharashtra, Gujarat', best: false }
    ],
    nutrition: {
      nitrogen: { dose: '200 kg/ha', source: 'Urea', timing: '6 splits' },
      phosphorus: { dose: '60 kg/ha', source: 'DAP', timing: 'At planting' },
      potassium: { dose: '300 kg/ha', source: 'MOP', timing: '6 splits - critical' }
    },
    irrigation: [
      { stage: 'Planting', days: 0, critical: true },
      { stage: 'Vegetative (3 months)', days: 90, critical: true },
      { stage: 'Shooting', days: 270, critical: true },
      { stage: 'Bunch development', days: 320, critical: true }
    ],
    pestsDiseases: [
      { name: 'Panama Wilt', hindi: 'पनामा रोग', severity: 'HIGH', symptoms: 'Yellowing and wilting of leaves, internal brown discoloration', treatment: 'No chemical cure - use resistant varieties, soil treatment with T. viride' },
      { name: 'Sigatoka', hindi: 'सिगाटोका', severity: 'MEDIUM', symptoms: 'Yellow streaks turning brown on leaves', treatment: 'Propiconazole 25% EC @ 0.1%' },
      { name: 'Banana Bract Mosaic', hindi: 'मोज़ेक वायरस', severity: 'HIGH', symptoms: 'Mosaic pattern on leaves', treatment: 'Remove infected plants, control aphid vectors' }
    ],
    harvesting: { method: 'Manual bunch cutting', moisture: '65-75%', storage: 'Ripen at room temp', shelfLife: '5-7 days ripe, 3-4 weeks green' },
    profitAnalysis: { costPerAcre: 45000, yieldPerAcre: 300, pricePerQuintal: 600, msp: 0, netProfit: 135000 },
    govtSupport: { msp: 0, schemes: ['PM-Kisan', 'PMFBY', 'NHM subsidy for TC plants'] },
    relatedCrops: ['mango', 'papaya', 'sugarcane']
  },
  {
    slug: 'soybean', name: 'Soybean', nameHindi: 'सोयाबीन', scientificName: 'Glycine max',
    family: 'Fabaceae', origin: 'East Asia', category: 'OILSEED', emoji: '🌱',
    description: 'Soybean is an important oilseed and protein-rich crop with excellent industrial uses.',
    descriptionHindi: 'सोयाबीन एक महत्वपूर्ण तिलहन और प्रोटीन युक्त फसल है जिसका औद्योगिक उपयोग अत्यधिक है।',
    climate: { temp: '26-30°C', rainfall: '600-800mm', humidity: '60-70%', sunlight: '8 hours' },
    soil: { type: 'Well-drained Loam', pH: '6.0-7.5', drainage: 'Good', organic: 'High' },
    seasons: { primary: 'Kharif', sowing: 'Jun 25 - Jul 20', harvest: 'Sep 25 - Oct 31', duration: '90-120 days' },
    varieties: [
      { name: 'JS-335', yield: '15-18 q/acre', days: 95, suitable: 'MP, Rajasthan', best: true },
      { name: 'JS-93-05', yield: '15-18 q/acre', days: 92, suitable: 'All India', best: false },
      { name: 'NRC-37', yield: '16-19 q/acre', days: 100, suitable: 'Vidarbha', best: false },
      { name: 'JS-9560', yield: '14-17 q/acre', days: 90, suitable: 'MP, Chhattisgarh', best: false }
    ],
    nutrition: {
      nitrogen: { dose: '25 kg/ha', source: 'DAP (starter dose)', timing: 'At sowing' },
      phosphorus: { dose: '60 kg/ha', source: 'SSP', timing: 'At sowing' },
      potassium: { dose: '40 kg/ha', source: 'MOP', timing: 'At sowing' }
    },
    irrigation: [
      { stage: 'Sowing (if needed)', days: 0, critical: false },
      { stage: 'Flowering', days: 35, critical: true },
      { stage: 'Pod filling', days: 55, critical: true },
      { stage: 'Seed development', days: 75, critical: true }
    ],
    pestsDiseases: [
      { name: 'Yellow Mosaic', hindi: 'पीली मोज़ेक', severity: 'HIGH', symptoms: 'Yellow mosaic pattern on leaves', treatment: 'Control whitefly vector - Imidacloprid 17.8% SL @ 0.5ml/L' },
      { name: 'Girdle Beetle', hindi: 'गर्डल बीटल', severity: 'HIGH', symptoms: 'Circular cuts on stem, wilting', treatment: 'Chlorpyrifos 20% EC @ 2ml/L' },
      { name: 'Stem Fly', hindi: 'तना मक्खी', severity: 'MEDIUM', symptoms: 'Yellow seedlings, dead heart', treatment: 'Imidacloprid seed treatment @ 5ml/kg' }
    ],
    harvesting: { method: 'Combine harvester', moisture: '12-15%', storage: 'Dry storage', shelfLife: '18 months' },
    profitAnalysis: { costPerAcre: 12000, yieldPerAcre: 16, pricePerQuintal: 4600, msp: 4600, netProfit: 61600 },
    govtSupport: { msp: 4600, schemes: ['PM-Kisan', 'PMFBY', 'NMOOP oilseed subsidy'] },
    relatedCrops: ['maize', 'cotton', 'chickpea']
  },
  {
    slug: 'cotton', name: 'Cotton', nameHindi: 'कपास', scientificName: 'Gossypium hirsutum',
    family: 'Malvaceae', origin: 'Africa/India', category: 'CASH', emoji: '☁️',
    description: 'Cotton is the most important commercial fiber crop of India called white gold.',
    descriptionHindi: 'कपास भारत की सबसे महत्वपूर्ण व्यावसायिक रेशा फसल है जिसे सफेद सोना भी कहा जाता है।',
    climate: { temp: '21-30°C', rainfall: '500-900mm', humidity: '40-60%', sunlight: '10-12 hours' },
    soil: { type: 'Black Cotton Soil', pH: '6.0-8.0', drainage: 'Good to moderate', organic: 'Medium' },
    seasons: { primary: 'Kharif', sowing: 'Apr 15 - May 31', harvest: 'Oct 1 - Feb 28', duration: '150-180 days' },
    varieties: [
      { name: 'Bt Cotton RCH-2', yield: '15-20 q/acre', days: 165, suitable: 'All India', best: true },
      { name: 'MRC-7301', yield: '14-18 q/acre', days: 160, suitable: 'Black soil area', best: false },
      { name: 'NHH-44', yield: '16-20 q/acre', days: 170, suitable: 'Gujarat, Maharashtra', best: false },
      { name: 'PCH-3', yield: '15-19 q/acre', days: 155, suitable: 'Punjab, Haryana', best: false }
    ],
    nutrition: {
      nitrogen: { dose: '120 kg/ha', source: 'Urea', timing: '4 splits' },
      phosphorus: { dose: '60 kg/ha', source: 'DAP', timing: 'At sowing' },
      potassium: { dose: '60 kg/ha', source: 'MOP', timing: '2 splits' }
    },
    irrigation: [
      { stage: 'Sowing', days: 0, critical: true },
      { stage: 'Squaring (45 days)', days: 45, critical: true },
      { stage: 'Flowering', days: 70, critical: true },
      { stage: 'Boll development', days: 100, critical: true }
    ],
    pestsDiseases: [
      { name: 'Pink Bollworm', hindi: 'गुलाबी सुंडी', severity: 'HIGH', symptoms: 'Rosette flowers, damaged bolls', treatment: 'Emamectin Benzoate 5% SG @ 0.4g/L' },
      { name: 'Whitefly', hindi: 'सफेद मक्खी', severity: 'HIGH', symptoms: 'Leaf curl virus vector, honeydew', treatment: 'Spiromesifen 22.9% SC @ 1ml/L' },
      { name: 'Thrips', hindi: 'थ्रिप्स', severity: 'MEDIUM', symptoms: 'Silvery patches on leaves', treatment: 'Fipronil 5% SC @ 1.5ml/L on seedlings' }
    ],
    harvesting: { method: 'Manual picking (3-4 pickings)', moisture: '10-12%', storage: 'Dry godown', shelfLife: '24 months' },
    profitAnalysis: { costPerAcre: 28000, yieldPerAcre: 18, pricePerQuintal: 6620, msp: 6620, netProfit: 91160 },
    govtSupport: { msp: 6620, schemes: ['PM-Kisan', 'PMFBY', 'Technology Mission on Cotton', 'TUFS subsidy'] },
    relatedCrops: ['soybean', 'sugarcane', 'sunflower']
  }
]

async function main() {
  console.log('🌾 Seeding CropWiki table...')
  let count = 0
  for (const crop of crops) {
    await prisma.cropWiki.upsert({
      where: { slug: crop.slug },
      update: crop,
      create: crop
    })
    count++
    console.log(`  ✓ ${crop.nameHindi} (${crop.name})`)
  }
  console.log(`\n✅ Done! Seeded ${count} crops.`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
