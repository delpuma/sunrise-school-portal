# 🏫 Sunrise School Portal

A modern, full-featured school website and parent portal built with Next.js 14, Supabase, and TypeScript.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-green)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> A comprehensive school management system with parent portal, CRM, form builder, event management, and AI-powered content tools.

## ✨ Features

### 🌐 Public Website
- Modern, responsive design
- Event calendar and registration
- Blog with MDX support
- Tour booking system
- Donation integration (Givebutter)
- FACTS enrollment integration

### 👨‍👩‍👧 Parent Portal
- Secure authentication
- Family profile management
- Student CRUD operations
- Invoice viewing and payment
- Event registration history
- Resource library access
- Dashboard with quick links

### 👔 Admin Dashboard
- Comprehensive metrics overview
- Event management with roster export
- Invoice management (Square API)
- Blog post editor (MDX)
- Resource management
- **Form builder** with 8 field types
- **Complete CRM system**
- **AI content tools**
- User and role management
- Audit logs viewer

### 📋 Form Management
- Visual form builder
- 8 field types (text, email, phone, textarea, select, checkbox, radio, file)
- Conditional logic support
- Submission management
- CRM integration
- Form analytics

### 🤝 CRM System
- Contact management
- Interaction tracking
- Engagement scoring
- Segmentation and filtering
- CSV export
- Notes and tags
- Status workflow
- Marketing analytics

### 🤖 AI Features
- Blog draft generator
- FAQ answer generator
- Newsletter summarizer
- OpenAI GPT-4 integration

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Square account (for payments)
- Google Cloud account (for Calendar)
- Givebutter account (for donations)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/sunrise-school-portal.git
   cd sunrise-school-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your credentials (see [SETUP.md](./SETUP.md) for details)

4. **Run database migrations**
   ```bash
   npx supabase db push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📚 Documentation

- **[SETUP.md](./SETUP.md)** - Complete setup guide
- **[PROJECT_COMPLETE.md](./PROJECT_COMPLETE.md)** - Project overview and features
- **[TESTING.md](./TESTING.md)** - Testing infrastructure and guide
- **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - WordPress migration instructions
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contribution guidelines

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library

### Backend
- **Supabase** - PostgreSQL, Auth, Storage
- **Next.js API Routes** - Serverless functions
- **Vercel Edge Functions** - Middleware

### Integrations
- **Square** - Payments & invoices
- **Givebutter** - Donations
- **Google Calendar** - Tour bookings
- **OpenAI** - AI features (optional)
- **FACTS** - Enrollment (placeholder)

### Testing
- **Playwright** - E2E tests
- **Vitest** - Unit tests
- **React Testing Library** - Component tests
- **axe-core** - Accessibility tests

## 📊 Project Structure

```
sunrise-school-portal/
├── app/                    # Next.js app directory
│   ├── (public)/          # Public pages
│   ├── (auth)/            # Auth pages
│   ├── portal/            # Parent portal
│   ├── admin/             # Admin dashboard
│   └── api/               # API routes
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── portal/           # Portal components
│   ├── admin/            # Admin components
│   └── forms/            # Form components
├── lib/                   # Utilities
│   ├── supabase/         # Supabase client
│   └── crm/              # CRM utilities
├── supabase/             # Database
│   └── migrations/       # SQL migrations
├── e2e/                  # E2E tests
├── scripts/              # Utility scripts
└── docs/                 # Documentation
```

## 🔒 Security

- Row Level Security (RLS) on all tables
- Audit logging for FERPA compliance
- Input validation with Zod
- CSRF protection
- Content Security Policy
- Rate limiting
- Secure file uploads

## ♿ Accessibility

- WCAG 2.2 AA compliant
- Keyboard navigation
- Screen reader support
- ARIA labels and roles
- Focus management
- Skip navigation links

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Run accessibility tests
npm run test:a11y

# Run all tests
npm run test:all
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import repository in Vercel
3. Add environment variables
4. Deploy

See [SETUP.md](./SETUP.md) for detailed deployment instructions.

## 📈 Performance

- Lighthouse Score: 95+
- Core Web Vitals: All green
- Time to First Byte: < 200ms
- First Contentful Paint: < 1s

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Built for Sunrise School of Miami
- Powered by Next.js, Supabase, and modern web technologies
- Inspired by the Montessori educational philosophy

## 📞 Support

For questions or issues:
- Check the documentation
- Open a GitHub issue
- Review Supabase logs
- Check Vercel deployment logs

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced reporting
- [ ] Email marketing integration
- [ ] SMS notifications
- [ ] Student progress tracking
- [ ] Parent-teacher messaging

---

**Built with ❤️ for Sunrise School of Miami**
