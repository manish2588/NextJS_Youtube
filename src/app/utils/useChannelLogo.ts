"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchChannelLogo } from "../utils/fetchVideos";

export const useChannelLogo = (channelId: string) => {
  return useQuery({
    queryKey: ["channelLogo", channelId],
    queryFn: () => fetchChannelLogo(channelId),
    staleTime: 1000 * 60 * 60, 
  });
};
