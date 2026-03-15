// pages/experts/[id].js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ArrowLeft, CheckCircle2, Clock, MapPin, MessageCircle, Phone, Video, Calendar, ThumbsUp, ChevronRight } from 'lucide-react';
import RatingStars from '../../src/components/experts/RatingStars';
import ExpertBadge from '../../src/components/experts/ExpertBadge';
import BookingCalendar from '../../src/components/experts/BookingCalendar';
import ExpertCard from '../../src/components/experts/ExpertCard';

export default function ExpertProfile() {
  const router = useRouter();
  const { id } = router.query;
  const [lang, setLang] = useState('en');
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('kisansaathi_lang');
    if (saved) setLang(saved);
  }, []);

  useEffect(() => {
    if (id) fetchExpertDetails();
  }, [id]);

  const fetchExpertDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/experts/${id}`);
      const json = await res.json();
      if (json.success) {
        setExpert(json.data);
      }
    } catch (error) {
      console.error('Failed to fetch expert details', error);
    } finally {
      setLoading(false);
    }
  };

  const isHi = lang === 'hi';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!expert) {
    return <div className="p-8 text-center text-gray-500">Expert not found</div>;
  }

  const name = isHi ? expert.nameHindi : expert.name;
  const title = isHi ? expert.titleHindi : expert.title;
  const about = isHi ? expert.aboutHindi : expert.about;

  const tabs = [
    { id: 'about', label: isHi ? 'परिचय' : 'About' },
    { id: 'reviews', label: isHi ? `समीक्षाएं (${expert.ratingCount})` : `Reviews (${expert.ratingCount})` },
    { id: 'availability', label: isHi ? 'उपलब्धता' : 'Availability' },
    { id: 'pricing', label: isHi ? 'कीमत' : 'Pricing' }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF8] pb-24 font-sans">
      <Head>
        <title>{name} | Expert Connect</title>
      </Head>

      {/* Top Banner & Profile Header */}
      <div className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] pt-6 pb-20 px-4 relative">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => router.push('/experts')}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8 text-sm font-medium"
          >
            <ArrowLeft size={18} /> {isHi ? 'वापस जाएं' : 'Back to Experts'}
          </button>

          <div className="flex flex-col md:flex-row gap-6 md:items-end">
            <div className="relative">
              <img 
                src={expert.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=256`} 
                alt={name}
                className="w-28 h-28 md:w-36 md:h-36 rounded-2xl object-cover border-4 border-white shadow-xl bg-white"
              />
              {expert.isOnline && (
                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full border-2 border-white shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                  ONLINE
                </div>
              )}
            </div>
            
            <div className="flex-1 text-white">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold">{name}</h1>
                {expert.isVerified && <CheckCircle2 size={24} className="text-blue-400 fill-white" />}
                {expert.isKVK && <ExpertBadge type="KVK_FREE" className="ml-2" />}
              </div>
              <p className="text-green-100 text-lg mb-1">{title}</p>
              <div className="flex items-center gap-2 text-green-50/80 text-sm mb-4">
                <MapPin size={16} /> {expert.district}, {expert.state}
                <span className="mx-2">•</span>
                {expert.organization}
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm bg-black/20 backdrop-blur-sm p-3 rounded-xl inline-flex">
                <div className="flex items-center gap-2 pr-4 border-r border-white/20">
                  <RatingStars rating={expert.rating} size={16} />
                  <span className="font-bold">{expert.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-2 pr-4 border-r border-white/20">
                  <Phone size={16} className="opacity-80" />
                  <span className="font-medium">{expert.totalSessions} {isHi ? 'सत्र' : 'sessions'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="opacity-80" />
                  <span className="font-medium">{expert.avgResponseTime} {isHi ? 'में जवाब' : 'response'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-10 flex flex-col md:flex-row gap-6">
        
        {/* Main Content Area */}
        <div className="flex-1">
          
          {/* Tabs */}
          <div className="bg-white rounded-t-2xl border-b border-gray-200 px-4 md:px-8 flex overflow-x-auto no-scrollbar shadow-sm">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-none py-4 px-4 font-bold text-sm border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-b-2xl shadow-sm p-6 md:p-8 min-h-[400px]">
            {/* About Tab */}
            {activeTab === 'about' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{isHi ? 'परिचय' : 'About Expert'}</h3>
                  <p className="text-gray-600 leading-relaxed">{about}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{isHi ? 'विशेषज्ञता' : 'Specializations'}</h3>
                    <div className="flex flex-wrap gap-2">
                      {expert.specializations.map(s => (
                        <span key={s} className="bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-green-100">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{isHi ? 'फसलें' : 'Crops Covered'}</h3>
                    <div className="flex flex-wrap gap-2">
                      {expert.crops.map(c => (
                        <span key={c} className="bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-amber-100 flex items-center gap-1.5">
                          🌾 <span className="capitalize">{c}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {expert.achievements?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">{isHi ? 'उपलब्धियां' : 'Achievements'}</h3>
                    <div className="space-y-3">
                      {expert.achievements.map((ach, i) => (
                        <div key={i} className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <div className="bg-yellow-100 p-2 rounded-full text-xl mt-0.5">🏆</div>
                          <p className="text-gray-800 font-medium">{ach}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
                  <h3 className="font-bold text-blue-900 mb-2">{isHi ? 'योग्यताएं' : 'Qualifications'}</h3>
                  <div className="flex items-start gap-2 text-blue-800 text-sm">
                    <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
                    <p>{expert.qualification}</p>
                  </div>
                  <div className="flex items-start gap-2 text-blue-800 text-sm mt-3">
                    <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
                    <p>{expert.experience} {isHi ? 'वर्षों का व्यावहारिक अनुभव' : 'Years of practical experience'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8">
                  <div className="text-center shrink-0">
                    <div className="text-4xl font-black text-gray-900 mb-1">{expert.rating.toFixed(1)}</div>
                    <RatingStars rating={expert.rating} size={20} />
                    <div className="text-sm text-gray-500 mt-2">{expert.ratingCount} {isHi ? 'समीक्षाएं' : 'reviews'}</div>
                  </div>
                  <div className="w-px h-20 bg-gray-200 hidden md:block"></div>
                  <div className="flex-1 space-y-2 w-full">
                    {[5,4,3,2,1].map(star => (
                      <div key={star} className="flex items-center gap-3 text-sm">
                        <div className="w-4 font-medium text-gray-600">{star}</div>
                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                        <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400 rounded-full" style={{ width: star === 5 ? '78%' : star === 4 ? '18%' : '4%' }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {expert.reviews?.length > 0 ? expert.reviews.map(review => (
                    <div key={review.id} className="pb-6 border-b border-gray-100 last:border-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                            {review.userId.substring(0,1).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">Farmer User</p>
                            <RatingStars rating={review.rating} size={12} />
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-700 mt-3">{isHi && review.reviewHindi ? review.reviewHindi : review.review}</p>
                      <button className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-green-600 mt-4 px-3 py-1.5 bg-gray-50 rounded-lg transition-colors">
                        <ThumbsUp size={14} /> Helpful
                      </button>
                    </div>
                  )) : (
                    <p className="text-center text-gray-500 py-8">No reviews yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* Availability Tab */}
            {activeTab === 'availability' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-lg font-bold text-gray-900 mb-6">{isHi ? 'कॉल बुक करने के लिए एक दिन चुनें' : 'Select a day to book a call'}</h3>
                <BookingCalendar 
                  availableDays={expert.availability} 
                  onSelectDate={(d) => {
                    setSelectedDate(d);
                    router.push(`/experts/booking/${expert.id}?date=${d.toISOString()}`);
                  }} 
                />
              </div>
            )}

            {/* Pricing Tab */}
            {activeTab === 'pricing' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {expert.isKVK ? (
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-2xl border border-amber-200">
                    <div className="flex items-center gap-3 mb-2">
                      <ExpertBadge type="KVK_FREE" />
                      <h3 className="font-bold text-amber-900 text-lg">Government Provided Service</h3>
                    </div>
                    <p className="text-amber-800/80 mb-6">As a KVK verified expert, all consultations are completely free of charge for farmers.</p>
                    
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="flex items-center justify-between font-medium">
                        <div className="flex items-center gap-3"><Video size={20} className="text-green-600" /> Video Call (30 mins)</div>
                        <div className="text-green-600 font-bold">FREE</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">{isHi ? 'परामर्श शुल्क' : 'Consultation Fees'}</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-4 rounded-xl border-2 border-green-600 bg-green-50 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-lg text-green-700"><Video size={20} /></div>
                          <div>
                            <p className="font-bold text-gray-900">Video Call</p>
                            <p className="text-xs text-gray-500">Recommended • 30 mins</p>
                          </div>
                        </div>
                        <div className="font-bold text-xl text-green-700">₹{expert.pricePerCall}</div>
                      </div>

                      <div className="flex justify-between items-center p-4 rounded-xl border border-gray-200 bg-white">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-100 rounded-lg text-gray-700"><Phone size={20} /></div>
                          <div>
                            <p className="font-bold text-gray-900">Voice Call</p>
                            <p className="text-xs text-gray-500">30 mins</p>
                          </div>
                        </div>
                        <div className="font-bold text-xl text-gray-900">₹{expert.pricePerCall > 0 ? Math.floor(expert.pricePerCall * 0.8) : 0}</div>
                      </div>

                      {expert.pricePerChat > 0 && (
                        <div className="flex justify-between items-center p-4 rounded-xl border border-gray-200 bg-white">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg text-gray-700"><MessageCircle size={20} /></div>
                            <div>
                              <p className="font-bold text-gray-900">Message Chat</p>
                              <p className="text-xs text-gray-500">1 hour valid</p>
                            </div>
                          </div>
                          <div className="font-bold text-xl text-gray-900">₹{expert.pricePerChat}</div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Sticky Booking Widget */}
        <div className="w-full md:w-80 shrink-0">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
            <div className="text-center mb-6">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-2">{isHi ? 'परामर्श शुल्क' : 'Consultation Fee'}</p>
              {expert.isKVK ? (
                <div className="text-4xl font-black text-green-600 mb-1">FREE</div>
              ) : (
                <div className="text-4xl font-black text-gray-900 mb-1">₹{expert.pricePerCall}</div>
              )}
              <p className="text-gray-500 text-sm">/ {isHi ? '30 मिनट का वीडियो कॉल' : '30 min video session'}</p>
            </div>

            <button
              onClick={() => router.push(`/experts/booking/${expert.id}`)}
              className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-green-600/30 transition-all active:scale-95 flex items-center justify-center gap-2 mb-3"
            >
              <Video size={20} /> {isHi ? 'कॉल बुक करें' : 'Book Video Call'}
            </button>
            
            {expert.pricePerChat > 0 && (
              <button
                onClick={() => router.push(`/experts/booking/${expert.id}?type=CHAT`)}
                className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-800 rounded-xl font-semibold border border-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} /> {isHi ? 'चैट बुक करें' : 'Book Chat'} (₹{expert.pricePerChat})
              </button>
            )}

            <div className="mt-6 pt-6 border-t border-gray-100 text-sm text-gray-500 space-y-3">
              <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> Secure SSL payment</div>
              <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> 100% money back guarantee</div>
              <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> Free cancellation before 2hrs</div>
            </div>
          </div>
        </div>

      </div>

      {/* Similar Experts */}
      {expert.similarExperts?.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 mt-16 pb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{isHi ? 'समान विशेषज्ञ' : 'Similar Experts'}</h2>
            <button onClick={() => router.push('/experts')} className="text-green-600 font-medium text-sm flex items-center">
              {isHi ? 'सभी देखें' : 'View all'} <ChevronRight size={16} />
            </button>
          </div>
          <div className="flex overflow-x-auto gap-6 pb-4 no-scrollbar snap-x">
            {expert.similarExperts.map(sim => (
              <div key={sim.id} className="min-w-[300px] snap-start">
                <ExpertCard expert={sim} lang={lang} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
