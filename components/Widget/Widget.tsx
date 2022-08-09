import { SearchIcon } from "@heroicons/react/outline";
import React from "react";
import { TwitterTimelineEmbed } from "react-twitter-embed";

function Widget() {
  return (
    <div className="mt-2 px-2 col-span-2 hidden lg:inline">
      {/* Search */}
      <div className="flex items-center space-x-2 bg-gray-100 mt-2 p-3 rounded-full">
        <SearchIcon className="h-6 w-6" />
        <input
          type="text"
          placeholder="Search Twitter"
          className="bg-transparent flex-grow outline-none"
        />
      </div>

      <TwitterTimelineEmbed
        sourceType="profile"
        screenName="LewisHamilton"
        options={{ height: 1000 }}
      />
    </div>
  );
}

export default Widget;
