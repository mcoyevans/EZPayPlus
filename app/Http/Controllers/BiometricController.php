<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Biometric;

use Auth;
use Carbon\Carbon;
use DB;
use Gate;

class BiometricController extends Controller
{
    /**
     * Checks for duplicate bank account number entry.
     *
     * @return bool
     */
    public function checkDuplicate(Request $request)
    {
        $duplicate = $request->has('id') ? Biometric::where('name', $request->name)->whereNotIn('id', $request->id)->first() : Biometric::where('name', $request->name)->first();

        return response()->json($duplicate ? true : false);
    }

    /**
     * Display a listing of the resource with parameters.
     *
     * @return \Illuminate\Http\Response
     */
    public function enlist(Request $request)
    {
        $biometrics = Biometric::query();

        if($request->has('withTrashed'))
        {
            $biometrics->withTrashed();
        }

        if($request->has('where'))
        {
            for ($i=0; $i < count($request->where); $i++) { 
                $biometrics->where($request->input('where')[$i]['label'], $request->input('where')[$i]['condition'], $request->input('where')[$i]['value']);
            }
        }

        if($request->has('search'))
        {
            $biometrics->where('name', 'like', '%'.$request->search.'%');
        }

        if($request->has('paginate'))
        {
            return $biometrics->paginate($request->paginate);
        }

        if($request->has('first'))
        {
            return $biometrics->first();
        }

        return $biometrics->get();
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Biometric::all();
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
            abort(403, 'Unauthorized access');
        }

        $duplicate = Biometric::where('name', $request->name)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $this->validate($request, [
            'name' => 'required',
            'description' => 'required',
        ]);


        DB::transaction(function() use($request){
            $biometric = new Biometric;

            $biometric->name = $request->name;
            $biometric->description = $request->description;

            $biometric->save();
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
        return Biometric::where('id', $id)->first();
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
            abort(403, 'Unauthorized access');
        }

        $this->validate($request, [
            'name' => 'required',
            'description' => 'required',
        ]);

        $duplicate = Biometric::where('name', $request->name)->whereNotIn('id', [$id])->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        DB::transaction(function() use($request, $id){
            $biometric = Biometric::where('id', $id)->first();

            $biometric->name = $request->name;
            $biometric->description = $request->description;

            $biometric->save();
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
            abort(403, 'Unauthorized access');
        }

        Biometric::where('id', $id)->delete();
    }
}
