"use client";

export default function CardShimmer() {
  return (
    <div className="w-full animate-pulse">
      {/* Thumbnail placeholder */}
      <div className="relative w-full h-48 lg:h-58 bg-gray-300 rounded-xl mb-3"></div>

      {/* Channel info placeholder */}
      <div className="flex gap-3 items-center">
        <div className="w-10 h-10 rounded-full bg-gray-300"></div>
        <div className="flex-1 space-y-2 py-1">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          <div className="h-3 bg-gray-300 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  );
}
