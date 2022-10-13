import {getUserSnapshot} from '../../../../common/db';
import {OneWePrivateConversationHandler} from
  './../oneWePrivateConversationHandler';
import * as messengerUtils from '../utils';
import {toggleSofiaOffButtonFor, toggleSofia} from './toggleSofia';

export const askForHelp = async (psid: string, about: unknown) => {
  return getUserSnapshot(psid).then((userSnapshot) => {
    const user = userSnapshot.data();
    const text = `Usuario ${user.name} necesita tu ayuda con ` + about;
    const buttonMessage = messengerUtils.makeMessage(
        text, [toggleSofiaOffButtonFor(psid, user.name)]);
    return new OneWePrivateConversationHandler.
        OneWeToAdminConversationHandler().send(buttonMessage);
  });
};

// Make Admin Convo handler handle both admins: admin & dev
const isUserAnAdmin = (psid: string) => {
  return process.env.ADMIN_ID == psid || process.env.DEV_ID == psid;
};

export const helpPerson = (params: Record<string, any>) => {
  const helpWith = params['Help.General'];
  const convoHandler = new OneWePrivateConversationHandler(
      params.senderId);

  if (isUserAnAdmin(params.senderId)) {
    convoHandler.send({
      text: `Opening up so you can talk to Sofí now.`,
    });
    return toggleSofia({
      ...params,
      'Toggle.Sofia':
      ['off', params.senderId, 'your work, you valiant Admin you.'],
    });
  } else {
    convoHandler.send({
      text: `Listo hemos avisado al los miembros del staff. Ahora te ayudan.
Espera hasta 72 horas por favor (aunque no creo que se demoren tanto).`,
    });
    return askForHelp(params.senderId, helpWith);
  }
};
