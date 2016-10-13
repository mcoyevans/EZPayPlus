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
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('code');
            $table->text('description');
            $table->decimal('working_days_per_year', 5,2);
            $table->decimal('working_hours_per_day', 4,2);
            $table->tinyInteger('pay_frequency');
            $table->string('tax');
            $table->string('sss');
            $table->string('pagibig');
            $table->string('philhealth');
            $table->string('basis_of_computation');
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
