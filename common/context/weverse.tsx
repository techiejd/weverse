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

const howToSupport = z.object({
  contact: z.string().max(500).optional(),
  finance: z.string().max(500).optional(),
});
export type HowToSupport = z.infer<typeof howToSupport>;

export const maker = z.object({
  id: z.string().optional(),
  ownerId: z.string(),
  type: makerType,
  pic: formUrl.optional(),
  name: z.string().min(1),
  organizationType: organizationType.optional(),
  createdAt: z.date().optional(),
  howToSupport: howToSupport.optional(),
  about: z.string().min(5).max(1000).optional(),
});
export type Maker = z.infer<typeof maker>;

export const makerConverter: FirestoreDataConverter<Maker> = {
  toFirestore(maker: WithFieldValue<Maker>): DocumentData {
    const { id, ...others } = maker;
    return {
      ...others,
      createdAt: maker.createdAt ? maker.createdAt : serverTimestamp(),
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Maker {
    const data = snapshot.data();
    // anything with serverTimestamp does not exist atm if pending writes.
    return maker.parse({
      ...data,
      id: snapshot.id,
      createdAt: data.createdAt ? data.createdAt.toDate() : undefined,
    });
  },
};

export const member = z.object({
  makerId: z.string(),
  id: z.string().optional(),
  createdAt: z.date().optional(),
});
export type Member = z.infer<typeof member>;

export const memberConverter: FirestoreDataConverter<Member> = {
  toFirestore: (member: WithFieldValue<Member>): DocumentData => {
    const { id, ...others } = member;
    return {
      ...others,
      createdAt: member.createdAt ? member.createdAt : serverTimestamp(),
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Member {
    const { createdAt, ...others } = snapshot.data();
    // anything with serverTimestamp does not exist atm if pending writes.
    return member.parse({
      ...others,
      id: snapshot.id,
      createdAt: createdAt ? createdAt.toDate() : undefined,
    });
  },
};

export const socialProof = z.object({
  id: z.string().optional(),
  rating: z.number(),
  videoUrl: formUrl.optional(),
  byMaker: z.string(),
  forMaker: z.string(),
  forAction: z.string().optional(),
  createdAt: z.date().optional(),
});

export type SocialProof = z.infer<typeof socialProof>;
export const socialProofConverter: FirestoreDataConverter<SocialProof> = {
  toFirestore: (socialProof: WithFieldValue<SocialProof>): DocumentData => {
    const { id, ...others } = socialProof;
    return {
      ...others,
      createdAt: socialProof.createdAt
        ? socialProof.createdAt
        : serverTimestamp(),
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot): SocialProof => {
    const { createdAt, ...others } = snapshot.data();
    // anything with serverTimestamp does not exist atm if pending writes.
    return socialProof.parse({
      ...others,
      id: snapshot.id,
      createdAt: createdAt ? createdAt.toDate() : undefined,
    });
  },
};
