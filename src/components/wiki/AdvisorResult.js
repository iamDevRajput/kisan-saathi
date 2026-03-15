'use client'
import React, { memo } from 'react'
import Link from 'next/link'

const AdvisorResult = memo(({ result, isHindi }) => {
  if (!result || !result.recommendations) return null

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {isHindi ? 'AI विश्लेषण निष्कर्ष' : 'AI Analysis Summary'}
        </h3>
        <p className="text-gray-700">{isHindi ? result.summaryHindi || result.summary : result.summary}</p>
        {result.weatherNote && (
          <div className="mt-4 bg-blue-50 text-blue-800 p-3 rounded-xl text-sm flex gap-2">
            <span>🌦️</span> <span>{isHindi ? result.weatherNoteHindi || result.weatherNote : result.weatherNote}</span>
          </div>
        )}
      </div>

      <h3 className="text-2xl font-bold text-gray-900">
        {isHindi ? 'सुझाई गई फसलें' : 'Recommended Crops'}
      </h3>

      <div className="space-y-6">
        {result.recommendations.map((rec, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden">
            <div className="bg-green-50 p-4 border-b border-green-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-green-700 shadow-sm">
                  #{rec.rank}
                </div>
                <h4 className="text-xl font-bold text-green-900">
                  {isHindi ? rec.cropNameHindi : rec.cropName}
                </h4>
              </div>
              <div className="text-right">
                <div className="text-sm text-green-600 font-semibold">{isHindi ? 'मैच स्कोर' : 'Match Score'}</div>
                <div className="text-2xl font-black text-green-700">{rec.matchPercent}%</div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <ScoreCard title={isHindi ? 'मिट्टी' : 'Soil'} score={rec.soilScore} />
                <ScoreCard title={isHindi ? 'पानी' : 'Water'} score={rec.waterScore} />
                <ScoreCard title={isHindi ? 'मौसम' : 'Season'} score={rec.seasonScore} />
                <ScoreCard title={isHindi ? 'बजट' : 'Budget'} score={rec.budgetScore} />
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h5 className="font-bold text-gray-900 mb-2">
                    {isHindi ? 'यह फसल क्यों?' : 'Why this crop?'}
                  </h5>
                  <ul className="space-y-2">
                    {rec.whyGood.map((reason, i) => (
                      <li key={i} className="flex gap-2 text-gray-700 text-sm">
                        <span className="text-green-500">✓</span> {reason}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  {rec.warnings && rec.warnings.length > 0 && (
                     <>
                      <h5 className="font-bold text-gray-900 mb-2">
                        {isHindi ? 'ध्यान दें (चेतावनियां)' : 'Warnings / Attention'}
                      </h5>
                      <ul className="space-y-2">
                        {rec.warnings.map((warn, i) => (
                          <li key={i} className="flex gap-2 text-gray-700 text-sm">
                            <span className="text-amber-500">⚠️</span> {warn}
                          </li>
                        ))}
                      </ul>
                     </>
                  )}
                  
                  <div className="mt-4 bg-gray-50 p-4 rounded-xl">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">{isHindi ? 'अनुमानित लागत/एकड़' : 'Est. Investment/Acre'}</span>
                      <span className="font-bold text-gray-900">₹{rec.investmentPerAcre}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">{isHindi ? 'अनुमानित लाभ/एकड़' : 'Est. Profit/Acre'}</span>
                      <span className="font-bold text-green-600">₹{rec.profitPerAcre}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                href={`/wiki/${rec.cropSlug || 'wheat'}`}
                className="block w-full text-center bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-colors"
              >
                {isHindi ? 'पूरी जानकारी →' : 'View Full Details →'}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})

const ScoreCard = ({ title, score }) => (
  <div className="bg-gray-50 p-3 rounded-xl text-center">
    <div className="text-sm text-gray-500 mb-1">{title}</div>
    <div className="font-bold text-gray-900">
      {score}/10
    </div>
    <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2">
      <div 
        className="bg-green-500 h-1.5 rounded-full" 
        style={{ width: `${(score / 10) * 100}%` }}
      />
    </div>
  </div>
)

AdvisorResult.displayName = 'AdvisorResult'
export default AdvisorResult
