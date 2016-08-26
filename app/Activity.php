<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    public function branch()
    {
    	return $this->belongsTo('App\Branch', 'event_id');
    }

    public function city()
    {
    	return $this->belongsTo('App\City', 'event_id');
    }

    public function company()
    {
    	return $this->belongsTo('App\Company', 'event_id');
    }

    public function country()
    {
    	return $this->belongsTo('App\Country', 'event_id');
    }

    public function currency()
    {
    	return $this->belongsTo('App\Currency', 'event_id');
    }

    public function department()
    {
    	return $this->belongsTo('App\Department', 'event_id');
    }

    public function group()
    {
    	return $this->belongsTo('App\Group', 'event_id');
    }

    public function house_bank()
    {
    	return $this->belongsTo('App\HouseBank', 'event_id');
    }

	public function module()
    {
    	return $this->belongsTo('App\Module', 'event_id');
    }

    public function province()
    {
    	return $this->belongsTo('App\Province', 'event_id');
    }

    public function user()
    {
    	return $this->belongsTo('App\User', 'event_id');
    }
}
