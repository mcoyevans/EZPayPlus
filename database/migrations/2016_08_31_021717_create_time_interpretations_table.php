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
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('name');
            $table->decimal('regular_working_hours', 4, 3);
            $table->decimal('night_differential', 4, 3);
            $table->decimal('overtime', 4, 3);
            $table->decimal('overtime_night_differential', 4, 3);
            $table->decimal('rest_day_rate', 4, 3);
            $table->decimal('rest_day_night_differential', 4, 3);
            $table->decimal('rest_day_overtime', 4, 3);
            $table->decimal('rest_day_overtime_night_differential', 4, 3);
            $table->decimal('regular_holiday_rate', 4, 3);
            $table->decimal('regular_holiday_night_differential', 4, 3);
            $table->decimal('regular_holiday_overtime', 4, 3);
            $table->decimal('regular_holiday_overtime_night_differential', 4, 3);
            $table->decimal('regular_holiday_rest_day_rate', 4, 3);
            $table->decimal('regular_holiday_rest_day_night_differential', 4, 3);
            $table->decimal('regular_holiday_rest_day_overtime', 4, 3);
            $table->decimal('regular_holiday_rest_day_overtime_night_differential', 4, 3);
            $table->decimal('special_holiday_rate', 4, 3);
            $table->decimal('special_holiday_night_differential', 4, 3);
            $table->decimal('special_holiday_overtime', 4, 3);
            $table->decimal('special_holiday_overtime_night_differential', 4, 3);
            $table->decimal('special_holiday_rest_day_rate', 4, 3);
            $table->decimal('special_holiday_rest_day_night_differential', 4, 3);
            $table->decimal('special_holiday_rest_day_overtime', 4, 3);
            $table->decimal('special_holiday_rest_day_overtime_night_differential', 4, 3);
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
