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
        Schema::create('blocked_times', function (Blueprint $table) {
            $table->id();
            $table->dateTime('start_datetime');
            $table->dateTime('end_datetime');
            $table->string('reason')->nullable(); // "Lunch break", "Holiday", etc.
            $table->timestamps();

            // Ensure start is before end
            $table->index(['start_datetime', 'end_datetime']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blocked_times');
    }
};
