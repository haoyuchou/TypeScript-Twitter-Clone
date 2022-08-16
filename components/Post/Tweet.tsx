import React, { useEffect, useState } from "react";
import { CommentBody, Tweet } from "../../typings";
import TimeAgo from "react-timeago";
import {
  ChatAlt2Icon,
  DotsHorizontalIcon,
  HeartIcon,
  SwitchHorizontalIcon,
  UploadIcon,
} from "@heroicons/react/outline";

import { Comment } from "../../typings";
import { fetchComments } from "../../lib/fetchComments";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Modal from "../UI/Modal";
import { fetchDeleteTweet } from "../../lib/fetchDeleteTweet";
import TweetComment from "./TweetComment";
import TweetBottomIcon from "./TweetBottomIcon";

interface Props {
  tweet: Tweet;
  refresh: () => Promise<void>;
}

function Tweet(props: Props) {
  const { tweet, refresh } = props;
  // one tweet include many comments
  const [comments, setComments] = useState<Comment[]>([]);
  const { data: session } = useSession();

  // variable for adding new comment
  const [addCommentBoxOpen, setAddCommentBoxOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");

  // tweet modal for delete
  const [tweetModalIsOpen, setTweetModalIsOpen] = useState<boolean>(false);
  const [wantToDeleteTweetModal, setWantToDeleteTweetModal] =
    useState<boolean>(false);

  const getComments = async () => {
    const freshComments: Comment[] = await fetchComments(tweet._id);
    setComments(freshComments);
    console.log(
      "List of all comment for tweet",
      tweet._id,
      ": ",
      freshComments
    );
  };

  useEffect(() => {
    getComments();
  }, []);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const commentToast = toast.loading("Posting Comment...");

    // CommentBody
    const comment: CommentBody = {
      comment: input,
      username: session?.user?.name || "Unknown User",
      profileImg:
        session?.user?.image ||
        "https://api.elle.com.hk/var/site/storage/images/_aliases/img_1280_960/celebrity/feature/seven-points-you-must-see-in-stranger-things/node_1752477/30065134-1-chi-HK/07.jpg",
      tweetId: tweet._id,
    };

    const result = await fetch(`/api/addComment`, {
      body: JSON.stringify(comment),
      method: "POST",
    });

    //console.log("Yeahhhh, the message has been sent! ", result);
    toast.success("Comment Posted!", {
      id: commentToast,
    });

    setInput("");
    setAddCommentBoxOpen(false);
    getComments();

    // if not using getComments but add the new comment to setComments to update it?
  };

  const deleteTweetHandler = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (session?.user?.name !== tweet?.username) {
      return;
    } else {
      const tweetToast = toast.loading("Deleting tweets and its comments...");

      const result = await fetchDeleteTweet(tweet._id);

      toast.success("Tweet and its comments Deleted!", { id: tweetToast });
      setTweetModalIsOpen(false);
      setWantToDeleteTweetModal(false);
      refresh();
      getComments();
    }
  };

  return (
    <div className="flex flex-col p-8 space-x-3 border-y border-gray-100">
      <div className="flex space-x-2">
        <img
          src={tweet.profileImg}
          alt=""
          className="h-14 w-14 rounded-full object-cover"
        />

        <div className="flex-grow">
          <div className="flex items-center space-x-1">
            <p className="font-bold mr-1">{tweet.username}</p>
            <p className="hidden sm:inline text-gray-500">
              {/* replace all space with "" */}@
              {tweet.username.replace(/\s+/g, "").toLowerCase()}
            </p>

            <TimeAgo
              date={tweet._createdAt}
              className="text-sm text-gray-500 flex-grow"
            />

            <div className="relative">
              <DotsHorizontalIcon
                onClick={() => {
                  setTweetModalIsOpen(true);
                }}
                className="text-gray-400 h-6 w-6 cursor-pointer"
              />
              {tweetModalIsOpen && (
                <Modal
                  className="bg-transparent z-20"
                  overlayClassname="z-30 absolute top-3 right-6 shadow-lg rounded-lg text-sm bg-white"
                  onClose={() => setTweetModalIsOpen(false)}
                >
                  <button className="text-black border-b border-gray-500 pb-1 cursor-pointer">
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setTweetModalIsOpen(false);
                      setWantToDeleteTweetModal(true);
                    }}
                    className="text-black border-b border-gray-400 pb-2 cursor-pointer"
                  >
                    Delete
                  </button>
                </Modal>
              )}
            </div>
          </div>

          <p>{tweet.text}</p>

          {tweet.image && (
            <img
              src={tweet.image}
              alt="post image"
              className="m-4 ml-0 mb-1 max-h-60 object-cover shadow-md rounded-xl"
            />
          )}
        </div>
        {wantToDeleteTweetModal && (
          <Modal
            className="bg-gray-100 bg-opacity-90 z-40"
            onClose={() => {
              setWantToDeleteTweetModal(false);
              setTweetModalIsOpen(true);
            }}
            overlayClassname="z-50 rounded-xl shadow-xl fixed top-[200px] w-[40%] mx-auto h-60 md:h-40 bg-white"
          >
            <p className="text-black text-center pt-6 font-bold text-lg mb-4">
              Do you want to delete this Tweet?
            </p>
            <div className="flex space-x-2 place-content-center">
              <button
                onClick={deleteTweetHandler}
                className="text-white bg-[#00ADED] rounded-md px-4 py-1"
              >
                Yes
              </button>
              <button
                onClick={() => {
                  setWantToDeleteTweetModal(false);
                  setTweetModalIsOpen(true);
                }}
                className="text-[#00ADED] bg-white rounded-md px-4 py-1"
              >
                No
              </button>
            </div>
          </Modal>
        )}
      </div>
      
      <TweetBottomIcon
        commentLength={comments.length}
        onClick={() => {
          session && setAddCommentBoxOpen(!addCommentBoxOpen);
        }}
      />

      {/* Comments Section */}
      {/* Input new comment */}
      {addCommentBoxOpen && (
        <form onSubmit={submitHandler} className="mt-4 flex space-x-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow rounded-lg bg-gray-100 p-2 outline-none"
            type="text"
            placeholder="Write a comment..."
          />
          <button
            className="text-[#00ADED] disabled:text-gray-400"
            type="submit"
            disabled={!input}
          >
            Post
          </button>
        </form>
      )}

      {/* Loading comments */}
      {comments?.length > 0 && (
        <div className="my-2 mt-4 max-h-48 space-y-2 overflow-y-scroll border-t border-gray-100 p-4">
          {comments.map((comment) => (
            <TweetComment
              key={comment._id}
              comment={comment}
              getComments={getComments}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Tweet;
