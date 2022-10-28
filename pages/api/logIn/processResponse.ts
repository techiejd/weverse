import type { NextApiRequest, NextApiResponse } from 'next';
import { addUser } from '../../../common/db';
import {logger} from "../../../common/logger";
import { OneWeManager } from '../../../modules/facebook/conversation/oneWeManager';
import * as fbSchemas from "../../../modules/facebook/schemas";

export default async function processResponse(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const fbOAuthUrl = 'https://graph.facebook.com/v14.0/oauth/access_token?';
  const params = new URLSearchParams({
    'client_id': String(process.env.APP_ID),
    'redirect_uri': 'https://onewe.tech/api/logIn/processResponse',
    'client_secret': String(process.env.APP_SECRET),
    'code': String(req.query.code),
  });

  const psid = String(req.query.state).split('+')[0];

  fetch(fbOAuthUrl + params, {
    method: 'GET',
  }).then((response) => {
    if (!response.ok) {
      response.text().then((text) => {
        logger.error(`Error in fetchUserToken: ${text}`);
      });
      res.send(`Error fetchUserToken en metiendo al sistema,
      por favor contactar support@onewe.foundation`);
      return;
    }
    const fetchLongLivedUserToken =
    async function(response: fbSchemas.TokenResponseType) {
      if (response.expires_in != undefined) { // is long lived
        return Promise.resolve(response.access_token);
      }
      const params = new URLSearchParams({
        'grant_type': 'fb_exchange_token',
        'client_id': String(process.env.APP_ID),
        'client_secret': String(process.env.APP_SECRET),
        'fb_exchange_token': String(response.access_token),
      });
      return fetch(fbOAuthUrl + params, {
        method: 'GET',
      }).then((response) => {
        if (!response.ok) {
          response.text().then((text) => {
            logger.error(
                'Error in fetchLongLivedUserToken: ', text);
          });
          res.send(`Error fetchLongLivedUserToken en metiendo al sistema,
          por favor contactar support@onewe.foundation`);
        }
        return response.json().then((response) => {
          return response.access_token;
        });
      });
    };

    const fetchUserInfo =
    async function(token: string /* short lived token ok */) {
      const params = new URLSearchParams({
        'fields': 'id,name',
        'access_token': token,
      });
      return fetch('https://graph.facebook.com/v14.0/me?' + params, {
        method: 'GET',
      }).then(async (response) => {
        if (!response.ok) {
          response.text().then((text) => {
            logger.error(
                'Error in fetchUserInfo: ', text);
          });
          res.send(`Error fetchUserInfo en metiendo al sistema,
          por favor contactar support@onewe.foundation`);
        }
        return response.json().then(
            (response: {id: string, name: string}) => {
              return {
                asid: response.id,
                name: response.name,
              };
            });
      });
    };

    response.json().then((response) => {
      const fetchAndSetUser =
      async function(response: fbSchemas.TokenResponseType) {
        const [token, userInfo] = await Promise.all(
            [fetchLongLivedUserToken(response),
              fetchUserInfo(response.access_token)]);
        logger.info('New user being added:', {
          asid: userInfo.asid,
          name: userInfo.name,
          psid: psid,
        });

        const manager = new OneWeManager();
        manager.handle({logIn: {type: 'Registering', userId: psid}});

        addUser({asid: userInfo.asid, name: userInfo.name, psid, token}).then(() => {
          // TODO(jddominguez): what happens if db adding fails?
          manager.handle({logIn: {type: 'Registered', userId: psid}});
        });
      };
      fetchAndSetUser(response);
      const isOnMobile = (() => {
        const ua = String(req.headers['user-agent']).toLowerCase();
        // eslint-disable-next-line max-len, no-useless-escape
        const isMobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(ua) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(ua.substr(0, 4));
        return !!isMobile;
      })();
      if (isOnMobile) {
        res.redirect(`http://m.me/oneweweverse`);
      } else {
        res.send(`
        <html>
          <body>
            <h1>You have logged in into the WeVerse through Facebook!</h1>
            <p>You may close this window now.</p>
            <script type="text/javascript"> window.close(); </script>
          </body>
        </html>
        `);
      }
    });
  });
}