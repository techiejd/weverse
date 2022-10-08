import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import {logger} from '../../common/logger';

export const config = {
  api: {
    bodyParser: false,
    sizeLimit: '200mb',
  }
};

export default async function onboarding(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //logger.info({body: req.body}, "Ayo this is wild");
    //  logger.info({files: req.body["files"]}, "looking at files");

  const form = new formidable.IncomingForm({ multiples: true });
  const parsedForm = form.parse(req, async function (err, fields, files) {
    logger.info({error: err, files: files, fields: fields}, "info");
    res.redirect("/onboarding/success");
  });
  console.log(parsedForm);
};