<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Dean
        User::factory()->create([
            'name' => 'Dr. Maria Santos',
            'email' => 'dean@example.com',
            'password' => bcrypt('password'),
            'role' => 'dean',
        ]);

        // Create Faculty
        User::factory()->create([
            'name' => 'Prof. Juan Dela Cruz',
            'email' => 'faculty@example.com',
            'password' => bcrypt('password'),
            'role' => 'faculty',
        ]);
    }
}
