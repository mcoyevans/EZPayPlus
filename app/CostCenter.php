<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CostCenter extends Model
{
    use SoftDeletes;

    protected $dates = ['deleted_at'];

    public function deployment()
    {
    	return $this->hasMany('App\Deployment');
    }

    public function holidays()
    {
        return $this->belongsToMany('App\Holiday');
    }

}
