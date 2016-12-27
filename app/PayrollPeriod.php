<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PayrollPeriod extends Model
{
    public function payroll()
    {
    	return $this->belongsTo('App\Payroll');
    }

    public function payroll_process()
    {
    	return $this->hasMany('App\PayrollProcess');
    }
}
