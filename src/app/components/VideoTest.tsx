"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTrendingVideos, Video } from "../utils/fetchVideos";

export default function VideoTest() {
  const { data, isLoading, error } = useQuery<Video[], Error>({
    queryKey: ["trendingVideos"],
    queryFn: fetchTrendingVideos,
  });

  if (isLoading) return <p>Loading videos...</p>;
  if (error) return <p>Error loading videos: {error.message}</p>;

  console.log("Fetched Videos:", data); // ✅ Check videos in console

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Fetched Videos (Check Console)</h1>
    </div>
  );
}
