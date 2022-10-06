import * as schemas from '../../schemas';
import {search} from './admin/search';
import {notify} from './admin/notify';
import {OneWePrivateConversationHandler} from
  './../oneWePrivateConversationHandler';
import {logger} from '../../../../common/logger';

const respondToUserWelcome :
schemas.MessengerMessage = {
  attachment: {
    payload: {
      'template_type': 'button',
      'text': 'Hola WeMember! Qué te gustaría hacer hoy?',
      'buttons': [
        {
          'type': 'postback',
          'title': 'Consultar concurso',
          'payload': 'Consult.Competition',
        },
        {
          'type': 'postback',
          'title': 'Reglas: ¿Cómo funciona?',
          'payload': 'Consult.Rules',
        },
      ],
    },
    type: 'template',
  },
};

const wrapMessage = (
    message : schemas.MessengerMessage) => {
  return (params: Record<string, any>) => {
    return new OneWePrivateConversationHandler(
        params.senderId).send(message);
  };
};

export const userWelcome = wrapMessage(respondToUserWelcome);
export const thank = wrapMessage({text: `¡Con mucho gusto!`});

export const fallback = (params: Record<string, any>) => {
  const adminHandler =
  new OneWePrivateConversationHandler.OneWeToAdminConversationHandler();
  if (params['senderId'] != adminHandler.recipient) {
    return Promise.resolve();
  }
  const message = params['Admin'].message;
  const command = (() => {
    const commands = ['search', 'notify'];
    const foundCommand =
    commands.find((command) => message.startsWith(command));
    return foundCommand;
  })();

  switch (command) {
    case 'search':
      return search(params);
    case 'notify':
      return notify(params);
    default:
      logger.error('In default admin route but no command found');
      return adminHandler.send({text: 'no command found'});
  }
};
