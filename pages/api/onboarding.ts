import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { logger } from "../../common/logger";

export const config = {
  api: {
    bodyParser: false,
    sizeLimit: "200mb",
  },
};
// TODO(techiejd): Add onboarding intake API.
export default async function onboarding(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const form = new formidable.IncomingForm({ multiples: true });
  // TODO(techiejd): Switch this to use parseForm instead.
  const parsedForm = form.parse(req, async function (err, fields, files) {
    logger.info({ error: err, files: files, fields: fields }, "info");
  });
}
