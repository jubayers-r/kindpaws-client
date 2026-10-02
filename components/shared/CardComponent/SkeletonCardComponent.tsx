import React from "react";

export const SkeletonCardComponent = () => {
  return (
    <div
      className="bg-white rounded-3xl p-4 shadow-md w-full max-w-sm mx-auto space-y-4 animate-pulse"
      aria-busy="true"
      aria-label="Loading card"
    >
      <div className="w-full rounded-[2rem] border-2 border-dashed border-gray-300 bg-gray-200 h-52" />
      <div className="h-6 w-3/4 bg-gray-300 rounded-md" />
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <div className="h-4 w-16 bg-gray-300 rounded-md" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-12 bg-gray-300 rounded-md" />
        </div>
      </div>
      <div className="h-4 w-full bg-gray-300 rounded-md" />
      <div className="h-4 w-5/6 bg-gray-300 rounded-md" />
      <div className="flex justify-end">
        <div className="h-8 w-20 bg-gray-300 rounded-md" />
      </div>
    </div>
  );
};

export default SkeletonCardComponent;
