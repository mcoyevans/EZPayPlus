<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PayrollEntryGovernmentContribution extends Model
{
    public function payroll_entry()
    {
    	return $this->belongsTo('App\PayrollEntry');
    }

    public function government_contribution()
    {
    	return $this->belongsTo('App\GovernmentContribution');
    }
}
