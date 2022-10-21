import * as schemas from '../../modules/facebook/schemas';
import {Candidate, media, Media} from '../../modules/sofia/schemas';
import {GroupHandler,getFlattenedPaginatedData} from '../../modules/facebook/utils';
import {getUserSnapshot} from '../../common/db';
import { logger } from '../../common/logger';
import type { NextApiRequest, NextApiResponse } from 'next';

// Colombia is GMT-05:00 and month starts by 0
//// export maybe have to define
const since = new Date(2022, 8, 27, 15);
// export const until = new Date(2022, 8, 29, 0);
const shuffle = (array: Array<any>) => {
  let currentIndex = array.length; let randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
};

const parsePostForVotingInfo = async (post: schemas.Post) : Promise<Candidate> => {
  let medias : Array<Media> | undefined = undefined;
  if (post.attachments) {
    const attachment2MediaObject = (a: Record<string, unknown>) => {
      const attachment = schemas.attachment.parse(a);
      return media.parse({
        height: attachment.media?.image?.height,
        width: attachment.media?.image?.width,
        image: attachment.media?.image?.src,
        source: attachment.media?.source,
        type: attachment.type,
      });
    };
    if (post.attachments.data[0] && post.attachments.data[0].subattachments) {
      medias =
    (await getFlattenedPaginatedData(
        post.attachments.data[0].subattachments))
        .map(attachment2MediaObject);
    } else {
      medias = (await getFlattenedPaginatedData(post.attachments))
          .map(attachment2MediaObject);
    }
  }
  return {
    message: post.message,
    id: post.id,
    medias: medias,
  };
};

export default function vote(
  req: NextApiRequest,
  res: NextApiResponse
) {
    logger.info({query: req.query}, 'vote req query');
    
}

