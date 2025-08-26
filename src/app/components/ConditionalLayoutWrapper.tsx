"use client";

import { usePathname } from "next/navigation";
import StaticSidebar from "./StaticSidebar";
import StaticContentWrapper from "./StaticContentWrapper";

export default function ConditionalLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  if (isHomePage) {
    // Home page - no static sidebar, let the page handle its own sidebar
    return <>{children}</>;
  }

  // Other pages - wrap with static sidebar
  return (
    <div className="flex">
      <StaticSidebar />
      <StaticContentWrapper>
        {children}
      </StaticContentWrapper>
    </div>
  );
}