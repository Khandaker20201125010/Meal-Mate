import React from 'react';

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="relative flex flex-col items-center space-y-4">
        {/* Plate */}
        <div className="w-24 h-24 rounded-full border-8 border-yellow-400 animate-spin-slow"></div>

        {/* Fork and Spoon */}
        <div className="flex space-x-6">
          <div className="w-6 h-12 bg-gray-300 rounded-t-full animate-bounce" />
          <div className="w-6 h-12 bg-gray-300 rounded-t-full animate-bounce delay-200" />
        </div>

        {/* Loading Text */}
        <p className="text-lg font-semibold text-gray-700 animate-pulse">
          Preparing your meal...
        </p>
      </div>
    </div>
  );
};

export default Loading;
