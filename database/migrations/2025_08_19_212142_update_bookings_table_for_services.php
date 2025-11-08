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
        Schema::table('bookings', function (Blueprint $table) {
            // Keep existing 'service' column for now to ensure compatibility with current app
            // Ensure 'scheduled_at' exists
            if (!Schema::hasColumn('bookings', 'scheduled_at')) {
                $table->dateTime('scheduled_at')->nullable();
            }
            // Add optional fields if not present
            if (!Schema::hasColumn('bookings', 'duration_minutes')) {
                $table->integer('duration_minutes')->nullable();
            }
            if (!Schema::hasColumn('bookings', 'total_amount')) {
                $table->decimal('total_amount', 10, 2)->default(0);
            }
            if (!Schema::hasColumn('bookings', 'internal_notes')) {
                $table->text('internal_notes')->nullable();
            }
            if (!Schema::hasColumn('bookings', 'location')) {
                $table->string('location')->nullable();
            }
            // Avoid changing enum in existing databases for portability
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->string('service')->after('dog_id');
            $table->dropColumn(['scheduled_at', 'duration_minutes', 'total_amount', 'internal_notes', 'location']);
            $table->string('status')->default('pending')->change();
        });
    }
};
