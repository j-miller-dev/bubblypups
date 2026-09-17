<?php

use App\Models\Service;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->json('duration_tiers')->nullable()->after('duration_minutes');
        });

        // Backfill existing services with proportionally-scaled durations
        // rather than leaving them null (see Service::defaultDurationTiers).
        Service::query()->whereNull('duration_tiers')->get()->each(function (Service $service) {
            $service->update([
                'duration_tiers' => Service::defaultDurationTiers($service->duration_minutes),
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn('duration_tiers');
        });
    }
};
