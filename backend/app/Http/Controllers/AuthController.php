<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string',
            'password' => 'required',
        ]);

        // Try login with email first, then student_number
        $user = User::where('email', $request->email)
            ->orWhere('student_number', $request->email)
            ->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Check if student has set their password
        if ($user->isStudent() && is_null($user->password_set_at)) {
            throw ValidationException::withMessages([
                'email' => ['Your account is not yet fully set up. Please check your email for the password setup link.'],
            ]);
        }

        return [
            'token' => $user->createToken('auth_token')->plainTextToken,
            'user' => $user,
        ];
    }

    public function setupPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::where('email', $request->email)
            ->where('password_setup_token', $request->token)
            ->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'email' => ['Invalid password setup link or email.'],
            ]);
        }

        return DB::transaction(function () use ($request, $user) {
            $user->update([
                'password' => Hash::make($request->password),
                'password_set_at' => now(),
                'password_setup_token' => null,
            ]);

            // Also update student status to active
            if ($user->student) {
                $user->student->update(['status' => 'active']);
            }

            return response()->json(['message' => 'Password has been set successfully. You can now login.']);
        });
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }
}
