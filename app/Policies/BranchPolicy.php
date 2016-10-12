<?php

namespace App\Policies;

use App\User;
use App\Branch;
use Illuminate\Auth\Access\HandlesAuthorization;

class BranchPolicy
{
    use HandlesAuthorization;

    /**
     * Allow permissions for super-admin users
     *
     */
    public function before($user)
    {
        if ($user->group_id === 1) {
            return true;
        }
    }
    /**
     * Determine whether the user can view the branch.
     *
     * @param  App\User  $user
     * @param  App\Branch  $branch
     * @return mixed
     */
    public function view(User $user, Branch $branch)
    {
        //
    }

    /**
     * Determine whether the user can create branches.
     *
     * @param  App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        $user = User::with('group.modules')->where('id', $user->id)->first();

        foreach ($user->group->modules as $module) {
            if($module->name == 'Settings')
            {
                return true;
            }
        }

        return false;
    }

    /**
     * Determine whether the user can update the branch.
     *
     * @param  App\User  $user
     * @param  App\Branch  $branch
     * @return mixed
     */
    public function update(User $user, Branch $branch)
    {
        //
    }

    /**
     * Determine whether the user can delete the branch.
     *
     * @param  App\User  $user
     * @param  App\Branch  $branch
     * @return mixed
     */
    public function delete(User $user, Branch $branch)
    {
        //
    }
}
