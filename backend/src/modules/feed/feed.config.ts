// All feed tuning lives here, so changing the feel of the feed means changing numbers, not logic.

// Hours of "head start" a post gets based on your relationship with its author.
// A post from someone you follow that is 20h old still ranks above a stranger's 5h-old post.
export const RELATION_BOOST_HOURS = {
  own: 24,
  following: 24,
  follower: 12,
  friend_of_friend: 6,
} as const;

export type Relation = keyof typeof RELATION_BOOST_HOURS;
export type FeedReason = Relation | 'discover';