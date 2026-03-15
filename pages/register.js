import Head from 'next/head'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'
import {
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Loader2,
  Leaf,
  Sprout,
  Wheat,
  Sun,
  Droplets,
  ChevronDown,
  Globe,
  Shield,
  TrendingUp,
  Users,
  Award,
  Check,
  X,
  Zap,
  Star,
  Brain
} from 'lucide-react'

// ─── Data ────────────────────────────────────────────────────────────────────

const STATES = [
  'Andhra Pradesh','Assam','Bihar','Gujarat','Haryana',
  'Himachal Pradesh','Jharkhand','Karnataka','Kerala',
  'Madhya Pradesh','Maharashtra','Odisha','Punjab',
  'Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh',
  'Uttarakhand','West Bengal'
]

const STEPS = [
  { id: 1, label: 'Basic Info', icon: User },
  { id: 2, label: 'Location',  icon: MapPin },
  { id: 3, label: 'Security',  icon: Shield }
]

const TESTIMONIALS = [
  {
    text: 'KisanSaathi doubled my income in just one season. Pure game-changer.',
    author: 'Ramesh Kumar',
    role: 'Farmer · Meerut, UP',
    initials: 'RK'
  },
  {
    text: 'AI pest alert saved my entire wheat crop just in time.',
    author: 'Sunita Devi',
    role: 'Farmer · Lucknow, UP',
    initials: 'SD'
  },
  {
    text: 'Market price insights helped me plan the best time to sell.',
    author: 'Harpal Singh',
    role: 'Farmer · Amritsar, Punjab',
    initials: 'HS'
  }
]

const STATS = [
  { value: '2M+', label: 'Active Farmers',  icon: Users,      bg: 'from-white/20 to-white/10' },
  { value: '15',  label: 'States Covered',  icon: Globe,      bg: 'from-white/20 to-white/10' },
  { value: '98%', label: 'Crop Accuracy',   icon: Brain,      bg: 'from-yellow-400/20 to-amber-400/10' },
  { value: '40%', label: 'Yield Boost',     icon: TrendingUp, bg: 'from-white/20 to-white/10' }
]

// ─── Password strength ────────────────────────────────────────────────────────

function getStrength(pw) {
  if (!pw) return { score: 0, label: '', bars: 'bg-gray-300' }
  let s = 0
  if (pw.length >= 8)           s++
  if (/[A-Z]/.test(pw))         s++
  if (/[0-9]/.test(pw))         s++
  if (/[^A-Za-z0-9]/.test(pw))  s++
  if (pw.length >= 12)          s++
  const m = [
    { label: 'Too Weak', bars: 'bg-red-500'    },
    { label: 'Weak',     bars: 'bg-orange-500'  },
    { label: 'Fair',     bars: 'bg-yellow-500'  },
    { label: 'Good',     bars: 'bg-lime-500'    },
    { label: 'Strong',   bars: 'bg-[#1B5E20]'   }
  ]
  return { score: s, ...m[Math.min(s, 4)] }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

// Exact same Particle as login
const Particle = ({ delay, left, size = 4 }) => (
  <motion.div
    className="absolute rounded-full bg-white/20"
    style={{ left: `${left}%`, width: size, height: size, bottom: -10 }}
    animate={{ y: [0, -800], opacity: [0, 1, 1, 0], rotate: [0, 360] }}
    transition={{ duration: 15, repeat: Infinity, delay, ease: 'linear' }}
  />
)

// Exact same FloatingCard style as login
const FloatingCard = ({ delay, children, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    className={`absolute ${className}`}
  >
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 3, repeat: Infinity, delay, ease: 'easeInOut' }}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-2xl"
    >
      {children}
    </motion.div>
  </motion.div>
)

// Animated stat card (left panel)
const StatCard = ({ stat, delay, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    className={`absolute ${className}`}
  >
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, delay: delay + 0.5, ease: 'easeInOut' }}
      className={`bg-gradient-to-br ${stat.bg} backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-2xl min-w-[130px]`}
    >
      <stat.icon className="w-5 h-5 text-white/80 mb-2" />
      <div className="text-2xl font-bold text-white font-sora">{stat.value}</div>
      <div className="text-white/60 text-xs mt-0.5">{stat.label}</div>
    </motion.div>
  </motion.div>
)

