const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// We'll need a real userId to attach posts/comments — use first user or create demo
async function getOrCreateDemoUsers() {
  const existing = await prisma.user.findMany({ take: 5, select: { id: true } })
  if (existing.length >= 3) return existing.map(u => u.id)

  // Create demo users if none exist
  const users = []
  const demos = [
    { email: 'ramesh@demo.com', name: 'Ramesh Kumar',  phone: '9876543210', location: 'Meerut, UP',     latitude: 28.9845, longitude: 77.7064 },
    { email: 'sunita@demo.com', name: 'Sunita Devi',   phone: '9876543211', location: 'Lucknow, UP',   latitude: 26.8467, longitude: 80.9462 },
    { email: 'harpal@demo.com', name: 'Harpal Singh',  phone: '9876543212', location: 'Muzaffarnagar', latitude: 29.4727, longitude: 77.7085 },
    { email: 'priya@demo.com',  name: 'Priya Sharma',  phone: '9876543213', location: 'Agra, UP',      latitude: 27.1767, longitude: 78.0081 },
    { email: 'vijay@demo.com',  name: 'Vijay Yadav',   phone: '9876543214', location: 'Kanpur, UP',    latitude: 26.4499, longitude: 80.3319 },
  ]
  for (const d of demos) {
    const u = await prisma.user.upsert({
      where:  { email: d.email },
      create: { ...d, role: 'FARMER' },
      update: {}
    })
    users.push(u.id)
  }
  return users
}

