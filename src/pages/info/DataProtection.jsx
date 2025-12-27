const DataProtection = () => {
  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600">
            Last updated: December 13, 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-600 leading-relaxed">
              At Pizza Corner, we are committed to protecting your information and ensuring the security of your personal data. This document explains how we collect, use, disclose, and safeguard your information when you use our website and services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="space-y-2 ml-6">
              <li className="text-gray-600 flex items-start gap-2">
                <span className="text-orange-500 font-bold">•</span>
                <span><strong>Personal Information:</strong> Name, email address, phone number, delivery address</span>
              </li>
              <li className="text-gray-600 flex items-start gap-2">
                <span className="text-orange-500 font-bold">•</span>
                <span><strong>Payment Information:</strong> Credit or debit card details, UPI information (processed securely through payment gateways)</span>
              </li>
              <li className="text-gray-600 flex items-start gap-2">
                <span className="text-orange-500 font-bold">•</span>
                <span><strong>Order Information:</strong> Order history, preferences, and feedback</span>
              </li>
              <li className="text-gray-600 flex items-start gap-2">
                <span className="text-orange-500 font-bold">•</span>
                <span><strong>Technical Information:</strong> IP address, browser type, device information, and usage data</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              We use the information we collect to:
            </p>
            <ul className="space-y-2 ml-6">
              <li className="text-gray-600 flex items-start gap-2">
                <span className="text-orange-500 font-bold">•</span>
                <span>Process and deliver your orders</span>
              </li>
              <li className="text-gray-600 flex items-start gap-2">
                <span className="text-orange-500 font-bold">•</span>
                <span>Communicate with you about your orders and our services</span>
              </li>
              <li className="text-gray-600 flex items-start gap-2">
                <span className="text-orange-500 font-bold">•</span>
                <span>Send promotional offers and updates (with your consent)</span>
              </li>
              <li className="text-gray-600 flex items-start gap-2">
                <span className="text-orange-500 font-bold">•</span>
                <span>Improve our website, products, and services</span>
              </li>
              <li className="text-gray-600 flex items-start gap-2">
                <span className="text-orange-500 font-bold">•</span>
                <span>Prevent fraud and ensure security</span>
              </li>
              <li className="text-gray-600 flex items-start gap-2">
                <span className="text-orange-500 font-bold">•</span>
                <span>Comply with legal obligations</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Information Sharing</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="space-y-2 ml-6">
              <li className="text-gray-600 flex items-start gap-2">
                <span className="text-orange-500 font-bold">•</span>
                <span><strong>Service Providers:</strong> Delivery partners, payment processors, and technology providers</span>
              </li>
              <li className="text-gray-600 flex items-start gap-2">
                <span className="text-orange-500 font-bold">•</span>
                <span><strong>Legal Requirements:</strong> When required by law or to protect our rights</span>
              </li>
              <li className="text-gray-600 flex items-start gap-2">
                <span className="text-orange-500 font-bold">•</span>
                <span><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
            <p className="text-gray-600 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100 percent secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies and Tracking</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              We use cookies and similar tracking technologies to enhance your experience. You can control cookies through your browser settings. Types of cookies we use:
            </p>
            <ul className="space-y-2 ml-6">
              <li className="text-gray-600 flex items-start gap-2">
                <span className="text-orange-500 font-bold">•</span>
                <span><strong>Essential Cookies:</strong> Required for website functionality</span>
              </li>
              <li className="text-gray-600 flex items-start gap-2">
                <span className="text-orange-500 font-bold">•</span>
                <span><strong>Performance Cookies:</strong> Help us understand how visitors use our site</span>
              </li>
              <li className="text-gray-600 flex items-start gap-2">
                <span className="text-orange-500 font-bold">•</span>
                <span><strong>Marketing Cookies:</strong> Used to deliver relevant content</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Rights</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              You have the right to:
            </p>
            <ul className="space-y-2 ml-6">
              <li className="text-gray-600 flex items-start gap-2">
                <span className="text-orange-500 font-bold">•</span>
                <span>Access and receive a copy of your personal information</span>
              </li>
              <li className="text-gray-600 flex items-start gap-2">
                <span className="text-orange-500 font-bold">•</span>
                <span>Correct inaccurate or incomplete information</span>
              </li>
              <li className="text-gray-600 flex items-start gap-2">
                <span className="text-orange-500 font-bold">•</span>
                <span>Request deletion of your personal information</span>
              </li>
              <li className="text-gray-600 flex items-start gap-2">
                <span className="text-orange-500 font-bold">•</span>
                <span>Opt-out of marketing communications</span>
              </li>
              <li className="text-gray-600 flex items-start gap-2">
                <span className="text-orange-500 font-bold">•</span>
                <span>Withdraw consent at any time</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Data Retention</h2>
            <p className="text-gray-600 leading-relaxed">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this document, unless a longer retention period is required by law. Order history and transaction records are retained for accounting and legal purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Children Information</h2>
            <p className="text-gray-600 leading-relaxed">
              Our services are not directed to children under 13 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Third-Party Links</h2>
            <p className="text-gray-600 leading-relaxed">
              Our website may contain links to third-party websites. We are not responsible for the practices of these websites. We encourage you to review their policies before providing any personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Document</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this document from time to time. We will notify you of any changes by posting the new version on this page and updating the date above. Your continued use of our services after changes are posted constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              If you have any questions about this document or our data practices, please contact us:
            </p>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-gray-700"><strong>Email:</strong> info@pizza.com</p>
              <p className="text-gray-700"><strong>Phone:</strong> +91 9800-088-939</p>
              <p className="text-gray-700"><strong>Address:</strong> 123 Pizza Street, Mumbai, India</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DataProtection;
