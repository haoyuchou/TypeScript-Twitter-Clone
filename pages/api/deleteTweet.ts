// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
//import { sanityClient } from "../../sanity";
import sanityClient from "@sanity/client";

const client = sanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  useCdn: true,
  apiVersion: "2021-10-21",
  token: process.env.SANITY_API_TOKEN,
});

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
  console.log("Tweet ID: ", tweetId, typeof tweetId);

  const query = `*[_type == "comment" && references(*[_type == 'tweet' && _id == $tweetId]._id)]`;
  const params = { tweetId };

  const firstResult = await client.delete({ query, params });
  const secondResult = await client.delete(tweetId as string);

  res.status(200).json({ message: "Tweet Deleted!" });
}
