<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class FacultyController extends Controller
{
    /**
     * Get all faculty members (for Dean).
     */
    public function index(Request $request)
    {
        if (!$request->user()->isDean() && !$request->user()->isDepartmentChair() && !$request->user()->isSecretary()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return Faculty::with(['user', 'department', 'expertise', 'organizations', 'schedules.course', 'schedules.section'])->get();
    }

    /**
     * Store a new faculty member (for Secretary).
     */
    public function store(Request $request)
    {
        if (!$request->user()->isSecretary()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'middle_name' => 'nullable|string',
            'email' => 'required|email|unique:users,email',
            'department_id' => 'required|exists:departments,id',
            'position' => 'required|string',
            'password' => 'required|string|min:8',
        ]);

        return DB::transaction(function () use ($request) {
            $user = User::create([
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'faculty',
                'status' => 'active',
            ]);

            $faculty = Faculty::create([
                'user_id' => $user->id,
                'department_id' => $request->department_id,
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'middle_name' => $request->middle_name,
                'position' => $request->position,
            ]);

            return response()->json([
                'message' => 'Faculty member added successfully.',
                'faculty' => $faculty->load('user')
            ]);
        });
    }
}
