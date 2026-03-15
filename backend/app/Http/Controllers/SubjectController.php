<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use App\Models\Department;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    /**
     * Get all subjects.
     */
    public function index(Request $request)
    {
        if (!$request->user()->isDean()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return Subject::all();
    }

    /**
     * Store a new subject.
     */
    public function store(Request $request)
    {
        if (!$request->user()->isDean()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'subject_code' => 'required|string|unique:subjects',
            'subject_name' => 'required|string',
        ]);

        $department = Department::firstOrCreate(['department_name' => 'College of Computing Studies']);

        $subject = Subject::create([
            'subject_code' => $validated['subject_code'],
            'subject_name' => $validated['subject_name'],
            'department_id' => $department->id,
        ]);

        return response()->json($subject, 201);
    }
}
