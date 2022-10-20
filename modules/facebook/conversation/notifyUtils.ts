import {getAllUsersSnapshot} from '../../../common/db';
import {OneWePrivateConversationHandler} from
  './oneWePrivateConversationHandler';
import * as schemas from '../schemas';
import {logger} from '../../../common/logger';
import { userData, UserData } from '../../db/schemas';

// TODO(techiejd): Clean up notify.
export const notifyAllUsers = async (createMessageForUser: (
  user: UserData) => Promise<schemas.Messenger.Message>) => {
  const adminConvoHolder = new OneWePrivateConversationHandler.OneWeToAdminConversationHandler();
  
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
      const message : schemas.Messenger.Message = await createMessageForUser(user);

      if (adminConvoHolder.recipient == convoHolder.recipient) {
        //TODO(techiejd): Get whatsapp better integrated
      adminConvoHolder.sendWhatsApp({body: JSON.stringify(message)});
      }

      return convoHolder.notify(
          message, user.notifications_permissions.token);
    });
  });
};
