<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    public function users()
    {
    	return $this->hasMany('App\User');
    }

    public function modules()
    {
    	return $this->belongsToMany('App\Module')->withTimestamps();;
    }
}
