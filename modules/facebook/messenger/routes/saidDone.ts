import {Resource} from './../../../sofia/schemas';
import {OneWePrivateConversationHandler} from
  './../oneWePrivateConversationHandler';
import * as schemas from '../../schemas';
import {getUserSnapshot} from '../../../../common/db';
import {GroupHandler} from '../../utils';
import {consultResources} from './consultResources';
import {whatIsYourLie} from '../integrations/firstChallenge';

const callToPost : schemas.MessengerMessage = {
  attachment: {
    payload: {
      template_type: 'button',
      text:
`El nombre del grupo WeVerse actual es 'OneWe MVP 1'. \
Sofí no ve tu publicación.
¡Puedes ver el video al respecto en este enlace si tienes alguna duda! \
https://youtu.be/OXTH2RAU8l0.

Este botón te lleva al grupo, allí puedes puedes ingresar y hacer \
la publicación para presentarte con una mentira y dos verdades.`,
      buttons: [
        {
          title: 'Publica acá.',
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
      title: 'Listo, publiqué.',
      payload: 'Said.Done',
    }, {
      content_type: 'text',
      title: 'Ayudame con el grupo.',
      payload: 'Help.General.Group',
    },
  ],
};

export const consumeResources = async (psid: string) => {
  return getUserSnapshot(psid).then((userSnapshot) => {
    return userSnapshot.ref.update({
      ['gameInfo.resources.' + Resource.Camera]: 0,
      ['gameInfo.resources.' + Resource.Mask]: 0,
    });
  });
};

export const saidDone = (params: Record<string, any>) => {
  const convoHandler = new OneWePrivateConversationHandler(
      params.senderId);
  convoHandler.send({
    text: 'Sofí va a mirar si tienes una publicación ya en el grupo',
  });
  return GroupHandler
      .userHasSingleWeVersePost(params.senderId).then((success) => {
        if (success) {
          const usedResourcesMessage: schemas.MessengerMessage = {
            text: `Has usado sabiamente tus recursos, consumiste  1 cámara \
(${Resource.Camera}) y  1 mascará (${Resource.Mask}) de impostor`,
          };
          return consumeResources(params.senderId).then(() => {
            return convoHandler.send(usedResourcesMessage).then(() => {
              return consultResources(params).then(() => {
                return convoHandler.send(whatIsYourLie);
              });
            });
          });
        } else {
          return convoHandler.send(callToPost);
        }
      });
};
