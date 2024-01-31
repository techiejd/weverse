import { z } from "zod";
import { DbBase, member, sponsorship, from } from "../../functions/shared/src";
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  Timestamp,
  WithFieldValue,
} from "firebase-admin/firestore";

namespace Utils {
  //TODO(techiejd): This is a hack to get around sharing the same schema between nextjs and firebase functions.
  const makeDataConverter = <T extends z.ZodType<DbBase>>(
    zAny: T
  ): FirestoreDataConverter<z.infer<typeof zAny>> => ({
    toFirestore: (data: WithFieldValue<z.infer<typeof zAny>>): DocumentData => {
      const { createdAt, ...others } = data;
      return { ...others, createdAt: createdAt ? createdAt : Timestamp.now() };
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot): z.infer<typeof zAny> => {
      const data = snapshot.data();
      // anything with serverTimestamp does not exist atm if pending writes.
      return zAny.parse({
        ...data,
        path: snapshot.ref.path,
      });
    },
  });

  export const memberConverter = makeDataConverter(member);
  export const sponsorshipConverter = makeDataConverter(sponsorship);
  export const fromConverter = makeDataConverter(from);
}

export default Utils;
