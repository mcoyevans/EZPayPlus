<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Branch;

use Auth;
use DB;
use Carbon\Carbon;

class BranchController extends Controller
{
    /**
     * Checks for duplicate entry.
     *
     * @return bool
     */
    public function checkDuplicate(Request $request)
    {
        $duplicate = $request->has('id') ? Branch::where('gl_account', $request->gl_account)->whereNotIn('id', [$request->id])->first() : Branch::where('gl_account', $request->gl_account)->first();

        return response()->json($duplicate ? true : false);
    }
    /**
     * Display a listing of the resource with parameters.
     *
     * @return \Illuminate\Http\Response
     */
    public function enlist(Request $request)
    {
        $branches = Branch::query();

        if($request->has('withTrashed'))
        {
            $branches->withTrashed();
        }

        if($request->has('paginate'))
        {
            return $branches->paginate($request->paginate);
        }

        return $branches->get();
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
        $this->authorize('create', Branch::class);

        $duplicate = Branch::where('gl_account', $request->gl_account)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $this->validate($request, [
            'name' => 'required',
            'description' => 'required',
            'gl_account' => 'required|min:12|max:12',
        ]);

        $branch = new Branch;

        $branch->name = $request->name;
        $branch->description = $request->description;
        $branch->gl_account = $request->gl_account;

        $branch->save();
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
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
