<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Batch extends Model
{
	use SoftDeletes;

    protected $dates= ['deleted_at'];

    public function employees()
    {
    	return $this->hasMany('App\Employee');
    }

    public function payroll_process()
    {
    	return $this->hasMany('App\PayrollProcess');
    }

    public function thirteenth_month_pay_processes()
    {
        return $this->hasMany('App\ThirteenthMonthPayProcess');
    }
}
