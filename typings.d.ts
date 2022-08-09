export interface Tweet extends TweetBody {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  _type: "tweet";
  blocktweet: boolean;
}

export type TweetBody = {
  text: string;
  username: string;
  profileImg: string;
  image?: string;
};

export type CommentBody = {
  comment: string;
  username: string;
  profileImg: string;
  tweetId: string;
};

export interface Comment extends CommentBody {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  _type: "comment";
  tweet: {
    _ref: string;
    type: "reference";
  };
}
