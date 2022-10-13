import {getAllUsersSnapshot} from '../../../../../common/db';
import {OneWePrivateConversationHandler} from
  '../../oneWePrivateConversationHandler';
import * as messengerUtils from '../../utils';
import * as schemas from '../../../schemas';
import {getBody} from './utils';

const tryAgain : messengerUtils.ButtonInfo = {
  title: 'Try again.', payload: 'Admin.Search.open'};

// There's only one page per user result right now for toggling Sofia.
const searchResult =
(psid:string, name: string) : schemas.MessengerMessage => (
  messengerUtils.makeMessage('Search found: ',
      [{title: name, payload: 'Toggle.Sofia.' + '' /* state */ +
      '.' + psid + '.' + name},
      tryAgain]));
const searchFailure : schemas.MessengerMessage = messengerUtils.makeMessage(
    'Search failed',
    [tryAgain]
);

const isArray = function(a: {constructor: unknown} | undefined ) {
  if (a != undefined) {
    return a.constructor === Array;
  }
  return false;
};

export const search = (params: Record<string, any>) => {
  const adminHandler =
  new OneWePrivateConversationHandler.OneWeToAdminConversationHandler();
  const closeSearch = () => adminHandler.deleteUserMenu();

  const shouldOpen =
  isArray(params['Admin.Search']) && params['Admin.Search'][0] == 'open';
  if (shouldOpen) {
    adminHandler.setUserMenu(false);
    return Promise.resolve();
  }

  closeSearch();
  const queries = getBody(params).split('\n');

  return getAllUsersSnapshot().then(async (userSnapshots) => {
    let anyUserFound = false;
    for (const userDoc of userSnapshots.docs) {
      const user = userDoc.data();
      const userFound = queries.some(
          (query) => user.name.toLowerCase().includes(query.toLowerCase()));
      if (userFound) {
        anyUserFound = true;
        adminHandler.send(searchResult(user.psid, user.name));
      }
    }
    return anyUserFound ?
    adminHandler.send({text: 'Done with search.'}) :
    adminHandler.send(searchFailure);
  });
};
