# 🤝 Contributing to Product-Ledger

Welcome! 🎉 We’re thrilled that you’d like to contribute to **Product-Ledger** — a modern and intelligent business ledger management system designed with ❤️ using Next.js, TypeScript, MongoDB, and Tailwind CSS.

We believe in open-source collaboration and are committed to making your first contribution experience smooth, beginner-friendly, and rewarding.

---

## 📌 Table of Contents

- [💡 How You Can Contribute](#-how-you-can-contribute)
- [🛠️ Setup Instructions](#️-setup-instructions)
- [📁 Project Structure](#-project-structure)
- [🚀 Git & PR Workflow](#-git--pr-workflow)
- [🎯 Commit Message Guidelines](#-commit-message-guidelines)
- [📑 Code Guidelines](#-code-guidelines)
- [✅ Before You Submit](#-before-you-submit)
- [💬 Need Help?](#-need-help)

---

## 💡 How You Can Contribute

We welcome contributions of **all kinds**! Here’s how you can help:

| Area | Description |
|------|-------------|
| 🐛 Bug Fixes | Fix issues reported in [Issues](https://github.com/vishalmaurya850/Product-Ledger/issues) |
| ✨ New Features | Suggest and implement new features |
| 🎨 UI/UX | Improve responsiveness or design |
| 🧪 Testing | Write unit/integration tests |
| 📝 Documentation | Improve this `CONTRIBUTING.md`, `README.md`, or add technical docs |
| 🌐 Internationalization | Help with translations (coming soon!) |

---

## 🛠️ Setup Instructions

### 1. Fork and Clone

```bash
git clone https://github.com/YOUR_USERNAME/Product-Ledger.git
cd Product-Ledger
```

### 2. Install Dependencies (use pnpm)

```bash
pnpm install
```

### 3. Create Environment File

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:

```env
MONGODB_URI=your_mongodb_uri
NEXTAUTH_SECRET=your_nextauth_secret
EMAIL_SERVER_USER=your_email
EMAIL_SERVER_PASSWORD=your_generated_password
```

> ℹ️ If `.env.local.example` is missing, you can create `.env.local` manually using the structure above.

### 4. Start Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000` 🚀

---

## 📁 Project Structure (Quick Overview)

```
product-ledger/
├── app/            # Next.js App Router
├── components/     # Reusable UI components
├── lib/            # Utility functions and configurations
├── public/         # Static assets
├── styles/         # Tailwind CSS + global styles
├── types/          # TypeScript types
└── utils/          # Helpers and utility logic
```

---

## 🚀 Git & PR Workflow

1. **Create a New Branch**

   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make Your Changes** ✅

3. **Stage + Commit**

   ```bash
   git add .
   git commit -m "feat: meaningful description"
   ```

4. **Push to Your Fork**

   ```bash
   git push origin feat/your-feature-name
   ```

5. **Open a Pull Request**

   > Go to [Pull Requests](https://github.com/vishalmaurya850/Product-Ledger/pulls) and click **"New Pull Request"**

---

## 🎯 Commit Message Guidelines

We follow the **Conventional Commits** format:

```
<type>: <short summary>
```

### Allowed types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting, whitespace (no logic changes)
- `refactor`: Code refactoring without behavior change
- `test`: Add or update tests
- `chore`: Build tasks, dependencies, or other maintenance

### 🔧 Examples:

- `feat: add overdue interest calculation`
- `fix: resolve auth redirect bug`
- `docs: update README with env setup`
- `style: adjust spacing in ledger table`

---

## 📑 Code Guidelines

- Write clean, modular, and readable code.
- Use `TypeScript` for type safety.
- Use `shadcn/ui` and `Tailwind CSS` for UI components.
- Follow Prettier and ESLint rules.
- Make sure your changes don’t break the existing codebase.
- Write comments where necessary, especially for complex logic.

---

## ✅ Before You Submit

- [ ] Run `pnpm lint` — fix linting issues.
- [ ] Run `pnpm format` (if available) — apply Prettier formatting.
- [ ] Run `pnpm dev` and test your changes locally.
- [ ] Add screenshots/gifs if your PR changes the UI.
- [ ] Link related issues using `Closes #issue-no`.
- [ ] Fill out the PR template clearly and concisely.

---

## 💬 Need Help?

We are here to support you! ✨

- 📧 Email: [bonsoisystems@gmail.com](mailto:bonsoisystems@gmail.com)
- 🐛 Report Issues: [GitHub Issues](https://github.com/vishalmaurya850/Product-Ledger/issues)
- 💡 Suggest Features: [Open a Discussion](https://github.com/vishalmaurya850/Product-Ledger/discussions)

---

## 🙌 Thank You!

Thanks for considering contributing to **Product-Ledger**! Your support is what makes open-source awesome. We appreciate your time and effort in helping us improve and grow this project. 🚀
