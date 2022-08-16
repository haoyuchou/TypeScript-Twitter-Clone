import type { NextApiRequest, NextApiResponse } from "next";
import { EditTweet } from "../../typings";
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
  const data: EditTweet = JSON.parse(req.body);
  console.log(data);

  //const apiEndpoint = `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`;
  const result = client
    .patch(data.tweetId as string)
    .set({ text: data.text, image: data.image })
    .commit()
    .then((updatedTweet) => {
      console.log("The new Tweet is being updated: ", updatedTweet);
    })
    .catch((err) => console.log("Error: ", err));
  res.status(200).json({ message: "Tweet edited!" });
}
