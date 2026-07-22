interface PostRow {
  id: number;
  upvotes: number;
  comment_count: number;
  claimed_by: string | null;
  created_at: string;
}

export function hotScore(post: PostRow): number {
  const claimBonus = post.claimed_by ? 5 : 0;
  const engagement = post.upvotes * 2 + post.comment_count + claimBonus;
  const postDate = new Date(post.created_at + 'Z');
  const hoursAgo = (Date.now() - postDate.getTime()) / (1000 * 60 * 60);
  const gravity = 1.5;
  return engagement / Math.pow(hoursAgo + 2, gravity);
}
