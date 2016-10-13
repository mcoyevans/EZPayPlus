<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\JobCategory;

use Auth;
use Catbon\Carbon;
use DB;
use Gate;

class JobCategoryController extends Controller
{
    /**
     * Checks for duplicate entry.
     *
     * @return bool
     */
    public function checkDuplicate(Request $request)
    {
        $duplicate = $request->has('id') ? JobCategory::where('name', $request->name)->whereNotIn('id', [$request->id])->first() : JobCategory::where('name', $request->name)->first();

        return response()->json($duplicate ? true : false);
    }

    /**
     * Display a listing of the resource with parameters.
     *
     * @return \Illuminate\Http\Response
     */
    public function enlist(Request $request)
    {
        $job_categories = JobCategory::query();

        if($request->has('withTrashed'))
        {
            $job_categories->withTrashed();
        }

        if($request->has('with'))
        {
            for ($i=0; $i < count($request->with); $i++) { 
                if(!$request->input('with')[$i]['withTrashed'])
                {
                    $job_categories->with($request->input('with')[$i]['relation']);
                }
            }
        }

        if($request->has('search'))
        {
            $job_categories->where('name', 'like', '%'.$request->search.'%')->orWhere('description', 'like', '%'.$request->search.'%');
        }

        if($request->has('paginate'))
        {
            return $job_categories->paginate($request->paginate);
        }

        if($request->has('first'))
        {
            return $job_categories->first();
        }

        return $job_categories->get();
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
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
        if(!Gate::forUser($request->user())->allows('settings-access'))
        {
            abort(403, 'Unauthorized action.');
        }

        $duplicate = JobCategory::where('name', $request->name)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        DB::transaction(function() use($request){
            $job_category = new JobCategory;

            $job_category->name = $request->name;
            $job_category->description = $request->description;

            $job_category->save();
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
        return JobCategory::where('id', $id)->first();
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
        if(!Gate::forUser($request->user())->allows('settings-access'))
        {
            abort(403, 'Unauthorized action.');
        }

        $duplicate = JobCategory::whereNotIn('id', [$id])->where('name', $request->name)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        DB::transaction(function() use($request, $id){
            $job_category = JobCategory::where('id', $id)->first();

            $job_category->name = $request->name;
            $job_category->description = $request->description;

            $job_category->save();
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

        $job_category = JobCategory::with('positions')->where('id', $id)->first();

        if(!count($job_category->positions))
        {
            $job_category->delete();

            return;
        }
        
        abort(403, 'Unable to delete.');
    }
}
