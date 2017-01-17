<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePayrollEntriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('payroll_entries', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('payroll_process_id')->unsigned();
            $table->integer('employee_id')->unsigned();
            $table->float('days_absent')->nullable();
            $table->float('hours_tardy')->nullable();
            // Time
            $table->float('regular_working_hours');
            $table->float('night_differential')->nullable();
            $table->float('overtime')->nullable();
            $table->float('overtime_night_differential')->nullable();
            $table->float('rest_day')->nullable();
            $table->float('rest_day_night_differential')->nullable();
            $table->float('rest_day_overtime')->nullable();
            $table->float('rest_day_overtime_night_differential')->nullable();
            $table->float('regular_holiday')->nullable();
            $table->float('regular_holiday_night_differential')->nullable();
            $table->float('regular_holiday_overtime')->nullable();
            $table->float('regular_holiday_overtime_night_differential')->nullable();
            $table->float('regular_holiday_rest_day')->nullable();
            $table->float('regular_holiday_rest_day_night_differential')->nullable();
            $table->float('regular_holiday_rest_day_overtime')->nullable();
            $table->float('regular_holiday_rest_day_overtime_night_differential')->nullable();
            $table->float('special_holiday')->nullable();
            $table->float('special_holiday_night_differential')->nullable();
            $table->float('special_holiday_overtime')->nullable();
            $table->float('special_holiday_overtime_night_differential')->nullable();
            $table->float('special_holiday_rest_day')->nullable();
            $table->float('special_holiday_rest_day_night_differential')->nullable();
            $table->float('special_holiday_rest_day_overtime')->nullable();
            $table->float('special_holiday_rest_day_overtime_night_differential')->nullable();
            // Pay
            $table->float('regular_working_hours_pay');
            $table->float('night_differential_pay')->nullable();
            $table->float('overtime_pay')->nullable();
            $table->float('overtime_night_differential_pay')->nullable();
            $table->float('rest_day_pay')->nullable();
            $table->float('rest_day_night_differential_pay')->nullable();
            $table->float('rest_day_overtime_pay')->nullable();
            $table->float('rest_day_overtime_night_differential_pay')->nullable();
            $table->float('regular_holiday_pay')->nullable();
            $table->float('regular_holiday_night_differential_pay')->nullable();
            $table->float('regular_holiday_overtime_pay')->nullable();
            $table->float('regular_holiday_overtime_night_differential_pay')->nullable();
            $table->float('regular_holiday_rest_day_pay')->nullable();
            $table->float('regular_holiday_rest_day_night_differential_pay')->nullable();
            $table->float('regular_holiday_rest_day_overtime_pay')->nullable();
            $table->float('regular_holiday_rest_day_overtime_night_differential_pay')->nullable();
            $table->float('special_holiday_pay')->nullable();
            $table->float('special_holiday_night_differential_pay')->nullable();
            $table->float('special_holiday_overtime_pay')->nullable();
            $table->float('special_holiday_overtime_night_differential_pay')->nullable();
            $table->float('special_holiday_rest_day_pay')->nullable();
            $table->float('special_holiday_rest_day_night_differential_pay')->nullable();
            $table->float('special_holiday_rest_day_overtime_pay')->nullable();
            $table->float('special_holiday_rest_day_overtime_night_differential_pay')->nullable();

            $table->float('tardy')->nullable();
            $table->float('absent')->nullable();
            $table->float('taxable_income');
            $table->float('gross_pay');
            $table->float('total_deductions');
            $table->float('additional_earnings')->nullable();
            $table->float('additional_deductions')->nullable();
            $table->float('net_pay');
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
        Schema::dropIfExists('payroll_entries');
    }
}
