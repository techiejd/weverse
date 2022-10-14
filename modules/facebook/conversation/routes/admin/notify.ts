import {OneWePrivateConversationHandler} from
  '../../oneWePrivateConversationHandler';
import {notifyAllUsers} from '../../notifyUtils';
import * as schemas from '../../../schemas';
import * as conversationUtils from '../../utils';
import {getBody, getCommand} from './utils';
import {getUserSnapshot} from '../../../../../common/db';
import { userData, UserData } from '../../../../db/schemas';

export const notify = async (params: Record<string, any>) => {
  const adminHandler =
  new OneWePrivateConversationHandler.OneWeToAdminConversationHandler();

  const closeNotifyChannel = () => adminHandler.deleteUserMenu();
  closeNotifyChannel();

  const command = getCommand(params);
  const body = getBody(params);
  const isSend = command.includes('send');
  const isButtonNotification = command.includes('button:');

  const prepareMessage = (
      user:UserData) :
      Promise<schemas.MessengerMessage> => {
    const templatedBody = conversationUtils.Notify.getTemplaters(user).templateBody(body);
    const [extractedMessage, extractedButtons] = (() => {
      if (isButtonNotification) {
        const buttons = new Array<conversationUtils.ButtonInfo>();
        const numButtons = parseInt(
            command.substring(command.indexOf(':') + 1)[0]);
        const bodyByLine = templatedBody.split('\n');
        for (let i = 0; i < numButtons; i++) {
          const title = bodyByLine[i * 2];
          const url = bodyByLine[i * 2 + 1];
          buttons.push({title: title, url: url});
        }
        const message = bodyByLine.slice(numButtons * 2).join('\n');
        return [message, buttons];
      }
      return [templatedBody, []];
    })();

    const message : schemas.MessengerMessage = isButtonNotification ?
    conversationUtils.makeMessage(extractedMessage, extractedButtons) : {
      text: extractedMessage,
    };

    return Promise.resolve(message);
  };

  if (isSend) {
    return notifyAllUsers(prepareMessage);
  } else {
    return getUserSnapshot(adminHandler.recipient).then(
        async (userSnapshot) => {
          return adminHandler.send(await prepareMessage(userData.parse(userSnapshot.data())));
        });
  }
};
