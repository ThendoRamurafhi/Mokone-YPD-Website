import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center min-h-64">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-700 rounded-full animate-spin"></div>
        <p className="text-emerald-700 font-semibold">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;