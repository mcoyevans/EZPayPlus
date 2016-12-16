<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\User;
use Auth;
use Hash;
use Gate;

class UserController extends Controller
{
    /**
     * Display a listing of the resource with parameters.
     *
     * @return \Illuminate\Http\Response
     */
    public function enlist(Request $request)
    {
        $users = User::query();

        if($request->has('withTrashed'))
        {
            $users->withTrashed();
        }

        if($request->has('with'))
        {
            for ($i=0; $i < count($request->with); $i++) { 
                if(!$request->input('with')[$i]['withTrashed'])
                {
                    $users->with($request->input('with')[$i]['relation']);
                }
            }
        }

        if($request->has('where'))
        {
            for ($i=0; $i < count($request->where); $i++) { 
                $users->where($request->input('where')[$i]['label'], $request->input('where')[$i]['condition'], $request->input('where')[$i]['value']);
            }
        }

        if($request->has('search'))
        {
            $users->where('name', 'like', '%'.$request->search.'%')->orWhere('email', 'like', '%'.$request->search.'%');
        }

        if($request->has('paginate'))
        {
            return $users->paginate($request->paginate);
        }

        if($request->has('first'))
        {
            return $users->first();
        }

        return $users->get();
    }

    /**
     * Checks authenticated user.
     *
     * @return \Illuminate\Http\Response
     */
    public function check(Request $request)
    {
        $user = Auth::user();

        $user->unread_notifications = $user->unreadNotifications;

        $user->load('group.modules');

        return $user;
    }

    /**
     * Checks if the email is already taken.
     *
     * @return bool
     */
    public function checkEmail(Request $request)
    {
        $user = $request->id ? User::withTrashed()->whereNotIn('id', [$request->id])->where('email', $request->email)->first() : User::withTrashed()->where('email', $request->email)->first();

        return response()->json($user ? true : false);
    }
    
    /**
     * Changes the password of the authenticated user.
     *
     * @return \Illuminate\Http\Response
     */
    public function changePassword(Request $request)
    {
        $user = $request->user();

        if($request->new == $request->confirm && $request->old != $request->new)
        {
            $user->password = Hash::make($request->new);
        }

        $user->save();
    }

    /**
     * Check if the password of the authenticated user is the same with his new password.
     *
     * @return bool
     */
    public function checkPassword(Request $request)
    {
        return response()->json(Hash::check($request->old, $request->user()->password));
    }

    /**
     * Logout the authenticated user.
     *
     * @return \Illuminate\Http\Response
     */
    public function logout()
    {
        Auth::logout();
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
        if(Gate::forUser($request->user())->allows('settings-access'))
        {
            $duplicate = User::where('email', $request->email)->first();

            if($duplicate)
            {
                return response()->json(true);
            }

            $this->validate($request, [
                'name' => 'required',
                'email' => 'required|unique:users',
                'password' => 'required',
                'group_id' => 'required|numeric',
            ]);

            $user = new User;

            $user->name = $request->name;
            $user->email = $request->email;
            $user->password = bcrypt($request->password);
            $user->group_id = $request->group_id;
            $user->super_user = false;

            $user->save();
        }
        else
        {
            abort(403, 'Unauthorized action.');
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return User::withTrashed()->where('id', $id)->first();
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
        if(Gate::forUser($request->user())->allows('settings-access'))
        {
            $duplicate = User::whereNotIn('id', [$id])->where('email', $request->email)->first();

            if($duplicate)
            {
                return response()->json(true);
            }

            $this->validate($request, [
                'name' => 'required',
                'group_id' => 'required|numeric',
            ]);

            $user = User::where('id', $id)->first();

            $user->name = $request->name;
            $user->group_id = $request->group_id;

            $user->save();
        }
        else
        {
            abort(403, 'Unauthorized action.');
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        if(Gate::forUser(Auth::user())->allows('settings-access'))
        {
            User::where('id', $id)->delete();

            return;
        }

        abort(403, 'Unable to delete.');
    }
}
