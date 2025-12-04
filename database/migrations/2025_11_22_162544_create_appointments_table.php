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
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dog_id')->constrained(); // NO cascadeOnDelete
            $table->foreignId('customer_id')->constrained(); // NO cascadeOnDelete

            $table->date('appointment_date');
            $table->time('appointment_time');
            $table->integer('duration')->default(60); // minutes
            $table->enum('status', ['pending', 'confirmed', 'cancelled', 'completed'])->default('pending');
            $table->text('notes')->nullable();
            $table->timestamp('confirmed_at')->nullable();

            // Prevent double bookings
            $table->unique(['appointment_date', 'appointment_time']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
