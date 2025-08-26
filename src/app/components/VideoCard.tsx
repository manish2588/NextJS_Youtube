"use client";
import Image from "next/image";
import { Video } from "../utils/fetchVideos";
import { useChannelLogo } from "../utils/useChannelLogo";

import { useDispatch } from "react-redux";
import { closeSidebar } from "../redux/slices/layoutSlice"; // 👈 use existing action
import { useRouter } from "next/navigation";
interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  const { data: channelLogo } = useChannelLogo(video.snippet.channelId);
  const dispatch = useDispatch();
  const router = useRouter();
  const handleClick = () => {
    // 👈 close sidebar
    router.push(`/watch/${video.id}`);
     window.scrollTo({ top: 0, behavior: "smooth" }); 
    setTimeout(() => {
      dispatch(closeSidebar());
    }, 300);
  };

  const formatViews = (views: string) => {
    const num = parseInt(views);
    if (num >= 1e6) return (num / 1e6).toFixed(1) + "M views";
    if (num >= 1e3) return (num / 1e3).toFixed(1) + "K views";
    return views + " views";
  };

  const timeAgo = (dateStr: string) => {
    const now = new Date();
    const past = new Date(dateStr);
    const diff = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;

    const days = Math.floor(diff / 86400);
    if (days < 30) return `${days}d ago`;

    const months =
      now.getMonth() -
      past.getMonth() +
      12 * (now.getFullYear() - past.getFullYear());
    if (months < 12) return `${months}mo ago`;

    // If older than 1 year, show Month Year
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${monthNames[past.getMonth()]} ${past.getFullYear()}`;
  };

  return (
    <div onClick={handleClick} className="w-full cursor-pointer transition">
      <div className="relative w-full h-48 lg:h-58 bg-gray-200 rounded-xl hover:rounded-none overflow-hidden transition">
        <Image
          src={video.snippet.thumbnails.high.url}
          alt={video.snippet.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex mt-3 gap-3">
        {channelLogo && (
          <Image
            src={channelLogo}
            alt={video.snippet.channelTitle}
            width={36}
            height={36}
            className="rounded-full h-10 w-10"
          />
        )}
        <div className="flex flex-col">
          <h2 className="text-base font-medium line-clamp-2">
            {video.snippet.title}
          </h2>
          <p className="text-sm text-gray-600">{video.snippet.channelTitle}</p>
          <p className="text-sm text-gray-600">
            {formatViews(video.statistics.viewCount)} •{" "}
            {timeAgo(video.snippet.publishedAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
