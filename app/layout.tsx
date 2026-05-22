import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import Script from "next/script"
import "./globals.css"

import { ThemeProvider } from "@/components/theme-provider"
import { SideNav } from "@/components/side-nav"
import { TopNav } from "@/components/top-nav"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth-provider"
import { getCompanyName } from "@/lib/actions";
import { auth } from "@/lib/auth"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Product Ledger - Business Management System",
    template: "%s | Product Ledger",
  },
  description: "Manage your product inventory, ledger, and overdue payments. A complete financial management system for businesses of all sizes with real-time tracking, automated interest calculation, and PDF invoicing.",
  keywords: [
    "product ledger",
    "business management",
    "inventory management",
    "ledger management",
    "overdue payments",
    "invoice generation",
    "financial tracking",
    "cash flow management",
    "customer management",
    "small business software",
    "accounting software",
    "payment tracking",
  ],
  authors: [{ name: "BONSOI Systems", url: "https://bonsoi.vercel.app" }],
  creator: "BONSOI Systems",
  publisher: "BONSOI Systems",
  metadataBase: new URL("https://product-ledger.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://product-ledger.vercel.app",
    siteName: "Product Ledger",
    title: "Product Ledger - Business Management System",
    description: "Manage your product inventory, ledger, and overdue payments. A complete financial management system for businesses of all sizes.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Product Ledger - Business Management System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Product Ledger - Business Management System",
    description: "Manage your product inventory, ledger, and overdue payments. A complete financial management system for businesses of all sizes.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || "",
  },
  alternates: {
    canonical: "https://product-ledger.vercel.app",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  const companyName = await getCompanyName();
  const isAuthenticated = !!session

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <Script
          id="microsoft-clarity"
          strategy="beforeInteractive"
        >{`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "ub87betcxq");
        `}</Script>
      </head>
      <body className="antialiased bg-[var(--canvas)]">
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            {isAuthenticated ? (
              <div className="flex min-h-screen flex-col bg-[var(--surface-card)]">
                <TopNav companyName={companyName} />
                <div className="flex flex-1">
                  <SideNav />
                  <main className="flex-1 overflow-auto">
                    {children}
                  </main>
                </div>
              </div>
            ) : (
              <main className="bg-[var(--canvas)]">{children}</main>
            )}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
