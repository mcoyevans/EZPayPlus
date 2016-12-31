<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Holiday;

use Auth;
use Carbon\Carbon;
use DB;
use Gate;

class HolidayController extends Controller
{
    /**
     * Checks for duplicate entry.
     *
     * @return bool
     */
    public function checkDuplicate(Request $request)
    {
        $duplicate = $request->id ? Holiday::where('description', $request->description)->where('date', Carbon::parse($request->date))->whereNotIn('id', [$request->id])->first() : Holiday::where('description', $request->description)->where('date', Carbon::parse($request->date))->first();
        
        return response()->json($duplicate ? true : false);
    }

    /**
     * Display a listing of the resource with parameters.
     *
     * @return \Illuminate\Http\Response
     */
    public function enlist(Request $request)
    {
        $holidays = Holiday::query();

        if($request->has('withTrashed'))
        {
            $holidays->withTrashed();
        }

        if($request->has('with'))
        {
            for ($i=0; $i < count($request->with); $i++) { 
                if(!$request->input('with')[$i]['withTrashed'])
                {
                    $holidays->with($request->input('with')[$i]['relation']);
                }
                else{
                    $holidays->with([$request->input('with')[$i]['relation'] => function($query){
                        $query->withTrashed();
                    }]);
                }
            }
        }

        if($request->has('where'))
        {
            for ($i=0; $i < count($request->where); $i++) { 
                $holidays->where($request->input('where')[$i]['label'], $request->input('where')[$i]['condition'], $request->input('where')[$i]['value']);
            }
        }

        if($request->has('whereBetween'))
        {
            for ($i=0; $i < count($request->whereBetween); $i++) { 
                if($request->input('whereBetween')[$i]['label'] == 'date')
                {
                    $holidays->whereBetween($request->input('whereBetween')[$i]['label'], [Carbon::parse($request->input('whereBetween')[$i]['start']), Carbon::parse($request->input('whereBetween')[$i]['end'])]);

                    continue;
                }

                $holidays->whereBetween($request->input('whereBetween')[$i]['label'], [$request->input('whereBetween')[$i]['start'], $request->input('whereBetween')[$i]['end']]);
            }
        }

        if($request->has('search'))
        {
            $holidays->where('description', 'like', '%'. $request->search. '%');
        }

        if($request->has('paginate'))
        {
            return $holidays->paginate($request->paginate);
        }

        if($request->has('first'))
        {
            return $holidays->first();
        }

        return $holidays->get();
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
        if(Gate::forUser($request->user())->denies('settings-access'))
        {
            abort(403, 'Unauthorized action.');
        }

        $duplicate = Holiday::where('description', $request->description)->where('date', Carbon::parse($request->date))->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $this->validate($request, [
            'description' => 'required',
            'date' => 'required',
            'type' => 'required',
            'branches' => 'required',
            'cost_centers' => 'required',
        ]);

        DB::transaction(function() use($request){
            $holiday = new Holiday;

            $holiday->description = $request->description;
            $holiday->type = $request->type;
            $holiday->date = Carbon::parse($request->date);

            $holiday->save();

            $branches = array();
            $cost_centers = array();

            for ($i=0; $i < count($request->branches); $i++) { 
                if(isset($request->input('branches')[$i]['id']))
                {
                    array_push($branches, $request->input('branches')[$i]['id']);
                }
            }

            for ($i=0; $i < count($request->cost_centers); $i++) { 
                if(isset($request->input('cost_centers')[$i]['id']))
                {
                    array_push($cost_centers, $request->input('cost_centers')[$i]['id']);
                }
            }
            
            $holiday->branches()->attach($branches);
            $holiday->cost_centers()->attach($cost_centers);
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
        if(Gate::forUser($request->user())->denies('settings-access'))
        {
            abort(403, 'Unauthorized action.');
        }

        $duplicate = Holiday::whereNotIn('id', [$id])->where('description', $request->description)->where('date', Carbon::parse($request->date))->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $this->validate($request, [
            'description' => 'required',
            'date' => 'required',
            'type' => 'required',
            'branches' => 'required',
            'cost_centers' => 'required',
        ]);

        DB::transaction(function() use($request, $id){
            $holiday = Holiday::find($id);

            $holiday->description = $request->description;
            $holiday->type = $request->type;
            $holiday->date = Carbon::parse($request->date);

            $holiday->save();

            $branches = array();
            $cost_centers = array();

            for ($i=0; $i < count($request->branches); $i++) { 
                if(isset($request->input('branches')[$i]['id']))
                {
                    array_push($branches, $request->input('branches')[$i]['id']);
                }
            }

            for ($i=0; $i < count($request->cost_centers); $i++) { 
                if(isset($request->input('cost_centers')[$i]['id']))
                {
                    array_push($cost_centers, $request->input('cost_centers')[$i]['id']);
                }
            }
            
            $holiday->branches()->sync($branches);
            $holiday->cost_centers()->sync($cost_centers);
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
        if(Gate::forUser(Auth::user())->denies('settings-access'))
        {
            abort(403, 'Unauthorized action.');
        }

        Holiday::where('id', $id)->delete();
    }
}
