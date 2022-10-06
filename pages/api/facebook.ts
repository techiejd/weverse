import type { NextApiRequest, NextApiResponse } from 'next'
import * as schemas from '../../modules/facebook/schemas';
import {OneWeManager} from '../../modules/facebook/messenger/oneWeManager';
import {logger} from '../../common/logger';

const authorizeHeadersAgainst = (req: NextApiRequest,
    res: NextApiResponse,
    verifyToken: string) => {
  if (
    req.query['hub.mode'] == 'subscribe' &&
        req.query['hub.verify_token'] == verifyToken
  ) {
    res.send(req.query['hub.challenge']);
  } else {
    res.status(400).end();
  }
};


export default function facebook(
  req: NextApiRequest,
  res: NextApiResponse
) {
      //TODO(techiejd): figure out secrets in this app. 'FB_PAGE_ACCESS_TOKEN', 'FB_VERIFY_TOKEN'
      //TODO(techiejd): figure out logging.
      try {
        switch (req.method) {
          case 'GET': {
            authorizeHeadersAgainst(req, res,
                String(process.env.FB_VERIFY_TOKEN));
            break;
          }

          case 'POST': {
            logger.info({body: req.body}, 'Req body in post');
            let data: schemas.ReqBody = {
              object: 'unassigned',
              entry: [],
            };

            try {
              data = schemas.reqBody.parse(req.body);
            } catch (error) {
              logger.error({error: error},
                  'Error in parsing request for webhook.');
            }
            if (data.object == 'page') {
              const manager = new OneWeManager();
              data.entry.forEach(function(pageEntry) {
                pageEntry.messaging?.forEach(function(messengerEvent) {
                  manager.handle({messenger: messengerEvent});
                });
              });
            } else {
              logger.warn({data: data}, 'got a non-page webhook event');
            }
            res.status(200).end();
            break;
          }
        }
      } catch (error) {
        logger.error({error: error},
            'Top level error in FB Webhook.');
      }
    };
