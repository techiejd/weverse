import * as schemas from '../../schemas';
import * as ejs from 'ejs';
import * as path from 'path';
import {GroupHandler,
  getFlattenedPaginatedData} from '../../utils';
import {OneWePrivateConversationHandler} from
  './../oneWePrivateConversationHandler';
import {getUserSnapshot} from '../../../../common/db';
import { logger } from '../../../../common/logger';
import type { NextApiRequest, NextApiResponse } from 'next';
import {makeMessage} from '../utils';


export const makeJuryRoomFor =
(psid:string) : schemas.Messenger.Message => makeMessage(
    `Ingresa a la sala del jurado a través de este botón.`,
    [{title: `A votar`, url: 'https://onewe.tech/vote?psid=' + psid}]);

export const learnAbout : schemas.Messenger.Message = makeMessage(
    'Hola ya empezó #WeRaceEmp01',
    [
      {title: 'Linea de tiempo ⌛', url: 'https://youtu.be/xaq6A6Fdy8A'},
      {title: 'Primer Misión! 👀', url: 'https://youtu.be/YKsNFFRlvf0'},
      {title: 'Publicar Ya 📷', url: 'https://www.facebook.com/groups/737230100931116'},
    ]
);


const since = new Date(2022, 8, 27, 15);

// TODO(techiejd): Move to pages.
// export function vote(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//       logger.info({query: req.query}, 'vote req query');
//       getUserSnapshot(String(req.query.psid)).then(async (userSnapshot) => {
//         const posts = (await
//         GroupHandler.getWeVersePosts(userSnapshot.data().token,
//             since, undefined, 'all')).filter((post) =>
//           post.id != '737230100931116_778655173455275' &&
//           post.id != '737230100931116_786821762638616');
//         shuffle(posts);
//         const candidates = await Promise.all(
//             posts.map(parsePostForVotingInfo));
//           res.send({
//             candidates: candidates,
//             starAllowance: 5,
//             psid: req.query.psid,
//           });
//         ejs.renderFile(
//             path.join(__dirname, '../../../../views/vote.ejs'),
//             {
//               candidates: candidates,
//               starAllowance: 5,
//               psid: req.query.psid,
//             },
//             (err, string) => {
//               if (err) {
//                 logger.error({error: err}, 'Error in rendering vote.');
//                 res.send(
//                     `Hola hubo un error, por favor contactar \
// support@onewe.foundation`);
//                 return;
//               }
//               res.send(string);
//             });
//       });
//     };

export const requestJuryRoom = (params: Record<string, any>) => {
  const convoHandler = new OneWePrivateConversationHandler(
      params.senderId);
  convoHandler.send(makeJuryRoomFor(params.senderId));
};


