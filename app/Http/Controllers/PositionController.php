<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Position;

use Auth;
use Catbon\Carbon;
use DB;
use Gate;

class PositionController extends Controller
{
    /**
     * Checks for duplicate entry.
     *
     * @return bool
     */
    public function checkDuplicate(Request $request)
    {
        // $duplicate = $request->has('id') ? Position::where('name', $request->name)->where('department_id', $request->department_id)->where('job_category_id', $request->job_category_id)->where('labor_type_id', $request->labor_type_id)->whereNotIn('id', [$request->id])->first() : Position::where('name', $request->name)->where('department_id', $request->department_id)->where('job_category_id', $request->job_category_id)->where('labor_type_id', $request->labor_type_id)->first();

        $duplicate = $request->has('id') ? Position::where('name', $request->name)->whereNotIn('id', [$request->id])->first() : Position::where('name', $request->name)->first();

        return response()->json($duplicate ? true : false);
    }

    /**
     * Display a listing of the resource with parameters.
     *
     * @return \Illuminate\Http\Response
     */
    public function enlist(Request $request)
    {
        $positions = Position::query();

        if($request->has('withTrashed'))
        {
            $positions->withTrashed();
        }

        if($request->has('with'))
        {
            for ($i=0; $i < count($request->with); $i++) { 
                if(!$request->input('with')[$i]['withTrashed'])
                {
                    $positions->with($request->input('with')[$i]['relation']);
                }
                else{
                    $positions->with([$request->input('with')[$i]['relation'] => function($query){
                        $query->withTrashed();
                    }]);
                }
            }
        }

        if($request->has('search'))
        {
            $positions->where('name', 'like', '%'.$request->search.'%')->orWhere('description', 'like', '%'.$request->search.'%');
        }

        if($request->has('paginate'))
        {
            return $positions->paginate($request->paginate);
        }

        if($request->has('first'))
        {
            return $positions->first();
        }

        return $positions->get();
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Position::all();
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

        // $duplicate = Position::where('name', $request->name)->where('department_id', $request->department_id)->where('job_category_id', $request->job_category_id)->where('labor_type_id', $request->labor_type_id)->first();

        $duplicate = Position::where('name', $request->name)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $this->validate($request, [
            'name' => 'required',
            'description' => 'required',
            // 'department_id' => 'required|numeric',
            // 'job_category_id' => 'required|numeric',
            // 'labor_type_id' => 'required|numeric',
        ]);

        DB::transaction(function() use($request){
            $position = new Position;

            $position->name = $request->name;
            $position->description = $request->description;
            // $position->department_id = $request->department_id;
            // $position->job_category_id = $request->job_category_id;
            // $position->labor_type_id = $request->labor_type_id;

            $position->save();
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
        return Position::withTrashed()->where('id', $id)->first();
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

        // $duplicate = Position::whereNotIn('id', [$id])->where('name', $request->name)->where('department_id', $request->department_id)->where('job_category_id', $request->job_category_id)->where('labor_type_id', $request->labor_type_id)->first();

        $duplicate = Position::whereNotIn('id', [$id])->where('name', $request->name)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $this->validate($request, [
            'name' => 'required',
            'description' => 'required',
            // 'department_id' => 'required|numeric',
            // 'job_category_id' => 'required|numeric',
            // 'labor_type_id' => 'required|numeric',
        ]);

        DB::transaction(function() use($request, $id){
            $position = Position::where('id', $id)->first();

            $position->name = $request->name;
            $position->description = $request->description;
            // $position->department_id = $request->department_id;
            // $position->job_category_id = $request->job_category_id;
            // $position->labor_type_id = $request->labor_type_id;

            $position->save();
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

        $position = Position::with('employees')->where('id', $id)->first();

        if(!count($position->employees))
        {
            $position->delete();

            return;
        }
        
        abort(403, 'Unable to delete.');
    }
}
