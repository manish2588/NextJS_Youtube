"use client";

import { useSelector } from "react-redux";
import { RootState } from "../redux/store"; 
import { useQuery } from "@tanstack/react-query";
import SearchCard from "./components/SearchCard";
import { fetchSearchResults } from "@/app/utils/fetchVideos"; 
import SearchCardShimmer from "./components/SearchCardShimmer";
import { Video } from "@/app/utils/fetchVideos";
export default function SearchPage() {
  const query = useSelector((state: RootState) => state.query.value);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["searchResults", query],
    queryFn: () => fetchSearchResults(query),
    enabled: !!query, 
  });

  if (!query)
    return <div className="p-4 text-gray-500">Start searching...</div>;
  if (isLoading)
    return (
      <div className="p-4 text-gray-500 flex flex-col md:p-8 lg:px-20 lg:py-6 space-y-4">
        <SearchCardShimmer />
        <SearchCardShimmer />
        <SearchCardShimmer />
      </div>
    );
  if (isError)
    return <div className="p-4 text-red-500">Failed to fetch results.</div>;

  return (
    <div className="p-4 lg:p-8 flex flex-col md:px-6 lg:px-40 gap-4 md:gap-6 lg:gap-10">
      {data?.map((video: Video) => (
        <SearchCard key={video.id} video={video} />
      ))}
    </div>
  );
}
