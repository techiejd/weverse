import * as schemas from '../../schemas';
import {Resource} from '../../../sofia/schemas';
import {OneWePrivateConversationHandler} from
  './../oneWePrivateConversationHandler';
import {consultResources} from '../routes/consultResources';
import {getUserSnapshot, usedSource} from '../../../../common/db';

export const challengeNotificationMessageFor = (
    challengeId:string) : schemas.Messenger.Message => ({
  attachment: {
    payload: {
      template_type: 'button',
      text:
    `😔 Estoy desilusionada en tí. Esperaba que ya hubieras participado.

Dele al botón de abajo para obtener los primeros recursos de \
reporter@ (${Resource.Camera}) e impostor (${Resource.Mask}).

Y cuando ya hayas publicado, dime 'Listo, publiqué o algo así'`,
      buttons: [
        {
          title: 'Recibir recursos.',
          type: 'postback',
          payload: 'Request.Resources.' + challengeId,
        },
      ],
    },
    type: 'template',
  },
  quick_replies: [{
    content_type: 'text',
    title: 'Listo, ya publiqué',
    payload: 'Said.Done',
  }],
});

export const firstCompetitionStarted = {
  text: `Hola, ya empezó la primera WeRace --

¡Obten tus licencias de reportero e impostor! \
Esto es lo que necesitas para lograrlo:
Has tu primera publicación en nuestro grupo de Facebook (OneWe MVP 1) \
presentandote en el grupo con tres cosas \
que hayas hecho en tu vida que sean de valor o utilidad para \
tu comunidad u otras personas. De estas tres cosas dos deben \
ser verdades y una una mentira.

¡No te dejes atrapar en la mentira! Pero sobre todo diviertete \
trabajando en comunidad para descubrir las otras mentiras.

Dura hasta el lunes, 12 de Septiembre, 8:00 PM.

Recibirás una cámara (${Resource.Camera}) y una máscara (${Resource.Mask}). \
La cámara te deja publicar 1 vez no \
más y la máscara te deja mentir en una publicación. \
Haga que esta publición valga la pena usar esos recursos.`,
};

export const firstCompetitionEnded = {
  text: `Hola! La primer WeRace ha terminado. \
Por favor esperar por mas instrucciones`,
};

export const giveResources = async (psid: string, challengeRef: string) => {
  usedSource(psid, challengeRef);
  return getUserSnapshot(psid).then((userSnapshot) => {
    return userSnapshot.ref.update({
      ['gameInfo.resources.' + Resource.Ween]: 300,
      ['gameInfo.resources.' + Resource.Camera]: 1,
      ['gameInfo.resources.' + Resource.Mask]: 1,
    });
  });
};

export const whatIsYourLie : schemas.Messenger.Message = {
  attachment: {
    payload: {
      template_type: 'button',
      text: `¡Hola, ya termino la primer WeRace!
      
Quería hacerte una pregunta muy importante para el concurso.
¿Cuál de los 3 puntos de tu publicación es la mentira?
      
¿1, 2 o 3?`,
      buttons: [
        {
          title: 'La 1',
          type: 'postback',
          payload: 'Challenge.1.1',
        }, {
          title: 'La 2',
          type: 'postback',
          payload: 'Challenge.1.2',
        }, {
          title: 'La 3',
          type: 'postback',
          payload: 'Challenge.1.3',
        },
      ],
    },
    type: 'template',
  },
};

export const requestResources = (params: Record<string, any>) => {
  // TODO(techiejd): migrate off of Accept.Challenge
  const challengeId = params['Request.Resources'] ?
  params['Request.Resources'][0] : params['Accept.Challenge'][0];
  const convoHandler = new OneWePrivateConversationHandler(
      params.senderId);
  return giveResources(
      params.senderId, challengeId).then(async () => {
    return convoHandler.send({text: `Intercambiando:
    {100 ⚡} -> {1 📷}
    {600 ⚡} -> {1 👺}`,
    }).then(() => consultResources(params).then(() => {
      const explanationMessage = {
        text: `Acabas de recibir una cámara y una máscara, felicidades 🥳.
    
    Recuerda que tu publicación deberá ser en nuestro grupo de Facebook \
    (OneWe MVP 1).
    ¡Puedes ver el video al respecto en este enlace si tienes alguna duda! \
    https://youtu.be/OXTH2RAU8l0.
    
    Ejemplo de una publicación:
    "Hola comunidad OneWe me llamo Sofí!
    Aqui estan 3 cosas que he hecho en mi vida que tienen valor social
    
    1: Barri las calles de mi barrio por 1 mes para demostrar que se puede \
    mantener limpio cuando lo cuidamos, la comunidad me comenzo a apoyar y \
    se sumaron a la limpieza.
    2: En mi colegio me uni a la jornada de aguapaneleros para cocinar y \
    llevar alimento a familias en necesidad.
    3: Le avise a un conductor de moto que tenia el gato abierto y se \
    podia accidentar, el iba con su esposa he hija."
    
    En los comentarios se puede hacer preguntas y descubrir el hecho \
    falso. El o la Reporter@ que hizo la publicación deberá responder \
    al menos una pregunta! Cuando estes segur@ de tu respuesta escribe \
    'R/1','R/2' o 'R/3' en el comentario para comunicar cual de sus 3 \
    hechos es falso (no se puede cambiar).
    
    En el ejemplo de la publicación de Sofí, R/2 era falsa \
    (Sofí no se unió a la jornada de aguapaneleros) y la persona que \
    escribió 'R/2' en los comentarios acertó correctamente.`,
      };
      const goToPostMessage : schemas.Messenger.Message = {
        attachment: {
          payload: {
            template_type: 'button',
            text:
            `Presione el botón de abajo para ir al grupo a postear.
    
    Buena suerte!`,
            buttons: [
              {
                title: 'Publica acá.',
                type: 'web_url',
                url: `https://www.facebook.com/groups/737230100931116`,
              },
            ],
          },
          type: 'template',
        },
        quick_replies: [
          {
            content_type: 'text',
            title: 'Listo, publiqué.',
            payload: 'Said.Done',
          }, {
            content_type: 'text',
            title: 'Ayudame con el grupo.',
            payload: 'Help.General.Group',
          },
        ],
      };
      return convoHandler.sendMultiple([explanationMessage, goToPostMessage]);
    }));
  });
};

const savedLieMessage = {
  text: `¡Muchas gracias por tu respuesta, ya la guardé en mi memoria!`,
};
export const explanationRestCompetition = {
  text: `🧞‍♀️¡Gracias por su participación!
  
Por cierto:

Los resultados y premios se publicarán mañana martes 13 de \
septiembre de 2022 a las 8 pm.
Recuerda estar atent@ a los resultados para reclamar tus premios \
antes de que desaparezcan (tienes 24 horas para ello).`,
};


export const consumeLie = (params: Record<string, any>) => {
  const psid = params['senderId'];
  const lie = Number(params['Challenge.1'][0]);
  const convoHandler = new OneWePrivateConversationHandler(
      params.senderId);
  return getUserSnapshot(psid).then((userSnapshot) => {
    return userSnapshot.ref.update(
        {
          challenges: {
            ['jXrbxrgq4hVIVsUmOfxF']: {
              lie: lie,
            },
          },
        }
    ).then(() => {
      return convoHandler.send(savedLieMessage).then(
          () => convoHandler.send(explanationRestCompetition));
    });
  });
};

// Colombia is GMT-05:00
export const since = new Date(2022, 8, 10, 1);
export const until = new Date(2022, 8, 13, 19);
