import {PrivateConversationHandler} from '../utils';
import {logger} from '../../../common/logger';

/**
 *
 */
export class OneWePrivateConversationHandler
  extends PrivateConversationHandler {
  /**
 * To send directly to admins
 */
  static OneWeToAdminConversationHandler =
    class extends OneWePrivateConversationHandler {
      /**
       * Makes a conversation handler that sends directly to oneWe Admins
       */
      constructor() {
        let adminID : string;
        if (process.env.ADMIN_ID) {
          adminID = process.env.ADMIN_ID;
        } else {
          logger.error(
            {id: String(process.env.ADMIN_ID)},
              'Missing OneWe admin id');
          throw new Error('Missing page admin id');
        }
        super(adminID);
      }
    };
  // TODO(techiejd): Fix typing.
  /*
  private bodyToTurnOnTypingFor = (psid: string) => ({
    'messaging_type': 'RESPONSE',
    'sender_action': 'typing_on',
    'recipient': {
      'id': psid,
    },
  });

  private bodyToTurnOffTypingFor = (psid: string) => ({
    'messaging_type': 'RESPONSE',
    'sender_action': 'typing_off',
    'recipient': {
      'id': psid,
    },
  }); */

  /**
   *
   * @param {string} recipient to send messages to
   */
  constructor(recipient: string) {
    let accessToken : string;
    let id : string;
    if (process.env.FB_PAGE_ACCESS_TOKEN && process.env.FB_PAGE_ID) {
      accessToken = process.env.FB_PAGE_ACCESS_TOKEN;
      id = process.env.FB_PAGE_ID;
    } else {
      logger.error(
        {
          pageAccessToken: String(process.env.FB_PAGE_ACCESS_TOKEN),
          pageId: String(process.env.FB_PAGE_ID)
        },
          'Missing either OneWe Page access token or id. change');
      throw new Error('Missing page token or id');
    }
    super(accessToken, id, recipient);
  }

  // eslint-disable-next-line valid-jsdoc

  /**
   *
   * @param {ConversationPiece} conversationPiece to handle
   * @return {Promise<void | void[]>}
   */
}
