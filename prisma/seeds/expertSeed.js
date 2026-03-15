// prisma/seeds/expertSeed.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const experts = [
  {
    userId: "expert-1",
    name: "Dr. Rajesh Kumar",
    nameHindi: "डॉ. राजेश कुमार",
    avatar: "https://i.pravatar.cc/150?u=rajesh",
    title: "Senior Agronomist",
    titleHindi: "वरिष्ठ कृषि विशेषज्ञ",
    specializations: ["Wheat", "Mustard", "Soil Health"],
    crops: ["wheat", "mustard", "barley"],
    languages: ["Hindi", "English", "Punjabi"],
    experience: 15,
    qualification: "Ph.D Agriculture, BHU Varanasi",
    organization: "KVK Meerut",
    district: "Meerut",
    state: "UP",
    rating: 4.9,
    ratingCount: 234,
    totalSessions: 1240,
    pricePerCall: 0,
    pricePerChat: 0,
    isKVK: true,
    isFeatured: true,
    isOnline: true,
    about: "15 years experience in wheat and oilseed crops. Expert in modern farming techniques and soil health management.",
    aboutHindi: "गेहूं और तिलहन फसलों में 15 साल का अनुभव। आधुनिक कृषि तकनीकों और मिट्टी स्वास्थ्य प्रबंधन में विशेषज्ञ।",
    achievements: [
      "Best KVK Expert Award 2023",
      "1000+ farmers helped",
      "Published 12 research papers"
    ],
    availability: {
      monday: ["9:00", "10:00", "11:00", "14:00", "15:00"],
      tuesday: ["9:00", "10:00", "11:00", "14:00", "15:00"],
      wednesday: ["9:00", "10:00", "11:00"],
      thursday: ["9:00", "10:00", "11:00", "14:00", "15:00"],
      friday: ["9:00", "10:00", "11:00", "14:00", "15:00"],
      saturday: ["9:00", "10:00", "11:00"],
      sunday: []
    }
  },
  {
    userId: "expert-2",
    name: "Dr. Priya Sharma",
    nameHindi: "डॉ. प्रिया शर्मा",
    avatar: "https://i.pravatar.cc/150?u=priya",
    title: "Plant Pathologist",
    titleHindi: "पादप रोग विशेषज्ञ",
    specializations: ["Pest Control", "Disease Management", "Organic Farming"],
    crops: ["rice", "tomato", "potato", "onion"],
    languages: ["Hindi", "English"],
    experience: 10,
    qualification: "Ph.D Plant Pathology, IARI Delhi",
    organization: "Private Consultant",
    district: "Lucknow",
    state: "UP",
    rating: 4.8,
    ratingCount: 189,
    totalSessions: 890,
    pricePerCall: 99,
    pricePerChat: 49,
    isKVK: false,
    isFeatured: true,
    isOnline: true,
    about: "Specialized in organic disease management and pest control for vegetable crops.",
    aboutHindi: "सब्जियों की फसलों के लिए जैविक रोग प्रबंधन और कीट नियंत्रण में विशेषज्ञ।",
    achievements: [
      "Saved 500+ crops from disease",
      "Organic farming expert",
      "YouTube channel 50K subscribers"
    ],
    availability: {
      monday: ["16:00", "17:00", "18:00"],
      wednesday: ["16:00", "17:00", "18:00"],
      friday: ["16:00", "17:00", "18:00"],
      saturday: ["10:00", "11:00", "14:00", "15:00"]
    }
  },
  {
    userId: "expert-3",
    name: "Suresh Yadav",
    nameHindi: "सुरेश यादव",
    avatar: "https://i.pravatar.cc/150?u=suresh",
    title: "Market Intelligence Expert",
    titleHindi: "बाजार विशेषज्ञ",
    specializations: ["Mandi Prices", "Commodity Trading", "Supply Chain"],
    crops: ["wheat", "potato", "onion", "sugarcane"],
    languages: ["Hindi", "Bhojpuri"],
    experience: 20,
    qualification: "MBA Agriculture Business",
    organization: "NAFED Consultant",
    district: "Varanasi",
    state: "UP",
    rating: 4.7,
    ratingCount: 156,
    totalSessions: 670,
    pricePerCall: 149,
    pricePerChat: 79,
    isKVK: false,
    isFeatured: false,
    isOnline: false,
    about: "Expert in predicting Mandi prices and advising on the best time to sell different commodities.",
    aboutHindi: "मंडी की कीमतों की भविष्यवाणी करने और विभिन्न वस्तुओं को बेचने के सर्वोत्तम समय पर सलाह देने में विशेषज्ञ।",
    achievements: [
      "20 years mandi experience",
      "Price prediction accuracy 89%",
      "Saved farmers crores in losses"
    ],
    availability: {
      tuesday: ["10:00", "11:00", "12:00"],
      thursday: ["10:00", "11:00", "12:00"],
      saturday: ["10:00", "11:00", "12:00"]
    }
  },
  {
    userId: "expert-4",
    name: "Dr. Anil Tiwari",
    nameHindi: "डॉ. अनिल तिवारी",
    avatar: "https://i.pravatar.cc/150?u=anil",
    title: "Irrigation Specialist",
    titleHindi: "सिंचाई विशेषज्ञ",
    specializations: ["Drip Irrigation", "Water Management", "Soil Moisture"],
    crops: ["sugarcane", "cotton", "maize"],
    languages: ["Hindi", "English"],
    experience: 12,
    qualification: "M.Tech Water Resources, IIT Roorkee",
    organization: "Jal Jeevan Mission",
    district: "Agra",
    state: "UP",
    rating: 4.6,
    ratingCount: 112,
    totalSessions: 420,
    pricePerCall: 0,
    pricePerChat: 0,
    isKVK: true,
    isFeatured: false,
    isOnline: true,
    about: "Helping farmers optimize their water usage and set up efficient irrigation systems.",
    aboutHindi: "किसानों को उनके पानी के उपयोग को अनुकूलित करने और कुशल सिंचाई प्रणाली स्थापित करने में मदद करना।",
    achievements: [
      "100+ Drip Irrigation setups",
      "Water conservation award",
      "Government certified trainer"
    ],
    availability: {
      monday: ["14:00", "15:00", "16:00"],
      tuesday: ["14:00", "15:00", "16:00"],
      wednesday: ["14:00", "15:00", "16:00"]
    }
  },
  {
    userId: "expert-5",
    name: "Ramesh Singh",
    nameHindi: "रमेश सिंह",
    avatar: "https://i.pravatar.cc/150?u=ramesh",
    title: "Organic Farming Consultant",
    titleHindi: "जैविक खेती सलाहकार",
    specializations: ["Vermicompost", "Natural Fertilizers", "Zero Budget Farming"],
    crops: ["vegetables", "fruits", "pulses"],
    languages: ["Hindi", "Awadhi"],
    experience: 8,
    qualification: "B.Sc Agriculture, Kanpur University",
    organization: "Kheti Vikas NGO",
    district: "Faizabad",
    state: "UP",
    rating: 4.9,
    ratingCount: 340,
    totalSessions: 1560,
    pricePerCall: 49,
    pricePerChat: 29,
    isKVK: false,
    isFeatured: true,
    isOnline: false,
    about: "Passionate about zero-budget natural farming and creating sustainable agricultural ecosystems.",
    aboutHindi: "शून्य-बजट प्राकृतिक खेती और टिकाऊ कृषि पारिस्थितिकी तंत्र बनाने के बारे में भावुक।",
    achievements: [
      "Trained 2000+ farmers in natural farming",
      "Pioneer in local vermicompost production",
      "Award winning organic farmer"
    ],
    availability: {
      friday: ["10:00", "11:00", "15:00", "16:00"],
      saturday: ["10:00", "11:00", "15:00", "16:00"],
      sunday: ["10:00", "11:00"]
    }
  }
]

async function main() {
  console.log('Seeding experts...')
  
  for (const expert of experts) {
    await prisma.expert.upsert({
      where: { userId: expert.userId },
      update: expert,
      create: expert,
    })
  }

  console.log('Experts seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
