"use client";

export default function StaticContentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
     
      <div className="flex-1 bg-gray-50 min-h-screen overflow-y-auto transition-all duration-300">
        {children}
      </div>
    </>
  );
}
