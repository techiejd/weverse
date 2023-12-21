import { initializeApp } from "firebase/app";
import {
  FirestoreDataConverter,
  WithFieldValue,
  DocumentData,
  serverTimestamp,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import {
  initiative,
  socialProof,
  member,
  posiFormData,
  like,
  DbBase,
  content,
  sponsorship,
  incubatee,
  from,
} from "../../functions/shared/src";
import { z } from "zod";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useAppState } from "../context/appState";

export const creds = {
  apiKey: String(process.env.NEXT_PUBLIC_REACT_APP_API_KEY),
  authDomain: String(process.env.NEXT_PUBLIC_REACT_APP_AUTH_DOMAIN),
  projectId: String(process.env.NEXT_PUBLIC_REACT_APP_PROJECT_ID),
  storageBucket: String(process.env.NEXT_PUBLIC_REACT_APP_STORAGE_BUCKET),
  messagingSenderId: String(
    process.env.NEXT_PUBLIC_REACT_APP_MESSAGING_SENDER_ID
  ),
  appId: String(process.env.NEXT_PUBLIC_REACT_APP_ID),
  measurementId: String(process.env.NEXT_PUBLIC_REACT_APP_MEASUREMENT_ID),
};

export const app = initializeApp(creds);

const createUseLocalizedDataConverterFor = <T extends z.ZodType<DbBase>>(
  zAny: T
): (() => FirestoreDataConverter<z.infer<typeof zAny>>) => {
  const useLocalizedDataConverter = () => {
    const localeIn = useAppState().languages.primary;
    return useMemo(
      () => ({
        toFirestore: (
          data: WithFieldValue<z.infer<typeof zAny>>
        ): DocumentData => {
          const { locale, createdAt, ...others } = data;
          const localizedData = {
            ...others,
            createdAt: createdAt ? createdAt : serverTimestamp(),
            locale: locale ? locale : localeIn ?? "undefined", // Add the locale field to the data being sent
          };
          return localizedData;
        },
        fromFirestore: (
          snapshot: QueryDocumentSnapshot
        ): z.infer<typeof zAny> => {
          const data = snapshot.data();
          return zAny.parse({
            ...data,
            path: snapshot.ref.path,
          });
        },
      }),
      [localeIn]
    );
  };
  return useLocalizedDataConverter;
};

export const useInitiativeConverter =
  createUseLocalizedDataConverterFor(initiative);
export const useSocialProofConverter =
  createUseLocalizedDataConverterFor(socialProof);
export const useMemberConverter = createUseLocalizedDataConverterFor(member);
export const usePosiFormDataConverter =
  createUseLocalizedDataConverterFor(posiFormData);
export const useLikeConverter = createUseLocalizedDataConverterFor(like);
export const useContentConverter = createUseLocalizedDataConverterFor(content);
export const useSponsorshipConverter =
  createUseLocalizedDataConverterFor(sponsorship);
export const useIncubateeConverter =
  createUseLocalizedDataConverterFor(incubatee);
export const useFromConverter = createUseLocalizedDataConverterFor(from);

export const splitPath = (path: string | undefined) => {
  if (!path) return { collection: undefined, id: undefined };
  const splits = path.split("/");
  const id = splits.pop();
  const collection = splits.join("/");
  return { collection, id };
};
