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
        Schema::create('business_hours', function (Blueprint $table) {
            $table->id();
            $table->string('day_of_week')->unique(); // mon, tue etc.
            $table->boolean('is_open')->default(true); // are we open this day?
            $table->time('open_time')->nullable(); // e.g. 09:00
            $table->time('close_time')->nullable(); // e.g. 17:00
            $table->integer('slot_duration')->default(30); // minutes per appointment slot
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('business_hours');
    }
};
