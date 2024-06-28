import React from "react";

const LoadingOverlay: React.FC = () => {
  return (
    <div className="flex flex-col top-0 min-h-screen w-full backdrop-blur-sm items-center justify-center text-center text-white fixed z-50">
      Loading...
    </div>
  );
};

export default LoadingOverlay;
