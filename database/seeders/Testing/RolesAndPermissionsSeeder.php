<?php

namespace Database\Seeders\Testing;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $role = Role::create(['guard_name' => 'admin', 'name' => 'Super Admin']);
        $permission = Permission::create(['guard_name' => 'admin', 'name' => 'all rights']);
        $role->givePermissionTo($permission);
        $permission->assignRole($role);
        Permission::create(['guard_name' => 'admin', 'name' => 'user.create']);
    }
}
