<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

# Bubbly Pups Website

This is a Laravel + Inertia (React + TypeScript) project.

## Development

- PHP server: `php artisan serve` (or use Herd/Valet)
- Vite dev server: `npm run dev`

## Routing with Laravel + Inertia.js

Use Laravel’s normal routing system in `routes/web.php`. For each route, return an Inertia page by name. The name maps to a React component under `resources/js/Pages`.

Example:

```php
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

// Blade (non-Inertia) route
Route::get('/welcome', fn () => view('welcome'))->name('welcome');

// Inertia route (renders resources/js/Pages/Home.tsx)
Route::get('/', fn () => Inertia::render('Home'))->name('home');
```

### Where do Inertia page components live?
- Put page components in `resources/js/Pages`.
- The file name must match what you pass to `Inertia::render()`.
  - `Inertia::render('Home')` => `resources/js/Pages/Home.tsx`

### Passing data (props) to pages

```php
Route::get('/company', function () {
    return Inertia::render('Company', [
        'team' => [
            ['name' => 'Jane', 'role' => 'Groomer'],
            ['name' => 'Sam', 'role' => 'Assistant'],
        ],
    ]);
})->name('company');
```

In your React page, access props via the `usePage()` hook or typed props:

```tsx
import { usePage } from '@inertiajs/react';

export default function Company() {
  const { props } = usePage<{ team: { name: string; role: string }[] }>();
  return (
    <ul>{props.team.map((m) => <li key={m.name}>{m.name} – {m.role}</li>)}</ul>
  );
}
```

### Navigating between pages

Use the provided Link component (wraps `@inertiajs/react` Link) for client-side navigation:

```tsx
import { Link } from '@/Components/Link';

<Link href="/booking">Book Now</Link>
```

You can also use named routes on the PHP side (already added):
- `home`, `blog`, `company`, `login`, `pricing`, `booking`, `dashboard`, `welcome`

If you prefer using named routes in JavaScript (e.g., `route('home')`), install Ziggy:

```bash
composer require tightenco/ziggy
```

Then follow Ziggy’s docs to expose `route()` to your frontend.

### Controllers (optional)

You can return Inertia responses from controllers too:

```php
use App\Http\Controllers\PageController;

Route::get('/services', [PageController::class, 'services'])->name('services');
```

```php
namespace App\Http\Controllers;
use Inertia\Inertia;

class PageController extends Controller
{
    public function services()
    {
        return Inertia::render('Services');
    }
}
```

### 404s when a page file is missing
If you add a route like `Inertia::render('Pricing')`, make sure `resources/js/Pages/Pricing.tsx` exists. Otherwise, Vite will show a 404 for the module.

### Head and document
- The base HTML lives in `resources/views/app.blade.php` and mounts Inertia.
- Per-page titles/descriptions are set with `<Head>` in your layout or page (see `resources/js/Layouts/MainLayout.tsx`).

That’s it—define routes in Laravel, map them to React page files, and navigate with Inertia’s Link.

## Documentation

For a complete architecture overview, how-to guides, and best practices, see:
- docs/PROJECT_GUIDE.md — Project Guide (Architecture, How‑To, Best Practices)
- PROJECT_TODO.md — Roadmap and next steps
- TRANSITION_REPORT.md — Initial transition notes


# Customer Authentication Setup (Fortify + Sanctum)

This guide walks you through enabling customer login and registration for Bubbly Pups using Laravel Fortify (auth features) and Sanctum (API tokens). When finished, customers can register or sign in and then book an appointment.

Audience: Laravel + Inertia (React) project maintainers. Time: ~30–45 minutes.


## 0) Prerequisites
- PHP 8.2+
- Node 18+
- Composer and NPM installed
- A working database configured in .env
- Optional: Twilio and Social providers if you want phone OTP or Google/Facebook/Apple sign-in

Packages already included in composer.json:
- laravel/fortify
- laravel/sanctum
- laravel/socialite (optional, for social login)


