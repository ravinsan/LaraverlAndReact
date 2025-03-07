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
        Schema::create('appoinment_bookings', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id')->nallable();
            $table->string('title')->nallable();
            $table->longText('description')->nallable();
            $table->dateTime('bdate')->nallable();
            $table->smallInteger('status')->default(1)->commnets('1-Active, 0-Inactive');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appoinment_bookings');
    }
};
