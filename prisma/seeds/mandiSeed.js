const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const MANDIS = [
  { name: 'Meerut Mandi',        nameHindi: 'मेरठ मंडी',          lat: 28.9845, lng: 77.7064, district: 'Meerut',               totalTraders: 320, address: 'Meerut Agricultural Produce Market, Meerut', phone: '0121-2764001' },
  { name: 'Muzaffarnagar Mandi', nameHindi: 'मुज़फ्फरनगर मंडी', lat: 29.4727, lng: 77.7085, district: 'Muzaffarnagar',          totalTraders: 280, address: 'Main Mandi, Muzaffarnagar', phone: '0131-2400123' },
  { name: 'Hapur Mandi',         nameHindi: 'हापुड़ मंडी',         lat: 28.7300, lng: 77.7757, district: 'Hapur',                totalTraders: 190, address: 'Mandi Samiti, Hapur', phone: '0122-2301456' },
  { name: 'Saharanpur Mandi',    nameHindi: 'सहारनपुर मंडी',     lat: 29.9680, lng: 77.5552, district: 'Saharanpur',            totalTraders: 260, address: 'Krishi Mandi, Saharanpur', phone: '0132-2712000' },
  { name: 'Bulandshahr Mandi',   nameHindi: 'बुलंदशहर मंडी',    lat: 28.4069, lng: 77.8496, district: 'Bulandshahr',           totalTraders: 210, address: 'Main Mandi, Bulandshahr', phone: '05732-220432' },
  { name: 'Mathura Mandi',       nameHindi: 'मथुरा मंडी',        lat: 27.4924, lng: 77.6737, district: 'Mathura',               totalTraders: 245, address: 'Vrindavan Road Mandi, Mathura', phone: '0565-2400765' },
  { name: 'Agra Mandi',          nameHindi: 'आगरा मंडी',         lat: 27.1767, lng: 78.0081, district: 'Agra',                  totalTraders: 350, address: 'Sanjay Place Mandi, Agra', phone: '0562-2850001' },
  { name: 'Aligarh Mandi',       nameHindi: 'अलीगढ़ मंडी',      lat: 27.8974, lng: 78.0880, district: 'Aligarh',               totalTraders: 275, address: 'Quarsi Road Mandi, Aligarh', phone: '0571-2700234' },
  { name: 'Bareilly Mandi',      nameHindi: 'बरेली मंडी',        lat: 28.3670, lng: 79.4304, district: 'Bareilly',              totalTraders: 295, address: 'Pilibhit Bypass Mandi, Bareilly', phone: '0581-2303456' },
  { name: 'Moradabad Mandi',     nameHindi: 'मुरादाबाद मंडी',   lat: 28.8389, lng: 78.7768, district: 'Moradabad',             totalTraders: 285, address: 'Kanth Road Mandi, Moradabad', phone: '0591-2490123' },
  { name: 'Rampur Mandi',        nameHindi: 'रामपुर मंडी',       lat: 28.7989, lng: 79.0051, district: 'Rampur',                totalTraders: 180, address: 'Civil Lines Mandi, Rampur', phone: '0595-2350765' },
  { name: 'Shamli Mandi',        nameHindi: 'शामली मंडी',        lat: 29.4500, lng: 77.3167, district: 'Shamli',                totalTraders: 145, address: 'Old Mandi, Shamli', phone: '01398-245678' },
  { name: 'Ghaziabad Mandi',     nameHindi: 'गाजियाबाद मंडी',   lat: 28.6692, lng: 77.4538, district: 'Ghaziabad',             totalTraders: 310, address: 'Loni Road Mandi, Ghaziabad', phone: '0120-2784567' },
  { name: 'Noida Mandi',         nameHindi: 'नोएडा मंडी',        lat: 28.5355, lng: 77.3910, district: 'Gautam Buddh Nagar',   totalTraders: 265, address: 'Sector 33, Noida', phone: '0120-2432100' },
  { name: 'Kanpur Mandi',        nameHindi: 'कानपुर मंडी',       lat: 26.4499, lng: 80.3319, district: 'Kanpur',                totalTraders: 390, address: 'Naubasta Mandi, Kanpur', phone: '0512-2540001' },
  { name: 'Lucknow Mandi',       nameHindi: 'लखनऊ मंडी',         lat: 26.8467, lng: 80.9462, district: 'Lucknow',               totalTraders: 420, address: 'Amausi Mandi, Lucknow', phone: '0522-2432345' },
  { name: 'Varanasi Mandi',      nameHindi: 'वाराणसी मंडी',     lat: 25.3176, lng: 82.9739, district: 'Varanasi',              totalTraders: 340, address: 'Pandeypur Mandi, Varanasi', phone: '0542-2502456' },
  { name: 'Allahabad Mandi',     nameHindi: 'प्रयागराज मंडी',    lat: 25.4358, lng: 81.8463, district: 'Prayagraj',             totalTraders: 360, address: 'Naini Mandi, Prayagraj', phone: '0532-2690001' },
  { name: 'Gorakhpur Mandi',     nameHindi: 'गोरखपुर मंडी',     lat: 26.7606, lng: 83.3732, district: 'Gorakhpur',             totalTraders: 300, address: 'Industrial Area Mandi, Gorakhpur', phone: '0551-2200234' },
  { name: 'Jhansi Mandi',        nameHindi: 'झाँसी मंडी',         lat: 25.4484, lng: 78.5685, district: 'Jhansi',                totalTraders: 230, address: 'Sipri Bazar Mandi, Jhansi', phone: '0510-2330456' },
  { name: 'Etawah Mandi',        nameHindi: 'इटावा मंडी',         lat: 26.7687, lng: 79.0165, district: 'Etawah',                totalTraders: 175, address: 'Main Mandi, Etawah', phone: '05688-250123' },
  { name: 'Firozabad Mandi',     nameHindi: 'फिरोजाबाद मंडी',   lat: 27.1591, lng: 78.3957, district: 'Firozabad',             totalTraders: 195, address: 'Sugar Mill Road Mandi, Firozabad', phone: '05612-235678' },
  { name: 'Mainpuri Mandi',      nameHindi: 'मैनपुरी मंडी',       lat: 27.2291, lng: 79.0134, district: 'Mainpuri',              totalTraders: 160, address: 'Old Bus Stand Mandi, Mainpuri', phone: '05672-268001' },
  { name: 'Bijnor Mandi',        nameHindi: 'बिजनौर मंडी',       lat: 29.3723, lng: 78.1358, district: 'Bijnor',                totalTraders: 170, address: 'Nagina Road Mandi, Bijnor', phone: '01342-262456' },
  { name: 'Amroha Mandi',        nameHindi: 'अमरोहा मंडी',        lat: 28.9043, lng: 78.4672, district: 'Amroha',                totalTraders: 155, address: 'Delhi Road Mandi, Amroha', phone: '05922-243001' },
]

