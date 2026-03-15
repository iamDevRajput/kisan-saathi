import Head from 'next/head'
import Link from 'next/link'
import { ArrowLeft, CloudSun, Bot, Zap, Globe } from 'lucide-react'
import { useWikiLanguage } from '../../src/hooks/useWikiLanguage'
import LanguageToggle from '../../src/components/wiki/LanguageToggle'
import CropAdvisor from '../../src/components/wiki/CropAdvisor'

export default function RecommendPage() {
  const { lang, toggleLang, isHindi } = useWikiLanguage()

  return (
    <div className="min-h-screen bg-[#F0F7F0] overflow-x-hidden font-sans">
      <Head>
        <title>{isHindi ? 'स्मार्ट फसल सलाहकार - KisanSaathi' : 'Smart Crop Advisor - KisanSaathi'}</title>
      </Head>

      {/* Full Width Hero Section */}
      <div className="relative bg-gradient-to-b from-[#0D3B1E] via-[#1B5E20] to-[#2E7D32] pt-6 pb-40 text-white overflow-hidden">
         
         {/* Animated Particles background */}
         <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
           {/* We can use CSS animations for these in global css or inline */}
           <div className="absolute top-[10%] left-[10%] text-3xl animate-[float_8s_ease-in-out_infinite]">🌾</div>
           <div className="absolute top-[30%] right-[15%] text-2xl animate-[float_10s_ease-in-out_infinite_1s]">🌿</div>
           <div className="absolute top-[60%] left-[20%] text-4xl animate-[float_9s_ease-in-out_infinite_2s]">🍃</div>
           <div className="absolute top-[40%] right-[30%] text-xl animate-[float_11s_ease-in-out_infinite_3s]">🌱</div>
           <div className="absolute top-[70%] right-[10%] text-3xl animate-[float_7s_ease-in-out_infinite_0.5s]">🌾</div>
         </div>

         <div className="container mx-auto px-4 lg:px-8 relative z-10">
            {/* Top Navigation */}
            <div className="flex justify-between items-center mb-12">
              <Link 
                href="/wiki" 
                className="group flex items-center gap-2 text-white/80 hover:text-white font-medium transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10"
              >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
                {isHindi ? 'वापस जाएं' : 'Back to Wiki'}
              </Link>
              
              <div className="flex items-center gap-3 bg-white/10 p-1.5 rounded-full backdrop-blur-sm border border-white/20">
                <Globe size={16} className="text-white/70 ml-2" />
                <LanguageToggle lang={lang} toggleLang={toggleLang} />
              </div>
            </div>

            {/* Hero Content */}
            <div className="max-w-3xl mx-auto text-center">
              {/* Glowing Robot Icon */}
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-green-400 blur-[40px] opacity-40 rounded-full animate-pulse"></div>
                <div className="relative text-[80px] leading-none filter drop-shadow-2xl animate-[float_6s_ease-in-out_infinite]">
                  🤖
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight drop-shadow-lg">
                {isHindi ? 'स्मार्ट फसल सलाहकार' : 'Smart Crop Advisor'}
              </h1>
              
              <p className="text-xl md:text-2xl text-green-100/90 font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
                {isHindi ? 'AI आपकी मिट्टी और मौसम के अनुसार सबसे बेहतरीन और मुनाफे वाली फसल खोजेगा। 100% मुफ्त।' : 'Our AI will find the best, most profitable crop for your soil and weather. 100% Free.'}
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-xl">
                  <CloudSun size={18} className="text-yellow-300" />
                  <span className="text-sm font-bold tracking-wide">{isHindi ? 'लाइव मौसम' : 'Live Weather'}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-xl">
                  <Bot size={18} className="text-blue-300" />
                  <span className="text-sm font-bold tracking-wide">{isHindi ? 'एंथ्रोपिक AI' : 'Anthropic AI'}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-xl">
                  <Zap size={18} className="text-amber-300" />
                  <span className="text-sm font-bold tracking-wide">30 Sec</span>
                </div>
              </div>
            </div>
         </div>

         {/* Curved White Separator at bottom */}
         <div 
           className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-0" 
           style={{ transform: 'translateZ(0)' }}
         >
           <svg 
             className="relative block w-full h-[60px] md:h-[100px]" 
             data-name="Layer 1" 
             xmlns="http://www.w3.org/2000/svg" 
             viewBox="0 0 1200 120" 
             preserveAspectRatio="none"
           >
             <path 
               d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,130.85,130.85,201.21,113.39,242.66,102.76,281.44,81.18,321.39,56.44Z" 
               fill="#F0F7F0"
             ></path>
           </svg>
         </div>
      </div>
      
      {/* Form Container */}
      <div className="-mt-32 px-4 relative z-20">
         <CropAdvisor isHindi={isHindi} />
      </div>

    </div>
  )
}
