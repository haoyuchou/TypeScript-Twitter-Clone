import React, { useEffect, useState } from "react";
import { CommentBody, EditTweet, Tweet } from "../../typings";
import TimeAgo from "react-timeago";
import { DotsHorizontalIcon } from "@heroicons/react/outline";

import { Comment } from "../../typings";
import { fetchComments } from "../../lib/fetchComments";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Modal from "../UI/Modal";
import { fetchDeleteTweet } from "../../lib/fetchDeleteTweet";
import TweetComment from "./TweetComment";
import TweetBottomIcon from "./TweetBottomIcon";
import {DeleteModal} from "../UI/DeleteModal";

interface Props {
  tweet: Tweet;
  refresh: () => Promise<void>;
}

interface editTweet {
  tweet?: string;
  image?: string;
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

  // Start to edit tweet
  const [startEditTweet, setStartEditTweet] = useState<boolean>(false);
  const [beginEditedTweet, setBeginEditedTweet] = useState<editTweet>({
    tweet: tweet.text,
    image: tweet.image,
  });
  const [endEditedTweet, setEndEditedTweet] =
    useState<editTweet>(beginEditedTweet); // for tracking the edit input
  const [image, setImage] = useState<string>("");

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
    const tweetToast = toast.loading("Deleting tweets and its comments...");

    const result = await fetchDeleteTweet(tweet._id);

    toast.success("Tweet and its comments Deleted!", { id: tweetToast });
    setTweetModalIsOpen(false);
    setWantToDeleteTweetModal(false);
    refresh();
    getComments();
  };

  const editTweetHandler = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    // delete tweet
    const data: EditTweet = {
      tweetId: tweet._id,
      text: endEditedTweet?.tweet || "",
      image: endEditedTweet?.image || "",
    };
    const tweetEditToast = toast.loading("Edit Tweet...");
    const result = await fetch(`/api/editTweet`, {
      body: JSON.stringify(data),
      method: "PATCH",
    });
    toast.success("Tweet is edited!", { id: tweetEditToast });

    setStartEditTweet(false);
    setBeginEditedTweet({
      tweet: endEditedTweet?.tweet,
      image: endEditedTweet?.image,
    }); // start and end are the same
    setImage("");
    refresh();
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
                  <button
                    disabled={session?.user?.name !== tweet.username}
                    onClick={() => {
                      setStartEditTweet(true);
                      setTweetModalIsOpen(false);
                    }}
                    className="text-black border-b border-gray-500 pb-1 cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    disabled={session?.user?.name !== tweet.username}
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
          {/* Edit !!!!!! */}
          {startEditTweet && (
            <Modal
              className="bg-gray-100 bg-opacity-90 z-40"
              onClose={() => {
                setStartEditTweet(false);
                setEndEditedTweet({
                  // didn't change tweet, so change end tweet back to begin tweet
                  tweet: beginEditedTweet.tweet,
                  image: beginEditedTweet.image,
                });
                setImage("");
              }}
              overlayClassname="z-50 rounded-xl shadow-xl fixed top-[200px] w-[45%] mx-auto h-70 md:h-50 bg-white"
            >
              <input
                type="text"
                className="text-black text-center px-3 font-bold text-lg py-2 outline-none w-full object-contain"
                autoFocus
                value={endEditedTweet?.tweet}
                onChange={(e) =>
                  setEndEditedTweet({
                    tweet: e.target.value,
                    image: endEditedTweet?.image,
                  })
                }
              />

              <div className="flex rounded-xl bg-[#00ADED]/80 px-4 py-2 mt-4 object-contain">
                <input
                  value={endEditedTweet?.image}
                  autoFocus
                  type="text"
                  onChange={(e) =>
                    setEndEditedTweet({
                      tweet: endEditedTweet?.tweet,
                      image: e.target.value,
                    })
                  }
                  className="overflow-auto outline-none flex-grow bg-transparent p-2 text-white placeholder:text-white"
                />
                <button
                  className="text-white font-semibold object-contain"
                  type="submit"
                  onClick={() => setImage(endEditedTweet?.image || "")}
                >
                  Add Image
                </button>
              </div>
              {image && (
                <img
                  src={image}
                  alt="tweet image"
                  className="w-full h-40 object-contain rounded-xl shadow-md mt-8"
                />
              )}

              <div className="flex space-x-2 place-content-center pt-3 object-contain">
                <button
                  onClick={editTweetHandler}
                  className="text-white bg-[#00ADED] rounded-md px-4 py-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setStartEditTweet(false);
                    setEndEditedTweet({
                      tweet: beginEditedTweet.tweet,
                      image: beginEditedTweet.image,
                    });
                    setImage("");
                  }}
                  className="text-[#00ADED] bg-white rounded-md px-4 py-1"
                >
                  Cancel
                </button>
              </div>
            </Modal>
          )}

          <p>{beginEditedTweet.tweet}</p>

          {beginEditedTweet.image && (
            <img
              src={beginEditedTweet.image}
              alt="post image"
              className="m-4 ml-0 mb-1 max-h-60 object-cover shadow-md rounded-xl"
            />
          )}
        </div>

        {/* Delete!!!!!!! */}
        {wantToDeleteTweetModal && (
          <DeleteModal
          suggestText="Do you want to delete this Tweet?"
            onClose={() => {
              setWantToDeleteTweetModal(false);
              setTweetModalIsOpen(true);
            }}
            onYesClick={deleteTweetHandler}
            onNoClick={() => {
              setWantToDeleteTweetModal(false);
              setTweetModalIsOpen(true);
            }}
          />
        )}
      </div>

      <TweetBottomIcon
        commentLength={comments.length}
        onClick={() => {
          session && setAddCommentBoxOpen(!addCommentBoxOpen);
        }}
      />

      {/* Comments Section */}
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
