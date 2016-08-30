<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Payroll extends Model
{
    use SoftDeletes;

    protected $dates = ['deleted_at'];

    public function time_interpretation()
    {
    	return $this->belongsTo('App\TimeInterpretation');
    }
}
