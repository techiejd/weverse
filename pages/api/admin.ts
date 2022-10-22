import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import {logger} from '../../common/logger';
import * as fbSchemas from '../../modules/facebook/schemas';
import * as conversationUtils from "../../modules/facebook/conversation/utils";
import { changesInResources, ChangesInResources, resourceEnum, userData, UserData, transaction as schemasTransaction, TxDatum, User as TxUser, TxMessage } from '../../modules/db/schemas';
import { addTx, getAllUsersSnapshot } from '../../common/db';
import { OneWePrivateConversationHandler } from '../../modules/facebook/conversation/oneWePrivateConversationHandler';

export const config = {
  api: {
    bodyParser: false,
    sizeLimit: '200mb',
  }
};

const templateWhatsAppMessage = (message: string, buttons:Array<conversationUtils.ButtonInfo>, users: Array<string>) => {
  const annotatedMessage = `for: ${users.length > 0 ? JSON.stringify(users) : `all`}
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
  let usersOfInterest = Array<string>();
  let usersOfInterestTxData = Array<TxUser>();
  let messagedUsers = Array<string>();
  let message = "";
  let buttons = Array<conversationUtils.ButtonInfo>();
  let messageType : conversationUtils.MessageType = "Response";
  let resourcesChange : ChangesInResources = {};
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
    usersOfInterest = JSON.parse(String(fields["users"]));
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
  
    await getAllUsersSnapshot().then((userSnapshots) => {
      return userSnapshots.forEach(async (userSnapshot) => {
        const user = userData.parse(userSnapshot.data());
        if (usersOfInterest.length > 0 && 
          !usersOfInterest.includes(user.psid)) {return};
        usersOfInterestTxData.push({name: user.name, id: user.psid});

        const updateResources = () => {
          const resourcesUpdateEntries = Object.entries(resourcesChange).map(
            ([resource, change]) => ['gameInfo.resources.' + resource, user.gameInfo.resources[resourceEnum.parse(resource)] + change]);
          if (resourcesUpdateEntries.length > 0) {
            return userSnapshot.ref.update(Object.fromEntries(resourcesUpdateEntries));
          }
        }
        const messageUser = async () => {
          const preparedMessage : fbSchemas.Messenger.Message = await prepareMessage(user);
          if (preparedMessage == "") {
            return Promise.resolve();
          }

          const convoHolder = new OneWePrivateConversationHandler(user.psid);
          
          if (messageType == "Response") {
            return convoHolder.send(preparedMessage);
          }
          if (user.notifications_permissions == undefined) {
            const errorMessage = 'user without notification permissions';
            logger.error(
              {user: user},
              errorMessage);
            // TODO(techiejd): Look into what happens if the error causes an early return wrt db.
            throw new Error(errorMessage);
          }
          return convoHolder.notify(
            preparedMessage, user.notifications_permissions.token);
        }

        if (message == "") {
          updateResources();
        } else {
          messageUser().then(() => {
            messagedUsers.push(user.name);
            updateResources();
          })
        }
      });
    });

  let txData = Array<TxDatum>();

  if (message != "") {
    adminConvoHolder.sendWhatsApp({body: templateWhatsAppMessage(message, buttons, messagedUsers)});

    let txMessage : TxMessage = {
      type: messageType,
      text: message,
    };
    if (buttons.length > 0) {
      txMessage = {...txMessage, buttons};
    }
    txData.push({type: "message", message: txMessage});
  }
  if (Object.entries(resourcesChange).length > 0) {
    txData.push({type: "resourcesChange", resourcesChange})
  }

  const tx = schemasTransaction.parse({
    from: {
      actingAsSofi: true, // Admin
      name: "Nico",
      id: process.env.ADMIN_ID
    },
    to: usersOfInterestTxData,
    data: txData,
    createdAt: (new Date()).toISOString()
  })

  addTx(tx);

  res.status(200).end();
};
