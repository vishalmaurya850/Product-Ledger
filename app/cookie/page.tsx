import Link from "next/link"
import { ArrowLeft, Cookie } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LandingNavbar } from "@/components/landing/landing-navbar"
import { LandingFooter } from "@/components/landing/landing-footer"

export default function CookiePolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingNavbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 mx-auto md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="p-4 rounded-full bg-primary/10">
                <Cookie className="h-12 w-12 text-primary" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Cookie Policy
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground">
                  Last updated: November 24, 2025
                </p>
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
                        1. What Are Cookies?
                      </h2>
                      <p className="text-base leading-relaxed">
                        Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                        <span className="h-1 w-8 bg-primary rounded"></span>
                        2. How We Use Cookies
                      </h2>
                      <p className="text-base leading-relaxed mb-4">
                        Product Ledger uses cookies and similar tracking technologies to track activity on our Service and hold certain information. We use cookies for the following purposes:
                      </p>

                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-2">Essential Cookies</h3>
                          <p className="text-base leading-relaxed mb-2">These cookies are necessary for the Service to function and cannot be switched off:</p>
                          <ul className="space-y-2 ml-6">
                            <li className="text-base"><strong>Authentication:</strong> To keep you logged in and maintain your session</li>
                            <li className="text-base"><strong>Security:</strong> To protect against fraudulent activity and enhance security</li>
                            <li className="text-base"><strong>Preferences:</strong> To remember your settings and preferences</li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-2">Analytics Cookies</h3>
                          <p className="text-base leading-relaxed mb-2">These cookies help us understand how visitors interact with our Service:</p>
                          <ul className="space-y-2 ml-6">
                            <li className="text-base"><strong>Usage Analytics:</strong> To see which features are most popular</li>
                            <li className="text-base"><strong>Performance Monitoring:</strong> To track page load times and errors</li>
                            <li className="text-base"><strong>User Behavior:</strong> To understand user journey and improve UX</li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-2">Functional Cookies</h3>
                          <p className="text-base leading-relaxed mb-2">These cookies enable enhanced functionality and personalization:</p>
                          <ul className="space-y-2 ml-6">
                            <li className="text-base"><strong>Language Preferences:</strong> To remember your language choice</li>
                            <li className="text-base"><strong>Display Settings:</strong> To remember your theme (dark/light mode)</li>
                            <li className="text-base"><strong>Recent Activity:</strong> To show your recent actions and searches</li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-2">Advertising Cookies</h3>
                          <p className="text-base leading-relaxed mb-2">These cookies may be used to show you relevant advertisements:</p>
                          <ul className="space-y-2 ml-6">
                            <li className="text-base"><strong>Targeting:</strong> To show relevant ads based on your interests</li>
                            <li className="text-base"><strong>Frequency:</strong> To limit how often you see an advertisement</li>
                            <li className="text-base"><strong>Effectiveness:</strong> To measure advertising campaign performance</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                        <span className="h-1 w-8 bg-primary rounded"></span>
                        3. Types of Cookies We Use
                      </h2>

                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-2">Session Cookies</h3>
                          <p className="text-base leading-relaxed">
                            Temporary cookies that expire when you close your browser. These are essential for basic functionality like maintaining your login session.
                          </p>
                        </div>

                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-2">Persistent Cookies</h3>
                          <p className="text-base leading-relaxed">
                            Cookies that remain on your device for a specified period or until you delete them. These remember your preferences across multiple visits.
                          </p>
                        </div>

                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-2">First-Party Cookies</h3>
                          <p className="text-base leading-relaxed">
                            Cookies set by Product Ledger directly. We have full control over how these cookies are used.
                          </p>
                        </div>

                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-2">Third-Party Cookies</h3>
                          <p className="text-base leading-relaxed mb-2">
                            Cookies set by external services we use, such as:
                          </p>
                          <ul className="space-y-2 ml-6">
                            <li className="text-base">Google Analytics for website analytics</li>
                            <li className="text-base">Payment processors for secure transactions</li>
                            <li className="text-base">CDN providers for content delivery</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                        <span className="h-1 w-8 bg-primary rounded"></span>
                        4. Cookie Management
                      </h2>

                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-2">Browser Controls</h3>
                          <p className="text-base leading-relaxed mb-2">
                            Most web browsers allow you to control cookies through their settings. You can:
                          </p>
                          <ul className="space-y-2 ml-6">
                            <li className="text-base">View cookies stored on your device</li>
                            <li className="text-base">Delete all cookies or specific cookies</li>
                            <li className="text-base">Block cookies from being set</li>
                            <li className="text-base">Set preferences for specific websites</li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-2">Browser-Specific Instructions</h3>
                          <ul className="space-y-2 ml-6">
                            <li className="text-base"><strong>Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
                            <li className="text-base"><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
                            <li className="text-base"><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                            <li className="text-base"><strong>Edge:</strong> Settings → Cookies and site permissions → Manage cookies</li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-2">Opt-Out Options</h3>
                          <p className="text-base leading-relaxed mb-2">
                            You can opt out of specific cookie types:
                          </p>
                          <ul className="space-y-2 ml-6">
                            <li className="text-base"><strong>Analytics:</strong> Through your account settings or browser extensions</li>
                            <li className="text-base"><strong>Advertising:</strong> Via <a href="http://optout.aboutads.info" className="text-primary hover:underline font-semibold" target="_blank" rel="noopener noreferrer">DAA opt-out page</a></li>
                            <li className="text-base"><strong>Third-party:</strong> Through individual service provider settings</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                        <span className="h-1 w-8 bg-primary rounded"></span>
                        5. Impact of Disabling Cookies
                      </h2>
                      <p className="text-base leading-relaxed mb-3">
                        If you choose to disable cookies, some features of the Service may not function properly:
                      </p>
                      <ul className="space-y-2 ml-6">
                        <li className="text-base">You may need to log in repeatedly</li>
                        <li className="text-base">Your preferences may not be saved</li>
                        <li className="text-base">Some features may be unavailable</li>
                        <li className="text-base">Pages may load more slowly</li>
                        <li className="text-base">You may see less relevant content</li>
                      </ul>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                        <span className="h-1 w-8 bg-primary rounded"></span>
                        6. Other Tracking Technologies
                      </h2>

                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-2">Web Beacons</h3>
                          <p className="text-base leading-relaxed">
                            Small graphic images (also known as pixel tags) that work with cookies to track user behavior and measure campaign effectiveness.
                          </p>
                        </div>

                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-2">Local Storage</h3>
                          <p className="text-base leading-relaxed">
                            HTML5 local storage allows us to store data locally in your browser. This provides faster load times and can work offline.
                          </p>
                        </div>

                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-2">Session Storage</h3>
                          <p className="text-base leading-relaxed">
                            Similar to local storage but data is only stored for the duration of your session.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                        <span className="h-1 w-8 bg-primary rounded"></span>
                        7. Mobile Devices
                      </h2>
                      <p className="text-base leading-relaxed mb-3">
                        On mobile devices, you can control tracking through device settings:
                      </p>
                      <ul className="space-y-2 ml-6">
                        <li className="text-base"><strong>iOS:</strong> Settings → Privacy → Tracking</li>
                        <li className="text-base"><strong>Android:</strong> Settings → Google → Ads</li>
                      </ul>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                        <span className="h-1 w-8 bg-primary rounded"></span>
                        8. Updates to This Policy
                      </h2>
                      <p className="text-base leading-relaxed">
                        We may update this Cookie Policy from time to time to reflect changes in technology, legislation, our operations, or other reasons. We will notify you of any material changes by posting the new policy on this page.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                        <span className="h-1 w-8 bg-primary rounded"></span>
                        9. More Information
                      </h2>
                      <p className="text-base leading-relaxed mb-3">
                        For more information about cookies and how to manage them:
                      </p>
                      <ul className="space-y-2 ml-6">
                        <li className="text-base"><a href="https://www.allaboutcookies.org" className="text-primary hover:underline font-semibold" target="_blank" rel="noopener noreferrer">All About Cookies</a></li>
                        <li className="text-base"><a href="https://www.youronlinechoices.com" className="text-primary hover:underline font-semibold" target="_blank" rel="noopener noreferrer">Your Online Choices</a></li>
                        <li className="text-base"><a href="https://www.networkadvertising.org" className="text-primary hover:underline font-semibold" target="_blank" rel="noopener noreferrer">Network Advertising Initiative</a></li>
                      </ul>
                    </div>

                    <div className="bg-muted/50 p-6 rounded-lg border-l-4 border-primary">
                      <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                        <span className="h-1 w-8 bg-primary rounded"></span>
                        10. Contact Us
                      </h2>
                      <p className="text-base leading-relaxed mb-4">
                        If you have questions about our use of cookies, please contact us:
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
