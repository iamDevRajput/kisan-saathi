import Head from 'next/head'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { ArrowLeft, Leaf, Shield } from 'lucide-react'

export default function Privacy() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-8 px-4">
      <Head>
        <title>Privacy Policy - KisanSaathi</title>
        <meta name="description" content="Privacy Policy for KisanSaathi Platform" />
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
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Privacy <span className="gradient-text">Policy</span>
            </h1>
            <p className="text-lg text-gray-600">
              Last updated: January 17, 2026
            </p>
          </div>

          {/* Privacy Content */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8">
              <div className="prose prose-lg max-w-none">
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We collect several types of information for various purposes to provide and improve our service to you:
                  </p>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Personal Information</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                    <li>Name and contact details</li>
                    <li>Phone number and email address</li>
                    <li>Location information (state and district)</li>
                    <li>Agricultural land details</li>
                    <li>Crop information and farming practices</li>
                  </ul>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Usage Data</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>Platform interaction data</li>
                    <li>Service usage patterns</li>
                    <li>Device information and IP addresses</li>
                    <li>Browser type and version</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We use the collected information for various purposes:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>To provide and maintain our agricultural services</li>
                    <li>To personalize your farming experience</li>
                    <li>To improve our platform and services</li>
                    <li>To communicate with you about updates and services</li>
                    <li>To comply with legal obligations</li>
                    <li>To protect against fraudulent activities</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Data Protection Measures</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We implement appropriate security measures to protect your personal information:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-4">
                    <li>End-to-end encryption for data transmission</li>
                    <li>Secure server infrastructure</li>
                    <li>Regular security audits and updates</li>
                    <li>Access controls and authentication measures</li>
                    <li>Employee training on data protection</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Sharing and Disclosure</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We do not sell, trade, or rent your personal information to third parties. We may share information only in the following circumstances:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>With your explicit consent</li>
                    <li>To comply with legal requirements</li>
                    <li>To protect our rights and property</li>
                    <li>With trusted service providers who assist in operating our platform</li>
                    <li>For government agricultural programs and schemes</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Data Rights</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    You have the following rights regarding your personal information:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>Right to access your personal data</li>
                    <li>Right to rectify inaccurate information</li>
                    <li>Right to erasure ("right to be forgotten")</li>
                    <li>Right to restrict processing</li>
                    <li>Right to data portability</li>
                    <li>Right to object to processing</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We retain your personal information for as long as necessary to provide our services and comply with legal obligations. Agricultural data may be retained for research purposes with appropriate anonymization.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies and Tracking Technologies</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We use cookies and similar tracking technologies to enhance your experience and analyze platform usage. You can control cookie preferences through your browser settings.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children's Privacy</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to This Privacy Policy</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Us</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    If you have any questions about this Privacy Policy, please contact us:
                  </p>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">
                      <strong>Data Protection Officer:</strong> privacy@kisansaathi.in<br/>
                      <strong>Support:</strong> support@kisansaathi.in<br/>
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