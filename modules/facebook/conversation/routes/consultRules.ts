import {OneWePrivateConversationHandler} from
  './../oneWePrivateConversationHandler';

export const consultRules = (params: Record<string, any>) => {
  return new OneWePrivateConversationHandler(
      params.senderId).send({
    attachment: {
      payload: {
        template_type: 'button',
        text: 'Vea las reglas en OneWe WeVerse.',
        buttons: [
          {
            title: 'Vea acá',
            type: 'web_url',
            url: 'https://onewe-weverse.notion.site/Juego-y-reglas-para-jugar-OneWe-DOC-Comunidad-9e7148ac77a5443fb76d2b2bd095cf31',
          },
        ],
      },
      type: 'template',
    },
  });
};
