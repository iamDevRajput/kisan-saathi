import Head from 'next/head'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowLeft,
  FileText,
  IndianRupee,
  Shield,
  Wallet,
  Leaf,
  Droplets,
  Sun,
  CheckCircle,
  XCircle,
  ExternalLink,
  Search,
  Filter
} from 'lucide-react'

const categoryIcons = {
  SUBSIDY: IndianRupee,
  INSURANCE: Shield,
  LOAN: Wallet,
  IRRIGATION: Droplets,
  EQUIPMENT: Sun,
  TRAINING: FileText,
  MARKETING: FileText,
  SEEDS: Leaf,
  GRANT: IndianRupee,
}

const categoryColors = {
  SUBSIDY: 'bg-green-100 text-green-700',
  INSURANCE: 'bg-blue-100 text-blue-700',
  LOAN: 'bg-purple-100 text-purple-700',
  IRRIGATION: 'bg-cyan-100 text-cyan-700',
  EQUIPMENT: 'bg-orange-100 text-orange-700',
  TRAINING: 'bg-yellow-100 text-yellow-700',
  MARKETING: 'bg-pink-100 text-pink-700',
  SEEDS: 'bg-lime-100 text-lime-700',
  GRANT: 'bg-emerald-100 text-emerald-700',
}

export default function SchemesPage() {
  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [eligibilityResult, setEligibilityResult] = useState(null)
  const [showEligibilityForm, setShowEligibilityForm] = useState(false)
  const [eligibilityData, setEligibilityData] = useState({
    landArea: '',
    annualIncome: '',
    state: 'UP',
    hasKCC: false,
    hasPMKisan: false,
  })

  useEffect(() => {
    fetchSchemes()
  }, [selectedCategory])

  const fetchSchemes = async () => {
    setLoading(true)
    try {
      const params = selectedCategory !== 'ALL' ? `?category=${selectedCategory}` : ''
      const response = await fetch(`/api/schemes/all${params}`)
      const data = await response.json()
      if (data.success) {
        setSchemes(data.data.schemes)
      }
    } catch (error) {
      console.error('Failed to fetch schemes:', error)
    }
    setLoading(false)
  }

  const checkEligibility = async () => {
    try {
      const response = await fetch('/api/schemes/check-eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...eligibilityData,
          landArea: parseFloat(eligibilityData.landArea) || 0,
          annualIncome: parseFloat(eligibilityData.annualIncome) || 0,
        }),
      })
      const data = await response.json()
      if (data.success) {
        setEligibilityResult(data.data)
      }
    } catch (error) {
      console.error('Eligibility check failed:', error)
    }
  }

  const filteredSchemes = schemes.filter(scheme =>
    scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scheme.nameHindi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scheme.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const categories = ['ALL', 'SUBSIDY', 'INSURANCE', 'LOAN', 'IRRIGATION', 'EQUIPMENT', 'TRAINING']

  return (
    <>
      <Head>
        <title>Government Schemes - KisanSaathi</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-800">सरकारी योजनाएं</h1>
                <p className="text-sm text-gray-500">Government Schemes for Farmers</p>
              </div>
            </div>
            <button
              onClick={() => setShowEligibilityForm(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Check Eligibility
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6">
          {/* Search and Filter */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search schemes... योजनाएं खोजें..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                      selectedCategory === cat
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat === 'ALL' ? 'All' : cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Schemes Grid */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSchemes.map((scheme, index) => {
                const IconComponent = categoryIcons[scheme.category] || FileText
                const colorClass = categoryColors[scheme.category] || 'bg-gray-100 text-gray-700'
                
                return (
                  <motion.div
                    key={scheme.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-2 rounded-lg ${colorClass}`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${colorClass}`}>
                          {scheme.category}
                        </span>
                      </div>
                      
                      <h3 className="font-bold text-gray-800 mb-1">{scheme.name}</h3>
                      <p className="text-sm text-green-700 mb-2">{scheme.nameHindi}</p>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {scheme.shortDescription}
                      </p>

                      {/* Benefits */}
                      {scheme.benefits && (
                        <div className="bg-green-50 rounded-lg p-3 mb-4">
                          <p className="text-sm font-medium text-green-800">
                            {scheme.benefits.amount && `₹${scheme.benefits.amount.toLocaleString()}`}
                            {scheme.benefits.subsidyPercent && ` | ${scheme.benefits.subsidyPercent} Subsidy`}
                            {scheme.benefits.maxLoan && ` | Up to ₹${(scheme.benefits.maxLoan/100000).toFixed(1)}L`}
                          </p>
                        </div>
                      )}

                      {/* Documents Required */}
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-1">Required Documents:</p>
                        <div className="flex flex-wrap gap-1">
                          {scheme.documents?.slice(0, 3).map((doc, i) => (
                            <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {doc}
                            </span>
                          ))}
                          {scheme.documents?.length > 3 && (
                            <span className="text-xs text-gray-500">+{scheme.documents.length - 3} more</span>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <a
                        href={scheme.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                      >
                        Apply Now <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}

          {filteredSchemes.length === 0 && !loading && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No schemes found matching your search</p>
            </div>
          )}
        </main>

        {/* Eligibility Check Modal */}
        {showEligibilityForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Check Your Eligibility</h2>
                <p className="text-gray-600 mb-6">पात्रता जांचें</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Land Area (acres)</label>
                    <input
                      type="number"
                      value={eligibilityData.landArea}
                      onChange={(e) => setEligibilityData({...eligibilityData, landArea: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="e.g., 2.5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Annual Income (₹)</label>
                    <input
                      type="number"
                      value={eligibilityData.annualIncome}
                      onChange={(e) => setEligibilityData({...eligibilityData, annualIncome: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="e.g., 150000"
                    />
                  </div>

                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={eligibilityData.hasKCC}
                        onChange={(e) => setEligibilityData({...eligibilityData, hasKCC: e.target.checked})}
                      />
                      <span className="text-sm">Have KCC</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={eligibilityData.hasPMKisan}
                        onChange={(e) => setEligibilityData({...eligibilityData, hasPMKisan: e.target.checked})}
                      />
                      <span className="text-sm">Have PM-KISAN</span>
                    </label>
                  </div>
                </div>

                {eligibilityResult && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-bold mb-3">Results:</h3>
                    <div className="space-y-2">
                      <p className="text-green-600 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Eligible: {eligibilityResult.summary.eligible} schemes
                      </p>
                      <p className="text-red-600 flex items-center gap-2">
                        <XCircle className="w-4 h-4" />
                        Not Eligible: {eligibilityResult.summary.ineligible} schemes
                      </p>
                    </div>
                    {eligibilityResult.eligible.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium mb-2">You can apply for:</p>
                        <ul className="text-sm space-y-1">
                          {eligibilityResult.eligible.map(e => (
                            <li key={e.schemeId} className="text-green-700">✓ {e.schemeName}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowEligibilityForm(false)
                      setEligibilityResult(null)
                    }}
                    className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                    onClick={checkEligibility}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Check Now
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </>
  )
}
