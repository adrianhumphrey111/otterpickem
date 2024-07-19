import React from 'react';

const LoadingCard: React.FC = () => {
  return (
    <article className="w-full max-w-sm mx-auto mb-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200 animate-pulse">
      <div className="grid grid-cols-3 gap-2 items-center mb-2">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 bg-gray-300 rounded-full mb-1"></div>
          <div className="h-4 bg-gray-300 rounded w-20"></div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="h-6 bg-gray-300 rounded w-6 mb-1"></div>
          <div className="h-3 bg-gray-300 rounded w-12"></div>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 bg-gray-300 rounded-full mb-1"></div>
          <div className="h-4 bg-gray-300 rounded w-20"></div>
        </div>
      </div>
      <div className="h-3 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
      <div className="h-16 bg-gray-300 rounded mb-3"></div>
      <div className="flex justify-center">
        <div className="h-8 bg-gray-300 rounded-full w-32"></div>
      </div>
    </article>
  );
};

export default LoadingCard;
