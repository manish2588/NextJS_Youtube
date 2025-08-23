"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoHomeOutline, IoPersonCircleOutline } from "react-icons/io5";
import { SiYoutubeshorts } from "react-icons/si";
import { IconType } from "react-icons";

// Define the type for navigation items
interface NavigationItem {
  href: string;
  label: string;
  icon: IconType;
  match: (pathname: string) => boolean;
}

export default function BottomTabBar() {
  const pathname = usePathname();

  const items: NavigationItem[] = [
    { 
      href: "/", 
      label: "Home", 
      icon: IoHomeOutline, 
      match: (p: string) => p === "/" 
    },
    {
      href: "/shorts",
      label: "Shorts",
      icon: SiYoutubeshorts,
      match: (p: string) => p.startsWith("/shorts"),
    },
    {
      href: "/profile",
      label: "Profile",
      icon: IoPersonCircleOutline,
      match: (p: string) => p.startsWith("/profile"),
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-gray-200 bg-white backdrop-blur supports-[backdrop-filter]:bg-white dark:border-gray-800 dark:bg-gray-900/90 dark:supports-[backdrop-filter]:bg-gray-900/70"
      role="navigation"
      aria-label="Bottom navigation"
    >
      {/* Safe area spacer for iOS */}
      <div className="pb-[env(safe-area-inset-bottom)]">
        <ul className="mx-auto flex max-w-screen-sm items-stretch justify-around px-2 py-1">
          {items.map(({ href, label, icon: Icon, match }) => {
            const active = match(pathname || "/");
            return (
              <li key={href} className="flex-1">
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "group mx-auto flex w-full max-w-[120px] flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                    active
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white",
                  ].join(" ")}
                >
                  <Icon
                    className={[
                      "h-5 w-5",
                      active
                        ? "scale-110"
                        : "opacity-90 group-hover:opacity-100",
                    ].join(" ")}
                    aria-hidden="true"
                  />
                  <span className="text-[11px] leading-tight">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}