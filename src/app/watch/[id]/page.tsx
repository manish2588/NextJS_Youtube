"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchVideoById } from "@/app/utils/fetchVideos";
import Image from "next/image";
import { formatCount, formatDate } from "@/app/utils/helperfunction";
import {
  fetchRelatedVideos,
  Video as VideoType,
} from "@/app/utils/fetchVideos";
import RelatedVideoCard from "../components/RelatedVideoCard";
import {
  AiOutlineLike,
  AiOutlineDislike,
  AiFillLike,
  AiFillDislike,
} from "react-icons/ai";
import {
  IoShareOutline,
  IoDownloadOutline,
  IoNotificationsOutline,
} from "react-icons/io5";
import { BsThreeDots, BsChevronDown, BsChevronUp } from "react-icons/bs";
import {
  fetchCommentsByVideoId,
  Comment as CommentType,
} from "@/app/utils/fetchVideos";
import Comment from "../components/Comment";

export default function VideoPage() {
  const { id } = useParams();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const {
    data: comments,
    isLoading: commentsLoading,
    error: commentsError,
  } = useQuery<CommentType[]>({
    queryKey: ["comments", id],
    queryFn: () => fetchCommentsByVideoId(id!),
    enabled: !!id,
  });
  const {
    data: video,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["video", id],
    queryFn: () => fetchVideoById(id!),
    enabled: !!id,
  });

  const {
    data: relatedVideos,
    isLoading: relatedLoading,
    error: relatedError,
  } = useQuery<VideoType[]>({
    queryKey: ["relatedVideos", id],
    queryFn: () => fetchRelatedVideos(id!),
    enabled: !!id,
  });
  const handleLike = () => {
    setLiked(!liked);
    if (disliked) setDisliked(false);
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (liked) setLiked(false);
  };

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen ">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error loading video</p>
      </div>
    );

  const description = video.snippet.description || "";
  const shortDescription = description.split("\n").slice(0, 4).join("\n");
  const shouldShowReadMore =
    description.length > 300 || description.split("\n").length > 4;

  return (
    <div className="mainBox  max-w-screen px-4 md:px-8 lg:px-14 py-6 flex flex-col lg:flex-row">
      <div className="leftBox  w-full lg:w-[60vw]">
        <div className=" ">
          {/* Main Video Section */}
          <div className="w-full md:w-[60vw]">
            {/* Video Player */}
            <div className="relative w-full h-96 md:h-[70vh] ">
              <iframe
                src={`https://www.youtube.com/embed/${video.id}`}
                title={video.snippet.title}
                allowFullScreen
                className="absolute top-0 left-0 w-full h-96 md:h-[70vh] rounded-xl"
              />
            </div>

            {/* Video Title */}
            <h1 className="text-xl font-semibold mt-4  leading-tight text-gray-900 dark:text-white">
              {video.snippet.title}
            </h1>

            {/* Video Stats and Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 gap-3">
              {/* Channel Info */}
              <div className="flex items-center gap-3">
                <Image
                  src={
                    video.channelThumbnail ||
                    `https://via.placeholder.com/40x40/ff0000/ffffff?text=${video.snippet.channelTitle.charAt(
                      0
                    )}`
                  }
                  alt={video.snippet.channelTitle}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {video.snippet.channelTitle}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {video.subscriberCount
                      ? formatCount(video.subscriberCount) + " subscribers"
                      : "Subscriber count unavailable"}
                  </p>
                </div>
                <button
                  onClick={handleSubscribe}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors ${
                    isSubscribed
                      ? "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                      : "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                  }`}
                >
                  {!isSubscribed && (
                    <IoNotificationsOutline className="w-4 h-4" />
                  )}
                  {isSubscribed ? "Subscribed" : "Subscribe"}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Like/Dislike */}
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-l-full transition-colors ${
                      liked
                        ? "text-blue-600"
                        : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    {liked ? (
                      <AiFillLike className="w-5 h-5" />
                    ) : (
                      <AiOutlineLike className="w-5 h-5" />
                    )}
                    <span className="text-sm font-medium">
                      {formatCount(video.statistics.likeCount || "0")}
                    </span>
                  </button>
                  <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
                  <button
                    onClick={handleDislike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-r-full transition-colors ${
                      disliked
                        ? "text-red-600"
                        : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    {disliked ? (
                      <AiFillDislike className="w-5 h-5" />
                    ) : (
                      <AiOutlineDislike className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Share Button */}
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <IoShareOutline className="w-5 h-5" />
                  <span className="text-sm font-medium hidden sm:block">
                    Share
                  </span>
                </button>

                {/* Download Button */}
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <IoDownloadOutline className="w-5 h-5" />
                  <span className="text-sm font-medium hidden sm:block">
                    Download
                  </span>
                </button>

                {/* More Options */}
                <button className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <BsThreeDots className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Video Description */}
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
              <div className="flex items-center gap-4 text-sm font-bold text-gray-900 dark:text-white mb-2">
                <span>{formatCount(video.statistics.viewCount)} views</span>
                <span>{formatDate(video.snippet.publishedAt)}</span>
              </div>

              <div className="text-gray-800 text-sm dark:text-gray-200">
                <div
                  className={`whitespace-pre-line ${
                    !showFullDescription && shouldShowReadMore
                      ? "line-clamp-4"
                      : ""
                  }`}
                  style={
                    !showFullDescription && shouldShowReadMore
                      ? {
                          display: "-webkit-box",
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }
                      : {}
                  }
                >
                  {showFullDescription
                    ? description
                    : shouldShowReadMore
                    ? shortDescription
                    : description}
                </div>

                {shouldShowReadMore && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="flex items-center gap-1 mt-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium"
                  >
                    {showFullDescription ? (
                      <>
                        Show less
                        <BsChevronUp className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        ...more
                        <BsChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Comments Section */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Comments
          </h2>

          {commentsLoading && <p>Loading comments...</p>}
          {commentsError && (
            <p className="text-red-500">Failed to load comments</p>
          )}

          <div className="flex flex-col w-full md:w-[60vw] max-w-screen">
            {comments?.map((comment) => (
              <Comment key={comment.id} comment={comment} />
            ))}
          </div>
        </div>
      </div>
      <div className="rightBox w-full lg:w-[40vw]">
        <h2 className="text-xl font-semibold mb-4 mt-4 lg:mt-0 px-4 text-gray-900 dark:text-white">
          Related Videos
        </h2>

        {relatedLoading && <p>Loading related videos...</p>}
        {relatedError && (
          <p className="text-red-500">Failed to load related videos</p>
        )}

        <div className="flex flex-col px-4">
          {relatedVideos?.map((video) => (
            <RelatedVideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    </div>
  );
}
