// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { sanityClient } from "../../sanity";
import { Comment } from "../../typings";
import { groq } from "next-sanity";

// e5ef523d-ff75-4ec1-8d48-76bd8bb236a7

const queryComment = groq`*[_type == "comment" && references(*[_type == 'tweet' && _id == $tweetId]._id)] {
    _id,
     ...
   } | order(_createdAt desc)`;

type Data = Comment[];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { tweetId } = req.query;

  const comments: Comment[] = await sanityClient.fetch(queryComment, {
    tweetId,
  });
  res.status(200).json(comments);
}
