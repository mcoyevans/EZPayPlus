<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\AllowanceType;

use Auth;
use Carbon\Carbon;
use DB;
use Gate;

class AllowanceTypeController extends Controller
{
    /**
     * Checks for duplicate entry.
     *
     * @return bool
     */
    public function checkDuplicate(Request $request)
    {
        $duplicate = $request->has('id') ? AllowanceType::where('name', $request->name)->whereNotIn('id', [$request->id])->first() : AllowanceType::where('name', $request->name)->first();

        return response()->json($duplicate ? true : false);
    }

    /**
     * Display a listing of the resource with parameters.
     *
     * @return \Illuminate\Http\Response
     */
    public function enlist(Request $request)
    {
        $allowance_types = AllowanceType::query();

        if($request->has('withTrashed'))
        {
            $allowance_types->withTrashed();
        }

        if($request->has('with'))
        {
            for ($i=0; $i < count($request->with); $i++) { 
                if(!$request->input('with')[$i]['withTrashed'])
                {
                    $allowance_types->with($request->input('with')[$i]['relation']);
                }
            }
        }

        if($request->has('search'))
        {
            $allowance_types->where('name', 'like', '%'.$request->search.'%')->orWhere('description', 'like', '%'.$request->search.'%');
        }

        if($request->has('paginate'))
        {
            return $allowance_types->paginate($request->paginate);
        }

        if($request->has('first'))
        {
            return $allowance_types->first();
        }

        return $allowance_types->get();
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return AllowanceType::all();
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

        $duplicate = AllowanceType::where('name', $request->name)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $this->validate($request, [
            'name' => 'required',
            'description' => 'required',
        ]);

        DB::transaction(function() use($request){
            $allowance_type = new AllowanceType;

            $allowance_type->name = $request->name;
            $allowance_type->description = $request->description;

            $allowance_type->save();
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
        return AllowanceType::withTrashed()->where('id', $id)->first();
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

        $duplicate = AllowanceType::whereNotIn('id', [$id])->where('name', $request->name)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $this->validate($request, [
            'name' => 'required',
            'description' => 'required',
        ]);

        DB::transaction(function() use($request, $id){
            $allowance_type = AllowanceType::where('id', $id)->first();

            $allowance_type->name = $request->name;
            $allowance_type->description = $request->description;

            $allowance_type->save();
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

        $allowance_types = AllowanceType::with('employees')->where('id', $id)->first();

        if(!count($allowance_types->employees))
        {
            $allowance_types->delete();

            return;
        }
        
        abort(403, 'Unable to delete.');
    }
}
