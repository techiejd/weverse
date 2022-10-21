import fetch from 'node-fetch';
import * as schemas from './schemas';
import {getUserSnapshot} from '../../common/db';
import {logger} from '../../common/logger';
import { ButtonInfo, buttonInfoToButton } from './conversation/utils';

export const getPaginatedData =
(url:string) : Promise<Record<string, unknown>[]> => {
  return fetch(url, {
    method: 'GET',
  }).then(async (response) => {
    if (!response.ok) {
      response.text().then((text) => {
        throw new Error('Error in fetching paginated data: ' + text);
      });
    }
    return response.json().then(async (response) => {
      const paginatedData = schemas.paginatedData.parse(response);
      const next = paginatedData.paging?.next;
      return next ?
        paginatedData.data.concat(await getPaginatedData(next)) :
        paginatedData.data;
    });
  });
};

export const getFlattenedPaginatedData = async (
    startPaginatedData : schemas.PaginatedData
) => {
  const next = startPaginatedData.paging?.next;
  return next ?
  startPaginatedData.data.concat(await getPaginatedData(next)) :
  startPaginatedData.data;
};

/**
 * Handles a page's conversation
 */
export class PrivateConversationHandler {
  /**
   *
   * @param {string} token for the page it's sending for
   * @param {string} id for the page it's sending for
   * @param {string} recipient to receive message
   */
  constructor(
    private token: string,
    private id: string,
    public recipient: string) {
  }

