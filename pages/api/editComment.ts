import type { NextApiRequest, NextApiResponse } from "next";
import { EditComment } from "../../typings";
import SanityClient from "@sanity/client";

type Data = {
  message: string;
};

const client = SanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  useCdn: true,
  apiVersion: "2021-10-21",
  token: process.env.SANITY_API_TOKEN,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // post request
  const data: EditComment = JSON.parse(req.body);
  console.log("Data: ", data);

  //const apiEndpoint = `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`;
  const result = client
    .patch(data.commentId as string)
    .set({ comment: data.comment })
    .commit()
    .then((updatedComment) => {
      console.log("The new comment is being updated: ", updatedComment);
    })
    .catch((err) => console.log("Error: ", err));
  res.status(200).json({ message: "Comment edited!" });
}
