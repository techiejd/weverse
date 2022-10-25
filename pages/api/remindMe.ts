import type { NextApiRequest, NextApiResponse } from 'next'
import {logger} from '../../common/logger';
import {z} from 'zod';
import * as fbSchemas from '../../modules/facebook/schemas';
import * as utils from '../../modules/remindMe/utils';
import * as ConversationHandler from '../../modules/facebook/conversation/oneWePrivateConversationHandler';

const remindMeBody = z.object({
  psid: z.string(),
  message: z.string(), // fbSchemas.Messenger.message
  create: z.object({
    inHowManySeconds: z.number(),
  }).optional()
});

export default function remindMe(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {psid, message, create} = remindMeBody.parse(req.body);
  const messageParsed = fbSchemas.Messenger.message.parse(JSON.parse(message));

  if (create) {
    utils.setReminder(psid, messageParsed, create.inHowManySeconds);
    logger.info({psid, message, inHowManySeconds: create.inHowManySeconds}, "Reminder created");
  } else {
    const convoHandler = new ConversationHandler.OneWePrivateConversationHandler(psid);
    convoHandler.send(messageParsed);
  }
  res.status(200).end();
};
