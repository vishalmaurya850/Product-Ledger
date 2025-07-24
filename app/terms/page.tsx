// TermsAndConditions.tsx
import React from 'react';
import Link from 'next/link'; // Import Link for Next.js navigation
import { Home } from 'lucide-react'; // Assuming lucide-react is installed for icons

const TermsAndConditions: React.FC = () => {
  return (
    <div className="min-h-screen  text-gray-100 font-sans antialiased">
      {/* Modernized Header with Home Button */}
      <header className="sticky top-0 z-10 w-full bg-gray-950/80 backdrop-blur-sm border-b border-gray-800 py-4 px-6">
        <div className="container mx-auto max-w-7xl flex items-center">
          <Link href="/" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200">
            <Home className="h-5 w-5" />
            <span className="text-sm font-medium hidden sm:inline">Back to Home</span>
          </Link>
          {/* You can add a subtle logo or page title here if desired, e.g., Product Ledger */}
          <div className="flex-grow text-center">
            <h1 className="text-lg font-bold text-white tracking-tight">Terms & Conditions</h1>
          </div>
          {/* Spacer to balance the layout if needed */}
          <div className="w-auto h-5 sm:w-[130px]"></div> {/* Approx width of the button + text for centering effect */}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-6 py-12 max-w-3xl lg:max-w-4xl">
        {/* Title can be integrated into the header or remain here with adjusted styling */}
        {/* <h1 className="text-4xl font-extrabold text-white mb-8 text-center md:text-left">Terms & Conditions for Product Ledger</h1> */}

        <section className="mb-10 p-6 rounded-lg bg-gray-900 border border-gray-800 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Introduction</h2>
          <p className="mb-4 text-gray-300 leading-relaxed">
            Welcome to Product Ledger! These Terms & Conditions ("Terms") govern your use of the Product Ledger website and financial management services (the "Service") provided by [Your Company Name/Product Ledger]. By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Please read these Terms carefully before using our Service.
          </p>
        </section>

        <section className="mb-10 p-6 rounded-lg bg-gray-900 border border-gray-800 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">1. Accounts</h2>
          <ul className="list-disc list-inside ml-6 mb-4 text-gray-300 space-y-2">
            <li>
              <strong className="text-white">Account Responsibility:</strong> When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
            </li>
            <li>
              <strong className="text-white">Security:</strong> You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service. You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
            </li>
            <li>
              <strong className="text-white">Age Restriction:</strong> You must be at least 18 years of age to use our Service. By using our Service, you represent and warrant that you are at least 18 years of age.
            </li>
          </ul>
        </section>

        <section className="mb-10 p-6 rounded-lg bg-gray-900 border border-gray-800 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">2. Subscription and Payments</h2>
          <ul className="list-disc list-inside ml-6 mb-4 text-gray-300 space-y-2">
            <li>
              <strong className="text-white">Pricing:</strong> Our Service may offer various subscription plans. Details of these plans and their respective pricing are available on our Pricing page. We reserve the right to change our subscription fees upon prior notice.
            </li>
            <li>
              <strong className="text-white">Billing:</strong> You will be billed in advance on a recurring and periodic basis (e.g., monthly or annually), depending on the subscription plan you select. Payment will be charged to your chosen payment method at the commencement of your subscription and automatically renewed unless you cancel.
            </li>
            <li>
              <strong className="text-white">Cancellations and Refunds:</strong> You can cancel your subscription at any time. Cancellations will take effect at the end of the current billing cycle. We generally do not offer refunds for partial subscription periods. Please refer to our Refund Policy (if separate) for more details.
            </li>
          </ul>
        </section>

        <section className="mb-10 p-6 rounded-lg bg-gray-900 border border-gray-800 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">3. User Content</h2>
          <ul className="list-disc list-inside ml-6 mb-4 text-gray-300 space-y-2">
            <li>
              <strong className="text-white">Your Data:</strong> You retain all rights and ownership of the financial data and other content you submit, post, or display on or through the Service ("User Content").
            </li>
            <li>
              <strong className="text-white">License to Product Ledger:</strong> By posting User Content, you grant Product Ledger a worldwide, non-exclusive, royalty-free, transferable license to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display such User Content in connection with providing and improving the Service. This license terminates when you delete your User Content or your account, unless your User Content has been shared with others and they have not deleted it.
            </li>
            <li>
              <strong className="text-white">Responsibility for Content:</strong> You are solely responsible for the User Content you post and for any consequences arising from posting it. You agree that you will not post any User Content that is illegal, offensive, harmful, defamatory, or infringes on the rights of others.
            </li>
          </ul>
        </section>

        <section className="mb-10 p-6 rounded-lg bg-gray-900 border border-gray-800 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">4. Intellectual Property</h2>
          <p className="text-gray-300 leading-relaxed">
            The Service and its original content (excluding User Content), features, and functionality are and will remain the exclusive property of Product Ledger and its licensors. The Service is protected by copyright, trademark, and other laws of both [Your Country] and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Product Ledger.
          </p>
        </section>

        <section className="mb-10 p-6 rounded-lg bg-gray-900 border border-gray-800 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">5. Prohibited Uses</h2>
          <p className="mb-4 text-gray-300 leading-relaxed">You may use the Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service:</p>
          <ul className="list-disc list-inside ml-6 mb-4 text-gray-300 space-y-2">
            <li>In any way that violates any applicable national or international law or regulation.</li>
            <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way.</li>
            <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail," "chain letter," "spam," or any other similar solicitation.</li>
            <li>To impersonate or attempt to impersonate Product Ledger, a Product Ledger employee, another user, or any other person or entity.</li>
            <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service, or which, as determined by us, may harm Product Ledger or users of the Service or expose them to liability.</li>
          </ul>
        </section>

        <section className="mb-10 p-6 rounded-lg bg-gray-900 border border-gray-800 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">6. Termination</h2>
          <p className="text-gray-300 leading-relaxed">
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service.
          </p>
        </section>

        <section className="mb-10 p-6 rounded-lg bg-gray-900 border border-gray-800 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">7. Disclaimer of Warranties</h2>
          <p className="text-gray-300 leading-relaxed">
            Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance. Product Ledger does not warrant that the Service will be uninterrupted, secure, or error-free.
          </p>
        </section>

        <section className="mb-10 p-6 rounded-lg bg-gray-900 border border-gray-800 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">8. Limitation of Liability</h2>
          <p className="text-gray-300 leading-relaxed">
            In no event shall Product Ledger, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.
          </p>
        </section>

        <section className="mb-10 p-6 rounded-lg bg-gray-900 border border-gray-800 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">9. Governing Law</h2>
          <p className="text-gray-300 leading-relaxed">
            These Terms shall be governed and construed in accordance with the laws of [Your Country], without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
          </p>
        </section>

        <section className="mb-10 p-6 rounded-lg bg-gray-900 border border-gray-800 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">10. Changes to Terms & Conditions</h2>
          <p className="text-gray-300 leading-relaxed">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
          </p>
        </section>

        <section className="p-6 rounded-lg bg-gray-900 border border-gray-800 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Contact Us</h2>
          <p className="mb-4 text-gray-300 leading-relaxed">
            If you have any questions about these Terms & Conditions, please contact us:
          </p>
          <ul className="list-disc list-inside ml-6 text-gray-300 space-y-2">
            <li>By email: <a href="mailto:support@productledger.com" className="text-blue-400 hover:underline">support@productledger.com</a></li>
            <li>By visiting this page on our website: <Link href="/contact" className="text-blue-400 hover:underline">[Your Contact Page URL]</Link></li> {/* Assuming you have a contact page */}
          </ul>
        </section>

        <p className="text-sm text-gray-400 mt-12 text-right">Last updated: July 23, 2025</p>
      </main>
    </div>
  );
};

export default TermsAndConditions;