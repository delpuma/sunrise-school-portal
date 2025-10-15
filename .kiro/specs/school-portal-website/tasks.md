# Implementation Plan

- [x] 1. Project Setup and Core Infrastructure

  - Initialize Next.js 14 project with TypeScript and App Router
  - Configure Tailwind CSS and install shadcn/ui
  - Set up Supabase project and configure environment variables
  - Create base folder structure (app routes, components, lib, types)
  - _Requirements: 16.1, 16.2, 16.3_

- [x] 2. Database Schema and Migrations

  - Create Supabase migration files for all tables (users, families, students, events, registrations, invoices, bookings, donations, blog_posts, parent_resources, newsletter_signups, forms, form_submissions, crm_contacts, crm_interactions, crm_notes, crm_segments, audit_logs)
  - Implement Row Level Security (RLS) policies for all tables
  - Create database indexes for performance optimization
  - Generate TypeScript types from Supabase schema
  - _Requirements: 15.1, 6.3, 10.5_

- [x] 3. Authentication System

  - Implement Supabase Auth integration with email/password
  - Create middleware for route protection and session verification
  - Build login, signup, and password reset pages
  - Implement role-based access control helper functions
  - Create auth context provider for client components
  - _Requirements: 6.1, 6.2, 6.5_

- [x] 4. Layout Components and Navigation

  - Create root layout with Header and Footer components
  - Implement navigation menu with role-based visibility
  - Build AnnouncementBar component with dismissible functionality
  - Create CookieConsent banner component
  - Add social media icons and newsletter signup form to footer
  - _Requirements: 1.2, 13.4, 15.5_

- [x] 5. Homepage and Public Pages

  - Build homepage with HeroSection, EventsRail, and CTAs
  - Create static pages for About, Curriculum (with sub-pages), Admissions (with sub-pages), News & Events (with sub-pages), Employment, and Give
  - Implement optional homepage pop-up for events/campaigns
  - Add optional gallery/Instagram section to homepage
  - _Requirements: 1.1, 1.3, 1.4, 1.5_

- [x] 6. Event Management - Data Layer

  - Create API routes for event CRUD operations (GET, POST, PUT, DELETE /api/events)
  - Implement event listing with filters (type, date)
  - Build event detail API with capacity calculation
  - Create event registration API endpoint
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 7. Event Management - UI Components

  - Build EventCard component with capacity indicator
  - Create EventDetail page with registration flow
  - Implement event listing page with filters
  - Add waitlist functionality for full events
  - Build event registration form with validation
  - _Requirements: 2.3, 2.4, 2.5_

- [x] 8. Square Payment Integration

  - Install and configure Square Web Payments SDK
  - Create SquarePaymentForm component for event registrations
  - Implement payment processing API route (POST /api/square/payment)
  - Add payment status handling and error messages
  - Store square_payment_id in registrations table
  - _Requirements: 3.1, 3.2, 3.5_

- [x] 9. Square Invoices Integration

  - Implement Square Invoices API integration (POST /api/square/invoices)
  - Create invoice creation workflow for admins
  - Build invoice listing API for families
  - Add Square webhook handler for invoice status updates
  - _Requirements: 3.3, 3.4, 7.3_

- [x] 10. Givebutter Donation Integration

  - Integrate Givebutter widget embed in header/footer
  - Create Give page with donation options
  - Implement Givebutter webhook handler (POST /api/webhooks/givebutter)
  - Store donation records in database
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 11. Google Calendar Tour Booking

  - Create Schedule a Tour page with Google Calendar embed
  - Implement native booking form (optional)
  - Build Google Calendar API integration for event creation
  - Create bookings API routes (POST /api/google/bookings, GET /api/google/availability)
  - Store booking records in database
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 12. Parent Portal - Layout and Dashboard

  - Create parent portal layout with navigation
  - Build portal dashboard with overview cards
  - Implement RLS verification for portal access
  - Add quick links to invoices, registrations, resources, profile
  - _Requirements: 6.3, 6.4_

