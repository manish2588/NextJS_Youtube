"use client";

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export default function ContentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const isSidebarOpen = useSelector(
    (state: RootState) => state.layout.isSidebarOpen
  );

  return (
    <div
      className={`flex-1 bg-gray-50 min-h-screen overflow-y-auto transition-all duration-300
      ${isSidebarOpen ? "lg:ml-60" : "lg:ml-20"} ml-0`}
    >
      {children}
    </div>
  );
}
