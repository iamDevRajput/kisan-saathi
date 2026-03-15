import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wheat, Phone, Lock, Eye, EyeOff, Facebook } from 'lucide-react'
import { useRouter } from 'next/router'

export default function Login() {
  const [lang, setLang] = useState('hi')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const isHi = lang === 'hi'

  const handleLogin = (e) => {
    e.preventDefault()
    router.push('/dashboard')
  }

  const testimonials = [
    { text: "Crop yield increased by 40%", author: "Ramesh Kumar, Meerut", delay: 0 },
    { text: "Got pest alert just in time", author: "Sunita Devi, Lucknow", delay: 0.2 },
    { text: "Market prices helped earn more", author: "Harpal Singh, Punjab", delay: 0.4 }
  ]

  return (
    <div className="min-h-screen flex text-gray-900 bg-white">
      <Head>
        <title>Login - KisanSaathi</title>
      </Head>

      {/* LEFT SIDE */}
      <div className="hidden lg:flex w-1/2 bg-[#1B5E20] relative overflow-hidden flex-col justify-between p-12 text-white">
        {/* Animated Particles */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              initial={{ 
                x: Math.random() * 800, 
                y: -100,
                rotate: 0,
                opacity: 0.5 
              }}
              animate={{ 
                y: 1000,
                rotate: 360,
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: 'linear'
              }}
            >
              {i % 2 === 0 ? '☀️' : '🍃'}
            </motion.div>
          ))}
        </div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 w-fit">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <Wheat className="w-8 h-8 text-[#1B5E20]" />
            </div>
            <span className="text-3xl font-black tracking-tight">KisanSaathi</span>
          </Link>

          <div className="mt-20">
            <h1 className="text-6xl font-black mb-4 leading-tight">
              किसान है तो <br/><span className="text-[#F57F17]">कल है</span>
            </h1>
            <p className="text-2xl font-light opacity-90 text-green-50 mb-12">
              Where there is a farmer,<br/>there is a future
            </p>
            
            <div className="flex items-center gap-3">
              <div className="flex -space-x-4">
                 {[1,2,3,4].map(i => (
                   <div key={i} className={`w-12 h-12 rounded-full border-4 border-[#1B5E20] bg-green-[${i+2}00] flex items-center justify-center overflow-hidden`}>
                     <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}&backgroundColor=e2e8f0`} alt="avatar" />
                   </div>
                 ))}
              </div>
              <div className="ml-4 font-bold text-lg">
                2M+ farmers trust<br/>KisanSaathi
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-4">
          {testimonials.map((t, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + t.delay }}
              className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl w-3/4 max-w-md transform hover:translate-x-2 transition-transform cursor-default"
            >
              <div className="flex text-[#F57F17] mb-2 text-xl">
                ★★★★★
              </div>
              <p className="font-medium text-lg mb-2">"{t.text}"</p>
              <p className="text-sm opacity-75">- {t.author}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 sm:p-12 xl:p-24 relative overflow-y-auto">
        <div className="flex justify-end mb-12">
          <div className="flex bg-gray-100 p-1 rounded-full w-fit">
            <button
               onClick={() => setLang('en')}
               className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${!isHi ? 'bg-white text-green-800 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              EN
            </button>
            <button
               onClick={() => setLang('hi')}
               className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${isHi ? 'bg-white text-green-800 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              HI
            </button>
          </div>
        </div>

        <div className="max-w-md w-full mx-auto flex-grow flex flex-col justify-center">
          <div className="text-center mb-10">
            {/* Mobile Logo Logo */}
            <div className="lg:hidden flex justify-center mb-6">
               <div className="w-16 h-16 bg-[#1B5E20] rounded-2xl flex items-center justify-center shadow-lg">
                  <Wheat className="w-10 h-10 text-white" />
               </div>
            </div>
            
            <h2 className="text-4xl font-black text-gray-900 mb-3">
              {isHi ? 'वापसी पर स्वागत है' : 'Welcome back'}
            </h2>
            <p className="text-gray-500 text-lg">
               {isHi ? 'अपनी खेती की यात्रा जारी रखने के लिए लॉगिन करें' : 'Sign in to continue your farming journey'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {isHi ? 'फ़ोन नंबर' : 'Phone Number'}
              </label>
              <div className="flex relative">
                <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-gray-300 bg-gray-50 text-gray-500 font-bold">
                  🇮🇳 +91
                </span>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                     <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="tel"
                    required
                    maxLength={10}
                    className="w-full pl-10 pr-4 py-4 bg-white border border-gray-300 rounded-r-xl focus:ring-2 focus:ring-[#1B5E20] focus:border-[#1B5E20] outline-none transition-all font-medium text-lg placeholder:font-normal"
                    placeholder="98765 43210"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                 {isHi ? 'पासवर्ड' : 'Password'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                   <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full pl-10 pr-12 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1B5E20] focus:border-[#1B5E20] outline-none transition-all text-lg"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                   {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5"/>}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-[#1B5E20] focus:ring-[#1B5E20]" />
                <span className="font-medium text-gray-700">{isHi ? 'मुझे याद रखें' : 'Remember me'}</span>
              </label>
              <a href="#" className="font-bold text-[#1B5E20] hover:text-[#2E7D32]">
                {isHi ? 'पासवर्ड भूल गए?' : 'Forgot Password?'}
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1B5E20] hover:bg-[#2E7D32] text-white font-black text-xl py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
            >
              {isHi ? 'लॉगिन करें' : 'Login'} <span className="opacity-75">→</span>
            </button>
          </form>

          <div className="mt-8 mb-8">
             <div className="relative">
                <div className="absolute inset-0 flex items-center">
                   <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                   <span className="px-4 bg-white text-gray-500 font-medium">
                     {isHi ? 'या इससे जारी रखें' : 'Or continue with'}
                   </span>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <button className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-bold text-gray-700">
               <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
               </svg>
               Google
             </button>
             <button className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-bold text-gray-700">
               <Facebook className="w-5 h-5 text-[#1877F2]" fill="#1877F2" />
               Facebook
             </button>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 font-medium">
              {isHi ? 'अकाउंट नहीं है?' : "Don't have an account?"} {' '}
              <Link href="/register" className="text-[#1B5E20] font-black hover:underline">
                {isHi ? 'मुफ़्त रजिस्टर करें →' : 'Register Free →'}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}