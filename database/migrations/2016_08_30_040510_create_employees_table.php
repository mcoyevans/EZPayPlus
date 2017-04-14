<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEmployeesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('employee_number')->unique();
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->string('suffix')->nullable();
            $table->string('sex');
            $table->integer('age');
            $table->date('birthdate');
            $table->string('civil_status');
            $table->integer('batch_id')->unsigned();
            $table->integer('branch_id')->unsigned();
            $table->integer('cost_center_id')->unsigned();
            $table->integer('position_id')->unsigned();
            $table->dateTime('date_hired');
            $table->string('employment_status');
            $table->text('street_address');
            $table->integer('city_id')->unsigned();
            $table->integer('province_id')->unsigned();
            // $table->integer('country_id')->unsigned();
            $table->integer('postal_code')->nullable();
            $table->string('telephone_number')->nullable();
            $table->string('mobile_number')->nullable();
            $table->string('tin', 11);
            $table->string('sss', 12);
            $table->string('philhealth', 14);
            $table->string('pagibig', 14);
            $table->integer('tax_code_id')->unsigned();
            $table->smallInteger('dependents')->unsigned();
            $table->string('email');
            $table->integer('time_interpretation_id')->unsigned();
            $table->float('basic_salary');
            $table->boolean('minimum_wage_earner');
            // $table->string('payment_type');
            // $table->integer('account_number');
            // $table->string('emergency_contact_person')->nullable();
            // $table->text('emergency_contact_person_address')->nullable();
            // $table->text('emergency_contact_person_relationship')->nullable();
            // $table->text('emergency_contact_person_telephone_number')->nullable();
            // $table->text('emergency_contact_person_mobile_phone_number')->nullable();
            // $table->integer('payroll_id')->unsigned();
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
        Schema::drop('employees');
    }
}
