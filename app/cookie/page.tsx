// CookiePolicy.tsx
import React from 'react';
import Link from 'next/link'; // Import Link for Next.js navigation
import { Home } from 'lucide-react'; // Assuming lucide-react is installed for icons

const CookiePolicy: React.FC = () => {
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
            <h1 className="text-lg font-bold text-white tracking-tight">Cookie Policy</h1>
          </div>
          {/* Spacer to balance the layout if needed */}
          <div className="w-auto h-5 sm:w-[130px]"></div> {/* Approx width of the button + text for centering effect */}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-6 py-12 max-w-3xl lg:max-w-4xl">
        {/* Title can be integrated into the header or remain here with adjusted styling */}
        {/* <h1 className="text-4xl font-extrabold text-white mb-8 text-center md:text-left">Cookie Policy for Product Ledger</h1> */}

        <section className="mb-10 p-6 rounded-lg bg-gray-900 border border-gray-800 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">What Are Cookies?</h2>
          <p className="text-gray-300 leading-relaxed">
            Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work or work more efficiently, as well as to provide reporting information. Cookies help us to remember information about your visit, like your preferred language and other settings. This can make your next visit easier and the site more useful to you.
          </p>
        </section>

        <section className="mb-10 p-6 rounded-lg bg-gray-900 border border-gray-800 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">How We Use Cookies</h2>
          <p className="mb-4 text-gray-300 leading-relaxed">
            Product Ledger uses cookies for a variety of purposes. We use both session cookies (which are deleted when you close your browser) and persistent cookies (which remain on your device for a set period or until you delete them). The cookies we use fall into the following categories:
          </p>
          <h3 className="text-xl font-semibold text-white mb-3 mt-6">1. Essential Cookies:</h3>
          <p className="mb-4 text-gray-300 leading-relaxed">
            These cookies are strictly necessary for the operation of our Service. They enable you to navigate around the website and use its features, such as accessing secure areas of the site and using financial management functionalities. Without these cookies, services you have asked for cannot be provided.
          </p>
          <ul className="list-disc list-inside ml-6 mb-4 text-gray-300 space-y-2">
            <li><strong className="text-white">Remembering your login details.</strong></li>
            <li><strong className="text-white">Ensuring the security of your account.</strong></li>
            <li><strong className="text-white">Maintaining your session state.</strong></li>
          </ul>

          <h3 className="text-xl font-semibold text-white mb-3 mt-6">2. Analytical/Performance Cookies:</h3>
          <p className="mb-4 text-gray-300 leading-relaxed">
            These cookies collect information about how visitors use our Service, for instance, which pages visitors go to most often, and if they get error messages from web pages. These cookies don’t collect information that identifies a visitor. All information these cookies collect is aggregated and therefore anonymous. It is only used to improve how our Service works.
          </p>
          <ul className="list-disc list-inside ml-6 mb-4 text-gray-300 space-y-2">
            <li><strong className="text-white">Tracking website traffic and performance.</strong></li>
            <li><strong className="text-white">Understanding which features are most used.</strong></li>
            <li><strong className="text-white">Identifying and fixing errors.</strong></li>
          </ul>

          <h3 className="text-xl font-semibold text-white mb-3 mt-6">3. Functionality Cookies:</h3>
          <p className="mb-4 text-gray-300 leading-relaxed">
            These cookies allow our Service to remember choices you make (such as your username, language, or the region you are in) and provide enhanced, more personal features. For example, our Service may be able to provide you with local weather reports or traffic news by storing in a cookie the region in which you are currently located. These cookies can also be used to remember changes you have made to text size, fonts, and other parts of web pages that you can customize.
          </p>
          <ul className="list-disc list-inside ml-6 mb-4 text-gray-300 space-y-2">
            <li><strong className="text-white">Remembering your preferences and settings.</strong></li>
            <li><strong className="text-white">Providing personalized content.</strong></li>
          </ul>

          <h3 className="text-xl font-semibold text-white mb-3 mt-6">4. Targeting/Advertising Cookies:</h3>
          <p className="mb-4 text-gray-300 leading-relaxed">
            These cookies are used to deliver advertisements more relevant to you and your interests. They are also used to limit the number of times you see an advertisement as well as help measure the effectiveness of the advertising campaign. They are usually placed by advertising networks with the website operator’s permission. They remember that you have visited a website and this information is shared with other organizations such as advertisers.
          </p>
          <ul className="list-disc list-inside ml-6 mb-4 text-gray-300 space-y-2">
            <li><strong className="text-white">Displaying relevant ads.</strong></li>
            <li><strong className="text-white">Measuring ad campaign performance.</strong></li>
          </ul>
        </section>

        <section className="mb-10 p-6 rounded-lg bg-gray-900 border border-gray-800 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Third-Party Cookies</h2>
          <p className="text-gray-300 leading-relaxed">
            In addition to our own cookies, we may also use various third-parties cookies to report usage statistics of the Service, deliver advertisements on and through the Service, and so on. These third parties may include analytics providers, advertising networks, and social media platforms. We do not control the cookies placed by third parties.
          </p>
        </section>

        <section className="mb-10 p-6 rounded-lg bg-gray-900 border border-gray-800 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Your Cookie Choices</h2>
          <p className="mb-4 text-gray-300 leading-relaxed">
            You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by adjusting the settings on your browser. Most web browsers allow some control of most cookies through the browser settings.
          </p>
          <ul className="list-disc list-inside ml-6 mb-4 text-gray-300 space-y-2">
            <li>You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</li>
            <li>Note that by disabling cookies, some features of our Service may not function properly.</li>
            <li>For more information about cookies and how to manage them, visit <a href="http://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">www.allaboutcookies.org</a>.</li>
          </ul>
        </section>

        <section className="mb-10 p-6 rounded-lg bg-gray-900 border border-gray-800 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Changes to Our Cookie Policy</h2>
          <p className="text-gray-300 leading-relaxed">
            We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the "Last updated" date at the top of this Cookie Policy. You are advised to review this Cookie Policy periodically for any changes. Changes to this Cookie Policy are effective when they are posted on this page.
          </p>
        </section>

        <section className="p-6 rounded-lg bg-gray-900 border border-gray-800 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Contact Us</h2>
          <p className="mb-4 text-gray-300 leading-relaxed">
            If you have any questions about this Cookie Policy, please contact us:
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

export default CookiePolicy;