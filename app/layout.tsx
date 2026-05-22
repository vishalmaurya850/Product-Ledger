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
  title: "Product Ledger - Business Management System",
  description: "Manage your product inventory, ledger, and overdue payments",
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