- [x] 13. Parent Portal - Invoice Management

  - Build InvoiceList component with family invoices
  - Create InvoiceDetail page with Square payment link
  - Implement invoice filtering and sorting
  - Add invoice status indicators
  - _Requirements: 7.1, 7.2, 7.4_

- [x] 14. Parent Portal - Registration History

  - Create RegistrationList component showing family registrations
  - Build registration detail view with event information
  - Add filtering by status and date
  - _Requirements: 8.1, 8.2, 8.3_

- [x] 15. Parent Portal - Resources Library

  - Implement ResourceLibrary component with category filters
  - Create file upload to Supabase Storage
  - Build secure download functionality with signed URLs
  - Add resource visibility controls (is_published)
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 16. Parent Portal - Family Profile

  - Build FamilyProfile component with editable fields
  - Implement profile update API with validation
  - Add student management (add, edit, remove)
  - Create audit logging for profile changes
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 17. Blog System - Data Layer

  - Create blog_posts API routes (GET, POST, PUT, DELETE)
  - Implement blog post listing with filters (tags, categories)
  - Build blog post detail API with slug-based routing
  - Add scheduled publishing functionality
  - _Requirements: 12.1, 12.2, 12.4_

- [x] 18. Blog System - UI Components

  - Create BlogCard component for post previews
  - Build BlogPost detail page with MDX rendering
  - Implement blog index page with category/tag filters
  - Add blog post search functionality
  - _Requirements: 12.2, 12.3_

- [x] 19. Form Management System - Core

  - Create forms table schema and API routes
  - Build FormBuilder component for admin (drag-and-drop interface)
  - Implement form schema validation with Zod
  - Create DynamicForm component that renders from schema
  - Add conditional logic support for form fields
  - _Requirements: 17.1, 17.2_

- [x] 20. Form Management System - Submissions

  - Implement form submission API (POST /api/forms/:slug/submit)
  - Create form_submissions storage with JSONB data
  - Build file upload handling for form fields
  - Add form submission confirmation emails
  - Create admin view for form submissions with filtering
  - _Requirements: 17.3, 17.4, 17.6, 17.7_

- [x] 21. Form Management System - CRM Integration

  - Implement automatic CRM contact creation from form submissions
  - Add source tracking for form-generated contacts
  - Create workflow triggers for form submissions
  - _Requirements: 17.5, 18.1_

- [x] 22. CRM System - Data Layer

  - Create CRM API routes (GET, POST, PUT /api/crm/contacts)
  - Implement contact filtering and search functionality
  - Build contact detail API with interaction history
  - Create notes and tags API endpoints
  - Add engagement score calculation logic
  - _Requirements: 18.2, 18.3, 18.4, 18.8_

- [x] 23. CRM System - Contact Management UI

  - Build CRMDashboard with contact list and filters
  - Create ContactDetail page with full interaction history
  - Implement contact editing interface
  - Add notes and tags management UI
  - Build contact status workflow (lead → prospect → enrolled)
  - _Requirements: 18.2, 18.3, 18.4, 18.7_

- [x] 24. CRM System - Segmentation and Export

  - Implement segment creation with criteria builder
  - Create saved segments management
  - Build contact list export functionality (CSV)
  - Add bulk operations for contacts
  - _Requirements: 18.5, 18.6_

- [x] 25. CRM System - Interaction Tracking

  - Create interaction logging for form submissions
  - Add interaction tracking for tour bookings
  - Implement interaction logging for event registrations
  - Build interaction timeline view in ContactDetail
  - Update engagement scores based on interactions
  - _Requirements: 18.3, 18.8_

- [x] 26. CRM System - Marketing Features

  - Implement opt-out/unsubscribe functionality
  - Create marketing analytics dashboard
  - Build lead source tracking and reporting
  - Add conversion rate calculations
  - _Requirements: 18.9, 18.10_

- [x] 27. Admin Dashboard - Overview

  - Create admin layout with navigation
  - Build dashboard with metric cards (unpaid invoices, capacity alerts, upcoming tours, recent donations)
  - Implement real-time data updates
  - Add quick action buttons
  - _Requirements: 14.1_

- [x] 28. Admin Dashboard - Event Management

  - Build event CRUD interface
  - Create event roster export functionality (CSV)
  - Implement attendance check-in feature
  - Add capacity management tools
  - _Requirements: 2.6, 2.7, 14.2_

