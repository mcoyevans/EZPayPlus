<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class GovernmentContribution extends Model
{
    public function payroll()
    {
    	return $this->belongsTo('App\Payroll');
    }
}
