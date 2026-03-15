import Head from 'next/head'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Brain, 
  Camera, 
  CloudSun, 
  TrendingUp, 
  Shield, 
  Users,
  Menu,
  X,
  Leaf,
  Award,
  Globe
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: "AI Crop Advisory",
    description: "Advanced machine learning algorithms provide hyper-localized recommendations for optimal yield and resource management."
  },
  {
    icon: Camera,
    title: "Smart Pest Detection",
    description: "Computer vision technology identifies crop diseases and pest infestations with 98% accuracy for early intervention."
  },
  {
    icon: CloudSun,
    title: "Predictive Weather Analytics",
    description: "Proprietary weather modeling provides 15-day forecasts with agricultural risk assessment and planning tools."
  },
  {
    icon: TrendingUp,
    title: "Market Intelligence",
    description: "Real-time mandi prices, demand forecasting, and supply chain optimization for maximum profitability."
  },
  {
    icon: Shield,
    title: "Government Integration",
    description: "Seamless integration with e-NAM, PMFBY, and state agricultural schemes for unified access to benefits."
  },
  {
    icon: Users,
    title: "Multilingual Support",
    description: "Voice-first interface supporting 12+ Indian languages, making advanced agriculture accessible to every farmer."
  }
]

const stats = [
  { number: "2M+", label: "Active Farmers", icon: Users },
  { number: "98%", label: "Accuracy Rate", icon: Award },
  { number: "40%", label: "Avg. Yield Increase", icon: TrendingUp },
  { number: "15", label: "States Covered", icon: Globe }
]

const testimonials = [
  {
    name: "Rajesh Sharma",
    role: "Large Scale Farmer, Punjab",
    content: "KisanSaathi has revolutionized our farming operations. The AI-powered recommendations helped us increase yield by 45% while reducing input costs by 25%."
  },
  {
    name: "Meera Patel",
    role: "Cooperative Manager, Gujarat",
    content: "As an agricultural cooperative, KisanSaathi's platform has enabled us to provide better services to 15,000+ farmers. The real-time market insights are game-changing."
  },
  {
    name: "Vikram Kumar",
    role: "Small Farmer, Uttar Pradesh",
    content: "The pest detection feature saved my entire wheat crop last season. Early detection and precise treatment recommendations prevented losses worth over ₹2 lakhs."
  }
]

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>KisanSaathi - AI-Powered Agricultural Intelligence Platform</title>
        <meta name="description" content="Empowering India's farmers with enterprise-grade crop advisory, predictive analytics, and market intelligence" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-6'
      }`}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">KisanSaathi</span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="nav-link">Features</a>
              <a href="#about" className="nav-link">About</a>
              <a href="#testimonials" className="nav-link">Testimonials</a>
              <a href="/login" className="btn-outline">Login</a>
              <a href="/register" className="btn-primary">Get Started</a>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div 
              className="md:hidden mt-4 py-4 border-t border-gray-200"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex flex-col space-y-4">
                <a href="#features" className="nav-link py-2">Features</a>
                <a href="#about" className="nav-link py-2">About</a>
                <a href="#testimonials" className="nav-link py-2">Testimonials</a>
                <a href="/login" className="btn-outline text-center">Login</a>
                <a href="/register" className="btn-primary text-center">Get Started</a>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-primary-100 rounded-full text-primary-700 font-medium mb-6">
                <Award className="w-4 h-4 mr-2" />
                AI-Powered Agricultural Intelligence
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Precision Agriculture for <span className="gradient-text">India's Farmers</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Empowering 140M+ farmers with enterprise-grade crop advisory, predictive analytics, 
                and market intelligence. Harness the power of artificial intelligence for sustainable 
                and profitable farming.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    className="stat-card text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <stat.icon className="w-6 h-6 text-primary-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-primary-600">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="/dashboard" className="btn-primary text-center">
                  Access Dashboard
                </a>
                <a href="#features" className="btn-outline text-center">
                  View Features
                </a>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-gradient-to-br from-white to-primary-50 rounded-3xl p-8 shadow-2xl border border-primary-100">
                <div className="text-center mb-6">
                  <div className="text-lg font-semibold text-gray-800 mb-2">🏆 Premier Analytics Dashboard</div>
                  <div className="h-64 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-primary-300">
                    <div className="text-center text-primary-600">
                      <TrendingUp className="w-12 h-12 mx-auto mb-3" />
                      <div className="font-medium">Advanced Agricultural Intelligence</div>
                      <div className="text-sm opacity-80 mt-1">Real-time Data Visualization</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-secondary-400 to-secondary-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-500 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-medium mb-4">
              INNOVATION
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Enterprise-Grade <span className="gradient-text">Agricultural Intelligence</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cutting-edge technology designed specifically for India's diverse agricultural landscape, 
              delivering precision insights that drive productivity and profitability.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  Transforming <span className="gradient-text">Indian Agriculture</span>
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  KisanSaathi is India's most advanced agricultural intelligence platform, 
                  bridging the gap between traditional farming and modern technology. 
                  We're on a mission to empower every farmer with the tools they need 
                  to succeed in the digital age.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-primary-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">AI-powered crop recommendations</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-primary-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">Real-time market intelligence</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-primary-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">Government scheme integration</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-primary-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">Multilingual voice support</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 gap-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-8 text-white">
                <Users className="w-10 h-10 mb-4" />
                <div className="text-3xl font-bold mb-2">2M+</div>
                <div className="text-primary-100">Active Farmers</div>
              </div>
              <div className="bg-gradient-to-br from-secondary-400 to-secondary-500 rounded-2xl p-8 text-white">
                <Award className="w-10 h-10 mb-4" />
                <div className="text-3xl font-bold mb-2">98%</div>
                <div className="text-secondary-100">Accuracy Rate</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white">
                <TrendingUp className="w-10 h-10 mb-4" />
                <div className="text-3xl font-bold mb-2">40%</div>
                <div className="text-green-100">Avg. Yield Increase</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white">
                <Globe className="w-10 h-10 mb-4" />
                <div className="text-3xl font-bold mb-2">15</div>
                <div className="text-blue-100">States Covered</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-medium mb-4">
              SUCCESS STORIES
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Trusted by <span className="gradient-text">Agricultural Leaders</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of farmers and agricultural organizations who have transformed 
              their operations with KisanSaathi's intelligent solutions.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="testimonial-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-gray-600 italic mb-6 leading-relaxed relative">
                  <span className="absolute -left-2 -top-2 text-6xl text-primary-200">"</span>
                  {testimonial.content}
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-primary-600">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Transform Your Agricultural Operations Today
            </h2>
            <p className="text-xl text-primary-100 mb-10 max-w-3xl mx-auto">
              Join India's most advanced agricultural intelligence platform. Experience the 
              difference that enterprise-grade technology makes for modern farming.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/register" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
                Start Free Trial
              </a>
              <a href="/contact" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-4 px-8 rounded-full transition-all duration-300">
                Contact Sales
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">KisanSaathi</span>
              </div>
              <p className="text-gray-400 mb-6">
                Empowering India's farmers with AI-driven agricultural solutions for better yields and sustainable farming.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors">
                  <span className="text-sm">f</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors">
                  <span className="text-sm">t</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors">
                  <span className="text-sm">in</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Platform</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="/features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="/pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="/api" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Company</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="/careers" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Support</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="/help" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="/documentation" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="/community" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="/status" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2026 KisanSaathi (AgriNova). All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}