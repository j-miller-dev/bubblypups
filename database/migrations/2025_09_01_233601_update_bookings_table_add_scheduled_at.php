<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateBookingsTableAddScheduledAt extends Migration
{
    public function up()
    {
        Schema::table('bookings', function (Blueprint $table) {
            // Guard drops in case columns don't exist
            if (Schema::hasColumn('bookings', 'date')) {
                $table->dropColumn('date');
            }
            if (Schema::hasColumn('bookings', 'time')) {
                $table->dropColumn('time');
            }

            // Add 'scheduled_at' if missing
            if (!Schema::hasColumn('bookings', 'scheduled_at')) {
                $table->dateTime('scheduled_at')->nullable();
            }
        });
    }

    public function down()
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn('scheduled_at');
            // To restore `date` and `time`, add them back:
            // $table->date('date')->nullable();
            // $table->string('time')->nullable();
        });
    }
}
