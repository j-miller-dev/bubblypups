# BubblyPups 🐾

A full-stack dog grooming booking platform built for real commercial use.

**Live:** [bubblypups.com.au](https://www.bubblypups.com.au)

---

## Tech Stack

- **Backend:** Laravel 12 (PHP)
- **Frontend:** React + Inertia.js
- **Database:** MySQL
- **Styling:** Tailwind CSS
- **Deployment:** VPS via Coolify

---

## Features

- Customer-facing booking flow with service and time slot selection
- Admin dashboard for managing appointments, availability, and customers
- Authentication with role-based access (admin / customer)
- Responsive mobile-first UI

---

## Purpose

Built as a real-world Laravel/React portfolio project demonstrating full-stack capability — from database design and API logic through to a polished customer-facing UI.

---

## Run Locally

```bash
git clone https://github.com/j-miller-dev/bubblypups
cd bubblypups
cp .env.example .env
composer install
npm install
php artisan key:generate
php artisan migrate --seed
npm run dev
php artisan serve
```

---

## Status

MVP live. Admin and booking refinements ongoing.
