# Bubbly Pups Website — Project Guide (Architecture, How‑To, Best Practices)

This guide explains the architecture, what was added during the recent iterations, how to run and extend the project, and recommended structure and practices.

Last updated: 2025-08-14


## 1) Tech Stack Overview
- Backend: Laravel 11
- Frontend: React 19 + TypeScript via Inertia.js
- Build: Vite 7 with laravel-vite-plugin
- Styling: Tailwind CSS v4 (with @tailwindcss/vite)
- UI: Headless UI, Heroicons, Framer Motion
- Database: SQLite (local), Eloquent models
- Dev environment: Herd/Valet or php artisan serve


## 2) Local Setup
1. Install dependencies
   - composer install
   - npm install
2. Environment
   - Copy .env if needed and ensure:
     - APP_URL=http://bubbly-pups-website.test (or your dev URL)
     - DB_CONNECTION=sqlite (default) and ensure storage/database.sqlite exists (laravel will create if migrations run with sqlite file configured)
     - VITE_VALET_TLS_DOMAIN and VITE_DEV_HOST are set if you use Herd/Valet with TLS (optional)
3. Run migrations
   - php artisan migrate
4. Start servers
   - php artisan serve (if not using Herd)
   - npm run dev
5. Visit the app
   - http://bubbly-pups-website.test (Herd) or http://localhost:8000

Troubleshooting (white page when npm run dev is on):
- We configured vite.config.js to respect optional TLS and custom host via env. Ensure VITE_DEV_HOST matches your dev domain.
- The root Inertia entry is resources/js/app.tsx; welcome.blade.php was corrected to reference app.tsx.
- Hard refresh, clear cache if assets look stale.


## 3) Project Structure (high level)
- resources/js
  - app.tsx — Inertia boot + page resolver
  - Layouts/
    - MainLayout.tsx — Public pages wrapper (Navbar, Footer, Head)
    - AdminLayout.tsx — Dashboard shell (sidebar + topbar)
  - Components/ — Reusable UI (Button, Container, Navbar, Footer, Image, Link, Testimonials, Services, Bubbles, etc.)
  - Pages/
    - Home.tsx — Public home page
    - Contact.tsx — Public contact form
    - Booking.tsx — Appointment multi-step (service → dog → schedule → contact → confirmation)
    - Booking/Start.tsx — Triage: returning vs new
    - Booking/Register.tsx — New customer quick registration (prefill only)
    - Booking/Returning.tsx — Returning customer quick login (prefill only)
    - Dashboard/
      - Overview.tsx
      - Bookings.tsx
      - Dogs.tsx
- routes/web.php — Laravel routes returning Inertia pages
- app/Http/Controllers/
  - BookingController.php — POST /bookings to persist booking
  - ContactController.php — POST /contact to log/store contact messages
- app/Models/ — Eloquent models for Owner, Dog, Booking, Testimonial
- database/migrations — Owners, Dogs, Bookings, Testimonials, Contacts tables
- resources/views/app.blade.php — Root Inertia document
- docs/PROJECT_GUIDE.md — This guide
- PROJECT_TODO.md — Concise roadmap
- TRANSITION_REPORT.md — Transition notes


## 4) Routing with Laravel + Inertia
Define routes in routes/web.php and return Inertia pages by name. The name maps to resources/js/Pages/<Name>.tsx.

- Public examples:
  - / → Inertia::render('Home')
  - /contact → Inertia::render('Contact')
  - /pricing, /blog, /company — placeholders OK
- Booking flow (triage → appointment):
  - /booking → Booking/Start
  - /booking/returning → Booking/Returning
  - /booking/register → Booking/Register
  - /booking/appointment → Booking (full multi‑step form)
- Dashboard nested pages:
  - /dashboard → Dashboard/Overview
  - /dashboard/bookings → Dashboard/Bookings
  - /dashboard/dogs → Dashboard/Dogs

Frontend links use the custom Link component (wraps Inertia Link) at resources/js/Components/Link.tsx.


## 5) Layouts and Head
- Use MainLayout for public pages. It sets default <Head> title + description and includes Navbar/Footer/CallNowButton.
- Use AdminLayout for dashboard pages. It provides a persistent sidebar + topbar and highlights active nav by URL.
- Page components can override title/description via <Head> inside their render.


## 6) Styling & Design Guidelines
- Tailwind v4 utility-first classes.
- Brand direction: clean, cute, professional; pastel colours.
- Shared primitives: Button, Container, Image, Link to keep styling consistent.
- Avoid heavy background overlays that obscure content (e.g., we removed the full-page gradient on Booking).
- Bubbles component adds subtle on-brand motion to hero; it uses a light pastel palette.

Recommended consistency tasks (see PROJECT_TODO.md):
- Define a small set of brand colours (pastel palette) and reuse.
- Check focus states, aria labels; ensure contrast.
- Keep heading scale and spacing rhythm consistent across pages.


## 7) Data Model and Persistence
Migrations added (timestamps are 2025-08-14):
- owners (name, email?, phone?, address?)
- dogs (owner_id, name, breed?, age?, weight?, notes?)
- bookings (owner_id, dog_id, service, date?, time?, status='pending', notes?)
- testimonials (author, content, rating)
- contacts (name, email?, phone?, message)

