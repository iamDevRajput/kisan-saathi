// pages/experts/my-sessions.js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Video, Mic, MessageCircle, Star, PhoneOff, CheckCircle2, ChevronRight, Download } from 'lucide-react';
import toast from 'react-hot-toast';

import CallInterface from '../../src/components/experts/CallInterface';
import RatingStars from '../../src/components/experts/RatingStars';

export default function MySessions() {
  const router = useRouter();
  const { ended } = router.query;
  const [lang, setLang] = useState('en');
  const [activeTab, setActiveTab] = useState('upcoming');
  const [sessions, setSessions] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);
  
  const [activeCall, setActiveCall] = useState(null);
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('kisansaathi_lang');
    if (saved) setLang(saved);
    fetchSessions();

    if (ended === 'true') {
      toast.success('Call ended successfully');
      router.replace('/experts/my-sessions', undefined, { shallow: true });
    }
  }, [ended]);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/experts/sessions');
      const json = await res.json();
      
      if (json.success) {
        const now = new Date();
        const upcoming = json.data.filter(s => ['PENDING', 'CONFIRMED', 'IN_PROGRESS'].includes(s.status) && new Date(s.date) >= new Date(new Date().setHours(0,0,0,0)));
        const past = json.data.filter(s => ['COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(s.status) || new Date(s.date) < new Date(new Date().setHours(0,0,0,0)));
        
        setSessions({ upcoming, past });
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCall = (session) => {
    setActiveCall(session);
  };

  const submitReview = async () => {
    if (!reviewModal || !reviewRating) return;
    try {
      const payload = {
        bookingId: reviewModal.id,
        rating: reviewRating,
        reviewText,
        reviewTextHindi: reviewText // Minimal implementation for demo
      };

      const res = await fetch('/api/experts/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const json = await res.json();
      if (json.success) {
        toast.success('Review submitted successfully');
        setReviewModal(null);
        fetchSessions(); // Refresh data
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit review');
    }
  };

  const isHi = lang === 'hi';

  if (activeCall) {
    return <CallInterface booking={activeCall} onClose={() => setActiveCall(null)} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAF8] pb-24 font-sans">
      <Head>
        <title>{isHi ? 'मेरे सत्र | किसान साथी' : 'My Sessions | KisanSaathi'}</title>
      </Head>

      <div className="bg-[#1B5E20] pt-6 pb-20 px-4 relative">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">{isHi ? 'मेरे परामर्श सत्र' : 'My Consultations'}</h1>
            <button 
              onClick={() => router.push('/experts')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-medium backdrop-blur-sm transition-colors"
            >
              {isHi ? 'नया बुक करें' : 'Book New'}
            </button>
          </div>
          <p className="text-green-100 mt-2">{isHi ? 'अपने आगामी और पिछले सत्र देखें' : 'Manage your upcoming and past expert sessions'}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-10 relative z-10">
        
        {/* User Stats Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 flex gap-6 md:gap-12 items-center justify-between md:justify-start overflow-x-auto">
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm font-medium">{isHi ? 'कुल सत्र' : 'Total Sessions'}</span>
            <span className="text-3xl font-bold text-gray-900">{sessions.past.length + sessions.upcoming.length}</span>
          </div>
          <div className="w-px h-12 bg-gray-200"></div>
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm font-medium">{isHi ? 'आने वाले' : 'Upcoming'}</span>
            <span className="text-3xl font-bold text-green-600">{sessions.upcoming.length}</span>
          </div>
          <div className="w-px h-12 bg-gray-200"></div>
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm font-medium">{isHi ? 'बचत' : 'Money Saved'}</span>
            <span className="text-xl font-bold text-amber-600 mt-1">₹450</span>
            <span className="text-[10px] text-amber-600 font-medium">via KVK Free Calls</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl bg-gray-200 p-1 mb-6">
          <button 
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'upcoming' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {isHi ? `आगामी (${sessions.upcoming.length})` : `Upcoming (${sessions.upcoming.length})`}
          </button>
          <button 
            onClick={() => setActiveTab('past')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'past' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {isHi ? `पिछले (${sessions.past.length})` : `Past (${sessions.past.length})`}
          </button>
        </div>

        {/* Sessions List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <div key={i} className="h-40 bg-gray-100 rounded-2xl animate-pulse"></div>)}
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {sessions[activeTab].map(session => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={session.id} 
                  className={`bg-white rounded-2xl p-5 md:p-6 border transition-all hover:shadow-md ${session.status === 'CONFIRMED' && activeTab === 'upcoming' ? 'border-green-200 shadow-sm shadow-green-100' : 'border-gray-100'}`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    
                    {/* Left: Expert & DateTime */}
                    <div className="flex gap-4">
                      <div className="relative">
                        <img src={session.expert.avatar} alt={session.expert.name} className="w-16 h-16 rounded-xl object-cover bg-gray-100" />
                        {session.type === 'VIDEO' && <div className="absolute -bottom-2 -right-2 bg-green-500 p-1.5 rounded-lg text-white border-2 border-white shadow-sm"><Video size={14} /></div>}
                        {session.type === 'VOICE' && <div className="absolute -bottom-2 -right-2 bg-blue-500 p-1.5 rounded-lg text-white border-2 border-white shadow-sm"><Mic size={14} /></div>}
                        {session.type === 'CHAT' && <div className="absolute -bottom-2 -right-2 bg-purple-500 p-1.5 rounded-lg text-white border-2 border-white shadow-sm"><MessageCircle size={14} /></div>}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${session.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : session.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                            {session.status}
                          </span>
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{isHi ? session.expert.nameHindi : session.expert.name}</h3>
                        <p className="text-sm text-gray-500 mb-3">{isHi ? session.expert.titleHindi : session.expert.title}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                          <div className="flex items-center gap-1.5 text-green-700 bg-green-50 px-2 py-1 rounded-lg">
                            <Calendar size={16} />
                            {new Date(session.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                          </div>
                          <div className="flex items-center gap-1.5 text-blue-700 bg-blue-50 px-2 py-1 rounded-lg">
                            <Clock size={16} />
                            {session.timeSlot}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex md:flex-col gap-2 md:items-end w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                      {activeTab === 'upcoming' ? (
                        <>
                          <button 
                            onClick={() => handleJoinCall(session)}
                            className="flex-1 md:flex-none px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-colors shadow-sm"
                          >
                            {isHi ? 'कॉल में जुड़ें' : 'Join Call'}
                          </button>
                          <button className="flex-1 md:flex-none px-4 py-3 bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 rounded-xl font-medium transition-colors">
                            {isHi ? 'बदलें / रद्द करें' : 'Reschedule'}
                          </button>
                        </>
                      ) : (
                        <>
                          {session.status === 'COMPLETED' ? (
                            <>
                              {!session.review ? (
                                <button 
                                  onClick={() => setReviewModal(session)}
                                  className="flex-1 md:flex-none px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
                                >
                                  <Star size={16} className="fill-white" /> {isHi ? 'समीक्षा दें' : 'Leave Review'}
                                </button>
                              ) : (
                                <div className="flex-1 flex flex-col items-center md:items-end p-2 bg-gray-50 rounded-xl border border-gray-100">
                                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Your Rating</span>
                                  <RatingStars rating={session.review.rating} size={14} />
                                </div>
                              )}
                              <button className="flex-1 md:flex-none px-4 py-3 bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                                <Download size={16} /> {isHi ? 'पर्चे' : 'Prescription'}
                              </button>
                            </>
                          ) : (
                            <button className="flex-1 md:flex-none px-6 py-3 bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 rounded-xl font-medium transition-colors">
                              {isHi ? 'दोबारा बुक करें' : 'Book Again'}
                            </button>
                          )}
                        </>
                      )}
                    </div>

                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {sessions[activeTab].length === 0 && (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🗓️</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {activeTab === 'upcoming' 
                    ? (isHi ? 'कोई आगामी सत्र नहीं' : 'No upcoming sessions') 
                    : (isHi ? 'कोई पिछला सत्र नहीं' : 'No past sessions')}
                </h3>
                <p className="text-gray-500 mb-6">
                  {isHi ? 'विशेषज्ञों से बात करके अपनी खेती की समस्याओं का समाधान पाएं।' : 'Book a consultation to get expert advice on your farming problems.'}
                </p>
                <button 
                  onClick={() => router.push('/experts')}
                  className="px-6 py-3 bg-green-600 text-white font-bold rounded-xl"
                >
                  {isHi ? 'विशेषज्ञ खोजें' : 'Find an Expert'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">{isHi ? 'रेटिंग और समीक्षा' : 'Rate & Review'}</h3>
            <p className="text-sm text-gray-500 mb-6">
              {isHi ? `डॉ ${reviewModal.expert.nameHindi} के साथ आपका अनुभव कैसा रहा?` : `How was your consultation with ${reviewModal.expert.name}?`}
            </p>

            <div className="flex justify-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star}
                  onClick={() => setReviewRating(star)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star size={40} className={`transition-colors ${star <= reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                </button>
              ))}
            </div>

            <textarea 
              rows={4}
              placeholder={isHi ? 'आपका अनुभव कैसा रहा? क्या विशेषज्ञ ने आपकी समस्या का समाधान किया?' : 'Tell us about your experience. Did the expert help solve your problem?'}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800 text-sm focus:outline-none focus:border-green-500 focus:bg-white transition-all resize-none mb-6"
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
            ></textarea>

            <div className="flex gap-3">
              <button 
                onClick={() => setReviewModal(null)}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
              >
                {isHi ? 'रद्द करें' : 'Cancel'}
              </button>
              <button 
                onClick={submitReview}
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors shadow-sm"
              >
                {isHi ? 'सबमिट करें' : 'Submit Review'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
