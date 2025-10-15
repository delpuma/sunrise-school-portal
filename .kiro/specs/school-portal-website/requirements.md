# Requirements Document

## Introduction

This document outlines the requirements for building a secure, modern school website and parent portal for Sunrise School of Miami. The system will serve as the primary digital presence for the school, providing public-facing information, event management, donation capabilities, tour scheduling, and a comprehensive parent portal for managing family accounts, viewing invoices, and accessing resources. The platform will be built using Next.js 14 with App Router, Supabase for backend services, and integrate with Square for payments, Givebutter for donations, and Google Calendar for tour bookings.

## Requirements

### Requirement 1: Public Website Structure

**User Story:** As a prospective parent or community member, I want to navigate a well-organized school website with clear information about the school's programs, admissions process, and community, so that I can learn about Sunrise School of Miami and determine if it's the right fit for my family.

#### Acceptance Criteria

1. WHEN a user visits the homepage THEN the system SHALL display a hero section with banners, upcoming events rail with capacity status, and CTAs for "Schedule a Tour", "Apply/Enroll", and "Donate"
2. WHEN a user navigates the site THEN the system SHALL provide access to all Phase 1 pages: Home, About, Curriculum (with sub-pages: What We Strive to Achieve, Early Childhood Program, Parent Child Program, Curriculum by the Grades), Admissions (with sub-pages: How to Apply, Annual Tuition and Fees, Schedule a Tour), News & Events (with sub-pages: Summer Camp, Community, Community Education, Festivals and Celebrations), Employment Opportunities, Give (with sub-pages: Annual Fundraiser, Capital Campaign), Parent Portal, and Blog
3. WHEN a user accesses any page THEN the system SHALL render content migrated from the existing WordPress site with proper formatting and media
4. WHEN a user views the homepage THEN the system SHALL optionally display a dismissible pop-up for important events or campaigns
5. WHEN a user views the homepage THEN the system SHALL optionally display a gallery or Instagram section with manually uploaded images

### Requirement 2: Event Management System

**User Story:** As a school administrator, I want to create and manage events with registration capabilities, so that I can organize school programs, track attendance, and collect payments efficiently.

#### Acceptance Criteria

1. WHEN an administrator creates an event THEN the system SHALL capture title, type, start/end datetime, description, capacity, price, and image
2. WHEN a user views the events listing page THEN the system SHALL display all published events with filters for type and date
3. WHEN a user views an event detail page THEN the system SHALL show event information, availability counter, and registration button
4. WHEN an event reaches full capacity THEN the system SHALL display "Full" status and enable waitlist functionality
5. WHEN a user completes event registration THEN the system SHALL process payment via Square Web Payments SDK and create a registration record
6. WHEN an administrator views event details THEN the system SHALL provide options to export rosters and perform attendance check-in
7. WHEN an administrator updates event capacity THEN the system SHALL reflect changes in real-time on the event detail page

### Requirement 3: Payment Processing with Square

**User Story:** As a parent, I want to securely pay for event registrations and invoices using Square, so that I can complete financial transactions for my family's school activities.

#### Acceptance Criteria

1. WHEN a user registers for a paid event THEN the system SHALL integrate Square Web Payments SDK for payment processing
2. WHEN a payment is successful THEN the system SHALL store the square_payment_id in the registrations table
3. WHEN a parent views an invoice THEN the system SHALL display a link to the Square-hosted invoice payment page
4. WHEN an administrator creates an invoice THEN the system SHALL use Square Invoices API to generate the invoice and store the square_invoice_id
5. WHEN a payment is processed THEN the system SHALL update the registration or invoice status to "paid"

### Requirement 4: Donation Integration with Givebutter

**User Story:** As a supporter of the school, I want to make one-time or recurring donations through a trusted platform, so that I can contribute to the school's fundraising campaigns.

#### Acceptance Criteria

1. WHEN a user clicks the "Donate" button in the header or footer THEN the system SHALL open the Givebutter widget embed
2. WHEN a user visits the Give page THEN the system SHALL display donation options for Annual Fundraiser and Capital Campaign with Givebutter integration
3. WHEN a donation is completed via Givebutter THEN the system SHALL capture donation metadata (non-PII) via webhook and store in the donations table
4. WHEN an administrator views the dashboard THEN the system SHALL display recent donations with amount and source

