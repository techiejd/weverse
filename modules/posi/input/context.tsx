import { createContext, useContext, Dispatch, SetStateAction } from "react";
import { z } from "zod";

export enum ImpactQualifierLevel {
  hour = 1,
  day = 2,
  week = 3,
  year = 5,
  life = 8,
}
export const impactQualifierLevel = z.nativeEnum(ImpactQualifierLevel);

// TODO(techiejd): Check all urls are with our hosting.
const formUrl = z.string().url();
const makerType = z.enum(["individual", "organization"]);
const maker = z.object({
  type: makerType,
  pic: formUrl,
  name: z.string().min(1),
});

// related to
/// <reference types="google.maps" />
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
});

export const posiFormData = z.object({
  summary: z.string().min(5).max(100),
  impactedPeople: z.object({
    amount: z.number().int().nonnegative(),
    level: impactQualifierLevel,
    howToIdentify: z.string().min(5).max(125),
  }),
  tags: z.string().array(),
  location: location,
  dates: z.object({ start: z.date(), end: z.date() }),
  video: formUrl,
  maker: maker,
  about: z.string().min(5).max(1000).optional(),
  howToSupport: z.string().min(5).max(1000),
});

const partialPosiFormData = posiFormData.deepPartial();
export type PartialPosiFormData = z.infer<typeof partialPosiFormData>;

export const PosiFormContext = createContext<PartialPosiFormData>({});
export const PosiFormDispatchContext = createContext<
  Dispatch<SetStateAction<PartialPosiFormData>> | undefined
>(undefined);

export const useFormData = (): [
  PartialPosiFormData,
  Dispatch<SetStateAction<PartialPosiFormData>> | undefined
] => {
  return [useContext(PosiFormContext), useContext(PosiFormDispatchContext)];
};
