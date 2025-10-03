'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Chrome, Loader2 } from 'lucide-react';
import { signup, signInWithGoogle } from '../login/actions';

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    await signup(formData);
    
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
        {/* Signup Card */}
        <div className="bg-white  rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900  mb-2">
              Create Account
            </h1>
            <p className="text-gray-600 ">
              Start managing your finances today
            </p>
          </div>

          {/* Signup Form */}
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
                className="w-full px-4 py-3 rounded-lg border border-gray-300 border-gray-600 
                         bg-white  text-gray-900                          focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all duration-200 outline-none
                         placeholder: placeholder:text-gray-500"
                placeholder="you@example.com"
              />
            </div>

            {/* Password Field */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700  mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 border-gray-600 
                         bg-white  text-gray-900                          focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all duration-200 outline-none
                         placeholder: placeholder:text-gray-500"
                placeholder="••••••••"
              />
              <p className="mt-1 text-xs text-gray-500 ">
                Must be at least 6 characters
              </p>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="w-4 h-4 mt-0.5 rounded border-gray-300 text-blue-600 
                         focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <label 
                htmlFor="terms" 
                className="ml-2 text-sm text-gray-700  cursor-pointer"
              >
                I agree to the{' '}
                <Link 
                  href="/terms" 
                  className="text-blue-600  hover:text-blue-700 
hover:text-blue-300 transition-colors duration-200"
                >
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link 
                  href="/privacy" 
                  className="text-blue-600  hover:text-blue-700 
hover:text-blue-300 transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
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
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white  text-gray-500 ">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Signup Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 
border-gray-600 rounded-lg hover:bg-gray-50 hover:                     transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* Login Link */}
          <p className="mt-8 text-center text-sm text-gray-600 ">
            Already have an account?{' '}
            <Link 
              href="/login" 
              className="font-medium text-blue-600  hover:text-blue-700 
hover:text-blue-300 transition-colors duration-200"
            >
              Sign in
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

