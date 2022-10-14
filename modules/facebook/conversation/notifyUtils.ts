import {getAllUsersSnapshot} from '../../../common/db';
import {OneWePrivateConversationHandler} from
  './oneWePrivateConversationHandler';
import * as schemas from '../schemas';
import {logger} from '../../../common/logger';
import { userData, UserData } from '../../db/schemas';

export const notifyAllUsers = async (createMessageForUser: (
  user: UserData) => Promise<schemas.MessengerMessage>) => {
  return getAllUsersSnapshot().then((userSnapshots) => {
    return userSnapshots.forEach(async (userSnapshot) => {
      const user = userData.parse(userSnapshot.data());
      const convoHolder = new OneWePrivateConversationHandler(user.psid);
      if (user.notifications_permissions == undefined) {
        logger.warn(
          {user: user},
            'user without notification permissions');
        return;
      }
      const message : schemas.MessengerMessage = await createMessageForUser(user);
      return convoHolder.notify(
          message, user.notifications_permissions.token);
    });
  });
};
