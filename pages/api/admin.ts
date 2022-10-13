import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import {logger} from '../../common/logger';
import * as fbSchemas from '../../modules/facebook/schemas';
import * as messengerUtils from "../../modules/facebook/messenger/utils";
import * as notifyUtils from '../../modules/facebook/messenger/notifyUtils';
import { UserData } from '../../modules/db/schemas';

export const config = {
  api: {
    bodyParser: false,
    sizeLimit: '200mb',
  }
};

export default async function admin(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let message = "";
  let buttons = Array<messengerUtils.ButtonInfo>();

  const form = new formidable.IncomingForm({ multiples: true });
  form.parse(req, async function (err, fields, files) {
    // TODO(techiejd): Look into files
    logger.info({error: err, files: files, fields: fields}, "info");
    message = String(fields["message"]);
    buttons =JSON.parse(String(fields["buttons"]));
  });

  const prepareMessage = (user:UserData) :
    Promise<fbSchemas.MessengerMessage> => {
      const templaters = messengerUtils.Notify.getTemplaters(user);
      const isButtonNotification = buttons.length > 0;

      const templatedMessage = templaters.templateBody(message);
      const templatedButtons = buttons.map(templaters.templateButton);

      const messengerMessage : fbSchemas.MessengerMessage = isButtonNotification ?
      messengerUtils.makeButtonMessage(templatedMessage, templatedButtons) : {
        text: templatedMessage,
      };

      return Promise.resolve(messengerMessage);
    }
  
  notifyUtils.notifyAllUsers(prepareMessage);
  
  res.status(200).end();
};

export function templateBody(message: string): string {
  throw new Error('Function not implemented.');
}
