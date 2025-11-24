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
