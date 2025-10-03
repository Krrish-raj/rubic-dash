'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Suspense } from 'react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message') || 'An unexpected error occurred';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 from-gray-900 to-gray-950">
      <div className="w-full max-w-md">
        {/* Error Card */}
        <div className="bg-white  rounded-2xl shadow-xl p-8 transition-all duration-300">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-100 bg-red-900/20 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600 text-red-400" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900  mb-2">
              Authentication Error
            </h1>
            <p className="text-gray-600 text-gray-400">
              {message}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/login"
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 
                       hover:bg-blue-700  font-medium rounded-lg 
                       transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
                       shadow-lg hover:shadow-xl"
            >
              Try Again
            </Link>

            <Link
              href="/"
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 
border-gray-600 rounded-lg hover:bg-gray-50 hover:bg-gray-700
                       text-gray-700  font-medium transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go to Home
            </Link>
          </div>

          {/* Help Text */}
          <div className="mt-8 p-4 bg-gray-50 bg-gray-700/50 rounded-lg">
            <p className="text-sm text-gray-600 text-gray-400">
              <strong className="font-medium text-gray-900 ">
                Need help?
              </strong>
              <br />
              If you continue to experience issues, please check your email for a confirmation link
              or contact support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 from-gray-900 to-gray-950">
        <div className="text-gray-600 text-gray-400">Loading...</div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}

