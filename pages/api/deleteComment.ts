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

type CommentId = {
  commentId: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { commentId } = req.query;
  //console.log("Comment ID: ", req.body);
  //const data: CommentBody = JSON.parse(req.body);
  console.log("Comment ID: ", commentId, typeof commentId);

  //console.log(typeof req.body); //string


  const mutations = {
    mutations: [
      {
        delete: {
          query: "*[_type == 'comment' && _id == $commentId]",
          params: {
            commentId,
          },
        },
      },
    ],
  };

  /*const apiEndpoint = `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`;

  const result = await fetch(apiEndpoint, {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${process.env.SANITY_API_TOKEN}`,
    },
    body: JSON.stringify(mutations),
    method: "DELETE",
  });

  console.log("Result: ", result);
  
  const json = await result.json();*/
  const result = await client.delete(commentId as string);

  res.status(200).json({ message: "Comment Deleted!" });
}
