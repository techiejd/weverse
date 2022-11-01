import {
  getAllUsersSnapshot,
  getUserSnapshot,
} from "../../../../common/db";
import { userData } from "../../../db/schemas";
import * as fbSchemas from "../../../facebook/schemas";
import { getWeRacePosts } from "./query";
import { z } from "zod";

const maxVotesAllowed = 5;

const postVoteDatum = z.object({
  id: z.string(),
  votes: z.number(),
  whoVoted: z.string().array(),
  message: z.string().optional(),
});
type PostVoteDatum = z.infer<typeof postVoteDatum>;
const userInfo = z.object({
  name: z.string(),
  psid: z.string(),
});
type UserInfo = z.infer<typeof userInfo>;
export const countInfo = z.object({
  hasntVoted: userInfo.array(),
  overVoted: userInfo.array(),
  postVoteData: postVoteDatum.array(),
});
export type CountInfo = z.infer<typeof countInfo>;

export const count = async (weRace: string): Promise<CountInfo> => {
  const dataByPost = new Map<string, PostVoteDatum>();
  const hasntVoted = new Array<UserInfo>();
  const overVoted = new Array<UserInfo>();
  let posts: fbSchemas.Feed = [];

  const fillData = getAllUsersSnapshot().then((userSnapshots) => {
    for (const userDoc of userSnapshots.docs) {
      const user = userDoc.data();
      if (user.challenges && user.challenges[weRace]) {
        const userVotes: Record<string, number> =
          user.challenges[weRace]["votes"];
        const totalVotes = Object.values(userVotes).reduce((a, b) => a + b);
        if (totalVotes <= maxVotesAllowed) {
          Object.entries(userVotes).forEach(
            (postIdAndVote: [string, number]) => {
              const postId = postIdAndVote[0];
              const vote = postIdAndVote[1];

              const preData = dataByPost.get(postId);
              if (preData) {
                dataByPost.set(postId, {
                  id: postId,
                  votes: preData.votes + vote,
                  whoVoted: preData.whoVoted.concat([user.name]),
                });
              } else {
                dataByPost.set(postId, {
                  id: postId,
                  votes: vote,
                  whoVoted: [user.name],
                });
              }
            }
          );
        } else {
          //TODO(techiejd): look into overVoted Bug
          overVoted.push({ name: user.name, psid: user.psid });
        }
      } else {
        hasntVoted.push({ name: user.name, psid: user.psid });
      }
    }
  });
  const fillPosts = getUserSnapshot(String(process.env.DEV_ID)).then(
    async (userSnapshot) => {
      const user = userData.parse(userSnapshot.data());
      posts = await getWeRacePosts(weRace, user.token);
    }
  );
  await Promise.all([fillData, fillPosts]);

  posts.forEach((post) => {
    const data = dataByPost.get(post.id);
    if (data) {
      dataByPost.set(post.id, {
        id: data.id,
        votes: data.votes,
        whoVoted: data.whoVoted,
        message: post.message?.slice(0, 50),
      });
    }
  });

  const dataOrdered = Array.from(dataByPost.values()).sort(
    (a, b) => b.votes - a.votes
  );

  return {
    hasntVoted: hasntVoted,
    overVoted: overVoted,
    postVoteData: dataOrdered,
  };
};
