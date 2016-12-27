<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PayrollProcess extends Model
{
    use SoftDeletes;

    protected $dates = ['deleted_at'];

    public function payroll()
    {
    	return $this->belongsTo('App\Payroll');
    }

    public function payroll_period()
    {
    	return $this->belongsTo('App\PayrollPeriod');
    }

    public function batch()
    {
    	return $this->belongsTo('App\Batch');
    }

    public function payroll_entries()
    {
        return $this->hasMany('App\PayrollEntry');
    }
}
