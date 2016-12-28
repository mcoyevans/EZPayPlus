<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Employee;
use App\EmployeeAllowanceType;
use App\EmployeeDeductionType;
use App\City;
use App\TaxCode;

use Auth;
use Carbon\Carbon;
use DB;
use Gate;

class EmployeeController extends Controller
{
    /**
     * Checks for duplicate entry.
     *
     * @return bool
     */
    public function checkDuplicate(Request $request)
    {
        $duplicate = $request->has('id') ? Employee::where('employee_number', $request->employee_number)->whereNotIn('id', [$request->id])->first() : Employee::where('employee_number', $request->employee_number)->first();

        return response()->json($duplicate ? true : false);
    }

    /**
     * Display a listing of the resource with parameters.
     *
     * @return \Illuminate\Http\Response
     */
    public function enlist(Request $request)
    {
        $employees = Employee::query();

        if($request->has('withTrashed'))
        {
            $employees->withTrashed();
        }

        if($request->has('with'))
        {
            for ($i=0; $i < count($request->with); $i++) { 
                if(!$request->input('with')[$i]['withTrashed'])
                {
                    $employees->with($request->input('with')[$i]['relation']);
                }
                else{
                    $employees->with([$request->input('with')[$i]['relation'] => function($query){
                        $query->withTrashed();
                    }]);
                }
            }
        }

        if($request->has('where'))
        {
            for ($i=0; $i < count($request->where); $i++) { 
                $employees->where($request->input('where')[$i]['label'], $request->input('where')[$i]['condition'], $request->input('where')[$i]['value']);
            }
        }

        if($request->has('whereDoesntHave'))
        {
            for ($i=0; $i < count($request->whereDoesntHave); $i++) { 
                $employees->whereDoesntHave($request->input('whereDoesntHave')[$i]['relation'], function($query) use($request, $i){
                    for ($j=0; $j < count($request->input('whereDoesntHave')[$i]['where']); $j++) { 
                        $query->where($request->input('whereDoesntHave')[$i]['where'][$j]['label'], $request->input('whereDoesntHave')[$i]['where'][$j]['condition'], $request->input('whereDoesntHave')[$i]['where'][$j]['value']);
                    }
                });
            }
        }

        if($request->has('search'))
        {
            $employees->where('first_name', 'like', '%'.$request->search.'%')->orWhere('middle_name', 'like', '%'.$request->search.'%')->orWhere('last_name', 'like', '%'.$request->search.'%')->orWhere('employee_number', '=', $request->search);
        }

        if($request->has('paginate'))
        {
            return $employees->paginate($request->paginate);
        }

        if($request->has('first'))
        {
            return $employees->first();
        }

        return $employees->get();
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
        if(Gate::forUser($request->user())->denies('hris'))
        {
            abort(403, 'Unauthorized action.');
        }

        $duplicate = Employee::where('employee_number', $request->employee_number)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $this->validate($request, [
            'employee_number' => 'required',
            'first_name' => 'required',
            'last_name' => 'required',
            'birthdate' => 'required',
            'age' => 'required',
            'sex' => 'required',
            'civil_status' => 'required',
            'batch_id' => 'required',
            'branch_id' => 'required',
            'cost_center_id' => 'required',
            'position_id' => 'required',
            'employment_status' => 'required',
            'date_hired' => 'required',
            'street_address' => 'required',
            'city' => 'required',
            'province_id' => 'required',
            'email' => 'required',
            'sss' => 'required',
            'pagibig' => 'required',
            'philhealth' => 'required',
            'tax_code_id' => 'required',
            'time_interpretation_id' => 'required',
            'basic_salary' => 'required',
        ]);

        DB::transaction(function() use($request){
            $employee = new Employee;

            $employee->age = $request->age;
            $employee->batch_id = $request->batch_id;
            $employee->branch_id = $request->branch_id;
            $employee->basic_salary = $request->basic_salary;
            $employee->birthdate = Carbon::parse($request->birthdate);
            $employee->civil_status = $request->civil_status;
            $employee->cost_center_id = $request->cost_center_id;
            $employee->city_id = City::where('name', $request->city)->where('province_id', $request->province_id)->firstOrFail()->id;
            $employee->date_hired = Carbon::parse($request->date_hired);
            $employee->email = $request->email;
            $employee->employee_number = $request->employee_number;
            $employee->employment_status = $request->employment_status;
            $employee->first_name = $request->first_name;
            $employee->last_name = $request->last_name;
            $employee->middle_name = $request->middle_name;
            $employee->mobile_number = $request->mobile_number;
            $employee->pagibig = $request->pagibig;
            $employee->philhealth = $request->philhealth;
            $employee->position_id = $request->position_id;
            $employee->postal_code = $request->postal_code;
            $employee->province_id = $request->province_id;
            $employee->sex = $request->sex;
            $employee->sss = $request->sss;
            $employee->street_address = $request->street_address;
            $employee->suffix = $request->suffix;
            $employee->tax_code_id = $request->tax_code_id;
            $employee->dependents = $request->tax_code_id;
            $employee->telephone_number = $request->telephone_number;
            $employee->tin = $request->tin;
            $employee->time_interpretation_id = $request->time_interpretation_id;

            $employee->save();

            for ($i=0; $i < count($request->allowance_types); $i++) { 
                $employee_allowance = new EmployeeAllowanceType;

                $employee_allowance->employee_id = $employee->id;
                $employee_allowance->allowance_type_id = $request->input('allowance_types')[$i]['allowance_type_id'];
                $employee_allowance->amount = $request->input('allowance_types')[$i]['amount'];
                $employee_allowance->first_cut_off = isset($request->input('allowance_types')[$i]['first_cut_off']) ? $request->input('allowance_types')[$i]['first_cut_off'] : false;
                $employee_allowance->second_cut_off = isset($request->input('allowance_types')[$i]['second_cut_off']) ? $request->input('allowance_types')[$i]['second_cut_off'] : false;
                $employee_allowance->third_cut_off = isset($request->input('allowance_types')[$i]['third_cut_off']) ? $request->input('allowance_types')[$i]['third_cut_off'] : false;
                $employee_allowance->fourth_cut_off = isset($request->input('allowance_types')[$i]['fourth_cut_off']) ? $request->input('allowance_types')[$i]['fourth_cut_off'] : false;
                $employee_allowance->on_hold = isset($request->input('allowance_types')[$i]['on_hold']) ? $request->input('allowance_types')[$i]['on_hold'] : false;

                $employee_allowance->save();
            }

            for ($i=0; $i < count($request->deduction_types); $i++) { 
                $employee_deduction = new EmployeeDeductionType;

                $employee_deduction->employee_id = $employee->id;
                $employee_deduction->deduction_type_id = $request->input('deduction_types')[$i]['deduction_type_id'];
                $employee_deduction->amount = $request->input('deduction_types')[$i]['amount'];
                $employee_deduction->first_cut_off = isset($request->input('deduction_types')[$i]['first_cut_off']) ? $request->input('deduction_types')[$i]['first_cut_off'] : false;
                $employee_deduction->second_cut_off = isset($request->input('deduction_types')[$i]['second_cut_off']) ? $request->input('deduction_types')[$i]['second_cut_off'] : false;
                $employee_deduction->third_cut_off = isset($request->input('deduction_types')[$i]['third_cut_off']) ? $request->input('deduction_types')[$i]['third_cut_off'] : false;
                $employee_deduction->fourth_cut_off = isset($request->input('deduction_types')[$i]['fourth_cut_off']) ? $request->input('deduction_types')[$i]['fourth_cut_off'] : false;
                $employee_deduction->on_hold = isset($request->input('deduction_types')[$i]['on_hold']) ? $request->input('deduction_types')[$i]['on_hold'] : false;

                $employee_deduction->save();
            }
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
        return Employee::find($id);
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
        if(Gate::forUser($request->user())->denies('hris'))
        {
            abort(403, 'Unauthorized action.');
        }

        $duplicate = Employee::where('employee_number', $request->employee_number)->whereNotIn('id', [$id])->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $this->validate($request, [
            'employee_number' => 'required',
            'first_name' => 'required',
            'last_name' => 'required',
            'birthdate' => 'required',
            'age' => 'required',
            'sex' => 'required',
            'civil_status' => 'required',
            'batch_id' => 'required',
            'branch_id' => 'required',
            'cost_center_id' => 'required',
            'position_id' => 'required',
            'employment_status' => 'required',
            'date_hired' => 'required',
            'street_address' => 'required',
            'city' => 'required',
            'province_id' => 'required',
            'email' => 'required',
            'sss' => 'required',
            'pagibig' => 'required',
            'philhealth' => 'required',
            'tax_code_id' => 'required',
            'time_interpretation_id' => 'required',
            'basic_salary' => 'required',
        ]);

        DB::transaction(function() use($request, $id){
            $employee = Employee::find($id);

            $employee->age = $request->age;
            $employee->batch_id = $request->batch_id;
            $employee->branch_id = $request->branch_id;
            $employee->basic_salary = $request->basic_salary;
            $employee->birthdate = Carbon::parse($request->birthdate);
            $employee->civil_status = $request->civil_status;
            $employee->cost_center_id = $request->cost_center_id;
            $employee->city_id = City::where('name', $request->city)->where('province_id', $request->province_id)->firstOrFail()->id;
            $employee->date_hired = Carbon::parse($request->date_hired);
            $employee->email = $request->email;
            $employee->employee_number = $request->employee_number;
            $employee->employment_status = $request->employment_status;
            $employee->first_name = $request->first_name;
            $employee->last_name = $request->last_name;
            $employee->middle_name = $request->middle_name;
            $employee->mobile_number = $request->mobile_number;
            $employee->pagibig = $request->pagibig;
            $employee->philhealth = $request->philhealth;
            $employee->position_id = $request->position_id;
            $employee->postal_code = $request->postal_code;
            $employee->province_id = $request->province_id;
            $employee->sex = $request->sex;
            $employee->sss = $request->sss;
            $employee->street_address = $request->street_address;
            $employee->suffix = $request->suffix;
            $employee->tax_code_id = $request->tax_code_id;
            $employee->dependents = $request->tax_code_id;
            $employee->telephone_number = $request->telephone_number;
            $employee->tin = $request->tin;
            $employee->time_interpretation_id = $request->time_interpretation_id;

            $employee->save();

            EmployeeAllowanceType::where('employee_id', $employee->id)->delete();
            EmployeeDeductionType::where('employee_id', $employee->id)->delete();

            for ($i=0; $i < count($request->allowance_types); $i++) { 
                $employee_allowance = new EmployeeAllowanceType;

                $employee_allowance->employee_id = $employee->id;
                $employee_allowance->allowance_type_id = $request->input('allowance_types')[$i]['allowance_type_id'];
                $employee_allowance->amount = $request->input('allowance_types')[$i]['amount'];
                $employee_allowance->first_cut_off = isset($request->input('allowance_types')[$i]['first_cut_off']) ? $request->input('allowance_types')[$i]['first_cut_off'] : false;
                $employee_allowance->second_cut_off = isset($request->input('allowance_types')[$i]['second_cut_off']) ? $request->input('allowance_types')[$i]['second_cut_off'] : false;
                $employee_allowance->third_cut_off = isset($request->input('allowance_types')[$i]['third_cut_off']) ? $request->input('allowance_types')[$i]['third_cut_off'] : false;
                $employee_allowance->fourth_cut_off = isset($request->input('allowance_types')[$i]['fourth_cut_off']) ? $request->input('allowance_types')[$i]['fourth_cut_off'] : false;
                $employee_allowance->on_hold = isset($request->input('allowance_types')[$i]['on_hold']) ? $request->input('allowance_types')[$i]['on_hold'] : false;

                $employee_allowance->save();
            }

            for ($i=0; $i < count($request->deduction_types); $i++) { 
                $employee_deduction = new EmployeeDeductionType;

                $employee_deduction->employee_id = $employee->id;
                $employee_deduction->deduction_type_id = $request->input('deduction_types')[$i]['deduction_type_id'];
                $employee_deduction->amount = $request->input('deduction_types')[$i]['amount'];
                $employee_deduction->first_cut_off = isset($request->input('deduction_types')[$i]['first_cut_off']) ? $request->input('deduction_types')[$i]['first_cut_off'] : false;
                $employee_deduction->second_cut_off = isset($request->input('deduction_types')[$i]['second_cut_off']) ? $request->input('deduction_types')[$i]['second_cut_off'] : false;
                $employee_deduction->third_cut_off = isset($request->input('deduction_types')[$i]['third_cut_off']) ? $request->input('deduction_types')[$i]['third_cut_off'] : false;
                $employee_deduction->fourth_cut_off = isset($request->input('deduction_types')[$i]['fourth_cut_off']) ? $request->input('deduction_types')[$i]['fourth_cut_off'] : false;
                $employee_deduction->on_hold = isset($request->input('deduction_types')[$i]['on_hold']) ? $request->input('deduction_types')[$i]['on_hold'] : false;

                $employee_deduction->save();
            }
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
        if(Gate::forUser(Auth::user())->denies('hris'))
        {
            abort(403, 'Unauthorized action.');
        }

        Employee::where('id', $id)->delete();
    }
}
