<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable()->unique()->after('email');
            $table->timestamp('phone_verified_at')->nullable()->after('email_verified_at');
            $table->string('provider')->nullable()->after('phone');
            $table->string('google_id')->nullable()->after('provider');
            $table->string('facebook_id')->nullable()->after('google_id');
            $table->string('apple_id')->nullable()->after('facebook_id');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'phone',
                'phone_verified_at',
                'provider',
                'google_id',
                'facebook_id',
                'apple_id',
            ]);
        });
    }
};
