'use client'
import React, { useState, useEffect } from 'react'
import AdvisorResult from './AdvisorResult'
import { MapPin, Target, Sparkles, AlertCircle, Check } from 'lucide-react'

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
  const [error, setError] = useState(null)
  
  // Track form completeness for step indicator
  const completedSteps = [
    formData.district,
    formData.soil,
    formData.irrigation && formData.area && formData.budget && formData.season
  ].filter(Boolean).length;
  
  const districts = ['Agra', 'Aligarh', 'Allahabad', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 'Ayodhya', 'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 'Bareilly', 'Basti', 'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli', 'Chitrakoot', 'Deoria', 'Meerut']
  
  const soils = [
    { id: 'loamy', en: 'Loamy Soil', hi: 'दोमट मिट्टी', desc_en: 'Best for most crops', desc_hi: 'ज्यादातर फसलों के लिए', color: 'bg-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', ring: 'ring-amber-500' },
    { id: 'sandy', en: 'Sandy Soil', hi: 'बलुई मिट्टी', desc_en: 'Needs frequent water', desc_hi: 'अधिक पानी चाहिए', color: 'bg-yellow-300', bg: 'bg-yellow-50', border: 'border-yellow-200', ring: 'ring-yellow-400' },
    { id: 'clay', en: 'Clay Soil', hi: 'चिकनी मिट्टी', desc_en: 'Holds water well', desc_hi: 'पानी रोकती है', color: 'bg-stone-500', bg: 'bg-stone-50', border: 'border-stone-200', ring: 'ring-stone-400' },
    { id: 'black', en: 'Black Soil', hi: 'काली मिट्टी', desc_en: 'Great for cotton', desc_hi: 'कपास के लिए उत्तम', color: 'bg-gray-800', bg: 'bg-gray-100', border: 'border-gray-300', ring: 'ring-gray-800' },
    { id: 'red', en: 'Red Soil', hi: 'लाल मिट्टी', desc_en: 'Needs fertilizers', desc_hi: 'खाद की जरूरत', color: 'bg-red-600', bg: 'bg-red-50', border: 'border-red-200', ring: 'ring-red-500' },
    { id: 'alluvial', en: 'Alluvial Soil', hi: 'जलोढ़ मिट्टी', desc_en: 'Highly fertile', desc_hi: 'बहुत उपजाऊ', color: 'bg-blue-300', bg: 'bg-blue-50', border: 'border-blue-200', ring: 'ring-blue-400' }
  ]
  
  const irrigations = [
    { id: 'tubewell', en: 'Tube Well', hi: 'ट्यूबवेल', icon: '⚙️' },
    { id: 'canal', en: 'Canal', hi: 'नहर', icon: '🌊' },
    { id: 'rain', en: 'Rain-fed', hi: 'बारिश', icon: '🌧️' },
    { id: 'drip', en: 'Drip/Sprinkler', hi: 'ड्रिप', icon: '💧' }
  ]
  
  const budgets = [
    { id: 'low', en: 'Low Budget', hi: 'कम बजट', desc_en: '< ₹10k/acre', desc_hi: '₹10,000 से कम/acre', crops_en: 'Veggies, Pulses', crops_hi: 'सब्जी, दाल, अनाज', icon: '💵', badge: null },
    { id: 'medium', en: 'Medium Budget', hi: 'मध्यम बजट', desc_en: '₹10k-25k/acre', desc_hi: '₹10,000-25,000/acre', crops_en: 'Wheat, Mustard', crops_hi: 'गेहूं, सरसों, मक्का', icon: '💰', badge: isHindi ? 'लोकप्रिय' : 'Popular' },
    { id: 'high', en: 'High Budget', hi: 'अधिक बजट', desc_en: '₹25k+/acre', desc_hi: '₹25,000+/acre', crops_en: 'Horticulture', crops_hi: 'बागवानी, मसाले', icon: '💎', badge: null }
  ]
  
  const seasons = [
    { id: 'rabi', en: 'Rabi Season', hi: 'रबी सीजन', months: 'Oct - March', crops_hi: 'गेहूं, सरसों', crops_en: 'Wheat, Mustard', icon: '❄️' },
    { id: 'kharif', en: 'Kharif Season', hi: 'खरीफ सीजन', months: 'June - Sep', crops_hi: 'धान, मक्का', crops_en: 'Rice, Maize', icon: '☀️' },
    { id: 'zaid', en: 'Zaid Season', hi: 'जायद सीजन', months: 'April - June', crops_hi: 'तरबूज, खीरा', crops_en: 'Watermelon, Veggies', icon: '🌸' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Check if form is valid (just to trigger animations if missed)
    if (!formData.district || !formData.soil || !formData.irrigation || !formData.area || !formData.budget || !formData.season) {
      setError(isHindi ? 'कृपया सभी जानकारी भरें' : 'Please fill all details');
      setTimeout(() => setError(null), 3000);
      return;
    }

    setLoading(true)
    setError(null)
    
    try {
      const res = await fetch('/api/wiki/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const data = await res.json()
      if (data.success) {
        setResult(data.data)
        // Scroll to results smoothly after DOM update
        setTimeout(() => {
          const el = document.getElementById('results-section');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 400);
      } else {
        setError(isHindi ? 'कुछ गलत हो गया' : 'Something went wrong')
      }
    } catch (err) {
      console.error(err)
      setError(isHindi ? 'सर्वर से कनेक्ट नहीं हो सका' : 'Could not connect to server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto pb-16">
      
      {/* Main Form Card */}
      <div className="bg-white rounded-3xl shadow-xl shadow-green-900/5 relative mt-8">
        
        {/* Gradient Border Top */}
        <div className="h-2 w-full bg-gradient-to-r from-green-500 via-emerald-400 to-green-600 rounded-t-3xl absolute top-0 left-0" />
        
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-12 pt-10">
          
          {/* Progress Step Indicator */}
          <div className="flex items-center justify-between mx-auto max-w-sm mb-4 relative">
             <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -z-10 -translate-y-1/2 rounded-full"></div>
             <div className="absolute top-1/2 left-0 h-0.5 bg-green-500 -z-10 -translate-y-1/2 rounded-full transition-all duration-500" style={{ width: `${(completedSteps / 3) * 100}%` }}></div>
             
             <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${completedSteps >= 0 ? 'bg-green-600 text-white shadow-md shadow-green-200' : 'bg-gray-200 text-gray-500'}`}>1</div>
             <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${completedSteps >= 1 ? 'bg-green-600 text-white shadow-md shadow-green-200' : 'bg-gray-200 text-gray-500'}`}>2</div>
             <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${completedSteps >= 2 ? 'bg-green-600 text-white shadow-md shadow-green-200' : 'bg-gray-200 text-gray-500'}`}>3</div>
             <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${completedSteps >= 3 ? 'bg-green-600 text-white shadow-md shadow-green-200' : 'bg-gray-200 text-gray-500'}`}>
               <Check size={16} strokeWidth={3} />
             </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Section: District & Area */}
            <div className="md:col-span-2 space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2 border-b border-gray-100 pb-3">
                📍 {isHindi ? 'आपकी Location' : 'Your Farm Location'}
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3 group relative">
                  <label className="block text-sm font-bold text-gray-700">
                    {isHindi ? 'जिला (उत्तर प्रदेश)' : 'District (UP)'} 
                  </label>
                  <select 
                    required
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-100 focus:border-green-500 focus:bg-white outline-none transition-all appearance-none font-medium text-gray-800"
                    value={formData.district}
                    onChange={e => setFormData({...formData, district: e.target.value})}
                  >
                    <option value="">{isHindi ? 'जिला चुनें...' : 'Select District...'}</option>
                    {districts.sort().map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <div className="absolute right-4 top-[42px] pointer-events-none text-gray-400 group-hover:text-green-600 transition-colors">▼</div>
                  {formData.district && <p className="text-xs text-green-600 font-semibold px-2 animate-in fade-in slide-in-from-top-1">{isHindi ? 'राज्य: उत्तर प्रदेश' : 'State: Uttar Pradesh'}</p>}
                </div>

                <div className="space-y-3 relative group">
                  <label className="block text-sm font-bold text-gray-700">
                    🚜 {isHindi ? 'कुल जमीन' : 'Farm Area'} 
                  </label>
                  <div className="relative">
                    <input 
                      type="number"
                      required
                      min="0.1"
                      step="0.1"
                      className="w-full p-4 pr-16 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-100 focus:border-green-500 focus:bg-white outline-none transition-all font-bold text-gray-800 text-lg placeholder:font-normal placeholder:text-base"
                      value={formData.area}
                      onChange={e => setFormData({...formData, area: e.target.value})}
                      placeholder="Ex: 2.5"
                    />
                    <div className="absolute right-4 top-[18px] text-gray-500 font-medium">Acres</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Soil Type */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2 border-b border-gray-100 pb-3">
                🌱 {isHindi ? 'मिट्टी का प्रकार' : 'Soil Type'}
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {soils.map(s => {
                  const isSelected = formData.soil === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setFormData({...formData, soil: s.id})}
                      className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-300 overflow-hidden ${
                        isSelected 
                          ? `${s.bg} ${s.border} ring-4 ${s.ring} shadow-sm scale-[1.02]` 
                          : 'border-gray-100 bg-white hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 text-green-600 bg-white rounded-full p-0.5 shadow-sm z-10 animate-in zoom-in">
                          <Check size={14} strokeWidth={4} />
                        </div>
                      )}
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg shrink-0 mt-0.5 shadow-inner ${s.color}`}></div>
                        <div>
                          <div className={`font-bold text-base mb-0.5 ${isSelected ? 'text-gray-900' : 'text-gray-800'}`}>
                            {isHindi ? s.hi : s.en}
                          </div>
                          <div className={`text-xs ${isSelected ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>
                            {isHindi ? s.desc_hi : s.desc_en}
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Section: Irrigation */}
            <div className="md:col-span-2 space-y-4 pt-4">
              <h3 className="text-xl font-bold flex items-center gap-2 border-b border-gray-100 pb-3">
                💧 {isHindi ? 'सिंचाई की सुविधा' : 'Irrigation Facility'}
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {irrigations.map(i => {
                  const isSelected = formData.irrigation === i.id;
                  return (
                    <button
                      key={i.id}
                      type="button"
                      onClick={() => setFormData({...formData, irrigation: i.id})}
                      className={`p-4 rounded-2xl border-2 text-center transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-[1.03]' 
                          : 'border-gray-100 bg-white text-gray-700 hover:border-blue-200 hover:bg-blue-50'
                      }`}
                    >
                      <div className="text-3xl filter drop-shadow-sm">{i.icon}</div>
                      <div className="font-bold text-sm tracking-wide">
                        {isHindi ? i.hi : i.en}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Section: Season */}
            <div className="md:col-span-2 space-y-4 pt-4">
               <h3 className="text-xl font-bold flex items-center gap-2 border-b border-gray-100 pb-3">
                🗓️ {isHindi ? 'सीजन' : 'Season'}
              </h3>
              
              <div className="grid md:grid-cols-3 gap-4">
                {seasons.map(s => {
                  const isSelected = formData.season === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setFormData({...formData, season: s.id})}
                      className={`relative p-5 rounded-3xl border-2 text-left transition-all duration-300 ${
                        isSelected 
                          ? 'border-green-500 bg-green-50 shadow-md scale-[1.02]' 
                          : 'border-gray-100 bg-white hover:border-green-200 hover:bg-green-50/50 hover:shadow-sm hover:-translate-y-1'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-4 right-4 text-white bg-green-500 rounded-full p-1 shadow-sm animate-in zoom-in">
                          <Check size={16} strokeWidth={3} />
                        </div>
                      )}
                      <div className="text-4xl mb-3 filter drop-shadow-sm">{s.icon}</div>
                      <h4 className={`font-black text-xl mb-1 ${isSelected ? 'text-green-800' : 'text-gray-900'}`}>
                        {isHindi ? s.hi : s.en}
                      </h4>
                      <p className="text-sm font-semibold text-gray-500 mb-3">{s.months}</p>
                      <div className="inline-block bg-white/80 border border-black/5 px-2 py-1 rounded-md text-xs font-medium text-gray-600">
                        {isHindi ? s.crops_hi : s.crops_en}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Section: Budget */}
            <div className="md:col-span-2 space-y-4 pt-4 mb-2">
              <h3 className="text-xl font-bold flex items-center gap-2 border-b border-gray-100 pb-3">
                💰 {isHindi ? 'आपका बजट' : 'Your Budget'}
              </h3>
              
              <div className="grid md:grid-cols-3 gap-4">
                {budgets.map(b => {
                  const isSelected = formData.budget === b.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setFormData({...formData, budget: b.id})}
                      className={`relative p-5 rounded-3xl border-2 text-left transition-all duration-300 ${
                        isSelected 
                          ? 'border-emerald-500 bg-emerald-50 shadow-md scale-[1.02]' 
                          : 'border-gray-100 bg-white hover:border-emerald-200 hover:shadow-sm hover:-translate-y-1'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                         <div className="text-3xl">{b.icon}</div>
                         {b.badge && (
                           <div className="bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full whitespace-nowrap border border-amber-200 shadow-sm animate-pulse flex items-center gap-1">
                             ★ {b.badge}
                           </div>
                         )}
                      </div>
                      
                      <h4 className={`font-black text-lg mb-0.5 ${isSelected ? 'text-emerald-800' : 'text-gray-900'}`}>
                        {isHindi ? b.hi : b.en}
                      </h4>
                      <p className={`text-sm font-bold mb-3 ${isSelected ? 'text-emerald-600' : 'text-gray-500'}`}>
                        {isHindi ? b.desc_hi : b.desc_en}
                      </p>
                      <div className="text-xs font-semibold text-gray-500 bg-black/5 rounded-lg p-2">
                        {isHindi ? b.crops_hi : b.crops_en}
                      </div>

                      {isSelected && (
                         <div className="absolute -inset-1 border-2 border-emerald-500 rounded-[28px] animate-pulse pointer-events-none opacity-50"></div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 relative">
            {error && (
              <div className="absolute -top-12 left-0 right-0 max-w-sm mx-auto bg-red-100 text-red-700 px-4 py-2 rounded-xl flex items-center justify-center gap-2 font-semibold shadow-sm animate-in slide-in-from-bottom-2 fade-in">
                <AlertCircle size={18} /> {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`group w-full h-[68px] sm:h-20 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] hover:from-[#134216] hover:to-[#215E24] text-white font-black text-xl md:text-2xl rounded-3xl shadow-xl shadow-green-900/20 hover:shadow-2xl hover:shadow-green-900/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 overflow-hidden relative ${error ? 'animate-shake' : ''}`}
            >
              {/* Button Shine Effect */}
              <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] group-hover:animate-shine"></div>
              
              {loading ? (
                <>
                   <div className="w-8 h-8 border-[5px] border-white/30 border-t-white rounded-full animate-spin"></div>
                   <span className="tracking-wide">{isHindi ? 'AI सोच रहा है...' : 'AI is thinking...'}</span>
                </>
              ) : (
                <>
                  <Sparkles size={28} className="text-yellow-300 group-hover:scale-125 transition-transform duration-500" /> 
                  <span className="tracking-wide group-hover:-translate-y-0.5 transition-transform">{isHindi ? 'बेहतरीन फसल बताएं' : 'Discover Best Crop'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      <div id="results-section">
        {result && (
          <div className="mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
             <div className="flex items-center gap-4 mb-8 max-w-[80%] mx-auto">
                <div className="h-px bg-gray-300 flex-1"></div>
                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest px-4 bg-[#F0F7F0] rounded-full py-1 border border-gray-200">
                  {isHindi ? 'परिणाम' : 'Results'}
                </div>
                <div className="h-px bg-gray-300 flex-1"></div>
             </div>
             <AdvisorResult result={result} isHindi={isHindi} />
          </div>
        )}
      </div>
    </div>
  )
}
