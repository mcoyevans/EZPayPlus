<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class GovernmentContribution extends Model
{
    public function payroll()
    {
    	return $this->belongsTo('App\Payroll');
    }

    public function payroll_entries()
    {
        return $this->belongsToMany('App\PayrollEntryGovernmentContribution', 'payroll_entry_government_contribution');
    }
}