- [x] 29. Admin Dashboard - Invoice Management

  - Create invoice CRUD interface using Square API
  - Build invoice creation form with family selection
  - Implement invoice status tracking
  - Add unpaid invoice alerts
  - _Requirements: 7.3, 7.5, 14.2_

- [x] 30. Admin Dashboard - Blog Management

  - Build BlogEditor component with MDX support
  - Create blog post scheduling interface
  - Implement blog post preview functionality
  - Add image upload for blog posts
  - _Requirements: 12.1, 12.5, 14.2_

- [x] 31. Admin Dashboard - Resource Management

  - Create resource upload interface
  - Build resource categorization system
  - Implement resource publishing controls
  - Add resource usage analytics
  - _Requirements: 9.3, 14.2_

- [x] 32. Admin Dashboard - Form Management

  - Build form listing and management interface
  - Create form analytics (submission counts, completion rates)
  - Implement form duplication functionality
  - Add form submission export
  - _Requirements: 17.6, 14.2_

- [x] 33. Admin Dashboard - User and Role Management

  - Create user listing interface
  - Implement role assignment functionality
  - Build user invitation system
  - Add user activity monitoring
  - _Requirements: 14.4_

- [x] 34. Admin Dashboard - Audit Logs

  - Build AuditLogViewer component with filtering
  - Implement audit log search functionality
  - Add audit log export for compliance
  - Create audit log retention policy
  - _Requirements: 14.5, 15.3_

- [x] 35. Newsletter and Communications

  - Create newsletter signup form component
  - Implement newsletter_signups API
  - Add optional Mailchimp sync integration
  - Build unsubscribe functionality
  - _Requirements: 13.1, 13.2, 13.3_

- [x] 36. Enrollment and FACTS Integration

  - Create Apply/Enroll page with FACTS link
  - Add placeholder for FACTS SSO integration
  - Implement enrollment status tracking
  - _Requirements: 11.1, 11.2, 11.3_

- [x] 37. Security Implementation

  - Implement audit logging for all sensitive operations
  - Add CSRF protection to forms
  - Configure Content Security Policy headers
  - Implement rate limiting on API routes
  - Add input validation with Zod for all API endpoints
  - _Requirements: 15.1, 15.3, 15.4_

- [x] 38. Accessibility Compliance

  - Audit all components for WCAG 2.2 AA compliance
  - Add ARIA labels and roles where needed
  - Implement keyboard navigation for all interactive elements
  - Test with screen readers
  - Add skip navigation links
  - _Requirements: 15.2_

- [x] 39. Optional AI Features

  - Integrate OpenAI API for blog draft generation
  - Create AI FAQ answer generator
  - Build newsletter summary generator
  - Add AI content review indicators
  - _Requirements: 19.1, 19.2, 19.3, 19.5_

- [x] 40. WordPress Content Migration

  - Create migration script for WordPress posts to blog_posts
  - Migrate WordPress pages to Next.js MDX files
  - Download and upload media to Supabase Storage
  - Update content URLs and links
  - _Requirements: 1.3, 16.6_

- [x] 41. Performance Optimization

  - Configure ISR for blog posts and events
  - Implement image optimization with Next.js Image
  - Add database indexes for frequently queried columns
  - Set up caching strategy with TanStack Query
  - Optimize bundle size with code splitting
  - _Requirements: 16.1_

- [x] 42. Deployment and Documentation

  - Configure Vercel project with environment variables
  - Set up Supabase production database
  - Create deployment documentation
  - Write environment variable setup guide
  - Document API endpoints and usage
  - Create admin user guide
  - _Requirements: 16.1, 16.2, 16.3, 16.5_

- [x] 43. Testing and Quality Assurance
  - Set up testing infrastructure (Jest, React Testing Library, Playwright)
  - Write integration tests for authentication flows
  - Create E2E tests for critical user journeys (registration, payment, login)
  - Implement accessibility testing with axe-core
  - Test payment flows in Square sandbox mode
  - _Requirements: 3.1, 6.1, 15.2_
