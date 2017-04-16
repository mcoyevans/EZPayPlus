<?php 

namespace App\Traits;

use Illuminate\Http\Request;

trait Enlist {
	/**
     * Popluate the resource instance.
     *
     * @params \Illuminate\Http\Request
     */
	public function populate(Request $request)
	{
		if($request->has('where')){
			$this->where($request);
		}

		if($request->has('relationships')){
			$this->relationships($request);
		}
	}

	public function where(Request $request)
	{
		foreach ($request->where as $key => $where) {
			$this->model->where($where['column'], $where['condition'], $where['value']);
		}
	}

	public function relationships(Request $request)
	{
		foreach ($request->with as $key => $with) {
			$this->model->with($where['relationship']);
		}
	}
}