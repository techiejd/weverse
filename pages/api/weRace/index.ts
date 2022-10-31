import type { NextApiRequest, NextApiResponse } from "next";
import { challenge, Challenge } from "../../../modules/sofia/schemas";
import { addChallenge } from "../../../common/db";
import { firestore } from "firebase-admin";
import { identity, pickBy } from "lodash";

export default async function vote(req: NextApiRequest, res: NextApiResponse) {
  const incomingChallenge = challenge.parse(JSON.parse(req.body));
  const newChallenge: Challenge = challenge.parse(
    pickBy(
      {
        ...incomingChallenge,
        hashtags:
        incomingChallenge.hashtags!.length > 0
            ? incomingChallenge.hashtags
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
