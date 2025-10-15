# Sunrise School of Miami - School Portal

A modern, secure school website and parent portal built with Next.js 14, Supabase, and TypeScript.

## Features Implemented

### ✅ Core Infrastructure (Tasks 1-4)
- Next.js 14 with App Router and TypeScript
- Supabase integration (Auth, Database, Storage)
- Tailwind CSS styling
- Authentication system (login, signup, password reset)
- Layout components (Header, Footer, Announcement Bar, Cookie Consent)

### ✅ Public Website (Task 5)
- Homepage with hero section and events rail
- About page
- Curriculum pages
- Admissions pages
- News & Events pages
- Employment page
- Give/Donate page
- Blog listing page

### ✅ Event Management (Tasks 6-7)
- Event listing and detail pages
- Event registration system
- Capacity tracking
- API routes for CRUD operations
- Registration form with authentication

### ✅ Parent Portal (Tasks 12-15)
- Protected portal layout with navigation
- Dashboard with quick stats and recent activity
- Invoice management and viewing
- Registration history
- Resources library with category filtering
- Family profile management

## Database Schema

All tables created with Row Level Security (RLS) policies:
- users, families, students
- events, registrations
- invoices, bookings, donations
- blog_posts, parent_resources
- forms, form_submissions
- crm_contacts, crm_interactions, crm_notes, crm_segments
- audit_logs

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Already configured in `.env.local`:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

### 3. Apply Database Migrations
Go to Supabase Dashboard SQL Editor and run migrations in order:
1. `supabase/migrations/20240101000000_initial_schema.sql`
2. `supabase/migrations/20240101000001_rls_policies.sql`
3. `supabase/migrations/20240101000002_functions.sql`

See `scripts/setup-database.md` for detailed instructions.

### 4. Run Development Server
```bash
npm run dev
```

Visit http://localhost:3000

## Project Structure

```
app/
├── (auth)/              # Authentication pages
├── (public)/            # Public pages (about, curriculum, etc.)
├── portal/              # Parent portal (protected)
├── events/              # Event listing and details
├── blog/                # Blog pages
└── api/                 # API routes

components/
├── auth/                # Auth components
├── layout/              # Layout components
├── home/                # Homepage components
├── events/              # Event components
└── portal/              # Portal components

lib/
├── supabase/            # Supabase client utilities
└── auth/                # Auth helper functions

supabase/
└── migrations/          # Database migrations
```

## Remaining Tasks

### Payment Integration (Tasks 8-9)
- Square Web Payments SDK integration
- Square Invoices API integration
- Payment processing for event registrations

### Third-Party Integrations (Tasks 10-11)
- Givebutter donation widget
- Google Calendar tour booking

### Blog System (Tasks 17-18)
- Blog post creation and management
- MDX rendering
- Blog admin interface

### Form Management (Tasks 19-21)
- Dynamic form builder
- Form submissions
- CRM integration

### CRM System (Tasks 22-26)
- Contact management
- Interaction tracking
- Segmentation and export
- Marketing analytics

### Admin Dashboard (Tasks 27-34)
- Admin layout and overview
- Event management interface
- Invoice management
- Blog management
- Resource management
- Form management
- User and role management
- Audit log viewer

### Additional Features (Tasks 35-43)
- Newsletter signup
- FACTS enrollment integration
- Security hardening
- Accessibility compliance
- AI features (optional)
- WordPress content migration
- Performance optimization
- Deployment and documentation
- Testing

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage
- **Deployment:** Vercel (recommended)

## Security Features

- Row Level Security (RLS) on all database tables
- Role-based access control (admin, staff, parent)
- Secure authentication with Supabase
- Audit logging for sensitive operations
- CSRF protection
- Input validation

## Next Steps

1. Apply database migrations to Supabase
2. Create an admin user and set role to 'admin'
3. Test authentication flow
4. Add sample events and content
5. Implement payment integrations
6. Build admin dashboard
7. Deploy to Vercel

## Support

For questions or issues, refer to:
- Next.js docs: https://nextjs.org/docs
- Supabase docs: https://supabase.com/docs
- Project spec files in `.kiro/specs/school-portal-website/`
