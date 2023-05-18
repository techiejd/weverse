import { posiFormData, socialProof } from "../../functions/shared/src";
import { z } from "zod";
export const content = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("action"),
    data: posiFormData,
    createdAt: z.date(),
  }),
  z.object({
    type: z.literal("impact"),
    data: socialProof,
    createdAt: z.date(),
  }),
]);
export type Content = z.infer<typeof content>;
