'use client';

import { X, AlertCircle } from 'lucide-react';
import Card from './Card';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  profileName: string;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  profileName,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <Card className="relative max-w-md w-full p-6 animate-in zoom-in-95 duration-200 bg-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 
hover: transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-blue-100 bg-blue-900/30 rounded-full flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-blue-600 text-blue-400" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900  mb-2">
            Switch to {profileName}?
          </h3>
          <p className="text-sm text-gray-600 text-gray-400">
            Your current field values will be replaced with the data from this profile. 
            This action cannot be undone. Are you sure you want to continue?
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 border-gray-600 
                     text-gray-700  font-medium rounded-lg
                     hover:bg-gray-50 hover:bg-gray-700 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700                      font-medium rounded-lg transition-all duration-200
                     transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
          >
            Confirm
          </button>
        </div>
      </Card>
    </div>
  );
}

