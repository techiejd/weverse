import { UserData } from '../../db/schemas';
import { Messenger } from '../schemas';
import {z} from 'zod';

export const prettifyJSON = (json: Record<string, any>) => JSON.stringify(
  json, null, 2).replace('{', '').replace('}', '');

// TODO(techiejd): split into schemas.
export const messageType = z.enum(["Notify", "Response"]);
export type MessageType = z.infer<typeof messageType>;

export const buttonInfo = z.object({
  title: z.string(),
  payload: z.string().optional(),
  url: z.string().optional(),
})
export type ButtonInfo = z.infer<typeof buttonInfo>;

export type QuickReplyInfo = {title: string, payload: string};

export const buttonInfoToButton = (buttonInfo: ButtonInfo) => {
  return buttonInfo.payload ? {
    title: buttonInfo.title,
    type: 'postback',
    payload: buttonInfo.payload,
  } : {
    title: buttonInfo.title,
    type: 'web_url',
    url: buttonInfo.url,
    // TODO(techiejd): Deal with this.
    messenger_extensions: false, // buttonInfo.url?.startsWith('https://onewe.tech') ? true : false,
  };
};

const quickReplyInfoToQuickReply = (info: QuickReplyInfo) : Messenger.QuickReply=> ({
  content_type: "text",
  title: info.title,
  payload: info.payload
});

export const makeMessage = (text: string,
    buttonInfos : Array<ButtonInfo> = [],
    quickReplyInfos: Array<QuickReplyInfo> = [],
    ) : Messenger.Message => {
      let message : Messenger.Message;
      if (buttonInfos.length > 0) {
        message = {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'button',
              text: text,
              buttons: buttonInfos.map(buttonInfoToButton),
            },
          },
        }
      } else {
        message = {
          text: text
        }
      }

      if (quickReplyInfos.length > 0) {
        message = {
          ...message,
          quick_replies: quickReplyInfos.map(quickReplyInfoToQuickReply)
        }
      }

      return message;
    };


export namespace Notify {
  export const getTemplaters = (user: UserData) => {
    const templateBody = (body: string) => {
      const templateFunc =
          new Function('user', 'return `' + body + '`;');
      const userFacingInfo = {
        name: user.name,
        resources: user.gameInfo.resources,
        psid: user.psid,
      };
      return String(templateFunc(userFacingInfo));
    };

    const templateButton = (untemplatedButtonInfo: ButtonInfo) => {
      const templatedTitle = templateBody(untemplatedButtonInfo.title);
      return untemplatedButtonInfo.url ? {
        title: templatedTitle,
        url: templateBody(untemplatedButtonInfo.url)
      } : {
        title: templatedTitle,
        payload: templateBody(String(untemplatedButtonInfo.payload))
      }
    }

    return {templateBody, templateButton};
  }
}