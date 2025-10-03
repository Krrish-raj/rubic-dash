'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Chrome, Loader2 } from 'lucide-react';
import { login, signInWithGoogle } from './actions';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    await login(formData);
    
    // Note: The redirect will happen in the action
    // This line won't be reached if successful
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    await signInWithGoogle();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 from-gray-900 to-gray-950">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white  rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900  mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 ">
              Sign in to your account
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-700  mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300                          bg-white  text-gray-900                          focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all duration-200 outline-none
                         placeholder: "
                placeholder="you@example.com"
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-gray-700 "
                >
                  Password
                </label>
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-blue-600  hover:text-blue-700 
hover:text-blue-300 transition-colors duration-200"
                >
                  Forgot?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300                          bg-white  text-gray-900                          focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all duration-200 outline-none
                         placeholder: "
                placeholder="••••••••"
              />
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-blue-600 
                         focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <label 
                htmlFor="remember" 
                className="ml-2 text-sm text-gray-700  cursor-pointer"
              >
                Remember me for 30 days
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700  font-medium 
                       py-3 px-4 rounded-lg transition-all duration-200 
                       transform hover:scale-[1.02] active:scale-[0.98]
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                       shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 " />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 " />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white  text-gray-500 ">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 
 rounded-lg hover:bg-gray-50 hover:                     transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-5 h-5 mr-2 text-gray-700  animate-spin" />
            ) : (
              <Chrome className="w-5 h-5 mr-2 text-gray-700 " />
            )}
            <span className="text-sm font-medium text-gray-700 ">
              Continue with Google
            </span>
          </button>

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-sm text-gray-600 ">
            Don&apos;t have an account?{' '}
            <Link 
              href="/signup" 
              className="font-medium text-blue-600  hover:text-blue-700 
hover:text-blue-300 transition-colors duration-200"
            >
              Sign up for free
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-gray-500 ">
          Protected by industry-standard encryption
        </p>
      </div>
    </div>
  );
}
