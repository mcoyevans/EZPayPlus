<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class BranchHoliday extends Model
{
	protected $table = 'branch_holiday';

    public function branch()
    {
    	return $this->belongsTo('App\Branch');
    }

    public function holiday()
    {
    	return $this->belongsTo('App\Holiday');
    }
}
