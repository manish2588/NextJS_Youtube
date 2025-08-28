
"use client";
import Image from "next/image";
import { formatCount, formatDate } from "@/app/utils/helperfunction";
import { Video } from "@/app/utils/fetchVideos";
import Link from "next/link";

interface Props {
  video: Video;
}

export default function RelatedVideoCard({ video }: Props) {
  return (
    <Link
      href={`/watch/${video.id}`}
      className="flex gap-3 mb-3 hover:bg-gray-100 dark:hover:bg-gray-800 p-1 rounded-lg transition-colors"
    >
      {/* Thumbnail */}
      <div className="flex-shrink-0 w-32 h-20 relative">
        <Image
          src={video.snippet.thumbnails.high.url}
          alt={video.snippet.title}
          fill
          className="rounded-lg object-cover"
        />
      </div>

      {/* Video Info */}
      <div className="flex flex-col space-y-1 text-sm">
        <p className="font-medium text-gray-900 dark:text-white line-clamp-2">
          {video.snippet.title}
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          {video.snippet.channelTitle}
        </p>
        <p className="text-gray-500 dark:text-gray-400">
          {formatCount(video.statistics.viewCount)} views •{" "}
          {formatDate(video.snippet.publishedAt)}
        </p>
      </div>
    </Link>
  );
}
