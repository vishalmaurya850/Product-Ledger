// CookiePolicy.tsx
import React from 'react';

const CookiePolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-8">Cookie Policy for Product Ledger</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">What Are Cookies?</h2>
          <p>
            Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work or work more efficiently, as well as to provide reporting information. Cookies help us to remember information about your visit, like your preferred language and other settings. This can make your next visit easier and the site more useful to you.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">How We Use Cookies</h2>
          <p className="mb-4">
            Product Ledger uses cookies for a variety of purposes. We use both session cookies (which are deleted when you close your browser) and persistent cookies (which remain on your device for a set period or until you delete them). The cookies we use fall into the following categories:
          </p>
          <h3 className="text-xl font-medium text-white mb-3">1. Essential Cookies:</h3>
          <p className="mb-4">
            These cookies are strictly necessary for the operation of our Service. They enable you to navigate around the website and use its features, such as accessing secure areas of the site and using financial management functionalities. Without these cookies, services you have asked for cannot be provided.
          </p>
          <ul className="list-disc list-inside ml-4 mb-4">
            <li className="mb-2">Remembering your login details.</li>
            <li className="mb-2">Ensuring the security of your account.</li>
            <li className="mb-2">Maintaining your session state.</li>
          </ul>

          <h3 className="text-xl font-medium text-white mb-3">2. Analytical/Performance Cookies:</h3>
          <p className="mb-4">
            These cookies collect information about how visitors use our Service, for instance, which pages visitors go to most often, and if they get error messages from web pages. These cookies don’t collect information that identifies a visitor. All information these cookies collect is aggregated and therefore anonymous. It is only used to improve how our Service works.
          </p>
          <ul className="list-disc list-inside ml-4 mb-4">
            <li className="mb-2">Tracking website traffic and performance.</li>
            <li className="mb-2">Understanding which features are most used.</li>
            <li className="mb-2">Identifying and fixing errors.</li>
          </ul>

          <h3 className="text-xl font-medium text-white mb-3">3. Functionality Cookies:</h3>
          <p className="mb-4">
            These cookies allow our Service to remember choices you make (such as your username, language, or the region you are in) and provide enhanced, more personal features. For example, our Service may be able to provide you with local weather reports or traffic news by storing in a cookie the region in which you are currently located. These cookies can also be used to remember changes you have made to text size, fonts, and other parts of web pages that you can customize.
          </p>
          <ul className="list-disc list-inside ml-4 mb-4">
            <li className="mb-2">Remembering your preferences and settings.</li>
            <li className="mb-2">Providing personalized content.</li>
          </ul>

          <h3 className="text-xl font-medium text-white mb-3">4. Targeting/Advertising Cookies:</h3>
          <p className="mb-4">
            These cookies are used to deliver advertisements more relevant to you and your interests. They are also used to limit the number of times you see an advertisement as well as help measure the effectiveness of the advertising campaign. They are usually placed by advertising networks with the website operator’s permission. They remember that you have visited a website and this information is shared with other organizations such as advertisers.
          </p>
          <ul className="list-disc list-inside ml-4 mb-4">
            <li className="mb-2">Displaying relevant ads.</li>
            <li className="mb-2">Measuring ad campaign performance.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Third-Party Cookies</h2>
          <p>
            In addition to our own cookies, we may also use various third-parties cookies to report usage statistics of the Service, deliver advertisements on and through the Service, and so on. These third parties may include analytics providers, advertising networks, and social media platforms. We do not control the cookies placed by third parties.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Your Cookie Choices</h2>
          <p className="mb-4">
            You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by adjusting the settings on your browser. Most web browsers allow some control of most cookies through the browser settings.
          </p>
          <ul className="list-disc list-inside ml-4 mb-4">
            <li className="mb-2">You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</li>
            <li className="mb-2">Note that by disabling cookies, some features of our Service may not function properly.</li>
            <li className="mb-2">For more information about cookies and how to manage them, visit <a href="http://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">www.allaboutcookies.org</a>.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Changes to Our Cookie Policy</h2>
          <p>
            We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the "Last updated" date at the top of this Cookie Policy. You are advised to review this Cookie Policy periodically for any changes. Changes to this Cookie Policy are effective when they are posted on this page.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
          <p>
            If you have any questions about this Cookie Policy, please contact us:
          </p>
          <ul className="list-disc list-inside ml-4">
            <li>By email: support@productledger.com</li>
            <li>By visiting this page on our website: [Your Contact Page URL]</li>
          </ul>
        </section>

        <p className="text-sm text-gray-400 mt-12 text-right">Last updated: July 23, 2025</p>
      </main>

      
    </div>
  );
};

export default CookiePolicy;