// Rotating testimonial carousel (bottom of left pane)
const TestimonialCarousel = () => {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % TESTIMONIALS.length), 3800)
    return () => clearInterval(t)
  }, [])
  const t = TESTIMONIALS[idx]
  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-2xl"
    >
      <div className="flex gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-yellow-400 text-sm">★</span>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35 }}
        >
          <p className="text-white text-sm leading-relaxed mb-3 italic">"{t.text}"</p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] border-2 border-white/30 flex items-center justify-center text-white text-xs font-bold">
              {t.initials}
            </div>
            <div>
              <div className="text-white text-sm font-semibold">{t.author}</div>
              <div className="text-white/60 text-xs">{t.role}</div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      {/* Dot indicators */}
      <div className="flex gap-1.5 mt-3">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`h-1 rounded-full transition-all duration-500 ${i === idx ? 'w-6 bg-white' : 'w-2 bg-white/30'}`}
          />
        ))}
      </div>
    </motion.div>
  )
}

// Floating label input — same input style as login page (border-2, rounded-2xl)
const Field = ({
  label, name, type = 'text', value, onChange,
  onFocus, onBlur, error, icon: Icon,
  suffix, focused, disabled,
  as: As = 'input', children, ...rest
}) => {
  const isActive = focused === name
  const hasVal   = Boolean(value)
  return (
    <div className="relative">
      {/* Label */}
      <motion.label
        htmlFor={name}
        animate={{
          y:     isActive || hasVal ? -24 : 0,
          scale: isActive || hasVal ? 0.82 : 1,
          color: isActive ? '#1B5E20' : error ? '#ef4444' : '#9ca3af'
        }}
        transition={{ duration: 0.18 }}
        className="absolute left-11 top-[17px] pointer-events-none origin-left font-medium text-sm z-10 bg-white px-0.5"
      >
        {label}
      </motion.label>

      {/* Icon */}
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${isActive ? 'text-[#1B5E20]' : error ? 'text-red-400' : 'text-gray-400'}`}>
        <Icon className="w-4 h-4" />
      </div>

      {/* Input or Select */}
      {As === 'select' ? (
        <select
          id={name} name={name} value={value}
          onChange={onChange} onFocus={onFocus} onBlur={onBlur}
          disabled={disabled}
          className={`w-full pl-10 pr-10 pt-6 pb-2.5 bg-white border-2 rounded-2xl text-sm text-gray-800 outline-none appearance-none transition-all duration-200 ${
            error
              ? 'border-red-400'
              : isActive
              ? 'border-[#1B5E20] shadow-lg shadow-[#1B5E20]/10'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          {...rest}
        >
          {children}
        </select>
      ) : (
        <input
          id={name} name={name} type={type} value={value}
          onChange={onChange} onFocus={onFocus} onBlur={onBlur}
          disabled={disabled}
          className={`w-full pl-10 ${suffix ? 'pr-10' : 'pr-4'} pt-6 pb-2.5 bg-white border-2 rounded-2xl text-sm text-gray-800 outline-none transition-all duration-200 ${
            error
              ? 'border-red-400'
              : isActive
              ? 'border-[#1B5E20] shadow-lg shadow-[#1B5E20]/10'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          autoComplete="off"
          {...rest}
        />
      )}

      {/* Right element */}
      {suffix && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">{suffix}</div>
      )}

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            className="text-red-500 text-xs mt-1.5 flex items-center gap-1 pl-1"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Register() {
  const router = useRouter()
  const [step, setStep]         = useState(1)
  const [focused, setFocused]   = useState(null)
  const [showPw, setShowPw]     = useState(false)
  const [showCpw, setShowCpw]   = useState(false)
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState(false)
  const [agreed, setAgreed]     = useState(false)

  const [form, setForm] = useState({
    firstName:'', lastName:'', email:'', phone:'',
    state:'', district:'', password:'', confirmPassword:''
  })
  const [errors, setErrors] = useState({})

  const pw       = getStrength(form.password)
  const pwRules  = [
    ['8+ characters',    form.password.length >= 8],
    ['Uppercase letter', /[A-Z]/.test(form.password)],
    ['Number',           /[0-9]/.test(form.password)],
    ['Special character',/[^A-Za-z0-9]/.test(form.password)]
  ]

  // Deterministic particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    delay: i * 0.5,
    left:  (i * 41 + 7) % 100,
    size:  ((i % 3) * 2) + 3
  }))

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }))
  }

  const validate = (s) => {
    const e = {}
    if (s === 1) {
      if (!form.firstName.trim())  e.firstName = 'First name is required'
      if (!form.lastName.trim())   e.lastName  = 'Last name is required'
      if (!form.email)             e.email = 'Email is required'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                                   e.email = 'Enter a valid email address'
      const ph = form.phone.replace(/\s/g,'')
      if (!ph)                     e.phone = 'Phone number is required'
      else if (!/^[6-9]\d{9}$/.test(ph))
                                   e.phone = 'Enter a valid 10-digit mobile number'
    }
    if (s === 2) {
      if (!form.state)             e.state    = 'Please select your state'
      if (!form.district.trim())   e.district = 'District is required'
    }
    if (s === 3) {
      if (!form.password)          e.password = 'Password is required'
      else if (form.password.length < 8)
                                   e.password = 'Password must be at least 8 characters'
      if (!form.confirmPassword)   e.confirmPassword = 'Please confirm your password'
      else if (form.password !== form.confirmPassword)
                                   e.confirmPassword = 'Passwords do not match'
      if (!agreed)                 e.terms = 'You must accept the terms to continue'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const goNext = () => { if (validate(step)) setStep(s => s + 1) }
  const goBack = () => { setErrors({}); setStep(s => s - 1) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate(3)) return
    setLoading(true)
    try {
      await new Promise(r => setTimeout(r, 1800))
      setSuccess(true)
      await new Promise(r => setTimeout(r, 1000))
      router.push('/dashboard')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fo = n => setFocused(n)
  const bl = n => setFocused(f => f === n ? null : f)

  return (
    <>
      <Head>
        <title>Register – KisanSaathi | India's AI Farming Platform</title>
        <meta name="description" content="Create your free KisanSaathi account. Access AI crop advisory, real-time market intelligence, and precision farming tools." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>

      <style jsx global>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        .font-sora  { font-family: 'Sora', sans-serif; }
        .font-dm    { font-family: 'DM Sans', sans-serif; }
        .font-hindi { font-family: 'Noto Sans Devanagari','DM Sans',sans-serif; }

        /* grain texture — identical to login */
        .grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.03;
        }

        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%);  }
        }
        .shimmer::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent);
          animation: shimmer 2.2s infinite;
        }

        @keyframes glow-pulse {
          0%,100% { box-shadow: 0 0 16px 0 rgba(27,94,32,0.4); }
          50%      { box-shadow: 0 0 36px 6px rgba(27,94,32,0.7); }
        }
        .btn-glow:hover { animation: glow-pulse 1.8s ease-in-out infinite; }

        @keyframes spin-slow { to { transform: rotate(360deg); } }
        .spin-slow { animation: spin-slow 28s linear infinite; }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #c6f6d5; border-radius: 4px; }
      `}</style>

      <div className="min-h-screen flex font-dm">

        {/* ═══════════════ LEFT PANEL ════════════════════════════════════════ */}
        <div className="hidden lg:flex lg:w-[46%] xl:w-[44%] relative overflow-hidden flex-col">

          {/* Background — same as login */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0F3D1A] via-[#1B5E20] to-[#2E7D32]" />
          <div className="absolute inset-0 grain pointer-events-none" />

          {/* Glowing radial spots */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-[#2E7D32]/30 blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 left-1/3 w-60 h-60 rounded-full bg-[#1B5E20]/20 blur-3xl pointer-events-none" />

          {/* Particles — same as login */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((p, i) => <Particle key={i} {...p} />)}

            {/* Wheat stalks — same as login */}
            <svg className="absolute bottom-0 left-0 w-full h-64 opacity-10" viewBox="0 0 400 200">
              {[...Array(15)].map((_, i) => (
                <motion.path
                  key={i}
                  d={`M ${i*30} 200 Q ${i*30+10} 150 ${i*30+5} 100`}
                  stroke="white" strokeWidth="2" fill="none"
                  animate={{
                    d: [
                      `M ${i*30} 200 Q ${i*30+10} 150 ${i*30+5} 100`,
                      `M ${i*30} 200 Q ${i*30-5} 150 ${i*30-10} 100`,
                      `M ${i*30} 200 Q ${i*30+10} 150 ${i*30+5} 100`
                    ]
                  }}
                  transition={{ duration: 4, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </svg>
          </div>

          {/* Rotating sun — same as login */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute top-20 right-20 text-white/10 pointer-events-none"
          >
            <Sun className="w-32 h-32" />
          </motion.div>

          {/* Spinning dashed ring */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 pointer-events-none">
            <div
              className="w-96 h-96 rounded-full spin-slow"
              style={{ border: '1px dashed rgba(255,255,255,0.08)' }}
            />
          </div>

          {/* ── Content ── */}
          <div className="relative z-10 flex flex-col px-12 xl:px-16 py-12 h-full">

            {/* Logo — exactly as login */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-10"
            >
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Sprout className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-white font-sora">KisanSaathi</span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7 }}
              className="mb-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-white/80 text-xs font-semibold mb-5 tracking-wider">
                <Zap className="w-3 h-3 text-yellow-400" />
                AI-Powered Farming — Free to Join
              </div>
              <h1 className="text-5xl font-bold text-white font-sora leading-tight mb-4">
                किसान है तो<br />
                <span className="text-[#A5D6A7]">कल है।</span>
              </h1>
              <p className="text-xl text-white/80 font-dm leading-relaxed">
                Where there is a farmer, there is a future.
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="text-white/60 text-sm mb-10 flex items-center gap-2"
            >
              <Wheat className="w-4 h-4" />
              2M+ Farmers · 15 States · 98% AI Accuracy
            </motion.p>

            {/* Stat cards floating grid */}
            <div className="relative flex-1">
              {STATS.map((stat, i) => (
                <StatCard
                  key={stat.label}
                  stat={stat}
                  delay={0.4 + i * 0.12}
                  className={[
                    'top-2 left-0',
                    'top-2 left-[148px]',
                    'top-32 left-0',
                    'top-32 left-[148px]'
                  ][i]}
                />
              ))}
            </div>

            {/* Testimonial carousel */}
            <TestimonialCarousel />
          </div>
        </div>

        {/* ═══════════════ RIGHT PANEL ════════════════════════════════════════ */}
        <div className="w-full lg:w-[54%] xl:w-[56%] bg-[#FAFDF6] relative overflow-y-auto">

          {/* Mobile header — same pattern as login */}
          <div className="lg:hidden bg-gradient-to-r from-[#0F3D1A] to-[#1B5E20] px-6 py-5 rounded-b-[2rem]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white font-sora">KisanSaathi</span>
            </div>
            <p className="text-white/90 text-lg font-sora">किसान है तो कल है</p>
            <p className="text-white/60 text-sm mt-1">2M+ Farmers · 15 States · 98% Accuracy</p>
          </div>

          <div className="min-h-screen lg:min-h-0 flex flex-col justify-center px-6 sm:px-12 lg:px-14 py-10 max-w-2xl mx-auto lg:max-w-none">

            {/* Top row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-between mb-8 w-full max-w-[480px] mx-auto"
            >
              <button
                onClick={() => router.push('/')}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                Home
              </button>
              <p className="text-sm text-gray-500">
                Already a member?{' '}
                <button
                  onClick={() => router.push('/login')}
                  className="text-[#1B5E20] font-semibold hover:underline"
                >
                  Sign in
                </button>
              </p>
            </motion.div>

            {/* Form wrapper */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-[480px] mx-auto"
            >
              {/* Heading */}
              <div className="mb-7">
                <h2 className="text-3xl font-bold text-[#1A1A2E] mb-1.5 font-sora">
                  Create your account
                </h2>
                <p className="text-gray-500 text-sm">
                  Join India's most advanced agri-intelligence platform — free forever.
                </p>
              </div>

              {/* ── Step Indicator ── */}
              <div className="mb-7">
                {/* Bar */}
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-5">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] rounded-full"
                    animate={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
                {/* Labels */}
                <div className="flex items-center">
                  {STEPS.map((s, i) => {
                    const done   = step > s.id
                    const active = step === s.id
                    return (
                      <div key={s.id} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center">
                          <motion.div
                            animate={{
                              backgroundColor: done ? '#1B5E20' : active ? '#2E7D32' : '#E5E7EB',
                              scale: active ? 1.1 : 1
                            }}
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                          >
                            {done
                              ? <Check className="w-4 h-4 text-white" />
                              : <s.icon className={`w-4 h-4 ${active ? 'text-white' : 'text-gray-400'}`} />
                            }
                          </motion.div>
                          <span className={`text-xs mt-1.5 font-medium ${active ? 'text-[#1B5E20]' : done ? 'text-[#2E7D32]' : 'text-gray-400'}`}>
                            {s.label}
                          </span>
                        </div>
                        {i < STEPS.length - 1 && (
                          <div className="flex-1 h-px mx-2 mb-5 overflow-hidden bg-gray-200">
                            <motion.div
                              className="h-full bg-[#2E7D32]"
                              animate={{ width: done ? '100%' : '0%' }}
                              transition={{ duration: 0.4 }}
                            />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* ── Form Card (glassmorphism + soft shadow) ── */}
              <motion.div
                whileHover={{ boxShadow: '0 24px 64px -12px rgba(0,0,0,0.13)' }}
                className="bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden"
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleSubmit}>
                  <AnimatePresence mode="wait">

                    {/* ── STEP 1: Basic Info ── */}
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="p-8 space-y-5"
                      >
                        <div className="grid sm:grid-cols-2 gap-4">
                          <Field label="First Name"  name="firstName" icon={User}
                            value={form.firstName} onChange={handleChange}
                            onFocus={() => fo('firstName')} onBlur={() => bl('firstName')}
                            error={errors.firstName} focused={focused} disabled={loading} />
                          <Field label="Last Name"   name="lastName"  icon={User}
                            value={form.lastName}  onChange={handleChange}
                            onFocus={() => fo('lastName')} onBlur={() => bl('lastName')}
                            error={errors.lastName}  focused={focused} disabled={loading} />
                        </div>
                        <Field label="Email Address" name="email" type="email" icon={Mail}
                          value={form.email} onChange={handleChange}
                          onFocus={() => fo('email')} onBlur={() => bl('email')}
                          error={errors.email} focused={focused} disabled={loading} />
                        <Field label="Phone Number (+91)" name="phone" type="tel" icon={Phone}
                          value={form.phone} onChange={handleChange}
                          onFocus={() => fo('phone')} onBlur={() => bl('phone')}
                          error={errors.phone} focused={focused} disabled={loading}
                          maxLength={10} />
                      </motion.div>
                    )}

                    {/* ── STEP 2: Location ── */}
                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="p-8 space-y-5"
                      >
                        {/* Location info banner */}
                        <div className="flex items-start gap-3 px-4 py-3 bg-[#F1F8F1] border border-[#C8E6C9] rounded-2xl text-sm text-[#1B5E20]">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>We personalise crop advisory, weather data and mandi prices based on your location.</span>
                        </div>

                        <Field
                          as="select" label="State" name="state" icon={Globe}
                          value={form.state} onChange={handleChange}
                          onFocus={() => fo('state')} onBlur={() => bl('state')}
                          error={errors.state} focused={focused} disabled={loading}
                          suffix={<ChevronDown className="w-4 h-4 text-gray-400 pointer-events-none" />}
                        >
                          <option value="">Select your state</option>
                          {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                        </Field>

                        <Field label="District" name="district" icon={MapPin}
                          value={form.district} onChange={handleChange}
                          onFocus={() => fo('district')} onBlur={() => bl('district')}
                          error={errors.district} focused={focused} disabled={loading} />

                        {/* Decorative map visual */}
                        <div className="h-32 rounded-2xl bg-gradient-to-br from-[#E8F5E9] to-[#F1F8E9] border border-[#C8E6C9] flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 opacity-25"
                            style={{
                              backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 18px,#A5D6A7 18px,#A5D6A7 19px),
                                repeating-linear-gradient(90deg,transparent,transparent 18px,#A5D6A7 18px,#A5D6A7 19px)`
                            }}
                          />
                          <div className="relative z-10 text-center">
                            <Globe className="w-7 h-7 text-[#2E7D32] mx-auto mb-1.5" />
                            <p className="text-sm text-[#1B5E20] font-semibold">India Agricultural Map</p>
                            <p className="text-xs text-[#2E7D32]/70">Regional data synced to your location</p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* ── STEP 3: Security ── */}
                    {step === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="p-8 space-y-5"
                      >
                        {/* Password */}
                        <Field
                          label="Password" name="password"
                          type={showPw ? 'text' : 'password'}
                          icon={Lock}
                          value={form.password} onChange={handleChange}
                          onFocus={() => fo('password')} onBlur={() => bl('password')}
                          error={errors.password} focused={focused} disabled={loading}
                          suffix={
                            <button type="button" onClick={() => setShowPw(v => !v)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <motion.div animate={{ scale: showPw ? 1.1 : 1 }} transition={{ duration: 0.2 }}>
                                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </motion.div>
                            </button>
                          }
                        />

                        {/* Password strength */}
                        <AnimatePresence>
                          {form.password.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="-mt-1 space-y-2"
                            >
                              {/* Bar segments */}
                              <div className="flex gap-1">
                                {[1,2,3,4,5].map(i => (
                                  <motion.div
                                    key={i}
                                    className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${i <= pw.score ? pw.bars : 'bg-gray-200'}`}
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                  />
                                ))}
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-400">Password strength</span>
                                <motion.span
                                  key={pw.label}
                                  initial={{ opacity: 0, y: -4 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className={`font-semibold ${
                                    pw.score <= 1 ? 'text-red-500' :
                                    pw.score <= 2 ? 'text-orange-500' :
                                    pw.score <= 3 ? 'text-yellow-600' :
                                    'text-[#1B5E20]'
                                  }`}
                                >{pw.label}</motion.span>
                              </div>
                              {/* Rules checklist */}
                              <ul className="grid grid-cols-2 gap-1.5">
                                {pwRules.map(([rule, met]) => (
                                  <li key={rule} className={`flex items-center gap-1.5 text-xs ${met ? 'text-[#1B5E20]' : 'text-gray-400'}`}>
                                    {met
                                      ? <CheckCircle className="w-3 h-3 flex-shrink-0" />
                                      : <div className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0" />}
                                    {rule}
                                  </li>
                                ))}
                              </ul>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Confirm Password */}
                        <Field
                          label="Confirm Password" name="confirmPassword"
                          type={showCpw ? 'text' : 'password'}
                          icon={Lock}
                          value={form.confirmPassword} onChange={handleChange}
                          onFocus={() => fo('confirmPassword')} onBlur={() => bl('confirmPassword')}
                          error={errors.confirmPassword} focused={focused} disabled={loading}
                          suffix={
                            <div className="flex items-center gap-2">
                              {form.confirmPassword && form.password === form.confirmPassword && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                  <CheckCircle className="w-4 h-4 text-[#1B5E20]" />
                                </motion.div>
                              )}
                              <button type="button" onClick={() => setShowCpw(v => !v)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                {showCpw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          }
                        />

                        {/* Terms */}
                        <div>
                          <label className="flex items-start gap-3 cursor-pointer group">
                            <div className="relative mt-0.5" onClick={() => setAgreed(v => !v)}>
                              <input type="checkbox" className="sr-only" checked={agreed} readOnly />
                              <motion.div
                                animate={{
                                  backgroundColor: agreed ? '#1B5E20' : '#fff',
                                  borderColor:     agreed ? '#1B5E20' : errors.terms ? '#f87171' : '#D1D5DB'
                                }}
                                className="w-5 h-5 border-2 rounded-md flex items-center justify-center cursor-pointer"
                              >
                                <AnimatePresence>
                                  {agreed && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      exit={{ scale: 0 }}
                                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                                    >
                                      <Check className="w-3 h-3 text-white" />
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </motion.div>
                            </div>
                            <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors leading-snug">
                              I agree to KisanSaathi's{' '}
                              <a href="/terms" className="text-[#1B5E20] hover:underline font-medium">Terms of Service</a>
                              {' '}and{' '}
                              <a href="/privacy" className="text-[#1B5E20] hover:underline font-medium">Privacy Policy</a>
                            </span>
                          </label>
                          <AnimatePresence>
                            {errors.terms && (
                              <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="text-red-500 text-xs mt-1.5 flex items-center gap-1 pl-1"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                                {errors.terms}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ── Navigation Buttons ── */}
                  <div className="px-8 pb-8 flex gap-3">
                    {step > 1 && (
                      <motion.button
                        type="button" onClick={goBack}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        disabled={loading}
                        className="flex-none flex items-center gap-2 px-5 py-4 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:border-gray-300 hover:bg-gray-50 transition-all"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </motion.button>
                    )}

                    {step < STEPS.length ? (
                      <motion.button
                        type="button" onClick={goNext}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        className="flex-1 relative overflow-hidden flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white text-sm font-semibold rounded-2xl shimmer btn-glow transition-all"
                      >
                        <span>Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    ) : (
                      <motion.button
                        type="submit"
                        disabled={loading || success}
                        whileHover={!loading && !success ? { scale: 1.02 } : {}}
                        whileTap={!loading && !success   ? { scale: 0.97 } : {}}
                        className={`flex-1 relative overflow-hidden flex items-center justify-center gap-2 py-4 text-white text-sm font-semibold rounded-2xl transition-all ${
                          success
                            ? 'bg-green-500'
                            : 'bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] shimmer btn-glow'
                        }`}
                      >
                        {loading ? (
                          <><Loader2 className="w-5 h-5 animate-spin" /><span>Creating Account…</span></>
                        ) : success ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                            className="flex items-center gap-2"
                          >
                            <CheckCircle className="w-5 h-5" />
                            <span>Account Created!</span>
                          </motion.div>
                        ) : (
                          <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>
                        )}
                      </motion.button>
                    )}
                  </div>
                </form>
              </motion.div>

              {/* Social login divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-[#FAFDF6] text-gray-500 text-sm">Or sign up with</span>
                </div>
              </div>

              {/* Social buttons */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    name: 'Google',
                    icon: (
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    )
                  },
                  {
                    name: 'Facebook',
                    icon: (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    )
                  }
                ].map(({ name, icon }) => (
                  <motion.button
                    key={name}
                    type="button"
                    whileHover={{ y: -2, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-3 py-3.5 px-4 bg-white/80 backdrop-blur border border-gray-200 rounded-2xl hover:bg-white transition-all"
                  >
                    {icon}
                    <span className="font-medium text-gray-700 text-sm">{name}</span>
                  </motion.button>
                ))}
              </div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-8 flex flex-wrap items-center justify-center gap-5 pb-4"
              >
                {[
                  { icon: Shield,  label: 'Bank-grade security' },
                  { icon: Leaf,    label: 'No spam, ever' },
                  { icon: Award,   label: '2M+ farmers trust us' }
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Mobile language bar — same as login */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t px-6 py-4">
            <div className="flex justify-center gap-6">
              {['English', 'हिंदी', 'ਪੰਜਾਬੀ', 'मराठी'].map(l => (
                <button key={l} className="text-sm font-medium text-gray-500 hover:text-[#1B5E20] transition-colors">
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}