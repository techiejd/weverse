import type { NextApiRequest, NextApiResponse } from "next";
import { challenge, Challenge } from "../../../modules/sofia/schemas";
import { addChallenge } from "../../../common/db";
import { firestore } from "firebase-admin";
import { identity, pickBy } from "lodash";

export default async function admin(req: NextApiRequest, res: NextApiResponse) {
  let body = JSON.parse(req.body);
  const parseDate = (date: string) =>
    firestore.Timestamp.fromDate(new Date(date));
  let newChallenge: Challenge = challenge.parse(
    pickBy(
      {
        title: body.title,
        start: parseDate(body.start),
        end: body.end ? parseDate(body.end) : undefined,
        hashtags: body.hashtags.length > 0 ? body.hashtags : undefined,
      },
      identity
    )
  );
  const timeStamp = Date.parse(newChallenge.start);
  console.log(newChallenge);
  console.log(timeStamp);
  const challengeId = await addChallenge(newChallenge);
  res.status(200).end("challengeId");
}
