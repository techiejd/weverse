import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import {logger} from '../../common/logger';
import * as fbSchemas from '../../modules/facebook/schemas';
import * as conversationUtils from "../../modules/facebook/conversation/utils";
import { changesInResources, ChangesInResources, resourceEnum, userData, UserData } from '../../modules/db/schemas';
import { getAllUsersSnapshot } from '../../common/db';
import { OneWePrivateConversationHandler } from '../../modules/facebook/conversation/oneWePrivateConversationHandler';

export const config = {
  api: {
    bodyParser: false,
    sizeLimit: '200mb',
  }
};

const templateWhatsAppMessage = (message: string, buttons:Array<conversationUtils.ButtonInfo>) => {
  const annotatedMessage = `for: all
${message}`;

  if (buttons.length == 0) {
    return annotatedMessage;
  }

  let prevMessage = annotatedMessage;
  for (const button of buttons) {
    if (button.title == undefined) {
      continue;
    }
    prevMessage = `${prevMessage}
${button.title} : ${button.url}`
  }
  return prevMessage;
}

export default async function admin(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let users = Array<string>();
  let notifiedUsers = Array<string>();
  let message = "";
  let buttons = Array<conversationUtils.ButtonInfo>();
  let messageType : conversationUtils.MessageType;
  let resourcesChange : ChangesInResources;
  const adminConvoHolder = new OneWePrivateConversationHandler.OneWeToAdminConversationHandler();

  const form = new formidable.IncomingForm({ multiples: true });
  form.parse(req, async function (err, fields, files) {
    // TODO(techiejd): Look into files
    logger.info({error: err, files: files, fields: fields}, "admin parsed form");
    message = String(fields["message"]);
    messageType = conversationUtils.messageType.parse(fields["messageType"]);
    const nonStringResourcesChange = JSON.parse(String(fields["resourcesChange"]));
    resourcesChange = changesInResources.parse(nonStringResourcesChange);
    const nonStringButtons = JSON.parse(String(fields["buttons"]));
    buttons = conversationUtils.buttonInfo.array().parse(nonStringButtons);
    users = JSON.parse(String(fields["users"]));
  });

  const prepareMessage = (user:UserData) :
    Promise<fbSchemas.Messenger.Message> => {
      const templaters = conversationUtils.Notify.getTemplaters(user);

      const templatedMessage = templaters.templateBody(message);
      const templatedButtons = buttons.map(templaters.templateButton);

      const internalMessage = conversationUtils.makeMessage(
        templatedMessage,
        templatedButtons);

      const messengerMessage : fbSchemas.Messenger.Message = conversationUtils.makeMessage(
        templatedMessage,
        templatedButtons,
        [{title: "Recuerdame después.", payload: `Remind.Me..${user.psid}.${internalMessage}`}]);

      return Promise.resolve(messengerMessage);
    }
  
    getAllUsersSnapshot().then((userSnapshots) => {
      return userSnapshots.forEach(async (userSnapshot) => {
        const user = userData.parse(userSnapshot.data());

        if (!users.includes(user.psid)) {return};


        const convoHolder = new OneWePrivateConversationHandler(user.psid);
        if (user.notifications_permissions == undefined) {
          logger.warn(
            {user: user},
              'user without notification permissions');
          return;
        }
        const message : fbSchemas.Messenger.Message = await prepareMessage(user);

        const resourcesUpdateEntries = Object.entries(resourcesChange).map(
          ([resource, change]) => ['gameInfo.resources.' + resource, user.gameInfo.resources[resourceEnum.parse(resource)] + change]);
        if (resourcesUpdateEntries.length > 0) {
          userSnapshot.ref.update(Object.fromEntries(resourcesUpdateEntries));
        }

        if (messageType == "Notify") {
          return convoHolder.notify(
            message, user.notifications_permissions.token);
        }
        return convoHolder.send(message);
      });
    })
  
  adminConvoHolder.sendWhatsApp({body: templateWhatsAppMessage(message, buttons)});

  res.status(200).end();
};

export function templateBody(message: string): string {
  throw new Error('Function not implemented.');
}
