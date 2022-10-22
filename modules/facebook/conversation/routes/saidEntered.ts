import {OneWePrivateConversationHandler} from
  './../oneWePrivateConversationHandler';
import * as schemas from '../../schemas';
import {GroupHandler} from '../../utils';
import {promptJoinGroup} from './promptJoinGroup';

export const saidEntered = async (params: Record<string, any>) => {
  const convoHandler = new OneWePrivateConversationHandler(
      params.senderId);
  return GroupHandler.isUserInWeVerse(params.senderId).then((success) => {
    if (success) {
      const successMessage: schemas.Messenger.Message = {
        text: `¡Bien hecho! Todo bien. Deberias tener 1000 ⚡
No se te olvide; puedes decir lo siguiente a cualquier hora: `,
        quick_replies: [
          {
            'content_type': 'text',
            'title': 'Consultar concurso',
            'payload': 'Consult.Competition',
          }, {
            'content_type': 'text',
            'title': 'Reglas: ¿Cómo funciona?',
            'payload': 'Consult.Rules',
          }, {
            'content_type': 'text',
            'title': 'Entendido, gracias!',
            'payload': 'Default.Thank',
          },
        ],
      };
      return convoHandler.send(successMessage);
    } else {
      return promptJoinGroup(params);
    }
  });
};
