import Head from 'next/head'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { 
  Users, 
  Target, 
  Lightbulb, 
  Globe,
  Award,
  TrendingUp,
  Leaf,
  ArrowLeft
} from 'lucide-react'

const missionItems = [
  {
    icon: Target,
    title: "Our Mission",
    description: "To empower every farmer in India with cutting-edge agricultural technology that increases productivity, reduces costs, and ensures sustainable farming practices for future generations."
  },
  {
    icon: Lightbulb,
    title: "Our Vision",
    description: "Creating a digitally connected agricultural ecosystem where data-driven insights and AI-powered recommendations help farmers make informed decisions and achieve prosperity."
  },
  {
    icon: Users,
    title: "Our Values",
    description: "Farmer-first approach, technological innovation, sustainability, transparency, and inclusive growth that benefits the entire agricultural community."
  }
]

const stats = [
  { number: "2M+", label: "Active Farmers", icon: Users },
  { number: "15", label: "States Covered", icon: Globe },
  { number: "98%", label: "Accuracy Rate", icon: Award },
  { number: "40%", label: "Avg. Yield Increase", icon: TrendingUp }
]

const teamMembers = [
  {
    name: "Dr. Amit Sharma",
    role: "Chief Technology Officer",
    bio: "Former IIT Delhi professor with 15+ years in agricultural technology and AI research.",
    image: "AS"
  },
  {
      name: "Priya Patel",
      role: "Head of Product",
      bio: "Ex-Google product manager specializing in agricultural SaaS solutions and farmer experience design.",
      image: "PP"
    },
    {
      name: "Raj Kumar",
      role: "Agricultural Scientist",
      bio: "PhD in Agricultural Sciences from ICAR, leading our research on sustainable farming practices.",
      image: "RK"
    },
    {
      name: "Sneha Desai",
      role: "Community Lead",
      bio: "Veteran in rural development and farmer outreach programs across 12 Indian states.",
      image: "SD"
    }
  ]

export default function About() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>About Us - KisanSaathi</title>
        <meta name="description" content="Learn about KisanSaathi's mission to transform Indian agriculture through technology" />
      </Head>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={() => router.push('/')}
              className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
              whileHover={{ x: -5 }}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </motion.button>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">KisanSaathi</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-primary-100 rounded-full text-primary-700 font-medium mb-6">
              <Leaf className="w-4 h-4 mr-2" />
              About KisanSaathi
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Transforming <span className="gradient-text">Indian Agriculture</span> Through Technology
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Founded in 2023, KisanSaathi is on a mission to bridge the gap between traditional 
              farming and modern technology. We believe that every farmer deserves access to 
              world-class agricultural intelligence, regardless of their location or resources.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white rounded-full px-6 py-3 shadow-lg">
                <span className="font-semibold text-primary-600">AI-Powered</span>
              </div>
              <div className="bg-white rounded-full px-6 py-3 shadow-lg">
                <span className="font-semibold text-primary-600">Farmer-First</span>
              </div>
              <div className="bg-white rounded-full px-6 py-3 shadow-lg">
                <span className="font-semibold text-primary-600">Sustainable</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our <span className="gradient-text">Purpose</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're building the future of Indian agriculture through innovation, dedication, and a deep understanding of farmers' needs.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {missionItems.map((item, index) => (
              <motion.div
                key={item.title}
                className="text-center p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-primary-500 to-primary-600">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center text-white"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-primary-100 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our <span className="gradient-text">Journey</span>
              </h2>
              <div className="space-y-6 text-gray-600">
                <p className="leading-relaxed">
                  KisanSaathi was born from a simple observation: while technology was transforming 
                  every industry, agriculture in India was still largely dependent on traditional methods 
                  and word-of-mouth advice.
                </p>
                <p className="leading-relaxed">
                  Our founders, a team of agricultural scientists and technology experts, spent months 
                  in rural villages understanding the real challenges farmers face. We discovered that 
                  farmers needed more than just information – they needed intelligent, actionable insights 
                  tailored to their specific conditions.
                </p>
                <p className="leading-relaxed">
                  Today, we're proud to serve over 2 million farmers across 15 states, helping them 
                  increase yields by an average of 40% while reducing input costs and promoting 
                  sustainable farming practices.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 gap-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
                <div className="text-3xl font-bold mb-2">2023</div>
                <div className="text-primary-100">Founded</div>
              </div>
              <div className="bg-gradient-to-br from-secondary-400 to-secondary-500 rounded-2xl p-6 text-white">
                <div className="text-3xl font-bold mb-2">2024</div>
                <div className="text-secondary-100">1M Farmers</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
                <div className="text-3xl font-bold mb-2">2025</div>
                <div className="text-green-100">AI Integration</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                <div className="text-3xl font-bold mb-2">2026</div>
                <div className="text-blue-100">15 States</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our <span className="gradient-text">Leadership Team</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the passionate individuals driving KisanSaathi's mission forward
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  {member.image}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-primary-600 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Join Us in Transforming Agriculture
            </h2>
            <p className="text-xl text-primary-100 mb-10 max-w-3xl mx-auto">
              Whether you're a farmer, researcher, or technology enthusiast, there's a place for you 
              in building the future of Indian agriculture.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => router.push('/register')}
                className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Become a Farmer Partner
              </button>
              <button 
                onClick={() => router.push('/contact')}
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-full transition-all duration-300"
              >
                Contact Us
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}