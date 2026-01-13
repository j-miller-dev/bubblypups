<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('appointments:send-reminders')
    ->dailyAt('09:00')
    ->timezone('Australia/Melbourne');

// Provide a helpful fallback for `php artisan tinker` when Tinker isn't installed (e.g., prod or --no-dev installs).
if (! class_exists(\Laravel\Tinker\Console\TinkerCommand::class)) {
    Artisan::command('tinker', function () {
        $this->error('Tinker is not available because laravel/tinker is not installed.');
        $this->line('To enable Tinker in development:');
        $this->line('  composer install            # ensure dev dependencies are installed');
        $this->line('  php artisan optimize:clear  # clear caches after installing');
        $this->newLine();
        $this->line('If dev dependencies are missing, you can install them explicitly:');
        $this->line('  composer require --dev laravel/tinker psy/psysh');
        $this->newLine();
        $this->line('Note: Keep Tinker as a dev-only dependency in production to avoid runtime parse issues.');

        return 1;
    })->purpose('Open a REPL (requires laravel/tinker as a dev dependency)');
}
