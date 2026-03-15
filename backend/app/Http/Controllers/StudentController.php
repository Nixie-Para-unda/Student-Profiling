<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\User;
use App\Models\Section;
use App\Models\Course;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;

class StudentController extends Controller
{
    /**
     * Activate student account.
     */
    public function activate(Request $request)
    {
        $request->validate([
            'student_number' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|string|min:8',
        ]);

        $student = Student::where('student_number', $request->student_number)
            ->where('email', $request->email)
            ->first();

        if (!$student) {
            throw ValidationException::withMessages([
                'student_number' => ['Invalid student number or email address.'],
            ]);
        }

        if ($student->user_id) {
            throw ValidationException::withMessages([
                'student_number' => ['Account is already activated. Please login instead.'],
            ]);
        }

        return DB::transaction(function () use ($request, $student) {
            $user = User::create([
                'name' => $student->first_name . ' ' . $student->last_name,
                'email' => $student->email,
                'password' => Hash::make($request->password),
                'role' => 'student',
            ]);

            $student->update([
                'user_id' => $user->id,
                'status' => 'active',
            ]);

            return response()->json([
                'message' => 'Account activated successfully.',
                'user' => $user
            ]);
        });
    }

    /**
     * Get the authenticated student's profile.
     */
    public function profile(Request $request)
    {
        $user = $request->user();
        
        if (!$user->isStudent()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return $user->student()->with(['section.course'])->first();
    }

    /**
     * Update student profile (nullable fields).
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();
        
        if (!$user->isStudent()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $student = $user->student;

        $validated = $request->validate([
            'middle_name' => 'nullable|string',
            'gender' => 'nullable|string',
            'birthdate' => 'nullable|date',
            'civil_status' => 'nullable|string',
            'contact_number' => 'nullable|string',
            'address' => 'nullable|string',
        ]);

        $student->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully.',
            'student' => $student->load('section.course')
        ]);
    }

    /**
     * Import students from CSV.
     */
    public function import(Request $request)
    {
        if (!$request->user()->isDean()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'file' => 'required|file|mimes:csv,txt',
        ]);

        $file = $request->file('file');
        
        // Handle line endings
        ini_set('auto_detect_line_endings', true);
        
        $handle = fopen($file->getRealPath(), 'r');
        
        // Skip header
        fgetcsv($handle);

        $imported = 0;
        $errors = [];
        $row = 2; // Start from row 2 (after header)

        while (($data = fgetcsv($handle)) !== FALSE) {
            // Skip empty rows
            if (empty($data) || (count($data) === 1 && empty($data[0]))) {
                continue;
            }

            try {
                // Check if we have enough columns (at least 5 for basic info)
                if (count($data) < 5) {
                    throw new \Exception("Insufficient columns. Expected at least 5 (student_number, first_name, last_name, middle_name, email). Found " . count($data));
                }

                // student_number,first_name,last_name,middle_name,email,course,year,section
                $studentNumber = trim($data[0]);
                $firstName = trim($data[1]);
                $lastName = trim($data[2]);
                $middleName = isset($data[3]) ? trim($data[3]) : null;
                $email = trim($data[4]);
                
                $courseCode = isset($data[5]) ? trim($data[5]) : null;
                $year = isset($data[6]) ? trim($data[6]) : null;
                $sectionChar = isset($data[7]) ? trim($data[7]) : null;
                
                $sectionId = null;
                if ($courseCode && $year && $sectionChar) {
                    // Ensure default department exists (College of Computing Studies)
                    $department = Department::firstOrCreate(
                        ['department_name' => 'College of Computing Studies']
                    );

                    // Find or create course first (e.g., BSIT)
                    $course = Course::firstOrCreate(
                        ['course_code' => $courseCode],
                        [
                            'course_name' => $courseCode === 'BSIT' ? 'Bachelor of Science in Information Technology' : 'Bachelor of Science in Computer Science',
                            'department_id' => $department->id
                        ]
                    );

                    // Find or create section (e.g., BSIT 1-A)
                    $sectionName = "$courseCode $year-$sectionChar";
                    $section = Section::firstOrCreate(
                        ['section_name' => $sectionName],
                        [
                            'year_level' => $year,
                            'school_year' => '2026-2027',
                            'course_id' => $course->id
                        ]
                    );
                    $sectionId = $section->id;
                }

                // Check for existing student
                if (Student::where('student_number', $studentNumber)->exists()) {
                    throw new \Exception("Student number $studentNumber already exists.");
                }
                if (Student::where('email', $email)->exists()) {
                    throw new \Exception("Email $email already exists.");
                }

                Student::create([
                    'student_number' => $studentNumber,
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'middle_name' => $middleName,
                    'email' => $email,
                    'section_id' => $sectionId,
                    'status' => 'pending',
                ]);
                $imported++;
            } catch (\Exception $e) {
                $errors[] = "Row $row: " . $e->getMessage();
            }
            $row++;
        }

        fclose($handle);

        $message = "Successfully imported $imported students.";
        if (count($errors) > 0) {
            $message .= " (" . count($errors) . " errors encountered)";
        }

        return response()->json([
            'message' => $message,
            'imported_count' => $imported,
            'errors' => $errors
        ]);
    }

    /**
     * Get all students (for Dean).
     */
    public function index(Request $request)
    {
        if (!$request->user()->isDean()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return Student::with('section')->get();
    }
}
