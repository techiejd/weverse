import {OneWePrivateConversationHandler} from
  './../oneWePrivateConversationHandler';
import {learnAbout} from './../integrations/secondChallenge';

export const consultCompetition = (params: Record<string, any>) => {
  const convoHandler = new OneWePrivateConversationHandler(
      params.senderId);
  return convoHandler.send(learnAbout);
};
