"use client";

import React, { useRef, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchTrendingVideos, Video } from "@/app/utils/fetchVideos";
import Shorts from "./components/Shorts";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Mousewheel } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

export default function ShortsPage() {
  const swiperRef = useRef<SwiperType | null>(null);
  const lastScrollTime = useRef<number>(0);
  const scrollCooldown = 300; // 300ms cooldown between slides

  // Infinite query with React Query v5
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["shorts"],
    queryFn: ({ pageParam = "" }) => fetchTrendingVideos(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPageToken ?? undefined,
  });

  // Handle slide change to trigger infinite scroll
  const handleSlideChange = (swiper: SwiperType) => {
    const totalSlides = swiper.slides.length;
    const currentIndex = swiper.activeIndex;
    
    // Trigger fetch when approaching the end (2 slides before the last)
    if (currentIndex >= totalSlides - 2 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Add global mousewheel event listener with throttling
  useEffect(() => {
    const handleGlobalWheel = (e: WheelEvent) => {
      if (!swiperRef.current) return;
      
      const now = Date.now();
      
      // Check if enough time has passed since last scroll
      if (now - lastScrollTime.current < scrollCooldown) {
        e.preventDefault();
        return;
      }
      
      // Prevent default scrolling behavior
      e.preventDefault();
      
      // Update last scroll time
      lastScrollTime.current = now;
      
      if (e.deltaY > 0) {
        // Scrolling down - go to next slide
        swiperRef.current.slideNext();
      } else if (e.deltaY < 0) {
        // Scrolling up - go to previous slide
        swiperRef.current.slidePrev();
      }
    };

    // Add event listener to the entire document
    document.addEventListener('wheel', handleGlobalWheel, { passive: false });

    // Cleanup
    return () => {
      document.removeEventListener('wheel', handleGlobalWheel);
    };
  }, []);

  if (isLoading) return <div className="text-white">Loading Shorts...</div>;
  if (isError || !data || data.pages.flatMap((p) => p.items).length === 0)
    return <div className="text-white">No Shorts available</div>;

  const shortsToShow = data.pages.flatMap((page) => page.items);

  return (
    <div className="relative max-w-screen h-screen lg:h-[90vh] flex justify-center py-4 lg:py-8">
      {/* Up Button */}
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        className="absolute top-44 h-12 w-12 flex items-center justify-center right-4 md:right-16 transform -translate-x-1/2 z-20 p-3 bg-white shadow-md text-black rounded-full hover:bg-gray-100 transition-colors"
      >
        <FaArrowUp />
      </button>

      {/* Swiper Container with Responsive Width */}
      <div className="w-full lg:w-[30%] h-full">
        <Swiper
          direction="vertical"
          modules={[Mousewheel]}
          slidesPerView={1}
          spaceBetween={20}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={handleSlideChange}
          mousewheel={{ 
            forceToAxis: true,
            releaseOnEdges: false 
          }}
          className="h-full w-full"
        >
          {shortsToShow.map((video) => (
            <SwiperSlide
              key={video.id}
              className="flex justify-center items-center"
            >
              <Shorts video={video} />
            </SwiperSlide>
          ))}
          
          {/* Loading slide for when fetching more content */}
          {isFetchingNextPage && (
            <SwiperSlide className="flex justify-center items-center">
              <div className="w-full h-[80vh] lg:h-full bg-black rounded-lg flex items-center justify-center">
                <div className="text-white text-lg">Loading more Shorts...</div>
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>

      {/* Down Button */}
      <button
        onClick={() => swiperRef.current?.slideNext()}
        className="absolute h-12 w-12 flex items-center justify-center bottom-80 right-4 md:right-16 transform -translate-x-1/2 z-20 p-3 bg-white text-black rounded-full shadow-md hover:bg-gray-100 transition-colors"
      >
        <FaArrowDown />
      </button>
    </div>
  );
}