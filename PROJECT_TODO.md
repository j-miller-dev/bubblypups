# Bubbly Pups Website — Project TODO Roadmap (Concise)

This roadmap summarizes what’s built and what’s next. It’s organized by feature area with clear status and actions.

Legend: [✓] done • [*] in progress • [ ] planned

1. Foundations
- [✓] Laravel + Inertia (React + TS) baseline with Vite
- [✓] Herd/Valet-friendly Vite dev config
- [✓] Base layout with Navbar, Footer, Head metadata
- [✓] Mobile navigation (Headless UI Disclosure)
- [ ] Error boundaries and 404 page

2. Styling / UX Coherence
- [✓] Pastel, clean brand feel on Home (Hero + Bubbles), About Me, Services, Testimonials
- [✓] Consistent Button/Container primitives
- [ ] Audit color tokens, dark mode pass, heading scale, spacing rhythm site-wide
- [ ] Accessibility (focus states, aria, color contrast)

3. Public Pages
- Home: [✓] Hero (large centered logo), About Me, Services, Facebook feed, Testimonials
- Pricing: [✓] placeholder page exists (content TBD)
- Blog/Company: [✓] placeholders (content TBD)
- Contact: [ ] Contact form + backend submission (MVP)

4. Booking (Customer Flow)
- Entry screen (Returning vs New): [✓]
- New customer quick registration: [✓]
- Returning customer quick login (email/mobile + dog name): [✓]
- Appointment form (service, dog info, schedule, contact): [✓]
- Persist to DB (owners/dogs/bookings): [*] (controller + migrations added in this commit)
- Confirmation (email/text): [*] logs for now (MAIL_MAILER=log). SMS provider TBD.
- Dashboard view/manage bookings: [ ] (basic pages exist; needs data wiring)

5. Dashboard (Admin)
- Admin shell with sidebar + top bar: [✓]
- Overview / Bookings / Doggie Database pages: [✓] (static data)
- Hook up to DB data: [ ] (read bookings, owners, dogs)
- Calendar: [ ] (list + calendar view)
- Reports: [ ] (basic KPIs)
- Documents/Inventory: [ ] (scope TBD)

6. Data Layer
- SQLite local persistence: [✓] .env configured
- Migrations & Models: [*] owners, dogs, bookings, testimonials, contacts (added)
- Seeders: [ ] sample data for dev

7. Notifications
- Email confirmations: [*] send to log (ready to switch to SMTP provider)
- SMS confirmations: [ ] integrate Twilio/Vonage (env + service + job)
- Queue setup: [ ] switch queue to database/redis for production

8. Testimonials & Services
- Static components: [✓]
- Admin CRUD backed by DB: [ ] (tables added; wire later)

9. Contact Form
- React page: [ ] (Contact.tsx)
- Backend endpoint: [ ] (ContactController@store)
- Store to DB and send email/log: [ ]

10. DevOps
- [ ] Production build config + deploy steps
- [ ] .env.example for collaborators

How to proceed next (suggested order):
1) Finalize booking persistence + wire Dashboard to show real bookings.
2) Add Contact page + backend.
3) Add email (SMTP) provider + queue for confirmations; later, integrate SMS.
4) Replace static testimonials/services with DB-backed content and simple admin CRUD.
5) A11y + design coherence sweep.

Notes
- All new backend endpoints are intentionally minimal and use MAIL_MAILER=log so you can verify messages in storage/logs without external dependencies.
- When ready to add SMS, configure provider credentials in .env and switch the stubbed notifier to a real service.
