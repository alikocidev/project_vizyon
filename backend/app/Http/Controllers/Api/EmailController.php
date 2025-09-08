<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class EmailController extends Controller
{

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
                    __('profile.invalid_request'),
                'success' => false
            ], 400);
        }

        try {
            $user->sendEmailVerificationNotification();

            return response()->json([
                'message' => __('profile.verification_email_sent'),
                'success' => true,
                'data' => [
                    'email' => $user->email,
                    'sent_at' => now()->toISOString()
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Email verification error: ' . $e->getMessage());
            return response()->json([
                'message' => __('profile.email_send_failed'),
                'success' => false,
                'error' => app()->environment('local') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Mark the authenticated user's email address as verified.
     */
    public function verifyEmail(Request $request, $id, $hash): JsonResponse
    {
        // ID'ye göre kullanıcıyı bul
        $user = \App\Models\User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'Kullanıcı bulunamadı',
                'verified' => false
            ], 404);
        }

        // Hash kontrolü
        if (!hash_equals($hash, sha1($user->getEmailForVerification()))) {
            return response()->json([
                'message' => 'Geçersiz doğrulama linki',
                'verified' => false
            ], 400);
        }

        // URL'nin geçerliliğini kontrol et (signed URL validation)
        if (!$request->hasValidSignature()) {
            return response()->json([
                'message' => 'Doğrulama linki süresi dolmuş veya geçersiz',
                'verified' => false
            ], 400);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => __('profile.email_already_verified'),
                'verified' => true
            ]);
        }

        if ($user->markEmailAsVerified()) {
            return response()->json([
                'message' => __('profile.email_verified_successfully'),
                'verified' => true,
                'user' => [
                    'id' => $user->id,
                    'email' => $user->email,
                    'email_verified_at' => $user->email_verified_at
                ]
            ]);
        }

        return response()->json([
            'message' => __('profile.email_verification_failed'),
            'verified' => false
        ], 400);
    }
}
