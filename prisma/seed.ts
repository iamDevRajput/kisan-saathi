import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// UP Mandis with coordinates
const UP_MANDIS = [
  { name: 'Meerut', nameHindi: 'मेरठ', code: 'UP-MRT', district: 'Meerut', state: 'UP', lat: 28.9845, lng: 77.7064 },
  { name: 'Agra', nameHindi: 'आगरा', code: 'UP-AGR', district: 'Agra', state: 'UP', lat: 27.1767, lng: 78.0081 },
  { name: 'Lucknow', nameHindi: 'लखनऊ', code: 'UP-LKO', district: 'Lucknow', state: 'UP', lat: 26.8467, lng: 80.9462 },
  { name: 'Varanasi', nameHindi: 'वाराणसी', code: 'UP-VNS', district: 'Varanasi', state: 'UP', lat: 25.3176, lng: 82.9739 },
  { name: 'Kanpur', nameHindi: 'कानपुर', code: 'UP-KNP', district: 'Kanpur', state: 'UP', lat: 26.4499, lng: 80.3319 },
  { name: 'Mathura', nameHindi: 'मथुरा', code: 'UP-MTH', district: 'Mathura', state: 'UP', lat: 27.4924, lng: 77.6737 },
  { name: 'Aligarh', nameHindi: 'अलीगढ़', code: 'UP-ALG', district: 'Aligarh', state: 'UP', lat: 27.8974, lng: 78.0880 },
  { name: 'Bareilly', nameHindi: 'बरेली', code: 'UP-BLY', district: 'Bareilly', state: 'UP', lat: 28.3670, lng: 79.4304 },
  { name: 'Moradabad', nameHindi: 'मुरादाबाद', code: 'UP-MBD', district: 'Moradabad', state: 'UP', lat: 28.8386, lng: 78.7733 },
  { name: 'Gorakhpur', nameHindi: 'गोरखपुर', code: 'UP-GKP', district: 'Gorakhpur', state: 'UP', lat: 26.7606, lng: 83.3732 },
  { name: 'Jhansi', nameHindi: 'झांसी', code: 'UP-JHS', district: 'Jhansi', state: 'UP', lat: 25.4484, lng: 78.5685 },
  { name: 'Prayagraj', nameHindi: 'प्रयागराज', code: 'UP-PRJ', district: 'Prayagraj', state: 'UP', lat: 25.4358, lng: 81.8463 },
  { name: 'Saharanpur', nameHindi: 'सहारनपुर', code: 'UP-SRN', district: 'Saharanpur', state: 'UP', lat: 29.9680, lng: 77.5510 },
  { name: 'Muzaffarnagar', nameHindi: 'मुजफ्फरनगर', code: 'UP-MZN', district: 'Muzaffarnagar', state: 'UP', lat: 29.4727, lng: 77.7085 },
  { name: 'Hapur', nameHindi: 'हापुड़', code: 'UP-HPR', district: 'Hapur', state: 'UP', lat: 28.7307, lng: 77.7759 },
];

// Commodities
const COMMODITIES = [
  { name: 'Wheat', nameHindi: 'गेहूं', basePrice: 2275, category: 'CEREALS' },
  { name: 'Rice', nameHindi: 'धान', basePrice: 2183, category: 'CEREALS' },
  { name: 'Mustard', nameHindi: 'सरसों', basePrice: 5450, category: 'OILSEEDS' },
  { name: 'Potato', nameHindi: 'आलू', basePrice: 1250, category: 'VEGETABLES' },
  { name: 'Onion', nameHindi: 'प्याज', basePrice: 1800, category: 'VEGETABLES' },
  { name: 'Sugarcane', nameHindi: 'गन्ना', basePrice: 350, category: 'SUGAR' },
  { name: 'Cotton', nameHindi: 'कपास', basePrice: 6620, category: 'FIBERS' },
  { name: 'Maize', nameHindi: 'मक्का', basePrice: 2090, category: 'CEREALS' },
  { name: 'Chickpea', nameHindi: 'चना', basePrice: 5335, category: 'PULSES' },
  { name: 'Lentil', nameHindi: 'मसूर', basePrice: 6000, category: 'PULSES' },
  { name: 'Soybean', nameHindi: 'सोयाबीन', basePrice: 4600, category: 'OILSEEDS' },
  { name: 'Barley', nameHindi: 'जौ', basePrice: 1850, category: 'CEREALS' },
];

