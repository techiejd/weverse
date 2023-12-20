import {
  FirestoreDataConverter,
  WithFieldValue,
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
} from "firebase-admin/firestore";
import {
  initiative,
  socialProof,
  member,
  posiFormData,
  content,
  DbBase,
  sponsorship,
} from "../shared";
import { z } from "zod";

function createdAtToDateEverywhere(obj: any): any {
  if (typeof obj === "object" && obj !== null) {
    if (Array.isArray(obj)) {
      return obj.map((item) => createdAtToDateEverywhere(item));
    } else {
      const newObj: any = {};
      Object.entries(obj).forEach(([k, v]) => {
        newObj[k] =
          k === "createdAt"
            ? (v as any).toDate()
            : createdAtToDateEverywhere(v);
      });
      return newObj;
    }
  } else {
    return obj;
  }
}

const makeDataConverter = <T extends z.ZodType<DbBase>>(
  zAny: T
): FirestoreDataConverter<z.infer<typeof zAny>> => ({
  toFirestore: (data: WithFieldValue<z.infer<typeof zAny>>): DocumentData => {
    const { createdAt, ...others } = data;
    return { ...others, createdAt: createdAt ? createdAt : Timestamp.now() };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot): z.infer<typeof zAny> => {
    const data = snapshot.data();
    const parsedDateData = createdAtToDateEverywhere(data);
    // anything with serverTimestamp does not exist atm if pending writes.
    return zAny.parse({
      ...parsedDateData,
      path: snapshot.ref.path,
    });
  },
});

export const contentConverter = makeDataConverter(content);
export const initiativeConverter = makeDataConverter(initiative);
export const socialProofConverter = makeDataConverter(socialProof);
export const memberConverter = makeDataConverter(member);
export const posiFormDataConverter = makeDataConverter(posiFormData);
export const sponsorshipConverter = makeDataConverter(sponsorship);
