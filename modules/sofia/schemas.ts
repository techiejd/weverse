import {z} from 'zod';


/**
 * A level token for keeping track of user's current level progressgion.
 */
export class LevelToken {
  level: number;
  daysAtLevel: number;
  /**
   *
   * @param {int} level The level.
   * @param {int} daysAtLevel The number of days at this level.
   */
  constructor({level = 0, daysAtLevel = 0} = {}) {
    this.level = level;
    this.daysAtLevel = daysAtLevel;
  }
}

export enum Role {
  Entrepreneur,
  Reporter,
  Jury,
  Detective,
  Imposter
}
// const roleEnum = z.nativeEnum(Role);

export enum Resource {
  Ween = '⚡',
  VipPass = '🎟️',
  Camera = '📷',
  Star = '🌟',
  MagnifyingGlass = '🔍',
  Mask = '👺',
}
// const resourceEnum = z.nativeEnum(Resource);

export const userGameInfo = z.object({
  levelIndices: z.record(z.number()),
  resources: z.record(z.number()),
});

export type UserGameInfo = z.infer<typeof userGameInfo>;

export const startingUserGameInfo: UserGameInfo = (() => {
  return userGameInfo.parse({
    resources: {
      [Resource.Star]: 0,
      [Resource.Ween]: 1000,
      [Resource.Camera]: 0,
      [Resource.Mask]: 0,
      [Resource.MagnifyingGlass]: 0,
      [Resource.VipPass]: 0,
    },
    levelIndices: {
      [Role.Entrepreneur]: -1,
      [Role.Reporter]: -1,
      [Role.Jury]: -1,
      [Role.Detective]: -1,
      [Role.Imposter]: -1,
    },
  });
})();

export const challenge = z.object({
  title: z.string(),
  start: z.date(),
  end: z.date().optional(),
});

export type Challenge = z.infer<typeof challenge>;

const media = z.object({
  height: z.number().optional(),
  width: z.number().optional(),
  image: z.string().optional(),
  source: z.string().optional(),
  type: z.enum(["image", "video"])
});

const candidate = z.object({
  message: z.string().optional(),
  id: z.string(),
  medias: media.array().optional()
})

export type Candidate = z.infer<typeof candidate>;

export const votesRes = z.object({
  candidates: candidate.array(),
  starAllowance: z.number(),
  psid: z.string()
})

export type VotesRes = z.infer<typeof votesRes>;
export type Media = z.infer<typeof media>;