## 1) Install dependencies and prepare environment
1) Copy .env if you don’t have one yet:
   cp .env.example .env

2) Set your app URL and database:
   - APP_URL=https://bubbly-pups.test (or your local domain)
   - FRONTEND_URL=http://localhost:5173 (or your Vite/SPA URL)
   - DB_* (host, database, username, password)

3) Configure session and CORS (important for SPA + tokens):
   - SESSION_DRIVER=cookie
   - SESSION_DOMAIN=.bubbly-pups.test (leading dot if you use subdomains; otherwise leave blank)
   - SANCTUM_STATEFUL_DOMAINS=localhost,localhost:5173,bubbly-pups.test
   - FRONTEND_URL=http://localhost:5173

4) Install and build:
   composer install
   npm install
   php artisan key:generate

5) Run migrations (includes users/owners/bookings + extra auth fields):
   php artisan migrate


## 2) Verify config/auth and config/fortify
Already present in this repo:
- config/auth.php includes an api guard using sanctum.
- config/fortify.php enables registration, password reset, email verification, profile/password update, and 2FA. You can tailor features as needed by editing the features array.

For a pure token-based SPA customer flow, we’ll use custom API endpoints (below) that issue Sanctum Personal Access Tokens.


## 3) Add API routes for customer auth
The controllers already exist under App\Http\Controllers\API. Wire them up by editing routes/api.php to include the following routes. If you previously removed auth routes (fresh start), re-add them now.

Add to routes/api.php:

```php
<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\PhoneAuthController;
use App\Http\Controllers\API\SocialAuthController;

// Public
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Optional: phone OTP auth
Route::post('/phone/send-otp', [PhoneAuthController::class, 'sendOTP']);
Route::post('/phone/verify-otp', [PhoneAuthController::class, 'verifyOTP']);

// Optional: social login
Route::get('/auth/{provider}/redirect', [SocialAuthController::class, 'redirect']);
Route::get('/auth/{provider}/callback', [SocialAuthController::class, 'callback']);

// Protected (requires Bearer token)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
```

Notes:
- These endpoints create/return a Sanctum personal access token and user payload in the shape { token, user }.
- The controllers also ensure a matching Owner profile exists and is linked to the User (owners.user_id).


