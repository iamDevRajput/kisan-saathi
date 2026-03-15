// pages/experts/booking/[id].js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Video, Mic, MessageCircle, FileText, Image as ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import BookingCalendar from '../../../src/components/experts/BookingCalendar';

export default function BookingFlow() {
  const router = useRouter();
  const { id, type = 'VIDEO', date = null } = router.query;
  
  const [lang, setLang] = useState('en');
  const [step, setStep] = useState(1);
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    date: date ? new Date(date) : null,
    timeSlot: '',
    duration: 30,
    type: type.toUpperCase(),
    topic: '',
    cropConcern: '',
    notes: ''
  });

  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('kisansaathi_lang');
    if (saved) setLang(saved);
  }, []);

  useEffect(() => {
    if (id) fetchExpertDetails();
  }, [id]);

  useEffect(() => {
    if (formData.date && expert) {
      fetchAvailableSlots(formData.date);
    }
  }, [formData.date, expert]);

  const fetchExpertDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/experts/${id}`);
      const json = await res.json();
      if (json.success) setExpert(json.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load expert details');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async (selectedDate) => {
    setSlotsLoading(true);
    try {
      const dString = selectedDate.toISOString();
      const res = await fetch(`/api/experts/available-slots?expertId=${id}&date=${dString}`);
      const json = await res.json();
      if (json.success) {
        setAvailableSlots(json.data);
        if (!json.data.includes(formData.timeSlot)) {
          setFormData(prev => ({ ...prev, timeSlot: '' })); // Reset slot if not available on new date
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleBook = async () => {
    if (!formData.date || !formData.timeSlot || !formData.topic) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      let amount = 0;
      if (!expert.isKVK) {
        if (formData.type === 'VIDEO') amount = expert.pricePerCall;
        if (formData.type === 'VOICE') amount = Math.floor(expert.pricePerCall * 0.8);
        if (formData.type === 'CHAT') amount = expert.pricePerChat;
      }

      const res = await fetch('/api/experts/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expertId: id,
          ...formData,
          amount
        })
      });
      
      const json = await res.json();
      
      if (json.success) {
        setBookingSuccess(true);
      } else {
        toast.error(json.message || 'Booking failed');
      }
    } catch (error) {
      console.error(error);
      toast.error('Booking failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isHi = lang === 'hi';

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!expert) return <div>Expert not found</div>;

  // Calculate Price
  let currentPrice = 0;
  if (!expert.isKVK) {
    if (formData.type === 'VIDEO') currentPrice = expert.pricePerCall;
    if (formData.type === 'VOICE') currentPrice = Math.floor(expert.pricePerCall * 0.8);
    if (formData.type === 'CHAT') currentPrice = expert.pricePerChat;
  }
  const platformFee = currentPrice > 0 ? 9 : 0;
  const totalAmount = currentPrice + platformFee;

  // Success Screen
  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-4 font-sans">
        <Head><title>Booking Confirmed | KisanSaathi</title></Head>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-green-100 text-center"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 size={48} className="text-green-600" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed! 🎉</h2>
          <p className="text-gray-600 mb-6">
            Your session with <span className="font-bold text-gray-900">{isHi ? expert.nameHindi : expert.name}</span> has been confirmed.
          </p>

          <div className="bg-gray-50 rounded-xl p-4 text-left mb-8 border border-gray-100">
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Date & Time</span>
              <span className="font-medium">{formData.date?.toLocaleDateString()} • {formData.timeSlot}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Session Type</span>
              <span className="font-medium capitalize">{formData.type.toLowerCase()} Call ({formData.duration} mins)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Topic</span>
              <span className="font-medium line-clamp-1 max-w-[50%]">{formData.topic}</span>
            </div>
          </div>

          <div className="space-y-3">
            <button 
              onClick={() => router.push('/experts/my-sessions')}
              className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition"
            >
              Go to My Sessions
            </button>
            <button 
              onClick={() => router.push('/experts')}
              className="w-full py-3 bg-white text-gray-600 rounded-xl font-medium border border-gray-200 hover:bg-gray-50 transition"
            >
              Back to Expert Directory
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const topics = [
    { id: 'disease', label: isHi ? 'फसल की बीमारी / कीट' : 'Pest/Disease Problem' },
    { id: 'soil', label: isHi ? 'मिट्टी की जांच / खाद' : 'Soil/Fertilizer Issue' },
    { id: 'irrigation', label: isHi ? 'सिंचाई की समस्या' : 'Irrigation Issue' },
    { id: 'market', label: isHi ? 'मंडी भाव / बिक्री' : 'Market Price Advice' },
    { id: 'scheme', label: isHi ? 'सरकारी योजना' : 'Government Scheme' },
    { id: 'other', label: isHi ? 'अन्य' : 'Other' }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF8] pb-24 font-sans">
      <Head>
        <title>Book Session | KisanSaathi</title>
      </Head>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-4">
          <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-900"><ArrowLeft size={24} /></button>
          <h1 className="font-bold text-lg text-gray-900">{isHi ? 'परामर्श बुक करें' : 'Book Consultation'}</h1>
        </div>
        
        {/* Progress Bar */}
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 -z-10 h-0.5 bg-gray-200 -translate-y-1/2"></div>
            <div className="absolute left-0 top-1/2 -z-10 h-0.5 bg-green-600 -translate-y-1/2 transition-all duration-300" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
            
            {[1,2,3].map(i => (
              <div key={i} className="flex flex-col items-center gap-2 bg-white px-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 transition-colors ${step >= i ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                  {step > i ? <CheckCircle2 size={16} /> : i}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${step >= i ? 'text-green-800' : 'text-gray-400'}`}>
                  {i === 1 ? 'Schedule' : i === 2 ? 'Details' : 'Payment'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        
        {/* Expert Mini Profile */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-4 shadow-sm mb-6">
          <img src={expert.avatar} alt="Expert" className="w-16 h-16 rounded-xl object-cover" />
          <div>
            <h3 className="font-bold text-gray-900">{isHi ? expert.nameHindi : expert.name}</h3>
            <p className="text-sm text-green-700 font-medium">{isHi ? expert.titleHindi : expert.title}</p>
          </div>
        </div>

        {/* STEP 1: Date & Time */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="space-y-6">
              
              {/* Call Type Selection */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3">{isHi ? 'माध्यम चुनें' : 'Select Mode'}</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <label className={`cursor-pointer border-2 rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-colors ${formData.type === 'VIDEO' ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-200'}`}>
                    <input type="radio" name="type" className="sr-only" checked={formData.type === 'VIDEO'} onChange={() => setFormData({...formData, type: 'VIDEO'})} />
                    <Video size={24} className={formData.type === 'VIDEO' ? 'text-green-600' : 'text-gray-400'} />
                    <span className={`text-sm font-semibold ${formData.type === 'VIDEO' ? 'text-green-800' : 'text-gray-600'}`}>Video Call</span>
                  </label>
                  <label className={`cursor-pointer border-2 rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-colors ${formData.type === 'VOICE' ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-200'}`}>
                    <input type="radio" name="type" className="sr-only" checked={formData.type === 'VOICE'} onChange={() => setFormData({...formData, type: 'VOICE'})} />
                    <Mic size={24} className={formData.type === 'VOICE' ? 'text-green-600' : 'text-gray-400'} />
                    <span className={`text-sm font-semibold ${formData.type === 'VOICE' ? 'text-green-800' : 'text-gray-600'}`}>Voice Call</span>
                  </label>
                  {expert.pricePerChat > 0 && (
                    <label className={`cursor-pointer border-2 rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-colors ${formData.type === 'CHAT' ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-200'}`}>
                      <input type="radio" name="type" className="sr-only" checked={formData.type === 'CHAT'} onChange={() => setFormData({...formData, type: 'CHAT'})} />
                      <MessageCircle size={24} className={formData.type === 'CHAT' ? 'text-green-600' : 'text-gray-400'} />
                      <span className={`text-sm font-semibold ${formData.type === 'CHAT' ? 'text-green-800' : 'text-gray-600'}`}>Chat Chat</span>
                    </label>
                  )}
                </div>
              </div>

              {/* Calendar */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3">{isHi ? 'तारीख चुनें' : 'Select Date'}</h4>
                <BookingCalendar 
                  availableDays={expert.availability} 
                  onSelectDate={(d) => setFormData({...formData, date: d})} 
                />
              </div>

              {/* Time Slots */}
              {formData.date && (
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-3">{isHi ? 'समय चुनें' : 'Select Time'}</h4>
                  {slotsLoading ? (
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                      {[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-gray-200 animate-pulse rounded-lg"></div>)}
                    </div>
                  ) : availableSlots.length > 0 ? (
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                      {availableSlots.map(slot => (
                        <button
                          key={slot}
                          onClick={() => setFormData({...formData, timeSlot: slot})}
                          className={`py-2 px-1 text-sm font-medium rounded-lg border-2 transition-all ${
                            formData.timeSlot === slot 
                              ? 'bg-green-600 border-green-600 text-white shadow-md' 
                              : 'bg-white border-gray-200 text-gray-700 hover:border-green-300'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 text-gray-500 rounded-lg text-sm text-center border border-gray-100">
                      {isHi ? 'इस दिन कोई समय उपलब्ध नहीं है।' : 'No slots available on this date.'}
                    </div>
                  )}
                </div>
              )}

              <button 
                disabled={!formData.date || !formData.timeSlot}
                onClick={() => setStep(2)}
                className="w-full py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isHi ? 'आगे बढ़ें' : 'Next Step'}
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Details */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="space-y-6">
              
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  {isHi ? 'आप किस बारे में बात करना चाहते हैं? *' : 'What do you want to discuss? *'}
                </label>
                <select 
                  className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-green-500 transition-colors"
                  value={formData.topic}
                  onChange={e => setFormData({...formData, topic: e.target.value})}
                >
                  <option value="" disabled>{isHi ? 'विषय चुनें...' : 'Select a topic...'}</option>
                  {topics.map(t => <option key={t.id} value={t.label}>{t.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  {isHi ? 'कौन सी फसल? (वैकल्पिक)' : 'Which crop? (Optional)'}
                </label>
                <select 
                  className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-green-500 transition-colors"
                  value={formData.cropConcern}
                  onChange={e => setFormData({...formData, cropConcern: e.target.value})}
                >
                  <option value="">{isHi ? 'लागू नहीं / सभी' : 'Not Applicable / All'}</option>
                  {expert.crops.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  {isHi ? 'समस्या का पूरा विवरण दें (वैकल्पिक)' : 'Describe your problem in detail (Optional)'}
                </label>
                <textarea 
                  rows={4}
                  className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-green-500 transition-colors resize-none"
                  placeholder={isHi ? 'अपनी भाषा में टाइप करें...' : 'Type your problem here...'}
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                ></textarea>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-sm text-blue-800">
                <AlertCircle size={20} className="shrink-0 text-blue-500" />
                <p>{isHi ? 'आप कॉल के दौरान विशेषज्ञ को अपने खेत या फसल की लाइव वीडियो दिखा सकते हैं।' : 'You can show your farm or crop live on camera during the consultation.'}</p>
              </div>

              <button 
                disabled={!formData.topic}
                onClick={() => setStep(3)}
                className="w-full py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isHi ? 'सारांश देखें' : 'Review & Pay'}
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Confirm & Pay */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm mb-6">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="font-bold text-gray-900">{isHi ? 'बुकिंग सारांश' : 'Booking Summary'}</h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 flex items-center gap-2"><Calendar size={16} /> Date</span>
                  <span className="font-semibold text-gray-900">{formData.date?.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 flex items-center gap-2"><Clock size={16} /> Time</span>
                  <span className="font-semibold text-gray-900">{formData.timeSlot} ({formData.duration} mins)</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-4">
                  <span className="text-gray-500 flex items-center gap-2"><Video size={16} /> Type</span>
                  <span className="font-semibold text-gray-900 capitalize">{formData.type.toLowerCase()} Call</span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-gray-600">Consultation Fee</span>
                  <span className="font-medium">₹{currentPrice}</span>
                </div>
                {currentPrice > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 text-xs">Platform Fee</span>
                    <span className="font-medium text-gray-600">₹{platformFee}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-4">
                  <span className="font-bold text-gray-900">Total Amount</span>
                  <span className="font-black text-2xl text-green-700">
                    {totalAmount === 0 ? 'FREE' : `₹${totalAmount}`}
                  </span>
                </div>
              </div>
            </div>

            {totalAmount > 0 ? (
              <div className="space-y-4">
                <h4 className="font-bold text-gray-900 text-sm px-2">Select Payment Method</h4>
                <div className="grid grid-cols-3 gap-3">
                  <button className="bg-white border-2 border-green-600 rounded-xl p-3 flex flex-col items-center gap-2 font-medium text-green-800">
                    UPId
                  </button>
                  <button className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col items-center gap-2 font-medium text-gray-600 opacity-50">
                    Cards
                  </button>
                  <button className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col items-center gap-2 font-medium text-gray-600 opacity-50">
                    NetBanking
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex gap-3 text-sm text-green-800">
                <CheckCircle2 size={24} className="shrink-0 text-green-600" />
                <div>
                  <p className="font-bold mb-1">Free KVK Service</p>
                  <p>This session is completely free as part of government farmer welfare initiatives.</p>
                </div>
              </div>
            )}

            <button 
              disabled={isSubmitting}
              onClick={handleBook}
              className="w-full mt-8 py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 disabled:opacity-70 transition flex justify-center items-center gap-2 shadow-lg shadow-green-600/20"
            >
              {isSubmitting ? (
                <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Processing...</>
              ) : (
                <>{totalAmount > 0 ? `Pay ₹${totalAmount} & Book` : 'Confirm Free Booking'}</>
              )}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
