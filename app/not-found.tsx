import Link from "next/link"
import { Package, ArrowLeft, Home } from "lucide-react"
import { GoBackButton } from "@/components/go-back-button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--canvas)] flex flex-col">
      {/* Minimal header */}
      <header className="flex items-center justify-center py-6 border-b border-[var(--border-subtle)]">
        <Link href="/" className="flex items-center gap-2">
          <Package className="h-5 w-5 text-[var(--accent-cyan)]" />
          <span className="text-[18px] font-semibold text-[var(--ink)]">
            Product Ledger
          </span>
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-[480px]">
          {/* 404 number */}
          <div className="text-kpi text-[var(--accent-cyan)] opacity-80 mb-2" style={{ fontSize: "96px" }}>
            404
          </div>

          {/* Heading */}
          <h1 className="text-display-md text-[var(--ink)] mb-3">
            Page not found
          </h1>

          {/* Description */}
          <p className="text-[16px] text-[var(--text-secondary)] leading-relaxed mb-8">
            The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[var(--accent-cyan)] text-white rounded-[8px] px-5 py-2.5 text-[15px] font-medium hover:bg-[var(--accent-cyan-hover)] transition-all active:scale-[0.97] shadow-[var(--glow-cyan)]"
            >
              <Home className="h-4 w-4" />
              Go to Homepage
            </Link>
            <GoBackButton />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-[var(--border-subtle)]">
        <p className="text-[13px] text-[var(--text-secondary)]">
          © {new Date().getFullYear()} Product Ledger. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
