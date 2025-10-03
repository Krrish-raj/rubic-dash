'use client';

import {  Briefcase, Users, TrendingUp } from 'lucide-react';

interface ProfileCardProps {
  name: string;
  tag: string;
  age?: number;
  employmentType?: string;
  dependents?: number;
  isSelected: boolean;
  onClick: () => void;
  isNone?: boolean;
}

export default function ProfileCard({
  name,
  tag,
  age,
  employmentType,
  dependents,
  isSelected,
  onClick,
  isNone = false,
}: ProfileCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        p-3.5 rounded-lg transition-all duration-300 cursor-pointer
        bg-white
        hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]
        ${
          isSelected
            ? 'ring-2 ring-cyan-500 shadow-xl border-2 border-cyan-400'
            : 'border border-gray-200 shadow-md hover:border-cyan-300'
        }
      `}
    >
      <div className="flex flex-col h-full items-center text-center">
        

        {/* Name */}
          <h3
            className={`
            text-xs font-bold mb-1 transition-colors line-clamp-1 w-full
            ${
              isSelected
                ? 'text-cyan-700'
                : 'text-gray-700'
            }
          `}
          >
            {name}
          </h3>

          {/* Tag */}
          <p className="text-[9px] text-gray-500 mb-2 capitalize line-clamp-1 font-medium">
            {tag.replace(/_/g, ' ')}
          </p>

          {/* Divider */}
          {!isNone && (
            <div className="w-full h-px bg-cyan-200 mb-2" />
          )}

          {/* Details */}
          {!isNone && (
            <div className="space-y-1 mt-auto w-full bg-cyan-50 rounded-lg p-2 border border-cyan-100">
              {age && (
                <div className="flex items-center justify-center text-[9px] text-gray-600 font-medium">
                  <TrendingUp className="w-2.5 h-2.5 mr-1 flex-shrink-0 text-cyan-500" />
                  <span>Age: {age}</span>
                </div>
              )}
              {employmentType && (
                <div className="flex items-center justify-center text-[9px] text-gray-600 font-medium">
                  <Briefcase className="w-2.5 h-2.5 mr-1 flex-shrink-0 text-cyan-500" />
                  <span className="capitalize truncate">{employmentType.replace(/_/g, ' ')}</span>
                </div>
              )}
              {dependents !== undefined && (
                <div className="flex items-center justify-center text-[9px] text-gray-600 font-medium">
                  <Users className="w-2.5 h-2.5 mr-1 flex-shrink-0 text-cyan-500" />
                  <span>Dep: {dependents}</span>
                </div>
              )}
            </div>
          )}
      </div>
    </div>
  );
}

