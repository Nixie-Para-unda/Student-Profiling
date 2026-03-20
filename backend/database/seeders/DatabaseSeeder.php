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
        // Create Department
        $dept = \App\Models\Department::create(['department_name' => 'College of Computing Studies']);

        // Create Program
        $program = \App\Models\Program::create([
            'department_id' => $dept->id,
            'program_code' => 'BSIT',
            'program_name' => 'Bachelor of Science in Information Technology'
        ]);

        // Create Section
        $section = \App\Models\Section::create([
            'department_id' => $dept->id,
            'program_id' => $program->id,
            'section_name' => 'BSIT 4-A',
            'year_level' => '4',
            'school_year' => '2026-2027'
        ]);

        // Create Dean
        User::create([
            'email' => 'dean@example.com',
            'password' => bcrypt('password'),
            'role' => 'dean',
            'status' => 'active',
            'password_set_at' => now(),
        ]);

        // Create Department Chair
        User::create([
            'email' => 'chair@example.com',
            'password' => bcrypt('password'),
            'role' => 'department_chair',
            'status' => 'active',
            'password_set_at' => now(),
        ]);

        // Create Secretary
        User::create([
            'email' => 'secretary@example.com',
            'password' => bcrypt('password'),
            'role' => 'secretary',
            'status' => 'active',
            'password_set_at' => now(),
        ]);

        // Create Faculty
        $facultyUser = User::create([
            'email' => 'faculty@example.com',
            'password' => bcrypt('password'),
            'role' => 'faculty',
            'status' => 'active',
            'password_set_at' => now(),
        ]);

        \App\Models\Faculty::create([
            'user_id' => $facultyUser->id,
            'department_id' => $dept->id,
            'first_name' => 'Prof.',
            'last_name' => 'Faculty',
            'position' => 'Instructor'
        ]);

        // Create Student
        $studentUser = User::create([
            'email' => 'student@example.com',
            'student_number' => '2022-0001',
            'password' => bcrypt('password'),
            'role' => 'student',
            'status' => 'active',
            'password_set_at' => now(),
        ]);

        \App\Models\Student::create([
            'user_id' => $studentUser->id,
            'program_id' => $program->id,
            'section_id' => $section->id,
            'first_name' => 'Juan',
            'last_name' => 'Dela Cruz',
        ]);

        // Create Organizations
        \App\Models\UniversityOrganization::create([
            'organization_name' => 'ICPEP.SE',
            'organization_type' => 'Academic',
            'description' => 'Institute of Computer Engineers of the Philippines Student Edition'
        ]);

        \App\Models\UniversityOrganization::create([
            'organization_name' => 'GDSC',
            'organization_type' => 'Technical',
            'description' => 'Google Developer Student Clubs'
        ]);
    }
}
