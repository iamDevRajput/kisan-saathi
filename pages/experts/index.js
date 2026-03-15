// pages/experts/index.js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Search, Filter, Phone, Star, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import ExpertCard from '../../src/components/experts/ExpertCard';

export default function ExpertDirectory() {
  const [lang, setLang] = useState('en');
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    isOnline: false,
    isKVK: false,
    minRating: 0
  });

  useEffect(() => {
    // Check local storage for language
    const saved = localStorage.getItem('kisansaathi_lang');
    if (saved) setLang(saved);
  }, []);

  useEffect(() => {
    fetchExperts();
  }, [filters, search]);

  const fetchExperts = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({
        search,
        ...(filters.isOnline && { isOnline: true }),
        ...(filters.isKVK && { isKVK: true }),
        ...(filters.minRating > 0 && { minRating: filters.minRating })
      });
      
      const res = await fetch(`/api/experts?${q}`);
      const json = await res.json();
      if (json.success) {
        setExperts(json.data);
      }
    } catch (error) {
      console.error('Failed to fetch experts', error);
    } finally {
      setLoading(false);
    }
  };

  const isHi = lang === 'hi';

  const stats = [
    { value: '150+', label: isHi ? 'विशेषज्ञ' : 'Experts' },
    { value: '4.8⭐', label: isHi ? 'औसत रेटिंग' : 'Avg Rating' },
    { value: '₹0-149', label: isHi ? 'प्रति कॉल' : 'Per Call' },
    { value: '< 2hr', label: isHi ? 'प्रतिक्रिया' : 'Response' }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF8] pb-24 font-sans">
      <Head>
        <title>{isHi ? 'विशेषज्ञ से बात | किसान साथी' : 'Expert Connect | KisanSaathi'}</title>
      </Head>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] pt-20 pb-16 px-4 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="flex-1 max-w-2xl">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight"
              >
                {isHi ? 'अपने खेत के लिए ' : 'Talk to '}
                <span className="text-yellow-400">{isHi ? 'Expert' : 'Agricultural Experts'}</span>
                {isHi ? ' से बात करो' : ''}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-green-100 text-lg md:text-xl mb-8 max-w-xl"
              >
                {isHi 
                  ? 'रोग प्रबंधन, मंडी भाव और सरकारी योजनाओं पर भारत के सर्वश्रेष्ठ कृषि वैज्ञानिकों से तुरंत वीडियो कॉल पर सलाह लें।' 
                  : 'Get instant video consultation from India\'s best agricultural scientists on disease management, market prices, and government schemes.'}
              </motion.p>
              
              {/* Search Bar */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-2 flex items-center shadow-2xl shadow-green-900/50 max-w-xl"
              >
                <div className="pl-4 pr-2 text-gray-400"><Search size={24} /></div>
                <input 
                  type="text"
                  placeholder={isHi ? 'विशेषज्ञ या फसल खोजें... (उदा: गेहूं, डॉ रमेश)' : 'Search expert or crop... (e.g., Wheat)'}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent py-3 px-2 outline-none text-gray-800 text-lg placeholder-gray-400"
                />
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-colors">
                  {isHi ? 'खोजें' : 'Search'}
                </button>
              </motion.div>

              {/* Quick Filters */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-2 mt-6 justify-center md:justify-start"
              >
                {['🌾 Crop Expert', '🐛 Pest Control', '💰 Market', '🏛️ KVK Free'].map((tag) => (
                  <button 
                    key={tag} 
                    onClick={() => setSearch(tag.replace(/[^a-zA-Z\s]/g, '').trim())}
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-1.5 rounded-full text-sm backdrop-blur-sm transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </motion.div>
            </div>

            {/* Floating Live Stats Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white w-full max-w-xs shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="font-semibold">{isHi ? '12 विशेषज्ञ ऑनलाइन हैं' : '12 Experts Online Now'}</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-500/20 p-2 rounded-lg text-yellow-400"><Star size={20} /></div>
                  <span className="font-medium">4.8 Average Rating</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400"><Phone size={20} /></div>
                  <span className="font-medium">10,000+ Sessions Done</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {stats.map((stat, i) => (
              <div key={i} className="text-center px-4">
                <div className="text-2xl md:text-3xl font-extrabold text-green-800 mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <div className="flex items-center gap-2 font-bold text-gray-800 mb-6 pb-4 border-b border-gray-100">
              <Filter size={20} className="text-green-600" />
              {isHi ? 'फिल्टर' : 'Filters'}
            </div>

            <div className="space-y-6">
              <div>
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm font-medium text-gray-700 group-hover:text-green-700">{isHi ? 'केवल ऑनलाइन' : 'Online Only'}</span>
                  <div className="relative">
                    <input type="checkbox" className="sr-only" checked={filters.isOnline} onChange={e => setFilters({...filters, isOnline: e.target.checked})} />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${filters.isOnline ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${filters.isOnline ? 'transform translate-x-4' : ''}`}></div>
                  </div>
                </label>
              </div>

              <div>
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm font-medium text-gray-700 group-hover:text-amber-600">{isHi ? 'KVK विशेषज्ञ (मुफ़्त)' : 'KVK Experts (Free)'}</span>
                  <div className="relative">
                    <input type="checkbox" className="sr-only" checked={filters.isKVK} onChange={e => setFilters({...filters, isKVK: e.target.checked})} />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${filters.isKVK ? 'bg-amber-500' : 'bg-gray-200'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${filters.isKVK ? 'transform translate-x-4' : ''}`}></div>
                  </div>
                </label>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{isHi ? 'रेटिंग' : 'Rating'}</h4>
                <div className="space-y-2">
                  {[4.5, 4.0, 3.5].map((rating) => (
                    <label key={rating} className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="radio" 
                        name="rating" 
                        checked={filters.minRating === rating}
                        onChange={() => setFilters({...filters, minRating: rating})}
                        className="w-4 h-4 text-green-600 focus:ring-green-500" 
                      />
                      <span className="text-sm text-gray-700 flex items-center gap-1">
                        {rating} & Up <Star size={14} className="fill-yellow-500 text-yellow-500" />
                      </span>
                    </label>
                  ))}
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="radio" 
                      name="rating" 
                      checked={filters.minRating === 0}
                      onChange={() => setFilters({...filters, minRating: 0})}
                      className="w-4 h-4 text-green-600 focus:ring-green-500" 
                    />
                    <span className="text-sm text-gray-700">{isHi ? 'सभी दिखाएं' : 'Show All'}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Experts Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-100 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : experts.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {search ? (isHi ? `'${search}' के लिए परिणाम` : `Results for '${search}'`) : (isHi ? 'सुझाए गए विशेषज्ञ' : 'Recommended Experts')}
                </h2>
                <span className="text-sm text-gray-500">{experts.length} {isHi ? 'विशेषज्ञ' : 'experts'}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {experts.map((expert, idx) => (
                  <ExpertCard key={expert.id} expert={expert} lang={lang} />
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🔍</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{isHi ? 'कोई विशेषज्ञ नहीं मिला' : 'No experts found'}</h3>
              <p className="text-gray-500 mb-6">{isHi ? 'कृपया अपने सर्च फिल्टर बदल कर दोबारा कोशिश करें।' : 'Try adjusting your search filters to find what you are looking for.'}</p>
              <button 
                onClick={() => {setSearch(''); setFilters({isOnline:false, isKVK:false, minRating:0});}}
                className="text-green-600 font-medium hover:text-green-700"
              >
                {isHi ? 'फिल्टर साफ करें' : 'Clear all filters'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
