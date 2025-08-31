<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ], [
            'name.required' => __('auth_messages.name_required'),
            'email.required' => __('auth_messages.email_required'),
            'email.email' => __('auth_messages.email_valid'),
            'email.unique' => __('auth_messages.email_unique'),
            'password.required' => __('auth_messages.password_required'),
            'password.min' => __('auth_messages.password_min'),
            'password.confirmed' => __('auth_messages.password_confirmed'),
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => __('auth_messages.validation_failed'),
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('register-token-' . now()->timestamp)->plainTextToken;

        return response()->json([
            'message' => __('auth_messages.register_success'),
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    /**
     * Login user
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ], [
            'email.required' => __('auth_messages.email_required'),
            'email.email' => __('auth_messages.email_valid'),
            'password.required' => __('auth_messages.password_required'),
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => __('auth_messages.validation_failed'),
                'errors' => $validator->errors()
            ], 422);
        }

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => __('auth_messages.invalid_credentials'),
            ], 422);
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Ensure we have a User instance with HasApiTokens trait
        if (!$user instanceof User) {
            return response()->json([
                'message' => __('auth_messages.authentication_failed'),
            ], 500);
        }

        $token = $user->createToken('login-token-' . now()->timestamp)->plainTextToken;

        return response()->json([
            'message' => __('auth_messages.login_success'),
            'user' => $user,
            'token' => $token,
        ], 200);
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => __('auth_messages.logout_success')
        ]);
    }

    /**
     * Get authenticated user
     */
    public function user(Request $request)
    {
        return response()->json([
            'user' => $request->user()
        ]);
    }
}
