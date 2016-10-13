<?php

namespace App\Policies;

use App\User;
use App\Company;
use Illuminate\Auth\Access\HandlesAuthorization;

class CompanyPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view the company.
     *
     * @param  App\User  $user
     * @param  App\Company  $company
     * @return mixed
     */
    public function view(User $user, Company $company)
    {
        //
    }

    /**
     * Determine whether the user can create companies.
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
     * Determine whether the user can update the company.
     *
     * @param  App\User  $user
     * @param  App\Company  $company
     * @return mixed
     */
    public function update(User $user, Company $company)
    {
        //
    }

    /**
     * Determine whether the user can delete the company.
     *
     * @param  App\User  $user
     * @param  App\Company  $company
     * @return mixed
     */
    public function delete(User $user, Company $company)
    {
        //
    }
}
