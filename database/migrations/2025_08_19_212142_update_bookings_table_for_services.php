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
            // Remove the old service column
            $table->dropColumn('service');
            
            // Add new fields for enhanced booking system
            $table->datetime('scheduled_at')->nullable()->after('dog_id');
            $table->integer('duration_minutes')->nullable()->after('scheduled_at');
            $table->decimal('total_amount', 10, 2)->default(0)->after('duration_minutes');
            $table->enum('status', ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'])->default('pending')->change();
            $table->text('internal_notes')->nullable()->after('notes');
            $table->string('location')->nullable()->after('internal_notes'); // For mobile grooming
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
