import {OneWePrivateConversationHandler}
  from '../oneWePrivateConversationHandler';
import * as schemas from '../../schemas';

const joinOrAction : schemas.MessengerMessage = {
  attachment: {
    payload: {
      template_type: 'button',
      text:
`El nombre del grupo WeVerse actual es 'OneWe MVP 1'. \
Tenemos problemas con tu membresía o permisos del grupo.

Este botón te lleva al grupo, allí puedes puedes ingresar y \
después alguien te debería dar el rol de Admin \
para poder hacer este experimento.

Avísame cuando te hayas unido al grupo y tengas el rol de Admin \
con "Me he unido" o si necesitas ayuda con "Ayudame con el grupo".`,
      buttons: [
        {
          title: 'Únete acá.',
          type: 'web_url',
          url: `https://www.facebook.com/groups/737230100931116`,
        },
      ],
    },
    type: 'template',
  },
  quick_replies: [
    {
      content_type: 'text',
      title: 'Me he unido.',
      payload: 'Said.Entered',
    }, {
      content_type: 'text',
      title: 'Ayudame con el grupo.',
      payload: 'Help.General.Group',
    },
  ],
};

export const promptJoinGroup = async (params: Record<string, any>) => {
  const convoHandler = new OneWePrivateConversationHandler(
      params.senderId);
  return convoHandler.send(joinOrAction);
};
