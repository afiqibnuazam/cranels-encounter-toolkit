<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    // Register API
    public function register(Request $request)
    {
       $data = $request->validate([
            'name'      => 'required|string|max:255',
            'email'     => 'required|string|email|max:255|unique:users',
            'password'  => 'required|string|min:8|confirmed',
       ]);

       User::create($data);

       return response()->json([
            'status' => true,
            'message' => 'User registered successfully',
       ]);
    }

    // Login API
    public function login(Request $request){
        $request->validate([
            'email'     => 'required|string|email|max:255',
            'password'  => 'required|string|min:8',
        ]);

        if(!Auth::attempt($request->only('email', 'password'))){
            return response()->json([
                'status' => false,
                'message' => 'Invalid credentials',
            ]);
        }

        /**
         * @var \App\Models\User $user
         */
        $user = Auth::user();
        
        $token = $user->createToken('auth_token')->accessToken;

        return response()->json([
            'status' => true,
            'message' => 'User logged in successfully',
            'token' => $token,
        ]);
    }


    // Profile API
    public function profile(){
        $user = Auth::user();

        return response()->json([
            'status' => true,
            'message' => 'User profile retrieved successfully',
            'data' => $user,
        ]);
    }


    // Logout API
    public function logout(){
        Auth::logout();

        return response()->json([
            'status' => true,
            'message' => 'User logged out successfully',
        ]);
    }
}
