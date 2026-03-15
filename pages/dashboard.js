import Head from 'next/head'
import { useState, useCallback } from 'react'
import DarkModeToggle from '../src/components/DarkModeToggle'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import Link from 'next/link'
import useSWR from 'swr'
import {
  LayoutDashboard,
  Wheat,
  Camera,
  History,
  TrendingUp,
  FileText,
  BookOpen,
  Settings,
  Bell,
  Search,
  Sun,
  CloudRain,
  Droplets,
  Thermometer,
  Calendar,
  Menu,
  X,
  User,
  LogOut,
  Eye,
  EyeOff,
  Volume2,
  Sparkles,
  Stethoscope
} from 'lucide-react'

const quickActions = [
  { icon: Camera, title: 'Pest Detection', color: 'from-green-500 to-green-600', href: '/pest-detection' },
  { icon: Stethoscope, title: 'Expert Connect', titleHindi: 'विशेषज्ञ से बात', color: 'from-teal-500 to-teal-600', href: '/experts' },
  { icon: Volume2, title: 'AI Assistant', color: 'from-blue-500 to-blue-600' },
  { icon: TrendingUp, title: 'Market Prices', color: 'from-purple-500 to-purple-600', href: '/market-prices' },
  { icon: FileText, title: 'Generate Report', color: 'from-orange-500 to-orange-600' },
  { icon: BookOpen, title: 'फसल ज्ञान', color: 'from-green-600 to-emerald-700', href: '/wiki' }
]

const sidebarItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'my-crops', icon: Wheat, label: 'My Crops' },
  { id: 'pest-detection', icon: Camera, label: 'Pest Detection' },
  { id: 'history', icon: History, label: 'Advisory History' },
  { id: 'market', icon: TrendingUp, label: 'Market Prices' },
  { id: 'wiki', icon: BookOpen, label: 'फसल ज्ञान', href: '/wiki' },
  { id: 'advisor', icon: Sparkles, label: 'Crop Advisor', labelHindi: 'फसल सलाह', href: '/wiki/recommend' },
  { id: 'experts', icon: Stethoscope, label: 'Expert Connect', labelHindi: 'विशेषज्ञ', href: '/experts' },
  { id: 'schemes', icon: FileText, label: 'Govt Schemes', href: '/schemes' },
  { id: 'settings', icon: Settings, label: 'Settings' }
]

const translations = {
  en: {
    alertBanner: 'Pest outbreak alert – possibility of disease in your district. Take preventive measures.',
    userName: 'Ram Sharma',
    rain: 'Rain',
    weatherTip: 'Heavy rain likely in 48 hours – avoid using fertilizer.',
    stage: 'Stage',
    soilHealthScore: 'Soil Health Score',
    pHLevel: 'pH Level',
    npkRatio: 'NPK Ratio',
    nextAction: 'Next Action',
    quickActions: 'Quick Actions',
    listening: 'Listening... Speak your question',
    voiceAdvice: 'As per current weather conditions, it is advised to postpone pesticide use for 2 days.',
  },
  hi: {
    alertBanner: 'कीट प्रकोप की सूचना - आपके जिले में बीमारी के प्रकोप की संभावना है। निवारक उपाय करें।',
    userName: 'राम शर्मा',
    rain: 'रेन',
    weatherTip: '48 घंटों में भारी बारिश की संभावना है - उर्वरक का उपयोग न करें',
    stage: 'अवस्था',
    soilHealthScore: 'मिट्टी का स्वास्थ्य अंक',
    pHLevel: 'pH स्तर',
    npkRatio: 'NPK अनुपात',
    nextAction: 'अगली कार्यवाही',
    quickActions: 'त्वरित कार्य',
    listening: 'सुन रहा है... अपना प्रश्न बोलें',
    voiceAdvice: 'वर्तमान मौसम की स्थितियों के अनुसार, कीटनाशक के उपयोग को 2 दिन के लिए टालना सलाह दी जाती है।',
  },
}

const DEFAULT_WEATHER_DATA = {
  temperature: 28,
  humidity: 65,
  rainProbability: 70,
  forecast: [
    { day: 'Today', temp: 28, condition: 'Partly Cloudy' },
    { day: 'Tomorrow', temp: 30, condition: 'Sunny' },
    { day: 'Day 3', temp: 32, condition: 'Hot' }
  ]
}

const DEFAULT_CROP_DATA = [
  { name: 'Wheat', stage: 'Flowering', health: 85, lastAdvisory: '2026-01-15' },
  { name: 'Mustard', stage: 'Ripening', health: 78, lastAdvisory: '2026-01-14' }
]

