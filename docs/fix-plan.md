# Bubbly Pups — Fix Plan

Audited: 2026-07-26

---

## Priority 1 — Fix Now

### #1 Reminder command log typo
**File:** `app/Console/Commands/SendAppointmentReminders.php:35`
```php
// BUG
$this->info("Reminder sent for appointment #($appointment->id");
// FIX
$this->info("Reminder sent for appointment #{$appointment->id}");
```
Runs on a daily schedule in production.
**Status:** ☐ Open

---

### #2 Admin SMS notifications silently never send
**File:** `database/migrations/0001_01_01_000000_create_users_table.php` + `app/Models/User.php`

`User::$fillable` includes `phone` and `routeNotificationForTwilio()` is implemented, but the `users` table has no `phone` column. `$admin->phone` is always null, so `NewBookingNotification::via()` never adds the Twilio channel for admins.

**Fix:** Add migration `add_phone_to_users_table`:
```php
$table->string('phone')->nullable()->after('email');
```
**Status:** ☐ Open

---

### #3 Blocked time not checked on customer booking
**File:** `app/Http/Requests/StoreAppointmentRequest.php`

`StoreAppointmentRequest` has no validation against `BlockedTime`. Customers can successfully book during slots that have been blocked (holidays, days off). The admin reschedule endpoint checks this correctly — the customer booking endpoint doesn't.

**Fix:** Add a custom validation rule or closure in `StoreAppointmentRequest::rules()` that queries `BlockedTime` for the given `appointment_date` / `appointment_time`, mirroring the logic in `AvailabilityService::removeBlockedSlots()`.
**Status:** ☐ Open

---

## Priority 2 — Fix Soon

### #4 Dead `owner()` relationship on User model
**File:** `app/Models/User.php:103`
```php
public function owner(): HasOne
{
    return $this->hasOne(Owner::class); // Owner model does not exist
}
```
Fatal error if anything calls `$user->owner`. Remove the method and the unused `HasOne` import if nothing else uses it.
**Status:** ☐ Open

---

### #5 Dead controller file
**File:** `app/Http/Controllers/DINGOTEST.php`

Empty class, not registered anywhere. Delete it.
**Status:** ☐ Open

---

### #6 Rate limiting on `POST /booking`
**File:** `routes/web.php`

No throttle middleware on the customer booking endpoint. A logged-in customer can spam bookings.

**Fix:** Add `throttle:5,1` (5 requests per minute) to the `auth:customer` booking route group, or apply it specifically to `booking.store`.
**Status:** ☐ Open

---

## Priority 3 — Next Pass

### #7 Migration rollback missing `DB` import
**File:** `database/migrations/2025_12_29_233829_add_waiting_on_client_status_to_appointments_table.php:27`

The `down()` method uses `DB::table()` without importing the `DB` facade. `php artisan migrate:rollback` would throw a fatal error.

**Fix:** Add `use Illuminate\Support\Facades\DB;` at the top of the file.
**Status:** ☐ Open

---

### #8 Reschedule authorization always returns true
**File:** `app/Http/Requests/RescheduleAppointmentRequest.php`
```php
public function authorize(): bool
{
    return true; // Any authenticated user can reschedule any appointment
}
```
Low risk now (endpoint is admin-only behind `auth` middleware, single admin role), but dangerous if roles are added later.

**Fix:** Check `$this->user()->id` is an admin or add a policy check.
**Status:** ✅ Fixed — now checks `$this->user() instanceof User` (`cef9346`)

---

### #9 Inline data transformation in routes instead of controllers
**File:** `routes/web.php:62–118`

`dashboard.bookings` and `dashboard.calendar` do significant data mapping inline in the route file. This logic is duplicated in `DashboardController` and should live there exclusively.

**Fix:** Move the inline closures to their respective controller methods.
**Status:** ✅ Fixed — both routes delegate fully to `DashboardController` (`cef9346`)

---

## Priority 4 — Backlog

### #10 `CustomerAppointmentController::index()` filters in PHP
**File:** `app/Http/Controllers/Customer/CustomerAppointmentController.php`

Fetches all customer appointments then splits upcoming/past/cancelled in PHP. Fine for a small salon, will degrade with history.

**Fix:** Push the date/status filtering into the Eloquent query.
**Status:** ✅ Fixed — filtering is done via Eloquent `whereDate`/`where` clauses (`cef9346`)

---

### #11 Hard-coded Australian +61 country code
**File:** `app/Models/Customer.php` + `app/Models/User.php`

Country code is hard-coded in `routeNotificationForTwilio()`. Should be a config value (e.g. `config('app.country_code')`).
**Status:** ✅ Fixed — both models use `config('app.country_code')` (`cef9346`)

---

### #12 Magic status strings
Status values (`pending`, `confirmed`, `cancelled`, `completed`, `waiting_on_client`) are scattered as raw strings across controllers, requests, migrations, and frontend components.

**Fix:** Create an `App\Enums\AppointmentStatus` backed enum and use it everywhere.
**Status:** ✅ Fixed — enum created; remaining raw strings removed from `AppointmentRescheduledNotification`, `AppointmentFactory`, `TestDataSeeder`, and `SeedProductionAppointments`

---

## Already Fixed (reference)

| Item | Fix | Commit |
|---|---|---|
| Auth middleware on routes | Was already correct | — |
| Hardcoded time slots in Booking/Create.tsx | Was already fetching from API | — |
| 21+ failing tests | Rewrote BookingFlowTest, fixed dates in RescheduleTest, added service_id to NotificationTest, fixed RegistrationTest guard | `07f37c7` |
| Missing DB indexes on appointments | Added `appointment_date` + `status` indexes | `07f37c7` |
| Missing ServiceFactory | Created `ServiceFactory` | `86a781b` |
| Dead seeders (BookingSeeder, OwnerSeeder, DogSeeder, AvailabilitySeeder) | Deleted | `86a781b` |
| BusinessHoursSeeder not called | Added to DatabaseSeeder | `86a781b` |
| AppointmentFactory missing service_id | Added + waiting_on_client to status pool | `86a781b` |
| BlogPostSeeder missing | Created | `86a781b` |
| Twilio env vars empty | In progress — pending values from dashboard | — |
