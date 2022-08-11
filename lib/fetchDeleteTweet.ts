export const fetchDeleteTweet = async (tweetId: string) => {
    const res = await fetch(
      `/api/deleteTweet?tweetId=${tweetId}`
    );
  
    //const comments: Comment[] = await res.json();
    //return comments;
  };