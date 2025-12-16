import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ size = "default", className = "", text = "Loading..." }) => {
  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-8 h-8",
    large: "w-12 h-12"
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <Loader2
        className={`${sizeClasses[size]} animate-spin text-primary`}
        aria-label="Loading"
      />
      {text && (
        <span className="mt-3 text-gray-500 font-medium animate-pulse">
          {text}
        </span>
      )}
    </div>
  );
};

export default Loader;