### Requirement 5: Tour Scheduling with Google Calendar

**User Story:** As a prospective parent, I want to schedule a school tour at a convenient time, so that I can visit the campus and learn more about the programs.

#### Acceptance Criteria

1. WHEN a user navigates to Admissions → Schedule a Tour THEN the system SHALL display a Google Calendar Appointment Page embed
2. WHEN an administrator configures tour settings THEN the system SHALL allow toggling between embed mode and native booking form
3. IF native booking is enabled WHEN a user submits a tour request THEN the system SHALL create an event via Google Calendar API and store a booking record
4. WHEN a booking is created THEN the system SHALL capture booking_name, email, start_at, end_at, and status
5. WHEN an administrator views the dashboard THEN the system SHALL display upcoming tours

### Requirement 6: Parent Portal - Authentication and Access

**User Story:** As a parent, I want to securely log in to a parent portal, so that I can access my family's information, invoices, registrations, and school resources.

#### Acceptance Criteria

1. WHEN a parent creates an account THEN the system SHALL use Supabase Auth for authentication
2. WHEN a parent logs in THEN the system SHALL verify their credentials and establish a secure session
3. WHEN a parent accesses the portal THEN the system SHALL enforce Row Level Security (RLS) to ensure they only see their family's data
4. WHEN a parent navigates the portal THEN the system SHALL provide access to Invoices, Registrations, Resources, and Profile sections
5. IF a user is not authenticated WHEN they attempt to access the parent portal THEN the system SHALL redirect to the login page

### Requirement 7: Parent Portal - Invoice Management

**User Story:** As a parent, I want to view and pay my family's invoices, so that I can manage my financial obligations to the school.

#### Acceptance Criteria

1. WHEN a parent views the Invoices section THEN the system SHALL display all invoices for their family with amount, due date, and status
2. WHEN a parent clicks on an invoice THEN the system SHALL provide a link to the Square-hosted invoice payment page
3. WHEN an administrator creates an invoice THEN the system SHALL use Square Invoices API and associate it with a family
4. WHEN an invoice is paid THEN the system SHALL update the status to "paid" in the invoices table
5. WHEN an administrator views unpaid invoices THEN the system SHALL display a summary on the admin dashboard

### Requirement 8: Parent Portal - Registration History

**User Story:** As a parent, I want to view my family's past and current event registrations, so that I can track which programs my children are enrolled in.

#### Acceptance Criteria

1. WHEN a parent views the Registrations section THEN the system SHALL display all registrations for their family with event name, student name, date, and status
2. WHEN a parent clicks on a registration THEN the system SHALL show detailed information including payment status and event details
3. WHEN a registration is created THEN the system SHALL associate it with the user_id and optionally student_id
4. WHEN an administrator exports registrations THEN the system SHALL generate a CSV file with registration data

### Requirement 9: Parent Portal - Resources Access

**User Story:** As a parent, I want to access private school resources like handbooks and forms, so that I can stay informed about school policies and procedures.

#### Acceptance Criteria

1. WHEN a parent views the Resources section THEN the system SHALL display all published parent resources organized by category
2. WHEN a parent clicks on a resource THEN the system SHALL provide a secure download link from Supabase Storage
3. WHEN an administrator uploads a resource THEN the system SHALL store the file in Supabase Storage and create a record with title, category, and is_published flag
4. WHEN an administrator unpublishes a resource THEN the system SHALL hide it from parent view
5. IF a resource is not published WHEN a parent attempts to access it THEN the system SHALL deny access

### Requirement 10: Parent Portal - Family Profile Management

**User Story:** As a parent, I want to update my family and student information, so that the school has accurate contact and demographic data.

#### Acceptance Criteria

1. WHEN a parent views the Profile section THEN the system SHALL display editable fields for family information (primary and secondary users) and student information (name, DOB, grade)
2. WHEN a parent updates profile information THEN the system SHALL validate the data and save changes to the families and students tables
3. WHEN a parent updates their email THEN the system SHALL update the users table and send a verification email
4. WHEN profile changes are saved THEN the system SHALL create an audit log entry
5. IF a parent attempts to modify another family's data THEN the system SHALL deny the request via RLS policies

