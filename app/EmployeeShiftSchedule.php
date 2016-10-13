<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class EmployeeShiftSchedule extends Model
{
    protected $table = 'employee_shift_schedule';

    public function employee()
    {
    	return $this->belongsTo('App\Employee');
    }

    public function shift_schedule()
    {
    	return $this->belongsTo('App\ShiftSchedule');
    }
}
