<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AllowanceType extends Model
{
	use SoftDeletes;

	protected $dates = ['deleted_at'];

    public function employees()
    {
    	return $this->belongsToMany('App\Employee', 'employee_allowance_type');
    }
}
