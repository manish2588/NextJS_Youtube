"use client";

import { FaYoutube } from "react-icons/fa";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black/50">
      {/* YouTube logo */}
      <FaYoutube className="text-red-600 text-3xl mb-4 animate-pulse" />

      {/* Jumping small square */}
      <div className="flex space-x-1">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 bg-black/80 rounded-sm animate-bounce`}
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}
