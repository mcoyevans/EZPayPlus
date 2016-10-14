<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\LeaveType;

use Auth;
use Catbon\Carbon;
use DB;
use Gate;

class LeaveTypeController extends Controller
{
    /**
     * Checks for duplicate entry.
     *
     * @return bool
     */
    public function checkDuplicate(Request $request)
    {
        $duplicate = $request->has('id') ? LeaveType::where('name', $request->name)->whereNotIn('id', [$request->id])->first() : LeaveType::where('name', $request->name)->first();

        return response()->json($duplicate ? true : false);
    }

    /**
     * Display a listing of the resource with parameters.
     *
     * @return \Illuminate\Http\Response
     */
    public function enlist(Request $request)
    {
        $leave_types = LeaveType::query();

        if($request->has('search'))
        {
            $leave_types->where('name', 'like', '%'.$request->search.'%')->orWhere('description', 'like', '%'.$request->search.'%');
        }

        if($request->has('paginate'))
        {
            return $leave_types->paginate($request->paginate);
        }

        if($request->has('first'))
        {
            return $leave_types->first();
        }

        return $leave_types->get();
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return LeaveType::all();
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

        $duplicate = LeaveType::where('name', $request->name)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $this->validate($request, [
            'name' => 'required',
            'description' => 'required',
        ]);

        DB::transaction(function() use($request){
            $leave_type = new LeaveType;

            $leave_type->name = $request->name;
            $leave_type->description = $request->description;
            $leave_type->paid = $request->paid ? true : false;
            $leave_type->convertible = $request->convertible ? true : false;

            $leave_type->save();
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
        return LeaveType::where('id', $id)->first();
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

        $duplicate = LeaveType::whereNotIn('id', [$id])->where('name', $request->name)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $this->validate($request, [
            'name' => 'required',
            'description' => 'required',
        ]);

        DB::transaction(function() use($request, $id){
            $leave_type = LeaveType::where('id', $id)->first();

            $leave_type->name = $request->name;
            $leave_type->description = $request->description;
            $leave_type->paid = $request->paid ? true : false;
            $leave_type->convertible = $request->convertible ? true : false;

            $leave_type->save();
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

        LeaveType::where('id', $id)->delete();
    }
}
