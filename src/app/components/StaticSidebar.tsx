"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setCategory } from "../redux/slices/categorySlice";
import { CATEGORY_IDS } from "../utils/fetchVideos";
import {
  FaHome,
  FaGamepad,
  FaMusic,
  FaFilm,
  FaNewspaper,
} from "react-icons/fa";
import { IconType } from "react-icons";
import { SiYoutubeshorts } from "react-icons/si";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { MdOutlineSubscriptions } from "react-icons/md";

export default function StaticSidebar() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const isSidebarOpen = useSelector(
    (state: RootState) => state.layout.isSidebarOpen
  );

  const SidebarItem = ({
    icon: Icon,
    label,
    category,
    href,
    usePath = false,
  }: {
    icon: IconType;
    label: string;
    category?: string;
    href?: string;
    usePath?: boolean;
  }) => {
    const isActive = usePath && href === pathname;

    const handleCategoryClick = (category: string) => {
      dispatch(setCategory(category));
      router.push("/");
    };

    const content = (
      <div
        onClick={() => {
          if (category) {
            handleCategoryClick(category);
          }
        }}
        className={`relative cursor-pointer rounded-md transition-colors duration-200 h-10 ${
          isActive ? "bg-gray-100" : "hover:bg-gray-100"
        }`}
      >
        {/* Icon */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <Icon
            size={22}
            className={isActive ? "text-black" : "text-gray-700"}
          />
        </div>

        {/* Label */}
        <div
          className={`absolute left-12 top-1/2 transform -translate-y-1/2 whitespace-nowrap ${
            isActive ? "font-semibold text-black" : "text-gray-700"
          }`}
        >
          {label}
        </div>
      </div>
    );

    return href ? <Link href={href}>{content}</Link> : content;
  };

  return (
    <div
      className={`
        hidden md:flex flex-col bg-white pl-4 shadow-md fixed left-0 top-16 h-screen w-60 overflow-hidden z-40 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <div className="flex flex-col p-2 space-y-1 mt-4">
        <SidebarItem icon={FaHome} label="Home" href="/" usePath />
        <SidebarItem icon={SiYoutubeshorts} label="Shorts" href="/shorts" usePath />
        <SidebarItem icon={MdOutlineSubscriptions} label="Subscriptions" href="/subscriptions" usePath />

        <div className="my-4 border-t border-gray-200" />

        <div className="px-3 py-2 text-xl font-semibold text-gray-900">Explore</div>

        <SidebarItem icon={FaGamepad} label="Gaming" category={CATEGORY_IDS["Gaming"]} />
        <SidebarItem icon={FaMusic} label="Music" category={CATEGORY_IDS["Music"]} />
        <SidebarItem icon={FaFilm} label="Movies" category={CATEGORY_IDS["Movies"]} />
        <SidebarItem icon={FaNewspaper} label="News" category={CATEGORY_IDS["News"]} />
      </div>
    </div>
  );
}
