"use client";

import { formatCount, formatDate } from "@/app/utils/helperfunction"; // make sure formatDate exists
import Image from "next/image";
import Link from "next/link";
import { Video } from "@/app/utils/fetchVideos";
interface Props {
  video: Video;
}

export default function SearchCard({ video }: Props) {
  return (
    <Link href={`/watch/${video.id}`}>
      <div className="flex  space-x-1 lg:space-x-4 max-w-screen rounded-md overflow-hidden">
        {/* Thumbnail */}
        <div className="w-1/2 md:w-4/10 h-54 lg:h-72 relative flex-shrink-0">
          <Image
            src={video.snippet.thumbnails.high.url}
            alt={video.snippet.title}
            fill
            className="object-cover rounded-md"
          />
        </div>

        {/* Details */}
        <div className="w-1/2 md:w-6/10 h-54 lg:h-72 flex flex-col space-y-1 p-2 flex-1">
          <h3 className="text-base md:text-lg font-medium line-clamp-2">
            {video.snippet.title}
          </h3>
          <p className="text-sm text-gray-600">{video.snippet.channelTitle}</p>

          {/* Views and Published Date */}
          <div className="flex space-x-2 text-sm text-gray-600 mt-1">
            <span>{formatCount(video.statistics.viewCount)} views</span>
            <span>{formatDate(video.snippet.publishedAt)}</span>
          </div>

          {/* Likes */}
          <div className="flex space-x-2 text-sm text-gray-600">
            <span>{formatCount(video.statistics.likeCount)} likes</span>
          </div>
          {/* Description (2 lines max) */}
          <p className="text-sm text-gray-600 line-clamp-2">
            {video.snippet.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
