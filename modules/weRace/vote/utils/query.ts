import { getChallenge } from "../../../../common/db";
import { Feed } from "../../../facebook/schemas";
import { GroupHandler } from "../../../facebook/utils";
import { challenge } from "../../../sofia/schemas";

export const getWeRacePosts = async (
  weRaceId: string,
  fbUserAccessToken: string
): Promise<Feed> => {
  const weRace = challenge.parse(
    await getChallenge(weRaceId).then((weRaceSnapshot) => weRaceSnapshot.data())
  );

  const posts = await GroupHandler.getWeVersePosts(
    fbUserAccessToken,
    weRace.start,
    undefined,
    "all"
  );
  return posts.filter((p) => {
    const weRaceStart = weRace.start;
    const weRaceEnd = weRace.end;
    const createdTime = new Date(String(p.created_time));
    if (createdTime < weRaceStart || (weRaceEnd && createdTime > weRaceEnd)) {
      return false;
    }

    // TODO(techiejd): Look into using message_tags
    if (weRace.hashtags == undefined || weRace.hashtags.length == 0) {
      return true;
    }

    return weRace.hashtags.some((tag) =>
      p.message?.toLowerCase().includes(tag.toLowerCase())
    );
  });
};
