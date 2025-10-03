'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

interface NavbarProps {
  title: string;
  showBackButton?: boolean;
  backButtonText?: string;
  onBackClick?: () => void;
  showSignOut?: boolean;
  onSignOut?: () => void;
  variant?: 'default' | 'dashboard';
}

export default function Navbar({
  title,
  showBackButton = false,
  backButtonText = '←',
  onBackClick,
  showSignOut = false,
  onSignOut,
  variant = 'default'
}: NavbarProps) {
  const router = useRouter();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.push('/dashboard');
    }
  };

  const handleSignOut = () => {
    if (onSignOut) {
      onSignOut();
    }
  };

  const navClasses = variant === 'dashboard' 
    ? "bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg border-b-2 border-blue-200"
    : "bg-white shadow border-b border-gray-300";

  const titleClasses = variant === 'dashboard'
    ? "text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
    : "text-xl font-bold text-gray-900";

  const signOutClasses = variant === 'dashboard'
    ? "flex items-center px-4 py-2 text-sm font-medium bg-white text-gray-700 border-2 border-blue-200 hover:border-blue-300 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
    : "flex items-center px-4 py-2 text-sm font-medium bg-white text-gray-700 border border-gray-300 hover:border-gray-400 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md";

  return (
    <nav className={navClasses}>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <button
                onClick={handleBackClick}
                className="text-sm font-semibold text-gray-600 hover:text-gray-900 
                         transition-colors cursor-pointer"
              >
                {backButtonText}
              </button>
            )}
            <h1 className={titleClasses}>
              {title}
            </h1>
          </div>
          
          {showSignOut && (
            <button
              onClick={handleSignOut}
              className={signOutClasses}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
