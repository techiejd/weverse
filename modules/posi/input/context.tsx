import { createContext, useContext, Dispatch, SetStateAction } from "react";
import { z } from "zod";
import { formUrl } from "../../../common/context/context";

export enum InvestedTimeLevel {
  hour = 1,
  day = 2,
  week = 3,
  twoWeeks = 5,
  month = 8,
  threeMonths = 13,
  halfYear = 21,
  year = 34,
}
export const levelToColors = {
  [InvestedTimeLevel.hour]: "violet",
  [InvestedTimeLevel.day]: "indigo",
  [InvestedTimeLevel.week]: "blue",
  [InvestedTimeLevel.twoWeeks]: "green",
  [InvestedTimeLevel.month]: "yellow",
  [InvestedTimeLevel.threeMonths]: "orange",
  [InvestedTimeLevel.halfYear]: "red",
  [InvestedTimeLevel.year]: "white",
};
export const investedTimeLevel = z.nativeEnum(InvestedTimeLevel);

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

const howToSupport = z
  .object({
    contact: z.string().max(500).optional(),
    finance: z.string().max(500).optional(),
  })
  .optional();
export type HowToSupport = z.infer<typeof howToSupport>;

export const posiFormData = z.object({
  summary: z.string().min(5).max(100),
  impactedPeople: z.object({
    amount: z.number().int().nonnegative(),
    howToIdentify: z.string().min(5).max(125),
  }),
  investedTimeLevel: investedTimeLevel,
  tags: z.string().array(),
  location: location,
  dates: z.object({ start: z.date(), end: z.date() }),
  video: formUrl,
  about: z.string().min(5).max(1000).optional(),
  howToSupport: howToSupport,
  makerId: z.string(),
  createdAt: z.any(), // TODO(techiejd): Look into firebase schemas and transformations.
});

// TODO(techiejd): Look into a better way of doing this maybe using firestore zod schema
export const castFirestoreDocToPosiFormData = z.preprocess(
  (val: any) => ({
    ...val,
    dates: {
      start: new Date(val.dates.start.seconds * 1000),
      end: new Date(val.dates.end.seconds * 1000),
    },
  }),
  posiFormData
);

export type PosiFormData = z.infer<typeof posiFormData>;
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
