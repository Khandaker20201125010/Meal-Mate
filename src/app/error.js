'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ErrorPage = ({ error, reset }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-xl w-full shadow-md">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="h-12 w-12 text-red-500" />
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-red-600 mb-3">Something went wrong</h1>
        <p className="text-gray-700 mb-6 text-sm md:text-base leading-relaxed">
          {error?.message || "An unexpected error occurred. Please try again or contact support if the issue persists."}
        </p>
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
