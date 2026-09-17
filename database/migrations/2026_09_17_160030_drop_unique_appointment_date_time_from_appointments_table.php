<?php

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
        Schema::table('appointments', function (Blueprint $table) {
            // A plain (date, time) unique index can't express duration-based overlap
            // (e.g. a 90-minute 10:00 appointment doesn't collide on this index with
            // a new 10:30 booking, even though the times overlap) and it also blocks
            // rebooking a cancelled slot, since cancelled rows still count as taken.
            // Availability is now enforced in the application layer
            // (AvailabilityService + a locked re-check in the booking transaction).
            $table->dropUnique(['appointment_date', 'appointment_time']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->unique(['appointment_date', 'appointment_time']);
        });
    }
};
