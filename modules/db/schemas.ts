import {z} from 'zod';
import * as sofi from '../sofia/schemas';

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
        resources: resources
    }),
    asid: z.string(),
})

export type UserData = z.infer<typeof userData>;

export const resourceEnum = z.nativeEnum(sofi.Resource);

// TODO(techiejd): Move to sofia
export const changesInResources = resources.partial();

export type ChangesInResources = z.infer<typeof changesInResources>