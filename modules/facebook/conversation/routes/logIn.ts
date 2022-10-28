

import {LogInEvent} from '../integrations/logIn';
import {OneWePrivateConversationHandler} from
  './../oneWePrivateConversationHandler';
import * as notifications from './notifications';
import * as fbSchemas from "../../schemas";

export const makeLoggingInButton = (recipientId: string) : fbSchemas.Messenger.Message => {
  return {
    attachment: {
      payload: {
        template_type: 'button',
        text:
        `Para iniciar, pedimos permisos de Facebook \
  para leer su perfil público y publicaciones en el WeVerse.`,
        buttons: [
          {
            title: 'Dar permisos.',
            type: 'web_url',
            url: 'https://onewe.tech/api/logIn/createRequest?psid=' + recipientId,
          },
        ],
      },
      type: 'template',
    },
  };
};


export const request = (params: Record<string, any>) => {
  return new OneWePrivateConversationHandler(
      params.senderId).send(makeLoggingInButton(params.senderId));
};

export const event = (params: Record<string, any>) => {
  const logInEvent = (params as LogInEvent);
  const convoHandler = new OneWePrivateConversationHandler(logInEvent.userId);
  if (logInEvent.type == 'Registering') {
    const registeringUserMessage = {
      text: `Un segundo por favor mientras te registramos.`,
    };
    return convoHandler.send(registeringUserMessage);
  } else {
    const explainNotifications = {
      text: `¡Gracias por iniciar sesión!
      
En el universo de OneWe (WeVerse) nuestro juego principal es la WeRace. \
Durante la WeRace, tienes muchas oportunidades de \
ganar prestigio y muchos otros beneficios mientras \
todos juntos generamos impacto social 😻. \

Para poder participar en la WeRace, nuestras notificaciones \
diarias te ayudaran a recordar y mantenerte informad@ \
por favor acceptalas.`,
    };
    return convoHandler.sendMultiple(
        [explainNotifications, notifications.optInMessage]);
  }
};
