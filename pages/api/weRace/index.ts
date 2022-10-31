import type { NextApiRequest, NextApiResponse } from "next";
import { challenge, Challenge } from "../../../modules/sofia/schemas";
import { addChallenge } from "../../../common/db";
import { firestore } from "firebase-admin";
import { identity, pickBy } from "lodash";

export default async function vote(req: NextApiRequest, res: NextApiResponse) {
  let newChallengeData = JSON.parse(req.body);
  const parseDate = (date: string) =>
    firestore.Timestamp.fromDate(new Date(date));
  let newChallenge: Challenge = challenge.parse(
    pickBy(
      {
        title: newChallengeData.title,
        start: parseDate(newChallengeData.start),
        end: newChallengeData.end ? parseDate(newChallengeData.end) : undefined,
        hashtags:
          newChallengeData.hashtags.length > 0
            ? newChallengeData.hashtags
            : undefined,
      },
      identity
    )
  );
  const challengeId = await addChallenge(newChallenge);
  if (challengeId) {
    res.status(200).send(JSON.stringify({ challengeId }));
  } else {
    throw new Error("Cannot write challenge");
  }
}
