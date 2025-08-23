"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Video, fetchChannelLogo } from "@/app/utils/fetchVideos";

interface Props {
  video: Video;
}

export default function Shorts({ video }: Props) {
  const [channelLogo, setChannelLogo] = useState<string>("");

  useEffect(() => {
    fetchChannelLogo(video.snippet.channelId).then(setChannelLogo);
  }, [video]);

  return (
    <div className="w-full h-[75vh] lg:h-full mx-auto my-auto relative flex flex-col justify-end overflow-hidden bg-black rounded-lg">
      {/* Iframe fills the component */}
      <iframe
        src={`https://www.youtube.com/embed/${video.id}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0`}
        className="w-full h-full"
        allow="autoplay; encrypted-media"
        allowFullScreen
        title={video.snippet.title}
      />

      {/* Transparent overlay to capture mouse wheel */}
      <div
        className="absolute inset-0 z-10"
        onWheel={(e) => {
          e.stopPropagation(); // Let parent Swiper or scroll handler catch it
        }}
      />

      {/* Overlay info */}
      <div className="absolute bottom-2 left-2 text-white z-20">
        <div className="flex items-center space-x-2 mb-1">
          {channelLogo && (
            <Image
              src={channelLogo}
              alt={video.snippet.channelTitle}
              width={30}
              height={30}
              className="rounded-full"
            />
          )}
          <span className="font-medium text-sm">{video.snippet.channelTitle}</span>
        </div>
        <div className="text-xs font-semibold line-clamp-2">
          {video.snippet.title}
        </div>
      </div>
    </div>
  );
}
