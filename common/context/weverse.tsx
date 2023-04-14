import { z } from "zod";
import { formUrl } from "./context";

import {
  FirestoreDataConverter,
  WithFieldValue,
  DocumentData,
  serverTimestamp,
  QueryDocumentSnapshot,
} from "firebase/firestore";

const makerType = z.enum(["individual", "organization"]);
export const organizationType = z.enum([
  "nonprofit",
  "religious",
  "governmental",
  "unincorporated",
  "profit",
]);
export type OrganizationType = z.infer<typeof organizationType>;
export const organizationLabels = {
  [organizationType.Enum.nonprofit]: "Fundación u otra ONG",
  [organizationType.Enum.religious]: "Organización Religiosa",
  [organizationType.Enum.governmental]: "Organización Gubermental",
  [organizationType.Enum.unincorporated]: "Voluntarios",
  [organizationType.Enum.profit]: "Organización con fines de lucro",
};
export const maker = z.object({
  ownerId: z.string(),
  type: makerType,
  pic: formUrl,
  name: z.string().min(1),
  organizationType: organizationType.optional(),
  createdAt: z.date().optional(),
});
export type Maker = z.infer<typeof maker>;
const partialMaker = maker.partial();
export type PartialMaker = z.infer<typeof partialMaker>;

export const makerConverter: FirestoreDataConverter<Maker> = {
  toFirestore(maker: WithFieldValue<Maker>): DocumentData {
    return {
      ...maker,
      createdAt: maker.createdAt ? maker.createdAt : serverTimestamp(),
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Maker {
    const data = snapshot.data();
    return maker.parse({ ...data, createdAt: data.createdAt.toDate() });
  },
};

export const member = z.object({
  makerId: z.string(),
  createdAt: z.any(), // TODO(techiejd): Look into firebase schemas and transformations.
});
