import React from "react";
import {
  ChatAlt2Icon,
  HeartIcon,
  SwitchHorizontalIcon,
  UploadIcon,
} from "@heroicons/react/outline";

interface Props {
  commentLength: number;
  onClick: () => void;
}

function TweetBottomIcon({ commentLength, onClick }: Props) {
  return (
    <div className="flex justify-between mt-4">
      <div
        onClick={onClick}
        className="flex items-center space-x-3 cursor-pointer text-gray-400"
      >
        <ChatAlt2Icon className="h-5 w-5" />
        <p>{commentLength}</p>
      </div>

      <div className="flex items-center space-x-3 cursor-pointer text-gray-400">
        <SwitchHorizontalIcon className="h-5 w-5" />
      </div>

      <div className="flex items-center space-x-3 cursor-pointer text-gray-400">
        <HeartIcon className="h-5 w-5" />
      </div>

      <div className="flex items-center space-x-3 cursor-pointer text-gray-400">
        <UploadIcon className="h-5 w-5" />
      </div>
    </div>
  );
}

export default TweetBottomIcon;
