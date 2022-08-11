import React, { useEffect, useState } from "react";
import { CommentBody, CommentDeleteBody, Tweet } from "../../typings";
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
import { fetchDeleteComment } from "../../lib/fetchDeleteComment";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Modal, { BackDrop, ModalOverlay } from "../UI/Modal";
import { fetchDeleteTweet } from "../../lib/fetchDeleteTweet";

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

  // comment modal
  const [commentModalIsOpen, setCommentModalIsOpen] = useState<boolean>(false);
  const [currentComment, setCurrentComment] = useState<Comment>();

  // tweet modal
  const [tweetModalIsOpen, setTweetModalIsOpen] = useState<boolean>(false);

  const getComments = async () => {
    const freshComments: Comment[] = await fetchComments(tweet._id);
    setComments(freshComments);

    console.log("List of all comment for tweet", tweet._id, ": ", comments);
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

    const refreshComment = await fetchComments(tweet._id);
    setComments(refreshComment);

    //console.log("Yeahhhh, the message has been sent! ", result);
    toast.success("Comment Posted!", {
      id: commentToast,
    });

    setInput("");
    setAddCommentBoxOpen(false);
  };

  const deleteCommentHandler = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    // Only the user who post the comment can delete it
    if (session?.user?.name !== currentComment?.username) {
      console.log("You're not the author of this comment");
      return;
    } else {
      const commentToast = toast.loading("Deleting Comment...");
      //console.log("Current Comment: ", currentComment?._id);
      const result = await fetchDeleteComment(
        currentComment?._id || "randomId"
      );

      //console.log("Yeahhhh, the message has been sent! ", result);
      toast.success("Comment Deleted!", {
        id: commentToast,
      });
    }

    console.log("Time to fetch comments again");
    const refreshComment = await fetchComments(tweet._id);
    setComments(refreshComment);

    setCommentModalIsOpen(false);
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

      refresh();
      setTweetModalIsOpen(false);
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
                className="text-gray-400 h-6 w-6"
              />
              {tweetModalIsOpen && (
                <Modal onClose={() => setTweetModalIsOpen(false)}>
                  <p className="text-black border-b border-gray-500 pb-1">
                    Edit
                  </p>
                  <button
                    onClick={deleteTweetHandler}
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
      </div>

      <div className="flex justify-between mt-4">
        <div
          onClick={() => {
            session && setAddCommentBoxOpen(!addCommentBoxOpen);
          }}
          className="flex items-center space-x-3 cursor-pointer text-gray-400"
        >
          <ChatAlt2Icon className="h-5 w-5" />
          <p>{comments.length}</p>
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
            <div key={comment._id} className="flex space-x-2">
              <div>
                <img
                  src={comment.profileImg}
                  alt="Profile Image"
                  className="h-10 w-10 rounded-full object-cover mt-1"
                />
                <hr className="border-l border-t-0 border-[#00ADED]/30 w-2 h-8 ml-[1.25rem] mt-1" />
              </div>

              <div className="flex-grow">
                <div className="flex items-center space-x-1">
                  <p className="font-bold mr-1">{comment.username}</p>
                  <p className="text-gray-500 hidden lg:inline">
                    @{comment.username.replace(/\s+/g, "").toLowerCase()}
                  </p>

                  <TimeAgo
                    date={comment._createdAt}
                    className="text-sm text-gray-500 flex-grow"
                  />
                  <div className="relative">
                    <DotsHorizontalIcon
                      onClick={() => {
                        setCommentModalIsOpen(true);
                        setCurrentComment(comment);
                      }}
                      className="text-gray-400 h-6 w-6"
                    />
                    {commentModalIsOpen && currentComment?._id === comment._id && (
                      <Modal onClose={() => setCommentModalIsOpen(false)}>
                        <p className="text-black border-b border-gray-500 pb-1">
                          Edit
                        </p>
                        <button
                          onClick={deleteCommentHandler}
                          className="text-black border-b border-gray-400 pb-2 cursor-pointer"
                        >
                          Delete
                        </button>
                      </Modal>
                    )}
                  </div>
                </div>

                <p className="">{comment.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Tweet;