## 4) Sanctum and CORS/session configuration details
For local dev with Vite or another domain, make sure:
- In config/cors.php, your frontend origin is allowed (e.g., http://localhost:5173) and supports Authorization headers.
- In .env: set SANCTUM_STATEFUL_DOMAINS and SESSION_DOMAIN appropriately.
- If you serve the SPA from the same domain as Laravel, you can simplify CORS/stateful setup.

Typical config/cors.php adjustments:
- Add your frontend origin to paths and allowed_origins.
- Ensure supports_credentials => true if using cookies. For pure Bearer token usage via localStorage, credentials are not required.

This project’s API examples use Bearer tokens in headers, so you can keep cookies/session out of the SPA and only use auth:sanctum middleware for API protection.


## 5) Frontend integration (Inertia React)
Two pages already exist: resources/js/Pages/Booking/Register.tsx and .../Booking/Returning.tsx.
To enable auth, implement a small AuthService and call it from these pages.

Create or update services/AuthService.ts:

```ts
export type AuthUser = {
  id: number;
  name: string;
  email: string;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

const API_BASE = '/api';

export async function register(name: string, email: string, password: string, password_confirmation: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, password_confirmation }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export function saveToken(token: string) {
  localStorage.setItem('bp_token', token);
}

export function getToken(): string | null {
  return localStorage.getItem('bp_token');
}

export async function currentUser(): Promise<AuthUser | null> {
  const token = getToken();
  if (!token) return null;
  const res = await fetch(`${API_BASE}/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function logout(): Promise<void> {
  const token = getToken();
  if (!token) return;
  await fetch(`${API_BASE}/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  localStorage.removeItem('bp_token');
}
```

Update Booking/Register.tsx submit handler to call register API and save token:

```ts
import * as Auth from '@/services/AuthService';
// other imports and component code...
const onSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  try {
    setLoading(true);
    const r = await Auth.register(owner.name, owner.email, passwords.password, passwords.password_confirmation);
    Auth.saveToken(r.token);
    // Save dog + owner details locally for the booking step
    localStorage.setItem('bp_pre_reg', JSON.stringify({ owner, dog }));
    router.visit('/booking/appointment');
  } catch (err: any) {
    setError(err?.message || 'Registration failed.');
  } finally {
    setLoading(false);
  }
};
```

Update Booking/Returning.tsx submit handler to call login API and save token:

```ts
import * as Auth from '@/services/AuthService';
// other imports and component code...
const onSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  try {
    setLoading(true);
    const r = await Auth.login(form.email, form.password);
    Auth.saveToken(r.token);
    router.visit('/booking/appointment');
  } catch (err: any) {
    setError(err?.message || 'Login failed.');
  } finally {
    setLoading(false);
  }
};
```

Use token when calling protected API endpoints:

```ts
const token = Auth.getToken();
fetch('/api/some-protected', {
  headers: { Authorization: `Bearer ${token}` },
});
```

Logout from any page:

```ts
import { logout } from '@/services/AuthService';
await logout();
```


## 6) Optional: Phone OTP (Twilio)
Environment variables:
- TWILIO_SID=...
- TWILIO_TOKEN=...
- TWILIO_PHONE=+1...

Endpoints (already provided):
- POST /api/phone/send-otp { phone }
- POST /api/phone/verify-otp { phone, otp } → returns { token, user }

Frontend flow:
- Create a simple form to request/send OTP, then verify and store the token like in email/password flow.


## 7) Optional: Social login (Google/Facebook/Apple)
- Configure credentials per provider and add callback URLs pointing to /api/auth/{provider}/callback.
- The callback redirects to FRONTEND_URL + /auth/callback?token=...
- On the frontend, read token from the query string and save it.


## 8) Booking after login/registration
The BookingController already upserts an Owner from contact details and links dogs/bookings. After enabling auth, you can additionally fetch /api/user and show the customer’s name/email when scheduling.

If you want to require auth before booking, place the booking store route behind auth:sanctum middleware and send the Bearer token in requests.


## 9) Verifying the setup
- php artisan serve (or your local web server)
- npm run dev
- In Postman or curl:
  - POST /api/register with name/email/password/password_confirmation → receive { token, user }
  - GET /api/user with Authorization: Bearer &lt;token&gt; → returns user
  - POST /api/logout with Authorization: Bearer &lt;token&gt; → 200
- In the browser, use the Register/Returning pages to register/login and proceed to /booking/appointment.


## 10) Troubleshooting
- 401 Unauthorized on /api/user: Ensure Authorization: Bearer &lt;token&gt; header is sent and the token hasn’t been revoked. Confirm auth:sanctum on the route group.
- CORS errors: Add your frontend origin to config/cors.php and set SANCTUM_STATEFUL_DOMAINS and SESSION_DOMAIN in .env.
- Duplicate email or phone: users.email is unique; users.phone is unique in the added migration. Use a fresh test account if needed.
- Social login redirect mismatch: Ensure provider console callback URLs match your /api/auth/{provider}/callback URLs, and FRONTEND_URL is correct.


## 11) What this repo already has
- Controllers: API/AuthController, API/PhoneAuthController, API/SocialAuthController
- Models: User (with HasApiTokens) and Owner (linked via owners.user_id)
- Migrations: users base + auth fields; owners + owners.user_id; bookings with scheduled_at and time

You mainly need to (a) re-enable the API routes above, (b) set environment variables, (c) wire the frontend calls using the provided AuthService snippet.

End of guide.
