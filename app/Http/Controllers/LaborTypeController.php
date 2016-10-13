<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\LaborType;

use Auth;
use Carbon\Carbon;
use DB;
use Gate;

class LaborTypeController extends Controller
{
    /**
     * Checks for duplicate entry.
     *
     * @return bool
     */
    public function checkDuplicate(Request $request)
    {
        $duplicate = $request->has('id') ? LaborType::where('name', $request->name)->whereNotIn('id', [$request->id])->first() : LaborType::where('name', $request->name)->first();

        return response()->json($duplicate ? true : false);
    }

    /**
     * Display a listing of the resource with parameters.
     *
     * @return \Illuminate\Http\Response
     */
    public function enlist(Request $request)
    {
        $labor_types = LaborType::query();

        if($request->has('with'))
        {
            for ($i=0; $i < count($request->with); $i++) { 
                if(!$request->input('with')[$i]['withTrashed'])
                {
                    $labor_types->with($request->input('with')[$i]['relation']);
                }
            }
        }

        if($request->has('search'))
        {
            $labor_types->where('name', 'like', '%'.$request->search.'%')->orWhere('description', 'like', '%'.$request->search.'%');
        }

        if($request->has('paginate'))
        {
            return $labor_types->paginate($request->paginate);
        }

        if($request->has('first'))
        {
            return $labor_types->first();
        }

        return $labor_types->get();
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return LaborType::all();
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

        $duplicate = LaborType::where('name', $request->name)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        DB::transaction(function() use($request){
            $labor_type = new LaborType;

            $labor_type->name = $request->name;
            $labor_type->description = $request->description;

            $labor_type->save();
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
        return LaborType::where('id', $id)->first();
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

        $duplicate = LaborType::whereNotIn('id', [$id])->where('name', $request->name)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        DB::transaction(function() use($request, $id){
            $labor_type = LaborType::where('id', $id)->first();

            $labor_type->name = $request->name;
            $labor_type->description = $request->description;

            $labor_type->save();
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

        $labor_types = LaborType::with('positions')->where('id', $id)->first();

        if(!count($labor_types->positions))
        {
            $labor_types->delete();

            return;
        }
        
        abort(403, 'Unable to delete.');
    }
}
