import { initializeApp } from 'firebase/app';
import {
  FirestoreDataConverter,
  WithFieldValue,
  DocumentData,
  serverTimestamp,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { maker, socialProof, member, posiFormData, like, DbBase, content, sponsorship } from '../../functions/shared/src';
import { z } from 'zod';

export const creds = {
  apiKey: String(process.env.NEXT_PUBLIC_REACT_APP_API_KEY),
  authDomain: String(process.env.NEXT_PUBLIC_REACT_APP_AUTH_DOMAIN),
  projectId: String(process.env.NEXT_PUBLIC_REACT_APP_PROJECT_ID),
  storageBucket: String(process.env.NEXT_PUBLIC_REACT_APP_STORAGE_BUCKET),
  messagingSenderId: String(process.env.NEXT_PUBLIC_REACT_APP_MESSAGING_SENDER_ID),
  appId: String(process.env.NEXT_PUBLIC_REACT_APP_ID),
  measurementId: String(process.env.NEXT_PUBLIC_REACT_APP_MEASUREMENT_ID),
};

console.log('creds', creds);

export const app = initializeApp(creds);

const makeDataConverter =
<T extends z.ZodType<DbBase>>(zAny: T) :
 FirestoreDataConverter<z.infer<typeof zAny>> => ({
    toFirestore: (data: WithFieldValue<z.infer<typeof zAny>>): DocumentData => {
      const {id, createdAt, ...others} = data;
      return {...others, createdAt: createdAt ? createdAt : serverTimestamp()};
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot): z.infer<typeof zAny> => {
      const data = snapshot.data();
      // anything with serverTimestamp does not exist atm if pending writes.
      return zAny.parse({
        ...data,
        id: snapshot.id,
        createdAt: data.createdAt ? data.createdAt.toDate() : undefined,
      });
    },
  });

export const makerConverter = makeDataConverter(maker);
export const socialProofConverter = makeDataConverter(socialProof);
export const memberConverter = makeDataConverter(member);
export const posiFormDataConverter = makeDataConverter(posiFormData);
export const likeConverter = makeDataConverter(like);
export const contentConverter = makeDataConverter(content);
export const sponsorshipConverter = makeDataConverter(sponsorship);