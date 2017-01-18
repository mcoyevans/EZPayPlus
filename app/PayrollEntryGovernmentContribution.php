<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PayrollEntryGovernmentContribution extends Model
{
	protected $table = 'payroll_entry_government_contribution'; 

    public function payroll_entry()
    {
    	return $this->belongsTo('App\PayrollEntry');
    }

    public function government_contribution()
    {
    	return $this->belongsTo('App\GovernmentContribution');
    }
}
