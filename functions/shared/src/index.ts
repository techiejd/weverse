import { z } from "zod";

export const timeStamp = z.any().transform((val, ctx) => {
  if (val instanceof Date) {
    return val;
  }
  if (typeof val.toDate === "function") {
    return val.toDate() as Date;
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

export const initiativeType = z.enum(["individual", "organization"]);
export type InitiativeType = z.infer<typeof initiativeType>;
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

export const ratings = z.object({ sum: z.number(), count: z.number() });
export type Ratings = z.infer<typeof ratings>;

export const locale = z.enum(["en", "es", "fr", "de", "pl", "pt"]);
export type Locale = z.infer<typeof locale>;

const dbBase = z.object({
  //deprecated: id: z.string().optional(),
  path: z.string().min(1).optional(),
  locale: locale.optional(),
  createdAt: z.date().optional(), // from db iff exists
});
export type DbBase = z.infer<typeof dbBase>;

const initiativePresentationExtension = z.object({
  presentationVideo: formUrl.optional(),
  howToSupport: howToSupport.optional(),
  about: z.string().optional(),
  validationProcess: z.string().optional(),
});

export type InitiativePresentationExtension = z.infer<
  typeof initiativePresentationExtension
>;

export function createNestedLocalizedSchema<ItemType extends z.ZodTypeAny>(
  itemSchema: ItemType
) {
  // Look into a way to make these keys programmaticly
  return z.object({
    en: itemSchema,
    es: itemSchema,
    fr: itemSchema,
    de: itemSchema,
    pl: itemSchema,
    pt: itemSchema,
  });
}

// deprecated: maker
export const initiative = dbBase
  .extend({
    type: initiativeType,
    organizationType: organizationType.optional(),
    name: z.string().min(1),
    pic: formUrl.optional(),
    email: z.string().optional(),
    incubator: z.string().optional(),
    ratings: ratings.optional(),
  })
  .merge(
    createNestedLocalizedSchema(initiativePresentationExtension.optional())
  );
export type Initiative = z.infer<typeof initiative>;

const currency = z.enum(["cop", "usd", "eur", "gbp"]);
export type Currency = z.infer<typeof currency>;

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
  currency: currency,
});

const stripe = z.object({
  customer: z.string().min(1),
  subscription: z.string().min(1).optional(),
  billingCycleAnchor: timeStamp.optional(),
  status: z.enum(["active", "incomplete", "canceled"]),
});
const contentSettings = z.object({
  locales: locale.array(),
});
export const phoneNumber = z.object({
  countryCallingCode: z.string().min(1),
  nationalNumber: z.string().min(1),
});

export const member = dbBase.extend({
  // deprecated: makerId: z.string().optional(),
  // deprecated: initiativeId: z.string(),
  customer: customer.optional(),
  stripe: stripe.optional(),
  pic: formUrl.optional(),
  name: z.string().min(1),
  settings: contentSettings.optional(),
  phoneNumber: phoneNumber,
});
export type Member = z.infer<typeof member>;

// This is an edge.
export const like = dbBase;
export type Like = z.infer<typeof like>;

export const socialProof = dbBase.extend({
  rating: z.number(),
  videoUrl: formUrl.optional(),
  // deprecated: byMaker: z.string().optional(),
  // deprecated: byInitiative: z.string(),
  fromMember: z.string(),
  // deprecated: forMaker: z.string().optional(),
  forInitiative: z.string(),
  forAction: z.string().optional(),
  text: z.string().optional(),
});

export type SocialProof = z.infer<typeof socialProof>;

// related to
// / <reference types="google.maps" />
const location = z
  .object({
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
  })
  .deepPartial(); // TODO(techiejd): Look into this error.

const validation = z.object({
  validator: z.string(), // incubator path
  validated: z.boolean(),
});
export type Validation = z.infer<typeof validation>;

export const actionPresentationExtension = z.object({
  media: media,
  summary: z.string().min(1),
});

export const posiFormData = dbBase
  .extend({
    // deprecated: makerId: z.string().optional(),
    // deprecated: initiativeId: z.string(),
    location: location.optional(),
    ratings: ratings.optional(),
    validation: validation.optional(),
    // retired - howToIdentifyImpactedPeople: z.string().min(1).optional(),
  })
  .merge(createNestedLocalizedSchema(actionPresentationExtension.optional()));

export type PosiFormData = z.infer<typeof posiFormData>;

const parseDBInfo = <T extends z.ZodType<DbBase>>(zAny: T) =>
  z.preprocess((val) => {
    const { createdAt, ...others } = z.object({}).passthrough().parse(val);
    return {
      createdAt: createdAt ? (createdAt as any).toDate() : undefined,
      ...others,
    };
  }, zAny);

const actionContent = dbBase.extend({
  type: z.literal("action"),
  data: parseDBInfo(posiFormData),
});
const socialProofContent = dbBase.extend({
  type: z.literal("testimonial"),
  data: parseDBInfo(socialProof),
});

export const content = z.discriminatedUnion("type", [
  actionContent,
  socialProofContent,
]);
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
  // deprecated: maker: z.string()
  initiative: z.string(),
  member: z.string(),
  memberPublishable: z.boolean().optional(),
  currency: currency,
});

export type Sponsorship = z.infer<typeof sponsorship>;

export const incubatee = dbBase.extend({
  initiativePath: z.string().optional(), // Path to the initiative that accepted.
  initializeWith: z
    .object({
      name: z.string().min(1),
      type: initiativeType,
      organizationType: organizationType.optional(),
    })
    .optional(),
});

export type Incubatee = z.infer<typeof incubatee>;

// This is are all edges from the member to the initiative or action.
export const from = z.discriminatedUnion("type", [
  dbBase.extend({ type: z.literal("testimonial"), data: socialProof }),
  dbBase.extend({ type: z.literal("sponsorship"), data: sponsorship }),
  dbBase.extend({ type: z.literal("like"), data: like }),
]);
