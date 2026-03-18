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
        // Create Secretary
        User::factory()->create([
            'name' => 'Maria Clara Reyes',
            'email' => 'secretary@example.com',
            'password' => bcrypt('password'),
            'role' => 'secretary',
            'password_set_at' => now(), // ← add this
        ]);
        // Create Department Chair
        User::factory()->create([
            'name' => 'Dr. Roberto Aquino',
            'email' => 'chair@example.com',
            'password' => bcrypt('password'),
            'role' => 'chair',
            'password_set_at' => now(),
        ]);
    }
}
