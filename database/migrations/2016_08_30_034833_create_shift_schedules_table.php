<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateShiftSchedulesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('shift_schedules', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->date('date_start');
            $table->date('date_end');
            $table->time('shift_start');
            $table->time('shift_end');
            $table->float('hours_break')->unsigned();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('shift_schedules');
    }
}
