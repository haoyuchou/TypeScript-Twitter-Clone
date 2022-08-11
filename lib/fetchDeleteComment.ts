import { Comment } from "../typings";

export const fetchDeleteComment = async (commentId: string) => {
  const res = await fetch(
    `/api/deleteComment?commentId=${commentId}`
  );

  //const comments: Comment[] = await res.json();
  //return comments;
};