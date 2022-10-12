import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import {logger} from '../../common/logger';
import * as fbSchemas from '../../modules/facebook/schemas';
import * as fbUtils from '../../modules/facebook/utils';
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
  const form = new formidable.IncomingForm({ multiples: true });
  let message = "";

  form.parse(req, async function (err, fields, files) {
    logger.info({error: err, files: files, fields: fields}, "info");
    message = String(fields["message"]);
  });

  const prepareMessage = (user:UserData) :
    Promise<fbSchemas.MessengerMessage> => {
      message = messengerUtils.Notify.templateBody(message, user);

      // TODO(jimenez1917): Fix buttons
      const buttons = Array<fbUtils.ButtonInfo>();
      const isButtonNotification = buttons.length > 0;

      const messengerMessage : fbSchemas.MessengerMessage = isButtonNotification ?
      fbUtils.makeButtonMessage(message, buttons) : {
        text: message,
      };

      return Promise.resolve(messengerMessage);
    }
  
  notifyUtils.notifyAllUsers(prepareMessage);
  
  res.status(200).end();
};