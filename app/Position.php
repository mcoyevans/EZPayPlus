<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Position extends Model
{
    use SoftDeletes;
    protected $dates = ['deleted_at'];

    // public function department()
    // {
    // 	return $this->belongsTo('App\Department');
    // }

    // public function job_category()
    // {
    // 	return $this->belongsTo('App\JobCategory');
    // }

    // public function labor_type()
    // {
    // 	return $this->belongsTo('App\LaborType');
    // }

    // public function deployments()
    // {
    //     return $this->hasMany('App\Deployment');
    // }

    public function employees()
    {
        return $this->hasMany('App\Employee');
    }
}
