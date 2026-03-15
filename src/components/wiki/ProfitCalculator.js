import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

export default function ProfitCalculator({ cropProfit, msp, schemes, isHindi = true }) {
  const [acres, setAcres] = useState(3)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => setMounted(true), [])

  const totalYield = acres * cropProfit.yieldPerAcre
  const totalCost = acres * cropProfit.costPerAcre
  const grossIncome = totalYield * cropProfit.pricePerQuintal
  const netProfit = grossIncome - totalCost

  const COST_BREAKDOWN = isHindi ? [
    { name: 'बीज', value: 8, color: '#4CAF50' },
    { name: 'खाद', value: 25, color: '#FF9800' },
    { name: 'मजदूरी', value: 30, color: '#F44336' },
    { name: 'सिंचाई', value: 15, color: '#2196F3' },
    { name: 'दवाई', value: 12, color: '#9C27B0' },
    { name: 'अन्य', value: 10, color: '#607D8B' }
  ] : [
    { name: 'Seeds', value: 8, color: '#4CAF50' },
    { name: 'Fertilizer', value: 25, color: '#FF9800' },
    { name: 'Labour', value: 30, color: '#F44336' },
    { name: 'Irrigation', value: 15, color: '#2196F3' },
    { name: 'Pesticide', value: 12, color: '#9C27B0' },
    { name: 'Other', value: 10, color: '#607D8B' }
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Cost Input & Schemes */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#1B5E20]/5 rounded-bl-[100px] pointer-events-none"></div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-6">{isHindi ? 'मुनाफा कैलकुलेटर' : 'Profit Calculator'}</h3>
          
          <label className="block text-sm font-bold text-gray-600 mb-2">
            {isHindi ? 'आपके खेत का आकार (एक्ड़)' : 'How many acres is your farm?'}
          </label>
          <div className="flex items-center gap-4 mb-8">
            <input 
              type="range" 
              min="1" 
              max="20" 
              value={acres} 
              onChange={(e) => setAcres(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1B5E20]"
            />
            <div className="bg-[#F1F8F1] text-[#1B5E20] px-4 py-2 rounded-xl text-xl font-black min-w-[3rem] text-center border border-[#1B5E20]/20">
              {acres}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-gray-500 font-medium">{isHindi ? 'कुल संभावित उपज' : 'Total Yield'}</span>
              <span className="font-bold text-gray-900">{totalYield.toLocaleString('en-IN')} {isHindi ? 'क्विंटल' : 'Quintals'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-gray-500 font-medium">{isHindi ? 'कुल लागत' : 'Total Cost'}</span>
              <span className="font-bold text-red-600">- ₹{totalCost.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-gray-500 font-medium">{isHindi ? 'कुल आमदनी' : 'Total Revenue'}</span>
              <span className="font-bold text-blue-600">+ ₹{grossIncome.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center pt-2 mt-4 bg-[#F1F8F1] -mx-6 -mb-6 px-6 pb-6 rounded-b-[24px]">
              <span className="text-[#1B5E20] font-black text-lg mt-4">{isHindi ? 'शुद्ध मुनाफा' : 'Net Profit'}</span>
              <span className="font-black text-3xl text-[#1B5E20] mt-4">₹{netProfit.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* MSP & Schemes */}
        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-amber-900">
              {isHindi ? 'सरकारी खरीद उपलब्ध: हाँ' : 'Govt Procurement Available: Yes'}
            </h4>
            <span className="bg-amber-500 text-white font-black px-3 py-1 rounded-lg">₹{msp}/q</span>
          </div>
          <div className="pt-4 border-t border-amber-200/50">
            <h5 className="font-bold text-xs text-amber-900/50 uppercase tracking-widest mb-3">
              {isHindi ? 'उपलब्ध योजनाएं' : 'Available Schemes'}
            </h5>
            <div className="flex flex-wrap gap-2">
              {schemes.map((scheme, idx) => (
                <span key={idx} className="bg-white border border-amber-200 text-amber-800 px-3 py-1 rounded-full text-xs font-bold">
                  {scheme}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Cost Breakdown Chart */}
      <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col h-full">
        <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">
          {isHindi ? 'प्रति एकड़ लागत विवरण' : 'Cost Breakdown per Acre'}
        </h3>
        {mounted && (
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={COST_BREAKDOWN}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
                >
                  {COST_BREAKDOWN.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `${value}%`}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}
