import { UserData } from '../../db/schemas';

export const prettifyJSON = (json: Record<string, any>) => JSON.stringify(
  json, null, 2).replace('{', '').replace('}', '');


export namespace Notify { 
  export const templateBody = (body: string, user: UserData) => {
    const templateFunc =
        new Function('user', 'return `' + body + '`;');
    const userFacingInfo = {
      name: user.name,
      resources: user.gameInfo.resources,
      psid: user.psid,
    };
    return templateFunc(userFacingInfo);
  };
}