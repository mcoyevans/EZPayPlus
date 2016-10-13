<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Deployment extends Model
{
    use SoftDeletes;

    protected $dates = ['deleted_at'];

    public function employee()
    {
    	return $this->belongsTo('App\Employee');
    }

    public function cost_center()
    {
    	return $this->belongsTo('App\Center');
    }

    public function branch()
    {
    	return $this->belongsTo('App\Branch');
    }

    public function position()
    {
    	return $this->belongsTo('App\Position');
    }

    public function super_visor()
    {
    	return $this->belongsTo('App\Employee', 'immediate_supervisor_id');
    }
}
