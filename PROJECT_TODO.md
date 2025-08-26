# Bubbly Pups Website — Complete TODO & Roadmap

Legend: [✓] done • [*] in progress • [ ] planned • [!] needs decision

This document is the authoritative TODO/readme for what exists, what’s missing, and what to do next. Each item references relevant code where helpful.

— Last updated: 2025‑08‑26

1. Foundations
- [✓] Stack in place: Laravel 11 + Inertia (React 19 + TypeScript), Vite 7, Tailwind v4. See docs/PROJECT_GUIDE.md.  
- [✓] Dev ergonomics: Herd/Valet-friendly Vite config (TLS/host via env). vite.config.js  
- [✓] Base layouts:  
  - Public: resources/js/Layouts/MainLayout.tsx  
  - Admin: resources/js/Layouts/AdminLayout.tsx  
- [✓] Navigation + metadata: Navbar/Footer; per-page <Head> usage.  
- [ ] Error handling: global error boundary for React pages; nice 404 page.  
- [ ] Auth decision: Breeze/Fortify for admin login, or keep dashboard behind basic auth for now. [!]

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
  - /booking/register → Booking/Register.tsx  
  - /booking/returning → Booking/Returning.tsx  
- [✓] Appointment form: resources/js/Pages/Booking.tsx (multi-step: service → dog → schedule → contact → confirm).  
- [✓] Persistence MVP: POST /bookings → BookingController@store, upserts Owner, first-or-creates Dog, creates Booking, logs confirmation.  
- [*] Confirmation messaging: logging only right now; email/SMS pending configuration.  
- [ ] Availability integration: use Availability model/seeded hours to disable unavailable slots on the form.  
- [ ] Existing customer prefill: from localStorage to initial form state; optionally load from backend by email/phone later.  
- [ ] Validation UX: date-in-future, timeslot validity enforced client-side now; consider server-side guards.

4. Admin Dashboard
- [✓] Shell + nav: Admin layout with sidebar/topbar.  
- [*] Dogs page wired to DB: /dashboard/dogs → DashboardController@dogs returns paginated dogs with owner + last visit summary.  
  - Page: resources/js/Pages/Dashboard/Dogs.tsx  
  - [ ] Pagination links: ensure dogs.links is provided in controller (currently using simplePaginate → return pagination meta/links explicitly for React).  
- [ ] Overview: Consider wiring to DashboardController@overview (stats) and route /dashboard to controller rather than closure.  
- [ ] Bookings page: replace placeholder with real DB list + filters (status, date range, service).  
- [ ] Availability management: CRUD for weekly availability using Availability model.  
- [ ] Services management: CRUD for Service model (name/price/duration/tiers/is_active).  
- [ ] Reports (basic KPIs): bookings per period, top services, repeat customers.  
- [ ] Role-protection: restrict dashboard routes via auth/middleware.

5. Data Layer and Schema Alignment
- [✓] Migrations present: owners, dogs, bookings, contacts, services, booking_services, availability.  
- [!] IMPORTANT: Booking model vs migration mismatch  
  - Model app/Models/Booking.php expects: scheduled_at, duration_minutes, total_amount, location, services pivot.  
  - Migration database/migrations/2025_08_14_000020_create_bookings_table.php creates: service, date, time, status, notes.  
  - Controller + tests use service, date, time, status.  
  - Action: choose one schema and align all of: migration, model, controller, tests, UI.  
    - Option A (simpler/MVP): keep service/date/time on bookings; remove pivot for now. Update Booking model fillable/casts/relations accordingly.  
    - Option B (richer): move to scheduled_at (datetime), duration, total_amount, and relate services via booking_services; update controller/tests/UI.  
  - [ ] Implement chosen option and add a follow-up migration if needed.  
- [*] Seeders: ServiceSeeder and AvailabilitySeeder exist.  
  - [ ] Add Owner/Dog/Booking seeders for richer dev data; ensure Booking schema decision is reflected.  
- [ ] Indices: consider indexes on owners.email/phone, dogs.owner_id+name, bookings.date/status for query perf.

6. Notifications (Email/SMS)
- Current state: MAIL_MAILER=log; controllers log booking and contact events.  
- [ ] Configure SMTP in .env and switch to smtp mailer.  
- [ ] Create Mailable for booking confirmation and send on BookingController@store.  
- [ ] Add queue (database/redis) and dispatch email job; set QUEUE_CONNECTION accordingly.  
- [ ] SMS: Add provider (Twilio/Vonage), service class, queued job, env configuration, and feature-flag it.

7. UX, Accessibility, and Design Coherence
- [✓] Brand direction implemented on Home (Bubbles, pastel).  
- [ ] Global design tokens: colors, spacing, typography scale; ensure consistency across pages.  
- [ ] Accessibility sweep: focus styles, aria labels, form labels/help, color contrast.  
- [ ] Mobile polish: ensure booking steps and dashboard tables are great on small screens.  
- [ ] Animations: keep subtle and accessible; prefers-reduced-motion respect.

8. Security and Hardening
- [ ] Rate limit POST /bookings and POST /contact (Throttle middleware).  
- [ ] Validation: add stricter server-side validations (future date/time); normalize phone numbers.  
- [ ] Auth: protect dashboard routes; add CSRF meta and Axios defaults on frontend (verify already in app.tsx).  
- [ ] Logging: avoid logging PII in production; sanitize logs.  
- [ ] Environment: .env.example with non-secret defaults; clear documentation about secrets.

9. Testing
- [✓] Feature tests: tests/Feature/BookingFlowTest.php covers rendering, submission, validation cases, existing owner, multiple services.  
- [ ] Add tests:  
  - Contact submission → persists and returns ok.  
  - DashboardController@dogs returns expected shape and pagination.  
  - Booking schema decision: update tests to reflect chosen schema (date+time vs scheduled_at).  
  - Services/Availability CRUD when added.  
  - Basic auth/permissions for dashboard (if implemented).  
- [ ] Consider Pest for succinct tests (optional).

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
