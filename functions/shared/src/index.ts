import {z} from "zod";

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
]);
export type OrganizationType = z.infer<typeof organizationType>;

const howToSupport = z.object({
  contact: z.string().max(500).optional(),
  finance: z.string().max(500).optional(),
});
export type HowToSupport = z.infer<typeof howToSupport>;

export const ratings = z.object({sum: z.number(), count: z.number()});
export type Ratings = z.infer<typeof ratings>;

export const maker = z.object({
  id: z.string().optional(),
  ownerId: z.string(),
  type: makerType,
  pic: formUrl.optional(),
  name: z.string().min(1),
  organizationType: organizationType.optional(),
  createdAt: z.date().optional(),
  howToSupport: howToSupport.optional(),
  about: z.string().optional(),
  ratings: ratings.optional(),
  email: z.string().optional(),
});
export type Maker = z.infer<typeof maker>;

export const member = z.object({
  makerId: z.string(),
  id: z.string().optional(),
  createdAt: z.date().optional(),
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
