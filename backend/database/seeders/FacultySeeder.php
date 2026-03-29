<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Faculty;
use App\Models\FacultyExpertise;
use App\Models\Department;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class FacultySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $dept = Department::first() ?? Department::create(['department_name' => 'College of Computing Studies']);

        $facultyData = [
            [
                'first_name' => 'Juan',
                'last_name' => 'Dela Cruz',
                'middle_name' => 'Reyes',
                'position' => 'Assistant Professor',
                'expertise' => 'Web Development',
                'category' => 'Technical'
            ],
            [
                'first_name' => 'Maria',
                'last_name' => 'Santos',
                'middle_name' => 'Garcia',
                'position' => 'Instructor',
                'expertise' => 'Data Science',
                'category' => 'Technical'
            ],
            [
                'first_name' => 'Jose',
                'last_name' => 'Reyes',
                'middle_name' => 'Cruz',
                'position' => 'Associate Professor',
                'expertise' => 'Network Security',
                'category' => 'Technical'
            ],
            [
                'first_name' => 'Elena',
                'last_name' => 'Garcia',
                'middle_name' => 'Mendoza',
                'position' => 'Instructor',
                'expertise' => 'Mobile App Development',
                'category' => 'Technical'
            ],
            [
                'first_name' => 'Ricardo',
                'last_name' => 'Mendoza',
                'middle_name' => 'Bautista',
                'position' => 'Professor',
                'expertise' => 'Artificial Intelligence',
                'category' => 'Technical'
            ],
            [
                'first_name' => 'Carmela',
                'last_name' => 'Bautista',
                'middle_name' => 'Torres',
                'position' => 'Instructor',
                'expertise' => 'Software Engineering',
                'category' => 'Technical'
            ],
            [
                'first_name' => 'Antonio',
                'last_name' => 'Torres',
                'middle_name' => 'Lim',
                'position' => 'Assistant Professor',
                'expertise' => 'Database Management',
                'category' => 'Technical'
            ],
            [
                'first_name' => 'Leticia',
                'last_name' => 'Lim',
                'middle_name' => 'Tan',
                'position' => 'Instructor',
                'expertise' => 'UI/UX Design',
                'category' => 'Technical'
            ],
            [
                'first_name' => 'Ferdinand',
                'last_name' => 'Tan',
                'middle_name' => 'Lopez',
                'position' => 'Associate Professor',
                'expertise' => 'Cloud Computing',
                'category' => 'Technical'
            ],
            [
                'first_name' => 'Imelda',
                'last_name' => 'Lopez',
                'middle_name' => 'Perez',
                'position' => 'Instructor',
                'expertise' => 'Cybersecurity',
                'category' => 'Technical'
            ],
            [
                'first_name' => 'Gregorio',
                'last_name' => 'Perez',
                'middle_name' => 'Dizon',
                'position' => 'Assistant Professor',
                'expertise' => 'Game Development',
                'category' => 'Technical'
            ],
        ];

        foreach ($facultyData as $index => $data) {
            $email = strtolower($data['first_name'] . '.' . $data['last_name'] . '@example.com');
            
            // Create User
            $user = User::create([
                'email' => $email,
                'password' => Hash::make('password'),
                'role' => 'faculty',
                'status' => 'active',
                'password_set_at' => now(),
            ]);

            // Create Faculty
            $faculty = Faculty::create([
                'user_id' => $user->id,
                'department_id' => $dept->id,
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'middle_name' => $data['middle_name'],
                'position' => $data['position'],
                'gender' => $index % 2 == 0 ? 'Male' : 'Female',
                'civil_status' => 'Single',
                'contact_number' => '0917' . str_pad($index, 7, '0', STR_PAD_LEFT),
                'address' => 'Philippines',
            ]);

            // Create Expertise
            FacultyExpertise::create([
                'faculty_id' => $faculty->id,
                'skillName' => $data['expertise'],
                'skill_category' => $data['category'],
            ]);
        }
    }
}