Models:
- Owner hasMany Dog, hasMany Booking
- Dog belongsTo Owner, hasMany Booking
- Booking belongsTo Owner and Dog; casts date as a date
- Testimonial basic model


## 8) Controllers and Endpoints
- POST /bookings → BookingController@store
  - Validates service, dog, appointment, contact
  - Upserts Owner by email/phone when provided
  - First-or-create Dog by (owner_id + dog name)
  - Creates Booking with status=pending
  - Logs a simulated notification (SMS/email) to storage logs
  - Returns JSON { ok: true, booking_id }

- POST /contact → ContactController@store
  - Validates basic contact input
  - Inserts into contacts table
  - Logs message and returns { ok: true }

Security notes
- CSRF is handled; fetch submission sets X-CSRF-TOKEN reading from meta tag in app.blade.php.
- For production, secure routes that require auth, rate limit public endpoints, and validate inputs strictly.


## 9) Booking Flow (Frontend)
- Start page (/booking): asks if returning or new (Start.tsx)
- Returning: collect identifier (email/mobile) and dog name; stashes to localStorage and navigates to appointment
- New: collects owner + dog basics; stashes to localStorage and navigates to appointment
- Appointment (Booking.tsx) steps:
  1) ServiceSelection
  2) DogInformation
  3) AppointmentScheduling
  4) ContactInformation → submits to POST /bookings
  5) Confirmation

Notes:
- The triage forms currently prefill local state only (no auth). This is deliberate for MVP speed.
- Real authentication or owner lookup can be added later; see Roadmap.


## 10) Dashboard
- AdminLayout provides shell and active highlighting using usePage().url.
- Pages:
  - Overview: intro copy
  - Bookings: sample list (replace with DB data later)
  - Dogs: sample list (replace with DB data later)

How to add a new dashboard section
1) Create a page file under resources/js/Pages/Dashboard/<Name>.tsx and wrap contents in <AdminLayout>.
2) Add a route in routes/web.php:
   Route::get('/dashboard/<slug>', fn () => Inertia::render('Dashboard/<Name>'))->name('dashboard.<slug>');
3) Add a nav item in AdminLayout.tsx (nav array) with { name, href: '/dashboard/<slug>', icon }.
4) Navigate to /dashboard/<slug>; the page renders inside the layout.


## 11) Conventions for Adding Public Pages
1) Create resources/js/Pages/MyPage.tsx using MainLayout and optional <Head>.
2) Add a route in routes/web.php: Route::get('/mypage', fn () => Inertia::render('MyPage'))->name('mypage');
3) Link to it via <Link href="/mypage">Go</Link>.


## 12) Notifications (Email/SMS) Plan
- Current: MAIL_MAILER=log; booking/contact actions log to storage/logs for verification.
- Next steps:
  - Configure SMTP provider in .env and switch mailer to smtp
  - Implement a simple Mailable for booking confirmation
  - Add SMS provider (Twilio/Vonage) with a service class and dispatch a queued job to send SMS
  - Move queues to database/redis for production reliability


## 13) Deployment Notes
- Build assets: npm run build
- Ensure APP_URL and Vite manifest are correct in production
- Configure web server to route all app pages to public/index.php
- Run php artisan migrate --force
- Set up proper cache/queue/session drivers


## 14) Troubleshooting
- White screen on dev:
  - Ensure npm run dev is running and vite.config.js host matches your dev domain
  - For Valet/Herd TLS, set VITE_VALET_TLS_DOMAIN and VITE_DEV_HOST accordingly
- Title/Head not updating:
  - Inertia <Head> inside your React page/layout controls the document title, not app.blade.php directly
- 404 on a specific page module:
  - Make sure resources/js/Pages/<Name>.tsx exists and the Inertia::render('<Name>') spelling matches


## 15) What We Added (Summary)
- Fixed welcome.blade.php to load app.tsx
- Cleaned up Home page for brand (pastel hero with centered large logo; About Me; Services; Facebook feed; Testimonials)
- Navbar uses brand landscape logo from public images
- Booking triage flow (Start/Register/Returning) before the main Booking form
- Booking page gradient overlay removed for clarity
- Dashboard shell (AdminLayout) and nested routes: Overview, Bookings, Dogs
- Data layer: migrations + models for owners/dogs/bookings/testimonials/contacts
- Controllers: BookingController (persist), ContactController (store + log)
- Herd/Valet-friendly Vite config (optional TLS + HMR host)
- Routing documentation and this comprehensive guide


## 16) Roadmap Reference
See PROJECT_TODO.md for a concise, prioritized list of next steps (DB wiring on dashboard, contact form enhancements, notifications, a11y/design sweep, deploy setup).


## 17) FAQ
- Q: How do I add a new service page?
  - A: Create a new page under Pages/, route to it in web.php, and link from Navbar or internal CTAs.
- Q: How do I load real Facebook posts?
  - A: Replace the mock in FacebookFeed.tsx with a server endpoint that calls Facebook Graph API (store tokens in .env) and pass posts as Inertia props.
- Q: Can I use named routes on the frontend?
  - A: Yes, install Ziggy and expose route() to the frontend if you prefer named routes over hard-coded hrefs.