const DEFAULT_SOIL_DATA = {
  healthScore: 82,
  pH: 6.8,
  npk: '20:15:10',
  nextAction: '2026-01-25'
}

const DEFAULT_MARKET_DATA = [
  { crop: 'Wheat', mandi: 'Meerut', price: 2450, trend: 'up' },
  { crop: 'Rice', mandi: 'Meerut', price: 2800, trend: 'down' },
  { crop: 'Mustard', mandi: 'Meerut', price: 4200, trend: 'up' },
  { crop: 'Gram', mandi: 'Meerut', price: 5100, trend: 'stable' }
]

export default function Dashboard() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [language, setLanguage] = useState('hi')
  const [showVoiceModal, setShowVoiceModal] = useState(false)
  const [alertBannerVisible, setAlertBannerVisible] = useState(true)

  const [weatherData, setWeatherData] = useState(DEFAULT_WEATHER_DATA)
  const [cropData, setCropData] = useState(DEFAULT_CROP_DATA)
  const [soilData, setSoilData] = useState(DEFAULT_SOIL_DATA)
  const [marketData, setMarketData] = useState(DEFAULT_MARKET_DATA)

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en')
  }

  const handleVoiceAssistant = () => {
    setShowVoiceModal(true)
  }

  const closeVoiceModal = () => {
    setShowVoiceModal(false)
  }

  const t = translations
  const lang = language === 'en' ? 'en' : 'hi'

  const renderTrendIcon = useCallback((trend) => {
    switch (trend) {
      case 'up': return <span className="text-green-600">↗️</span>
      case 'down': return <span className="text-red-600">↘️</span>
      case 'stable': return <span className="text-gray-600">➡️</span>
      default: return <span className="text-gray-600">➡️</span>
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex transition-colors duration-300">
      <Head>
        <title>Dashboard - KisanSaathi</title>
        <meta name="description" content="Agricultural Dashboard" />
      </Head>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <Wheat className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">KisanSaathi</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-6">
          <div className="px-4 space-y-2">
            {sidebarItems.map((item) => (
              item.href ? (
                <Link
                  key={item.id}
                  href={item.href}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-600"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ) : (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${activeTab === item.id
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border-l-4 border-primary-500'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-600'
                    }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            ))}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <Menu className="w-6 h-6" />
              </button>

              <div className="flex items-center space-x-2 text-gray-600">
                <span>📍</span>
                <span className="font-medium">Meerut, Uttar Pradesh</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Dark Mode Toggle */}
              <DarkModeToggle />

              <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-full p-1">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${language === 'en'
                      ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage('hi')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${language === 'hi'
                      ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                  हिंदी
                </button>
              </div>

              <button
                onClick={handleVoiceAssistant}
                className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                <Volume2 className="w-5 h-5" />
              </button>

              <button className="relative p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="hidden md:block">
                  <div className="font-medium text-gray-900 dark:text-white">{t[lang].userName}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Farmer</div>
                </div>

                <button
                  onClick={() => router.push('/')}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Alert Banner */}
        {alertBannerVisible && (
          <div className="bg-red-500 text-white p-4">
            <div className="container mx-auto px-6 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-xl">⚠️</span>
                <span>{t[lang].alertBanner}</span>
              </div>
              <button
                type="button"
                onClick={() => setAlertBannerVisible(false)}
                className="text-white hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Weather Card */}
              <div className="dashboard-card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Weather & Alerts</h3>
                  <Sun className="w-6 h-6 text-yellow-500" />
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Thermometer className="w-8 h-8 text-red-500" />
                      <span className="text-3xl font-bold text-gray-900">{weatherData.temperature}°C</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CloudRain className="w-6 h-6 text-blue-500" />
                      <span className="text-lg text-gray-600">{t[lang].rain}: {weatherData.rainProbability}%</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4">3-Day Forecast</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {weatherData.forecast.map((day) => (
                      <div key={day.day} className="bg-gray-50 rounded-lg p-3 text-center">
                        <div className="text-sm text-gray-600 mb-1">{day.day}</div>
                        <div className="text-lg font-semibold text-gray-900">{day.temp}°C</div>
                        <div className="text-xs text-gray-500">{day.condition}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <div className="flex items-start">
                    <span className="text-yellow-400 mr-2">💡</span>
                    <p className="text-yellow-800">
                      {t[lang].weatherTip}
                    </p>
                  </div>
                </div>
              </div>

              {/* Crop Overview */}
              <div className="dashboard-card">
                <h3 className="text-xl font-bold text-gray-900 mb-6">My Crops</h3>
                <div className="space-y-6">
                  {cropData.map((crop) => (
                    <div key={crop.name} className="bg-primary-50 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">{crop.name}</h4>
                          <p className="text-gray-600">{t[lang].stage}: {crop.stage}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
                                style={{ width: `${crop.health}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold text-primary-600">{crop.health}%</span>
                          </div>
                        </div>
                      </div>
                      <button className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg transition-colors">
                        View Advisory
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Soil Health */}
              <div className="dashboard-card">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Soil Health & Recommendations</h3>
                <div className="text-center mb-6">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary-600">{soilData.healthScore}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">{t[lang].soilHealthScore}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                    <span className="text-gray-600">{t[lang].pHLevel}:</span>
                    <span className="font-semibold text-gray-900">{soilData.pH}</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                    <span className="text-gray-600">{t[lang].npkRatio}:</span>
                    <span className="font-semibold text-gray-900">{soilData.npk}</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                    <span className="text-gray-600">{t[lang].nextAction}:</span>
                    <span className="font-semibold text-gray-900">25 Jan 2026</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="dashboard-card xl:col-span-2">
                <h3 className="text-xl font-bold text-gray-900 mb-6">{t[lang].quickActions}</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {quickActions.map((action) => (
                    <button
                      key={action.title}
                      onClick={() => action.href && router.push(action.href)}
                      className="bg-gradient-to-br bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md border border-white/20`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="font-medium text-gray-900 leading-tight">
                        {lang === 'hi' && action.titleHindi ? action.titleHindi : action.title}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Market Prices */}
              <div className="dashboard-card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Market Prices</h3>
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
                <div className="space-y-3">
                  {marketData.map((item) => (
                    <div key={item.crop} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{item.crop}</div>
                        <div className="text-sm text-gray-500">{item.mandi}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">₹{item.price}</div>
                        <div className="text-sm flex items-center justify-end">
                          {renderTrendIcon(item.trend)}
                          <span className="ml-1">
                            {item.trend === 'up' && '+2%'}
                            {item.trend === 'down' && '-1%'}
                            {item.trend === 'stable' && '0%'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fasal Gyan Widget */}
              {(() => {
                const { data: seasonal } = useSWR('/api/wiki/seasonal', url => fetch(url).then(r => r.json()).then(r => r.data), { revalidateOnFocus: false })
                const featured = seasonal?.crops?.[0]
                return (
                  <div className="dashboard-card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900">📚 फसल ज्ञान</h3>
                      <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-full">{seasonal?.seasonLabel?.label || 'रबी'} सीजन</span>
                    </div>
                    {featured ? (
                      <>
                        <div className="bg-[#F1F8F1] rounded-2xl p-5 mb-4 flex items-center gap-4">
                          <div className="text-4xl">{featured.emoji}</div>
                          <div>
                            <div className="font-black text-2xl text-gray-900">{featured.nameHindi}</div>
                            <div className="text-sm text-gray-500 font-medium">{featured.name}</div>
                            <div className="text-xs text-[#1B5E20] font-bold mt-1">{seasonal?.seasonLabel?.period}</div>
                          </div>
                        </div>
                        <div className="bg-amber-50 rounded-xl p-3 mb-4 border border-amber-100">
                          <p className="text-sm text-amber-800 font-semibold">💡 आज का टिप: {featured.nameHindi} की बुवाई का {seasonal?.seasonLabel?.label} सीजन में उत्तम समय है।</p>
                        </div>
                        <Link href={`/wiki/${featured.slug}`} className="block w-full bg-[#1B5E20] hover:bg-[#2E7D32] text-white text-center py-3 rounded-xl font-bold transition-colors">
                          पूरी जानकारी →
                        </Link>
                      </>
                    ) : (
                      <div className="animate-pulse">
                        <div className="h-20 bg-gray-100 rounded-2xl mb-4" />
                        <div className="h-10 bg-gray-100 rounded-xl" />
                      </div>
                    )}
                  </div>
                )
              })()}
            </div>
          </div>
        </main>
      </div>

      {/* Voice Modal */}
      {showVoiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">AI Assistant</h3>
                <button onClick={closeVoiceModal} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="text-center py-8">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <Volume2 className="w-10 h-10 text-white" />
                </div>
                <p className="text-gray-600 mb-4">{t[lang].listening}</p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">
                    {t[lang].voiceAdvice}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}