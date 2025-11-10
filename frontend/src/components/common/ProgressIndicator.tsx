import React from 'react';

interface ProgressIndicatorProps {
  progress: number;
  stage?: string;
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  progress,
  stage,
  className = '',
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {stage && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">{stage}</span>
          <span className="text-sm text-gray-500">{progress}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-primary-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};