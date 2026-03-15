// src/components/experts/CallInterface.js
'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Video, VideoOff, MessageSquare, MonitorUp, PhoneOff, X, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CallInterface({ booking }) {
  const router = useRouter();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const endCall = () => {
    router.push('/experts/my-sessions?ended=true');
  };

  return (
    <div className="fixed inset-0 bg-[#0A0A0A] z-50 flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 bg-black/40 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center text-white font-bold">
            K
          </div>
          <div>
            <h2 className="text-white font-medium">Expert Consultation</h2>
            <p className="text-xs text-gray-400">{booking?.expert?.name || 'Dr. Expert'}</p>
          </div>
        </div>
        <div className="px-4 py-1.5 rounded-full bg-white/10 text-white font-mono text-sm tracking-wider">
          <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse" />
          {formatTime(time)}
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 relative flex">
        {/* Video Area */}
        <div className="flex-1 relative p-4 flex gap-4">
          
          {/* Main Remote Video (Mocked) */}
          <div className="flex-1 bg-gray-900 rounded-2xl overflow-hidden relative border border-gray-800 shadow-2xl">
            <img 
              src={booking?.expert?.avatar || `https://ui-avatars.com/api/?name=${booking?.expert?.name || 'Expert'}&background=1B5E20&color=fff&size=512`}
              alt="Expert"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute bottom-6 left-6 flex items-center gap-3">
              <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl text-white font-medium flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                {booking?.expert?.name || 'Expert Name'}
              </div>
            </div>
            
            {/* Mock Connecting animation */}
            {time < 3 && (
              <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                <div className="w-12 h-12 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin mb-4" />
                <p>Connecting to secure line...</p>
              </div>
            )}
          </div>

          {/* Local Video PiP */}
          <motion.div 
            drag
            dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
            className={`absolute bottom-8 right-8 w-48 h-64 bg-gray-800 rounded-xl overflow-hidden border-2 border-gray-700 shadow-xl z-20 transition-all ${isVideoOff ? 'flex items-center justify-center' : ''}`}
          >
            {isVideoOff ? (
              <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-white/50">
                <VideoOff size={24} />
              </div>
            ) : (
              <div className="w-full h-full bg-gray-700 object-cover flex items-center justify-center text-gray-400 text-sm">
                (Your Camera)
              </div>
            )}
            <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-xs text-white">You</div>
          </motion.div>

        </div>

        {/* Sidebar Chat */}
        <AnimatePresence>
          {showChat && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-[#121212] border-l border-gray-800 flex flex-col z-10"
            >
              <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
                <h3 className="text-white font-medium">Meeting Chat</h3>
                <button onClick={() => setShowChat(false)} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                <div className="bg-gray-800/50 rounded-xl p-3 max-w-[85%] text-sm text-gray-200">
                  Welcome to the consultation. You can ask questions or share crop photos here.
                  <span className="block text-xs text-gray-500 mt-1">System • 10:00 AM</span>
                </div>
              </div>

              <div className="p-4 border-t border-gray-800">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Type message..." 
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500"
                  />
                  <button className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700">
                    <Send size={18} />
                  </button>
                </div>
                
                {/* Hindi Quick Replies */}
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
                  {['मुझे समझ नहीं आया', 'कृपया दोबारा बताएं', 'धन्यवाद'].map(text => (
                    <button key={text} className="whitespace-nowrap px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-full text-xs text-gray-300 transition-colors border border-gray-700">
                      {text}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Controls */}
      <div className="h-24 bg-[#121212] border-t border-gray-800 flex items-center justify-center gap-4 px-6 z-10 relative">
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
        >
          {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
        </button>

        <button 
          onClick={() => setIsVideoOff(!isVideoOff)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isVideoOff ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
        >
          {isVideoOff ? <VideoOff size={22} /> : <Video size={22} />}
        </button>

        <button 
          className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-800 text-white hover:bg-gray-700 transition-all hidden sm:flex"
        >
          <MonitorUp size={22} />
        </button>

        <button 
          onClick={() => setShowChat(!showChat)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${showChat ? 'bg-green-600 text-white' : 'bg-gray-800 text-white hover:bg-gray-700'} relative`}
        >
          <MessageSquare size={22} />
          {!showChat && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-[#121212] rounded-full" />
          )}
        </button>

        <div className="w-px h-8 bg-gray-800 mx-2 hidden sm:block" />

        <button 
          onClick={endCall}
          className="px-6 h-12 rounded-full flex items-center justify-center bg-red-600 text-white hover:bg-red-700 transition-all font-medium gap-2 shadow-lg shadow-red-600/20"
        >
          <PhoneOff size={20} />
          <span className="hidden sm:block">End Call</span>
        </button>
      </div>
    </div>
  );
}
