import {getUserSnapshot} from '../../../../common/db';
import {prettifyJSON} from '../utils';
import {OneWePrivateConversationHandler} from
  './../oneWePrivateConversationHandler';

export const consultResources = async (params: Record<string, any>) => {
  return getUserSnapshot(params.senderId).then((userSnapshot) => {
    const user = userSnapshot.data();
    const consultResourcesMessage = {
      text: `En tu WeBag 🎒 tienes los siguientes recursos: ` +
      prettifyJSON(user.gameInfo.resources),
    };
    return new OneWePrivateConversationHandler(
        params.senderId).send(consultResourcesMessage);
  });
};
