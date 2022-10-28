import type { NextApiRequest, NextApiResponse } from 'next';
import {Strategy} from 'passport-facebook';
import passport from 'passport';
import {generate} from 'randomstring';

const strategy = new Strategy({
  clientID: String(process.env.APP_ID),
  clientSecret: String(process.env.APP_SECRET),
  callbackURL: 'https://onewe.tech/api/logIn/processResponse',
},
function(accessToken, refreshToken, profile, cb) {
  // We're not using passport to consume log in info.
  return;
}
);

export default async function createRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  passport.use(strategy);
  passport.authenticate(
      'facebook',
      {scope: ['groups_access_member_info'],
        state: String(req.query.psid) + '+' + generate()})(req, res);
}