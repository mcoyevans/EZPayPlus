<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Department;

use Auth;
use Carbon\Carbon;
use DB;
use Gate;

class DepartmentController extends Controller
{
    /**
     * Checks for duplicate entry.
     *
     * @return bool
     */
    public function checkDuplicate(Request $request)
    {
        $duplicate = $request->has('id') ? Department::where('name', $request->name)->whereNotIn('id', [$request->id])->first() : Department::where('name', $request->name)->first();

        return response()->json($duplicate ? true : false);
    }

    /**
     * Display a listing of the resource with parameters.
     *
     * @return \Illuminate\Http\Response
     */
    public function enlist(Request $request)
    {
        $departments = Department::query();

        if($request->has('withTrashed'))
        {
            $departments->withTrashed();
        }

        if($request->has('with'))
        {
            for ($i=0; $i < count($request->with); $i++) { 
                if(!$request->input('with')[$i]['withTrashed'])
                {
                    $departments->with($request->input('with')[$i]['relation']);
                }
            }
        }

        if($request->has('search'))
        {
            $departments->where('name', 'like', '%'.$request->search.'%')->orWhere('description', 'like', '%'.$request->search.'%');
        }

        if($request->has('paginate'))
        {
            return $departments->paginate($request->paginate);
        }

        if($request->has('first'))
        {
            return $departments->first();
        }

        return $departments->get();
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Department::all();
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
        if(Gate::forUser($request->user())->allows('settings-access'))
        {
            $duplicate = Department::where('name', $request->name)->first();

            if($duplicate)
            {
                return response()->json(true);
            }

            DB::transaction(function() use($request){
                $department = new Department;

                $department->name = $request->name;
                $department->description = $request->description;

                $department->save();
            });
        }
        else{
            abort(403, 'Unauthorized action.');
        }
        
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Department::withTrashed()->where('id', $id)->first();
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
        if(Gate::forUser($request->user())->allows('settings-access'))
        {
            $duplicate = Department::whereNotIn('id', [$id])->where('name', $request->name)->first();

            if($duplicate)
            {
                return response()->json(true);
            }

            DB::transaction(function() use($request, $id){
                $department = Department::where('id', $id)->first();

                $department->name = $request->name;
                $department->description = $request->description;

                $department->save();
            });
        }
        else
        {
            abort(403, 'Unauthorized action.');
        }
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

        $department = Department::with('positions')->where('id', $id)->first();

        if(!count($department->positions))
        {
            $department->delete();

            return;
        }
        
        abort(403, 'Unable to delete.');
    }
}
