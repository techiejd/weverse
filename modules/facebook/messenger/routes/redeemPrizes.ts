import {getUserSnapshot} from '../../../../common/db';
import {Resource} from '../../../sofia/schemas';
import {OneWePrivateConversationHandler}
  from '../oneWePrivateConversationHandler';
import * as schemas from '../../schemas';
import {askForHelp} from './helpPerson';

const thisRoute = 'Redeem.Prizes';
const oneWeInWeen = 800;
const weenToWe = (amountInWeen:number) => {
  return amountInWeen / oneWeInWeen;
};
const weToWeen = (amountInWe:number) => {
  return amountInWe * oneWeInWeen;
};
const services2Cost : {
  [service: string]: number,
 } = {
   'Netflix': 5,
   'Spotify': 7.5,
 };

const chooseHowToRedeem : schemas.MessengerMessage = {
  attachment: {
    type: 'template',
    payload: {
      template_type: 'button',
      text: `¿Qué premios te gustaría redimir?`,
      buttons: [{
        title: 'Servicios digitales.',
        type: 'postback',
        payload: 'Redeem.Prizes.DigitalServices',
      }, {
        title: 'Servicios WeMembers.',
        type: 'postback',
        payload: 'Redeem.Prizes.OneWeDo',
      }, {
        title: 'Comercios WeMarket',
        type: 'postback',
        payload: 'Redeem.Prizes.WeMarket',
      },
      ],
    },
  },
};

export const chooseDigitalService : schemas.MessengerMessage = {
  attachment: {
    type: 'template',
    payload: {
      template_type: 'button',
      text: `¿Qué servicio digital te gustaría redimir?`,
      buttons: [{
        title: 'Netflix = 5 $WE',
        type: 'postback',
        payload: 'Redeem.Prizes.DigitalServices.Netflix.confirm',
      }, {
        title: 'Spotify = 7.5 $WE',
        type: 'postback',
        payload: 'Redeem.Prizes.DigitalServices.Spotify.confirm',
      },
      ],
    },
  },
};

export const informWillBeReached : schemas.MessengerMessage = {
  text: `Ok, bien. Gracias por la solicitud, un agente de \
Sofia se comunicará contigo para ayudarte redimir.`,
};


const confirmTransaction = (ween:number,
    cost:number,
    service:string) => ({
  attachment: {
    type: 'template',
    payload: {
      template_type: 'button',
      text: `¿Puedo cambiar ${ween}⚡ por ${cost}$We para redimir ${service}?`,
      buttons: [{
        title: 'Sí por favor.',
        type: 'postback',
        payload: `Redeem.Prizes.DigitalServices.${service}.confirm.yes`,
      }, {
        title: 'No, cambie mi mente.',
        type: 'postback',
        payload: `Redeem.Prizes.DigitalServices.${service}.confirm.no`,
      },
      ],
    },
  },
});

const sorryNotEnough : schemas.MessengerMessage = {
  text: `¡Wow 😲! Estás muy cerca, ya casi tienes los ⚡WEEN necesarios para \
redimir los WePremios 🥰.

El minimo ⚡WEEN que necesitas para los WePremios es 4000⚡.
💪 Ponte las pilas para arrasar en la próxima WeRace. 🏆
  
🧞‍♀️ Yo estaré encantada de entregarte los premios🥳.`,
};

const getDigitalService = (service:string,
    psid:string, convoHandler:OneWePrivateConversationHandler) => {
  return getUserSnapshot(psid).then((userSnapshot) => {
    const user = userSnapshot.data();
    const avaliableWeen:number = user.gameInfo.resources[Resource.Ween];
    const cost = services2Cost[service];
    if (cost <= weenToWe(avaliableWeen)) {
      return convoHandler.send(
          confirmTransaction(weToWeen(cost), cost, service));
    } else {
      return convoHandler.send(sorryNotEnough);
    }
  });
};

const redeemService = (
    psid:string,
    service:string,
    convoHandler: OneWePrivateConversationHandler) => {
  return getUserSnapshot(psid).then((userSnapshot) => {
    const user = userSnapshot.data();
    let unfulfilledAsks: number;
    if (user.unfulfilledAsks) {
      if (user.unfulfilledAsks[service]) {
        unfulfilledAsks = user.unfulfilledAsks[service];
      } else {
        unfulfilledAsks = 0;
      }
    } else {
      unfulfilledAsks = 0;
    }
    const avaliableWeen:number = user.gameInfo.resources[Resource.Ween];
    const costInWeen:number = weToWeen(services2Cost[service]);

    return userSnapshot.ref.update({
      ['unfulfilledAsks.' + service]: unfulfilledAsks + 1,
      ['gameInfo.resources.' + Resource.Ween]: avaliableWeen - costInWeen,
    }).then(() => {
      return convoHandler.send({
        text: `Hola, tu ⚡ ha sido intercambiado por $We y \
ese $We redimido por ${service}.
Este pedido lleva su tiempo. Por favor espera una respuesta en 72 horas.`,
      });
    });
  });
};

const cancelRedemption = (convoHandler: OneWePrivateConversationHandler) => {
  const redemptionCanceled : schemas.MessengerMessage = {
    text: `Está bien, estoy acá para redimir cuando quieras`,
  };
  return convoHandler.send(redemptionCanceled);
};

const enoughWeen = (psid:string) => {
  return getUserSnapshot(psid).then((userSnapshot) => {
    const user = userSnapshot.data();
    return user.gameInfo.resources[Resource.Ween] >= 4000;
  });
};

export const redeemPrizes = async (params: Record<string, any>) => {
  const convoHandler = new OneWePrivateConversationHandler(
      params.senderId);
  const args : Array<string> = params[thisRoute];
  const senderId : string = params['senderId'];
  if (args.length == 0) {
    if (await enoughWeen(senderId)) {
      return convoHandler.send(chooseHowToRedeem);
    } else {
      return convoHandler.send(sorryNotEnough);
    }
  }
  if (args[0] == 'DigitalServices') {
    const service = args[1];
    if (args.length == 1) {
      return convoHandler.send(chooseDigitalService);
    }
    if (args.includes('confirm')) {
      if (args.indexOf('confirm') == args.length - 1) {
        return getDigitalService(service, senderId, convoHandler);
      }
      return args.slice(-1)[0] == 'yes' ?
      redeemService(senderId, service, convoHandler) :
      cancelRedemption(convoHandler);
    }
  }
  return askForHelp(senderId, args)
      .then(() => convoHandler.send(informWillBeReached));
};
