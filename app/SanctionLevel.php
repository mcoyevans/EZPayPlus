<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SanctionLevel extends Model
{
    public function sanction_type()
    {
    	return $this->belongsTo('App\SanctionType');
    }
}
