<?php

namespace App\Policies;

use App\User;
use App\Module;
use Illuminate\Auth\Access\HandlesAuthorization;

class ModulePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view the module.
     *
     * @param  App\User  $user
     * @param  App\Module  $module
     * @return mixed
     */
    public function view(User $user, Module $module)
    {
        $user = User::with('group.modules')->where('id', $user->id)->first();

        foreach ($user->group->modules as $user_module) {
            if($user_module->name == $module->name)
            {
                return true;
            }
        }

        return false;
    }

    /**
     * Determine whether the user can create modules.
     *
     * @param  App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        //
    }

    /**
     * Determine whether the user can update the module.
     *
     * @param  App\User  $user
     * @param  App\Module  $module
     * @return mixed
     */
    public function update(User $user, Module $module)
    {
        //
    }

    /**
     * Determine whether the user can delete the module.
     *
     * @param  App\User  $user
     * @param  App\Module  $module
     * @return mixed
     */
    public function delete(User $user, Module $module)
    {
        //
    }
}
