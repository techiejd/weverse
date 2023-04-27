import { createContext, useContext, Dispatch, SetStateAction } from "react";
import { z } from "zod";
import { formUrl, isDevEnvironment } from "../../../common/context/context";
import {
  FirestoreDataConverter,
  WithFieldValue,
  DocumentData,
  serverTimestamp,
  QueryDocumentSnapshot,
} from "firebase/firestore";

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
  id: z.string().optional(), // If it exists, then it exists in the db.
  summary: z.string().min(5).max(100),
  impactedPeople: z.object({
    amount: z.number().int().nonnegative(),
    howToIdentify: z.string().min(5).max(125),
  }),
  location: location,
  dates: z.object({ start: z.date(), end: z.date() }),
  video: formUrl,
  about: z.string().min(5).max(1000).optional(),
  howToSupport: howToSupport,
  makerId: z.string(),
  createdAt: z.date().optional(),
});

export type PosiFormData = z.infer<typeof posiFormData>;

export const posiFormDataConverter: FirestoreDataConverter<PosiFormData> = {
  toFirestore: (posiFormData: WithFieldValue<PosiFormData>): DocumentData => {
    const { id, ...others } = posiFormData;
    return {
      ...others,
      createdAt: posiFormData.createdAt
        ? posiFormData.createdAt
        : serverTimestamp(),
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot): PosiFormData => {
    const data = snapshot.data();
    return posiFormData.parse({
      ...data,
      id: snapshot.id,
      createdAt: data.createdAt.toDate(),
      dates: { start: data.dates.start.toDate(), end: data.dates.end.toDate() },
    });
  },
};

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

// TODO(techiejd): Look into making this string instead of | undefined.
export const getPosiPage = (id: string | undefined) => `/posi/${id}/about`;

export const getShareProps = (posiData: { summary: string; id?: string }) => ({
  title: posiData.summary,
  text: posiData.summary,
  url: `${
    isDevEnvironment ? "https://localhost:3000" : "https://onewe.co"
  }${getPosiPage(posiData.id)}`,
});