// Government Schemes
const SCHEMES = [
  {
    schemeCode: 'PM-KISAN',
    name: 'PM Kisan Samman Nidhi',
    nameLocal: 'पीएम किसान सम्मान निधि',
    shortDescription: 'Direct income support of ₹6000/year to farmer families',
    fullDescription: 'Under PM-KISAN scheme, all landholding farmer families get up to ₹6,000 per year as minimum income support. The amount is paid in three equal installments of ₹2,000 each.',
    category: 'SUBSIDY',
    eligibilityCriteria: { landRequired: true, maxLand: null },
    eligibleStates: ['ALL'],
    eligibleCrops: ['ALL'],
    benefits: [{ type: 'CASH', amount: 6000, frequency: 'YEARLY' }],
    applicationProcess: ['Register on pmkisan.gov.in', 'Submit Aadhaar', 'Link bank account'],
    requiredDocuments: ['Aadhaar Card', 'Bank Account', 'Land Records'],
    applicationUrl: 'https://pmkisan.gov.in',
    status: 'ACTIVE',
    isPermanent: true,
  },
  {
    schemeCode: 'PMFBY',
    name: 'Pradhan Mantri Fasal Bima Yojana',
    nameLocal: 'प्रधानमंत्री फसल बीमा योजना',
    shortDescription: 'Crop insurance with subsidized premium rates',
    fullDescription: 'Comprehensive crop insurance scheme providing financial support to farmers suffering crop loss due to natural calamities, pests & diseases.',
    category: 'INSURANCE',
    eligibilityCriteria: { landRequired: true },
    eligibleStates: ['ALL'],
    eligibleCrops: ['ALL'],
    benefits: [{ type: 'INSURANCE', coverage: 'Full crop value', premiumSubsidy: '50-90%' }],
    applicationProcess: ['Apply through bank', 'Submit land records', 'Pay premium'],
    requiredDocuments: ['Aadhaar Card', 'Land Records', 'Bank Account', 'Sowing Certificate'],
    applicationUrl: 'https://pmfby.gov.in',
    status: 'ACTIVE',
    isPermanent: true,
  },
  {
    schemeCode: 'KCC',
    name: 'Kisan Credit Card',
    nameLocal: 'किसान क्रेडिट कार्ड',
    shortDescription: 'Easy credit up to ₹3 lakh at 4% interest',
    fullDescription: 'KCC provides farmers with timely access to credit for purchase of inputs during crop season and post-harvest expenses.',
    category: 'LOAN',
    eligibilityCriteria: { landRequired: true, minAge: 18, maxAge: 75 },
    eligibleStates: ['ALL'],
    eligibleCrops: ['ALL'],
    benefits: [{ type: 'LOAN', maxAmount: 300000, interestRate: 4 }],
    applicationProcess: ['Apply at bank', 'Submit documents', 'Get card issued'],
    requiredDocuments: ['Aadhaar Card', 'PAN Card', 'Land Records', 'Passport Photo'],
    applicationUrl: 'https://www.nabard.org/kcc',
    status: 'ACTIVE',
    isPermanent: true,
  },
];

// Pest Alerts
const PEST_ALERTS = [
  {
    region: 'Western UP',
    district: 'Meerut',
    state: 'UP',
    pestName: 'Fall Armyworm',
    pestNameHindi: 'फॉल आर्मीवर्म',
    severity: 7,
    affectedCrops: ['Maize', 'Rice'],
    description: 'Fall armyworm infestation reported in maize fields',
    preventiveMeasures: ['Install pheromone traps', 'Apply neem oil spray', 'Remove affected plants'],
    source: 'State Agriculture Department',
    isActive: true,
  },
  {
    region: 'Central UP',
    district: 'Lucknow',
    state: 'UP',
    pestName: 'Brown Plant Hopper',
    pestNameHindi: 'भूरा फुदका',
    severity: 5,
    affectedCrops: ['Rice'],
    description: 'Moderate BPH population detected in rice paddies',
    preventiveMeasures: ['Avoid excessive nitrogen', 'Maintain water level', 'Use resistant varieties'],
    source: 'Krishi Vigyan Kendra',
    isActive: true,
  },
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Seed Mandis
  console.log('📍 Seeding mandis...');
  for (const mandi of UP_MANDIS) {
    await prisma.mandiList.upsert({
      where: { code: mandi.code },
      update: {},
      create: {
        name: mandi.name,
        nameHindi: mandi.nameHindi,
        code: mandi.code,
        district: mandi.district,
        state: mandi.state,
        latitude: mandi.lat,
        longitude: mandi.lng,
        activeCommodities: COMMODITIES.map(c => c.name),
        isActive: true,
      },
    });
  }
  console.log(`  ✅ ${UP_MANDIS.length} mandis seeded`);

  // Seed Government Schemes
  console.log('🏛️ Seeding government schemes...');
  for (const scheme of SCHEMES) {
    await prisma.governmentScheme.upsert({
      where: { schemeCode: scheme.schemeCode },
      update: {},
      create: scheme,
    });
  }
  console.log(`  ✅ ${SCHEMES.length} schemes seeded`);

  // Seed Pest Alerts
  console.log('🐛 Seeding pest alerts...');
  for (const alert of PEST_ALERTS) {
    await prisma.pestAlert.create({
      data: alert,
    });
  }
  console.log(`  ✅ ${PEST_ALERTS.length} pest alerts seeded`);

  // Seed Market Prices (30-day history)
  console.log('📊 Seeding market prices...');
  const today = new Date();
  let priceCount = 0;
  
  for (const mandi of UP_MANDIS.slice(0, 5)) { // First 5 mandis for demo
    for (const commodity of COMMODITIES.slice(0, 6)) { // First 6 commodities
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        const variation = (Math.sin(i + mandi.name.charCodeAt(0)) + 1) / 2 * 0.16 - 0.08;
        const price = Math.round(commodity.basePrice * (1 + variation));
        
        await prisma.marketPrice.create({
          data: {
            cropName: commodity.name,
            cropVariety: null,
            category: commodity.category as any,
            marketName: mandi.name,
            marketCode: mandi.code,
            state: 'UP',
            district: mandi.district,
            price,
            minPrice: Math.round(price * 0.95),
            maxPrice: Math.round(price * 1.05),
            avgPrice: price,
            arrivals: Math.round(500 + Math.random() * 2000),
            arrivalDate: date,
            trend: 'STABLE',
          },
        });
        priceCount++;
      }
    }
  }
  console.log(`  ✅ ${priceCount} price records seeded`);

  console.log('');
  console.log('🎉 Database seeding completed successfully!');
  console.log('');
  console.log('Summary:');
  console.log(`  • Mandis: ${UP_MANDIS.length}`);
  console.log(`  • Government Schemes: ${SCHEMES.length}`);
  console.log(`  • Pest Alerts: ${PEST_ALERTS.length}`);
  console.log(`  • Market Prices: ${priceCount}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
