<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePayrollsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('payrolls', function (Blueprint $table) {
            $table->increments('id');
            $table->text('description');
            $table->decimal('working_days_per_year', 5,2);
            $table->decimal('working_hours_per_day', 4,2);
            $table->tinyInteger('pay_frequency');
            $table->boolean('tax');
            $table->boolean('sss');
            $table->boolean('pagibig');
            $table->boolean('philhealth');
            $table->integer('time_interpretation_id')->unsigned();
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
        Schema::drop('payrolls');
    }
}
