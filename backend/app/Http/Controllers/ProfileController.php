<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    /**
     * Display the user's profile information.
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'user' => $user,
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'emailVerified' => $user->email_verified_at !== null,
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): JsonResponse
    {
        $user = $request->user();
        $user->fill($request->validated());

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return response()->json([
            'message' => __('profile.updated_successfully'),
            'user' => $user,
        ]);
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): JsonResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();
        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => __('profile.account_deleted'),
        ]);
    }

    /**
     * Send a verification email to the user.
     */
    public function sendVerificationEmail(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user || $user->email_verified_at) {
            return response()->json([
                'message' => $user->email_verified_at ? 
                    __('profile.email_already_verified') : 
                    __('profile.invalid_request')
            ], 400);
        }

        $user->sendEmailVerificationNotification();

        return response()->json([
            'message' => __('profile.verification_email_sent'), 
            'status' => 'success'
        ]);
    }

    /**
     * Mark the authenticated user's email address as verified.
     */
    public function verifyEmail(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => __('profile.email_already_verified'),
                'verified' => true
            ]);
        }

        if ($user->markEmailAsVerified()) {
            return response()->json([
                'message' => __('profile.email_verified_successfully'),
                'verified' => true
            ]);
        }

        return response()->json([
            'message' => __('profile.email_verification_failed'),
            'verified' => false
        ], 400);
    }
}
