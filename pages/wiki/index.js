import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { useWikiLanguage } from '../../src/hooks/useWikiLanguage'
import LanguageToggle from '../../src/components/wiki/LanguageToggle'
import CropCard from '../../src/components/wiki/CropCard'

const categories = [
  { icon: '🌾', label: 'अनाज', count: 6, enLabel: 'Grains' },
  { icon: '🥦', label: 'सब्जियां', count: 12, enLabel: 'Vegetables' },
  { icon: '🍎', label: 'फल', count: 8, enLabel: 'Fruits' },
  { icon: '🌻', label: 'तिलहन', count: 6, enLabel: 'Oilseeds' },
  { icon: '🫘', label: 'दालें', count: 7, enLabel: 'Pulses' },
  { icon: '🌶️', label: 'मसाले', count: 7, enLabel: 'Spices' },
  { icon: '💵', label: 'नकदी फसल', count: 4, enLabel: 'Cash Crops' },
  { icon: '🌸', label: 'फूल', count: 3, enLabel: 'Flowers' }
]

const crops = [
  { slug: 'wheat', emoji: '🌾', name: 'Wheat', nameHindi: 'गेहूं', duration: '120-150 days', durationHindi: '120-150 दिन', water: 'Medium', waterHindi: 'मध्यम', difficulty: 'Easy', difficultyHindi: 'आसान', profit: '₹25,000', profitHindi: '₹25,000', seasonBadge: 'Rabi Season', seasonBadgeHindi: 'रबी सीजन', category: 'अनाज' },
  { slug: 'rice', emoji: '🌾', name: 'Rice', nameHindi: 'धान', duration: '100-150 days', durationHindi: '100-150 दिन', water: 'High', waterHindi: 'अधिक', difficulty: 'Medium', difficultyHindi: 'मध्यम', profit: '₹30,000', profitHindi: '₹30,000', seasonBadge: 'Kharif Season', seasonBadgeHindi: 'खरीफ सीजन', category: 'अनाज' },
  { slug: 'mustard', emoji: '🌻', name: 'Mustard', nameHindi: 'सरसों', duration: '100-120 days', durationHindi: '100-120 दिन', water: 'Low', waterHindi: 'कम', difficulty: 'Easy', difficultyHindi: 'आसान', profit: '₹28,000', profitHindi: '₹28,000', seasonBadge: 'Rabi Season', seasonBadgeHindi: 'रबी सीजन', category: 'तिलहन' },
  { slug: 'potato', emoji: '🥔', name: 'Potato', nameHindi: 'आलू', duration: '90-110 days', durationHindi: '90-110 दिन', water: 'Medium', waterHindi: 'मध्यम', difficulty: 'Medium', difficultyHindi: 'मध्यम', profit: '₹40,000', profitHindi: '₹40,000', seasonBadge: 'Rabi Season', seasonBadgeHindi: 'रबी सीजन', category: 'सब्जी' },
  { slug: 'tomato', emoji: '🍅', name: 'Tomato', nameHindi: 'टमाटर', duration: '90-120 days', durationHindi: '90-120 दिन', water: 'Medium', waterHindi: 'मध्यम', difficulty: 'Hard', difficultyHindi: 'कठिन', profit: '₹50,000', profitHindi: '₹50,000', seasonBadge: 'All Season', seasonBadgeHindi: 'मिश्रित सीजन', category: 'सब्जी' },
  { slug: 'onion', emoji: '🧅', name: 'Onion', nameHindi: 'प्याज', duration: '100-120 days', durationHindi: '100-120 दिन', water: 'Medium', waterHindi: 'मध्यम', difficulty: 'Medium', difficultyHindi: 'मध्यम', profit: '₹45,000', profitHindi: '₹45,000', seasonBadge: 'Rabi Season', seasonBadgeHindi: 'रबी सीजन', category: 'सब्जी' },
  { slug: 'sugarcane', emoji: '🎋', name: 'Sugarcane', nameHindi: 'गन्ना', duration: '10-14 months', durationHindi: '10-14 महीने', water: 'High', waterHindi: 'अधिक', difficulty: 'Medium', difficultyHindi: 'मध्यम', profit: '₹1,00,000', profitHindi: '₹1,00,000', seasonBadge: 'Kharif Season', seasonBadgeHindi: 'खरीफ सीजन', category: 'नकदी फसल' },
  { slug: 'chickpea', emoji: '🫘', name: 'Chickpea', nameHindi: 'चना', duration: '90-110 days', durationHindi: '90-110 दिन', water: 'Low', waterHindi: 'कम', difficulty: 'Easy', difficultyHindi: 'आसान', profit: '₹35,000', profitHindi: '₹35,000', seasonBadge: 'Rabi Season', seasonBadgeHindi: 'रबी सीजन', category: 'दालें' },
  { slug: 'maize', emoji: '🌽', name: 'Maize', nameHindi: 'मक्का', duration: '90-110 days', durationHindi: '90-110 दिन', water: 'Medium', waterHindi: 'मध्यम', difficulty: 'Easy', difficultyHindi: 'आसान', profit: '₹30,000', profitHindi: '₹30,000', seasonBadge: 'Kharif Season', seasonBadgeHindi: 'खरीफ सीजन', category: 'अनाज' },
  { slug: 'turmeric', emoji: '🫚', name: 'Turmeric', nameHindi: 'हल्दी', duration: '7-9 months', durationHindi: '7-9 महीने', water: 'Medium', waterHindi: 'मध्यम', difficulty: 'Medium', difficultyHindi: 'मध्यम', profit: '₹80,000', profitHindi: '₹80,000', seasonBadge: 'Kharif Season', seasonBadgeHindi: 'खरीफ सीजन', category: 'मसाले' },
  { slug: 'garlic', emoji: '🧄', name: 'Garlic', nameHindi: 'लहसुन', duration: '4-5 months', durationHindi: '4-5 महीने', water: 'Low', waterHindi: 'कम', difficulty: 'Medium', difficultyHindi: 'मध्यम', profit: '₹60,000', profitHindi: '₹60,000', seasonBadge: 'Rabi Season', seasonBadgeHindi: 'रबी सीजन', category: 'मसाले' },
  { slug: 'mango', emoji: '🥭', name: 'Mango', nameHindi: 'आम', duration: 'Perennial', durationHindi: 'बहुवर्षीय', water: 'Medium', waterHindi: 'मध्यम', difficulty: 'Medium', difficultyHindi: 'मध्यम', profit: '₹1,20,000', profitHindi: '₹1,20,000', seasonBadge: 'Summer', seasonBadgeHindi: 'गर्मी', category: 'फल' },
  { slug: 'banana', emoji: '🍌', name: 'Banana', nameHindi: 'केला', duration: '12-14 months', durationHindi: '12-14 महीने', water: 'High', waterHindi: 'अधिक', difficulty: 'Hard', difficultyHindi: 'कठिन', profit: '₹1,50,000', profitHindi: '₹1,50,000', seasonBadge: 'All Season', seasonBadgeHindi: 'मिश्रित सीजन', category: 'फल' },
  { slug: 'soybean', emoji: '🫘', name: 'Soybean', nameHindi: 'सोयाबीन', duration: '90-110 days', durationHindi: '90-110 दिन', water: 'Medium', waterHindi: 'मध्यम', difficulty: 'Medium', difficultyHindi: 'मध्यम', profit: '₹35,000', profitHindi: '₹35,000', seasonBadge: 'Kharif Season', seasonBadgeHindi: 'खरीफ सीजन', category: 'तिलहन' },
  { slug: 'cotton', emoji: '☁️', name: 'Cotton', nameHindi: 'कपास', duration: '150-180 days', durationHindi: '150-180 दिन', water: 'Medium', waterHindi: 'मध्यम', difficulty: 'Hard', difficultyHindi: 'कठिन', profit: '₹45,000', profitHindi: '₹45,000', seasonBadge: 'Kharif Season', seasonBadgeHindi: 'खरीफ सीजन', category: 'नकदी फसल' }
]