  /**
   *
   * @param {boolean} disableComposerInput messenger turn off composer for user
   * @param {Array<ButtonInfo>} callToActions The buttons the user can press
   * @return {Promise<void>}
   */
  setUserMenu = async (disableComposerInput: boolean,
      callToActions?: Array<ButtonInfo>) => {
    const fbCustomUserSettingsURL = 'https://graph.facebook.com/v15.0/' + this.id + '/custom_user_settings?access_token=' + this.token;
    const body = {
      'psid': this.recipient,
      'persistent_menu': [
        {
          'locale': 'default',
          'composer_input_disabled': disableComposerInput,
        },
      ],
    };
    if (callToActions) {
      (body.persistent_menu[0] as Record<string, any>)['call_to_actions'] =
       callToActions.map(buttonInfoToButton);
    }
    return fetch(fbCustomUserSettingsURL, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {'Content-Type': 'application/json'},
    }).then(async (response) => {
      if (!response.ok) {
        return response.text().then((text) => {
          logger.error(
            {text: text, fetchWith: {
              method: 'POST',
              body: JSON.stringify(body),
              headers: {'Content-Type': 'application/json'}}},
              'Error in posting (sending) to fb custom user settings.');
        });
      }
      return Promise.resolve();
    });
  };

  /**
   *
   * @return {Promise<void>}
   */
  deleteUserMenu = async () => {
    const fbCustomUserSettingsURL = `https://graph.facebook.com/v15.0/me/custom_user_settings?`;
    const params = new URLSearchParams({
      psid: this.recipient,
      params: `['persistent_menu']`,
      access_token: this.token,
    });

    return fetch(fbCustomUserSettingsURL + params, {
      method: 'DELETE',
    }).then(async (response) => {
      if (!response.ok) {
        return response.text().then((text) => {
          logger.error(
              {error: text, fetch: {
                method: 'DELETE'}},
              'Error in posting (sending) to fb custom user settings.');
        });
      }
      return Promise.resolve();
    });
  };

  /**
   *
   * @param {Record<string, unknown>} body to send to fb messenger
   * @return {Promise<void>}
   */
  private postToFBMessages = async (body: Record<string, unknown>) => {
    const fbMessagesURL = 'https://graph.facebook.com/v14.0/' + this.id + '/messages?access_token=' + this.token;
    logger.info({body: body}, 'postToFBMessages');
    return fetch(fbMessagesURL, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {'Content-Type': 'application/json'},
    }).then(async (response) => {
      if (!response.ok) {
        return response.text().then((text) => {
          logger.error(
            {error: text, fetch: {
              method: 'POST',
              body: JSON.stringify(body),
              headers: {'Content-Type': 'application/json'}}},
              'Error in posting (sending) to fb messages.');
        });
      }
      return Promise.resolve();
    });
  };

  private postToWAMessages = async (body: Record<string, unknown>) => {
    // TODO(techiejd): bring in the number as a parameter to be able to message other uers
    const waMessagesUrl = 'https://graph.facebook.com/v14.0/' + String(process.env.WA_BUSINESS_PHONE_ID) + '/messages';
    logger.info({body: body}, 'postToWAMessages');
    return fetch(waMessagesUrl, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.WA_BUSINESS_ACCESS_TOKEN}`,
      },
    }).then(async (response) => {
      if (!response.ok) {
        return response.text().then((text) => {
          logger.error(
            {error: text, fetch: {
              method: 'POST',
              body: JSON.stringify(body),
              waMessagesUrl: waMessagesUrl,
              headers: {
              'Content-Type': 'application/json', 
              'Authorization': `Bearer ${process.env.WA_BUSINESS_ACCESS_TOKEN}`
            }}},
              'Error in posting (sending) to wa messages.');
        });
      }
      return Promise.resolve();
    });
  };
  /**
   *
   * @param {schemas.MessengerMessage} message to send to recipient.
   * @return {Promise<void>} Logs result of sending and then returns.
   */
  send(message:schemas.Messenger.Message): Promise<void> {
    const body = {
      'messaging_type': 'RESPONSE',
      'recipient': {
        'id': this.recipient,
      },
      'message': message,
    };

    return this.postToFBMessages(body);
  }

  /**
   *
   * @param {schemas.MessengerMessage[]} messages to send. order not guaranteed
   * @return {Promise<void[]>} Logs result of sending and then returns.
   */
  sendMultiple(
      messages : schemas.Messenger.Message[]): Promise<void[]> {
    return Promise.all(messages.map((message) => this.send(message)));
  }

  /**
   *
   * @param {schemas.Messenger.Message} message to be sent
   * @param {string} notificationPermissionsToken the users notifications token
   * @return {Promise<void>}
   */
  async notify(message: schemas.Messenger.Message,
      notificationPermissionsToken: string): Promise<void> {
    // TODO(techiejd): Get cache going so we don't have to
    // pass notificationPermissionsToken.
    const notificationBody : schemas.Messenger.MessageBody = {
      'messaging_type': 'UPDATE',
      'recipient': {
        'notification_messages_token': notificationPermissionsToken,
      },
      'message': message,
    };
    return this.postToFBMessages(notificationBody);
  }

  async sendWhatsApp(message: schemas.WhatsApp.Message) {
    const messageBody : schemas.WhatsApp.MessageBody = {
      messaging_product: "whatsapp",
      to: String(process.env.ADMIN_NUMBER),
      text: message,
    };

    return this.postToWAMessages(messageBody);
  }
}

/**
 * Handles group fetches
 */
export class GroupHandler {
  /**
   *
   * @param {string} id of the group
   */
  constructor(
    public id: string) {
  }

  /**
   *
   * @param {string} asid of the user
   * @param {string} token of the user
   * @return {Promise<Boolean>}
   */
  private async _isUserInGroup(asid: string, token: string): Promise<boolean> {
    return fetch(
        'https://graph.facebook.com/' +
    this.id +
    '/opted_in_members?access_token=' + token, {
          method: 'GET',
        }).then(async (response) => {
      if (!response.ok) {
        response.text().then((text) => {
          throw new Error('Error in fetching fb opted_in: ' + text);
        });
      }
      return response.json().then((response) => {
        const res = schemas.facebookResponse.parse(response);
        const optedInMembers = schemas.optedInMembers.parse(res.data);
        return optedInMembers.some(
            (optedInMember) => optedInMember.id == asid);
      });
    });
  }

  /**
   *
   * @param {string} psid for looking up user
   * @return {Promise<boolean | void>}
   */
  static async isUserInWeVerse(psid:string): Promise<boolean | void> {
    return getUserSnapshot(psid).then(async (userSnapshot) => {
      const user = userSnapshot.data();
      if (process.env.FB_GROUP_ID) {
        return new GroupHandler(process.env.FB_GROUP_ID).
            _isUserInGroup(user.asid, user.token);
      } else {
        throw new Error('no value for process.env.FB_GROUP_ID');
      }
    });
  }

  /**
   *
   * @param {string} token for facebook
   * @return {Promise<boolean>}
   */
  private async _userHasSinglePost(token: string): Promise<boolean> {
    return fetch(
        'https://graph.facebook.com/' +
  this.id +
  '/feed?fields=from&access_token=' + token, {
          method: 'GET',
        }).then(async (response) => {
      if (!response.ok) {
        response.text().then((text) => {
          throw new Error('Error in fetching fb feed: ' + text);
        });
      }
      return response.json().then((response) => {
        const res = schemas.facebookResponse.parse(response);
        const feed = schemas.feed.parse(res.data);
        return feed.some(
            (post) => post.from != undefined);
      });
    });
  }

  /**
   *
   * @param {string} psid
   * @return {Promise<boolean | void>}
   */
  static async userHasSingleWeVersePost(psid:string) : Promise<boolean | void> {
    return getUserSnapshot(psid).then(async (userSnapshot) => {
      const user = userSnapshot.data();
      if (process.env.FB_GROUP_ID) {
        return new GroupHandler(process.env.FB_GROUP_ID).
            _userHasSinglePost(user.token);
      } else {
        throw new Error('no value for process.env.FB_GROUP_ID');
      }
    });
  }

  // TODO(techiejd): own should not be default
  /**
   *
   * @param {string} token
   * @param {Date | undefined} since for search from when -- updated_time (not created_at)
   * @param {Date | undefined} until for searching until when -- updated_time
   * @param {'all' | 'own'} whose posts are we requesting
   * @return {Promise<schemas.Feed>}
   */
  static async getWeVersePosts(
      token : string,
      since: Date | undefined = undefined,
      until: Date | undefined = undefined,
      whose: 'own' | 'all' = 'own'): Promise<schemas.Feed> {
        const removeSeconds = (iso: string) => iso.split('.')[0];
    const fbUrl =
'https://graph.facebook.com/' + process.env.FB_GROUP_ID + '/feed?';
    const params = new URLSearchParams({
      fields: 'from,reactions,comments{from,message},message,attachments',
      access_token: token,
    });
    if (since) {
      params.set('since', removeSeconds(since.toISOString()));
    }
    if (until) {
      params.set('until', removeSeconds(until.toISOString()));
    }
    const feed = schemas.feed.parse(
        await getPaginatedData(fbUrl + params));
    return whose == 'own' ? feed.filter((post) => post.from) : feed;
  }
}