### Requirement 11: Enrollment and FACTS Integration

**User Story:** As a prospective parent, I want to apply for enrollment through the FACTS Family Portal, so that I can complete the application process.

#### Acceptance Criteria

1. WHEN a user navigates to Admissions → Apply/Enroll THEN the system SHALL display a link to the FACTS Family Portal
2. WHEN a user clicks the enrollment link THEN the system SHALL redirect to the FACTS portal
3. WHEN the system is configured THEN the system SHALL provide a placeholder for future FACTS SSO/OneRoster integration
4. IF FACTS integration is enabled WHEN a user logs in THEN the system SHALL sync enrollment data with the local database

### Requirement 12: Blog and News Management

**User Story:** As a school administrator, I want to publish blog posts and news articles, so that I can keep the community informed about school activities and announcements.

#### Acceptance Criteria

1. WHEN an administrator creates a blog post THEN the system SHALL capture title, slug, excerpt, content (MDX), tags, and published_at timestamp
2. WHEN a user views the blog index THEN the system SHALL display published posts with filters for categories and tags
3. WHEN a user clicks on a blog post THEN the system SHALL render the detail page with formatted MDX content
4. WHEN an administrator schedules a post THEN the system SHALL only display it after the published_at timestamp
5. WHEN an administrator edits a post THEN the system SHALL update the content and maintain the original slug unless explicitly changed

### Requirement 13: Newsletter and Communications

**User Story:** As a community member, I want to sign up for the school newsletter, so that I can receive updates about school events and news.

#### Acceptance Criteria

1. WHEN a user submits the newsletter signup form THEN the system SHALL capture email and consent_at timestamp in the newsletter_signups table
2. WHEN a signup is successful THEN the system SHALL display a confirmation message
3. WHEN the system is configured THEN the system SHALL optionally sync newsletter signups with Mailchimp
4. WHEN a user views the site THEN the system SHALL display social media icons in the header and footer
5. WHEN an administrator enables an announcement THEN the system SHALL display a dismissible announcement bar at the top of the site

### Requirement 14: Admin Dashboard

**User Story:** As a school administrator, I want a centralized dashboard to monitor key metrics and manage content, so that I can efficiently oversee school operations.

#### Acceptance Criteria

1. WHEN an administrator logs in THEN the system SHALL display the admin dashboard with cards for unpaid invoices, capacity alerts, upcoming tours, and recent donations
2. WHEN an administrator accesses the dashboard THEN the system SHALL provide CRUD interfaces for Events, Invoices, Blog Posts, and Parent Resources
3. WHEN an administrator exports data THEN the system SHALL generate CSV files for registrations, invoices, or other relevant data
4. WHEN an administrator manages users THEN the system SHALL provide role assignment capabilities (admin, staff, parent)
5. WHEN an administrator views audit logs THEN the system SHALL display a filterable list of actions with actor, target, and timestamp

### Requirement 15: Security and Compliance

**User Story:** As a school administrator, I want the system to be secure and compliant with relevant regulations, so that student and family data is protected.

#### Acceptance Criteria

1. WHEN any database query is executed THEN the system SHALL enforce Supabase Row Level Security (RLS) policies to ensure users only access authorized data
2. WHEN the site is accessed THEN the system SHALL meet WCAG 2.2 AA accessibility standards
3. WHEN student or invoice data is accessed or modified THEN the system SHALL create an audit log entry for FERPA compliance
4. WHEN the site loads THEN the system SHALL implement Content Security Policy (CSP) headers and security best practices
5. WHEN third-party services (Square, Google, Givebutter) are used THEN the system SHALL display a cookie consent banner
6. WHEN PII is stored THEN the system SHALL minimize data collection and encrypt sensitive information

### Requirement 16: Deployment and Configuration

**User Story:** As a developer, I want clear deployment instructions and environment configuration, so that I can set up and maintain the application across different environments.

#### Acceptance Criteria

