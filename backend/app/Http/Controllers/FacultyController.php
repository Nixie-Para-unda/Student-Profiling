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
        if (!$request->user()->isDean()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return Faculty::with(['user', 'subjectLoads.subject', 'subjectLoads.section'])->get();
    }

    /**
     * Store a new faculty member (for Dean).
     */
    public function store(Request $request)
    {
        if (!$request->user()->isDean()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'email' => 'required|email|unique:users,email|unique:faculty,email',
            'department_id' => 'required|exists:departments,id',
            'position' => 'required|string',
            'status' => 'required|string',
            'password' => 'required|string|min:8',
        ]);

        return DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->first_name . ' ' . $request->last_name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'faculty',
            ]);

            $faculty = Faculty::create([
                'user_id' => $user->id,
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'department_id' => $request->department_id,
                'position' => $request->position,
                'status' => $request->status,
            ]);

            return response()->json([
                'message' => 'Faculty member added successfully.',
                'faculty' => $faculty->load('user')
            ]);
        });
    }
}
