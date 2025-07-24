// PrivacyPolicy.tsx
import React from 'react';
import Link from 'next/link'; // Import Link for Next.js navigation
import { Home } from 'lucide-react'; // Assuming lucide-react is installed for icons

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen  text-gray-100 font-sans antialiased">
      {/* Modernized Header with Home Button */}
      <header className="sticky top-0 z-10 w-full bg-gray-950/90 backdrop-blur-sm border-b border-gray-800 py-4 px-6">
        <div className="container mx-auto max-w-7xl flex items-center">
          <Link href="/" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200">
            <Home className="h-5 w-5" />
            <span className="text-sm font-medium hidden sm:inline">Back to Home</span>
          </Link>
          {/* You can add a subtle logo or page title here if desired, e.g., Product Ledger */}
          <div className="flex-grow text-center">
            <h1 className="text-lg font-bold text-white tracking-tight">Privacy Policy</h1>
          </div>
          {/* Spacer to balance the layout if needed */}
          <div className="w-auto h-5 sm:w-[130px]"></div> {/* Approx width of the button + text for centering effect */}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-6 py-12 max-w-3xl lg:max-w-4xl">
        {/* Title now integrated into the header or can remain here with adjusted styling */}
        {/* <h1 className="text-4xl font-extrabold text-white mb-8 text-center md:text-left">Privacy Policy for Product Ledger</h1> */}

        <section className="mb-10 p-6 rounded-lg bg-gray-900 border border-gray-800 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Introduction</h2>
          <p className="mb-4 text-gray-300 leading-relaxed">
            Welcome to Product Ledger! This Privacy Policy describes how Product Ledger ("we," "us," or "our") collects, uses, and discloses your information when you use our financial management system (the "Service"). We are committed to protecting your privacy and handling your data in an open and transparent manner.
          </p>
          <p className="text-gray-300 leading-relaxed">
            By accessing or using our Service, you agree to the collection, use, and disclosure of your information in accordance with this Privacy Policy. If you do not agree with the terms of this policy, please do not access or use our Service.
          </p>
        </section>

        <section className="mb-10 p-6 rounded-lg bg-gray-900 border border-gray-800 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Information We Collect</h2>
          <h3 className="text-xl font-semibold text-white mb-3 mt-6">1. Information You Provide to Us:</h3>
          <ul className="list-disc list-inside ml-6 mb-4 text-gray-300 space-y-2">
            <li><strong className="text-white">Account Information:</strong> When you register for an account, we collect personal information such as your name, email address, password, and contact details.</li>
            <li><strong className="text-white">Financial Data:</strong> As a financial management system, we collect financial information you input, including but not limited to, transaction details, income, expenses, bank account details (encrypted and securely stored), inventory data, and overdue payments.</li>
            <li><strong className="text-white">Communication Data:</strong> If you contact us for support, send us feedback, or participate in surveys, we collect the content of your communications and any information you provide.</li>
          </ul>

          <h3 className="text-xl font-semibold text-white mb-3 mt-6">2. Information We Collect Automatically:</h3>
          <ul className="list-disc list-inside ml-6 mb-4 text-gray-300 space-y-2">
            <li><strong className="text-white">Usage Data:</strong> We collect information about your interactions with the Service, such as the pages you visit, the features you use, the time and date of your access, and the duration of your sessions.</li>
            <li><strong className="text-white">Device Information:</strong> We may collect information about the device you use to access the Service, including IP address, browser type, operating system, and device identifiers.</li>
            <li><strong className="text-white">Cookies and Tracking Technologies:</strong> We use cookies and similar tracking technologies to track activity on our Service and hold certain information. Please refer to our <Link href="/cookie-policy" className="text-blue-400 hover:underline">Cookie Policy</Link> for more details.</li>
          </ul>
        </section>

        <section className="mb-10 p-6 rounded-lg bg-gray-900 border border-gray-800 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">How We Use Your Information</h2>
          <p className="mb-4 text-gray-300 leading-relaxed">We use the information we collect for various purposes, including:</p>
          <ul className="list-disc list-inside ml-6 mb-4 text-gray-300 space-y-2">
            <li>To provide, maintain, and improve our Service.</li>
            <li>To process your financial transactions and manage your accounts.</li>
            <li>To personalize your experience and deliver relevant content.</li>
            <li>To communicate with you, respond to your inquiries, and provide customer support.</li>
            <li>To send you updates, security alerts, and administrative messages.</li>
            <li>To monitor and analyze usage and trends to improve our Service.</li>
            <li>To detect, prevent, and address technical issues, fraud, or other illegal activities.</li>
            <li>To comply with legal obligations.</li>
          </ul>
        </section>

        <section className="mb-10 p-6 rounded-lg bg-gray-900 border border-gray-800 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">How We Share Your Information</h2>
          <p className="mb-4 text-gray-300 leading-relaxed">We may share your information in the following situations:</p>
          <ul className="list-disc list-inside ml-6 mb-4 text-gray-300 space-y-2">
            <li><strong className="text-white">With Service Providers:</strong> We may share your information with third-party vendors and service providers who perform services on our behalf, such as hosting, data analysis, payment processing, and customer support.</li>
            <li><strong className="text-white">For Business Transfers:</strong> In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
            <li><strong className="text-white">With Your Consent:</strong> We may disclose your personal information for any purpose with your consent.</li>
            <li><strong className="text-white">Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or a government agency).</li>
            <li><strong className="text-white">To Enforce Rights:</strong> To enforce our <Link href="/terms-and-conditions" className="text-blue-400 hover:underline">Terms & Conditions</Link> and other agreements, and protect our rights, privacy, safety, or property, and/or that of our affiliates, you, or others.</li>
          </ul>
        </section>

        <section className="mb-10 p-6 rounded-lg bg-gray-900 border border-gray-800 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Data Security</h2>
          <p className="text-gray-300 leading-relaxed">
            We implement reasonable security measures designed to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or method of electronic storage is 100% secure. Therefore, while we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
          </p>
        </section>

        <section className="mb-10 p-6 rounded-lg bg-gray-900 border border-gray-800 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Your Data Protection Rights</h2>
          <p className="mb-4 text-gray-300 leading-relaxed">Depending on your location, you may have the following rights regarding your personal data:</p>
          <ul className="list-disc list-inside ml-6 mb-4 text-gray-300 space-y-2">
            <li>The right to access, update, or delete the information we have on you.</li>
            <li>The right to rectify any inaccurate or incomplete information.</li>
            <li>The right to object to our processing of your personal data.</li>
            <li>The right to request the restriction of processing your personal data.</li>
            <li>The right to data portability.</li>
            <li>The right to withdraw consent at any time where Product Ledger relied on your consent to process your personal information.</li>
          </ul>
          <p className="text-gray-300 leading-relaxed">To exercise any of these rights, please contact us at <a href="mailto:support@productledger.com" className="text-blue-400 hover:underline">support@productledger.com</a>.</p>
        </section>

        <section className="mb-10 p-6 rounded-lg bg-gray-900 border border-gray-800 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Links to Other Websites</h2>
          <p className="text-gray-300 leading-relaxed">
            Our Service may contain links to other websites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
          </p>
        </section>

        <section className="mb-10 p-6 rounded-lg bg-gray-900 border border-gray-800 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Changes to This Privacy Policy</h2>
          <p className="text-gray-300 leading-relaxed">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
          </p>
        </section>

        <section className="p-6 rounded-lg bg-gray-900 border border-gray-800 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Contact Us</h2>
          <p className="mb-4 text-gray-300 leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <ul className="list-disc list-inside ml-6 text-gray-300 space-y-2">
            <li>By email:  bonsoisystems@gmail.com<a href="mailto:support@productledger.com" className="text-blue-400 hover:underline">support@productledger.com</a></li>
            <li>By visiting this page on our website:https://bonsoi.vercel.app </li> {/* Assuming you have a contact page */}
          </ul>
        </section>

        <p className="text-sm text-gray-400 mt-12 text-right">Last updated: July 23, 2025</p>
      </main>
    </div>
  );
};

export default PrivacyPolicy;