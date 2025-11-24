<<<<<<< HEAD
import Link from "next/link"
import { ArrowLeft, FileText, Shield, CheckCircle2, AlertTriangle, Scale } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LandingNavbar } from "@/components/landing/landing-navbar"
import { LandingFooter } from "@/components/landing/landing-footer"

export default function TermsOfServicePage() {
  const keyPoints = [
    {
      icon: Shield,
      title: "Your Protection",
      description: "Clear terms that protect your rights"
    },
    {
      icon: Scale,
      title: "Fair Usage",
      description: "Balanced terms for all parties"
    },
    {
      icon: CheckCircle2,
      title: "Transparency",
      description: "No hidden clauses or surprises"
    },
    {
      icon: AlertTriangle,
      title: "Your Obligations",
      description: "What we expect from users"
    }
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <LandingNavbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background via-muted/50 to-background">
          <div className="container px-4 mx-auto md:px-6">
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="p-4 rounded-full bg-primary/10 animate-pulse">
                <FileText className="h-16 w-16 text-primary" />
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Terms of Service
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground text-lg">
                  Legal terms governing your use of Product Ledger by BONSOI Systems
                </p>
                <p className="text-sm text-muted-foreground">
                  Last updated: November 24, 2025
                </p>
              </div>

              {/* Key Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 w-full max-w-5xl">
                {keyPoints.map((item, index) => (
                  <Card key={index} className="border-primary/20 hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex flex-col items-center text-center space-y-2">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <item.icon className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-base">{item.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground text-center">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="w-full py-12 md:py-24 bg-muted/30">
          <div className="container px-4 mx-auto md:px-6">
            <div className="max-w-4xl mx-auto">
              <Card className="shadow-xl border-primary/10">
                <CardContent className="p-8 md:p-12 prose prose-gray dark:prose-invert max-w-none">
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                        <span className="h-1 w-8 bg-primary rounded"></span>
                        1. Agreement to Terms
                      </h2>
                      <p className="text-base leading-relaxed">
                        By accessing or using <strong>Product Ledger</strong> ("Service"), a product of <strong>BONSOI Systems</strong>, you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, you may not access the Service.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                        <span className="h-1 w-8 bg-primary rounded"></span>
                        2. Description of Service
                      </h2>
                      <p className="text-base leading-relaxed mb-3">
                        Product Ledger provides a cloud-based financial management platform that includes:
                      </p>
                      <ul className="space-y-2 ml-6">
                        <li className="text-base">Ledger and transaction management</li>
                        <li className="text-base">Customer relationship management</li>
                        <li className="text-base">Product inventory tracking</li>
                        <li className="text-base">Invoice generation and management</li>
                        <li className="text-base">Financial reporting and analytics</li>
                        <li className="text-base">Payment tracking and reminders</li>
                      </ul>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                        <span className="h-1 w-8 bg-primary rounded"></span>
                        3. User Accounts
                      </h2>
                      <p className="text-base leading-relaxed mb-3">
                        When you create an account with us, you must provide accurate, complete, and current information. You are responsible for:
                      </p>
                      <ul className="space-y-2 ml-6">
                        <li className="text-base">Safeguarding your account password</li>
                        <li className="text-base">All activities that occur under your account</li>
                        <li className="text-base">Notifying us immediately of any unauthorized use</li>
                        <li className="text-base">Ensuring your use complies with applicable laws</li>
                      </ul>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                        <span className="h-1 w-8 bg-primary rounded"></span>
                        4. Acceptable Use
                      </h2>
                      <p className="text-base leading-relaxed mb-3">You agree not to:</p>
                      <ul className="space-y-2 ml-6">
                        <li className="text-base">Use the Service for any illegal purpose</li>
                        <li className="text-base">Violate any laws in your jurisdiction</li>
                        <li className="text-base">Infringe on intellectual property rights</li>
                        <li className="text-base">Transmit any malicious code or viruses</li>
                        <li className="text-base">Attempt to gain unauthorized access to the Service</li>
                        <li className="text-base">Interfere with or disrupt the Service</li>
                        <li className="text-base">Use the Service to send spam or unsolicited communications</li>
                        <li className="text-base">Impersonate any person or entity</li>
                      </ul>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                        <span className="h-1 w-8 bg-primary rounded"></span>
                        5. Subscription and Payments
                      </h2>
                      <p className="text-base leading-relaxed mb-2">
                        <strong>Billing:</strong> Subscription fees are billed in advance on a monthly or annual basis depending on your chosen plan.
                      </p>
                      <p className="text-base leading-relaxed mb-2">
                        <strong>Auto-renewal:</strong> Your subscription will automatically renew unless you cancel before the renewal date.
                      </p>
                      <p className="text-base leading-relaxed mb-2">
                        <strong>Refunds:</strong> We offer a 30-day money-back guarantee for new subscriptions. Refunds after this period are at our discretion.
                      </p>
                      <p className="text-base leading-relaxed">
                        <strong>Price Changes:</strong> We may modify subscription fees with 30 days' notice. Changes apply to subsequent billing cycles.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                        <span className="h-1 w-8 bg-primary rounded"></span>
                        6. Data Ownership and Usage
                      </h2>
                      <p className="text-base leading-relaxed mb-2">
                        <strong>Your Data:</strong> You retain all rights to the data you input into the Service. We claim no ownership over your content.
                      </p>
                      <p className="text-base leading-relaxed mb-2">
                        <strong>License:</strong> You grant us a license to use, store, and backup your data to provide the Service.
                      </p>
                      <p className="text-base leading-relaxed">
                        <strong>Data Protection:</strong> We implement industry-standard security measures to protect your data. See our <Link href="/privacy" className="text-primary hover:underline font-semibold">Privacy Policy</Link> for details.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                        <span className="h-1 w-8 bg-primary rounded"></span>
                        7. Service Availability
                      </h2>
                      <p className="text-base leading-relaxed mb-3">
                        We strive to maintain 99.9% uptime but cannot guarantee uninterrupted service. We are not liable for:
                      </p>
                      <ul className="space-y-2 ml-6">
                        <li className="text-base">Scheduled maintenance downtime</li>
                        <li className="text-base">Service disruptions beyond our control</li>
                        <li className="text-base">Third-party service failures</li>
                        <li className="text-base">Network or infrastructure issues</li>
                      </ul>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                        <span className="h-1 w-8 bg-primary rounded"></span>
                        8. Intellectual Property
                      </h2>
                      <p className="text-base leading-relaxed">
                        The Service and its original content, features, and functionality are owned by BONSOI Systems and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                        <span className="h-1 w-8 bg-primary rounded"></span>
                        9. Termination
                      </h2>
                      <p className="text-base leading-relaxed mb-2">
                        <strong>By You:</strong> You may cancel your subscription at any time from your account settings.
                      </p>
                      <p className="text-base leading-relaxed mb-2">
                        <strong>By Us:</strong> We may terminate or suspend your account immediately if you breach these Terms, without prior notice or liability.
                      </p>
                      <p className="text-base leading-relaxed">
                        <strong>Effect of Termination:</strong> Upon termination, your right to use the Service will cease immediately. You may export your data within 30 days of termination.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                        <span className="h-1 w-8 bg-primary rounded"></span>
                        10. Limitation of Liability
                      </h2>
                      <p className="text-base leading-relaxed mb-2">
                        To the maximum extent permitted by law, BONSOI Systems and Product Ledger shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities.
                      </p>
                      <p className="text-base leading-relaxed">
                        Our total liability shall not exceed the amount you paid us in the 12 months before the claim arose.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                        <span className="h-1 w-8 bg-primary rounded"></span>
                        11. Indemnification
                      </h2>
                      <p className="text-base leading-relaxed">
                        You agree to indemnify and hold harmless BONSOI Systems and Product Ledger from any claims, damages, losses, liabilities, and expenses arising from your use of the Service or violation of these Terms.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                        <span className="h-1 w-8 bg-primary rounded"></span>
                        12. Disclaimer of Warranties
                      </h2>
                      <p className="text-base leading-relaxed">
                        The Service is provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                        <span className="h-1 w-8 bg-primary rounded"></span>
                        13. Changes to Terms
                      </h2>
                      <p className="text-base leading-relaxed">
                        We reserve the right to modify these Terms at any time. We will notify you of significant changes via email or through the Service. Your continued use after changes constitutes acceptance of the new Terms.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                        <span className="h-1 w-8 bg-primary rounded"></span>
                        14. Governing Law
                      </h2>
                      <p className="text-base leading-relaxed">
                        These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                        <span className="h-1 w-8 bg-primary rounded"></span>
                        15. Dispute Resolution
                      </h2>
                      <p className="text-base leading-relaxed">
                        Any disputes arising from these Terms or the Service shall be resolved through binding arbitration, except where prohibited by law. You waive your right to participate in class actions.
                      </p>
                    </div>

                    <div className="bg-muted/50 p-6 rounded-lg border-l-4 border-primary">
                      <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                        <span className="h-1 w-8 bg-primary rounded"></span>
                        16. Contact Information
                      </h2>
                      <p className="text-base leading-relaxed mb-4">
                        For questions about these Terms, please contact us:
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <strong className="min-w-[100px]">Company:</strong>
                          <span>BONSOI Systems</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <strong className="min-w-[100px]">Product:</strong>
                          <span>Product Ledger</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <strong className="min-w-[100px]">Email:</strong>
                          <a href="mailto:bonsoisystems@gmail.com" className="text-primary hover:underline">bonsoisystems@gmail.com</a>
                        </div>
                        <div className="flex items-center gap-3">
                          <strong className="min-w-[100px]">Phone:</strong>
                          <a href="tel:+919628525211" className="text-primary hover:underline">+91 96285 25211</a>
                        </div>
                      </div>
                    </div>

                    <div className="text-center pt-8 border-t mt-8">
                      <Link href="/">
                        <Button size="lg" variant="outline" className="gap-2">
                          <ArrowLeft className="h-4 w-4" />
                          Back to Home
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  )
}
=======
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
            <li>By email:  bonsoisystems@gmail.com<a href="mailto:support@productledger.com" className="text-blue-400 hover:underline">support@productledger.com</a></li>
            <li>By visiting this page on our website:https://bonsoi.vercel.app </li> {/* Assuming you have a contact page */}
          </ul>
        </section>

        <p className="text-sm text-gray-400 mt-12 text-right">Last updated: July 23, 2025</p>
      </main>
    </div>
  );
};

export default TermsAndConditions;
>>>>>>> 5d2afdf1da669018d0f5aae77b62470d7f05bce3
