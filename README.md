<div align="center">
<h1>🏢 Product Ledger Management System</h1>

![Product Ledger](https://raw.githubusercontent.com/vishalmaurya850/Product-Ledger/refs/heads/master/app/favicon.ico)

</div>
<div align="center">

![Product Ledger](https://img.shields.io/badge/Product-Ledger-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7.8-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

*A comprehensive business ledger management system for product-selling companies with real-time data synchronization, overdue management, and intelligent credit limit handling.*

[🚀 Live Demo](https://product-ledger.vercel.app) • [📖 Documentation](#) • [🐛 Report Bug](https://github.com/vishalmaurya850/Product-Ledger/issues) • [💡 Request Feature](https://github.com/vishalmaurya850/Product-Ledger/issues)

</div>

---

## 🌟 Overview

The **Product Ledger Management System** is a full-stack web application designed for product-selling companies to efficiently manage their financial transactions, customer relationships, and inventory. Built with Next.js 16 (App Router), Prisma ORM 7, and PostgreSQL, it provides real-time data synchronization, intelligent overdue management, and automated credit limit adjustments.

### ✨ Key Highlights

- 🔄 **Real-time Data Sync** — IndexedDB + PostgreSQL integration for offline-first capability
- 💰 **Smart Credit Management** — Dynamic per-customer credit limit adjustments with grace periods
- 📊 **Comprehensive Reporting** — Revenue, product, overdue, and credit analytics
- 🔔 **Automated Overdue Tracking** — Configurable interest rates, compounding periods, and fine calculations
- 📱 **Responsive Design** — Works seamlessly across all devices
- 🔐 **Secure Authentication** — NextAuth.js v5 with credentials-based auth and email verification
- 📧 **Email Integration** — Automated notifications, password reset, and verification emails
- 🧾 **PDF Invoice Generation** — Professional invoices with jsPDF and AutoTable
- 👥 **Multi-tenant Architecture** — Company-scoped data isolation with role-based access control

---

## 🏗️ System Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        A["Next.js 16 App Router"]
        B["React 19 Components"]
        C["Tailwind CSS 4.3"]
        D["shadcn/ui + Radix UI"]
    end

    subgraph "Authentication"
        E["NextAuth.js v5"]
        F["Credentials Provider"]
        G["Email Verification"]
    end

    subgraph "API Layer"
        H["REST API Routes"]
        I["Server Actions"]
        J["Middleware + CSP"]
    end

    subgraph "Data Layer"
        K["PostgreSQL"]
        L["Prisma ORM 7"]
        M["IndexedDB (Offline)"]
    end

    subgraph "External Services"
        N["Nodemailer (SMTP)"]
        O["Cron Jobs (Overdue)"]
        P["jsPDF (Invoices)"]
    end

    A --> B
    B --> C
    B --> D
    A --> E
    E --> F
    E --> G
    A --> H
    H --> I
    H --> J
    H --> L
    L --> K
    M --> K
    H --> N
    O --> L
    H --> P
```

---

## 📋 Features

### Core Business Features
- **Customer Management** — Add, update, and track customer details with PAN/Aadhar, credit limits, and transaction history
- **Transaction Ledger** — Record sales, payments (in/out), partial payments, and adjustments with real-time balance tracking
- **Overdue Management** — Automated overdue detection with configurable grace periods, interest rates, and compounding
- **Product Inventory** — Track products with SKU, pricing, stock levels, categories, and units of measurement
- **Invoice Generation** — Generate and download professional PDF invoices per transaction
- **Reports & Analytics** — Revenue trends, product performance, overdue accounts, and credit utilization reports

### Platform Features
- **Multi-user Support** — Role-based access control (Admin/User) with granular permissions per module
- **Company Settings** — Configurable company profile, overdue settings, and branding
- **Offline Support** — IndexedDB-based offline data sync for uninterrupted usage
- **Dark Mode** — Full dark/light theme support via next-themes
- **Security Hardened** — CSP headers, HSTS, XSS protection, rate limiting, and input validation

### Public Pages
- Landing page with features, pricing, and testimonials
- About, Blog, Careers, Changelog, Roadmap
- Contact, Privacy Policy, Terms of Service, Cookie Policy

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript 5.9 |
| **UI** | React 19, Tailwind CSS 4.3, shadcn/ui, Radix UI |
| **Animation** | Framer Motion |
| **Charts** | Recharts |
| **ORM** | Prisma 7 with PostgreSQL adapter |
| **Database** | PostgreSQL |
| **Offline Storage** | IndexedDB (idb) |
| **Authentication** | NextAuth.js v5 (beta) |
| **Email** | Nodemailer (SMTP) |
| **PDF** | jsPDF + jspdf-autotable |
| **Forms** | React Hook Form + Zod validation |
| **Linting** | ESLint 9 |

---

## 📁 Project Structure

```
productledger/
├── app/                          # Next.js App Router
│   ├── (public pages)/           # about, blog, careers, changelog, contact,
│   │                             # cookie, features, policy, pricing, privacy,
│   │                             # roadmap, terms
│   ├── admin/                    # Admin panel
│   │   ├── customers/            # Admin customer management
│   │   ├── ledger/               # Admin ledger (+ new entry)
│   │   ├── overdue/              # Admin overdue management
│   │   ├── products/             # Admin product management (+ new)
│   │   ├── profile/              # Admin profile
│   │   ├── settings/             # Company settings
│   │   └── users/                # User management (CRUD + permissions)
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Auth endpoints (login, register, verify, reset)
│   │   ├── cron/                 # Scheduled jobs (update-overdue)
│   │   ├── customers/            # Customer CRUD + credit settings
│   │   ├── email/                # Email sending endpoints
│   │   ├── invoices/             # Invoice generation & download
│   │   ├── ledger/               # Ledger CRUD + settle-payment
│   │   ├── overdue/              # Overdue entries + settings
│   │   ├── products/             # Product CRUD
│   │   ├── reports/              # Analytics (revenue, products, overdue, overview)
│   │   ├── upload/               # File upload
│   │   └── users/                # User management API
│   ├── auth/                     # Auth pages (login, register, forgot/reset password)
│   ├── customers/                # Customer pages (list, new, view, edit, credit)
│   ├── dashboard/                # Main dashboard
│   ├── invoices/                 # Invoice view
│   ├── ledger/                   # Ledger pages (list, new-entry, view, edit)
│   ├── overdue/                  # Overdue tracking
│   ├── products/                 # Product pages (list, new, view, edit)
│   ├── profile/                  # User profile
│   ├── reports/                  # Reports & analytics
│   ├── settings/                 # User settings
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/                   # React components
│   ├── admin/                    # Admin-specific components
│   ├── customers/                # Customer table
│   ├── dashboard/                # Dashboard widgets (overview, recent sales, overdue)
│   ├── invoices/                 # Invoice content renderer
│   ├── landing/                  # Landing page sections
│   ├── ledger/                   # Ledger components (table, forms, credit settings)
│   ├── products/                 # Products table
│   ├── reports/                  # Report components (revenue, product, overdue, credit)
│   └── ui/                       # shadcn/ui primitives (50+ components)
├── hooks/                        # Custom React hooks
│   ├── use-mobile.tsx            # Mobile detection hook
│   └── use-toast.ts             # Toast notification hook
├── lib/                          # Core utilities
│   ├── actions.ts                # Server actions
│   ├── auth.ts                   # NextAuth configuration
│   ├── db.ts                     # Database connection (Prisma)
│   ├── indexed-db.ts             # IndexedDB offline sync
│   ├── mail.ts                   # Email utilities
│   ├── permissions.ts            # Permission helpers
│   ├── security.ts               # Security utilities
│   └── utils.ts                  # General utilities (cn, etc.)
├── prisma/                       # Prisma ORM
│   ├── migrations/               # Database migrations
│   └── schema.prisma             # Database schema
├── public/                       # Static assets
├── styles/                       # Additional styles
├── types/                        # TypeScript type definitions
│   └── next-auth.d.ts            # NextAuth type augmentation
├── utils/                        # Utility functions
│   ├── constant.ts               # App constants
│   └── getCurrencySymbol.ts      # Currency formatting
├── .env.example                  # Environment variable template
├── components.json               # shadcn/ui configuration
├── next.config.mjs               # Next.js configuration
├── postcss.config.mjs            # PostCSS configuration
├── prisma.config.ts              # Prisma ORM configuration (Prisma 7)
├── tsconfig.json                 # TypeScript configuration
└── funding.json                  # FOSS funding manifest
```

---

## 🚀 Installation

### Prerequisites

- Node.js 20.x or higher
- PostgreSQL 14+ (local or hosted, e.g., Supabase, Neon, Railway)
- SMTP email credentials (for password reset and verification)

### Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/vishalmaurya850/Product-Ledger.git
   cd Product-Ledger
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**

   Copy the example file and fill in your values:
   ```bash
   cp .env.example .env
   ```

   Key variables:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/productledger"
   NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
   NEXTAUTH_URL="http://localhost:3000"
   EMAIL_SERVER_HOST="smtp.gmail.com"
   EMAIL_SERVER_PORT="587"
   EMAIL_SERVER_USER="your-email@gmail.com"
   EMAIL_SERVER_PASSWORD="your-app-specific-password"
   EMAIL_FROM="Product Ledger <noreply@yourcompany.com>"
   CRON_SECRET_KEY="generate-a-strong-random-key"
   ```

4. **Set Up the Database**
   ```bash
   npx prisma migrate dev
   ```

5. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

6. **Run the Application**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🖥️ Usage

1. **Register** — Create an account with your company details
2. **Dashboard** — View key metrics: total revenue, outstanding balance, overdue accounts
3. **Customers** — Add customers with contact info, PAN/Aadhar, and set credit limits
4. **Ledger** — Record sales, payments, and partial payments with due dates
5. **Products** — Manage inventory with SKU, pricing, stock, and categories
6. **Overdue** — Monitor overdue payments with auto-calculated interest and fines
7. **Reports** — Analyze revenue trends, product performance, and credit utilization
8. **Invoices** — Generate and download professional PDF invoices
9. **Admin Panel** — Manage users, permissions, and company-wide settings

---

## 🧪 Development

### Available Scripts

```bash
npm run dev              # Start dev server with Turbopack
npm run build            # Production build
npm run start            # Start production server
npm run lint             # Run ESLint
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
```

### Database Schema

The application uses the following core models:
- **Company** — Multi-tenant company entity
- **User** — Users with roles (admin/user) and permissions
- **Customer** — Customer profiles with credit settings
- **Product** — Product catalog with inventory tracking
- **LedgerEntry** — Financial transactions (sales, payments, partial payments)
- **CustomerCreditSettings** — Per-customer credit limits and interest rates
- **OverdueSettings** — Company-wide overdue configuration
- **PasswordReset** — Secure password reset tokens
- **Permission** — Granular module-level permissions

---

## 🐳 Deployment

### Deploy to Vercel (Recommended)

1. Push your repository to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Configure environment variables in Vercel's dashboard
4. Deploy with a single click

### Production Checklist

- [ ] All secrets changed from defaults
- [ ] PostgreSQL with SSL enabled
- [ ] HTTPS enforced (HSTS enabled)
- [ ] Cron job configured for overdue updates (`/api/cron/update-overdue`)
- [ ] Email delivery verified
- [ ] Error tracking setup (Sentry, etc.)
- [ ] Database backups configured

---

## 💰 Funding

This project is open source and accepts funding through the [FLOSS/fund](https://floss.fund/) initiative. See our [`funding.json`](./funding.json) manifest for details, or view our listing on the [FLOSS/fund directory](https://dir.floss.fund/).

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

---

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 📞 Contact

- **Email**: bonsoisystems@gmail.com
- **GitHub Issues**: [Report a Bug](https://github.com/vishalmaurya850/Product-Ledger/issues)
- **Feature Requests**: [Request a Feature](https://github.com/vishalmaurya850/Product-Ledger/issues)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) — The React framework for production
- [Prisma](https://www.prisma.io/) — Next-generation ORM for Node.js and TypeScript
- [PostgreSQL](https://www.postgresql.org/) — The world's most advanced open source database
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) — Accessible and customizable UI components
- [NextAuth.js](https://next-auth.js.org/) — Authentication for Next.js
- [Radix UI](https://www.radix-ui.com/) — Unstyled, accessible UI primitives
- [Recharts](https://recharts.org/) — Composable charting library for React
