"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const categories = [
  { id: "all", name: "All" },
  { id: "10", name: "Music" },
  { id: "20", name: "Gaming" },
  { id: "25", name: "News" },
  { id: "17", name: "Sports" },
  { id: "27", name: "Education" },
  { id: "1", name: "Movies" },
  { id: "23", name: "Comedy" },
  { id: "19", name: "Travel" },
  { id: "22", name: "People & Blogs" },
  { id: "26", name: "How-to & Style" },
  { id: "28", name: "Science & Technology" },
  { id: "29", name: "Nonprofits & Activism" },
  { id: "30", name: "Movies/Entertainment" },
  { id: "31", name: "Anime/Animation" },
];

interface ButtonSliderProps {
  activeCategory: string;
  setActiveCategory: (categoryId: string) => void;
}

export default function ButtonSlider({
  activeCategory,
  setActiveCategory,
}: ButtonSliderProps) {
  return (
    <div className="w-full px-4 mb-6 relative">
      <Swiper
        slidesPerView="auto"
        spaceBetween={20}
        className="py-2"
        modules={[Navigation]}
        navigation={{
          prevEl: ".custom-prev",
          nextEl: ".custom-next",
        }}
        loop={false}
      >
        {categories.map((category) => (
          <SwiperSlide key={category.id} style={{ width: "auto" }}>
            <button
              className={`px-4 py-1.5 rounded-lg whitespace-nowrap text-sm font-semibold transition-colors duration-200
                ${
                  activeCategory === category.id
                    ? "bg-black text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

      <button className="custom-prev h-8 w-8 absolute left-0 lg:-left-6 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md flex items-center justify-center rounded-full hover:bg-gray-200">
        <FaChevronLeft className="text-gray-700" />
      </button>
      <button className="custom-next h-8 w-8 absolute right-0 lg:-right-6 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md flex items-center justify-center rounded-full hover:bg-gray-200">
        <FaChevronRight className="text-gray-700" />
      </button>
    </div>
  );
}
