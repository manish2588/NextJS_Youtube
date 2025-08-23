// app/components/RouteLoader.tsx
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const RouteLoader: React.FC = () => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [currentPath, setCurrentPath] = useState(pathname);

  useEffect(() => {
    if (pathname !== currentPath) {
      setLoading(true);

      // simulate end of loading after next render
      const timer = setTimeout(() => {
        setLoading(false);
        setCurrentPath(pathname);
      }, 200); // adjust delay as needed

      return () => clearTimeout(timer);
    }
  }, [pathname, currentPath]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-blue-500 animate-pulse z-[999]" />
  );
};

export default RouteLoader;
