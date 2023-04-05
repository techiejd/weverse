import { z } from "zod";

// TODO(techiejd): Check all urls are with our hosting.
export const formUrl = z.string().url();