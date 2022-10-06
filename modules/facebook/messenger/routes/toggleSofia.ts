import {OneWePrivateConversationHandler} from
  './../oneWePrivateConversationHandler';
import * as utils from '../../utils';

const thisRoute = 'Toggle.Sofia';

export const toggleSofiaOffButtonFor =
(psid : string, name : string) : utils.ButtonInfo => (
  {title: `Despedir a Sofí.`,
    payload: thisRoute + `.off.` + psid + '.' + name});

export const toggleSofia = async (params: Record<string, any>) => {
  const [newState, psid, name] = params['Toggle.Sofia'];
  const convoHandler = new OneWePrivateConversationHandler(psid);
  const adminConvoHandler = new OneWePrivateConversationHandler.
      OneWeToAdminConversationHandler();

  const toggleSofiaOnButton : utils.ButtonInfo = {title: `Despertar a Sofí.`,
    payload: thisRoute + `.on.` + psid + '.' + name};


  if (newState == '') {
    const toWhatState = utils.makeButtonMessage(
        `What would you like Sofí to do for user ${name}?`,
        [toggleSofiaOnButton, toggleSofiaOffButtonFor(psid, name)]);
    return adminConvoHandler.send(toWhatState);
  }


  if (newState == 'off') {
    return convoHandler.setUserMenu(false, [toggleSofiaOnButton]).then(() => {
      const text = `Cuando termines con ${name}:`;
      const buttonMessage = utils.makeButtonMessage(
          text, [toggleSofiaOnButton]);

      return adminConvoHandler.send(buttonMessage);
    });
  }
  return convoHandler.deleteUserMenu().then(() => {
    adminConvoHandler.send(
        {text: 'Sofí ha vuelto a conectar con el usuario ' + name});
    return convoHandler.send({
      text: 'El/la WeMember se ha desconectado. Siga la conversación con Sofí.',
    });
  });
};