const POSTS = [
  // TIP posts — farming tips in Hindi
  {
    type: 'TIP', crop: 'wheat',
    title: 'गेहूं में यूरिया डालने का सही समय',
    content: 'भाइयों, गेहूं की फसल में यूरिया डालने का सबसे अच्छा समय बुवाई के 21-25 दिन बाद होता है। शाम को खेत में हल्की सिंचाई के बाद यूरिया डालें। 50 किलो प्रति एकड़ से ज़्यादा नहीं डालें। मैंने इस साल यही किया और फसल बहुत अच्छी है।',
    tags: ['#गेहूं', '#यूरिया', '#खाद', '#किसानटिप्स'], district: 'Meerut', state: 'UP', likesCount: 187, commentsCount: 34, lat: 28.98, lng: 77.70
  },
  {
    type: 'TIP', crop: 'mustard',
    title: 'सरसों में सफ़ेद रतुआ से बचाव',
    content: 'सरसों की फसल में सफ़ेद रतुआ (White Rust) बहुत नुकसान करती है। मैंने Ridomil Gold 72 WP का छिड़काव 2.5 ग्राम/लीटर पानी में मिलाकर किया और फसल बच गई। नवंबर-दिसंबर में जब कोहरा हो तब 10-12 दिन में एक बार छिड़काव ज़रूर करें।',
    tags: ['#सरसों', '#रोगनियंत्रण', '#किसानटिप्स'], district: 'Muzaffarnagar', state: 'UP', likesCount: 143, commentsCount: 28, lat: 29.47, lng: 77.70
  },
  {
    type: 'TIP', crop: 'potato',
    title: 'आलू में पानी देने का सही तरीका',
    content: 'आलू की फसल में ज़्यादा पानी नुकसानदायक होता है। मेरा अनुभव: हफ़्ते में एक बार हल्की सिंचाई करें, ज़्यादा पानी से आलू सड़ जाते हैं। खेत में पानी खड़ा नहीं होना चाहिए। ड्रिप इरिगेशन हो तो सबसे अच्छा है — पानी की बचत + अच्छी पैदावार।',
    tags: ['#आलू', '#सिंचाई', '#किसानटिप्स'], district: 'Agra', state: 'UP', likesCount: 98, commentsCount: 21, lat: 27.17, lng: 78.00
  },
  {
    type: 'TIP', crop: 'rice',
    title: 'धान की नर्सरी तैयार करने का आसान तरीका',
    content: 'एक एकड़ खेत के लिए मात्र 200 वर्गमीटर नर्सरी काफ़ी है। मिट्टी में 1:1:1 अनुपात में मिट्टी, खाद और बालू मिलाएं। बीज को 24 घंटे पानी में भिगोकर फिर बोएं। 25-30 दिन में पौध तैयार हो जाती है। इस बार मैंने हाइब्रिड Pusa Basmati-1637 लगाया — बढ़िया नतीजा मिला।',
    tags: ['#धान', '#नर्सरी', '#खेती'], district: 'Hapur', state: 'UP', likesCount: 134, commentsCount: 45, lat: 28.73, lng: 77.77
  },
  {
    type: 'TIP', crop: 'sugarcane',
    title: 'गन्ने में रेड रॉट बीमारी की पहचान',
    content: 'गन्ने की रेड रॉट बीमारी बहुत खतरनाक है। पत्तियां पीली पड़ें + अंदर से लाल धब्बे तो तुरंत पहचानें। बीमार गन्ना तुरंत उखाड़कर जला दें। स्वस्थ बीज ही बोएं। Carbendazim 50% WP से बीज उपचार करें। मेरे खेत में 2 साल से कोई बीमारी नहीं।',
    tags: ['#गन्ना', '#रोग', '#किसानटिप्स'], district: 'Saharanpur', state: 'UP', likesCount: 112, commentsCount: 19, lat: 29.96, lng: 77.55
  },

  // PEST_ALERT posts
  {
    type: 'PEST_ALERT', crop: 'wheat',
    title: '⚠️ गेहूं में पीला रतुआ फैल रहा है — मेरठ क्षेत्र',
    content: 'भाइयों सावधान! मेरठ और हापुड़ के इलाके में गेहूं की फसल में पीला रतुआ (Yellow Rust) का प्रकोप देखा जा रहा है। पत्तियों पर पीले-नारंगी रंग की धारियां दिखें तो तुरंत Propiconazole 25 EC का छिड़काव 1 ml/लीटर पानी में करें। देरी मत करें!',
    tags: ['#गेहूं', '#पीलारतुआ', '#कीटअलर्ट', '#मेरठ'], district: 'Meerut', state: 'UP', likesCount: 234, commentsCount: 67, lat: 28.98, lng: 77.70
  },
  {
    type: 'PEST_ALERT', crop: 'mustard',
    title: '🐛 सरसों में माहू (Aphid) का हमला — बचाव करें',
    content: 'पिछले हफ़्ते से मुज़फ्फरनगर में सरसों की फसल में माहू (Aphid) का ज़बरदस्त हमला हो रहा है। छोटे-छोटे हरे-काले कीड़े फूलों और पत्तियों का रस चूस रहे हैं। Imidacloprid 17.8 SL 0.5 ml/लीटर या Dimethoate 30 EC का छिड़काव करें। मेरी फसल बच गई।',
    tags: ['#सरसों', '#माहू', '#Aphid', '#कीटअलर्ट'], district: 'Muzaffarnagar', state: 'UP', likesCount: 198, commentsCount: 52, lat: 29.47, lng: 77.70
  },
  {
    type: 'PEST_ALERT', crop: 'potato',
    title: '⚠️ आलू में पछेती झुलसा (Late Blight) — मुरादाबाद',
    content: 'आलू की फसल में पछेती झुलसा फिर से फैल रहा है। पत्तियों पर पानी जैसे धब्बे, पीली किनारी, और सफ़ेद फफूंदी दिखे तो तुरंत Mancozeb 75 WP का छिड़काव 2.5 ग्राम/लीटर पानी में करें। हर 8-10 दिन में दोहराएं। इस मौसम में कोहरे के कारण ख़तरा ज़्यादा है।',
    tags: ['#आलू', '#झुलसा', '#LateBlight', '#कीटअलर्ट'], district: 'Moradabad', state: 'UP', likesCount: 167, commentsCount: 38, lat: 28.83, lng: 78.77
  },
  {
    type: 'PEST_ALERT', crop: 'rice',
    title: '🌾 धान में स्टेम बोरर का प्रकोप — गोरखपुर',
    content: 'गोरखपुर और देवरिया जिले में धान की फसल में तना छेदक (Stem Borer) का हमला देखा गया। बड़े पौधे में डेड हार्ट और छोटे में व्हाइट ईयर की समस्या है। Chlorpyriphos 20 EC 2 लीटर/हेक्टेयर या Carbofuran 3G 25 kg/हेक्टेयर का उपयोग करें।',
    tags: ['#धान', '#तनाछेदक', '#कीटअलर्ट', '#गोरखपुर'], district: 'Gorakhpur', state: 'UP', likesCount: 145, commentsCount: 31, lat: 26.76, lng: 83.37
  },

  // PRICE_ALERT posts
  {
    type: 'PRICE_ALERT', crop: 'wheat',
    title: '💰 गेहूं का भाव — आज मेरठ मंडी ₹2,450/क्विंटल',
    content: 'आज मेरठ मंडी में गेहूं का भाव ₹2,450/क्विंटल मिल रहा है। पिछले हफ़्ते से ₹80 ज़्यादा है। अगले हफ़्ते कुछ और तेज़ी आ सकती है। मेरे 30 क्विंटल से अच्छा पैसा मिला। जो भाई अभी बेचना चाहते हैं उनके लिए अच्छा मौका है।',
    tags: ['#गेहूं', '#मंडीभाव', '#मेरठ', '#प्राइसअलर्ट'], district: 'Meerut', state: 'UP', likesCount: 89, commentsCount: 23, lat: 28.98, lng: 77.70
  },
  {
    type: 'PRICE_ALERT', crop: 'mustard',
    title: '💰 सरसों का भाव बढ़ा — मुज़फ्फरनगर ₹5,600/क्विंटल',
    content: 'आज मुज़फ्फरनगर मंडी में सरसों ₹5,600/क्विंटल पर बिक रही है। आगरा में ₹5,350 और कानपुर में ₹5,280 है। अगर आपके पास स्टोर करने की जगह है तो 15 दिन और रोक सकते हैं। लेकिन अभी भी MSP से ₹400 ज़्यादा मिल रहा है।',
    tags: ['#सरसों', '#मंडीभाव', '#MSP', '#प्राइसअलर्ट'], district: 'Muzaffarnagar', state: 'UP', likesCount: 121, commentsCount: 29, lat: 29.47, lng: 77.70
  },
  {
    type: 'PRICE_ALERT', crop: 'potato',
    title: '📉 आलू का भाव गिरा — आगरा में ₹600/क्विंटल',
    content: 'चेतावनी: आगरा और मथुरा मंडी में आलू का भाव ₹600/क्विंटल तक आ गया है। बड़े व्यापारी ख़रीदारी नहीं कर रहे। अगर आपके पास कोल्ड स्टोरेज की सुविधा है तो 2-3 महीने रोकें। मार्च-अप्रैल में भाव बेहतर होगा।',
    tags: ['#आलू', '#मंडीभाव', '#कोल्डस्टोरेज', '#प्राइसअलर्ट'], district: 'Agra', state: 'UP', likesCount: 76, commentsCount: 41, lat: 27.17, lng: 78.00
  },

  // SUCCESS_STORY posts
  {
    type: 'SUCCESS_STORY', crop: 'wheat',
    title: '🏆 इस साल 40% ज़्यादा गेहूं की पैदावार — मेरा तजुर्बा',
    content: 'भाइयो, मैं शेयर करना चाहता हूं कि इस साल KisanSaathi की AI सलाह से मेरे 5 एकड़ गेहूं में पिछले साल से 40% ज़्यादा पैदावार हुई। सही समय पर खाद डाली, मंडी में सही भाव पर बेचा। कुल 8 लाख रुपए मिले। परिवार बहुत खुश है। मेहनत और सही जानकारी से सब होता है।',
    tags: ['#गेहूं', '#सफलताकहानी', '#KisanSaathi', '#खेती'], district: 'Meerut', state: 'UP', likesCount: 456, commentsCount: 87, lat: 28.98, lng: 77.70
  },
  {
    type: 'SUCCESS_STORY', crop: 'mustard',
    title: '🌟 सरसों की जैविक खेती से दोगुना मुनाफ़ा',
    content: 'मैंने इस साल पहली बार सरसों की जैविक खेती की। शुरुआत में डर था लेकिन नतीजा ज़बरदस्त रहा। जैविक सरसों ₹6,200/क्विंटल पर बिकी जबकि सामान्य ₹5,200 पर। 3 एकड़ में 15 क्विंटल पैदावार, कुल ₹93,000 की कमाई। दोस्तों, जैविक खेती ज़रूर आज़माएं।',
    tags: ['#सरसों', '#जैविकखेती', '#Organic', '#सफलताकहानी'], district: 'Saharanpur', state: 'UP', likesCount: 312, commentsCount: 56, lat: 29.96, lng: 77.55
  },
  {
    type: 'SUCCESS_STORY', crop: 'potato',
    title: '🥔 आलू की खेती ने घर बनवाया — मेरी कहानी',
    content: '3 साल पहले मेरे पास सिर्फ़ 2 एकड़ ज़मीन थी। आलू की वैज्ञानिक खेती सीखी, Kufri Pukhraj किस्म लगाई, ड्रिप सिंचाई लगाई। पहले साल ही 28 क्विंटल/एकड़ पैदावार हुई। कोल्ड स्टोरेज में रखा और मार्च में ₹1,200/क्विंटल पर बेचा। इस साल मकान का काम शुरू हो गया।',
    tags: ['#आलू', '#सफलताकहानी', '#वैज्ञानिकखेती', '#कोल्डस्टोरेज'], district: 'Aligarh', state: 'UP', likesCount: 267, commentsCount: 43, lat: 27.89, lng: 78.08
  },

  // QUESTION posts
  {
    type: 'QUESTION', crop: 'wheat',
    title: '❓ गेहूं में पत्तियां पीली हो रही हैं — क्या करूं?',
    content: 'भाइयों, मेरे गेहूं की पत्तियां बुवाई के 35 दिन बाद से पीली पड़ रही हैं। खेत में पानी ठीक दे रहा हूं। यूरिया भी 40 किलो/एकड़ डाल दिया है। फिर भी पीला हो रहा है। क्या सल्फर की कमी हो सकती है? या कोई बीमारी है? कोई जानकार भाई बताएं।',
    tags: ['#गेहूं', '#पीलापन', '#सवाल', '#किसान'], district: 'Bareilly', state: 'UP', likesCount: 45, commentsCount: 78, lat: 28.36, lng: 79.43
  },
  {
    type: 'QUESTION', crop: 'rice',
    title: '❓ धान की सीधी बुवाई (DSR) कब और कैसे करें?',
    content: 'मैं इस साल धान की रोपाई की जगह सीधी बुवाई (Direct Seeded Rice) करना चाहता हूं। पानी की बचत होगी और मज़दूरी भी कम लगेगी। लेकिन मुझे नहीं पता कि कब बोएं, कौन सी किस्म लगाएं, और खरपतवार कैसे नियंत्रित करें। जिसने किया हो वो बताएं।',
    tags: ['#धान', '#DSR', '#सवाल', '#बुवाई'], district: 'Lucknow', state: 'UP', likesCount: 67, commentsCount: 52, lat: 26.84, lng: 80.94
  },
  {
    type: 'QUESTION', crop: 'mustard',
    title: '❓ सरसों की फसल 70 दिन की हो गई — कटाई कब करूं?',
    content: 'मेरी सरसों की फसल अब 70 दिन की हो गई है। 80-85% फलियां पीली हो गई हैं। बाकी अभी भी हरी हैं। क्या अभी काट दूं या थोड़ा और रुकूं? अगर बारिश आई तो नुकसान होगा — यह डर है। कोई अनुभवी भाई बताएं सही समय क्या है।',
    tags: ['#सरसों', '#कटाई', '#सवाल', '#फसल'], district: 'Kanpur', state: 'UP', likesCount: 34, commentsCount: 29, lat: 26.44, lng: 80.33
  },

  // WEATHER_ALERT posts
  {
    type: 'WEATHER_ALERT', crop: 'wheat',
    title: '⛈️ मेरठ-सहारनपुर में ओलावृष्टि का खतरा — 2 दिन में',
    content: 'मौसम विभाग के अनुसार अगले 48 घंटे में पश्चिमी UP में ओलावृष्टि का अनुमान है। अगर आपकी फसल कटने के क़रीब है तो जल्दी काट लें। जो फसल खड़ी है उसे ढकने का इंतज़ाम करें। बाग-बगीचे वाले जाल बिछाएं। सतर्क रहें, नुकसान से बचें।',
    tags: ['#ओलावृष्टि', '#मौसम', '#WeatherAlert', '#मेरठ'], district: 'Meerut', state: 'UP', likesCount: 178, commentsCount: 34, lat: 28.98, lng: 77.70
  },
  {
    type: 'WEATHER_ALERT', crop: 'mustard',
    title: '🌫️ घना कोहरा — सरसों और गेहूं में रोग का खतरा बढ़ा',
    content: 'इस हफ़्ते पूरे UP में घना कोहरा रहेगा। तापमान 8-12°C के बीच रहेगा। इस मौसम में सरसों में सफ़ेद रतुआ और गेहूं में करनाल बंट का खतरा बढ़ जाता है। Mancozeb का छिड़काव करें। जो भाई अभी तक नहीं किया — आज ही करें। मौका नहीं चूकें।',
    tags: ['#कोहरा', '#मौसम', '#WeatherAlert', '#UP'], district: 'Kanpur', state: 'UP', likesCount: 142, commentsCount: 28, lat: 26.44, lng: 80.33
  },
]

