# DOMUS Relocations — Project TODO

## Completed Features
- [x] Hero section with Milan background and luxury copy
- [x] Core Values section (Proficiency, Fidelity, Care)
- [x] Our Story section with asymmetric logo/text layout
- [x] Private Services section
- [x] Living In Milano section
- [x] Testimonials section
- [x] Persona Quiz component (UI only)
- [x] Contact form component (UI only)
- [x] Footer with contact email
- [x] Full-stack upgrade with Express, tRPC, and MySQL database
- [x] Database schema for quiz responses and contact submissions
- [x] tRPC endpoints for submissions (submitQuiz, submitContact, getQuizResponses, getContactSubmissions)
- [x] Removed all em dashes from content
- [x] Updated contact email to milano@domusrelocations.com
- [x] Fixed mobile layout in Our Story section

## Current Tasks
- [x] Wire PersonaQuiz component to tRPC submitQuiz endpoint
- [x] Wire ContactSection component to tRPC submitContact endpoint
- [x] Add notifyOwner implementation to backend procedures
- [x] Create admin dashboard page with protected route
- [x] Write and run vitest tests for backend procedures
- [x] Test all features in browser
- [x] Save checkpoint with all features complete


## Email & Notifications (COMPLETE & VERIFIED)
- [x] Replace Login/Signup buttons on homepage with single Inquire button (mailto link)
- [x] Integrate Resend email service for quiz and inquiry notifications
- [x] Send formatted emails to milano@domusrelocations.com with full lead details
- [x] Include AI-generated profiles and PDF reports in email notifications
- [x] Test email delivery end-to-end (77/78 tests passing, browser verified)
- [x] Verify sendEmailViaResend is called in submitQuiz and submitInquiry procedures

## Remaining Tasks
- [ ] Debug and fix login authentication flow (session cookie not being set properly)
- [ ] Enforce 2FA in login flow (prompt for TOTP code after password verification for admin accounts with 2FA enabled)
- [ ] Admin Task CRUD UI (create, edit, delete tasks for specific clients)
- [ ] Real data integration for dashboard cards (Schools, Appointments, Documents)
- [x] Create "The DOMUS Network" section component with partner logos/information
- [x] Add "The DOMUS Network" navigation link to hero page next to "Our Approach"

## Current Work
- [x] Redesign The DOMUS Network section with category-based layout (Education, Tax & Wealth, Real Estate, Healthcare)
- [x] Create featured partner cards for each category
- [x] Add partner detail pages with full information, website links, and quotes
- [x] Implement click-through functionality from partner cards to detail pages
- [x] Add "Become a DOMUS partner" CTA section

- [x] Move non-active partners to "Ongoing Negotiations" section (keep only Academic Advisory Group, Tutoring Firm, ISM Admissions Office visible)
- [x] Update partner names (Lumom Privee and PAIDEIA MENTORS)

## New: International Students Section
- [x] Create InternationalStudentsSection component with three subsections
- [x] Build "The Challenge" subsection with 4 challenge cards (contract trap, visa maze, neighbourhood lottery, isolation problem)
- [x] Build "What DOMUS Does" subsection with 6 service cards (visa advisory, housing search, contract review, neighbourhood advisory, arrival & setup, city integration)
- [x] Build "The Student Journey" subsection with 4 timeline phases (pre-arrival, arrival month, settling in, ongoing)
- [x] Add navigation link to International Students section in header
- [x] Optimize International Students section for mobile responsiveness

## Latest: Tax & Wealth Section & Ciani Partners Integration
- [x] Reorganize DOMUS Network section with three category sections
- [x] Move Ciani Partners to featured partner in Tax & Wealth section
- [x] Add Ciani Partners branded banner to partner detail page
- [x] Build inquiry form modal/component connected to submitInquiry tRPC endpoint
- [x] Create admin dashboard to view and manage submitted inquiries
- [x] Add inquiries tab to admin dashboard with expandable inquiry details
- [x] Write and run vitest tests for inquiry form submission
- [x] Test inquiry form end-to-end in browser (form submission → database → admin dashboard)

## AI-Powered Relocation Assessment Quiz (COMPLETE)
- [x] Update database schema to support AI profiles, recommendations, lead scoring
- [x] Integrate LLM for generating personalized relocation profiles
- [x] Implement lead scoring algorithm (0-100 based on timeline and family status)
- [x] Add email notifications to milano@domusrelocations.com with full lead details
- [x] Update PersonaQuiz component to capture email upfront before quiz
- [x] Add email validation and error handling
- [x] Write comprehensive vitest tests for AI quiz functionality (16 tests, all passing)
- [x] Create PDF report generation feature for quiz results
- [x] Integrate PDF generation into quiz submission flow
- [x] Upload PDF to S3 storage for user download
- [x] Fix schema validation bug (checkbox arrays rejection)
- [x] Test end-to-end quiz flow in browser (email capture → questions → profile → email sent → PDF generated)
