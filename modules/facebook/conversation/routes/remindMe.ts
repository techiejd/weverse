import { OneWePrivateConversationHandler } from "../oneWePrivateConversationHandler";
import { setReminder } from '../../../remindMe/utils';
import * as fbSchemas from '../../schemas';
import * as conversationUtils from '../utils';
const thisRoute = 'Remind.Me';

export const remindMe = (params: Record<string, any>) => {
  const [inHowManySeconds, psid, ...splitMessage] = params[thisRoute];
  const message = splitMessage.join('.');
  if (inHowManySeconds == '') {
    const reminderPayloadSeconds = (seconds: number) => `${thisRoute}.${seconds}.${psid}.${message}`;

    const convoHandler = new OneWePrivateConversationHandler(psid);
    const messageAskingInHowLong : fbSchemas.MessengerMessage = conversationUtils.makeMessage(
      "¿En cuanto tiempo?",
      [
        {title: "Media hora.", payload: reminderPayloadSeconds(1800)},
        {title: "2 horas.", payload: reminderPayloadSeconds(7200)},
        {title: "4 horas.", payload: reminderPayloadSeconds(14400)},
      ],
      [
        {title: "8 hrs", payload: reminderPayloadSeconds(28800)},
        {title: "16 hrs", payload: reminderPayloadSeconds(57600)},
        {title: "20 hrs", payload: reminderPayloadSeconds(72000)},
      ]
    )
    return convoHandler.send(messageAskingInHowLong);
  } else {
    setReminder(psid, message, Number(inHowManySeconds));
  }
};
