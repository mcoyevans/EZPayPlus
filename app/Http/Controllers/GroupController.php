<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Group;

use Auth;
use DB;
use Carbon\Carbon;

class GroupController extends Controller
{
    /**
     * Checks for duplicate entry.
     *
     * @return bool
     */
    public function checkDuplicate(Request $request)
    {
        $duplicate = $request->has('id') ? Group::where('name', $request->name)->whereNotIn('id', [$request->id])->first() : Group::where('name', $request->name)->first();

        return response()->json($duplicate ? true : false);
    }

    /**
     * Display a listing of the resource with parameters.
     *
     * @return \Illuminate\Http\Response
     */
    public function enlist(Request $request)
    {
        $groups = Group::query();

        // do not include super-admin in the list
        $groups->whereNotIn('name', ['super-admin']);

        if($request->has('with'))
        {
            for ($i=0; $i < count($request->with); $i++) { 
                if(!$request->input('with')[$i]['withTrashed'])
                {
                    $groups->with($request->input('with')[$i]['relation']);
                }
            }
        }

        if($request->has('where'))
        {
            for ($i=0; $i < count($request->where); $i++) { 
                $groups->where($request->input('where')[$i]['label'], $request->input('where')[$i]['condition'], $request->input('where')[$i]['value']);
            }
        }

        if($request->has('search'))
        {
            $groups->where('name', 'like', '%'.$request->search.'%')->orWhere('description', 'like', '%'.$request->search.'%');
        }

        if($request->has('paginate'))
        {
            return $groups->paginate($request->paginate);
        }

        if($request->has('first'))
        {
            return $groups->first();
        }

        return $groups->get();
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Group::all();
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
        $this->authorize('create', Group::class);

        $duplicate = Group::where('name', $request->name)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $this->validate($request, [
            'name' => 'required',
            'description' => 'required',
            'modules' => 'required',
        ]);

        DB::transaction(function() use($request){
            $group = new Group;

            $group->name = $request->name;
            $group->description = $request->description;

            $group->save();

            $modules = array();

            for ($i=0; $i < count($request->modules); $i++) { 
                if(isset($request->input('modules')[$i]['id']))
                {
                    array_push($modules, $request->input('modules')[$i]['id']);
                }
            }
            
            $group->modules()->attach($modules);
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
        //
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
        $group = Group::where('id', $id)->first();

        $this->authorize('update', $group);

        $duplicate = Group::where('name', $request->name)->whereNotIn('id', [$id])->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $this->validate($request, [
            'name' => 'required',
            'description' => 'required',
            'modules' => 'required',
        ]);

        DB::transaction(function() use($request, $group){
            $group->name = $request->name;
            $group->description = $request->description;

            $group->save();

            $modules = array();

            for ($i=0; $i < count($request->modules); $i++) { 
                if(isset($request->input('modules')[$i]['id']))
                {
                    array_push($modules, $request->input('modules')[$i]['id']);
                }
            }
            
            $group->modules()->sync($modules);
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
        $group = Group::with('users')->where('id', $id)->first();

        $this->authorize('delete', $group);

        if(!isset($group->users))
        {
            $group->delete();
        }

        abort(403, 'Unauthorized action.');
    }
}
