import {z} from "zod";

export const timeStamp = z.any().transform((val, ctx) => {
  if (val instanceof Date) {
    return val;
  }
  if (typeof val.toDate === 'function') {
    return (val.toDate() as Date);
  }
  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: "Not a firestore timestamp or date.",
  });
  return z.NEVER;
});

// TODO(techiejd): Check all urls are with our hosting.
export const formUrl = z.string().url();
export const mediaType = z.enum(["video", "img"]);
export type MediaType = z.infer<typeof mediaType>;
export const media = z.object({
  type: mediaType,
  url: formUrl,
});
export type Media = z.infer<typeof media>;

export const makerType = z.enum(["individual", "organization"]);
export const organizationType = z.enum([
  "nonprofit",
  "religious",
  "unincorporated",
  "profit",
  "incubator",
]);
export type OrganizationType = z.infer<typeof organizationType>;

const howToSupport = z.object({
  contact: z.string().max(500).optional(),
});
export type HowToSupport = z.infer<typeof howToSupport>;

export const ratings = z.object({sum: z.number(), count: z.number()});
export type Ratings = z.infer<typeof ratings>;

// TODO(techiejd): go through and extend all the db ones.
const dbBase = z.object({
  id: z.string().optional(),
  createdAt: z.date().optional(), // from db iff exists
});
export type DbBase = z.infer<typeof dbBase>;

export const maker = z.object({
  id: z.string().optional(),
  ownerId: z.string().or(z.enum(["invited"])),
  type: makerType,
  pic: formUrl.optional(),
  name: z.string().min(1),
  organizationType: organizationType.optional(),
  createdAt: z.date().optional(),
  howToSupport: howToSupport.optional(),
  about: z.string().optional(),
  ratings: ratings.optional(),
  email: z.string().optional(),
  incubator: z.string().optional(),
});
export type Maker = z.infer<typeof maker>;

const customer = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  address: z.object({
    postalCode: z.string().min(1),
    country: z.string().min(1),
    countryCode: z.string().min(1),
  }),
});

const stripe = z.object({
  customer: z.string().min(1),
  subscription: z.string().min(1).optional(),
  billingCycleAnchor: timeStamp.optional(),
  status: z.enum(["active", "incomplete", "canceled"]),
});

export const member = z.object({
  makerId: z.string(),
  id: z.string().optional(),
  createdAt: z.date().optional(),
  customer: customer.optional(),
  stripe: stripe.optional(),
  pic: formUrl.optional(),
  name: z.string().min(1).optional(),
});
export type Member = z.infer<typeof member>;

// This is an edge.
export const like = z.object({
  id: z.string().optional(),
  createdAt: z.date().optional(),
})
export type Like = z.infer<typeof like>;

export const socialProof = z.object({
  id: z.string().optional(),
  rating: z.number(),
  videoUrl: formUrl.optional(),
  byMaker: z.string(),
  forMaker: z.string(),
  forAction: z.string().optional(),
  createdAt: z.date().optional(),
  text: z.string().optional(),
});

export type SocialProof = z.infer<typeof socialProof>;

// related to
// / <reference types="google.maps" />
const location = z.object({
  /**
   * A place ID that can be used to retrieve details about this place using
   * the place details service (see {@link
   * google.maps.places.PlacesService.getDetails}).
   */
  id: z.string(),
  /**
   * Structured information about the place's description, divided into a
   * main text and a secondary text. We remove lots of google info.
   * (see {@link google.maps.places.StructuredFormatting}).
   */
  structuredFormatting: z.object({
    mainText: z.string(),
    secondaryText: z.string(),
  }),
  /**
   * Information about individual terms in the above description, from most to
   * least specific. For example, "Taco Bell", "TOWN",
   * and "STATE".
   */
  terms: z
    .object({
      /**
       * The offset, in unicode characters, of the start of this term in the
       * description of the place. AKA first term's offset = 0.
       */
      offset: z.number(),
      /**
       * The value of this term, for example,"Taco Bell".
       */
      value: z.string(),
    })
    .array(),
  /**
   * An array of types that the prediction belongs to, for example
   * <code>'establishment'</code> or <code>'geocode'</code>.
   */
  types: z.string().array(),
}).deepPartial(); // TODO(techiejd): Look into this error.

// TODO(techiejd): Reshape db. It should go posi
// {action: Action, impacts: Impact[], makerId}
export const posiFormData = z.object({
  id: z.string().optional(), // If it exists, then it exists in the db.
  summary: z.string().min(1),
  howToIdentifyImpactedPeople: z.string().min(1).optional(),
  location: location.optional(),
  media: media,
  makerId: z.string(), // TODO(techiejd): How many chars is the id?
  createdAt: z.date().optional(),
  ratings: ratings.optional(),
});

export type PosiFormData = z.infer<typeof posiFormData>;

const parseDBInfo =
<T extends z.ZodType<DbBase>>(zAny: T) => z.preprocess((val) => {
  const {createdAt, ...others} = z.object({}).passthrough().parse(val);
  return {createdAt: createdAt ? (createdAt as any).toDate() : undefined, ...others};
}, zAny);

const actionContent = dbBase.extend({type: z.literal("action"), data: parseDBInfo(posiFormData)});
const socialProofContent = dbBase.extend({type: z.literal("socialProof"), data: parseDBInfo(socialProof)});

export const content = z.discriminatedUnion("type", 
[actionContent, 
socialProofContent]);
export type Content = z.infer<typeof content>;

export const sponsorshipLevel = z.enum(["admirer", "fan", "lover", "custom"]);
export type SponsorshipLevel = z.infer<typeof sponsorshipLevel>;

export const sponsorship = dbBase.extend({
  stripeSubscriptionItem: z.string().or(z.enum(["incomplete"])),
  stripePrice: z.string(), // Stripe's price id.
  paymentsStarted: timeStamp.optional(), // When this particular sponsorship started being paid for.
  total: z.number(),
  sponsorshipLevel: sponsorshipLevel,
  customAmount: z.number().optional(),
  tipAmount: z.number(),
  denyFee: z.boolean().optional(),
  maker: z.string(),
  member: z.string(),
  memberPublishable: z.boolean().optional(),
});

export type Sponsorship = z.infer<typeof sponsorship>;

export const incubatee = dbBase.extend({
  acceptedInvite: z.boolean().optional(),
});