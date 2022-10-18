import * as schemas from '../schemas';
import * as notifications from './routes/notifications';
// import * as dialogflow from '@google-cloud/dialogflow';
import * as logInRoutes from './routes/logIn';
import * as defaultRoutes from './routes/default';
import {consultCompetition} from './routes/consultCompetition';
import {consultRules} from './routes/consultRules';
import {helpPerson} from './routes/helpPerson';
import {saidDone} from './routes/saidDone';
import {consultResources} from './routes/consultResources';
import {saidEntered} from './routes/saidEntered';
import {start} from './routes/start';
import {consultState} from './routes/consultState';
import {requestResources, consumeLie} from './integrations/firstChallenge';
import {LogInEvent} from './integrations/logIn';
import {redeemPrizes} from './routes/redeemPrizes';
import {toggleSofia} from './routes/toggleSofia';
import {search} from './routes/admin/search';
import {requestJuryRoom} from './integrations/secondChallenge';
import {logger} from '../../../common/logger';
import {remindMe} from './routes/remindMe';

type MessengerManagerEvent = {
  messenger: schemas.MessengerEvent, logIn?: never}
| {messenger?: never, logIn: LogInEvent}

/**
 * PageAgent - acts as agent for the page. Able to send messages as page.
 */
export class OneWeManager {
  // eslint-disable-next-line valid-jsdoc
  private getRouteFromPostback = (
      messengerEvent: schemas.MessengerEvent) :
     [string, Record<string, any>] => {
    let conversationRoute = messengerEvent.postback!.payload;
    let params : string[] = [];
    if (conversationRoute && conversationRoute.split('.').length > 2) {
      params = conversationRoute.split('.').slice(2);
      conversationRoute = conversationRoute.split('.').slice(0, 2).join('.');
    }
    const outTuple : [string, Record<string, any>] =
     [conversationRoute, {[conversationRoute]: params,
       senderId: messengerEvent.sender.id}];
    return outTuple;
  };

  // eslint-disable-next-line valid-jsdoc
  private getRouteFromMessage = async (
      messengerEvent: schemas.MessengerEvent) :
     Promise<[string, Record<string, unknown>]> => {
    const params = {'senderId': messengerEvent.sender.id,
      'Admin': {
        message: messengerEvent.message!.text,
      },
    };
    return ['Default.Fallback', params];
  };

  // TODO(techiejd): Wow we really going full buttons?
  // eslint-disable-next-line valid-jsdoc
  /* private getRouteFromMessage = async (
      messengerEvent: schemas.MessengerEvent) :
       Promise<[string, Record<string, string>]> => {
    const params = {'senderId': messengerEvent.sender.id};
    if (messengerEvent.message!.quick_reply) {
      return [messengerEvent.message!.quick_reply.payload, params];
    } else if (messengerEvent.message!.text) {
      const route = await this.getIntentFromNLP(
          messengerEvent.message!.text, messengerEvent.sender.id);
      if (route) {
        return [route, params];
      }
    }
    functions.logger.error(
        `Got to a message we can't handle: `, messengerEvent.message);
    return ['Default.Fallback', params];
  }; */

  // eslint-disable-next-line valid-jsdoc
  private getRouteFromOptin = (
      messengerEvent: schemas.MessengerEvent) :
    [string, Record<string, any>] => {
    return [messengerEvent.optin!.payload,
      {
        [messengerEvent.optin!.payload]: messengerEvent.optin,
        senderId: messengerEvent.sender.id,
      }];
  };

  // eslint-disable-next-line valid-jsdoc
  /* private getIntentFromNLP = async (text: string, senderId: string) => {
    const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.projectAgentSessionPath(
        String(process.env.DF_PROJECT_ID),
        senderId,
    );
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: text,
          languageCode: 'es',
        },
      },
    };

    const fullResponse = await sessionClient.detectIntent(request);
    return fullResponse[0].queryResult?.intent?.displayName;
  };*/

  /**
   *
   * @param {MessengerManagerEvent} event the MessengerManagerEvent to handle
   */
  async handle(event: MessengerManagerEvent) {
    let route = 'Default.UnknownRoute';
    let params : Record<string, any> = {};
    if (event.messenger) {
      if (event.messenger.message) {
        [route, params] = await this.getRouteFromMessage(event.messenger);
      } else if (event.messenger.postback) {
        [route, params] = this.getRouteFromPostback(event.messenger);
      } else if (event.messenger.optin) {
        [route, params] = this.getRouteFromOptin(event.messenger);
      }
    } else {
      [route, params] = ['Event.LogIn', event.logIn];
    }

    try {
      return this.handleRoute(route, params);
    } catch (error) {
      logger.error({error: error}, 'Error in handling MessengerEvent');
      // TODO(techiejd): maybe send info back to client
    }
  }

  /**
   *
   * @param {string} route
   * @param {Record<string, any>} params
   * @return {Promise<void | void[]>}
   */
  private async handleRoute(
      route:string,
      params: Record<string, any>) :
   Promise<void | void[]> {
    const route2Handler = new Map(Object.entries({
      'Admin.Search': search,
      'Consult.Competition': consultCompetition,
      'Consult.Resources': consultResources,
      'Consult.Rules': consultRules,
      'Default.Fallback': defaultRoutes.fallback,
      'Default.Thank': defaultRoutes.thank,
      'Default.Welcome': defaultRoutes.userWelcome,
      'Help.General': helpPerson,
      'Request.LogIn': logInRoutes.request,
      'Said.Done': saidDone,
      'Said.Entered': saidEntered,
      // Regular messages only
      'Consult.State': consultState,
      'Request.Notifications': notifications.request,
      'Start': start,
      // Postback only
      // TODO(techiejd): Remove this once everyone has migrated.
      'Accept.Challenge': requestResources,
      'Accept.Notifications': notifications.accepted,
      'Challenge.1': consumeLie,
      'Request.JuryRoom': requestJuryRoom,
      'Remind.Me': remindMe,
      // TODO(techiejd): Remove this one once migrated to 'Start'
      'get_started_payload': start,
      'Event.LogIn': logInRoutes.event,
      'Request.Resources': requestResources,
      'Redeem.Prizes': redeemPrizes,
      'Toggle.Sofia': toggleSofia,
    }));


    const handleMessageFor =
      route2Handler.get(route);
    if (handleMessageFor) {
      return handleMessageFor(params);
    }
    throw new Error('Error no handleMessageFor ' + route);
  }
}
