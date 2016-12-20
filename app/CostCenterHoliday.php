<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CostCenterHoliday extends Model
{
	protected $table = 'cost_center_holiday';

    public function cost_center()
    {
    	return $this->belongsTo('App\CostCenter');
    }

    public function holiday()
    {
    	return $this->belongsTo('App\Holiday');
    }
}
