import Head from 'next/head'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { ArrowLeft, Leaf } from 'lucide-react'

export default function Terms() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-8 px-4">
      <Head>
        <title>Terms of Service - KisanSaathi</title>
        <meta name="description" content="Terms of Service for KisanSaathi Platform" />
      </Head>

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Back Button */}
          <motion.button
            onClick={() => router.push('/')}
            className="flex items-center text-gray-600 hover:text-primary-600 mb-8 transition-colors"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </motion.button>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Terms of <span className="gradient-text">Service</span>
            </h1>
            <p className="text-lg text-gray-600">
              Last updated: January 17, 2026
            </p>
          </div>

          {/* Terms Content */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8">
              <div className="prose prose-lg max-w-none">
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                  <p className="text-gray-700 leading-relaxed">
                    By accessing or using the KisanSaathi platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Service Description</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    KisanSaathi provides an agricultural intelligence platform that offers:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>AI-powered crop advisory services</li>
                    <li>Weather forecasting and alerts</li>
                    <li>Market price information</li>
                    <li>Pest and disease detection</li>
                    <li>Soil health analysis</li>
                    <li>Government scheme integration</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Responsibilities</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    As a user of KisanSaathi, you agree to:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>Provide accurate and complete registration information</li>
                    <li>Maintain the security of your account credentials</li>
                    <li>Use the platform for legitimate agricultural purposes only</li>
                    <li>Not misuse the services or attempt to gain unauthorized access</li>
                    <li>Comply with all applicable laws and regulations</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Privacy and Security</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We are committed to protecting your personal and agricultural data. Our Privacy Policy explains how we collect, use, and protect your information. By using our services, you consent to our data practices as described in the Privacy Policy.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Intellectual Property</h2>
                  <p className="text-gray-700 leading-relaxed">
                    All content, features, and functionality of the KisanSaathi platform, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, data compilations, and software, are the exclusive property of KisanSaathi and are protected by international copyright laws.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Limitation of Liability</h2>
                  <p className="text-gray-700 leading-relaxed">
                    KisanSaathi provides agricultural advisory services for informational purposes only. While we strive for accuracy, we do not guarantee the completeness, reliability, or suitability of the information provided. Users should verify critical decisions with qualified agricultural experts.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Termination</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We reserve the right to terminate or suspend your account and access to our services immediately, without prior notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties, or for any other reason.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Changes to Terms</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We reserve the right to modify these terms at any time. We will notify users of any significant changes through the platform or via email. Your continued use of the service after such changes constitutes your acceptance of the new Terms of Service.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Governing Law</h2>
                  <p className="text-gray-700 leading-relaxed">
                    These Terms of Service shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Information</h2>
                  <p className="text-gray-700 leading-relaxed">
                    If you have any questions about these Terms of Service, please contact us at:
                  </p>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">
                      <strong>Email:</strong> support@kisansaathi.in<br/>
                      <strong>Phone:</strong> +91-XXXX-XXXXXX<br/>
                      <strong>Address:</strong> AgriNova Technologies Pvt. Ltd.<br/>
                      Innovation Hub, Sector 62, Noida<br/>
                      Uttar Pradesh, India - 201301
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>© 2026 KisanSaathi (AgriNova). All rights reserved.</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}