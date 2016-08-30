<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTimeInterpretationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('time_interpretations', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->decimal('night_differential', 4, 3);
            $table->decimal('over_time', 4, 3);
            $table->decimal('over_time_night_differential', 4, 3);
            $table->decimal('rest_day_rate', 4, 3);
            $table->decimal('rest_day_night_differential', 4, 3);
            $table->decimal('rest_day_over_time', 4, 3);
            $table->decimal('rest_day_over_time_night_differential', 4, 3);
            $table->decimal('regular_holiday_rate', 4, 3);
            $table->decimal('regular_holiday_night_differential', 4, 3);
            $table->decimal('regular_holiday_over_time', 4, 3);
            $table->decimal('regular_holiday_over_time_night_differential', 4, 3);
            $table->decimal('regular_holiday_rest_day_rate', 4, 3);
            $table->decimal('regular_holiday_rest_day_night_differential', 4, 3);
            $table->decimal('regular_holiday_rest_day_over_time', 4, 3);
            $table->decimal('regular_holiday_rest_day_over_time_night_differential', 4, 3);
            $table->decimal('special_holiday_rate', 4, 3);
            $table->decimal('special_holiday_night_differential', 4, 3);
            $table->decimal('special_holiday_over_time', 4, 3);
            $table->decimal('special_holiday_over_time_night_differential', 4, 3);
            $table->decimal('special_holiday_rest_day_rate', 4, 3);
            $table->decimal('special_holiday_rest_day_night_differential', 4, 3);
            $table->decimal('special_holiday_rest_day_over_time', 4, 3);
            $table->decimal('special_holiday_rest_day_over_time_night_differential', 4, 3);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('time_interpretations');
    }
}
