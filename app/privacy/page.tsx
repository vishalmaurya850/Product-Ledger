import Link from "next/link"
import { ArrowLeft, Shield, Lock, Eye, FileCheck, Users, Database, Bell, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LandingNavbar } from "@/components/landing/landing-navbar"
import { LandingFooter } from "@/components/landing/landing-footer"

export default function PrivacyPolicyPage() {
  const highlights = [
    {
      icon: Lock,
      title: "Data Security",
      description: "Bank-level encryption to protect your information"
    },
    {
      icon: Eye,
      title: "Transparency",
      description: "Clear information about data collection and usage"
    },
    {
      icon: FileCheck,
      title: "Your Rights",
      description: "Full control over your personal data"
    },
    {
      icon: Users,
      title: "No Selling",
      description: "We never sell your personal information"
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
                <Shield className="h-16 w-16 text-primary" />
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Privacy Policy
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground text-lg">
                  Your privacy is important to us. Learn how BONSOI Systems protects your data.
                </p>
                <p className="text-sm text-muted-foreground">
                  Last updated: November 24, 2025
                </p>
              </div>

              {/* Key Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 w-full max-w-5xl">
                {highlights.map((item, index) => (
                  <Card key={index} className="border-primary/20">
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
                        1. Introduction
                      </h2>
                      <p className="text-base leading-relaxed">
                        Welcome to <strong>Product Ledger</strong>, a product of <strong>BONSOI Systems</strong> ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website or use our services.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                        <span className="h-1 w-8 bg-primary rounded"></span>
                        2. Information We Collect
                      </h2>
                      <p className="text-base leading-relaxed mb-3">We collect and process the following types of information:</p>
                      <ul className="space-y-2 ml-6">
                        <li className="text-base"><strong>Account Information:</strong> Name, email address, phone number, company details</li>
                        <li className="text-base"><strong>Business Data:</strong> Customer information, financial transactions, product inventory</li>
                        <li className="text-base"><strong>Usage Data:</strong> How you interact with our service, features you use, time spent</li>
                        <li className="text-base"><strong>Technical Data:</strong> IP address, browser type, device information, cookies</li>
                        <li className="text-base"><strong>Communication Data:</strong> Correspondence with our support team</li>
                      </ul>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                        <span className="h-1 w-8 bg-primary rounded"></span>
                        3. How We Use Your Information
                      </h2>
                      <p className="text-base leading-relaxed mb-3">We use your information to:</p>
                      <ul className="space-y-2 ml-6">
                        <li className="text-base">Provide and maintain our services</li>
                        <li className="text-base">Process your transactions and manage your account</li>
                        <li className="text-base">Send you important updates and notifications</li>
                        <li className="text-base">Improve our services and develop new features</li>
                        <li className="text-base">Provide customer support</li>
                        <li className="text-base">Ensure security and prevent fraud</li>
                        <li className="text-base">Comply with legal obligations</li>
                      </ul>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                        <span className="h-1 w-8 bg-primary rounded"></span>
                        4. Data Storage and Security
                      </h2>
                      <p className="text-base leading-relaxed mb-3">
                        We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. Your data is stored on secure servers with encryption both in transit and at rest.
                      </p>
                      <ul className="space-y-2 ml-6">
                        <li className="text-base">Industry-standard SSL/TLS encryption</li>
                        <li className="text-base">Regular security audits and updates</li>
                        <li className="text-base">Access controls and authentication</li>
                        <li className="text-base">Automated backups and disaster recovery</li>
                        <li className="text-base">Staff training on data protection</li>
                      </ul>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                        <span className="h-1 w-8 bg-primary rounded"></span>
                        5. Data Sharing and Disclosure
                      </h2>
                      <p className="text-base leading-relaxed mb-3">We do not sell your personal data. We may share your information with:</p>
                      <ul className="space-y-2 ml-6">
                        <li className="text-base"><strong>Service Providers:</strong> Third-party services that help us operate (hosting, payment processing, analytics)</li>
                        <li className="text-base"><strong>Legal Compliance:</strong> When required by law or to protect our legal rights</li>
                        <li className="text-base"><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                      </ul>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                        <span className="h-1 w-8 bg-primary rounded"></span>
                        6. Your Rights
                      </h2>
                      <p className="text-base leading-relaxed mb-3">Under data protection laws, you have the right to:</p>
                      <ul className="space-y-2 ml-6">
                        <li className="text-base">Access your personal data</li>
                        <li className="text-base">Correct inaccurate data</li>
                        <li className="text-base">Request deletion of your data</li>
                        <li className="text-base">Export your data in a portable format</li>
                        <li className="text-base">Withdraw consent at any time</li>
                        <li className="text-base">Object to processing of your data</li>
                        <li className="text-base">Lodge a complaint with a supervisory authority</li>
                      </ul>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                        <span className="h-1 w-8 bg-primary rounded"></span>
                        7. Cookies and Tracking
                      </h2>
                      <p className="text-base leading-relaxed">
                        We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. See our <Link href="/cookie" className="text-primary hover:underline font-semibold">Cookie Policy</Link> for more details.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                        <span className="h-1 w-8 bg-primary rounded"></span>
                        8. Data Retention
                      </h2>
                      <p className="text-base leading-relaxed">
                        We retain your personal data only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law. When you delete your account, we will delete or anonymize your data within 30 days, except where we need to retain it for legal compliance.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                        <span className="h-1 w-8 bg-primary rounded"></span>
                        9. Children's Privacy
                      </h2>
                      <p className="text-base leading-relaxed">
                        Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal data, please contact us immediately.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                        <span className="h-1 w-8 bg-primary rounded"></span>
                        10. International Data Transfers
                      </h2>
                      <p className="text-base leading-relaxed">
                        Your information may be transferred to and maintained on computers located outside of your country where data protection laws may differ. We ensure appropriate safeguards are in place to protect your data.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                        <span className="h-1 w-8 bg-primary rounded"></span>
                        11. Changes to This Policy
                      </h2>
                      <p className="text-base leading-relaxed">
                        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                      </p>
                    </div>

                    <div className="bg-muted/50 p-6 rounded-lg border-l-4 border-primary">
                      <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                        <span className="h-1 w-8 bg-primary rounded"></span>
                        12. Contact Us
                      </h2>
                      <p className="text-base leading-relaxed mb-4">
                        If you have any questions about this Privacy Policy, please contact us:
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
