<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\SanctionLevel;

use Auth;
use Carbon\Carbon;
use DB;
use Gate;

class SanctionLevelController extends Controller
{
    /**
     * Checks for duplicate entry.
     *
     * @return bool
     */
    public function checkDuplicate(Request $request)
    {
        $duplicate = $request->has('id') ? SanctionLevel::where('name', $request->name)->where('sanction_type_id', $request->sanction_type_id)->whereNotIn('id', [$request->id])->first() : SanctionLevel::where('name', $request->name)->where('sanction_type_id', $request->sanction_type_id)->first();

        return response()->json($duplicate ? true : false);
    }

    /**
     * Display a listing of the resource with parameters.
     *
     * @return \Illuminate\Http\Response
     */
    public function enlist(Request $request)
    {
        $sanction_levels = SanctionLevel::query();

        if($request->has('with'))
        {
            for ($i=0; $i < count($request->with); $i++) { 
                if(!$request->input('with')[$i]['withTrashed'])
                {
                    $sanction_levels->with($request->input('with')[$i]['relation']);
                }
            }
        }

        if($request->has('search'))
        {
            $sanction_levels->where('name', 'like', '%'.$request->search.'%')->orWhere('description', 'like', '%'.$request->search.'%');
        }

        if($request->has('paginate'))
        {
            return $sanction_levels->paginate($request->paginate);
        }

        if($request->has('first'))
        {
            return $sanction_levels->first();
        }

        return $sanction_levels->get();
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return SanctionLevel::all();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if(!Gate::forUser(Auth::user())->allows('settings-access'))
        {
            abort(403, 'Unauthorized action.');
        }

        $duplicate = SanctionLevel::where('name', $request->name)->where('sanction_type_id', $request->sanction_type_id)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $this->validate($request, [
            'name' => 'required',
            'description' => 'required',
            'sanction_type_id' => 'required|numeric',
        ]);

        DB::transaction(function() use($request){
            $sanction_level = new SanctionLevel;

            $sanction_level->name = $request->name;
            $sanction_level->description = $request->description;
            $sanction_level->sanction_type_id = $request->sanction_type_id;

            $sanction_level->save();
        });
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return SanctionLevel::where('id', $id)->first();
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        if(!Gate::forUser(Auth::user())->allows('settings-access'))
        {
            abort(403, 'Unauthorized action.');
        }

        $duplicate = SanctionLevel::whereNotIn('id', [$id])->where('name', $request->name)->where('sanction_type_id', $request->sanction_type_id)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $this->validate($request, [
            'name' => 'required',
            'description' => 'required',
            'sanction_type_id' => 'required|numeric',
        ]);

        DB::transaction(function() use($request, $id){
            $sanction_level = SanctionLevel::where('id', $id)->first();

            $sanction_level->name = $request->name;
            $sanction_level->description = $request->description;
            $sanction_level->sanction_type_id = $request->sanction_type_id;

            $sanction_level->save();
        });
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        if(!Gate::forUser(Auth::user())->allows('settings-access'))
        {
            abort(403, 'Unauthorized action.');
        }

        $sanction_level = SanctionLevel::with('sanction')->where('id', $id)->first();

        if(!count($sanction_level->sanction))
        {
            $sanction_level->delete();

            return;
        }
        
        abort(403, 'Unable to delete.');
    }
}
