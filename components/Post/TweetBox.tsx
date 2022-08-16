import {
  CalendarIcon,
  EmojiHappyIcon,
  LocationMarkerIcon,
  PhotographIcon,
  SearchCircleIcon,
} from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import React, { useRef, useState, Dispatch, SetStateAction } from "react";
import { TweetBody, Tweet } from "../../typings";
import { fetchTweets } from "../../lib/fetchTweets";
import toast from "react-hot-toast";

interface Props {
  setTweets: Dispatch<SetStateAction<Tweet[]>>;
}

function TweetBox({ setTweets }: Props) {
  const [input, setInput] = useState<string>("");
  const { data: session } = useSession();
  const [uploadImageBox, setUploadImageBox] = useState<boolean>(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string>("");

  const addImageHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (!imageInputRef.current?.value) {
      return;
    }

    setImage(imageInputRef.current.value);
    imageInputRef.current.value = "";
    setUploadImageBox(false);
  };

  const submitHandler = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    const tweetInfo: TweetBody = {
      text: input,
      username: session?.user?.name || "Unknown User",
      profileImg:
        session?.user?.image ||
        "https://api.elle.com.hk/var/site/storage/images/_aliases/img_1280_960/celebrity/feature/seven-points-you-must-see-in-stranger-things/node_1752477/30065134-1-chi-HK/07.jpg",
      image: image,
    };

    const result = await fetch(`/api/addTweets`, {
      body: JSON.stringify(tweetInfo),
      method: "POST",
    });

    const json = await result.json();

    const newTweets = await fetchTweets();
    setTweets(newTweets);
    // if not fetch tweets again but add the new tweet to setTweets to update it?

    toast("Tweet Posted!", { icon: "🔥" });

    setInput("");
    setImage("");
    setUploadImageBox(false);

    return json;
  };

  return (
    <div className="flex space-x-2 p-4">
      <img
        src={
          session?.user?.image
            ? session.user.image
            : "https://media.glamour.com/photos/62bc80948d7bb5efa330ea9d/master/pass/STRANGER%20THINGS%20EDITS%20280622%20default-sq-StrangerThings_StrangerThings4_2_00_09_37_12.jpg"
        }
        alt="User Image"
        className="rounded-full h-14 w-14 object-cover mt-3"
      />

      <div className="flex flex-grow items-center pl-3">
        <form className="flex flex-grow flex-col">
          <input
            type="text"
            placeholder="What's Happening?"
            className="h-24 outline-none w-full placeholder:text-xl"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />

          <div className="flex items-center">
            <div className="flex space-x-2 text-[#00ADED] flex-grow">
              <PhotographIcon
                onClick={() => {
                  setUploadImageBox(!uploadImageBox);
                }}
                className="h-5 w-5 icon"
              />
              <SearchCircleIcon className="h-5 w-5 icon" />
              <EmojiHappyIcon className="h-5 w-5 icon" />
              <CalendarIcon className="h-5 w-5 icon" />
              <LocationMarkerIcon className="h-5 w-5 icon" />
            </div>

            <button
              className="bg-[#00ADED] text-white rounded-full px-4 py-2 font-semibold disabled:opacity-50"
              disabled={!input || !session}
              onClick={submitHandler}
            >
              Tweet
            </button>
          </div>

          {/* can't have a form inside a form */}

          {uploadImageBox && (
            <div className="flex rounded-xl bg-[#00ADED]/80 px-4 py-2 mt-4">
              <input
                ref={imageInputRef}
                type="text"
                placeholder="Enter Image URL..."
                className="outline-none flex-grow bg-transparent p-2 text-white placeholder:text-white"
              />
              <button
                className="text-white font-semibold"
                type="submit"
                onClick={addImageHandler}
              >
                Add Image
              </button>
            </div>
          )}

          {image && (
            <img
              src={image}
              alt="tweet image"
              className="w-full h-40 object-contain rounded-xl shadow-md mt-8"
            />
          )}
        </form>
      </div>
    </div>
  );
}

export default TweetBox;
