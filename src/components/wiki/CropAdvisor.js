'use client'
import React, { useState } from 'react'
import AdvisorResult from './AdvisorResult'

export default function CropAdvisor({ isHindi }) {
  const [formData, setFormData] = useState({
    district: '',
    soil: '',
    irrigation: '',
    area: '',
    budget: '',
    season: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  
  const districts = ['Agra', 'Aligarh', 'Allahabad', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 'Ayodhya', 'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 'Bareilly', 'Basti', 'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli', 'Chitrakoot', 'Deoria', 'Meerut']
  
  const soils = [
    { id: 'alluvial', en: 'Alluvial', hi: 'जलोढ़ मिट्टी' },
    { id: 'black', en: 'Black', hi: 'काली मिट्टी' },
    { id: 'red', en: 'Red', hi: 'लाल मिट्टी' },
    { id: 'loamy', en: 'Loamy', hi: 'दोमट मिट्टी' },
    { id: 'sandy', en: 'Sandy', hi: 'बलुई मिट्टी' },
    { id: 'clay', en: 'Clay', hi: 'चिकनी मिट्टी' }
  ]
  
  const irrigations = [
    { id: 'tubewell', en: 'Tube Well', hi: 'ट्यूबवेल / बोरवेल' },
    { id: 'canal', en: 'Canal', hi: 'नहर' },
    { id: 'rain', en: 'Rain-fed', hi: 'बारिश पर निर्भर' },
    { id: 'drip', en: 'Drip/Sprinkler', hi: 'ड्रिप सिंचाई' }
  ]
  
  const budgets = [
    { id: 'low', en: 'Low (< ₹10k/acre)', hi: 'कम (< ₹10k/एकड़)' },
    { id: 'medium', en: 'Medium (₹10k-25k/acre)', hi: 'मध्यम (₹10k-25k/एकड़)' },
    { id: 'high', en: 'High (> ₹25k/acre)', hi: 'अधिक (> ₹25k/एकड़)' }
  ]
  
  const seasons = [
    { id: 'rabi', en: 'Rabi (Oct-Mar)', hi: 'रबी (अक्टूबर-मार्च)' },
    { id: 'kharif', en: 'Kharif (Jun-Oct)', hi: 'खरीफ (जून-अक्टूबर)' },
    { id: 'zaid', en: 'Zaid (Mar-Jun)', hi: 'ज़ायद (मार्च-जून)' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch('/api/wiki/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const data = await res.json()
      if (data.success) {
        setResult(data.data)
      } else {
        alert(isHindi ? 'कुछ गलत हो गया' : 'Something went wrong')
      }
    } catch (err) {
      console.error(err)
      alert(isHindi ? 'सर्वर से कनेक्ट नहीं हो सका' : 'Could not connect to server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="bg-white rounded-3xl shadow-sm border border-green-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-800 to-green-600 p-8 text-white text-center">
          <div className="text-5xl border-4 border-white/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 bg-white/10 backdrop-blur-sm">🤖</div>
          <h2 className="text-3xl font-black mb-2">
            {isHindi ? 'स्मार्ट फसल सलाहकार' : 'Smart Crop Advisor'}
          </h2>
          <p className="text-green-50 text-lg opacity-90">
            {isHindi ? 'अपनी ज़मीन की जानकारी दें, AI आपको सबसे बेहतरीन फसल बताएगा' : 'Tell us about your land, and our AI will recommend the best crops'}
          </p>
          
          <div className="flex justify-center gap-4 mt-8">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold mb-2">1</div>
              <span className="text-sm font-medium opacity-90">{isHindi ? 'लोकेशन दें' : 'Location'}</span>
            </div>
            <div className="w-8 border-t-2 border-white/20 mt-5"></div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold mb-2">2</div>
              <span className="text-sm font-medium opacity-90">{isHindi ? 'मिट्टी बताएं' : 'Soil Info'}</span>
            </div>
            <div className="w-8 border-t-2 border-white/20 mt-5"></div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold mb-2">3</div>
              <span className="text-sm font-medium opacity-90">{isHindi ? 'फसल पाएं' : 'Get Crop'}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Location */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-700">
                {isHindi ? 'जिला (उत्तर प्रदेश)' : 'District (UP)'} *
              </label>
              <select 
                required
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                value={formData.district}
                onChange={e => setFormData({...formData, district: e.target.value})}
              >
                <option value="">{isHindi ? 'जिला चुनें...' : 'Select District...'}</option>
                {districts.sort().map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            {/* Land Area */}
             <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-700">
                {isHindi ? 'कुल जमीन (एकड़ में)' : 'Land Area (Acres)'} *
              </label>
              <input 
                type="number"
                required
                min="0.1"
                step="0.1"
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                value={formData.area}
                onChange={e => setFormData({...formData, area: e.target.value})}
                placeholder="Ex: 2.5"
              />
            </div>

            {/* Irrigation */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-700">
                {isHindi ? 'सिंचाई की सुविधा' : 'Irrigation Facility'} *
              </label>
              <select 
                required
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                value={formData.irrigation}
                onChange={e => setFormData({...formData, irrigation: e.target.value})}
              >
                <option value="">{isHindi ? 'सिंचाई का साधन चुनें...' : 'Select Irrigation type...'}</option>
                {irrigations.map(i => <option key={i.id} value={i.id}>{isHindi ? i.hi : i.en}</option>)}
              </select>
            </div>

             {/* Season */}
             <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-700">
                {isHindi ? 'सीजन' : 'Season'} *
              </label>
              <select 
                required
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                value={formData.season}
                onChange={e => setFormData({...formData, season: e.target.value})}
              >
                <option value="">{isHindi ? 'सीजन चुनें...' : 'Select Season...'}</option>
                {seasons.map(s => <option key={s.id} value={s.id}>{isHindi ? s.hi : s.en}</option>)}
              </select>
            </div>
             {/* Budget */}
             <div className="space-y-3 md:col-span-2">
              <label className="block text-sm font-bold text-gray-700">
                {isHindi ? 'आपका बजट' : 'Your Budget'} *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {budgets.map(b => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setFormData({...formData, budget: b.id})}
                    className={`p-4 rounded-xl border text-left transition-all ${formData.budget === b.id ? 'border-green-500 bg-green-50 ring-2 ring-green-200' : 'border-gray-200 hover:border-green-300'}`}
                  >
                    <div className={`font-bold ${formData.budget === b.id ? 'text-green-800' : 'text-gray-700'}`}>
                      {isHindi ? b.hi : b.en}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Soil Type Cards */}
            <div className="space-y-3 md:col-span-2">
              <label className="block text-sm font-bold text-gray-700">
                {isHindi ? 'मिट्टी का प्रकार' : 'Soil Type'} *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {soils.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setFormData({...formData, soil: s.id})}
                    className={`p-4 rounded-xl border text-center transition-all ${formData.soil === s.id ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-200' : 'border-gray-200 bg-white hover:border-amber-300'}`}
                  >
                    <div className="w-8 h-8 mx-auto bg-amber-100 rounded-full mb-2"></div>
                    <div className={`font-semibold text-sm ${formData.soil === s.id ? 'text-amber-900' : 'text-gray-700'}`}>
                      {isHindi ? s.hi : s.en}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white font-black text-xl py-5 rounded-2xl shadow-lg hover:bg-green-700 hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                 <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                 {isHindi ? 'AI विश्लेषण कर रहा है...' : 'AI is analyzing...'}
              </>
            ) : (
              <>
                <span className="text-2xl">✨</span> 
                {isHindi ? 'मेरी फसल बताएं' : 'Get Crop Recommendations'}
              </>
            )}
          </button>
        </form>
      </div>

      {result && (
        <div id="results-section">
          <AdvisorResult result={result} isHindi={isHindi} />
        </div>
      )}
    </div>
  )
}
