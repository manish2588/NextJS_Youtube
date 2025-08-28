
"use client";
import Image from "next/image";
import { formatDate } from "@/app/utils/helperfunction";
import { Comment as CommentType } from "@/app/utils/fetchVideos";

interface Props {
  comment: CommentType;
}

export default function Comment({ comment }: Props) {
  return (
    <div className="flex gap-3 p-3 border-b border-gray-200 dark:border-gray-700">
      <Image
        src={comment.authorProfileImageUrl}
        alt={comment.authorName}
        width={40}
        height={40}
        className="rounded-full h-10 w-10"
      />
      <div className="flex flex-col space-y-1">
        <p className="font-medium text-gray-900 dark:text-white">
          {comment.authorName}
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {formatDate(comment.publishedAt)}
        </p>
        <p className="text-gray-800 dark:text-gray-200 mt-1 text-sm">
          {comment.text}
        </p>
      </div>
    </div>
  );
}