1. WHEN the application is deployed THEN the system SHALL run on Vercel for hosting Next.js app and API routes
2. WHEN the application is configured THEN the system SHALL use Supabase for database, authentication, and storage
3. WHEN environment variables are set THEN the system SHALL require SUPABASE_URL, SUPABASE_KEY, SQUARE_KEYS, GOOGLE_KEYS, GIVEBUTTER_IDS, and OPENAI_KEY
4. WHEN the database is initialized THEN the system SHALL apply Supabase migrations to create all required tables and RLS policies
5. WHEN the application is set up THEN the system SHALL provide documentation for setup, deployment, and environment variable configuration
6. WHEN seed data is needed THEN the system SHALL include scripts to migrate content from the existing WordPress site

### Requirement 17: Form Management System

**User Story:** As a school administrator, I want to create and manage custom forms for various purposes (inquiries, applications, surveys, feedback), so that I can collect structured information from prospective families, current parents, and community members.

#### Acceptance Criteria

1. WHEN an administrator creates a form THEN the system SHALL allow defining form fields with types (text, email, phone, select, checkbox, radio, textarea, file upload), validation rules, and conditional logic
2. WHEN a user accesses a form THEN the system SHALL display all active fields with proper validation and accessibility attributes
3. WHEN a user submits a form THEN the system SHALL validate all fields, store the submission in the form_submissions table, and optionally send confirmation email
4. WHEN an administrator views form submissions THEN the system SHALL display all responses with filtering by form, date range, and status
5. WHEN a form submission is received THEN the system SHALL optionally trigger automated workflows (e.g., add to CRM, send notification, create task)
6. WHEN an administrator exports form data THEN the system SHALL generate CSV files with all submission data
7. WHEN a form includes file uploads THEN the system SHALL store files securely in Supabase Storage and associate with the submission

### Requirement 18: CRM for Marketing and Lead Management

**User Story:** As a school administrator or marketing coordinator, I want a CRM system to manage prospective families, track engagement, and segment contacts for targeted communications, so that I can nurture leads and improve enrollment conversion.

#### Acceptance Criteria

1. WHEN a prospective family submits an inquiry form or tour request THEN the system SHALL automatically create a contact record in the CRM with source tracking
2. WHEN an administrator views the CRM dashboard THEN the system SHALL display contacts with filters for status (lead, prospect, enrolled, alumni), source, grade interest, and engagement score
3. WHEN an administrator views a contact detail page THEN the system SHALL show contact information, interaction history (form submissions, tour bookings, event registrations, email opens), notes, and tags
4. WHEN an administrator adds notes or tags to a contact THEN the system SHALL timestamp the entry and associate it with the actor
5. WHEN an administrator segments contacts THEN the system SHALL allow creating lists based on criteria (status, tags, date ranges, engagement level, grade interest)
6. WHEN an administrator exports a contact list THEN the system SHALL generate CSV files for use in email marketing tools
7. WHEN a contact's status changes (e.g., lead → enrolled) THEN the system SHALL update the CRM record and optionally trigger automated workflows
8. WHEN the system tracks engagement THEN the system SHALL calculate an engagement score based on interactions (form submissions, tour attendance, event registrations, email opens, page visits)
9. WHEN an administrator views marketing analytics THEN the system SHALL display metrics for lead sources, conversion rates, and engagement trends
10. WHEN a contact unsubscribes from communications THEN the system SHALL update their preferences and respect opt-out status in all marketing activities

### Requirement 19: Optional AI Features

**User Story:** As a school administrator, I want optional AI-powered tools to help with content creation, so that I can efficiently draft blog posts, answer parent FAQs, and summarize newsletters.

#### Acceptance Criteria

1. IF OpenAI integration is enabled WHEN an administrator drafts a blog post THEN the system SHALL provide AI suggestions for content
2. IF OpenAI integration is enabled WHEN an administrator creates FAQ responses THEN the system SHALL offer AI-generated draft answers
3. IF OpenAI integration is enabled WHEN an administrator prepares a newsletter THEN the system SHALL provide AI-generated summaries
4. WHEN AI features are disabled THEN the system SHALL function fully without OpenAI integration
5. WHEN AI-generated content is used THEN the system SHALL clearly indicate it requires human review before publishing
