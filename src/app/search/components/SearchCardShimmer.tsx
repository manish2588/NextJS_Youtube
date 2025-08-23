"use client";
import React from "react";

export default function SearchCardShimmer() {
  return (
    <div className="flex space-x-1 lg:space-x-4 max-w-screen rounded-md overflow-hidden animate-pulse">
      {/* Thumbnail Shimmer */}
      <div className="w-1/2 md:w-4/10 h-54 lg:h-72 bg-gray-300 rounded-md flex-shrink-0" />

      {/* Details Shimmer */}
      <div className="w-1/2 md:w-6/10 h-54 lg:h-72 flex flex-col space-y-2 p-2 flex-1">
        <div className="h-5 bg-gray-300 rounded w-5/6" /> {/* Title */}
        <div className="h-4 bg-gray-300 rounded w-3/6" /> {/* Channel Name */}
        <div className="flex space-x-2">
          <div className="h-3 bg-gray-300 rounded w-2/6" /> {/* Views */}
          <div className="h-3 bg-gray-300 rounded w-2/6" /> {/* Date */}
        </div>
        <div className="flex space-x-2">
          <div className="h-3 bg-gray-300 rounded w-1/4" /> {/* Likes */}
        </div>
        <div className="h-10 bg-gray-300 rounded w-full mt-1" /> {/* Description */}
      </div>
    </div>
  );
}
