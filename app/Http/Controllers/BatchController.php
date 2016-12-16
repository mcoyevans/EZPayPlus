<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Batch;

use Auth;
use Catbon\Carbon;
use DB;
use Gate;

class BatchController extends Controller
{
    /**
     * Checks for duplicate entry.
     *
     * @return bool
     */
    public function checkDuplicate(Request $request)
    {

        $duplicate = $request->has('id') ? Batch::where('name', $request->name)->whereNotIn('id', [$request->id])->first() : Batch::where('name', $request->name)->first();

        return response()->json($duplicate ? true : false);
    }

    /**
     * Display a listing of the resource with parameters.
     *
     * @return \Illuminate\Http\Response
     */
    public function enlist(Request $request)
    {
        $batches = Batch::query();

        if($request->has('withTrashed'))
        {
            $batches->withTrashed();
        }

        if($request->has('with'))
        {
            for ($i=0; $i < count($request->with); $i++) { 
                if(!$request->input('with')[$i]['withTrashed'])
                {
                    $batches->with($request->input('with')[$i]['relation']);
                }
                else{
                    $batches->with([$request->input('with')[$i]['relation'] => function($query){
                        $query->withTrashed();
                    }]);
                }
            }
        }

        if($request->has('search'))
        {
            $batches->where('name', 'like', '%'.$request->search.'%')->orWhere('description', 'like', '%'.$request->search.'%');
        }

        if($request->has('paginate'))
        {
            return $batches->paginate($request->paginate);
        }

        if($request->has('first'))
        {
            return $batches->first();
        }

        return $batches->get();
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Batch::all();
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

        $duplicate = Batch::where('name', $request->name)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $this->validate($request, [
            'name' => 'required',
            'description' => 'required',
        ]);

        DB::transaction(function() use($request){
            $batch = new Batch;

            $batch->name = $request->name;
            $batch->description = $request->description;

            $batch->save();
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
        return Batch::withTrashed()->where('id', $id)->first();
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

        $duplicate = Batch::whereNotIn('id', [$id])->where('name', $request->name)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $this->validate($request, [
            'name' => 'required',
            'description' => 'required',
        ]);

        DB::transaction(function() use($request, $id){
            $batch = Batch::where('id', $id)->first();

            $batch->name = $request->name;
            $batch->description = $request->description;

            $batch->save();
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

        $batch = Batch::with('employees')->where('id', $id)->first();

        if(!count($batch->employees))
        {
            $batch->delete();

            return;
        }
        
        abort(403, 'Unable to delete.');
    }
}
