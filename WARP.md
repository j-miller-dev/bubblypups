# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

### Development
```bash
# Start all dev services (Laravel server, queue, logs, and Vite)
composer dev

# Or start individually:
php artisan serve          # Backend server (or use Herd/Valet)
npm run dev                # Vite dev server with HMR
php artisan queue:listen   # Queue worker
php artisan pail           # Log viewer
```

### Testing
```bash
# Backend tests (Pest)
php artisan test           # Run all tests
php artisan test --filter=BookingFlowTest  # Run specific test

# Frontend tests (Vitest)
npm test                   # Run tests in watch mode
npm run test:run           # Run tests once
npm run test:ui            # Run with UI
```

### Database
```bash
php artisan migrate        # Run migrations
php artisan migrate:fresh --seed  # Fresh DB with seeders
php artisan db:seed --class=ServiceSeeder  # Run specific seeder
```

### Code Quality
```bash
# PHP linting
./vendor/bin/pint          # Laravel Pint code formatter

# No ESLint/Prettier configured yet
```

### Build
```bash
npm run build              # Build production assets
```

## Architecture

### Tech Stack
- **Backend**: Laravel 12 with Inertia.js
- **Frontend**: React 19 + TypeScript
- **Build**: Vite 7
- **Styling**: Tailwind CSS v4
- **UI Components**: Headless UI, Heroicons, Framer Motion
- **Database**: SQLite (local dev), Eloquent ORM
- **Testing**: Pest (PHP), Vitest (JS)

### Routing Pattern (Laravel + Inertia)
Routes are defined in `routes/web.php` returning Inertia responses. Route names map to React components in `resources/js/Pages/`.

**Example:**
```php
// routes/web.php
Route::get('/pricing', fn () => Inertia::render('Pricing'))->name('pricing');
// Renders: resources/js/Pages/Pricing.tsx
```

### Page Layouts
- **`MainLayout.tsx`**: Public pages (includes Navbar, Footer, Head metadata)
- **`AdminLayout.tsx`**: Dashboard pages (sidebar + topbar navigation)

Wrap page components in the appropriate layout.

### Navigation
Use the custom `Link` component from `@/Components/ui/Link` for client-side navigation (wraps Inertia's Link). This preserves SPA behavior.

### Data Models
Core relationships:
- `Owner` hasMany `Dog`, hasMany `Booking`
- `Dog` belongsTo `Owner`, hasMany `Booking`
- `Booking` belongsTo `Owner` and `Dog`

Additional models: `Service`, `Availability`, `Testimonial`, `User` (admin auth), `Payment`, `DogPhoto`.

### Booking Flow
Multi-step process at `/booking`:
1. **Triage** (`/booking/start`): New vs returning customer
2. **Registration/Login** (`/booking/register` or `/booking/returning`): Prefills data to localStorage
3. **Appointment** (`/booking/appointment`): 5-step form (service → dog → schedule → contact → confirmation)
4. **Submission**: POST to `BookingController@store` which upserts Owner, creates/finds Dog, creates Booking

### Authentication
- **Customer auth**: Laravel Fortify + Sanctum (API tokens). Endpoints in `routes/api.php` (currently disabled, see README for re-enabling)
- **Admin auth**: Laravel Breeze (planned/optional)

### Component Organization
```
resources/js/
├── Components/
│   ├── ui/          # Base UI components (Button, Table, Dialog, etc.)
│   ├── forms/       # Form controls (Input, Checkbox, Switch, etc.)
│   └── ...          # Feature components (Navbar, Footer, Bubbles, etc.)
├── Pages/           # Inertia page components
│   ├── Dashboard/   # Admin pages
│   └── Booking/     # Booking flow pages
└── Layouts/         # Page layouts
```

### Key Files
- **`resources/js/app.tsx`**: Inertia boot and page resolver
- **`resources/views/app.blade.php`**: Root HTML (mounts Inertia)
- **`routes/web.php`**: All routes
- **`app/Http/Controllers/BookingController.php`**: Booking persistence
- **`app/Http/Controllers/DashboardController.php`**: Admin dashboard data

## Important Notes

### Environment
- Uses Herd/Valet for local dev (see `VITE_VALET_TLS_DOMAIN` and `VITE_DEV_HOST` in `.env`)
- Database is SQLite (`database/database.sqlite`)
- Mail driver set to `log` for development (logs to `storage/logs/`)

### Current State (per PROJECT_TODO.md)
- **Working**: Public pages, booking flow with DB persistence, dashboard shell
- **In Progress**: Dashboard data wiring (Dogs page uses real DB), authentication setup
- **Pending**: Email/SMS notifications, availability integration, admin auth, payment processing

### Booking Schema
Uses `scheduled_at` (datetime) plus a legacy `time` string. The `booking_services` pivot and related fields (duration_minutes, total_amount, location) exist in schema but aren't fully wired yet.

### Notifications
Currently logs only. To enable:
1. Configure SMTP in `.env`
2. Create Mailables for booking confirmation
3. Set up queue driver (database/redis)
4. For SMS: add Twilio/Vonage credentials

### Adding New Pages
1. Create `resources/js/Pages/MyPage.tsx`
2. Add route: `Route::get('/my-page', fn () => Inertia::render('MyPage'))`
3. Link via: `<Link href="/my-page">Go</Link>`

### Adding Dashboard Pages
1. Create `resources/js/Pages/Dashboard/MyPage.tsx` wrapped in `<AdminLayout>`
2. Add route: `Route::get('/dashboard/my-page', fn () => Inertia::render('Dashboard/MyPage'))`
3. Add nav item in `AdminLayout.tsx`

### Ziggy (Named Routes)
Package is installed (`tightenco/ziggy`). Use `route('home')` helper in TypeScript after publishing Ziggy routes.

## Documentation
See also:
- **docs/PROJECT_GUIDE.md**: Comprehensive architecture, how-to, and best practices
- **PROJECT_TODO.md**: Detailed roadmap and current status
- **README.md**: Quick start, routing guide, and authentication setup instructions
