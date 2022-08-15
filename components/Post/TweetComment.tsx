import React, { useState } from "react";
import { Comment, EditComment} from "../../typings";
import TimeAgo from "react-timeago";
import {
  DotsHorizontalIcon,
} from "@heroicons/react/outline";
import Modal from "../UI/Modal";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { fetchDeleteComment } from "../../lib/fetchDeleteComment";

interface Props {
  comment: Comment;
  getComments: () => Promise<void>;
}

function TweetComment(props: Props) {
  const { comment, getComments } = props;
  const { data: session } = useSession();

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

    setCommentModalIsOpen(false);
    getComments();
  };

  const editCommentHandler = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    // send put request for edited comment
    // editedComment
    if (session?.user?.name !== currentComment?.username) {
      return;
    } else {
      const comment: EditComment = {
        commentId: currentComment?._id || "",
        comment: editedComment,
      };
      console.log("Edit comment!");
      const commentToast = toast.loading("Edit Comment...");
      const result = await fetch(`/api/editComment`, {
        body: JSON.stringify(comment),
        method: "PUT",
      });

      // successfully edit comment
      toast.success("Comment is edited!", { id: commentToast });
      setStartEditComment(false);
      getComments();
    }
  };

  // comment modal for delete and the current edit commnet
  const [commentModalIsOpen, setCommentModalIsOpen] = useState<boolean>(false);
  const [currentComment, setCurrentComment] = useState<Comment>();

  // Start to edit comment
  const [startEditComment, setStartEditComment] = useState<boolean>(false);
  const [editedComment, setEditedComment] = useState<string>("");

  return (
    <div className="flex space-x-2">
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
                setCurrentComment(comment); // the whole comment object
              }}
              className="text-gray-400 h-6 w-6 cursor-pointer"
            />
            {commentModalIsOpen && currentComment?._id === comment._id && (
              <Modal onClose={() => setCommentModalIsOpen(false)}>
                <button
                  onClick={() => {
                    setStartEditComment(true);
                    setCommentModalIsOpen(false);
                    setEditedComment(
                      editedComment ? editedComment : comment.comment
                    );
                  }}
                  className="text-black border-b border-gray-500 pb-1 cursor-pointer"
                >
                  Edit
                </button>
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

        {!startEditComment && (
          <p className="">{editedComment ? editedComment : comment.comment}</p>
        )}
        {startEditComment && (
          <div className="flex items-center space-x-1">
            <input
              type="text"
              className="outline-none flex-grow"
              value={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
            />
            <button
              onClick={editCommentHandler}
              className="text-[#00ADED] text-sm rounded-lg bg-gray-200 py-1 px-2"
            >
              Edit
            </button>
            <button
              onClick={() => {
                setStartEditComment(false);
                setEditedComment(comment.comment);
              }}
              className="text-[#00ADED] text-sm rounded-lg bg-gray-200 py-1 px-2"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TweetComment;
