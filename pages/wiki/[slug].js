import Head from 'next/head'
import Link from 'next/link'
import { useState, useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { ArrowLeft, Share2, MessageSquare, ShoppingBag, Droplets, Thermometer, Calendar } from 'lucide-react'
import { useWikiLanguage } from '../../src/hooks/useWikiLanguage'
import LanguageToggle from '../../src/components/wiki/LanguageToggle'

const data = {
  emoji: '🌾',
  slug: 'wheat',
  name: 'Wheat',
  nameHindi: 'गेहूं',
  description: 'Wheat is a rabi crop grown in winter. It is the main cereal crop in north and north-western India.',
  descriptionHindi: 'गेहूं भारत की एक प्रमुख रबी फसल है जिसे सर्दियों में उगाया जाता है। यह उत्तर और उत्तर-पश्चिमी भारत का मुख्य अनाज है।',
  stats: {
    duration: '120-150 days',
    durationHindi: '120-150 दिन',
    water: '300-400 mm',
    waterHindi: '300-400 मिमी',
    season: 'Rabi (Oct-Nov to Mar-Apr)',
    seasonHindi: 'रबी (अक्टू-नवं से मार्च-अप्रैल)'
  },
  climate: {
    temp: '10°C to 25°C',
    soil: 'Well-drained loamy soil',
    soilHindi: 'अच्छी जल निकासी वाली दोमट मिट्टी',
    ph: '6.0 to 7.5'
  },
  steps: [
    { title: 'Land Prep', titleHindi: 'खेत की तैयारी', desc: 'Plough deeply and level the field.', descHindi: 'खेत की गहरी जुताई करें और समतल बनाएं।', days: 'Day 0', daysHindi: '0 दिन' },
    { title: 'Sowing', titleHindi: 'बुवाई', desc: 'Sow seeds 4-5 cm deep.', descHindi: 'बीज 4-5 सेमी की गहराई पर बोएं।', days: 'Day 1', daysHindi: 'पहला दिन' },
    { title: 'First Irrigation', titleHindi: 'पहली सिंचाई (CRI)', desc: 'Crucial irrigation at Crown Root stage.', descHindi: 'CRI अवस्था पर महत्वपूर्ण सिंचाई।', days: 'Day 21', daysHindi: '21 दिन' },
    { title: 'Harvesting', titleHindi: 'कटाई', desc: 'Harvest when grains turn golden hard.', descHindi: 'दानों के सुनहरे और सख्त होने पर काटें।', days: 'Day 130', daysHindi: '130 दिन' }
  ],
  nutrition: {
    n: '120 kg/Ha', p: '60 kg/Ha', k: '40 kg/Ha'
  },
  pests: [
    { name: 'Termites', nameHindi: 'दीमक', severity: 'High', severityHindi: 'अधिक', desc: 'Destroys roots.', descHindi: 'जड़ों को नष्ट करती है।' },
    { name: 'Brown Rust', nameHindi: 'भूरा रतुआ', severity: 'Medium', severityHindi: 'मध्यम', desc: 'Brown pustules on leaves.', descHindi: 'पत्तियों पर भूरे धब्बे।' }
  ],
  varieties: [
    { name: 'HD 2967', yield: '50-55 Q/Ha', yieldHindi: '50-55 क्विंटल/हेक्टेयर', days: '143', feature: 'Rust resistant', featureHindi: 'रतुआ प्रतिरोधी' },
    { name: 'PBW 343', yield: '45-50 Q/Ha', yieldHindi: '45-50 क्विंटल/हेक्टेयर', days: '135', feature: 'High yield', featureHindi: 'अधिक उपज' },
    { name: 'DBW 187', yield: '60-65 Q/Ha', yieldHindi: '60-65 क्विंटल/हेक्टेयर', days: '120', feature: 'Fast growing', featureHindi: 'जल्दी पकने वाली' }
  ],
  economics: {
    yieldPerAcre: 18, // Quintals
    pricePerQuintal: 2500, // INR
    costPerAcre: {
      Seed: 1500,
      Fertilizer: 3000,
      Irrigation: 2000,
      Labor: 4000,
      Machine: 2500,
      Pesticide: 1000
    },
    costPerAcreHindi: {
      'बीज': 1500,
      'खाद सामग्री': 3000,
      'सिंचाई': 2000,
      'मजदूरी': 4000,
      'मशीन': 2500,
      'दवाएं': 1000
    }
  }
}

export default function CropDetail() {
  const { lang, toggleLang, isHindi } = useWikiLanguage()
  const [activeTab, setActiveTab] = useState(0)
  const [acres, setAcres] = useState(1)
  const [fertAcres, setFertAcres] = useState(1)

  const tabs = [
    { id: 'overview', en: 'Overview', hi: 'परिचय' },
    { id: 'grow', en: 'How to Grow', hi: 'कैसे उगाएं' },
    { id: 'nutrition', en: 'Nutrition', hi: 'खाद-पानी' },
    { id: 'pests', en: 'Pests & Diseases', hi: 'रोग-कीट' },
    { id: 'economics', en: 'Economics', hi: 'कमाई' },
    { id: 'varieties', en: 'Varieties', hi: 'किस्में' }
  ]

  const economicsChart = useMemo(() => {
    const costs = isHindi ? data.economics.costPerAcreHindi : data.economics.costPerAcre
    return Object.keys(costs).map((key, index) => ({
      name: key,
      value: costs[key] * acres
    }))
  }, [acres, isHindi])

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ff7300']

  const totalCost = economicsChart.reduce((acc, item) => acc + item.value, 0)
  const totalRevenue = data.economics.yieldPerAcre * acres * data.economics.pricePerQuintal
  const netProfit = totalRevenue - totalCost

  const uri = typeof window !== 'undefined' ? window.location.href : ''

  return (
    <div className="bg-gray-50 pb-24 font-sans min-h-screen">
      <Head>
        <title>{isHindi ? `${data.nameHindi} की खेती` : `${data.name} Farming`} - KisanSaathi</title>
      </Head>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] text-white pt-6 pb-12 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex justify-between items-center mb-6">
            <Link href="/wiki" className="text-green-100 hover:text-white flex items-center gap-2">
              <ArrowLeft className="w-5 h-5"/> {isHindi ? 'फसल ज्ञान' : 'Crop Wiki'}
            </Link>
            <LanguageToggle lang={lang} toggleLang={toggleLang} />
          </div>

          <div className="text-sm text-green-200 mb-6 flex gap-2">
             <Link href="/" className="hover:text-white">{isHindi ? 'होम' : 'Home'}</Link> &gt;
             <Link href="/wiki" className="hover:text-white">{isHindi ? 'फसल ज्ञान' : 'Wiki'}</Link> &gt;
             <span className="font-bold text-white">{isHindi ? data.nameHindi : data.name}</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center text-5xl shadow-xl border border-white/20">
              {data.emoji}
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black mb-2">{isHindi ? data.nameHindi : data.name}</h1>
              <p className="text-green-100 text-lg">{isHindi ? data.name : data.nameHindi}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8 max-w-2xl bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
            <div className="text-center border-r border-white/20">
              <Calendar className="w-6 h-6 mx-auto mb-1 opacity-80"/>
              <div className="text-xs text-green-200">{isHindi ? 'अवधि' : 'Duration'}</div>
              <div className="font-bold">{isHindi ? data.stats.durationHindi : data.stats.duration}</div>
            </div>
            <div className="text-center border-r border-white/20">
              <Droplets className="w-6 h-6 mx-auto mb-1 opacity-80"/>
              <div className="text-xs text-green-200">{isHindi ? 'पानी' : 'Water'}</div>
              <div className="font-bold">{isHindi ? data.stats.waterHindi : data.stats.water}</div>
            </div>
            <div className="text-center">
              <Thermometer className="w-6 h-6 mx-auto mb-1 opacity-80"/>
              <div className="text-xs text-green-200">{isHindi ? 'सीजन' : 'Season'}</div>
              <div className="font-bold"> {isHindi ? data.stats.seasonHindi : data.stats.season}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Tabs */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200 z-50">
         <div className="container mx-auto px-4 flex overflow-x-auto hide-scrollbar">
            {tabs.map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`flex-none px-6 py-4 font-bold border-b-4 transition-colors ${activeTab === i ? 'border-[#1B5E20] text-[#1B5E20]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
              >
                {isHindi ? tab.hi : tab.en}
              </button>
            ))}
         </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
         {/* OVERVIEW */}
         {activeTab === 0 && (
           <div className="space-y-6 animate-fadeIn">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                 <h2 className="text-2xl font-black mb-4">{isHindi ? 'परिचय' : 'Overview'}</h2>
                 <p className="text-lg text-gray-700 leading-relaxed">{isHindi ? data.descriptionHindi : data.description}</p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                 <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
                    <h3 className="font-bold text-amber-900 mb-2 flex gap-2"><Thermometer/> {isHindi ? 'जलवायु और तापमान' : 'Climate & Temp'}</h3>
                    <p className="text-amber-800 font-medium text-xl">{data.climate.temp}</p>
                 </div>
                 <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100">
                    <h3 className="font-bold text-orange-900 mb-2 flex gap-2"><Droplets/> {isHindi ? 'मिट्टी का प्रकार' : 'Soil Type'}</h3>
                    <p className="text-orange-800 font-medium text-lg">{isHindi ? data.climate.soilHindi : data.climate.soil}</p>
                    <p className="text-orange-700 text-sm mt-1">pH: {data.climate.ph}</p>
                 </div>
              </div>
           </div>
         )}

         {/* HOW TO GROW */}
         {activeTab === 1 && (
           <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 animate-fadeIn">
             <h2 className="text-2xl font-black mb-8">{isHindi ? 'खेती के चरण' : 'Stages of Cultivation'}</h2>
             <div className="relative border-l-4 border-green-200 ml-4 space-y-12 pb-4">
                {data.steps.map((step, i) => (
                  <div key={i} className="relative pl-8">
                     <div className="absolute -left-[14px] top-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-sm"></div>
                     <div className="text-sm font-bold text-green-600 mb-1">{isHindi ? step.daysHindi : step.days}</div>
                     <h3 className="text-xl font-bold text-gray-900 mb-2">{isHindi ? step.titleHindi : step.title}</h3>
                     <p className="text-gray-600">{isHindi ? step.descHindi : step.desc}</p>
                  </div>
                ))}
             </div>
           </div>
         )}

         {/* NUTRITION */}
         {activeTab === 2 && (
           <div className="space-y-6 animate-fadeIn">
             <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-black mb-6">{isHindi ? 'मुख्य पोषक तत्व (NPK)' : 'Primary Nutrients (NPK)'}</h2>
                <div className="grid grid-cols-3 gap-4">
                   <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100">
                     <div className="text-xl font-black text-gray-900 mb-1">N</div>
                     <div className="text-sm text-gray-500">{isHindi ? 'नाइट्रोजन' : 'Nitrogen'}</div>
                     <div className="text-lg font-bold text-green-600 mt-2">{data.nutrition.n}</div>
                   </div>
                   <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100">
                     <div className="text-xl font-black text-gray-900 mb-1">P</div>
                     <div className="text-sm text-gray-500">{isHindi ? 'फास्फोरस' : 'Phosphorus'}</div>
                     <div className="text-lg font-bold text-green-600 mt-2">{data.nutrition.p}</div>
                   </div>
                   <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100">
                     <div className="text-xl font-black text-gray-900 mb-1">K</div>
                     <div className="text-sm text-gray-500">{isHindi ? 'पोटाश' : 'Potash'}</div>
                     <div className="text-lg font-bold text-green-600 mt-2">{data.nutrition.k}</div>
                   </div>
                </div>
             </div>

             <div className="bg-[#E8F5E9] p-6 md:p-8 rounded-3xl border border-green-200">
                <h3 className="text-xl font-black mb-4 text-[#1B5E20]">{isHindi ? 'उर्वरक कैलकुलेटर' : 'Fertilizer Calculator'}</h3>
                <div className="flex items-center gap-4 mb-6">
                  <label className="font-bold text-green-900">{isHindi ? 'जमीन (एकड़):' : 'Land (Acres):'}</label>
                  <input type="number" value={fertAcres} min={1} onChange={e => setFertAcres(Number(e.target.value) || 1)} className="w-24 p-2 rounded-xl border-2 border-green-300 outline-none text-center font-bold"/>
                </div>
                <div className="bg-white rounded-2xl p-4 grid grid-cols-2 gap-4">
                   <div>
                     <div className="text-sm text-gray-500">{isHindi ? 'कुल यूरिया' : 'Total Urea'}</div>
                     <div className="font-bold text-lg">{Math.round(48 * fertAcres)} kg</div>
                   </div>
                   <div>
                     <div className="text-sm text-gray-500">{isHindi ? 'कुल डीएपी' : 'Total DAP'}</div>
                     <div className="font-bold text-lg">{Math.round(24 * fertAcres)} kg</div>
                   </div>
                   <div>
                     <div className="text-sm text-gray-500">{isHindi ? 'कुल पोटाश' : 'Total MOP'}</div>
                     <div className="font-bold text-lg">{Math.round(16 * fertAcres)} kg</div>
                   </div>
                </div>
             </div>
           </div>
         )}

         {/* PESTS */}
         {activeTab === 3 && (
           <div className="space-y-4 animate-fadeIn">
              {data.pests.map((pest, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-red-100 hover:shadow-md transition-shadow">
                   <div className="flex justify-between items-start mb-2">
                     <h3 className="text-xl font-bold text-gray-900">{isHindi ? pest.nameHindi : pest.name}</h3>
                     <span className={`px-3 py-1 rounded-full text-xs font-bold ${pest.severity === 'High' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}`}>
                        {isHindi ? pest.severityHindi : pest.severity} {isHindi ? 'खतरा' : 'Severity'}
                     </span>
                   </div>
                   <p className="text-gray-600">{isHindi ? pest.descHindi : pest.desc}</p>
                   <button className="mt-4 text-[#1B5E20] font-bold text-sm hover:underline">{isHindi ? 'दवाइयां देखें →' : 'View Remedies →'}</button>
                </div>
              ))}
           </div>
         )}

         {/* ECONOMICS */}
         {activeTab === 4 && (
           <div className="space-y-6 animate-fadeIn">
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-black mb-2">{isHindi ? 'कमाई कैलकुलेटर' : 'Profit Calculator'}</h2>
                <p className="text-gray-500 mb-6">{isHindi ? 'अपने मुताबिक जमीन डालकर कमाई जानें' : 'Enter acres to estimate your profits'}</p>
                
                <div className="flex items-center gap-4 mb-8 bg-gray-50 p-4 rounded-2xl">
                  <label className="font-bold text-gray-700">{isHindi ? 'कुल जमीन (एकड़):' : 'Total Land (Acres):'}</label>
                  <input 
                     type="number" 
                     value={acres} 
                     min={1} 
                     onChange={e => setAcres(Number(e.target.value) || 1)} 
                     className="w-24 p-3 rounded-xl border border-gray-300 outline-none text-center font-bold focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                   <div className="bg-blue-50 p-4 rounded-2xl">
                     <div className="text-sm text-blue-600 font-bold mb-1">{isHindi ? 'कुल उपज' : 'Est. Yield'}</div>
                     <div className="text-2xl font-black text-blue-900">{data.economics.yieldPerAcre * acres} Q</div>
                     <div className="text-xs mt-1 text-blue-800">@ ₹{data.economics.pricePerQuintal}/Q</div>
                   </div>
                   <div className="bg-red-50 p-4 rounded-2xl">
                     <div className="text-sm text-red-600 font-bold mb-1">{isHindi ? 'कुल लागत' : 'Est. Cost'}</div>
                     <div className="text-2xl font-black text-red-900">₹{totalCost.toLocaleString()}</div>
                   </div>
                   <div className="bg-[#E8F5E9] p-4 rounded-2xl">
                     <div className="text-sm text-green-700 font-bold mb-1">{isHindi ? 'कुल कमाई' : 'Gross Revenue'}</div>
                     <div className="text-2xl font-black text-green-900">₹{totalRevenue.toLocaleString()}</div>
                   </div>
                   <div className="bg-[#1B5E20] p-4 rounded-2xl text-white">
                     <div className="text-sm font-medium opacity-90 mb-1">{isHindi ? 'शुद्ध आय (लाभ)' : 'Net Profit'}</div>
                     <div className="text-2xl font-black">₹{netProfit.toLocaleString()}</div>
                   </div>
                </div>

                <div className="h-80 w-full mt-8">
                   <h3 className="text-center font-bold mb-4">{isHindi ? 'लागत का विभाजन' : 'Cost Breakdown'}</h3>
                   <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                         <Pie
                            data={economicsChart}
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                         >
                            {economicsChart.map((entry, index) => (
                               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                         </Pie>
                         <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                         <Legend />
                      </PieChart>
                   </ResponsiveContainer>
                </div>
              </div>
           </div>
         )}

         {/* VARIETIES */}
         {activeTab === 5 && (
           <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-fadeIn">
              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-gray-50 border-b border-gray-200">
                         <th className="p-4 font-bold text-gray-900">{isHindi ? 'किस्म का नाम' : 'Variety Name'}</th>
                         <th className="p-4 font-bold text-gray-900">{isHindi ? 'उपज' : 'Yield'}</th>
                         <th className="p-4 font-bold text-gray-900">{isHindi ? 'पकने के दिन' : 'Days to Maturity'}</th>
                         <th className="p-4 font-bold text-gray-900">{isHindi ? 'विशेषता' : 'Feature'}</th>
                       </tr>
                    </thead>
                    <tbody>
                       {data.varieties.map((v, i) => (
                          <tr key={i} className="border-b border-gray-100 hover:bg-gray-50/50">
                            <td className="p-4 font-bold text-[#1B5E20]">{v.name}</td>
                            <td className="p-4 font-medium">{isHindi ? v.yieldHindi : v.yield}</td>
                            <td className="p-4 text-gray-600">{v.days} {isHindi ? 'दिन' : 'days'}</td>
                            <td className="p-4 text-gray-600">{isHindi ? v.featureHindi : v.feature}</td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
         )}
      </div>

      {/* Floating Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
         <div className="container mx-auto max-w-4xl flex justify-between md:justify-end gap-3 md:gap-4">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-bold transition-colors">
               <Share2 className="w-5 h-5"/>
               <span className="hidden sm:inline">{isHindi ? 'शेयर करें' : 'Share'}</span>
            </button>
            <Link href={`/store?crop=${data.slug}`} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-900 px-4 py-3 rounded-xl font-bold transition-colors">
               <ShoppingBag className="w-5 h-5"/>
               {isHindi ? 'सामान खरीदें' : 'Market'}
            </Link>
            <Link href="/wiki/recommend" className="flex-[2] md:flex-none flex items-center justify-center gap-2 bg-[#1B5E20] hover:bg-[#2E7D32] text-white px-8 py-3 rounded-xl font-black transition-colors shadow-lg shadow-green-900/20">
               <MessageSquare className="w-5 h-5"/>
               {isHindi ? 'AI से पूछें' : 'Ask AI'}
            </Link>
         </div>
      </div>
    </div>
  )
}
