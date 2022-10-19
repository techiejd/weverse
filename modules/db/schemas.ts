import { z } from "zod";
import * as sofi from "../sofia/schemas";

const resources = z.object({
  [sofi.Resource.Ween]: z.number(),
  [sofi.Resource.Camera]: z.number(),
  [sofi.Resource.MagnifyingGlass]: z.number(),
  [sofi.Resource.Mask]: z.number(),
  [sofi.Resource.Star]: z.number(),
  [sofi.Resource.VipPass]: z.number(),
});

export const userData = z.object({
  name: z.string(),
  psid: z.string(),
  notifications_permissions: z.object({
    expires: z.number(),
    token: z.string(),
  }),
  token: z.string(),
  gameInfo: z.object({
    resources: resources,
  }),
  asid: z.string(),
});

export type UserData = z.infer<typeof userData>;

export const resourceEnum = z.nativeEnum(sofi.Resource);

export const changesInResources = resources.partial();

export type ChangesInResources = z.infer<typeof changesInResources>;

const baseUser = z.object({
  name: z.string(),
  id: z.string(),
});
const baseAdmin = z.object({
  actingAsSofi: z.literal(true),
});

const admin = baseAdmin.merge(baseUser.partial());
type Admin = z.infer<typeof admin>;
export const Sofi: Admin = {
  actingAsSofi: true,
};

const user = z.union([admin, baseUser]);

// TODO(jddominguez): flesh out message
const message = z.object({
  text: z.string(),
});

const datum = z.discriminatedUnion("type", [
  z.object({ type: z.literal("message"), message: message }),
  z.object({
    type: z.literal("resourcesChange"),
    resourcesChange: changesInResources,
  }),
]);

export const transaction = z.object({
  from: user,
  to: user.array().nonempty(),
  data: datum.array().nonempty(),
});

export type Transaction = z.infer<typeof transaction>;
