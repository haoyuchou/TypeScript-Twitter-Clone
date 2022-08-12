import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
//import Image from "next/image";
import Post from "../components/Post/Post";
import Sidebar from "../components/Sidebar/Sidebar";
import Widget from "../components/Widget/Widget";
import { fetchTweets } from "../lib/fetchTweets";
import { Tweet } from "../typings";
import { Toaster } from "react-hot-toast";

interface Props {
  tweets: Tweet[];
}

const Home = ({ tweets }: Props) => {
  console.log(tweets);
  //console.log("twitter client id: ",process.env.TWITTER_CLIENT_ID);

  return (
    <div className="lg:max-w-6xl mx-auto overflow-hidden">
      <Head>
        <title>Twitter Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Toaster />

      <main className="grid grid-cols-9">
        {/* sidebar */}
        <Sidebar />

        {/* posts */}
        <Post tweets={tweets} />

        {/* widgets */}
        <Widget />
      </main>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tweets = await fetchTweets();
  return {
    props: { tweets },
  };
};
