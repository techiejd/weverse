import { z } from "zod";
import { buttonInfo, messageType } from "../facebook/conversation/utils";
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

// TODO(techiejd): Move to sofia
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
export type User = z.infer<typeof user>;

const message = z.object({
  type: messageType,
  text: z.string(),
  buttons: buttonInfo.array().optional(),
});

export type TxMessage = z.infer<typeof message>;

const txDatumType = z.enum(["message", "resourcesChange"]);
const datum = z.discriminatedUnion("type", [
  z.object({ type: z.literal(txDatumType.enum.message), message: message }),
  z.object({
    type: z.literal(txDatumType.enum.resourcesChange),
    resourcesChange: changesInResources,
  }),
]);

export type TxDatum = z.infer<typeof datum>;

export const transaction = z.object({
  from: admin, // right now, only admins can send.
  to: user.array().nonempty(),
  data: datum.array().nonempty(),
  createdAt: z.string()
});

export type Transaction = z.infer<typeof transaction>;
