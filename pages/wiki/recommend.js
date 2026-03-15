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
        <meta name="description" content="AI-powered crop recommendation for UP farmers" />
      </Head>

      {/* Hero Section — compact, not full screen */}
      <div className="relative bg-gradient-to-b from-[#0D3B1E] via-[#1B5E20] to-[#2E7D32] pt-5 pb-24 text-white overflow-hidden">
         
         {/* Subtle animated particles */}
         <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
           <span className="absolute top-[15%] left-[8%] text-2xl opacity-10 animate-bounce" style={{animationDuration:'4s'}}>🌾</span>
           <span className="absolute top-[55%] right-[12%] text-xl opacity-10 animate-bounce" style={{animationDuration:'6s',animationDelay:'1s'}}>🌿</span>
           <span className="absolute top-[35%] left-[88%] text-3xl opacity-10 animate-bounce" style={{animationDuration:'5s',animationDelay:'2s'}}>🍃</span>
           <span className="absolute top-[70%] left-[40%] text-lg opacity-10 animate-bounce" style={{animationDuration:'7s',animationDelay:'0.5s'}}>🌱</span>
         </div>

         <div className="container mx-auto px-4 lg:px-8 relative z-10">
            {/* Top Navigation */}
            <div className="flex justify-between items-center mb-6">
              <Link 
                href="/wiki" 
                className="group flex items-center gap-2 text-white/80 hover:text-white font-medium transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10 text-sm"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
                {isHindi ? 'वापस जाएं' : 'Back to Wiki'}
              </Link>
              
              <div className="flex items-center gap-2 bg-white/10 p-1 rounded-full backdrop-blur-sm border border-white/20">
                <Globe size={14} className="text-white/70 ml-2" />
                <LanguageToggle lang={lang} toggleLang={toggleLang} />
              </div>
            </div>

            {/* Hero Content — compact */}
            <div className="max-w-2xl mx-auto text-center">
              <div className="text-5xl mb-3 filter drop-shadow-lg">🤖</div>

              <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tight">
                {isHindi ? 'स्मार्ट फसल सलाहकार' : 'Smart Crop Advisor'}
              </h1>
              
              <p className="text-base md:text-lg text-green-100/80 font-medium mb-5 max-w-xl mx-auto">
                {isHindi 
                  ? 'AI आपकी मिट्टी और मौसम के अनुसार सबसे मुनाफे वाली फसल खोजेगा। 100% मुफ्त।' 
                  : 'AI finds the most profitable crop for your soil & weather. 100% Free.'}
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap justify-center gap-2">
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                  <CloudSun size={14} className="text-yellow-300" />
                  <span className="text-xs font-bold">{isHindi ? 'लाइव मौसम' : 'Live Weather'}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                  <Bot size={14} className="text-blue-300" />
                  <span className="text-xs font-bold">{isHindi ? 'AI पावर्ड' : 'AI Powered'}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                  <Zap size={14} className="text-amber-300" />
                  <span className="text-xs font-bold">30 Sec</span>
                </div>
              </div>
            </div>
         </div>

         {/* Curved White Separator */}
         <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-0">
           <svg className="relative block w-full h-[50px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
             <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,130.85,130.85,201.21,113.39,242.66,102.76,281.44,81.18,321.39,56.44Z" fill="#F0F7F0"></path>
           </svg>
         </div>
      </div>
      
      {/* Form Container — reduced negative margin */}
      <div className="-mt-10 px-4 pb-16 relative z-20 max-w-4xl mx-auto">
         <CropAdvisor isHindi={isHindi} />
      </div>

    </div>
  )
}
