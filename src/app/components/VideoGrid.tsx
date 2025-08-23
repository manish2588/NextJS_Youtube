"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { setCategory } from "../redux/slices/categorySlice";
import VideoCard from "./VideoCard";
import ButtonSlider from "./ButtonSlider";
import CardShimmer from "./CardShimmer";
import {
  fetchTrendingVideos,
  fetchVideosByCategoryId,
  Video,
} from "../utils/fetchVideos";
import { useEffect, useRef } from "react";
import LoadingSpinner from "./LoadingSpinner";

// Type for infinite query page
interface VideoPage {
  items: Video[];
  nextPageToken?: string;
}

export default function VideoGrid() {
  const activeCategory = useSelector(
    (state: RootState) => state.category.activeCategory
  );
  const dispatch = useDispatch();

  // Infinite Query
  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<VideoPage, Error, VideoPage, string>({
    queryKey: ["videos", activeCategory],
    queryFn: ({ pageParam = "" }) =>
      activeCategory === "all"
        ? fetchTrendingVideos(pageParam)
        : fetchVideosByCategoryId(activeCategory, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPageToken ?? undefined,
    initialPageParam: "", // required for TypeScript
    staleTime: 10 * 60 * 1000,
  });

  // Infinite scroll observer
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );
    observer.observe(loadMoreRef.current);
    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [hasNextPage, fetchNextPage]);

  // Loading shimmer
  if (isLoading)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-6 lg:px-8 gap-8 mt-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <CardShimmer key={idx} />
        ))}
      </div>
    );

  if (error) return <p className="py-8 px-4">Error: {error.message}</p>;

  return (
    <div className="py-6 px-4 lg:px-8">
      <div className="">
        <ButtonSlider
          activeCategory={activeCategory}
          setActiveCategory={(catId) => dispatch(setCategory(catId))}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.pages.map((page, pageIndex) =>
          page.items.map((video) => (
            <VideoCard key={video.id + pageIndex} video={video} />
          ))
        )}
      </div>

      <div ref={loadMoreRef} className="flex justify-center py-4">
        {isFetchingNextPage && (
          <LoadingSpinner/>
        )}
        {!hasNextPage && <p className="text-gray-400">No more videos</p>}
      </div>
    </div>
  );
}