export default function WikiHome() {
  const { lang, toggleLang, isHindi } = useWikiLanguage()
  const [activeTab, setActiveTab] = useState('सभी')

  const filterTabs = [
    { id: 'सभी', en: 'All' },
    { id: 'अनाज', en: 'Grains' },
    { id: 'सब्जी', en: 'Vegetables' },
    { id: 'फल', en: 'Fruits' },
    { id: 'तिलहन', en: 'Oilseeds' },
    { id: 'दालें', en: 'Pulses' }
  ]

  const filteredCrops = activeTab === 'सभी' 
    ? crops 
    : crops.filter(c => c.category === activeTab || (activeTab === 'दालें' && c.category === 'दालें') || (activeTab === 'सब्जी' && c.category === 'सब्जी') || (activeTab === 'फल' && c.category === 'फल') || (activeTab === 'तिलहन' && c.category === 'तिलहन') || (activeTab === 'अनाज' && c.category === 'अनाज'))

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Head>
        <title>{isHindi ? 'फसल ज्ञान - KisanSaathi' : 'Crop Wiki - KisanSaathi'}</title>
      </Head>

      {/* Hero Section */}
      <div className="bg-[#1B5E20] text-white pt-12 pb-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex justify-between items-center mb-8">
            <Link href="/dashboard" className="text-green-100 hover:text-white font-bold">
              ← {isHindi ? 'डैशबोर्ड' : 'Dashboard'}
            </Link>
            <LanguageToggle lang={lang} toggleLang={toggleLang} />
          </div>

          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-black mb-6">🌾 {isHindi ? 'फसल ज्ञान' : 'Crop Knowledge Wiki'}</h1>
            <p className="text-xl text-green-100 mb-8 font-light">
              {isHindi ? 'भारत की हर फसल की पूरी वैज्ञानिक और व्यावहारिक जानकारी' : 'Scientific and practical farming details for every Indian crop'}
            </p>

            <div className="relative max-w-2xl mx-auto mb-6">
              <input 
                type="text" 
                placeholder={isHindi ? "फसल का नाम खोजें (जैसे: गेहूं, सरसों)..." : "Search crop (e.g. Wheat, Mustard)..."}
                className="w-full pl-6 pr-14 py-4 rounded-full text-gray-900 text-lg outline-none shadow-xl focus:ring-4 focus:ring-green-400/50"
              />
              <button className="absolute right-2 top-2 bottom-2 bg-[#2E7D32] text-white w-12 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              <span className="text-green-200 text-sm mt-1">{isHindi ? 'ट्रेंडिंग:' : 'Trending:'}</span>
              {['#गेहूं', '#सरसों', '#आलू', '#टमाटर'].map(tag => (
                <button key={tag} className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full text-sm font-medium transition-colors">
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-12 relative z-20">
        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {categories.map((cat, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl">
                {cat.icon}
              </div>
              <div>
                <div className="font-bold text-gray-900">{isHindi ? cat.label : cat.enLabel}</div>
                <div className="text-sm text-gray-500">{cat.count} {isHindi ? 'फसलें' : 'Crops'}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Seasonal Banner */}
          <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-6 md:p-8 text-white shadow-lg overflow-hidden relative">
            <div className="absolute -right-8 -bottom-8 text-8xl opacity-20">☀️</div>
            <div className="relative z-10">
              <div className="bg-white/20 backdrop-blur-sm w-fit px-4 py-1.5 rounded-full text-sm font-bold mb-4">
                {isHindi ? 'अभी उगाएं — रबी सीजन' : 'Grow Now — Rabi Season'}
              </div>
              <h2 className="text-2xl md:text-3xl font-black mb-2">
                {isHindi ? 'रबी की खेती की तैयारी' : 'Rabi Crop Preparations'}
              </h2>
              <p className="opacity-90 max-w-md">
                {isHindi ? 'गेहूं, चना और सरसों की खेती के लिए मौसम अनुकूल है। सही बीजों का चुनाव करें।' : 'Weather is optimal for Wheat, Gram, and Mustard. Choose the right seeds today.'}
              </p>
            </div>
          </div>

          {/* Smart Advisor Banner */}
          <div className="bg-gradient-to-br from-[#1B5E20] to-[#43A047] rounded-3xl p-6 md:p-8 text-white shadow-lg overflow-hidden relative">
            <div className="absolute -right-8 -bottom-8 text-8xl opacity-20">🤖</div>
            <div className="relative z-10">
              <div className="bg-white/20 backdrop-blur-sm w-fit px-4 py-1.5 rounded-full text-sm font-bold mb-4 flex items-center gap-2">
                <span>✨</span> {isHindi ? 'AI सलाहकार' : 'AI Advisor'}
              </div>
              <h2 className="text-2xl md:text-3xl font-black mb-2">
                {isHindi ? '🤖 AI बताएगा कौन-सी फसल उगाओ' : '🤖 AI asks which crop to grow?'}
              </h2>
              <p className="opacity-90 max-w-md mb-6">
                {isHindi ? 'अपनी मिट्टी और बजट बताएं, हमारा AI आपको सबसे फायदेमंद फसल सुझाएगा।' : 'Tell us your soil and budget, our AI will recommend the most profitable crop.'}
              </p>
              <Link href="/wiki/recommend" className="bg-amber-400 hover:bg-amber-500 text-amber-900 font-black px-6 py-3 rounded-xl transition-colors shadow-sm inline-block">
                {isHindi ? 'अभी Try करें →' : 'Try Now →'}
              </Link>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex overflow-x-auto pb-4 mb-6 gap-2 hide-scrollbar">
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-[#1B5E20] text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {isHindi ? tab.id : tab.en}
            </button>
          ))}
        </div>

        {/* Crop Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrops.map(c => (
            <CropCard key={c.slug} crop={c} isHindi={isHindi} />
          ))}
        </div>

      </div>
    </div>
  )
}
