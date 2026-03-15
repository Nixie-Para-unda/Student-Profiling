<?php

namespace App\Http\Controllers;

use App\Models\SubjectLoad;
use Illuminate\Http\Request;

class SubjectLoadController extends Controller
{
    /**
     * Store a new subject assignment for a faculty member.
     */
    public function store(Request $request)
    {
        if (!$request->user()->isDean()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'faculty_id' => 'required|exists:faculty,id',
            'subject_id' => 'required|exists:subjects,id',
            'section_id' => 'required|exists:sections,id',
            'schedule' => 'nullable|string',
        ]);

        // Check if this assignment already exists
        $exists = SubjectLoad::where([
            'subject_id' => $validated['subject_id'],
            'section_id' => $validated['section_id'],
        ])->exists();

        if ($exists) {
            return response()->json(['message' => 'This subject is already assigned to this section.'], 422);
        }

        $load = SubjectLoad::create($validated);

        return response()->json([
            'message' => 'Subject assigned successfully.',
            'data' => $load->load(['subject', 'section'])
        ], 201);
    }

    /**
     * Remove a subject assignment.
     */
    public function destroy(Request $request, $id)
    {
        if (!$request->user()->isDean()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $load = SubjectLoad::findOrFail($id);
        $load->delete();

        return response()->json(['message' => 'Assignment removed successfully.']);
    }
}
