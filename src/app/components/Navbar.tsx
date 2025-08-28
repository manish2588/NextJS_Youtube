"use client";

import { FaYoutube, FaRegBell } from "react-icons/fa6";
import { RxHamburgerMenu } from "react-icons/rx";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { toggleSidebar } from "../redux/slices/layoutSlice";
import Search from "./Search";
import { CgProfile } from "react-icons/cg";
import Link from "next/link";
export default function Navbar() {
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector(
    (state: RootState) => state.layout.isSidebarOpen
  );
  console.log("sidebar", isSidebarOpen);

  return (
    <nav className="w-full fixed top-0 z-50 h-18 bg-white shadow-md flex items-center justify-between px-4 md:px-6">
      {/* Navbar */}
      <div className="hidden md:flex w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <RxHamburgerMenu className="text-gray-700 text-2xl" />
          </button>
          <Link href={"/"}>
            <div className="flex items-center gap-1">
              <FaYoutube className="text-red-600 text-3xl" />
              <span className="text-xl font-bold hidden sm:block">YouTube</span>
            </div>
          </Link>
        </div>

        <Search />

        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Link href={"/subscriptions"}>
              <FaRegBell className="text-gray-700 text-2xl" />
            </Link>
          </button>
          <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
            <Link href={"/profile"}>
              <CgProfile className="text-gray-700 text-3xl" />{" "}
            </Link>
          </button>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="fixed flex py-4  top-0 md:hidden w-full space-x-3">
        <div className="">
          <FaYoutube className="text-red-600 text-4xl" />
        </div>

        <div className="w-4/5">
          <Search />
        </div>
      </div>
    </nav>
  );
}
