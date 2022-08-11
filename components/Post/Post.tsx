import { RefreshIcon } from "@heroicons/react/outline";
import React, { useState } from "react";
import { Tweet } from "../../typings";
import TweetBox from "./TweetBox";
import TweetComponent from "./Tweet";
import { fetchTweets } from "../../lib/fetchTweets";
import toast from "react-hot-toast";

interface Props {
  tweets: Tweet[];
}

function Post(props: Props) {
  const { tweets: tweetsProps } = props;
  const [tweets, setTweets] = useState(tweetsProps);

  console.log(tweets);

  const refreshTweets = async () => {
    const refreshToast = toast.loading("Refrshing...");

    const tweets = await fetchTweets();
    setTweets(tweets);

    toast.success("Tweet Updated!", {
      id: refreshToast,
    });
  };

  return (
    <div className="col-span-7 lg:col-span-5 border-x max-h-screen overflow-scroll">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-xl p-4 pb-0">Home</h1>
        <RefreshIcon
          onClick={refreshTweets}
          className="h-8 w-8 mr-4 mt-4 cursor-pointer text-[#00ADED] hover:rotate-180 active:scale-125 transition-all duration-500 ease-in-out"
        />
      </div>

      {/* Tweet Box */}
      <div>
        <TweetBox setTweets={setTweets}/>
      </div>

      {/* Tweet */}
      <div>
        {tweets.map((tweet) => (
          <TweetComponent key={tweet._id} tweet={tweet} refresh={refreshTweets} />
        ))}
      </div>
    </div>
  );
}

export default Post;
