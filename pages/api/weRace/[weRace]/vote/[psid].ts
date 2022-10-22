import type { NextApiRequest, NextApiResponse } from 'next';
import {z} from "zod";
import { getUserSnapshot } from '../../../../../common/db';
import { OneWePrivateConversationHandler } from '../../../../../modules/facebook/conversation/oneWePrivateConversationHandler';

const candidate2VotesSchema = z.record(z.number());

export default function vote(
  req: NextApiRequest,
  res: NextApiResponse
) {
      const psid = String(req.query.psid);
      const weRace = String(req.query.weRace);
      getUserSnapshot(psid).then(async (userSnapshot) => {
        const candidate2Votes = candidate2VotesSchema.parse(JSON.parse(req.body));
        userSnapshot.ref.update({
          [`challenges.${weRace}.votes`]: candidate2Votes,
        }).then(() => res.status(200).end());

        new OneWePrivateConversationHandler(psid).send({text: '👏 Votaste!'});
      });
    };
