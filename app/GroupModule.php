<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class GroupModule extends Model
{
	protected $table = 'group_module';

    public function group()
    {
    	return $this->belongsTo('App\Group');
    }

    public function module()
    {
    	return $this->belongsTo('App\Module');
    }
}
