<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // SQLite requires table recreation to modify ENUM/CHECK constraints
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        Schema::table('appointments', function (Blueprint $table) {
            $table->enum('status', ['pending', 'confirmed', 'cancelled', 'completed',
                'waiting_on_client'])
                ->default('pending')
                ->after('duration');
        });
    }

    public function down(): void
    {
        // Clean up any waiting_on_client statuses
        DB::table('appointments')
            ->where('status', 'waiting_on_client')
            ->update(['status' => 'pending']);

        Schema::table('appointments', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        Schema::table('appointments', function (Blueprint $table) {
            $table->enum('status', ['pending', 'confirmed', 'cancelled', 'completed'])
                ->default('pending')
                ->after('duration');
        });
    }
};
