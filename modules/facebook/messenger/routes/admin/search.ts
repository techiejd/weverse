import {getAllUsersSnapshot} from '../../../../../common/db';
import {OneWePrivateConversationHandler} from
  '../../oneWePrivateConversationHandler';
import * as messengerUtils from '../../utils';
import * as fbSchemas from '../../../schemas';
import * as dbSchemas from '../../../../db/schemas';
import {getBody} from './utils';
import { makeUserNameQueryFilter } from '../../../../admin/search';

const tryAgain : messengerUtils.ButtonInfo = {
  title: 'Try again.', payload: 'Admin.Search.open'};

// There's only one page per user result right now for toggling Sofia.
const searchResult =
(psid:string, name: string) : fbSchemas.MessengerMessage => (
  messengerUtils.makeMessage('Search found: ',
      [{title: name, payload: 'Toggle.Sofia.' + '' /* state */ +
      '.' + psid + '.' + name},
      tryAgain]));
const searchFailure : fbSchemas.MessengerMessage = messengerUtils.makeMessage(
    'Search failed',
    [tryAgain]
);

const isArray = function(a: {constructor: unknown} | undefined ) {
  if (a != undefined) {
    return a.constructor === Array;
  }
  return false;
};

export const search = async (params: Record<string, any>) => {
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

  const usersFound = await getAllUsersSnapshot().then((usersSnapshot) => {
    const queryUserNameFilter = makeUserNameQueryFilter(queries);

    const usersFound = (() => {
      const users = usersSnapshot.docs.map(u => dbSchemas.userData.parse(u.data()));
      return users.filter(queryUserNameFilter);
    })();
    
    return usersFound;
  });
  if (usersFound.length > 0) {
    for (const user of usersFound) {
      adminHandler.send(searchResult(user.psid, user.name));
    } 
    return adminHandler.send({text: 'Done with search.'})
  } else {
    return adminHandler.send(searchFailure)
  }
};
