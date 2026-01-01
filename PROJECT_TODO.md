# Bubbly Pups Website — Complete TODO & Roadmap

Legend: [✓] done • [*] in progress • [ ] planned • [!] needs decision

This document is the authoritative TODO/readme for what exists, what's missing, and what to do next. Each item references relevant code where helpful.

— Last updated: 2025‑12‑20

---

## Current State Summary

**What's Working:** ✓ Customer registration with dog profiles ✓ Customer login ✓ Appointment booking flow ✓ Toast notifications ✓ Database persistence ✓ AvailabilityService ✓ 72 reusable UI components

**What's Not Working:** ✗ Admin dashboard (empty controllers) ✗ Test suite (failing) ✗ Authorization/middleware ✗ Dynamic slot fetching ✗ Email notifications

**Estimated Completion:** ~40% feature-complete for production MVP

---

## CRITICAL ISSUES — Blockers for MVP/Production

1. **Test Suite Failing** — BookingFlowTest.php references obsolete Owner/Booking models (should be Customer/Dog/Appointment). 8/9 tests failing.
2. **Admin Controllers Empty** — AppointmentController and BlockedTimeController are stubs; no implementation. Admin dashboard non-functional.
3. **No Authorization** — Customer routes (POST /appointments) and admin routes (/dashboard/*) lack auth middleware. Security risk.
4. **Available Slots Hardcoded** — Frontend hardcodes time slots; backend GET /availability/slots/{date} exists but unused.
5. **Email Notifications Not Configured** — MAIL_MAILER=log; no real booking confirmations sent.

**Recommended Priority:** Fix tests → Implement admin controllers → Add auth middleware → Wire available slots → Configure email.

---

1. Foundations
- [✓] Stack in place: Laravel 12 + Inertia v2 (React 19 + TypeScript), Vite 7, Tailwind v3. See docs/PROJECT_GUIDE.md.
- [✓] Dev ergonomics: Herd/Valet-friendly Vite config (TLS/host via env). vite.config.js
- [✓] Base layouts:
  - Public: resources/js/Layouts/MainLayout.tsx
  - Admin: resources/js/Layouts/SidebarLayout.tsx (replaced AdminLayout)
  - Auth: resources/js/Layouts/AuthLayout.tsx
- [✓] Navigation + metadata: Navbar/Footer; per-page <Head> usage.
- [✓] Component library: 72 reusable UI components (ui/, forms/, business/, graphics/, layout/).
- [ ] Error handling: global error boundary for React pages; nice 404 page.
- [*] Auth decision: Customer authentication via separate Customer model/guard; Fortify configured but admin auth pending. [!]

2. Public Website Pages
- [✓] Home: Hero, About Me, Services, Facebook feed, Testimonials. resources/js/Pages/Home.tsx  
- [✓] Pricing: Placeholder. resources/js/Pages/Pricing.tsx  
- [✓] Blog, Company: Placeholders. resources/js/Pages/Blog.tsx, Company.tsx  
- [*] Contact: Page exists; backend implemented.  
  - Page: resources/js/Pages/Contact.tsx  
  - Endpoint: POST /contact → app/Http/Controllers/ContactController.php (stores to contacts table and logs)  
  - [ ] Validate UX: client-side validation, success/failure states, spam protection (honeypot/reCAPTCHA v3).  
  - [ ] Optional: Send email via Mailable when mailer is configured.

3. Booking (Customer Flow)
- [✓] Triage pages:
  - /booking → Booking/Start.tsx
  - /booking/register → Booking/CustomerRegister.tsx (wired to CustomerController@storeCustomer)
  - /booking/returning → Booking/Returning.tsx
- [✓] Customer registration: POST /customer/register → CustomerController@storeCustomer with embedded dog profile creation.
- [✓] Customer login: POST /customer/login → CustomerController@login with session-based auth.
- [✓] Appointment creation: resources/js/Pages/Booking/Create.tsx → POST /appointments → AppointmentController@store.
- [✓] Toast notifications: Success/error toasts implemented using Inertia flash messages.
- [✓] Persistence verified: Customer, Dog, and Appointment records confirmed saving to DB.
- [✓] Service layer: AvailabilityService with business hours, time slot generation, blocked time support.
- [*] Confirmation messaging: logging only right now; email/SMS pending configuration.
- [!] CRITICAL: Available slots hardcoded in frontend; backend GET /availability/slots/{date} exists but unused.
  - [ ] Wire Booking/Create.tsx to fetch slots dynamically from backend API.
- [ ] Existing customer prefill: load dog/customer data after login for appointment form.
- [ ] Validation improvements: server-side date validation, prevent double-booking at controller level.
- [ ] Authorization: Add auth middleware to protect POST /appointments (currently public endpoint).

4. Admin Dashboard
- [✓] Shell + nav: SidebarLayout with navigation links to all dashboard pages.
- [✓] Dashboard pages exist: Overview, Bookings, Dogs, Availability, Calendar (resources/js/Pages/Dashboard/).
- [!] CRITICAL: Admin controllers are empty stubs — routes defined but no implementation:
  - [ ] app/Http/Controllers/Admin/AppointmentController.php — implement index, show, update (confirm/cancel), destroy.
  - [ ] app/Http/Controllers/Admin/BlockedTimeController.php — implement full CRUD (index, store, update, destroy).
- [ ] Dogs management: Wire Dashboard/Dogs.tsx to controller (currently references non-existent DashboardController@dogs).
- [ ] Bookings page: Implement AppointmentController@index with filters (status, date range) and pagination.
- [ ] Availability management: Wire Dashboard/Availability.tsx to BlockedTimeController for CRUD operations.
- [ ] Calendar view: Implement appointment calendar visualization (Dashboard/Calendar.tsx exists but not wired).
- [ ] Overview stats: Wire Dashboard/Overview.tsx to display KPIs (total appointments, upcoming, completed).
- [!] CRITICAL: No role-based protection — dashboard routes accessible without auth middleware.

5. Data Layer and Schema Alignment
- [✓] Core migrations: customers, dogs, appointments, blocked_times (September 2025 DB reset).
- [✓] Models implemented: Customer, Dog, Appointment, BlockedTime with proper relationships.
- [✓] Relationships defined:
  - Customer hasMany Dogs, hasMany Appointments (through Dog)
  - Dog belongsTo Customer, hasMany Appointments
  - Appointment belongsTo Customer and Dog
  - All with explicit return type hints
- [✓] Appointment schema: Uses appointment_date (date) + appointment_time (time) + status enum (pending/confirmed/cancelled/completed).
- [✓] Unique constraint: Prevents double-booking on (appointment_date, appointment_time).
- [!] Missing cascade deletes: Foreign keys on appointments table don't cascade on delete — could orphan records if dogs/customers deleted.
- [ ] Consider consolidating appointment_date + appointment_time to single datetime column for simpler queries.
- [ ] Add indexes: customers.email/phone, dogs.customer_id+name, appointments.appointment_date/status for performance.
- [ ] Seeders: Create Customer/Dog/Appointment seeders for richer dev data (currently none exist).

6. Notifications (Email/SMS)
- [!] Current state: MAIL_MAILER=log — emails written to storage/logs/laravel.log, not sent to customers.
- [ ] Configure SMTP provider in .env (Mailgun, SendGrid, SES, or SMTP server).
- [ ] Create Mailable classes:
  - AppointmentConfirmation (customer booking confirmation).
  - ContactFormReceived (admin notification for contact form submissions).
- [ ] Wire mailables to controllers:
  - AppointmentController@store should send AppointmentConfirmation.
  - ContactController@store should send ContactFormReceived.
- [ ] Add queue system:
  - Set QUEUE_CONNECTION=database or redis in .env.
  - Run php artisan queue:table and migrate.
  - Dispatch mail jobs asynchronously.
  - Document queue worker setup for production (supervisor/systemd).
- [ ] SMS reminders (future): Twilio/Vonage integration for day-before appointment reminders.

7. UX, Accessibility, and Design Coherence
- [✓] Brand direction implemented on Home (Bubbles, pastel).
- [✓] Toast notifications: resources/js/Components/ui/Toast.tsx with success/error/info states, auto-dismiss.
- [ ] Type consistency: Mixed .tsx and .jsx file extensions across pages/components — standardize to .tsx.
- [ ] Global design tokens: colors, spacing, typography scale; ensure consistency across pages.
- [ ] Accessibility sweep: focus styles, aria labels, form labels/help, color contrast.
- [ ] Mobile polish: ensure booking steps and dashboard tables are great on small screens.
- [ ] Animations: keep subtle and accessible; prefers-reduced-motion respect.

8. Security and Hardening
- [!] CRITICAL: No auth middleware on customer routes — POST /appointments is publicly accessible.
  - [ ] Add 'auth:customer' middleware to appointment creation route.
  - [ ] Add middleware to customer profile routes.
- [!] CRITICAL: No auth middleware on admin dashboard routes — anyone can access /dashboard/*.
  - [ ] Implement admin authentication (User model with role or separate Admin model).
  - [ ] Add 'auth' or 'auth:admin' middleware to all /dashboard routes.
- [ ] Rate limiting: Add Throttle middleware to POST /customer/register, POST /customer/login, POST /appointments, POST /contact.
- [ ] Validation improvements: server-side date validation (future dates only), normalize phone numbers.
- [ ] Double-booking prevention: Add additional unique constraint or controller-level check for customer+dog+datetime.
- [✓] CSRF protection: Laravel default enabled.
- [ ] Email verification: Consider requiring verified email before allowing bookings.
- [ ] Logging: Avoid logging PII in production; sanitize logs.
- [ ] Environment: Update .env.example with non-secret defaults; document all required secrets.

9. Testing
- [!] CRITICAL: BookingFlowTest.php FAILING — tests reference obsolete Owner and Booking models (8/9 assertions failing).
  - [ ] Rewrite tests to use Customer, Dog, Appointment models.
  - [ ] Update route references (POST /bookings doesn't exist, should be POST /appointments).
  - [ ] Update factory usage to match current schema.
- [✓] Pest configured and used for existing tests (tests/Feature/, tests/Unit/).
- [ ] Add missing tests:
  - Customer registration (POST /customer/register with dog creation).
  - Customer login (POST /customer/login).
  - Appointment creation (POST /appointments).
  - AvailabilityService (unit tests for slot generation, blocked times).
  - Admin controllers (when implemented).
  - Authorization checks on protected routes.
- [ ] Frontend tests: Vitest configured but minimal coverage — add component tests for booking flow.

10. Performance
- [ ] Database N+1 checks on dashboard pages; ensure with() eager loads owner/bookings where needed (dogs already does).  
- [ ] Client bundle size: code-split heavy dashboard sections, tree-shake icons.  
- [ ] Use pagination consistently on lists; add simple search/filter on server.

11. Deployment and Ops
- [ ] Add deploy guide: build assets (npm run build), env setup, storage:link, migrate --force, queue workers, cache config/routes/views.  
- [ ] Production logging: channel/rotation; disable debug.  
- [ ] Backups: DB backup strategy (if using SQLite, move to MySQL/Postgres in prod).  
- [ ] Monitoring: basic uptime + error tracking (Sentry/Bugsnag).  

12. Documentation
- [✓] README.md updated with Inertia routing guidance and dev commands.  
- [✓] docs/PROJECT_GUIDE.md provides architecture/how‑to.  
- [*] This TODO: acts as the roadmap for the project.  
- [ ] Keep route list in README and this doc in sync when adding pages.  
- [ ] Add architectural decision records (ADRs) for key choices (Booking schema, Auth).

13. Nice-to-haves and Future Ideas
- [ ] Owner portal: view past/upcoming bookings, update dog profile.  
- [ ] Reminders: day-before SMS/email reminders.  
- [ ] Payments: deposit or full payment at booking (Stripe).  
- [ ] Photo gallery: Dog photos per booking; social sharing.  
- [ ] Multi-location support.  

Appendix: Quick Links
- Routes: routes/web.php  
- Controllers: app/Http/Controllers/  
- Models: app/Models/  
- Pages: resources/js/Pages/  
- Components: resources/js/Components/  
- Migrations: database/migrations  
- Seeders: database/seeders  
- Tests: tests/  
- Guides: docs/PROJECT_GUIDE.md
