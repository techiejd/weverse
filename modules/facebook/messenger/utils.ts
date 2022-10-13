import { UserData } from '../../db/schemas';
import { MessengerMessage, QuickReply } from '../schemas';

export const prettifyJSON = (json: Record<string, any>) => JSON.stringify(
  json, null, 2).replace('{', '').replace('}', '');

export type ButtonInfo = {title: string, payload: string, url?:never} |
{title:string, payload?: never, url: string};

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

const quickReplyInfoToQuickReply = (info: QuickReplyInfo) : QuickReply=> ({
  content_type: "text",
  title: info.title,
  payload: info.payload
});

export const makeMessage = (text: string,
    buttonInfos : Array<ButtonInfo> = [],
    quickReplyInfos: Array<QuickReplyInfo> = [],
    ) : MessengerMessage => {
      let message : MessengerMessage;
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