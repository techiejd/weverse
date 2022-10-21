import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserSnapshot } from '../../../../common/db';
import { OneWePrivateConversationHandler } from '../../../../modules/facebook/conversation/oneWePrivateConversationHandler';
import {z} from "zod";

const candidate2VotesSchema = z.record(z.number());

export default function vote(
  req: NextApiRequest,
  res: NextApiResponse
) {
      const psid = String(req.query.psid);
      const weRace = String(req.query.werace);
      getUserSnapshot(psid).then(async (userSnapshot) => {
        const candidate2Votes = candidate2VotesSchema.parse(req.body);
        userSnapshot.ref.update({
          [`challenges.${weRace}.votes`]: candidate2Votes,
        });

        new OneWePrivateConversationHandler(psid).send({text: '👏 Votaste!'});
      });
    };