async function main() {
  console.log('👥 Seeding Community data...')

  const userIds = await getOrCreateDemoUsers()
  console.log(`  Using ${userIds.length} demo users`)

  // Clear old data
  await prisma.postReport.deleteMany()
  await prisma.postSave.deleteMany()
  await prisma.postLike.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.post.deleteMany()
  await prisma.farmerProfile.deleteMany()

  // Create FarmerProfiles for demo users
  const profiles = [
    { userId: userIds[0], bio: 'मेरठ का किसान। 15 साल से गेहूं और सरसों की खेती कर रहा हूं।', totalLand: 5.5, crops: ['wheat','mustard','potato'], experience: 15, isVerified: true, reputationScore: 847, badges: ['expert_farmer','pest_watcher'], district: 'Meerut', state: 'UP' },
    { userId: userIds[1], bio: 'लखनऊ में धान और सब्जी की जैविक खेती। महिला किसान।', totalLand: 3.0, crops: ['rice','vegetables'], experience: 8, isVerified: true, reputationScore: 412, badges: ['active_farmer'], district: 'Lucknow', state: 'UP' },
    { userId: userIds[2], bio: 'मुज़फ्फरनगर। गन्ना, सरसों, गेहूं। 20 साल का अनुभव।', totalLand: 8.0, crops: ['sugarcane','mustard','wheat'], experience: 20, isVerified: true, reputationScore: 1124, badges: ['expert_farmer','community_leader','pest_watcher'], district: 'Muzaffarnagar', state: 'UP' },
    { userId: userIds[3], bio: 'आगरा में आलू और टमाटर की खेती।', totalLand: 4.0, crops: ['potato','tomato'], experience: 6, isVerified: false, reputationScore: 178, badges: ['first_post'], district: 'Agra', state: 'UP' },
    { userId: userIds[4], bio: 'कानपुर। चना, मसूर, गेहूं।', totalLand: 6.5, crops: ['chickpea','lentil','wheat'], experience: 12, isVerified: true, reputationScore: 623, badges: ['expert_farmer','active_farmer'], district: 'Kanpur', state: 'UP' },
  ]
  for (const p of profiles.filter(x => userIds.includes(x.userId))) {
    await prisma.farmerProfile.upsert({
      where:  { userId: p.userId },
      create: p,
      update: p
    })
  }

  // Create posts + some likes and comments
  let postIdx = 0
  for (const p of POSTS) {
    const authorId = userIds[postIdx % userIds.length]
    const daysAgo  = Math.floor(Math.random() * 14)
    const createdAt = new Date(Date.now() - daysAgo * 24 * 3600 * 1000)

    const post = await prisma.post.create({
      data: {
        userId:       authorId,
        type:         p.type,
        title:        p.title,
        content:      p.content,
        tags:         p.tags,
        crop:         p.crop,
        district:     p.district,
        state:        p.state,
        lat:          p.lat,
        lng:          p.lng,
        likesCount:   p.likesCount,
        commentsCount: p.commentsCount,
        isVerified:   p.type === 'SUCCESS_STORY' || p.type === 'PEST_ALERT',
        createdAt,
        updatedAt: createdAt,
      }
    })

    // Add sample likes (random subset of users)
    const likerCount = Math.min(userIds.length, Math.floor(Math.random() * 3) + 1)
    for (let i = 0; i < likerCount; i++) {
      if (userIds[i] !== authorId) {
        await prisma.postLike.upsert({
          where:  { postId_userId: { postId: post.id, userId: userIds[i] } },
          create: { postId: post.id, userId: userIds[i] },
          update: {}
        })
      }
    }

    // Add sample comment
    const commenterId = userIds[(postIdx + 1) % userIds.length]
    if (commenterId !== authorId) {
      const sampleComments = [
        'बहुत अच्छी जानकारी दी भाई! काम आएगी।',
        'धन्यवाद सर, हम भी यही कर रहे थे।',
        'एकदम सही बात है। मेरे खेत में भी यही हुआ।',
        'बढ़िया टिप है। ज़रूर आज़माएंगे।',
        'भाई, कौन सी दवाई की दुकान पर मिलती है?',
      ]
      await prisma.comment.create({
        data: {
          postId:  post.id,
          userId:  commenterId,
          content: sampleComments[postIdx % sampleComments.length],
          createdAt: new Date(createdAt.getTime() + 3600000)
        }
      })
    }

    postIdx++
    process.stdout.write(`  ✅ Post: ${p.title.substring(0, 50)}...\n`)
  }

  console.log(`\n✅ Seeded ${POSTS.length} community posts with likes and comments`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