const COMMODITIES = {
  wheat:     { base: 2150, hindi: 'गेहूं',    variance: 150, category: 'CEREALS'   },
  rice:      { base: 2800, hindi: 'धान',      variance: 200, category: 'CEREALS'   },
  mustard:   { base: 5200, hindi: 'सरसों',    variance: 300, category: 'OILSEEDS'  },
  potato:    { base: 800,  hindi: 'आलू',      variance: 200, category: 'VEGETABLES' },
  onion:     { base: 1500, hindi: 'प्याज',    variance: 400, category: 'VEGETABLES' },
  sugarcane: { base: 350,  hindi: 'गन्ना',    variance: 20,  category: 'SUGAR'     },
  maize:     { base: 1900, hindi: 'मक्का',    variance: 150, category: 'CEREALS'   },
  chickpea:  { base: 5500, hindi: 'चना',      variance: 400, category: 'PULSES'    },
  lentil:    { base: 6200, hindi: 'मसूर',     variance: 500, category: 'PULSES'    },
  soybean:   { base: 4200, hindi: 'सोयाबीन', variance: 300, category: 'OILSEEDS'  },
  barley:    { base: 1650, hindi: 'जौ',       variance: 100, category: 'CEREALS'   },
  cotton:    { base: 6500, hindi: 'कपास',     variance: 500, category: 'FIBERS'    },
}

function randBetween(min, max) {
  return Math.random() * (max - min) + min
}

function generatePrice(base, variance, dayOffset, trend = 0) {
  // Day-by-day drift to simulate realistic trends
  const dailyDrift  = trend * dayOffset * 10
  const noise       = randBetween(-variance * 0.5, variance * 0.5)
  const price       = Math.max(base * 0.6, base + dailyDrift + noise)
  const minP        = price * randBetween(0.90, 0.97)
  const maxP        = price * randBetween(1.03, 1.12)
  return { price: Math.round(price), minPrice: Math.round(minP), maxPrice: Math.round(maxP) }
}

async function main() {
  console.log('🌾 Seeding Mandi data...')

  // Clear old data
  await prisma.mandiPrice.deleteMany()
  await prisma.mandi.deleteMany()

  const today = new Date()

  for (const m of MANDIS) {
    const mandi = await prisma.mandi.create({
      data: {
        name:         m.name,
        nameHindi:    m.nameHindi,
        district:     m.district,
        state:        'Uttar Pradesh',
        lat:          m.lat,
        lng:          m.lng,
        address:      m.address,
        phone:        m.phone,
        totalTraders: m.totalTraders,
        isActive:     true,
      }
    })
    console.log(`  ✅ ${m.name}`)

    // Generate 30 days of prices for all commodities
    const prices = []
    for (const [key, cdata] of Object.entries(COMMODITIES)) {
      const trend = randBetween(-1, 1) // up/down trend per commodity per mandi
      let prevPrice = null

      for (let d = 29; d >= 0; d--) {
        const date = new Date(today)
        date.setDate(date.getDate() - d)
        date.setHours(10, 0, 0, 0)

        const { price, minPrice, maxPrice } = generatePrice(cdata.base, cdata.variance, 29 - d, trend)
        const change        = prevPrice ? price - prevPrice : 0
        const changePercent = prevPrice ? ((change / prevPrice) * 100) : 0
        const arrivals      = Math.round(randBetween(200, 2000))

        prices.push({
          mandiId:        mandi.id,
          commodity:      key,
          commodityHindi: cdata.hindi,
          price,
          minPrice,
          maxPrice,
          arrivals,
          date,
          change:         Math.round(change),
          changePercent:  Math.round(changePercent * 10) / 10,
          quality:        'FAQ',
        })
        prevPrice = price
      }
    }

    await prisma.mandiPrice.createMany({ data: prices })
  }

  console.log(`\n✅ Seeded ${MANDIS.length} mandis with 30 days × 12 commodities each`)
  console.log(`   Total price records: ${MANDIS.length * 12 * 30}`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
