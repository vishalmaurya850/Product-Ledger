<div align="center">
<h1> 🏢 Product Ledger Management System </h1>
    
![Product Ledger](https://raw.githubusercontent.com/vishalmaurya850/Product-Ledger/refs/heads/master/app/favicon.ico)

</div>
<div align="center">


![Product Ledger](https://img.shields.io/badge/Product-Ledger-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

*A comprehensive business ledger management system for product-selling companies with real-time data synchronization, overdue management, and intelligent credit limit handling.*

[🚀 Live Demo](#) • [📖 Documentation](#) • [🐛 Report Bug](#) • [💡 Request Feature](#)

</div>

---

## 🌟 Overview

The **Product Ledger Management System** is a full-stack web application designed for product-selling companies to efficiently manage their financial transactions, customer relationships, and inventory. Built with modern technologies, it provides real-time data synchronization, intelligent overdue management, and automated credit limit adjustments.

### ✨ Key Highlights

- 🔄 **Real-time Data Sync** - IndexedDB + MongoDB integration
- 💰 **Smart Credit Management** - Dynamic credit limit adjustments
- 📊 **Comprehensive Reporting** - Revenue, product, and overdue analytics
- 🔔 **Automated Overdue Tracking** - Intelligent interest and fine calculations
- 📱 **Responsive Design** - Works seamlessly across all devices
- 🔐 **Secure Authentication** - NextAuth.js with multiple providers
- 📧 **Email Integration** - Automated notifications and password reset

---

## 🏗️ System Architecture

```mermaid title="System Architecture Overview" type="diagram"
graph TB
    subgraph "Frontend Layer"
        A["Next.js 14 App Router"]
        B["React Components"]
        C["Tailwind CSS"]
        D["shadcn/ui"]
    end
    
    subgraph "Authentication"
        E["NextAuth.js"]
        F["Google OAuth"]
        G["Email Provider"]
    end
    
    subgraph "API Layer"
        H["REST API Routes"]
        I["Server Actions"]
        J["Middleware"]
    end
    
    subgraph "Data Layer"
        K["MongoDB Atlas"]
        L["IndexedDB"]
        M["Real-time Sync"]
    end
    
    subgraph "External Services"
        N["Email Service"]
        O["Cron Jobs"]
        P["PDF Generation"]
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
    H --> K
    K --> L
    L --> M
    H --> N
    O --> K
    H --> P
```

---

## 📋 Features

- **Customer Management**: Add, update, and track customer details with credit limits and transaction history.
- **Transaction Ledger**: Record sales, payments, and adjustments with real-time updates.
- **Overdue Alerts**: Automated notifications for overdue payments with customizable interest rates.
- **Inventory Tracking**: Monitor stock levels and integrate with sales data.
- **Analytics Dashboard**: Visualize revenue trends, product performance, and overdue accounts.
- **PDF Reports**: Generate professional invoices and account statements.
- **Multi-user Support**: Role-based access control for team collaboration.

---

## 🛠️ Installation

### Prerequisites

Before setting up the Product Ledger Management System, ensure you have the following:

#### System Requirements
- **Node.js** 18.x or higher ([Download here](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Git** for version control

#### External Services
- **MongoDB Atlas Account** - For cloud database hosting
  - Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
  - Set up a new cluster and obtain connection URI
- **Google OAuth Credentials** - For authentication
  - Visit [Google Cloud Console](https://console.cloud.google.com/)
  - Create a new project or select existing one
  - Enable Google+ API
  - Create OAuth 2.0 credentials
- **Email Service Provider** - For notifications and password reset
  - Gmail SMTP (recommended for development)
  - SendGrid, Nodemailer, or similar service for production

### Setup Instructions

#### 1. Clone the Repository
```bash
git clone https://github.com/vishalmaurya850/Product-Ledger.git
cd Product-Ledger
```

#### 2. Install Dependencies
```bash
npm install
```

> **⚠️ Note: React Version Compatibility**
> 
> If you encounter dependency conflicts or the installation fails, you may need to downgrade to React 18:
> 
> ```bash
> # Remove existing node_modules and package-lock.json
> rm -rf node_modules package-lock.json
> 
> # Install React 18 specifically
> npm install react@18 react-dom@18
> 
> # Install remaining dependencies
> npm install
> ```
> 
> This is a known compatibility issue with some packages that haven't been updated for React 19 yet.

#### 3. Configure MongoDB Atlas
1. Create a new cluster in MongoDB Atlas
2. Create a database user with read/write permissions
3. Whitelist your IP address (or use 0.0.0.0/0 for development)
4. Get your connection string from the "Connect" button

#### 4. Set Up Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth 2.0 Client IDs"
5. Set authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`

#### 5. Configure Environment Variables
Create a `.env.local` file in the root directory:

```env
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DB=product_ledger

# Authentication
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email Configuration (Gmail SMTP)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
# Email Configuration (Gmail SMTP)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
```

> **📧 Gmail SMTP Setup:**
> 1. Enable 2-factor authentication on your Gmail account
> 2. Generate an App Password: Google Account → Security → App passwords
> 3. Use the generated App Password (not your regular password) for EMAIL_SERVER_PASSWORD

#### 6. Initialize Database
The application will automatically create the necessary database collections on first run. Ensure your MongoDB Atlas cluster is running and accessible.

#### 7. Run the Application
```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Verification

After setup, you should be able to:
- ✅ Access the application at `http://localhost:3000`
- ✅ Sign in using Google OAuth
- ✅ See the dashboard with default data
- ✅ Receive email notifications (test with password reset)

### Troubleshooting

**Common Issues:**

1. **MongoDB Connection Failed**
   - Verify your connection string in `.env.local`
   - Check IP whitelist in MongoDB Atlas
   - Ensure database user has proper permissions

2. **Google OAuth Not Working**
   - Verify redirect URIs in Google Cloud Console
   - Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
   - Ensure Google+ API is enabled

3. **Email Notifications Not Sending**
   - Verify Gmail App Password setup
   - Check firewall/network restrictions on port 587
   - Test with a different email provider if needed

4. **Port Already in Use**
   ```bash
   # Kill process on port 3000
   npx kill-port 3000
   
   # Or run on different port
   npm run dev -- -p 3001
   ```

---

## 🖥️ Usage

1. **Sign Up/Login**: Use Google OAuth or email-based authentication to access the system.
2. **Dashboard**: View key metrics like total revenue, overdue accounts, and inventory status.
3. **Add Customers**: Input customer details and set credit limits.
4. **Record Transactions**: Log sales, payments, or adjustments in the ledger.
5. **Generate Reports**: Export invoices or account statements as PDFs.
6. **Monitor Overdues**: Receive automated alerts for overdue payments and apply interest/fines.

---

## 🧪 Development

### Tech Stack
- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Server Actions, MongoDB Atlas
- **Authentication**: NextAuth.js (Google OAuth, Email)
- **Database**: MongoDB with IndexedDB for offline sync
- **External Services**: Email notifications, PDF generation, cron jobs for scheduled tasks

### Project Structure
```
product-ledger/
├── app/                    # Next.js App Router
├── components/             # React components
├── lib/                    # Utility functions and configurations
├── models/                 # MongoDB schemas
├── public/                 # Static assets
├── styles/                 # Tailwind CSS and global styles
├── .env.local              # Environment variables
├── next.config.js          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
```

---

## 🐳 Deployment

### Deploy to Vercel
1. Push your repository to GitHub.
2. Connect your repository to Vercel.
3. Configure environment variables in Vercel’s dashboard.
4. Deploy the application with a single click.

### Deploy to Other Platforms
- Use Docker for containerized deployment.
- Configure MongoDB Atlas for production-grade database hosting.
- Set up cron jobs for scheduled tasks (e.g., overdue notifications).

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

---

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 📞 Contact

For questions or support, reach out to:
- **Email**: bonsoisystems@gmail.com
- **GitHub Issues**: [Report a Bug](https://github.com/vishalmaurya850/Product-Ledger/issues)
- **Feature Requests**: [Request a Feature](https://github.com/vishalmaurya850/Product-Ledger/issues)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the robust framework
- [MongoDB Atlas](https://www.mongodb.com/) for scalable database solutions
- [Tailwind CSS](https://tailwindcss.com/) for rapid UI development
- [shadcn/ui](https://ui.shadcn.com/) for accessible UI components
- [NextAuth.js](https://next-auth.js.org/) for secure authentication