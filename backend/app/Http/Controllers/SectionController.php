<?php

namespace App\Http\Controllers;

use App\Models\Section;
use Illuminate\Http\Request;

class SectionController extends Controller
{
    /**
     * Get all sections.
     */
    public function index(Request $request)
    {
        if (!$request->user()->isDean() && !$request->user()->isFaculty()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return Section::with('course')->get();
    }
}
