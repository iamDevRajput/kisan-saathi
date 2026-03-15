import Head from 'next/head'
import Link from 'next/link'
import { useWikiLanguage } from '../../src/hooks/useWikiLanguage'
import LanguageToggle from '../../src/components/wiki/LanguageToggle'
import CropAdvisor from '../../src/components/wiki/CropAdvisor'

export default function RecommendPage() {
  const { lang, toggleLang, isHindi } = useWikiLanguage()

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{isHindi ? 'स्मार्ट फसल सलाहकार - KisanSaathi' : 'Smart Crop Advisor - KisanSaathi'}</title>
      </Head>

      <div className="bg-[#1B5E20] pt-6 pb-24 text-white">
         <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <Link href="/wiki" className="text-green-100 hover:text-white font-bold flex gap-2 items-center">
                <span>←</span> {isHindi ? 'वापस जाएं' : 'Back to Wiki'}
              </Link>
              <LanguageToggle lang={lang} toggleLang={toggleLang} />
            </div>
         </div>
      </div>
      
      <div className="-mt-16 px-4">
         <CropAdvisor isHindi={isHindi} />
      </div>
    </div>
  )
}
