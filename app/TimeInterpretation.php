<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TimeInterpretation extends Model
{
    use SoftDeletes;

    protected $dates = ['deleted_at'];

    public function payrolls()
    {
    	return $this->hasMany('App\Payroll');
    }
}
