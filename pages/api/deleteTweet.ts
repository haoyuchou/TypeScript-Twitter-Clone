// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { sanityClient } from "../../sanity";
import SanityClient from "@sanity/client";
//import { MutationSelection } from "@sanity/types/src/mutations/types";
import { fetchComments } from "../../lib/fetchComments";
import { groq } from "next-sanity";
import { Comment } from "../../typings";

export type MutationSelection = {query: string, params?: Record<string, unknown> } | {id: string}

const client = SanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  useCdn: true,
  apiVersion: "2021-10-21",
  token: process.env.SANITY_API_TOKEN,
});

const deleteAllTweetComment = async (tweetId: string) => {
  try {
    const queryComment = groq`*[_type == "comment" && references(*[_type == 'tweet' && _id == $tweetId]._id)] {
      _id,
       ...
     } | order(_createdAt desc)`;
    const allComment: Comment[] = await sanityClient.fetch(queryComment, {
      tweetId,
    });
    console.log("All comment: ", allComment);

    allComment.map(async (comment) => {
      const deleteComment = await client.delete(comment._id);
      return deleteComment;
    });
  } catch (error) {
    console.log("Error: ", error);
  }
};

type Data = {
  message: string;
};

type tweetId = {
  commentId: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { tweetId } = req.query;
  //console.log("Comment ID: ", req.body);
  //const data: CommentBody = JSON.parse(req.body);
  //console.log("Tweet ID: ", tweetId, typeof tweetId);

  const query = `*[_type == "comment" && references(*[_type == 'tweet' && _id == $tweetId]._id)]`;
  const params = { tweetId };

  const mutateSelection: MutationSelection = {query, params}

  const mutations = {
    mutations: [
      {
        delete: {
          query: query,
          params: params,
        },
      },
    ],
  };

  /*const apiEndpoint = `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`;

  const result = await fetch(apiEndpoint, {
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${process.env.SANITY_API_TOKEN}`,
    },
    body: JSON.stringify(mutations),
    method: "DELETE",
  });*/

  //console.log(result);
  //const firstResult = await deleteAllTweetComment(tweetId as string);
  const firstResult = await client
    .delete(mutateSelection)
    .then()
    .catch((err) => console.log(err));
  const secondResult = await client.delete(tweetId as string);

  /*const comments: Comment[] = await sanityClient.fetch(queryComment, {
    tweetId,
  });
  const commentArray = comments?.map(async(comment) => {
    const deleteComment = await client.delete(comment._id);
    return deleteComment;
  });*/
  //const secondResult = await client.delete(tweetId as string);
  //console.log(commentArray);
  res.status(200).json({ message: "Tweet Deleted!" });
}
