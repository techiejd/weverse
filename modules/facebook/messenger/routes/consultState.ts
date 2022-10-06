import {getUserSnapshot} from '../../../../common/db';
import {makeLoggingInButton} from './logIn';
import * as notifications from './notifications';
import {OneWePrivateConversationHandler} from
  './../oneWePrivateConversationHandler';
import {GroupHandler} from '../../utils';
import {promptJoinGroup} from './promptJoinGroup';

export const consultState = async (params: Record<string, any>) => {
  const convoHandler = new OneWePrivateConversationHandler(
      params.senderId);
  try {
    const userSnapshot = await getUserSnapshot(params.senderId);
    const user = userSnapshot.data();
    if (user.notifications_permissions) {
      return GroupHandler.isUserInWeVerse(params.senderId).then((success) => {
        if (success) {
          return convoHandler.send({
            text: `Todo bien`,
          });
        } else {
          return promptJoinGroup(params);
        }
      });
    } else {
      convoHandler.send({
        text: `Hola, todavía falta dar permisos de notificaciones diarias.`,
      });
      return convoHandler.send(notifications.optInMessage);
    }
  } catch (error) {
    if ((error as Error).message == 'LOG_IN_NECESSARY') {
      return convoHandler.sendMultiple(
          [{text: 'Aun necesitas dar permisos de Facebook'},
            makeLoggingInButton(params.senderId)]);
    } else {
      return convoHandler.send({text: `Error en consultUserState, \
por favor contactar support@onewe.foundation.`});
    }
  }
};
