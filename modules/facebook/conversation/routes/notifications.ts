import {OneWePrivateConversationHandler} from
  './../oneWePrivateConversationHandler';
import * as schemas from '../../schemas';
import {consultCompetition} from './consultCompetition';
import {promptJoinGroup} from './promptJoinGroup';
import {startingUserGameInfo} from '../../../sofia/schemas';
import {getUserSnapshot} from '../../../../common/db';
import {GroupHandler} from '../../utils';
import {prettifyJSON} from '../utils';

export const optInMessage = {
  'attachment': {
    'type': 'template',
    'payload': {
      'template_type': 'notification_messages',
      'title': 'Recibir notificación de los concursos.',
      'payload': 'Accept.Notifications',
      'notification_messages_frequency': 'DAILY',
      'notification_messages_reoptin': 'ENABLED',
    },
  },
};

export const request = async (params: Record<string, any>) => {
  return new OneWePrivateConversationHandler(
      params.senderId).send(optInMessage);
};

const addNotificationInfoToUser = async (
    psid: string, optInInfo: schemas.Messenger.OptInEvent) => {
  return getUserSnapshot(psid).then((userSnapshot) => {
    return userSnapshot.ref.update({
      notifications_permissions: {
        token: optInInfo.notification_messages_token,
        expires: optInInfo.token_expiry_timestamp,
      },
    });
  });
};

export const accepted = async (
    params: Record<string, any>) => {
  const optInInfo =
  schemas.Messenger.optInEvent.parse(params['Accept.Notifications']);
  const convoHandler = new OneWePrivateConversationHandler(
      params.senderId);

  const thankYouForOptingInMessage : schemas.Messenger.Message = {
    text: `Gracias por recibir notificaciones. \
Ya casí terminamos acá! Vamos a verificar que todo este bien.`,
  };
  convoHandler.send(thankYouForOptingInMessage);

  addNotificationInfoToUser(params.senderId, optInInfo);

  return GroupHandler
      .isUserInWeVerse(params.senderId).then(async (successful) => {
        if (successful) {
          const youreReadyMessage : schemas.Messenger.Message = {
            text: `¡Te uniste al WeVerse!

Ok, hasta ahora has:
- Iniciado sesión
- Dado los permisos
- Unido al WeVerse
    
¡Bien hecho! ¡Mírate! Entrar no es fácil. 

Acá en WeVerse, premiamos todo tipo de trabajo. \
Por ello, te enviaremos 1000 ⚡ (WEEN).
    
De nuevo, felicitaciones.`,
          };
          return convoHandler.send(youreReadyMessage).then(() => {
            const moneySentCheckResourcesMessage : schemas.Messenger.Message = {
              'text': `Acá están los 1000 ⚡ que prometimos. \
Puede decir 'consultar recursos' en cualquier momento \
para ver sus recursos en la WeBag: ` +
prettifyJSON(startingUserGameInfo.resources),
              'quick_replies': [
                {
                  'content_type': 'text',
                  'title': 'Consultar recursos.',
                  'payload': 'Consult.Resources',
                }, {
                  'content_type': 'text',
                  'title': 'Entendido, gracias!',
                  'payload': 'Default.Thank',
                },
              ],
            };
            return convoHandler.send(
                moneySentCheckResourcesMessage).then(() => {
              return consultCompetition(params);
            });
          });
        } else { // not successful
          return promptJoinGroup(params);
        }
      });
};
