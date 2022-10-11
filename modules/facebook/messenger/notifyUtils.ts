import {getAllUsersSnapshot} from '../../../common/db';
import {OneWePrivateConversationHandler} from
  './oneWePrivateConversationHandler';
import * as schemas from '../schemas';
import {logger} from '../../../common/logger';
import { userData, UserData } from '../../db/schemas';

export type notifyMessageLoad =
{message: schemas.MessengerMessage, createMessageForUser?: never} |
{message?: never, createMessageForUser:(
  user: UserData) => Promise<schemas.MessengerMessage>};

export const notifyAllUsers = async (load: notifyMessageLoad) => {
  return getAllUsersSnapshot().then((userSnapshots) => {
    return userSnapshots.forEach(async (userSnapshot) => {
      const user = userSnapshot.data();
      const convoHolder = new OneWePrivateConversationHandler(user.psid);
      if (user.notifications_permissions == undefined) {
        logger.warn(
          {user: user},
            'user without notification permissions');
        return;
      }
      const message : schemas.MessengerMessage = load.message ? load.message :
      await load.createMessageForUser(userData.parse(user));
      return convoHolder.notify(
          message, user.notifications_permissions.token);
    });
  });
};
