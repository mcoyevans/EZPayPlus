<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RenameSanctionIdColumnToSanctionTypeIdAtSanctionsLevelsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sanction_levels', function (Blueprint $table) {
            $table->renameColumn('sanction_id', 'sanction_type_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('sanction_levels', function (Blueprint $table) {
            $table->renameColumn('sanction_type_id', 'sanction_id');
        });
    }
}
