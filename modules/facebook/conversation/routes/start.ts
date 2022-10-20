import {OneWePrivateConversationHandler} from
  './../oneWePrivateConversationHandler';
import {makeLoggingInButton} from './logIn';


export const start = async (params: Record<string, any>) => {
  const explainLoggingIn = {
    text: `Hola me llamo Sofí, mi mision en la vida es ayudarte a navegar \
en el WeVerse, participar de los juegos y eventos y asistir a toda la \
comunidad en la toma de desciciones.

Felicitaciones! Contactarnos es el primer paso para ingresar \
al WeVerse. Por el momento, WeVerse existe exclusivamente en el MetaVerso \
de Facebook. Es por esta razon que te solicitamos algunos permisos \
(tranquil@, nada muy complejo 😉).`,
  };
  return new OneWePrivateConversationHandler(
      params.senderId).sendMultiple(
      [explainLoggingIn, makeLoggingInButton(params.senderId)]);
};
