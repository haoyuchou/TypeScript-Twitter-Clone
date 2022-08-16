import React, { useEffect, useState } from "react";
import { Comment, EditComment } from "../../typings";
import TimeAgo from "react-timeago";
import { DotsHorizontalIcon } from "@heroicons/react/outline";
import Modal from "../UI/Modal";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { fetchDeleteComment } from "../../lib/fetchDeleteComment";

// add the UI to ask whether user really want to delete the comment!

interface Props {
  comment: Comment;
  getComments: () => Promise<void>;
}

function TweetComment(props: Props) {
  const { comment, getComments } = props;
  const { data: session } = useSession();

  // comment modal for delete and the current edit commnet
  const [commentModalIsOpen, setCommentModalIsOpen] = useState<boolean>(false);
  const [currentComment, setCurrentComment] = useState<Comment>();
  const [wantToDeleteCommentModal, setWantToDeleteCommentModal] =
    useState<boolean>(false);

  // Start to edit comment
  const [startEditComment, setStartEditComment] = useState<boolean>(false);
  const [beginEditedComment, setBeginEditedComment] = useState<string>(
    comment.comment
  );
  const [endEditedComment, setEndEditedComment] = useState<string>("");

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
    setWantToDeleteCommentModal(false);
    //setCommentModalIsOpen(false);
    getComments();
  };

  useEffect(() => {
    if (wantToDeleteCommentModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "scroll";
    }
  }, [wantToDeleteCommentModal]);

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
        comment: endEditedComment,
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

      console.log("set edit comment: ", endEditedComment);
      setBeginEditedComment(endEditedComment);
      getComments();
    }
  };

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
            <button
              onClick={() => {
                setCommentModalIsOpen(true);
                setCurrentComment(comment); // the whole comment object
              }}
              disabled={startEditComment}
            >
              <DotsHorizontalIcon className="text-gray-400 h-6 w-6 cursor-pointer" />
            </button>

            {commentModalIsOpen && currentComment?._id === comment._id && (
              <Modal
                className="bg-transparent z-20"
                overlayClassname="z-30 absolute top-3 right-6 shadow-lg rounded-lg text-sm bg-white"
                onClose={() => setCommentModalIsOpen(false)}
              >
                <button
                  onClick={() => {
                    setStartEditComment(true);
                    setCommentModalIsOpen(false);
                    setBeginEditedComment(
                      endEditedComment || beginEditedComment
                    ); // save the current comment value
                    setEndEditedComment(beginEditedComment); // modification all made at this one
                  }}
                  className="text-black border-b border-gray-500 pb-1 cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setWantToDeleteCommentModal(true);
                    setCommentModalIsOpen(false);
                  }}
                  className="text-black border-b border-gray-400 pb-2 cursor-pointer"
                >
                  Delete
                </button>
              </Modal>
            )}
          </div>
          {wantToDeleteCommentModal && (
            <Modal
              className="bg-gray-100 bg-opacity-90 z-40"
              onClose={() => {
                setWantToDeleteCommentModal(false);
                setCommentModalIsOpen(true);
              }}
              overlayClassname="z-50 rounded-xl shadow-xl fixed top-[200px] w-[30%] mx-auto h-40 bg-white"
            >
              <p className="text-black text-center pt-6 font-bold text-lg mb-4">
                Do you want to delete this comment?
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={deleteCommentHandler}
                  className="text-white bg-[#00ADED] rounded-md px-4 py-1"
                >
                  Yes
                </button>
                <button
                  onClick={() => {
                    setWantToDeleteCommentModal(false);
                    setCommentModalIsOpen(true);
                  }}
                  className="text-[#00ADED] bg-white rounded-md px-4 py-1"
                >
                  No
                </button>
              </div>
            </Modal>
          )}
        </div>

        {!startEditComment && (
          <p className="">{endEditedComment || comment.comment}</p>
        )}
        {startEditComment && (
          <div className="flex items-center space-x-1 z-30">
            <input
              type="text"
              className="outline-none flex-grow"
              value={endEditedComment}
              onChange={(e) => setEndEditedComment(e.target.value)}
              autoFocus
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
                setEndEditedComment(beginEditedComment);
                // not edit, change the value back to the begining edited comment
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
